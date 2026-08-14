from fastapi import APIRouter, Depends
from app.core.security import get_current_user_from_header, validate_student_access
from app.schemas.domain import (
    AttendanceCalcRequest, AttendanceCalcResponse,
    LeaveImpactRequest, LeaveImpactResponse,
    RequiredMarksRequest, RequiredMarksResponse
)
from app.services.attendance_engine import (
    calculate_attendance_metrics,
    calculate_leave_impact_for_dates
)
from app.services.marks_engine import calculate_required_endsem_marks

router = APIRouter(prefix="/calculations", tags=["Calculation Engine"])

@router.post("/attendance", response_model=AttendanceCalcResponse)
def calculate_attendance(payload: AttendanceCalcRequest):
    """
    Deterministically calculates attendance percentage, max leave capacity, and classes needed.
    """
    return calculate_attendance_metrics(
        attended=payload.attended,
        conducted=payload.conducted,
        target_pct=payload.target_percentage
    )

@router.post("/leave-impact", response_model=LeaveImpactResponse)
def calculate_leave_impact(
    payload: LeaveImpactRequest,
    user: dict = Depends(get_current_user_from_header)
):
    """
    Calculates timetable-based leave impact on student attendance.
    """
    validate_student_access(user, payload.student_id)
    return calculate_leave_impact_for_dates(
        student_id=payload.student_id,
        start_date_str=payload.start_date,
        end_date_str=payload.end_date
    )

@router.post("/required-marks", response_model=RequiredMarksResponse)
def calculate_required_marks(
    payload: RequiredMarksRequest,
    user: dict = Depends(get_current_user_from_header)
):
    """
    Calculates end-semester exam score (out of 60) needed to achieve target percentage.
    """
    validate_student_access(user, payload.student_id)
    return calculate_required_endsem_marks(
        student_id=payload.student_id,
        subject_code=payload.subject_code,
        target_final_percentage=payload.target_final_percentage
    )
