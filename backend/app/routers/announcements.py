from typing import Optional, List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from database.connection import get_db
from database.repositories import AnnouncementRepository

router = APIRouter(prefix="/api/v1/announcements", tags=["College Announcements"])

@router.get("")
def get_announcements(
    target_audience: Optional[str] = Query(None, description="ALL, STUDENT, or PARENT"),
    department: Optional[str] = Query(None, description="Filter by department"),
    db: Session = Depends(get_db)
):
    """Fetches public and role-targeted college announcements."""
    repo = AnnouncementRepository(db)
    announcements = repo.get_announcements(target_audience=target_audience, department=department)
    return {
        "count": len(announcements),
        "announcements": announcements
    }
