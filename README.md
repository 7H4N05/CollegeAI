# CollegeAI 🎓🤖

**Personalized AI College Companion for Students and Parents**

CollegeAI is a smart, role-aware academic assistant designed to provide accurate, real-time insights into student attendance, marks, schedules, assignments, fees, and college announcements.

---

## Member 3 Responsibilities (`feature/database-auth`)

This branch contains the core data foundation, authentication & authorization engine, deterministic calculation services, and FastAPI REST APIs for CollegeAI.

### 🌟 Features Implemented

1. **Relational Database & ORM Layer**:
   - Built using SQLAlchemy ORM (default: SQLite `collegeai.db`, PostgreSQL ready).
   - 13 relational entities: `users`, `students`, `parents`, `parent_student_relationships`, `subjects`, `attendance`, `timetable`, `marks`, `examinations`, `assignments`, `student_assignments`, `fees`, `announcements`.
2. **Role-Aware Security & Authorization Engine**:
   - JWT authentication (`HS256`).
   - Tenant-level data isolation:
     - **Students** can strictly only access their own records.
     - **Parents** can strictly only access their authorized child's records (verified against active `parent_student_relationships` entries).
     - **Admins** have full access.
3. **Deterministic Calculation Engines**:
   - Attendance percentage calculation ($\text{attended} / \text{conducted} \times 100$).
   - Maximum missable classes (leave capacity) for $\ge 75\%$ attendance threshold.
   - Required consecutive classes to reach $\ge 80\%$ target threshold.
   - Timetable-aware date leave impact projection (evaluates exact subject classes affected by date ranges).
   - Required end-semester exam marks for target CGPA/grade.
4. **FastAPI REST API Suite**:
   - Auth APIs (`POST /api/v1/auth/login`, `GET /api/v1/auth/me`).
   - Student Data APIs (`profile`, `attendance`, `marks`, `timetable`, `examinations`, `assignments`, `fees`).
   - Calculation Engine APIs (`leave-capacity`, `required-classes`, `project-leave`, `required-marks`).
   - Announcements API (`GET /api/v1/announcements`).
5. **Realistic Seed Dataset**:
   - 10 Students, 10 Parents, 1 Admin, 15 Subjects across Computer Science and Data Science departments.
   - Full weekly timetables, 800+ historical attendance logs, internal exam marks, upcoming end-sem exam schedules, assignments, fees, and announcements.

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
pip install -r backend/requirements.txt
```

### 2. Seed Database
```bash
python database/seed/seed_data.py
```

### 3. Run FastAPI Backend Server
```bash
uvicorn backend.app.main:app --reload --port 8000
```
- API Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)
- Healthcheck: [http://localhost:8000/health](http://localhost:8000/health)

### 4. Run Automated Test Suite
```bash
pytest backend/tests/test_database_and_auth.py -v
```

---

## 🔑 Demo Test Credentials

All test accounts use password: `password123`

- **Student High Attendance (>90%)**: `aarav.sharma@college.edu` (`STU001`)
- **Student Borderline (~76%, Pending Fee)**: `rohan.mehta@college.edu` (`STU002`)
- **Student Low Attendance (<65%)**: `priya.patel@college.edu` (`STU003`)
- **Parent of Aarav Sharma**: `rajesh.sharma@gmail.com`
- **Parent of Rohan Mehta**: `sanjay.mehta@gmail.com`
- **Administrator**: `admin@college.edu`

Detailed matrix available in [`docs/demo_credentials.md`](file:///c:/Tanush/eigi.ai/CollegeAI/docs/demo_credentials.md).

---

## 📚 Documentation Links
- [Database Schema & Authorization Spec](file:///c:/Tanush/eigi.ai/CollegeAI/docs/database_schema.md)
- [Database Readme & Migration DDL](file:///c:/Tanush/eigi.ai/CollegeAI/database/README.md)
- [Demo Credentials Matrix](file:///c:/Tanush/eigi.ai/CollegeAI/docs/demo_credentials.md)
