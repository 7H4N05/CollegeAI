import re
from typing import Dict, Any, List, Optional
from app.core.security import ROLE_STUDENT, ROLE_PARENT, ROLE_ADMIN, validate_student_access
from app.tools.tool_registry import execute_tool
from app.ai.llm_provider import llm_provider
from app.schemas.domain import ChatResponse

class CollegeAIAgent:
    def __init__(self):
        pass

    async def process_user_message(
        self,
        message: str,
        user_context: Dict[str, Any],
        explicit_target_student_id: Optional[str] = None
    ) -> ChatResponse:
        """
        Processes natural language query from student or parent using role validation,
        deterministic backend tool calling, and concise AI summary generation.
        """
        role = user_context.get("role", ROLE_STUDENT)
        user_name = user_context.get("name", "User")
        
        # Determine target student ID
        if role == ROLE_STUDENT:
            target_student_id = user_context.get("student_id", "STU101")
        elif role == ROLE_PARENT:
            authorized = user_context.get("authorized_children", [])
            if explicit_target_student_id and explicit_target_student_id in authorized:
                target_student_id = explicit_target_student_id
            elif authorized:
                target_student_id = authorized[0]
            else:
                target_student_id = "STU101"
        else: # ADMIN
            target_student_id = explicit_target_student_id or "STU101"

        # Security assertion
        validate_student_access(user_context, target_student_id)

        msg_lower = message.lower()
        tools_called = []
        structured_data = {}
        reply_lines = []

        # 1. ATTENDANCE & LEAVE CALCULATIONS
        if any(w in msg_lower for w in ["attendance", "miss", "absent", "leave", "75%", "80%", "reach"]):
            if "leave" in msg_lower or "days" in msg_lower or "next week" in msg_lower:
                # Timetable leave impact query
                tools_called.append("calculate_leave_impact")
                # Default start date tomorrow, end date + 3 days for demo simulation
                start_date = "2026-08-17"
                end_date = "2026-08-19"
                impact_res = execute_tool("calculate_leave_impact", {
                    "student_id": target_student_id,
                    "start_date": start_date,
                    "end_date": end_date
                })
                structured_data["leave_impact"] = impact_res
                
                overall_curr = impact_res.get("current_overall_percentage", 0.0)
                overall_proj = impact_res.get("projected_overall_percentage", 0.0)
                dropping = impact_res.get("subjects_dropping_below_75", [])
                
                if role == ROLE_PARENT:
                    reply_lines.append(f"Here is the leave projection for your child ({target_student_id}):")
                else:
                    reply_lines.append(f"Here is your leave impact projection ({start_date} to {end_date}):")
                    
                reply_lines.append(f"• Current overall attendance: {overall_curr}%")
                reply_lines.append(f"• Projected overall attendance after leave: {overall_proj}%")
                
                if dropping:
                    reply_lines.append(f"⚠️ WARNING: Attendance will fall below 75% in: {', '.join(dropping)}.")
                    reply_lines.append(f"Recommendation: {impact_res.get('recommendation')}")
                else:
                    reply_lines.append(f"✅ SAFE: Attendance will remain above the required 75% threshold in all subjects.")
            else:
                # Regular attendance & capacity metrics
                tools_called.append("get_attendance")
                att_res = execute_tool("get_attendance", {"student_id": target_student_id})
                structured_data["attendance"] = att_res
                
                overall_pct = att_res.get("overall_percentage", 0.0)
                max_missable = att_res.get("max_missable_classes_75", 0)
                needed_80 = att_res.get("classes_needed_80", 0)
                subjects = att_res.get("subjects", [])
                
                if role == ROLE_PARENT:
                    reply_lines.append(f"Your child ({target_student_id}) has an overall attendance of **{overall_pct}%** ({att_res.get('status')}).")
                else:
                    reply_lines.append(f"Your current overall attendance is **{overall_pct}%** ({att_res.get('status')}).")
                    
                reply_lines.append(f"• Classes you can miss while maintaining >= 75%: **{max_missable} classes**")
                
                if overall_pct < 80.0:
                    reply_lines.append(f"• Consecutive classes needed to reach 80%: **{needed_80} classes**")
                else:
                    reply_lines.append(f"• Goal status: Attendance is already above 80%!")
                    
                reply_lines.append("\nSubject Breakdown:")
                for s in subjects:
                    reply_lines.append(f"- {s['subject_name']} ({s['subject_code']}): {s['percentage']}% ({s['attended']}/{s['conducted']})")

        # 2. EXAMINATIONS
        elif any(w in msg_lower for w in ["exam", "examination", "schedule", "test", "midterm", "mid term"]):
            tools_called.append("get_examinations")
            exam_res = execute_tool("get_examinations", {"student_id": target_student_id})
            structured_data["examinations"] = exam_res
            
            if not exam_res:
                reply_lines.append(f"No upcoming examinations scheduled for student {target_student_id}.")
            else:
                reply_lines.append(f"Upcoming Examinations for {target_student_id}:")
                for ex in exam_res:
                    reply_lines.append(f"• **{ex['subject_name']}** ({ex['exam_type']}): {ex['date']} at {ex['time']} in Room {ex['room']}")

        # 3. MARKS & TARGET SCORES
        elif any(w in msg_lower for w in ["mark", "internal", "score", "grade", "target", "cgpa", "endsem", "end sem"]):
            tools_called.append("get_marks")
            marks_res = execute_tool("get_marks", {"student_id": target_student_id})
            structured_data["marks"] = marks_res
            
            cgpa = marks_res.get("cgpa", 0.0)
            marks_list = marks_res.get("marks", [])
            
            reply_lines.append(f"Academic Marks Overview (Current CGPA: **{cgpa}**):")
            for m in marks_list:
                reply_lines.append(f"• **{m['subject_name']}**: Internal Score = {m['total_internal']}/40 ({m['current_percentage']}%)")
                reply_lines.append(f"  - Target Grade A (80%): Needs **{m['target_endsem_needed_for_A']} / 60** in end-semester exam")

        # 4. ASSIGNMENTS
        elif any(w in msg_lower for w in ["assignment", "homework", "lab report", "pending assignment", "due"]):
            tools_called.append("get_assignments")
            asg_res = execute_tool("get_assignments", {"student_id": target_student_id})
            structured_data["assignments"] = asg_res
            
            pending = [a for a in asg_res if a["status"] == "PENDING"]
            if not pending:
                reply_lines.append("🎉 All assignments are up to date! No pending assignments.")
            else:
                reply_lines.append(f"Pending Assignments for {target_student_id}:")
                for a in pending:
                    reply_lines.append(f"• **{a['title']}** ({a['subject_name']}) - Due Date: **{a['due_date']}**")

        # 5. FEES
        elif any(w in msg_lower for w in ["fee", "dues", "payment", "tuition", "pending fee", "balance"]):
            tools_called.append("get_fees")
            fee_res = execute_tool("get_fees", {"student_id": target_student_id})
            structured_data["fees"] = fee_res
            
            pending_total = fee_res.get("total_pending_fee", 0.0)
            if pending_total == 0.0:
                reply_lines.append(f"✅ Fee Status: Fully Paid. No pending dues for student {target_student_id}.")
            else:
                reply_lines.append(f"💳 Pending Fee Statement for Student {target_student_id}:")
                reply_lines.append(f"• Total Pending Balance: **₹{pending_total:,.2f}**")
                reply_lines.append(f"• Tuition Fee Pending: ₹{fee_res.get('tuition_fee_pending', 0.0):,.2f}")
                if fee_res.get('hostel_fee_pending', 0.0) > 0:
                    reply_lines.append(f"• Hostel Fee Pending: ₹{fee_res.get('hostel_fee_pending'):,.2f}")
                reply_lines.append(f"• Due Date: **{fee_res.get('due_date')}**")

        # 6. ANNOUNCEMENTS
        elif any(w in msg_lower for w in ["announcement", "notice", "circular", "news"]):
            tools_called.append("get_announcements")
            anc_res = execute_tool("get_announcements", {"target_role": role})
            structured_data["announcements"] = anc_res
            
            reply_lines.append("📢 Official College Announcements:")
            for a in anc_res:
                flag = "🔴 IMPORTANT: " if a.get("important") else "• "
                reply_lines.append(f"{flag}**{a['title']}** ({a['date']})\n  {a['content']}")

        # 7. DEFAULT PROFILE & OVERVIEW
        else:
            tools_called.append("get_student_profile")
            profile_res = execute_tool("get_student_profile", {"student_id": target_student_id})
            structured_data["profile"] = profile_res
            
            reply_lines.append(f"Hello {user_name}! I am **CollegeAI**, your personalized college companion.")
            reply_lines.append(f"I have retrieved academic records for **{profile_res['name']}** (Roll: {profile_res['roll_number']}, Branch: {profile_res['branch']}, Sem: {profile_res['semester']}).")
            reply_lines.append("\nYou can ask me questions such as:")
            reply_lines.append("• *'What is my current attendance?'*")
            reply_lines.append("• *'How many classes can I miss while staying above 75%?'*")
            reply_lines.append("• *'If I take 3 days leave next week, which subjects will fall below 75%?'*")
            reply_lines.append("• *'What exams do I have next week?'*")
            reply_lines.append("• *'What marks do I need in end semester for Grade A?'*")
            reply_lines.append("• *'How much fee is pending?'*")

        reply_text = "\n".join(reply_lines)

        return ChatResponse(
            reply=reply_text,
            user_role=role,
            student_id=target_student_id,
            intent_detected=tools_called[0] if tools_called else "general",
            tools_called=tools_called,
            structured_data=structured_data
        )

ai_agent = CollegeAIAgent()
