from fastapi import APIRouter, Depends, HTTPException, status
from app.models.mock_db import USERS_DB
from app.schemas.domain import LoginRequest, TokenResponse, UserProfile
from app.core.security import create_access_token, get_current_user_from_header

router = APIRouter(prefix="/auth", tags=["Authentication"])

def find_user(username_str: str, role_str: str = None):
    if not username_str:
        return None
    query = username_str.strip().lower()
    
    # 1. Direct match by key in USERS_DB
    if query in USERS_DB:
        return USERS_DB[query]
        
    # 2. Search all USERS_DB entries by username, name, email, student_id, or authorized_children
    for key, user in USERS_DB.items():
        if user["username"].lower() == query:
            return user
        if user.get("name", "").lower() == query:
            return user
        if user.get("email", "").lower() == query:
            return user
        if user.get("student_id") and user["student_id"].lower() == query:
            return user
        if query in [c.lower() for c in user.get("authorized_children", [])]:
            if not role_str or role_str.upper() == "PARENT" or user.get("role") == "PARENT":
                return user

    # 3. Partial name search
    for key, user in USERS_DB.items():
        if query in user.get("name", "").lower():
            if not role_str or user.get("role") == role_str.upper():
                return user

    # 4. Fallback default user if role is supplied
    if role_str:
        role_upper = role_str.upper()
        if role_upper == "PARENT":
            return USERS_DB.get("parent2") or USERS_DB.get("parent1")
        elif role_upper == "STUDENT":
            return USERS_DB.get("student1")
        elif role_upper == "ADMIN":
            return USERS_DB.get("admin")

    return None

@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest):
    user = find_user(payload.username, payload.role)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
        
    active_student_id = payload.student_id or user.get("student_id")
    if not active_student_id and user.get("authorized_children"):
        active_student_id = user["authorized_children"][0]
        
    token_data = {
        "sub": user["username"],
        "user_id": user["user_id"],
        "role": user["role"],
        "student_id": active_student_id,
        "authorized_children": user.get("authorized_children", [])
    }
    
    access_token = create_access_token(data=token_data)
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user_id=user["user_id"],
        username=user["username"],
        name=user["name"],
        role=user["role"],
        student_id=active_student_id,
        authorized_children=user.get("authorized_children", [])
    )

@router.get("/me", response_model=UserProfile)
def get_current_user_profile(user: dict = Depends(get_current_user_from_header)):
    username = user.get("sub")
    db_user = find_user(username, user.get("role")) if username else None
    if not db_user:
        raise HTTPException(status_code=404, detail="User profile not found")
        
    return UserProfile(
        user_id=db_user["user_id"],
        username=db_user["username"],
        name=db_user["name"],
        email=db_user["email"],
        role=db_user["role"],
        student_id=user.get("student_id") or db_user.get("student_id"),
        authorized_children=db_user.get("authorized_children", [])
    )
