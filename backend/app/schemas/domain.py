from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

# Authentication Schemas
class LoginRequest(BaseModel):
    username: str
    password: str
    role: Optional[str] = None
    student_id: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    username: str
    name: str
    role: str
    student_id: Optional[str] = None
    authorized_children: List[str] = []

class UserProfile(BaseModel):
    user_id: str
    username: str
    name: str
    email: str
    role: str
    student_id: Optional[str] = None
    authorized_children: List[str] = []

# Student Schemas
class StudentProfile(BaseModel):
    student_id: str
    name: str
    roll_number: str
    branch: str
    section: str
    semester: int
    cgpa: float
    email: str
    phone: str
    parent_name: str
    parent_phone: str

class SubjectAttendance(BaseModel):
    subject_code: str
    subject_name: str
    attended: int
    conducted: int
    percentage: float
    status: str # "SAFE", "WARNING", "CRITICAL"
    max_missable_classes_75: int
    classes_needed_80: int

class OverallAttendance(BaseModel):
    student_id: str
    student_name: str
    total_attended: int
    total_conducted: int
    overall_percentage: float
    status: str
    max_missable_classes_75: int
    classes_needed_80: int
    subjects: List[SubjectAttendance]

class SubjectMark(BaseModel):
    subject_code: str
    subject_name: str
    internal_1: float
    internal_2: float
    assignment_score: float
    total_internal: float
    max_internal: float = 40.0
    current_percentage: float
    target_endsem_needed_for_A: float
    target_endsem_needed_for_B: float

class StudentMarksOverview(BaseModel):
    student_id: str
    student_name: str
    cgpa: float
    marks: List[SubjectMark]

class TimetablePeriod(BaseModel):
    period_number: int
    time_slot: str
    subject_code: str
    subject_name: str
    faculty: str
    room: str

class DayTimetable(BaseModel):
    day: str
    periods: List[TimetablePeriod]

class Examination(BaseModel):
    exam_id: str
    subject_code: str
    subject_name: str
    exam_type: str # "MID_TERM", "END_SEM", "LAB_VIVA"
    date: str
    time: str
    room: str
    max_marks: float

class Assignment(BaseModel):
    assignment_id: str
    subject_code: str
    subject_name: str
    title: str
    due_date: str
    status: str # "PENDING", "SUBMITTED", "OVERDUE"
    max_marks: float

class FeeStructure(BaseModel):
    student_id: str
    student_name: str
    tuition_fee_total: float
    tuition_fee_paid: float
    tuition_fee_pending: float
    hostel_fee_pending: float
    bus_fee_pending: float
    total_pending_fee: float
    due_date: str
    status: str # "PAID", "PARTIAL", "PENDING"

class Announcement(BaseModel):
    announcement_id: str
    title: str
    category: str # "ACADEMIC", "EXAM", "FEE", "GENERAL"
    date: str
    content: str
    target_audience: str # "ALL", "STUDENT", "PARENT"
    important: bool

# Calculation Request/Response Schemas
class AttendanceCalcRequest(BaseModel):
    attended: int = Field(..., ge=0, description="Classes attended")
    conducted: int = Field(..., ge=1, description="Classes conducted")
    target_percentage: float = Field(75.0, ge=0.0, le=100.0, description="Target percentage")

class AttendanceCalcResponse(BaseModel):
    attended: int
    conducted: int
    current_percentage: float
    target_percentage: float
    max_classes_can_miss: int
    classes_needed_to_reach_target: int
    status: str
    summary_message: str

class LeaveImpactRequest(BaseModel):
    student_id: str
    start_date: str # YYYY-MM-DD
    end_date: str # YYYY-MM-DD

class SubjectLeaveImpact(BaseModel):
    subject_code: str
    subject_name: str
    current_attended: int
    current_conducted: int
    classes_in_leave_period: int
    projected_attended: int
    projected_conducted: int
    current_percentage: float
    projected_percentage: float
    drops_below_75: bool

class LeaveImpactResponse(BaseModel):
    student_id: str
    start_date: str
    end_date: str
    total_days: int
    total_classes_affected: int
    current_overall_percentage: float
    projected_overall_percentage: float
    subjects_dropping_below_75: List[str]
    subject_details: List[SubjectLeaveImpact]
    recommendation: str

class RequiredMarksRequest(BaseModel):
    student_id: str
    subject_code: str
    target_final_percentage: float = 80.0

class RequiredMarksResponse(BaseModel):
    student_id: str
    subject_code: str
    subject_name: str
    current_internal_score: float
    max_internal: float
    max_endsem: float
    target_final_percentage: float
    required_endsem_marks: float
    is_achievable: bool
    advice: str

# Conversational Chat Schemas
class ChatRequest(BaseModel):
    message: str
    student_id: Optional[str] = None # Explicit target student ID if parent or admin

class ChatResponse(BaseModel):
    reply: str
    user_role: str
    student_id: Optional[str] = None
    intent_detected: Optional[str] = None
    tools_called: List[str] = []
    structured_data: Optional[Dict[str, Any]] = None
