# CollegeAI Backend API Documentation

Welcome to the **CollegeAI REST API Specification**. This document provides the complete API reference for Member 2 (Frontend) and future WhatsApp integration developers.

---

## Base URL & Setup
- **Local Dev Server**: `http://localhost:8000`
- **Interactive Swagger Docs**: `http://localhost:8000/docs`
- **Interactive ReDoc**: `http://localhost:8000/redoc`

---

## Authentication & Authorization
All secured endpoints require a JWT Bearer token passed in the HTTP Authorization header:
```http
Authorization: Bearer <access_token>
```

### Demo Accounts for Testing

| Username | Password | Role | Entity ID | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `student1` | `password123` | `STUDENT` | `STU101` | High attendance student (Rahul Sharma, 88%) |
| `student2` | `password123` | `STUDENT` | `STU102` | Borderline attendance (Priya Patel, 76%, 41/50 in DSA) |
| `student3` | `password123` | `STUDENT` | `STU103` | Low attendance (Amit Kumar, 64%, pending fees) |
| `student4` | `password123` | `STUDENT` | `STU104` | Pending fee balance student (Ananya Roy) |
| `student5` | `password123` | `STUDENT` | `STU105` | Pending assignments student (Vikram Singh) |
| `student6` | `password123` | `STUDENT` | `STU106` | Upcoming mid-term exams student (Sneha Reddy) |
| `parent1` | `password123` | `PARENT` | `P201` | Parent linked to `STU101` |
| `parent2` | `password123` | `PARENT` | `P202` | Parent linked to `STU102` |
| `admin` | `password123` | `ADMIN` | `A301` | Full administrative access |

---

## Endpoints Quick Reference

### 1. Authentication
- `POST /api/v1/auth/login` - Authenticate user & get access token.
- `GET /api/v1/auth/me` - Get logged-in user profile.

### 2. Student Data APIs
- `GET /api/v1/students/{student_id}/profile` - Get student profile details.
- `GET /api/v1/students/{student_id}/attendance` - Get attendance breakdown & capacity metrics.
- `GET /api/v1/students/{student_id}/marks` - Get internal marks & required end-sem target scores.
- `GET /api/v1/students/{student_id}/timetable` - Get class schedule.
- `GET /api/v1/students/{student_id}/examinations` - Get upcoming exam dates & venues.
- `GET /api/v1/students/{student_id}/assignments` - Get pending & submitted homework.
- `GET /api/v1/students/{student_id}/fees` - Get fee balance & payment status.

### 3. Parent Services
- `GET /api/v1/parents/{parent_id}/children` - List authorized children for parent.
- `GET /api/v1/parents/{parent_id}/children/{student_id}/overview` - Get child academic summary.

### 4. Deterministic Calculation Services
- `POST /api/v1/calculations/attendance` - Calculate max leave capacity & classes needed.
- `POST /api/v1/calculations/leave-impact` - Timetable-based leave projection.
- `POST /api/v1/calculations/required-marks` - Calculate required end-sem marks for target grade.

### 5. Announcements
- `GET /api/v1/announcements` - List official notices and circulars.

### 6. AI Conversational Agent
- `POST /api/v1/chat` - Process natural language query with automated tool execution.

---

## Example Requests & Responses

### 1. Login Endpoint
`POST /api/v1/auth/login`
```json
{
  "username": "student1",
  "password": "password123"
}
```
**Response (200 OK)**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI...",
  "token_type": "bearer",
  "user_id": "U101",
  "username": "student1",
  "name": "Rahul Sharma",
  "role": "STUDENT",
  "student_id": "STU101",
  "authorized_children": []
}
```

### 2. Attendance Calculation Endpoint
`POST /api/v1/calculations/attendance`
```json
{
  "attended": 41,
  "conducted": 50,
  "target_percentage": 75.0
}
```
**Response (200 OK)**:
```json
{
  "attended": 41,
  "conducted": 50,
  "current_percentage": 82.0,
  "target_percentage": 75.0,
  "max_classes_can_miss": 4,
  "classes_needed_to_reach_target": 0,
  "status": "EXCELLENT",
  "summary_message": "Your attendance is 82.0%. You can miss up to 4 classes while maintaining >= 75.0%."
}
```

### 3. AI Chat Endpoint
`POST /api/v1/chat`
*Header*: `Authorization: Bearer <token>`
```json
{
  "message": "What is my current attendance?"
}
```
**Response (200 OK)**:
```json
{
  "reply": "Your current overall attendance is **88.0%** (SAFE).\n• Classes you can miss while maintaining >= 75%: **26 classes**\n• Goal status: Attendance is already above 80%!\n\nSubject Breakdown:\n- Data Structures & Algorithms (CS601): 88.0% (44/50)\n- Database Management Systems (CS602): 90.0% (45/50)\n- Operating Systems (CS603): 86.0% (43/50)\n- Computer Networks (CS604): 88.0% (44/50)",
  "user_role": "STUDENT",
  "student_id": "STU101",
  "intent_detected": "get_attendance",
  "tools_called": [
    "get_attendance"
  ],
  "structured_data": { ... }
}
```
