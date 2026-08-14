# 🚀 CollegeAI Demo Guide

Welcome to the CollegeAI Demo! This guide will walk you through the steps to set up and run the full stack application (Frontend + Backend) for your presentation or hackathon showcase.

---

## 1️⃣ Quick Start (Mock Mode)

If you just want to demo the frontend interfaces without running the Python backend (perfect for quick presentations), you can use the built-in mock mode.

1. **Navigate to the frontend folder**:
   ```bash
   cd frontend
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   Open the `.env` file and ensure mock mode is enabled:
   ```env
   VITE_API_BASE_URL=/api
   VITE_USE_MOCK_API=true
   ```
4. **Start the Frontend Development Server**:
   ```bash
   npm run dev
   ```
5. **Access the Demo**: Open [http://localhost:5173](http://localhost:5173) (or the port specified in your terminal) in your browser. 
   - *Tip: In Mock Mode, you can use the floating **Demo Console** in the bottom-right corner to hot-swap between different student personas instantly without needing to log in.*

---

## 2️⃣ Full Stack Setup (Live Backend API)

To run the full application with the real Python FastAPI backend and AI integration:

### Step 1: Start the Backend (Terminal 1)
1. **Navigate to the root directory** (`CollegeAI`).
2. **Set up the backend environment**:
   ```bash
   cp .env.example .env
   ```
   *(Ensure you add your OpenAI/LLM API keys to the `.env` file if you plan to demo the AI Assistant features).*
3. **Run the FastAPI Server**:
   ```bash
   python -m uvicorn backend.app.main:app --reload --port 8000
   ```
   - The backend API will be running at [http://localhost:8000](http://localhost:8000).
   - API Documentation (Swagger UI) is available at [http://localhost:8000/docs](http://localhost:8000/docs).

### Step 2: Start the Frontend (Terminal 2)
1. **Navigate to the frontend folder**:
   ```bash
   cd frontend
   ```
2. **Install Dependencies** (if you haven't already):
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Create a `.env` file and point it to the live backend:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api/v1
   VITE_USE_MOCK_API=false
   ```
4. **Start the Frontend Development Server**:
   ```bash
   npm run dev
   ```

---

## 3️⃣ Demo Login Credentials

You can log in to the application using any of our preset test accounts. **All test accounts use the password:** `password123`

### Highlights
- **Student Profile**: Log in as `student1` (`aarav.sharma@college.edu`) to view a profile with high attendance.
- **Parent Profile**: Log in as `parent2` to see the Parent Dashboard (authorized to view student2's data).
- **Admin Profile**: Log in as `admin` (`admin@college.edu`) to see system-wide management features.

For a full list of all available test personas (Students with low attendance, pending fees, etc.), please refer to the detailed credentials list here:
👉 [**View Full Demo Credentials**](docs/demo_credentials.md)

---

## 4️⃣ What to Showcase in the Demo

To get the most out of your demo, we recommend showcasing these key features:

1. **Role-Based Access Control**: Log in as a Student, then log out and log in as a Parent to show the difference in dashboards and authorized data views.
2. **Deterministic Calculation Engines**:
   - Go to the **Attendance** section and show the "Max Missable Classes" and "Classes Needed" logic.
   - Go to the **Academics** section and use the "Marks Target Engine" to calculate required end-semester scores.
3. **AI Assistant integration**:
   - Open the chat interface and ask a question like: *"How many classes can I skip next week?"* or *"What is my current fee balance?"*
   - Highlight how the AI securely calls backend tools instead of hallucinating data.

Good luck with your demo! 🎉
