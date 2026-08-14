import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database.connection import get_db
from database.models import User
from database.repositories import AcademicRepository
from backend.app.auth.security import get_current_user, verify_student_access
from backend.app.services.attendance_service import AttendanceCalculator
from backend.app.services.marks_service import MarksCalculator

router = APIRouter(prefix="/api/v1/calculations", tags=["Deterministic Calculations Engine"])

class LeaveCapacityRequest(BaseModel):
    student_id: str
    target_threshold: float = 75.0

class RequiredClassesRequest(BaseModel):
    student_id: str
    target_threshold: float = 80.0

class LeaveProjectionRequest(BaseModel):
    student_id: str
    start_date: str  # YYYY-MM-DD
    end_date: str    # YYYY-MM-DD
    target_threshold: float = 75.0

class RequiredMarksRequest(BaseModel):
    student_id: str
    subject_id: str
    target_overall_percentage: float = 80.0

@router.post("/leave-capacity")
def calculate_leave_capacity(
    request: LeaveCapacityRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Calculates how many classes a student can miss while maintaining target attendance percentage (default 75%)."""
    verify_student_access(current_user, request.student_id, db)
    academic_repo = AcademicRepository(db)
    summary = academic_repo.get_attendance_summary(request.student_id)

    attended = summary["overall_attended"]
    conducted = summary["overall_conducted"]

    result = AttendanceCalculator.calculate_leave_capacity(
        attended=attended,
        conducted=conducted,
        target_threshold=request.target_threshold
    )
    result["student_id"] = request.student_id
    return result

@router.post("/required-classes")
def calculate_required_classes(
    request: RequiredClassesRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Calculates how many consecutive classes must be attended to reach target attendance percentage (default 80%)."""
    verify_student_access(current_user, request.student_id, db)
    academic_repo = AcademicRepository(db)
    summary = academic_repo.get_attendance_summary(request.student_id)

    attended = summary["overall_attended"]
    conducted = summary["overall_conducted"]

    result = AttendanceCalculator.calculate_required_classes(
        attended=attended,
        conducted=conducted,
        target_threshold=request.target_threshold
    )
    result["student_id"] = request.student_id
    return result

@router.post("/project-leave")
def project_leave(
    request: LeaveProjectionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Calculates timetable-aware attendance impact of taking leave between start_date and end_date."""
    verify_student_access(current_user, request.student_id, db)
    try:
        start_d = datetime.date.fromisoformat(request.start_date)
        end_d = datetime.date.fromisoformat(request.end_date)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")

    if start_d > end_d:
        raise HTTPException(status_code=400, detail="start_date cannot be after end_date")

    return AttendanceCalculator.project_leave_impact(
        db=db,
        student_id=request.student_id,
        start_date=start_d,
        end_date=end_d,
        target_threshold=request.target_threshold
    )

@router.post("/required-marks")
def calculate_required_marks(
    request: RequiredMarksRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Calculates required end-semester marks to achieve target overall subject percentage / grade."""
    verify_student_access(current_user, request.student_id, db)
    return MarksCalculator.calculate_subject_required_marks(
        db=db,
        student_id=request.student_id,
        subject_id=request.subject_id,
        target_overall_pct=request.target_overall_percentage
    )
