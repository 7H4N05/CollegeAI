from typing import List
from app.models.mock_db import ANNOUNCEMENTS_DB
from app.schemas.domain import Announcement

def get_announcements_data(target_role: str = "ALL") -> List[Announcement]:
    results = []
    for anc in ANNOUNCEMENTS_DB:
        aud = anc["target_audience"]
        if aud == "ALL" or aud.upper() == target_role.upper() or target_role == "ALL":
            results.append(Announcement(**anc))
    return results
