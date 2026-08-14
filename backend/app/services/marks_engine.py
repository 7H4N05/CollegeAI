from typing import Dict, Any, List
from app.models.mock_db import MARKS_DB, STUDENTS_DB
from app.schemas.domain import RequiredMarksResponse

def calculate_required_endsem_marks(student_id: str, subject_code: str, target_final_percentage: float = 80.0) -> RequiredMarksResponse:
    """
    Calculates exact end-semester exam score (out of 60) required to reach target final score %.
    System: Internal weightage = 40 marks, End Semester weightage = 60 marks.
    Total = Internal + EndSem.
    """
    student_id_clean = student_id.upper()
    student_marks_list = MARKS_DB.get(student_id_clean, [])
    
    target_subject = None
    for sub in student_marks_list:
        if sub["subject_code"].upper() == subject_code.upper():
            target_subject = sub
            break
            
    if not target_subject:
        # Default fallback if subject not found in record
        internal_score = 30.0
        sub_name = f"Subject ({subject_code})"
    else:
        internal_score = target_subject.get("total_internal", 30.0)
        sub_name = target_subject.get("subject_name", subject_code)
        
    max_internal = 40.0
    max_endsem = 60.0
    
    # Required endsem score out of 60 to hit target_final_percentage
    # Total percentage = Internal score (out of 40) + EndSem score (out of 60)
    needed_endsem = target_final_percentage - internal_score
    
    if needed_endsem > max_endsem:
        is_achievable = False
        advice = f"Unachievable: Even with a perfect 60/60 in the end semester, your maximum possible score is {internal_score + max_endsem:.1f}%."
        required_marks = round(needed_endsem, 2)
    elif needed_endsem <= 0:
        is_achievable = True
        required_marks = 0.0
        advice = f"Secured: Your current internal score ({internal_score:.1f}/40) already guarantees a total score above {target_final_percentage}%!"
    else:
        is_achievable = True
        required_marks = round(needed_endsem, 2)
        advice = f"To achieve {target_final_percentage}% overall in {sub_name}, you need at least {required_marks:.1f} out of 60 in the end-semester examination."
        
    return RequiredMarksResponse(
        student_id=student_id_clean,
        subject_code=subject_code.upper(),
        subject_name=sub_name,
        current_internal_score=internal_score,
        max_internal=max_internal,
        max_endsem=max_endsem,
        target_final_percentage=target_final_percentage,
        required_endsem_marks=required_marks,
        is_achievable=is_achievable,
        advice=advice
    )
