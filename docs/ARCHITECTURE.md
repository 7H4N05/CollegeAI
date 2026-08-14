# CollegeAI System Architecture

## Overview
CollegeAI is built with an **API-First Clean Architecture** separating identity, role-based authorization, deterministic math engines, data services, and AI orchestration.

```
CollegeAI Backend System
├── app/
│   ├── main.py            # FastAPI entry point & CORS
│   ├── core/              # Security, JWT auth, exceptions, config
│   ├── schemas/           # Pydantic request/response schemas
│   ├── models/            # Seed database models & mock DB
│   ├── services/          # Business logic & calculation engines
│   │   ├── attendance_engine.py  # Attendance, leave capacity, timetable impact
│   │   ├── marks_engine.py       # Internal marks & target endsem calculations
│   │   ├── student_service.py    # Student profile, attendance, marks, fees
│   │   └── parent_service.py     # Parent authorization & child summary
│   ├── tools/             # AI Function calling registry
│   ├── ai/                # LLM provider & agent orchestrator
│   └── api/v1/            # REST API routers
```

## Security & Role-Based Access Control (RBAC)
- **Roles**: `STUDENT`, `PARENT`, `ADMIN`.
- **Enforcement**: Every data access function verifies user role and ownership.
- **Parent Validation**: Parents can ONLY query data for children listed in `authorized_children`. Attempting to access unauthorized student records raises an immediate `HTTP 403 Forbidden` error.

## Deterministic Math Calculations
LLMs are prone to arithmetic errors. To ensure absolute reliability:
1. **Max Leave Capacity**:
   $$\text{Max Missable Classes } x = \left\lfloor \frac{\text{Attended}}{0.75} - \text{Conducted} \right\rfloor$$
2. **Classes Needed to Reach Target**:
   $$\text{Classes Needed } y = \left\lceil \frac{\text{Target} \times \text{Conducted} - 100 \times \text{Attended}}{100 - \text{Target}} \right\rceil$$
3. **Leave Impact**: Look up student section timetable, map exact periods missed per subject, project new attendance percentage per subject, and highlight subjects dropping below 75%.
