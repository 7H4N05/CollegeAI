from typing import List, Optional
from fastapi import APIRouter, Query
from app.schemas.domain import Announcement
from app.services.announcement_service import get_announcements_data

router = APIRouter(prefix="/announcements", tags=["Announcements"])

@router.get("", response_model=List[Announcement])
def get_announcements(role: Optional[str] = Query("ALL", description="Target role filter: ALL, STUDENT, PARENT")):
    return get_announcements_data(target_role=role)
