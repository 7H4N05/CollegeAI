from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from app.core.security import get_current_user_from_header, validate_student_access, ROLE_PARENT, PermissionDeniedException
from app.schemas.domain import StudentProfile
from app.services.parent_service import get_parent_children, get_child_academic_summary

router = APIRouter(prefix="/parents", tags=["Parents"])

@router.get("/{parent_id}/children", response_model=List[StudentProfile])
def get_children(
    parent_id: str,
    user: dict = Depends(get_current_user_from_header)
):
    if user.get("role") != ROLE_PARENT and user.get("role") != "ADMIN":
        raise PermissionDeniedException("Only parent accounts can access parent services")
    return get_parent_children(user.get("user_id", parent_id))

@router.get("/{parent_id}/children/{student_id}/overview")
def get_child_overview(
    parent_id: str,
    student_id: str,
    user: dict = Depends(get_current_user_from_header)
):
    validate_student_access(user, student_id)
    return get_child_academic_summary(student_id)
