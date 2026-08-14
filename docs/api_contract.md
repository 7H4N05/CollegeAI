# API Contract - EduMitra

This document outlines the API contract between the React Frontend, Python FastAPI Backend, and SQLite Database.

All APIs should return JSON payloads and handle authentication via headers.

---

## Authentication & Identity

### `POST /api/auth/login`
Authenticates a student, parent, or admin.

**Request Body:**
```json
{
  "role": "STUDENT | PARENT | ADMIN",
  "username": "user123",
  "password": "password123",
  "student_id": "STU001" // Optional, used for parent/student bypass demo
}
```

**Response (200 OK):**
```json
{
  "token": "mock-jwt-token-xyz",
  "user": {
    "id": "USR001",
    "username": "user123",
    "role": "STUDENT | PARENT | ADMIN",
    "name": "Aarav Sharma"
  },
  "student_id": "STU001" // Authorized student ID for student/parent
}
```

---

## Data Endpoints

### `GET /api/student/{student_id}/profile`
Retrieves profile info for a student.

**Response (200 OK):**
```json
{
  "student_id": "STU001",
  "name": "Aarav Sharma",
  "roll_number": "2023CS1001",
  "course": "B.Tech Computer Science",
  "semester": 6,
  "email": "aarav.sharma@college.edu"
}
```

### `GET /api/student/{student_id}/attendance`
Retrieves attendance records for each subject.

**Response (200 OK):**
```json
{
  "student_id": "STU001",
  "overall_percentage": 88.0,
  "total_attended": 88,
  "total_conducted": 100,
  "records": [
    {
      "subject_id": "SUB001",
      "subject_name": "Data Structures & Algorithms",
      "attended": 18,
      "conducted": 20,
      "percentage": 90.0,
      "faculty": "Dr. Ramesh Gupta"
    },
    {
      "subject_id": "SUB002",
      "subject_name": "Database Management Systems",
      "attended": 17,
      "conducted": 20,
      "percentage": 85.0,
      "faculty": "Prof. Seema Rao"
    }
  ]
}
```

### `GET /api/student/{student_id}/marks`
Retrieves internal marks and targets.

**Response (200 OK):**
```json
{
  "student_id": "STU001",
  "cgpa": 8.45,
  "records": [
    {
      "subject_id": "SUB001",
      "subject_name": "Data Structures & Algorithms",
      "internals": 42.0,
      "max_internals": 50.0,
      "weightage_internals": 50,
      "weightage_endsem": 50,
      "target_grades": {
        "A": 38.0, // Minimum marks needed in end-semester (out of 50/100 weighted)
        "B": 28.0,
        "C": 18.0
      }
    }
  ]
}
```

### `GET /api/student/{student_id}/timetable`
Retrieves the weekly timetable schedule.

**Response (200 OK):**
```json
{
  "student_id": "STU001",
  "schedule": {
    "Monday": [
      {
        "time": "09:00 AM - 10:00 AM",
        "subject_name": "Data Structures & Algorithms",
        "room": "LHC-101",
        "faculty": "Dr. Ramesh Gupta"
      }
    ],
    "Tuesday": []
  }
}
```

### `GET /api/student/{student_id}/exams`
Retrieves upcoming examination schedules.

**Response (200 OK):**
```json
{
  "student_id": "STU001",
  "exams": [
    {
      "subject_name": "Data Structures & Algorithms",
      "exam_type": "Mid Semester II",
      "date": "2026-08-20",
      "time": "10:00 AM - 12:00 PM",
      "room": "LHC-302",
      "portion": "Trees, Graphs, and Sorting Algorithms"
    }
  ]
}
```

### `GET /api/student/{student_id}/assignments`
Retrieves pending and submitted assignments.

**Response (200 OK):**
```json
{
  "student_id": "STU001",
  "assignments": [
    {
      "id": "ASN001",
      "subject_name": "Database Management Systems",
      "title": "SQL Query Optimization Assignment",
      "description": "Solve the 10 optimization problems using indexing policies.",
      "due_date": "2026-08-18",
      "status": "PENDING | SUBMITTED",
      "max_marks": 20
    }
  ]
}
```

### `GET /api/student/{student_id}/fees`
Retrieves payment status, pending fee, and history.

**Response (200 OK):**
```json
{
  "student_id": "STU001",
  "total_fee": 75000,
  "paid": 75000,
  "pending": 0,
  "due_date": "2026-07-31",
  "status": "PAID | PARTIAL | UNPAID",
  "transactions": [
    {
      "transaction_id": "TXN9832",
      "amount": 75000,
      "date": "2026-07-15",
      "method": "Net Banking",
      "status": "SUCCESS"
    }
  ]
}
```

### `GET /api/student/{student_id}/announcements`
Retrieves notice board announcements.

**Response (200 OK):**
```json
{
  "announcements": [
    {
      "id": "ANC001",
      "title": "Independence Day Holiday",
      "content": "The college will remain closed on 15th August 2026 in observance of Independence Day.",
      "date": "2026-08-12",
      "category": "ADMIN | ACADEMIC | FEST | EXAM"
    }
  ]
}
```

---

## Calculations & What-If Engines

### `POST /api/calculations/attendance-project`
Calculates projected attendance by subject and overall if a student misses a list of dates (for leave).

**Request Body:**
```json
{
  "student_id": "STU001",
  "leave_start_date": "2026-08-17",
  "leave_end_date": "2026-08-19"
}
```

**Response (200 OK):**
```json
{
  "student_id": "STU001",
  "current_overall_percentage": 88.0,
  "projected_overall_percentage": 82.3,
  "days_requested": 3,
  "classes_missed_count": 8,
  "subjects_affected": [
    {
      "subject_name": "Data Structures & Algorithms",
      "current_percentage": 90.0,
      "projected_percentage": 80.0,
      "classes_missed": 3,
      "falls_below_75": false
    },
    {
      "subject_name": "Database Management Systems",
      "current_percentage": 76.0,
      "projected_percentage": 70.5,
      "classes_missed": 2,
      "falls_below_75": true
    }
  ]
}
```

### `POST /api/calculations/leave-capacity`
Determines the maximum classes a student can miss subject-by-subject before falling below 75%.

**Request Body:**
```json
{
  "student_id": "STU001"
}
```

**Response (200 OK):**
```json
{
  "student_id": "STU001",
  "capacity": [
    {
      "subject_name": "Data Structures & Algorithms",
      "current_percentage": 90.0,
      "classes_can_miss": 4,
      "conducted": 20,
      "attended": 18
    },
    {
      "subject_name": "Operating Systems",
      "current_percentage": 74.0,
      "classes_can_miss": 0,
      "conducted": 20,
      "attended": 14
    }
  ]
}
```

---

## Conversational AI Agent

### `POST /api/chat/message`
Main conversation endpoint. Integrates the identity-validated user with the AI Agent.

**Request Body:**
```json
{
  "role": "STUDENT | PARENT",
  "student_id": "STU001",
  "message": "If I take leave next Monday, will I fall below 75% in any subject?"
}
```

**Response (200 OK):**
```json
{
  "reply": "If you take leave next Monday (August 17), you will miss 3 classes. Your overall attendance will drop to 85.5%. However, your attendance in Operating Systems will drop to 73.1% which is below the required 75% threshold.",
  "tool_called": "calculate_attendance_projection",
  "data": {
    "type": "projection",
    "dates": ["2026-08-17"],
    "classes_missed": 3,
    "current_overall": 88.0,
    "projected_overall": 85.5,
    "subjects": [
      {
        "subject_name": "Operating Systems",
        "current_percentage": 76.0,
        "projected_percentage": 73.1,
        "classes_missed": 1,
        "falls_below_75": true
      }
    ]
  }
}
```
*(If no tool is called, `tool_called` is `null` and `data` is `null`).*
