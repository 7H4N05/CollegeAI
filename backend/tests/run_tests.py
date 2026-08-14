import unittest
import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.services.attendance_engine import (
    calculate_attendance_percentage,
    calculate_max_leave_capacity,
    calculate_classes_needed,
    calculate_attendance_metrics,
    calculate_leave_impact_for_dates
)
from app.services.marks_engine import calculate_required_endsem_marks
from app.core.security import create_access_token, decode_access_token, validate_student_access, PermissionDeniedException
from fastapi.testclient import TestClient
from app.main import app

class TestAttendanceEngine(unittest.TestCase):
    def test_attendance_percentage(self):
        self.assertEqual(calculate_attendance_percentage(41, 50), 82.0)
        self.assertEqual(calculate_attendance_percentage(38, 50), 76.0)
        self.assertEqual(calculate_attendance_percentage(32, 50), 64.0)

    def test_prompt_example_41_50_attendance(self):
        attended = 41
        conducted = 50
        current_pct = calculate_attendance_percentage(attended, conducted)
        self.assertEqual(current_pct, 82.0)
        
        max_missable_75 = calculate_max_leave_capacity(attended, conducted, 75.0)
        self.assertEqual(max_missable_75, 4)
        
        # Verify inequality: 41 / (50 + 4) = 75.92% >= 75%
        self.assertTrue((41 / (50 + max_missable_75)) >= 0.75)
        self.assertTrue((41 / (50 + max_missable_75 + 1)) < 0.75)
        
        needed_80 = calculate_classes_needed(attended, conducted, 80.0)
        self.assertEqual(needed_80, 0)
        
        needed_90 = calculate_classes_needed(attended, conducted, 90.0)
        self.assertEqual(needed_90, 40)

    def test_low_attendance_32_50(self):
        attended = 32
        conducted = 50
        self.assertEqual(calculate_attendance_percentage(attended, conducted), 64.0)
        self.assertEqual(calculate_max_leave_capacity(attended, conducted, 75.0), 0)
        self.assertEqual(calculate_classes_needed(attended, conducted, 75.0), 22)

    def test_leave_impact(self):
        res = calculate_leave_impact_for_dates("STU102", "2026-08-17", "2026-08-19")
        self.assertEqual(res.student_id, "STU102")
        self.assertGreater(res.total_classes_affected, 0)

class TestAPIIntegration(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_root_endpoint(self):
        res = self.client.get("/")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["project"], "CollegeAI")

    def test_student_login(self):
        res = self.client.post("/api/v1/auth/login", json={"username": "student1", "password": "password123"})
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["role"], "STUDENT")
        self.assertEqual(data["student_id"], "STU101")

    def test_parent_login(self):
        res = self.client.post("/api/v1/auth/login", json={"username": "parent1", "password": "password123"})
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["role"], "PARENT")
        self.assertIn("STU101", data["authorized_children"])

    def test_parent_rbac_authorization(self):
        login_res = self.client.post("/api/v1/auth/login", json={"username": "parent1", "password": "password123"}).json()
        token = login_res["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Authorized child (STU101) -> 200 OK
        res_auth = self.client.get("/api/v1/students/STU101/attendance", headers=headers)
        self.assertEqual(res_auth.status_code, 200)
        
        # Unauthorized child (STU102) -> 403 Forbidden
        res_unauth = self.client.get("/api/v1/students/STU102/attendance", headers=headers)
        self.assertEqual(res_unauth.status_code, 403)

    def test_calculation_endpoints(self):
        res = self.client.post("/api/v1/calculations/attendance", json={"attended": 41, "conducted": 50, "target_percentage": 75.0})
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["current_percentage"], 82.0)
        self.assertEqual(data["max_classes_can_miss"], 4)

    def test_chat_agent(self):
        login_res = self.client.post("/api/v1/auth/login", json={"username": "student1", "password": "password123"}).json()
        token = login_res["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        res = self.client.post("/api/v1/chat", json={"message": "What is my current attendance?"}, headers=headers)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("get_attendance", data["tools_called"])
        self.assertTrue(len(data["reply"]) > 0)

if __name__ == "__main__":
    unittest.main()
