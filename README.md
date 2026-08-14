# CollegeAI 🎓🤖

Welcome to the **CollegeAI** project! This repository contains the code for a personalized AI college companion for students and parents.

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

## Repository Structure

- `frontend/`: React + Vite web application (Member 2).
- `docs/`: System documentation and API contracts.
- `docs/api_contract.md`: Endpoint specifications for Backend (Member 1) & Database/Auth (Member 3).

---

## 💻 Frontend Setup & Run Instructions

To run the frontend React application locally:

### 1. Prerequisites
Ensure you have **Node.js (v18+)** and **npm** installed.

### 2. Installation
Navigate into the `frontend/` directory and install the packages:
```bash
cd frontend
npm install
```

### 3. Environment Variables
Create a `.env` file in the `frontend/` directory (copied from `.env.example`):
```env
VITE_API_BASE_URL=/api
VITE_USE_MOCK_API=true
```
- Set `VITE_USE_MOCK_API=true` to run the application fully in offline mockup mode.
- Set `VITE_USE_MOCK_API=false` to connect to the live Python FastAPI backend.

### 4. Run Development Server
Start the local server on port 3000:
```bash
npm run dev
```

### 5. Run Calculations Tests
Execute the mathematical validation tests for attendance and leave capacity formulas:
```bash
npm run test
```

---

## 🚀 Backend Quick Start Guide

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

## 🎭 Hackathon Demo Personas

When running in Mock Mode, you can bypass manual logins using the **Demo Console** floating in the bottom-right corner. It allows hot-swapping between the following preset personas:

1. **Aarav Sharma (Student/Parent)**: Satisfactory attendance (88%), fees fully cleared, zero pending tasks.
2. **Sneha Patel (Student/Parent)**: Borderline attendance (76%), 1 pending assignment.
3. **Rohan Das (Student/Parent)**: Critical attendance (68%), pending fees of ₹25,000, multiple pending assignments.
4. **Priya Nair (Student/Parent)**: Satisfactory attendance (82%), pending fees of ₹15,000 (past due date).
5. **Aditya Verma (Student/Parent)**: Satisfactory attendance (80%), 2 upcoming exams next week.
6. **Ananya Iyer (Student/Parent)**: Borderline attendance below threshold (74%), high academic CGPA.
7. **System Administrator**: Allows you to modify student attendance records and dispatch new notices dynamically.

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
