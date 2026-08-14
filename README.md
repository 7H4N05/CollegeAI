# CollegeAI Backend Service

**CollegeAI** is a personalized AI college companion for **students and parents**. It combines role-based access control, real college data retrieval, deterministic academic calculation engines, and natural-language AI response generation.

---

## 🌟 Key Features

1. **Role-Based Authorization**:
   - **Students**: Access personal attendance, marks, fees, timetable, and exams.
   - **Parents**: Access verified data for authorized children only (Strict 403 authorization guard).
   - **Admin**: System data administration.

2. **Deterministic Calculation Engines**:
   - **Attendance Engine**: Calculates exact current %, maximum leave capacity $x$ ($attended / (conducted + x) \ge 0.75$), and consecutive classes needed $y$ to reach target %.
   - **Leave Impact Projection**: Uses timetable schedules to calculate exact per-subject attendance drop during planned leave dates.
   - **Marks Target Engine**: Calculates required end-semester exam score (out of 60) to achieve target grade or CGPA.

3. **AI Function Calling Layer**:
   - Isolates LLM behind structured tool calling (`get_student_profile`, `get_attendance`, `calculate_leave_impact`, `get_marks`, `get_fees`, `get_announcements`).
   - Prevents AI hallucination of grades, attendance, or fees.

4. **API-First Architecture**:
   - Fully decoupled REST endpoints ready for React Frontend (Member 2) and Meta WhatsApp Webhook integration.

---

## 🚀 Quickstart & Server Launch

### 1. Environment Setup
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```

### 2. Run Locally with Python
```bash
cd backend
python -m uvicorn app.main:app --reload --port 8000
```
- Open Interactive API Docs: `http://localhost:8000/docs`

### 3. Run Automated Tests
```bash
python backend/tests/run_tests.py
```

### 4. Run with Docker Compose
```bash
docker-compose up --build
```

---

## 🧪 Demo Login Credentials

| Username | Password | Role | Entity ID | Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `student1` | `password123` | `STUDENT` | `STU101` | High attendance (Rahul Sharma, 88%) |
| `student2` | `password123` | `STUDENT` | `STU102` | Borderline attendance (Priya Patel, 76%, 41/50 DSA) |
| `student3` | `password123` | `STUDENT` | `STU103` | Low attendance (Amit Kumar, 64%) |
| `student4` | `password123` | `STUDENT` | `STU104` | Pending fee balance (Ananya Roy) |
| `student5` | `password123` | `STUDENT` | `STU105` | Pending assignments (Vikram Singh) |
| `student6` | `password123` | `STUDENT` | `STU106` | Upcoming mid-term exams (Sneha Reddy) |
| `parent1` | `password123` | `PARENT` | `P201` | Parent of STU101 |
| `parent2` | `password123` | `PARENT` | `P202` | Parent of STU102 |
| `admin` | `password123` | `ADMIN` | `A301` | Administrator |

---

## 📂 Documentation Links
- [API Documentation](docs/API_DOCUMENTATION.md)
- [Architecture & Design](docs/ARCHITECTURE.md)
- [WhatsApp Integration Plan](docs/WHATSAPP_INTEGRATION.md)
