# CollegeAI 🎓🤖

**Personalized AI College Companion for Students and Parents**

CollegeAI is a smart, role-aware academic assistant designed to provide accurate, real-time insights into student attendance, marks, schedules, assignments, fees, and college announcements.

---

## 🌟 Key Features

1. **Role-Aware Security & Authorization Engine**:
   - JWT authentication (`HS256`).
   - Strict tenant-level data isolation:
     - **Students** can strictly only access their own records.
     - **Parents** can strictly only access their authorized child's records.
     - **Admins** have system management access.

2. **Deterministic Calculation Engines**:
   - **Attendance Engine**: Calculates exact current %, maximum leave capacity $x$ ($attended / (conducted + x) \ge 0.75$), and consecutive classes needed $y$ to reach target %.
   - **Timetable Leave Projection**: Evaluates exact subject classes affected by planned date ranges.
   - **Marks Target Engine**: Calculates required end-semester exam score (out of 60) to achieve target grade or CGPA.

3. **AI Function Calling & Tool Router**:
   - Isolates LLM behind structured tool calling (`get_student_profile`, `get_attendance`, `calculate_leave_impact`, `get_marks`, `get_fees`, `get_announcements`).
   - Prevents AI hallucination of grades, attendance, or fees.

4. **API-First Architecture**:
   - Fully decoupled REST endpoints ready for React Frontend (Member 2) and Meta WhatsApp Webhook integration.

---

## 🚀 Quick Start Guide

### 1. Environment Setup
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```

### 2. Run FastAPI Backend Server
```bash
python -m uvicorn backend.app.main:app --reload --port 8000
```
- API Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)
- Healthcheck: [http://localhost:8000/health](http://localhost:8000/health)

### 3. Run Automated Test Suite
```bash
python backend/tests/run_tests.py
```

### 4. Run with Docker Compose
```bash
docker-compose up --build
```

---

## 🧪 Demo Login Credentials

All test accounts use password: `password123`

| Username | Role | Student ID | Highlights |
| :--- | :--- | :--- | :--- |
| `student1` | `STUDENT` | `STU101` | High attendance (Rahul Sharma, 88%) |
| `student2` | `STUDENT` | `STU102` | Borderline attendance (Priya Patel, 76%, 41/50 DSA) |
| `student3` | `STUDENT` | `STU103` | Low attendance (Amit Kumar, 64%) |
| `student4` | `STUDENT` | `STU104` | Pending fee balance (Ananya Roy) |
| `student5` | `STUDENT` | `STU105` | Pending assignments (Vikram Singh) |
| `student6` | `STUDENT` | `STU106` | Upcoming mid-term exams (Sneha Reddy) |
| `parent1` | `PARENT` | `P201` | Parent of STU101 |
| `parent2` | `PARENT` | `P202` | Parent of STU102 |
| `admin` | `ADMIN` | `A301` | Administrator |

---

## 📂 Documentation Links
- [API Documentation](docs/API_DOCUMENTATION.md)
- [Architecture & Design](docs/ARCHITECTURE.md)
- [WhatsApp Integration Plan](docs/WHATSAPP_INTEGRATION.md)
