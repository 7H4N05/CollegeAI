from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from database.connection import get_db
from database.repositories import UserRepository, StudentRepository, ParentRepository
from backend.app.auth.security import verify_password, create_access_token, get_current_user
from database.models import User, UserRole

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])

class LoginRequest(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    student_id: Optional[str] = None
    authorized_student_ids: List[str] = []

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

@router.post("/login", response_model=LoginResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """Authenticates user and returns JWT token along with role metadata and authorized student IDs."""
    user_repo = UserRepository(db)
    user = user_repo.get_by_email(request.email)

    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Determine authorized student IDs based on role
    student_id: Optional[str] = None
    authorized_student_ids: List[str] = []

    if user.role == UserRole.STUDENT:
        student_repo = StudentRepository(db)
        student = student_repo.get_by_user_id(user.id)
        if student:
            student_id = student.id
            authorized_student_ids = [student.id]
    elif user.role == UserRole.PARENT:
        parent_repo = ParentRepository(db)
        parent = parent_repo.get_by_user_id(user.id)
        if parent:
            authorized_student_ids = parent_repo.get_authorized_student_ids(parent.id)
            if authorized_student_ids:
                student_id = authorized_student_ids[0]  # Primary child
    elif user.role == UserRole.ADMIN:
        student_repo = StudentRepository(db)
        all_students = student_repo.get_all()
        authorized_student_ids = [s.id for s in all_students]

    token = create_access_token(user_id=user.id, email=user.email, role=user.role)

    user_resp = UserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=user.role,
        student_id=student_id,
        authorized_student_ids=authorized_student_ids
    )

    return LoginResponse(access_token=token, user=user_resp)

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Returns current authenticated user details and authorized student IDs."""
    student_id: Optional[str] = None
    authorized_student_ids: List[str] = []

    if current_user.role == UserRole.STUDENT:
        student_repo = StudentRepository(db)
        student = student_repo.get_by_user_id(current_user.id)
        if student:
            student_id = student.id
            authorized_student_ids = [student.id]
    elif current_user.role == UserRole.PARENT:
        parent_repo = ParentRepository(db)
        parent = parent_repo.get_by_user_id(current_user.id)
        if parent:
            authorized_student_ids = parent_repo.get_authorized_student_ids(parent.id)
            if authorized_student_ids:
                student_id = authorized_student_ids[0]
    elif current_user.role == UserRole.ADMIN:
        student_repo = StudentRepository(db)
        all_students = student_repo.get_all()
        authorized_student_ids = [s.id for s in all_students]

    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        role=current_user.role,
        student_id=student_id,
        authorized_student_ids=authorized_student_ids
    )
