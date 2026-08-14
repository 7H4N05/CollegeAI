# CollegeAI

Welcome to the **CollegeAI** project! This repository contains the code for a personalized AI college companion for students and parents.

---

## Repository Structure

- `frontend/`: React + Vite web application (Member 2).
- `docs/`: System documentation and API contracts.
- `docs/api_contract.md`: Endpoint specifications for Backend (Member 1) & Database/Auth (Member 3).

---

## Frontend Setup & Run Instructions

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
- Set `VITE_USE_MOCK_API=true` to run the application fully in offline mockup mode (ideal for hackathon presentation and standalone frontend development).
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

## Hackathon Demo Personas

When running in Mock Mode, you can bypass manual logins using the **Demo Console** floating in the bottom-right corner. It allows hot-swapping between the following preset personas:

1. **Aarav Sharma (Student/Parent)**: Satisfactory attendance (88%), fees fully cleared, zero pending tasks.
2. **Sneha Patel (Student/Parent)**: Borderline attendance (76%), 1 pending assignment.
3. **Rohan Das (Student/Parent)**: Critical attendance (68%), pending fees of ₹25,000, multiple pending assignments.
4. **Priya Nair (Student/Parent)**: Satisfactory attendance (82%), pending fees of ₹15,000 (past due date).
5. **Aditya Verma (Student/Parent)**: Satisfactory attendance (80%), 2 upcoming exams next week.
6. **Ananya Iyer (Student/Parent)**: Borderline attendance below threshold (74%), high academic CGPA.
7. **System Administrator**: Allows you to modify student attendance records and dispatch new notices dynamically.
