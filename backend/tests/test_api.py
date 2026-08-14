import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["project"] == "CollegeAI"

def test_login_student():
    response = client.post(
        "/api/v1/auth/login",
        json={"username": "student1", "password": "password123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["role"] == "STUDENT"
    assert data["student_id"] == "STU101"

def test_login_parent():
    response = client.post(
        "/api/v1/auth/login",
        json={"username": "parent1", "password": "password123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["role"] == "PARENT"
    assert "STU101" in data["authorized_children"]

def test_parent_child_authorization():
    # Login parent1 (authorized for STU101 only)
    parent_login = client.post(
        "/api/v1/auth/login",
        json={"username": "parent1", "password": "password123"}
    ).json()
    
    token = parent_login["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Authorized child access -> 200 OK
    res_authorized = client.get("/api/v1/students/STU101/attendance", headers=headers)
    assert res_authorized.status_code == 200
    assert res_authorized.json()["student_id"] == "STU101"
    
    # Unauthorized child access (STU102) -> 403 Forbidden!
    res_unauthorized = client.get("/api/v1/students/STU102/attendance", headers=headers)
    assert res_unauthorized.status_code == 403

def test_attendance_calculation_endpoint():
    response = client.post(
        "/api/v1/calculations/attendance",
        json={"attended": 41, "conducted": 50, "target_percentage": 75.0}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["current_percentage"] == 82.0
    assert data["max_classes_can_miss"] == 4
    assert data["status"] == "SAFE" or data["status"] == "EXCELLENT"

def test_required_marks_calculation_endpoint():
    # Login student1
    login_res = client.post(
        "/api/v1/auth/login",
        json={"username": "student1", "password": "password123"}
    ).json()
    token = login_res["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    response = client.post(
        "/api/v1/calculations/required-marks",
        json={"student_id": "STU101", "subject_code": "CS601", "target_final_percentage": 80.0},
        headers=headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["subject_code"] == "CS601"
    assert "required_endsem_marks" in data

def test_chat_endpoint():
    login_res = client.post(
        "/api/v1/auth/login",
        json={"username": "student1", "password": "password123"}
    ).json()
    token = login_res["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    response = client.post(
        "/api/v1/chat",
        json={"message": "What is my current attendance?"},
        headers=headers
    )
    assert response.status_code == 200
    data = response.json()
    assert "reply" in data
    assert "get_attendance" in data["tools_called"]
    assert "88.0%" in data["reply"] or "82%" in data["reply"] or "attendance" in data["reply"]
