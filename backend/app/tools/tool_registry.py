from typing import Dict, Any, Callable, List
from app.services.student_service import (
    get_student_profile_data,
    get_student_attendance_data,
    get_student_marks_data,
    get_student_timetable_data,
    get_student_examinations_data,
    get_student_assignments_data,
    get_student_fees_data
)
from app.services.attendance_engine import (
    calculate_attendance_metrics,
    calculate_leave_impact_for_dates
)
from app.services.marks_engine import calculate_required_endsem_marks
from app.services.announcement_service import get_announcements_data

# Function schemas formatted for LLM function calling / tools array
AI_TOOLS_DEFINITIONS = [
    {
        "name": "get_student_profile",
        "description": "Retrieves official profile information for a student including name, branch, semester, CGPA, and contact info.",
        "parameters": {
            "type": "object",
            "properties": {
                "student_id": {"type": "string", "description": "Student ID e.g. STU101"}
            },
            "required": ["student_id"]
        }
    },
    {
        "name": "get_attendance",
        "description": "Retrieves current attendance records by subject and overall attendance percentage.",
        "parameters": {
            "type": "object",
            "properties": {
                "student_id": {"type": "string", "description": "Student ID e.g. STU101"}
            },
            "required": ["student_id"]
        }
    },
    {
        "name": "calculate_attendance_metrics",
        "description": "Calculates attendance metrics, maximum leave capacity to maintain 75%, and classes needed to reach 80%.",
        "parameters": {
            "type": "object",
            "properties": {
                "attended": {"type": "integer", "description": "Classes attended"},
                "conducted": {"type": "integer", "description": "Classes conducted"},
                "target_pct": {"type": "number", "description": "Target percentage, default 75.0"}
            },
            "required": ["attended", "conducted"]
        }
    },
    {
        "name": "calculate_leave_impact",
        "description": "Calculates timetable-based impact of planned leave on subject attendance and highlights subjects dropping below 75%.",
        "parameters": {
            "type": "object",
            "properties": {
                "student_id": {"type": "string", "description": "Student ID e.g. STU101"},
                "start_date": {"type": "string", "description": "Start date YYYY-MM-DD"},
                "end_date": {"type": "string", "description": "End date YYYY-MM-DD"}
            },
            "required": ["student_id", "start_date", "end_date"]
        }
    },
    {
        "name": "get_marks",
        "description": "Retrieves internal marks, assignment scores, total internal score out of 40, and CGPA.",
        "parameters": {
            "type": "object",
            "properties": {
                "student_id": {"type": "string", "description": "Student ID e.g. STU101"}
            },
            "required": ["student_id"]
        }
    },
    {
        "name": "calculate_required_endsem_marks",
        "description": "Calculates end-semester exam score (out of 60) required to reach a target percentage or grade.",
        "parameters": {
            "type": "object",
            "properties": {
                "student_id": {"type": "string", "description": "Student ID e.g. STU101"},
                "subject_code": {"type": "string", "description": "Subject code e.g. CS601"},
                "target_final_percentage": {"type": "number", "description": "Target score percentage e.g. 80.0"}
            },
            "required": ["student_id", "subject_code"]
        }
    },
    {
        "name": "get_timetable",
        "description": "Retrieves class schedule and timetable.",
        "parameters": {
            "type": "object",
            "properties": {
                "student_id": {"type": "string", "description": "Student ID e.g. STU101"},
                "day_filter": {"type": "string", "description": "Optional day name e.g. Monday"}
            },
            "required": ["student_id"]
        }
    },
    {
        "name": "get_examinations",
        "description": "Retrieves upcoming mid-term and end-semester examination dates, times, and venues.",
        "parameters": {
            "type": "object",
            "properties": {
                "student_id": {"type": "string", "description": "Student ID e.g. STU101"}
            },
            "required": ["student_id"]
        }
    },
    {
        "name": "get_assignments",
        "description": "Retrieves pending and submitted homework/lab assignments and due dates.",
        "parameters": {
            "type": "object",
            "properties": {
                "student_id": {"type": "string", "description": "Student ID e.g. STU101"}
            },
            "required": ["student_id"]
        }
    },
    {
        "name": "get_fees",
        "description": "Retrieves tuition/hostel fee status, total paid, pending balance, and due date.",
        "parameters": {
            "type": "object",
            "properties": {
                "student_id": {"type": "string", "description": "Student ID e.g. STU101"}
            },
            "required": ["student_id"]
        }
    },
    {
        "name": "get_announcements",
        "description": "Retrieves official college notices, exam schedules, and circulars.",
        "parameters": {
            "type": "object",
            "properties": {
                "target_role": {"type": "string", "description": "Filter by target role: ALL, STUDENT, PARENT"}
            },
            "required": []
        }
    }
]

def execute_tool(tool_name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
    """
    Executes tool function deterministically and returns structured result.
    """
    try:
        if tool_name == "get_student_profile":
            res = get_student_profile_data(arguments["student_id"])
            return res.model_dump()
            
        elif tool_name == "get_attendance":
            res = get_student_attendance_data(arguments["student_id"])
            return res.model_dump()
            
        elif tool_name == "calculate_attendance_metrics":
            attended = arguments["attended"]
            conducted = arguments["conducted"]
            target_pct = arguments.get("target_pct", 75.0)
            res = calculate_attendance_metrics(attended, conducted, target_pct)
            return res.model_dump()
            
        elif tool_name == "calculate_leave_impact":
            res = calculate_leave_impact_for_dates(
                arguments["student_id"],
                arguments["start_date"],
                arguments["end_date"]
            )
            return res.model_dump()
            
        elif tool_name == "get_marks":
            res = get_student_marks_data(arguments["student_id"])
            return res.model_dump()
            
        elif tool_name == "calculate_required_endsem_marks":
            res = calculate_required_endsem_marks(
                arguments["student_id"],
                arguments["subject_code"],
                arguments.get("target_final_percentage", 80.0)
            )
            return res.model_dump()
            
        elif tool_name == "get_timetable":
            res = get_student_timetable_data(arguments["student_id"], arguments.get("day_filter"))
            return [d.model_dump() for d in res]
            
        elif tool_name == "get_examinations":
            res = get_student_examinations_data(arguments["student_id"])
            return [e.model_dump() for e in res]
            
        elif tool_name == "get_assignments":
            res = get_student_assignments_data(arguments["student_id"])
            return [a.model_dump() for a in res]
            
        elif tool_name == "get_fees":
            res = get_student_fees_data(arguments["student_id"])
            return res.model_dump()
            
        elif tool_name == "find_optimal_leave_period":
            from app.services.attendance_engine import find_optimal_leave_period
            return find_optimal_leave_period(
                arguments["student_id"],
                arguments.get("num_days", 5)
            )
            
        elif tool_name == "get_announcements":
            res = get_announcements_data(arguments.get("target_role", "ALL"))
            return [a.model_dump() for a in res]
            
        else:
            return {"error": f"Unknown tool: '{tool_name}'"}
            
    except Exception as e:
        return {"error": str(e)}
