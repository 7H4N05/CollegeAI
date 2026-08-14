from fastapi import APIRouter, Depends, HTTPException, status
from app.models.mock_db import USERS_DB
from app.schemas.domain import LoginRequest, TokenResponse, UserProfile
from app.core.security import create_access_token, get_current_user_from_header

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest):
    user = USERS_DB.get(payload.username.lower())
    if not user or user["password_hash"] != payload.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
        
    token_data = {
        "sub": user["username"],
        "user_id": user["user_id"],
        "role": user["role"],
        "student_id": user.get("student_id"),
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
        student_id=user.get("student_id"),
        authorized_children=user.get("authorized_children", [])
    )

@router.get("/me", response_model=UserProfile)
def get_current_user_profile(user: dict = Depends(get_current_user_from_header)):
    username = user.get("sub")
    db_user = USERS_DB.get(username.lower()) if username else None
    if not db_user:
        raise HTTPException(status_code=404, detail="User profile not found")
        
    return UserProfile(
        user_id=db_user["user_id"],
        username=db_user["username"],
        name=db_user["name"],
        email=db_user["email"],
        role=db_user["role"],
        student_id=db_user.get("student_id"),
        authorized_children=db_user.get("authorized_children", [])
    )
