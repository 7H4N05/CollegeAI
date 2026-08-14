import re
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
from app.core.security import ROLE_STUDENT, ROLE_PARENT, ROLE_ADMIN, validate_student_access
from app.tools.tool_registry import execute_tool
from app.ai.llm_provider import llm_provider
from app.schemas.domain import ChatResponse

def parse_leave_days_from_message(message: str) -> int:
    """
    Parses exact number of leave days requested in user natural language prompt.
    Supports float decimals: '0.3 months' -> 9 days, '0.5 weeks' -> 4 days, '1.5 weeks' -> 11 days.
    """
    msg = message.lower()
    
    # 1. Float Month Match: "0.3 months", "0.5 month", "1.5 months", "1 month"
    month_match = re.search(r'(\d+(?:\.\d+)?|one|two|three|four|a|an)\s*months?', msg)
    if month_match:
        val_str = month_match.group(1)
        w_map = {"one": 1.0, "a": 1.0, "an": 1.0, "two": 2.0, "three": 3.0, "four": 4.0}
        n_months = w_map.get(val_str, 1.0)
        try:
            n_months = float(val_str)
        except ValueError:
            pass
        return max(1, int(round(n_months * 30.0)))

    # 2. Float Week Match: "0.5 weeks", "1.5 week", "2 weeks", "one week"
    week_match = re.search(r'(\d+(?:\.\d+)?|one|two|three|four|a|an)\s*weeks?', msg)
    if week_match:
        val_str = week_match.group(1)
        w_map = {"one": 1.0, "a": 1.0, "an": 1.0, "two": 2.0, "three": 3.0, "four": 4.0}
        n_weeks = w_map.get(val_str, 1.0)
        try:
            n_weeks = float(val_str)
        except ValueError:
            pass
        return max(1, int(round(n_weeks * 7.0)))

    # 3. Explicit Digits / Floats + Days/Leaves: "100 days", "5 day", "2.5 days", "1 leave"
    digit_match = re.search(r'(\d+(?:\.\d+)?)\s*(days?|leaves?|off)?', msg)
    if digit_match:
        try:
            val = float(digit_match.group(1))
            if val > 0:
                return max(1, int(round(val)))
        except ValueError:
            pass

    # 4. Check for Word Numbers + Days/Leaves (Priority 4) e.g. "one day", "two days", "three days"
    word_days = {
        "one day": 1, "one leave": 1, "a day": 1,
        "two days": 2, "two day": 2, "two leaves": 2,
        "three days": 3, "three day": 3, "three leaves": 3,
        "four days": 4, "five days": 5, "six days": 6,
        "seven days": 7, "ten days": 10
    }
    for phrase, n in word_days.items():
        if phrase in msg:
            return n

    # Default fallback if unstated
    return 5

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
        deterministic backend tool calling, and concise human-friendly AI summary generation.
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

        # Check if user is asking for OPTIMAL / BEST period to take leave
        is_best_period_query = any(phrase in msg_lower for phrase in [
            "best period", "best time", "minimum attendance", "lose minimum",
            "least drop", "optimal leave", "optimal period", "when should i take",
            "which period", "best 5 days", "best 3 days", "best 2 days", "which days"
        ])

        # 1. ATTENDANCE & LEAVE CALCULATIONS
        if is_best_period_query:
            # Smart Leave Optimization Engine
            tools_called.append("find_optimal_leave_period")
            num_days = parse_leave_days_from_message(message)
            opt_res = execute_tool("find_optimal_leave_period", {
                "student_id": target_student_id,
                "num_days": num_days
            })
            structured_data["optimal_leave"] = opt_res
            
            best_win = opt_res.get("best_window", {})
            worst_win = opt_res.get("worst_window", {})
            
            day_label = f"{num_days} day" if num_days == 1 else f"{num_days} days"
            
            reply_lines.append(f"Hello {user_name}! Here is the smart timetable analysis to find the **best period for {day_label} leave** with minimum attendance loss:\n")
            
            reply_lines.append(f"🌟 *Optimal Recommended Leave Window:*")
            reply_lines.append(f"📅 **{best_win.get('start_date')} ({best_win.get('start_day_name')}) to {best_win.get('end_date')} ({best_win.get('end_day_name')})**")
            reply_lines.append(f"• Classes affected during this window: **{best_win.get('classes_affected')} classes only**")
            reply_lines.append(f"• Projected Attendance after leave: **{best_win.get('projected_percentage')}%** (SAFE)")
            
            if best_win.get("dropping_subjects"):
                reply_lines.append(f"• Caution: Drops below 75% in: {', '.join(best_win.get('dropping_subjects'))}")
            else:
                reply_lines.append(f"• Result: Zero subjects drop below the 75% threshold!")
                
            reply_lines.append(f"\n❌ *Worst Period to Avoid:*")
            reply_lines.append(f"📅 **{worst_win.get('start_date')} ({worst_win.get('start_day_name')}) to {worst_win.get('end_date')} ({worst_win.get('end_day_name')})**")
            reply_lines.append(f"• Heavy schedule with **{worst_win.get('classes_affected')} classes** scheduled. Attendance drops to **{worst_win.get('projected_percentage')}%**.")
            
            reply_lines.append(f"\n💡 *Advisor Recommendation:* Taking leave from {best_win.get('start_date')} to {best_win.get('end_date')} will minimize your attendance loss and protect your academic standing!")

        elif any(w in msg_lower for w in ["attendance", "miss", "absent", "leave", "day", "days", "week", "weeks", "month", "months", "75%", "80%", "reach"]):
            if any(w in msg_lower for w in ["leave", "days", "day", "week", "weeks", "month", "months", "off", "next week", "absent"]):
                # Dynamic Leave impact calculation
                tools_called.append("calculate_leave_impact")
                
                num_days = parse_leave_days_from_message(message)
                start_dt = datetime.now() + timedelta(days=1)
                end_dt = start_dt + timedelta(days=num_days - 1)
                start_date = start_dt.strftime("%Y-%m-%d")
                end_date = end_dt.strftime("%Y-%m-%d")

                impact_res = execute_tool("calculate_leave_impact", {
                    "student_id": target_student_id,
                    "start_date": start_date,
                    "end_date": end_date
                })
                structured_data["leave_impact"] = impact_res
                
                overall_curr = impact_res.get("current_overall_percentage", 0.0)
                overall_proj = impact_res.get("projected_overall_percentage", 0.0)
                dropping = impact_res.get("subjects_dropping_below_75", [])
                
                if num_days >= 30:
                    time_label = f"{num_days // 30} month ({num_days} days)" if num_days == 30 else f"{num_days // 30} months ({num_days} days)"
                elif num_days >= 7 and num_days % 7 == 0:
                    time_label = f"{num_days // 7} week ({num_days} days)" if num_days == 7 else f"{num_days // 7} weeks ({num_days} days)"
                else:
                    time_label = f"{num_days} day" if num_days == 1 else f"{num_days} days"

                if role == ROLE_PARENT:
                    reply_lines.append(f"Hello {user_name}! Here is the leave impact analysis for your child for **{time_label} leave** ({start_date} to {end_date}):")
                else:
                    reply_lines.append(f"Hello {user_name.split()[0]}! Here is your leave impact projection for **{time_label} leave** ({start_date} to {end_date}):")
                    
                reply_lines.append(f"\n📊 *Current Overall Attendance:* {overall_curr}%")
                reply_lines.append(f"📉 *Projected Attendance after leave:* {overall_proj}%\n")
                
                if dropping:
                    reply_lines.append(f"⚠️ *Warning:* Taking {time_label} leave will drop attendance below 75% in:\n• {', '.join(dropping)}")
                    reply_lines.append(f"\n💡 *Advisor Recommendation:* {impact_res.get('recommendation', 'Attending key lab sessions before taking leave will keep attendance safe.')}")
                else:
                    reply_lines.append(f"✅ *Safe:* Attendance will remain comfortably above the required 75% threshold across all subjects for {time_label} of leave!")
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
                    reply_lines.append(f"Hello {user_name}! Here is the current academic attendance record for your child:\n")
                    reply_lines.append(f"Overall Attendance is **{overall_pct}%** ({att_res.get('status', 'SAFE')}).")
                else:
                    reply_lines.append(f"Hello {user_name.split()[0]}! Your current overall attendance is **{overall_pct}%** ({att_res.get('status', 'SAFE')}).\n")
                    
                reply_lines.append(f"• Classes that can be missed safely (above 75%): **{max_missable} classes**")
                
                if overall_pct < 80.0:
                    reply_lines.append(f"• Consecutive classes needed to reach 80%: **{needed_80} classes**")
                else:
                    reply_lines.append(f"• Goal Status: Great job! Attendance is already above 80%.")
                    
                reply_lines.append("\n📚 *Subject Breakdown:*")
                for s in subjects:
                    status_flag = "✅" if s['percentage'] >= 75 else "⚠️"
                    reply_lines.append(f"{status_flag} *{s['subject_name']}*: **{s['percentage']}%** ({s['attended']}/{s['conducted']} classes)")

        # 2. EXAMINATIONS
        elif any(w in msg_lower for w in ["exam", "examination", "schedule", "test", "midterm", "mid term"]):
            tools_called.append("get_examinations")
            exam_res = execute_tool("get_examinations", {"student_id": target_student_id})
            structured_data["examinations"] = exam_res
            
            if not exam_res:
                reply_lines.append(f"Hello {user_name}! There are currently no upcoming examinations scheduled in the ERP database.")
            else:
                reply_lines.append(f"Hello {user_name}! Here is the upcoming examination timetable:\n")
                for ex in exam_res:
                    reply_lines.append(f"📝 *{ex['subject_name']}* ({ex['exam_type']})\n   📅 Date: {ex['date']} at {ex['time']} | 📍 Venue: Room {ex['room']}\n")

        # 3. MARKS & TARGET SCORES
        elif any(w in msg_lower for w in ["mark", "internal", "score", "grade", "target", "cgpa", "endsem", "end sem"]):
            tools_called.append("get_marks")
            marks_res = execute_tool("get_marks", {"student_id": target_student_id})
            structured_data["marks"] = marks_res
            
            cgpa = marks_res.get("cgpa", 0.0)
            marks_list = marks_res.get("marks", [])
            
            reply_lines.append(f"Hello {user_name}! Academic marks summary (Current CGPA: **{cgpa}**):\n")
            for m in marks_list:
                reply_lines.append(f"🎓 *{m['subject_name']}*")
                reply_lines.append(f"   Internal Score: **{m['total_internal']}/40** ({m['current_percentage']}%)")
                reply_lines.append(f"   To score Grade A (80%+): Needs **{m['target_endsem_needed_for_A']}/60** in end-sem exam\n")

        # 4. ASSIGNMENTS
        elif any(w in msg_lower for w in ["assignment", "homework", "lab report", "pending assignment", "due"]):
            tools_called.append("get_assignments")
            asg_res = execute_tool("get_assignments", {"student_id": target_student_id})
            structured_data["assignments"] = asg_res
            
            pending = [a for a in asg_res if a["status"] == "PENDING"]
            if not pending:
                reply_lines.append(f"🎉 Great news {user_name}! All assignments are submitted and up to date.")
            else:
                reply_lines.append(f"Hello {user_name}! Here are the pending course assignments:\n")
                for a in pending:
                    reply_lines.append(f"📌 *{a['title']}* ({a['subject_name']})\n   📅 Due Date: **{a['due_date']}**\n")

        # 5. FEES
        elif any(w in msg_lower for w in ["fee", "dues", "payment", "tuition", "pending fee", "balance"]):
            tools_called.append("get_fees")
            fee_res = execute_tool("get_fees", {"student_id": target_student_id})
            structured_data["fees"] = fee_res
            
            pending_total = fee_res.get("total_pending_fee", 0.0)
            if pending_total == 0.0:
                reply_lines.append(f"✅ Hello {user_name}! Fee status is fully clear. There are no pending fee dues.")
            else:
                reply_lines.append(f"💳 Hello {user_name}! Here is the financial dues statement:\n")
                reply_lines.append(f"• Total Pending Dues: **₹{pending_total:,.2f}**")
                reply_lines.append(f"• Tuition Fee Pending: ₹{fee_res.get('tuition_fee_pending', 0.0):,.2f}")
                if fee_res.get('hostel_fee_pending', 0.0) > 0:
                    reply_lines.append(f"• Hostel Fee Pending: ₹{fee_res.get('hostel_fee_pending'):,.2f}")
                reply_lines.append(f"• Payment Due Date: **{fee_res.get('due_date')}**")

        # 6. ANNOUNCEMENTS
        elif any(w in msg_lower for w in ["announcement", "notice", "circular", "news"]):
            tools_called.append("get_announcements")
            anc_res = execute_tool("get_announcements", {"target_role": role})
            structured_data["announcements"] = anc_res
            
            reply_lines.append("📢 *Official Campus Notices:*\n")
            for a in anc_res:
                flag = "🔴 *IMPORTANT:* " if a.get("important") else "• "
                reply_lines.append(f"{flag}*{a['title']}* ({a['date']})\n  {a['content']}\n")

        # 7. DEFAULT PROFILE & OVERVIEW
        else:
            tools_called.append("get_student_profile")
            profile_res = execute_tool("get_student_profile", {"student_id": target_student_id})
            structured_data["profile"] = profile_res
            
            reply_lines.append(f"Hello {user_name}! I am **CollegeAI**, your academic ERP assistant.")
            reply_lines.append(f"I have connected to records for **{profile_res['name']}** (Roll: {profile_res['roll_number']}, Branch: {profile_res['branch']}).")
            reply_lines.append("\nYou can ask me questions like:")
            reply_lines.append("• *'What is my current attendance?'*")
            reply_lines.append("• *'How many classes can I miss?'*")
            reply_lines.append("• *'If I take 3 days leave next week...' *")
            reply_lines.append("• *'Show pending fee statement'*")

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
