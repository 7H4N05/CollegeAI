from typing import Dict, Any, List
from app.models.mock_db import USERS_DB, STUDENTS_DB
from app.schemas.domain import StudentProfile
from app.services.student_service import (
    normalize_student_id,
    get_student_attendance_data,
    get_student_examinations_data,
    get_student_fees_data,
    get_student_marks_data
)

def get_parent_children(parent_user_id: str) -> List[StudentProfile]:
    parent_user = None
    for u in USERS_DB.values():
        if u["user_id"] == parent_user_id or u["username"] == parent_user_id:
            parent_user = u
            break
            
    if not parent_user or parent_user["role"] != "PARENT":
        # Fallback to parent2 or parent1 if unknown
        parent_user = USERS_DB.get("parent2") or USERS_DB.get("parent1")
        
    children_profiles = []
    if parent_user:
        for child_id in parent_user.get("authorized_children", []):
            target_id = normalize_student_id(child_id)
            st = STUDENTS_DB.get(target_id)
            if st:
                children_profiles.append(StudentProfile(**st))
                
    if not children_profiles:
        st = list(STUDENTS_DB.values())[0]
        children_profiles.append(StudentProfile(**st))
        
    return children_profiles

def get_child_academic_summary(student_id: str) -> Dict[str, Any]:
    target_id = normalize_student_id(student_id)
    attendance = get_student_attendance_data(target_id)
    exams = get_student_examinations_data(target_id)
    fees = get_student_fees_data(target_id)
    marks = get_student_marks_data(target_id)
    
    return {
        "student_id": target_id,
        "attendance_overall_percentage": attendance.overall_percentage,
        "attendance_status": attendance.status,
        "pending_fee": fees.total_pending_fee,
        "fee_status": fees.status,
        "upcoming_exams_count": len(exams),
        "cgpa": marks.cgpa
    }
