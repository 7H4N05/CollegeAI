# CollegeAI Database Layer & Architecture

This directory contains the relational database models, SQLAlchemy ORM connections, repositories, migration DDLs, and seed data generators for **CollegeAI**.

---

## Key Highlights

- **DBMS**: SQLite by default (`sqlite:///./collegeai.db`), fully compatible with PostgreSQL via SQLAlchemy.
- **Data Access Pattern**: Clean Repository Pattern (`database/repositories.py`) isolating raw database queries from Member 1 (AI backend) and Member 2 (Frontend REST routers).
- **Security & Authorization**: Integrated Parent-Student Relationship verification ensuring strict tenant isolation.

---

## Folder Structure

```
database/
├── __init__.py
├── connection.py          # SQLAlchemy Engine, SessionLocal, get_db dependency
├── models.py              # Declarative ORM models (13 relational entities)
├── repositories.py        # Data access repositories (User, Student, Parent, Academic, Fee, Announcement)
├── migrations/
│   └── schema.sql         # Standard SQL DDL migration script
└── seed/
    ├── __init__.py
    └── seed_data.py       # Seed script populating 10 students, 10 parents, 15 subjects, timetables & stats
```

---

## Seeding the Database

To seed or reset the database with realistic test data (10 students, 10 parents, timetables, attendance, marks, fees, and announcements):

```bash
python database/seed/seed_data.py
```

---

## Schema Overview

| Entity | Table Name | Purpose |
| :--- | :--- | :--- |
| **User** | `users` | Base identity & credentials for STUDENT, PARENT, and ADMIN roles |
| **Student** | `students` | Academic profile (Roll number, Department, Semester, Section, CGPA, Target CGPA) |
| **Parent** | `parents` | Parent profile & phone number |
| **ParentStudentRelationship** | `parent_student_relationships` | Active linkages authorizing parents to access specific student IDs |
| **Subject** | `subjects` | Course metadata (Code, Name, Department, Semester, Credits) |
| **Attendance** | `attendance` | Historical daily attendance logs (PRESENT, ABSENT, EXCUSED) |
| **Timetable** | `timetable` | Weekly schedule by day of week, time slot, room, and subject |
| **Mark** | `marks` | Internal 1, Internal 2, Mid-Sem, and Assignment marks |
| **Examination** | `examinations` | End-semester examination schedules |
| **Assignment** | `assignments` / `student_assignments` | Assignment details, deadlines, and submission statuses |
| **Fee** | `fees` | Fee structure, paid amount, pending dues, and payment status |
| **Announcement** | `announcements` | General and role-targeted college notifications |
