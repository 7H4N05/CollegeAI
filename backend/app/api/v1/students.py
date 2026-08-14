from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from app.core.security import get_current_user_from_header, validate_student_access
from app.schemas.domain import (
    StudentProfile, OverallAttendance, StudentMarksOverview,
    DayTimetable, Examination, Assignment, FeeStructure
)
from app.services.student_service import (
    get_student_profile_data,
    get_student_attendance_data,
    get_student_marks_data,
    get_student_timetable_data,
    get_student_examinations_data,
    get_student_assignments_data,
    get_student_fees_data
)

router = APIRouter(prefix="/students", tags=["Students"])

@router.get("/{student_id}/profile", response_model=StudentProfile)
def get_profile(
    student_id: str,
    user: dict = Depends(get_current_user_from_header)
):
    validate_student_access(user, student_id)
    return get_student_profile_data(student_id)

@router.get("/{student_id}/attendance", response_model=OverallAttendance)
def get_attendance(
    student_id: str,
    user: dict = Depends(get_current_user_from_header)
):
    validate_student_access(user, student_id)
    return get_student_attendance_data(student_id)

@router.get("/{student_id}/marks", response_model=StudentMarksOverview)
def get_marks(
    student_id: str,
    user: dict = Depends(get_current_user_from_header)
):
    validate_student_access(user, student_id)
    return get_student_marks_data(student_id)

@router.get("/{student_id}/timetable", response_model=List[DayTimetable])
def get_timetable(
    student_id: str,
    day: Optional[str] = Query(None, description="Optional day name filter e.g. Monday"),
    user: dict = Depends(get_current_user_from_header)
):
    validate_student_access(user, student_id)
    return get_student_timetable_data(student_id, day)

@router.get("/{student_id}/examinations", response_model=List[Examination])
@router.get("/{student_id}/exams", response_model=List[Examination])
def get_examinations(
    student_id: str,
    user: dict = Depends(get_current_user_from_header)
):
    validate_student_access(user, student_id)
    return get_student_examinations_data(student_id)

@router.get("/{student_id}/assignments", response_model=List[Assignment])
def get_assignments(
    student_id: str,
    user: dict = Depends(get_current_user_from_header)
):
    validate_student_access(user, student_id)
    return get_student_assignments_data(student_id)

@router.get("/{student_id}/fees", response_model=FeeStructure)
def get_fees(
    student_id: str,
    user: dict = Depends(get_current_user_from_header)
):
    validate_student_access(user, student_id)
    return get_student_fees_data(student_id)
