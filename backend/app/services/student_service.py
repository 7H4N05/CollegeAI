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

def get_student_profile_data(student_id: str) -> StudentProfile:
    student = STUDENTS_DB.get(student_id.upper())
    if not student:
        raise ValueError(f"Student with ID '{student_id}' not found")
    return StudentProfile(**student)

def get_student_attendance_data(student_id: str) -> OverallAttendance:
    student_id_clean = student_id.upper()
    student = STUDENTS_DB.get(student_id_clean)
    student_name = student["name"] if student else "Student"
    
    records = ATTENDANCE_DB.get(student_id_clean, [])
    
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
        student_id=student_id_clean,
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
    student_id_clean = student_id.upper()
    student = STUDENTS_DB.get(student_id_clean)
    student_name = student["name"] if student else "Student"
    cgpa = student["cgpa"] if student else 0.0
    
    records = MARKS_DB.get(student_id_clean, [])
    marks_list: List[SubjectMark] = []
    
    for r in records:
        tot_internal = r["internal_1"] + r["internal_2"] + r["assignment_score"]
        curr_pct = round((tot_internal / 40.0) * 100.0, 2)
        
        needed_A = calculate_required_endsem_marks(student_id_clean, r["subject_code"], 80.0).required_endsem_marks
        needed_B = calculate_required_endsem_marks(student_id_clean, r["subject_code"], 70.0).required_endsem_marks
        
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
        student_id=student_id_clean,
        student_name=student_name,
        cgpa=cgpa,
        marks=marks_list
    )

def get_student_timetable_data(student_id: str, day_filter: Optional[str] = None) -> List[DayTimetable]:
    student = STUDENTS_DB.get(student_id.upper())
    branch = student.get("branch", "Computer Science") if student else "Computer Science"
    section = student.get("section", "A") if student else "A"
    
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
    records = EXAMINATIONS_DB.get(student_id.upper(), [])
    return [Examination(**r) for r in records]

def get_student_assignments_data(student_id: str) -> List[Assignment]:
    records = ASSIGNMENTS_DB.get(student_id.upper(), [])
    return [Assignment(**r) for r in records]

def get_student_fees_data(student_id: str) -> FeeStructure:
    student_id_clean = student_id.upper()
    fee_record = FEES_DB.get(student_id_clean)
    if not fee_record:
        # Default fully paid fee record if not explicitly listed as pending
        student = STUDENTS_DB.get(student_id_clean, {})
        return FeeStructure(
            student_id=student_id_clean,
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
