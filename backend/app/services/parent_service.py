from typing import Dict, Any, List
from app.models.mock_db import USERS_DB, STUDENTS_DB
from app.schemas.domain import StudentProfile
from app.services.student_service import (
    get_student_attendance_data,
    get_student_examinations_data,
    get_student_fees_data,
    get_student_marks_data
)

def get_parent_children(parent_user_id: str) -> List[StudentProfile]:
    # Find parent record
    parent_user = None
    for u in USERS_DB.values():
        if u["user_id"] == parent_user_id or u["username"] == parent_user_id:
            parent_user = u
            break
            
    if not parent_user or parent_user["role"] != "PARENT":
        return []
        
    children_profiles = []
    for child_id in parent_user.get("authorized_children", []):
        st = STUDENTS_DB.get(child_id)
        if st:
            children_profiles.append(StudentProfile(**st))
            
    return children_profiles

def get_child_academic_summary(student_id: str) -> Dict[str, Any]:
    attendance = get_student_attendance_data(student_id)
    exams = get_student_examinations_data(student_id)
    fees = get_student_fees_data(student_id)
    marks = get_student_marks_data(student_id)
    
    return {
        "student_id": student_id,
        "attendance_overall_percentage": attendance.overall_percentage,
        "attendance_status": attendance.status,
        "pending_fee": fees.total_pending_fee,
        "fee_status": fees.status,
        "upcoming_exams_count": len(exams),
        "cgpa": marks.cgpa
    }
