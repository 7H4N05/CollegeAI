from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any, List
import jwt
from fastapi import Depends, Header
from app.core.config import settings
from app.core.exceptions import NotAuthenticatedException, PermissionDeniedException

# User Roles
ROLE_STUDENT = "STUDENT"
ROLE_PARENT = "PARENT"
ROLE_ADMIN = "ADMIN"

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Dict[str, Any]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except jwt.PyJWTError:
        raise NotAuthenticatedException("Invalid or expired token")

def get_current_user_from_header(authorization: Optional[str] = Header(None)) -> Dict[str, Any]:
    """
    Extract user session from Bearer token in Header.
    If no authorization header is present in hackathon demo mode, supports demo headers.
    """
    if not authorization:
        # Fallback for hackathon testing if authorization header missing
        raise NotAuthenticatedException("Authorization header required")
    
    if not authorization.startswith("Bearer "):
        raise NotAuthenticatedException("Invalid Authorization header format. Expected 'Bearer <token>'")
    
    token = authorization.split(" ")[1]
    return decode_access_token(token)

def validate_student_access(user: Dict[str, Any], target_student_id: str) -> bool:
    """
    Validates if user has permission to view target_student_id's data.
    - STUDENT: target_student_id must match user's student_id.
    - PARENT: target_student_id must be in parent's authorized_children list.
    - ADMIN: full access.
    """
    role = user.get("role")
    
    if role == ROLE_ADMIN:
        return True
    
    if role == ROLE_STUDENT:
        user_student_id = user.get("student_id")
        if user_student_id and user_student_id.upper() == target_student_id.upper():
            return True
        raise PermissionDeniedException(f"Student '{user_student_id}' is not authorized to access data for student '{target_student_id}'")
        
    if role == ROLE_PARENT:
        authorized_children = [c.upper() for c in user.get("authorized_children", [])]
        if target_student_id.upper() in authorized_children:
            return True
        raise PermissionDeniedException(f"Parent '{user.get('username')}' is not authorized to access data for child '{target_student_id}'")
        
    raise PermissionDeniedException("Unauthorized user role")
