from typing import Dict, Any, List, Optional
from app.models.mock_db import (
    STUDENTS_DB, ATTENDANCE_DB, MARKS_DB,
    TIMETABLE_DB, EXAMINATIONS_DB, ASSIGNMENTS_DB, FEES_DB
)
from app.schemas.domain import (
    StudentProfile, OverallAttendance, SubjectAttendance,
    StudentMarksOverview, SubjectMark, DayTimetable, TimetablePeriod,
    Examination, Assignment, FeeStructure
)
from app.services.attendance_engine import (
    calculate_attendance_percentage,
    calculate_max_leave_capacity,
    calculate_classes_needed
)
from app.services.marks_engine import calculate_required_endsem_marks

def normalize_student_id(student_id: str) -> str:
    clean = (student_id or "STU101").upper()
    mapping = {
        "STU001": "STU101",
        "STU002": "STU102",
        "STU003": "STU103",
        "STU004": "STU104",
        "STU005": "STU105",
        "STU006": "STU106",
        "STU007": "STU107",
        "STU008": "STU108",
        "STU009": "STU109",
        "STU010": "STU110",
    }
    if clean in STUDENTS_DB:
        return clean
    return mapping.get(clean, clean)

def get_student_profile_data(student_id: str) -> StudentProfile:
    target_id = normalize_student_id(student_id)
    student = STUDENTS_DB.get(target_id) or list(STUDENTS_DB.values())[0]
    return StudentProfile(**student)

def get_student_attendance_data(student_id: str) -> OverallAttendance:
    target_id = normalize_student_id(student_id)
    student = STUDENTS_DB.get(target_id) or list(STUDENTS_DB.values())[0]
    student_name = student["name"] if student else "Student"
    
    records = ATTENDANCE_DB.get(target_id) or ATTENDANCE_DB.get("STU101", [])
    
    total_att = sum(r["attended"] for r in records)
    total_cond = sum(r["conducted"] for r in records)
    overall_pct = calculate_attendance_percentage(total_att, total_cond)
    
    overall_status = "SAFE" if overall_pct >= 75.0 else "WARNING"
    max_missable_overall = calculate_max_leave_capacity(total_att, total_cond, 75.0)
    needed_overall_80 = calculate_classes_needed(total_att, total_cond, 80.0)
    
    subjects_list: List[SubjectAttendance] = []
    for r in records:
        pct = calculate_attendance_percentage(r["attended"], r["conducted"])
        sub_status = "EXCELLENT" if pct >= 85.0 else ("SAFE" if pct >= 75.0 else "CRITICAL")
        max_miss = calculate_max_leave_capacity(r["attended"], r["conducted"], 75.0)
        needed_80 = calculate_classes_needed(r["attended"], r["conducted"], 80.0)
        
        subjects_list.append(SubjectAttendance(
            subject_code=r["subject_code"],
            subject_name=r["subject_name"],
            attended=r["attended"],
            conducted=r["conducted"],
            percentage=pct,
            status=sub_status,
            max_missable_classes_75=max_miss,
            classes_needed_80=needed_80
        ))
        
    return OverallAttendance(
        student_id=target_id,
        student_name=student_name,
        total_attended=total_att,
        total_conducted=total_cond,
        overall_percentage=overall_pct,
        status=overall_status,
        max_missable_classes_75=max_missable_overall,
        classes_needed_80=needed_overall_80,
        subjects=subjects_list
    )

def get_student_marks_data(student_id: str) -> StudentMarksOverview:
    target_id = normalize_student_id(student_id)
    student = STUDENTS_DB.get(target_id) or list(STUDENTS_DB.values())[0]
    student_name = student["name"] if student else "Student"
    cgpa = student["cgpa"] if student else 0.0
    
    records = MARKS_DB.get(target_id) or MARKS_DB.get("STU101", [])
    marks_list: List[SubjectMark] = []
    
    for r in records:
        tot_internal = r["internal_1"] + r["internal_2"] + r["assignment_score"]
        curr_pct = round((tot_internal / 40.0) * 100.0, 2)
        
        needed_A = calculate_required_endsem_marks(target_id, r["subject_code"], 80.0).required_endsem_marks
        needed_B = calculate_required_endsem_marks(target_id, r["subject_code"], 70.0).required_endsem_marks
        
        marks_list.append(SubjectMark(
            subject_code=r["subject_code"],
            subject_name=r["subject_name"],
            internal_1=r["internal_1"],
            internal_2=r["internal_2"],
            assignment_score=r["assignment_score"],
            total_internal=tot_internal,
            max_internal=40.0,
            current_percentage=curr_pct,
            target_endsem_needed_for_A=needed_A,
            target_endsem_needed_for_B=needed_B
        ))
        
    return StudentMarksOverview(
        student_id=target_id,
        student_name=student_name,
        cgpa=cgpa,
        marks=marks_list
    )

def get_student_timetable_data(student_id: str, day_filter: Optional[str] = None) -> List[DayTimetable]:
    target_id = normalize_student_id(student_id)
    student = STUDENTS_DB.get(target_id) or {}
    branch = student.get("branch", "Computer Science")
    section = student.get("section", "A")
    
    section_key = f"{branch[:2].upper()}-{section}"
    if section_key not in TIMETABLE_DB:
        section_key = "CS-A"
        
    weekly = TIMETABLE_DB[section_key]
    result: List[DayTimetable] = []
    
    for day, periods in weekly.items():
        if day_filter and day.lower() != day_filter.lower():
            continue
        p_models = [TimetablePeriod(**p) for p in periods]
        result.append(DayTimetable(day=day, periods=p_models))
        
    return result

def get_student_examinations_data(student_id: str) -> List[Examination]:
    target_id = normalize_student_id(student_id)
    records = EXAMINATIONS_DB.get(target_id) or EXAMINATIONS_DB.get("STU101", [])
    return [Examination(**r) for r in records]

def get_student_assignments_data(student_id: str) -> List[Assignment]:
    target_id = normalize_student_id(student_id)
    records = ASSIGNMENTS_DB.get(target_id) or ASSIGNMENTS_DB.get("STU101", [])
    return [Assignment(**r) for r in records]

def get_student_fees_data(student_id: str) -> FeeStructure:
    target_id = normalize_student_id(student_id)
    fee_record = FEES_DB.get(target_id)
    if not fee_record:
        student = STUDENTS_DB.get(target_id, {})
        return FeeStructure(
            student_id=target_id,
            student_name=student.get("name", "Student"),
            tuition_fee_total=75000.0,
            tuition_fee_paid=75000.0,
            tuition_fee_pending=0.0,
            hostel_fee_pending=0.0,
            bus_fee_pending=0.0,
            total_pending_fee=0.0,
            due_date="2026-07-31",
            status="PAID"
        )
    return FeeStructure(**fee_record)
