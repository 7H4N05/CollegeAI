import os
import sys
import pytest
from fastapi.testclient import TestClient

# Ensure root directory is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from database.connection import get_db, SessionLocal
from database.seed.seed_data import seed_database
from backend.app.main import app

client = TestClient(app)

@pytest.fixture(scope="session", autouse=True)
def setup_test_database():
    """Seeds test database before running tests."""
    seed_database()

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_student_login_and_access():
    """Test Student login and self-service authorization."""
    # Login as Aarav Sharma (Student)
    login_resp = client.post("/api/v1/auth/login", json={
        "email": "aarav.sharma@college.edu",
        "password": "password123"
    })
    assert login_resp.status_code == 200
    data = login_resp.json()
    token = data["access_token"]
    assert data["user"]["role"] == "STUDENT"
    assert data["user"]["student_id"] == "STU001"

    headers = {"Authorization": f"Bearer {token}"}

    # Fetch own profile
    profile_resp = client.get("/api/v1/students/STU001/profile", headers=headers)
    assert profile_resp.status_code == 200
    assert profile_resp.json()["roll_number"] == "2024CS001"

    # Fetch own attendance
    att_resp = client.get("/api/v1/students/STU001/attendance", headers=headers)
    assert att_resp.status_code == 200
    assert att_resp.json()["overall_percentage"] > 85.0

    # Attempt to access another student's profile (Rohan Mehta STU002) -> MUST FAIL 403
    unauth_resp = client.get("/api/v1/students/STU002/profile", headers=headers)
    assert unauth_resp.status_code == 403
    assert "Students can only access their own records" in unauth_resp.json()["detail"]

def test_parent_authorization_isolation():
    """
    CRITICAL SECURITY REQUIREMENT:
    Parent can ONLY access their authorized child's data. Accessing another student MUST return HTTP 403.
    """
    # Parent 1: Rajesh Sharma (Father of Aarav Sharma STU001)
    login_resp = client.post("/api/v1/auth/login", json={
        "email": "rajesh.sharma@gmail.com",
        "password": "password123"
    })
    assert login_resp.status_code == 200
    p1_token = login_resp.json()["access_token"]
    p1_headers = {"Authorization": f"Bearer {p1_token}"}

    # Access authorized child STU001 -> MUST SUCCEED 200
    child1_resp = client.get("/api/v1/students/STU001/profile", headers=p1_headers)
    assert child1_resp.status_code == 200
    assert child1_resp.json()["full_name"] == "Aarav Sharma"

    # Access unauthorized child STU002 (Rohan Mehta, child of Sanjay Mehta) -> MUST FAIL 403
    unauth_resp = client.get("/api/v1/students/STU002/profile", headers=p1_headers)
    assert unauth_resp.status_code == 403
    assert "is not authorized to access student" in unauth_resp.json()["detail"]

def test_deterministic_attendance_and_leave_calculations():
    """Test attendance calculation, leave capacity, and timetable projection APIs."""
    login_resp = client.post("/api/v1/auth/login", json={
        "email": "aarav.sharma@college.edu",
        "password": "password123"
    })
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Leave capacity calculation
    lc_resp = client.post("/api/v1/calculations/leave-capacity", json={
        "student_id": "STU001",
        "target_threshold": 75.0
    }, headers=headers)
    assert lc_resp.status_code == 200
    lc_data = lc_resp.json()
    assert lc_data["max_missable_classes"] >= 0
    assert "status_message" in lc_data

    # Timetable leave projection (e.g. 3 days leave from Aug 17 to Aug 19, 2026)
    proj_resp = client.post("/api/v1/calculations/project-leave", json={
        "student_id": "STU001",
        "start_date": "2026-08-17",
        "end_date": "2026-08-19",
        "target_threshold": 75.0
    }, headers=headers)
    assert proj_resp.status_code == 200
    proj_data = proj_resp.json()
    assert proj_data["total_classes_missed"] > 0
    assert "subject_projections" in proj_data

def test_required_marks_calculation():
    """Test required end-semester marks calculation."""
    login_resp = client.post("/api/v1/auth/login", json={
        "email": "rohan.mehta@college.edu",
        "password": "password123"
    })
    token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    marks_resp = client.post("/api/v1/calculations/required-marks", json={
        "student_id": "STU002",
        "subject_id": "SUB101",
        "target_overall_percentage": 80.0
    }, headers=headers)
    assert marks_resp.status_code == 200
    m_data = marks_resp.json()
    assert "required_end_sem_marks" in m_data
    assert "status_message" in m_data

def test_announcements_api():
    """Test college announcements retrieval."""
    resp = client.get("/api/v1/announcements")
    assert resp.status_code == 200
    data = resp.json()
    assert data["count"] > 0
    assert len(data["announcements"]) > 0

if __name__ == "__main__":
    pytest.main(["-v", __file__])
