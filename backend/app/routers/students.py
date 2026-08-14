from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database.connection import get_db
from database.models import User, UserRole
from database.repositories import StudentRepository, AcademicRepository, FeeRepository
from backend.app.auth.security import get_current_user, verify_student_access

router = APIRouter(prefix="/api/v1/students", tags=["Student Profile & Academic Data"])

@router.get("/me")
def get_my_student_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Helper endpoint to fetch profile of logged-in student or parent's primary child."""
    student_repo = StudentRepository(db)
    
    if current_user.role == UserRole.STUDENT:
        student = student_repo.get_by_user_id(current_user.id)
        if not student:
            raise HTTPException(status_code=404, detail="Student profile not found")
        return student_repo.get_profile_data(student.id)

    elif current_user.role == UserRole.PARENT:
        from database.repositories import ParentRepository
        parent_repo = ParentRepository(db)
        parent = parent_repo.get_by_user_id(current_user.id)
        if not parent:
            raise HTTPException(status_code=404, detail="Parent profile not found")
        child_ids = parent_repo.get_authorized_student_ids(parent.id)
        if not child_ids:
            raise HTTPException(status_code=404, detail="No authorized children linked to parent")
        return student_repo.get_profile_data(child_ids[0])

    else:
        raise HTTPException(status_code=400, detail="Must specify student_id for admin user")

@router.get("/{student_id}/profile")
def get_student_profile(
    student_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Fetches student profile with role-based security validation."""
    verify_student_access(current_user, student_id, db)
    student_repo = StudentRepository(db)
    profile = student_repo.get_profile_data(student_id)
    if not profile:
        raise HTTPException(status_code=404, detail=f"Student ID '{student_id}' not found")
    return profile

@router.get("/{student_id}/attendance")
def get_student_attendance(
    student_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Fetches student attendance statistics and subject-wise breakdown with security validation."""
    verify_student_access(current_user, student_id, db)
    academic_repo = AcademicRepository(db)
    return academic_repo.get_attendance_summary(student_id)

@router.get("/{student_id}/marks")
def get_student_marks(
    student_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Fetches student internal & assignment marks with security validation."""
    verify_student_access(current_user, student_id, db)
    academic_repo = AcademicRepository(db)
    return {
        "student_id": student_id,
        "marks": academic_repo.get_marks(student_id)
    }

@router.get("/{student_id}/timetable")
def get_student_timetable(
    student_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Fetches weekly class timetable for student's department & semester."""
    verify_student_access(current_user, student_id, db)
    student_repo = StudentRepository(db)
    student = student_repo.get_by_id(student_id)
    if not student:
        raise HTTPException(status_code=404, detail=f"Student ID '{student_id}' not found")
    
    academic_repo = AcademicRepository(db)
    slots = academic_repo.get_timetable(student.department, student.semester, student.section)
    return {
        "student_id": student_id,
        "department": student.department,
        "semester": student.semester,
        "section": student.section,
        "timetable": slots
    }

@router.get("/{student_id}/examinations")
def get_student_examinations(
    student_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Fetches upcoming exam schedule for student's department & semester."""
    verify_student_access(current_user, student_id, db)
    student_repo = StudentRepository(db)
    student = student_repo.get_by_id(student_id)
    if not student:
        raise HTTPException(status_code=404, detail=f"Student ID '{student_id}' not found")

    academic_repo = AcademicRepository(db)
    exams = academic_repo.get_examinations(student.department, student.semester)
    return {
        "student_id": student_id,
        "department": student.department,
        "semester": student.semester,
        "examinations": exams
    }

@router.get("/{student_id}/assignments")
def get_student_assignments(
    student_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Fetches student assignments and submission status."""
    verify_student_access(current_user, student_id, db)
    academic_repo = AcademicRepository(db)
    assignments = academic_repo.get_assignments(student_id)
    return {
        "student_id": student_id,
        "assignments": assignments
    }

@router.get("/{student_id}/fees")
def get_student_fees(
    student_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Fetches fee payment status and pending dues."""
    verify_student_access(current_user, student_id, db)
    fee_repo = FeeRepository(db)
    fees = fee_repo.get_student_fees(student_id)
    
    total_amount = sum(f["amount"] for f in fees)
    total_paid = sum(f["paid_amount"] for f in fees)
    total_pending = sum(f["pending_amount"] for f in fees)

    return {
        "student_id": student_id,
        "total_amount": total_amount,
        "total_paid": total_paid,
        "total_pending": total_pending,
        "has_pending_fees": total_pending > 0,
        "fee_records": fees
    }
