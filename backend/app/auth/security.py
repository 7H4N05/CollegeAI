import os
import datetime
from typing import Optional, List
import jwt
from fastapi import HTTPException, Security, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from dotenv import load_dotenv

from database.connection import get_db
from database.models import User, UserRole
from database.repositories import UserRepository, ParentRepository, StudentRepository

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "collegeai_hackathon_super_secret_jwt_key_2026")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours for hackathon convenience

security_scheme = HTTPBearer(auto_error=False)

def hash_password(password: str) -> str:
    """Hashes password with SHA256 + salt fallback to ensure 0-dependency errors."""
    import hashlib
    salt = "collegeai_salt_2026"
    return hashlib.sha256((password + salt).encode("utf-8")).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies plain password against hash."""
    return hash_password(plain_password) == hashed_password

def create_access_token(user_id: str, email: str, role: str, expires_delta: Optional[datetime.timedelta] = None) -> str:
    """Generates JWT access token with user claims."""
    if expires_delta:
        expire = datetime.datetime.now(datetime.timezone.utc) + expires_delta
    else:
        expire = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {
        "sub": user_id,
        "email": email,
        "role": role,
        "exp": expire
    }
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Security(security_scheme),
    db: Session = Depends(get_db)
) -> User:
    """Dependency to extract authenticated user from JWT Bearer token."""
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization header",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")
    except jwt.PyJWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")

    user_repo = UserRepository(db)
    user = user_repo.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    
    return user

def require_roles(allowed_roles: List[str]):
    """Returns a dependency function checking if current user has any of allowed_roles."""
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Role '{current_user.role}' does not have permission for this resource."
            )
        return current_user
    return role_checker

def verify_student_access(user: User, student_id: str, db: Session) -> bool:
    """
    Core authorization engine enforcing strict role-based access:
    1. ADMIN can access any student_id.
    2. STUDENT can only access their own student_id.
    3. PARENT can only access student_id if parent-student relationship is active in DB.
    """
    if user.role == UserRole.ADMIN:
        return True

    if user.role == UserRole.STUDENT:
        student_repo = StudentRepository(db)
        student = student_repo.get_by_user_id(user.id)
        if not student or student.id != student_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied: Students can only access their own records."
            )
        return True

    if user.role == UserRole.PARENT:
        parent_repo = ParentRepository(db)
        parent = parent_repo.get_by_user_id(user.id)
        if not parent or not parent_repo.is_authorized_for_student(parent.id, student_id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied: Parent '{user.full_name}' is not authorized to access student '{student_id}'."
            )
        return True

    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
