import math
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
from app.models.mock_db import STUDENTS_DB, ATTENDANCE_DB, TIMETABLE_DB
from app.schemas.domain import (
    AttendanceCalcResponse,
    LeaveImpactResponse,
    SubjectLeaveImpact
)

def calculate_attendance_percentage(attended: int, conducted: int) -> float:
    if conducted <= 0:
        return 100.0
    return round((attended / conducted) * 100.0, 2)

def calculate_max_leave_capacity(attended: int, conducted: int, target_pct: float = 75.0) -> int:
    """
    Calculates maximum number of future classes x that can be missed
    while maintaining overall percentage >= target_pct.
    attended / (conducted + x) >= target_pct / 100
    """
    if conducted <= 0:
        return 0
    current_pct = (attended / conducted) * 100.0
    if current_pct < target_pct:
        return 0
    
    target_decimal = target_pct / 100.0
    # x <= (attended / target_decimal) - conducted
    raw_x = (attended / target_decimal) - conducted
    max_x = math.floor(raw_x + 1e-9)
    
    # Safety verification
    while max_x > 0 and (attended / (conducted + max_x)) < target_decimal - 1e-9:
        max_x -= 1
        
    return max(0, max_x)

def calculate_classes_needed(attended: int, conducted: int, target_pct: float = 80.0) -> int:
    """
    Calculates consecutive classes y that student must attend to reach target_pct.
    (attended + y) / (conducted + y) >= target_pct / 100
    """
    if conducted <= 0:
        return 0
    current_pct = (attended / conducted) * 100.0
    if current_pct >= target_pct:
        return 0
    
    if target_pct >= 100.0:
        if attended == conducted:
            return 0
        return 9999 # Impossible if any missed class exists
        
    target_decimal = target_pct / 100.0
    # y * (1 - target_decimal) >= (target_decimal * conducted) - attended
    numerator = (target_decimal * conducted) - attended
    denominator = 1.0 - target_decimal
    raw_y = numerator / denominator
    needed_y = math.ceil(raw_y - 1e-9)
    
    # Safety verification
    while (attended + needed_y) / (conducted + needed_y) < target_decimal - 1e-9:
        needed_y += 1
        
    return max(0, needed_y)

def calculate_attendance_metrics(attended: int, conducted: int, target_pct: float = 75.0) -> AttendanceCalcResponse:
    current_pct = calculate_attendance_percentage(attended, conducted)
    max_missable = calculate_max_leave_capacity(attended, conducted, target_pct)
    classes_needed = calculate_classes_needed(attended, conducted, target_pct=80.0)
    
    if current_pct >= 85.0:
        status = "EXCELLENT"
        summary = f"Your attendance is {current_pct}%. You can miss up to {max_missable} classes while maintaining >= {target_pct}%."
    elif current_pct >= target_pct:
        status = "SAFE"
        summary = f"Your attendance is {current_pct}%. You can miss up to {max_missable} classes before dropping below {target_pct}%."
    else:
        status = "WARNING"
        summary = f"Your attendance is currently {current_pct}% (below target {target_pct}%). You must attend the next {calculate_classes_needed(attended, conducted, target_pct)} consecutive classes to reach {target_pct}%."
        
    return AttendanceCalcResponse(
        attended=attended,
        conducted=conducted,
        current_percentage=current_pct,
        target_percentage=target_pct,
        max_classes_can_miss=max_missable,
        classes_needed_to_reach_target=classes_needed,
        status=status,
        summary_message=summary
    )

def calculate_leave_impact_for_dates(student_id: str, start_date_str: str, end_date_str: str) -> LeaveImpactResponse:
    """
    Calculates exact impact of taking leave between start_date and end_date based on timetable.
    """
    student = STUDENTS_DB.get(student_id.upper())
    if not student:
        # Fallback default student
        student = STUDENTS_DB["STU101"]
        
    student_records = ATTENDANCE_DB.get(student["student_id"], [])
    
    # Parse dates
    try:
        start_date = datetime.strptime(start_date_str, "%Y-%m-%d")
        end_date = datetime.strptime(end_date_str, "%Y-%m-%d")
    except ValueError:
        # If invalid date format, assume 3 days leave from today
        start_date = datetime.now()
        end_date = start_date + timedelta(days=2)

    total_days = (end_date - start_date).days + 1
    
    # Map section timetable
    section_key = f"{student.get('branch', 'CSE')[:2].upper()}-{student.get('section', 'A')}"
    if section_key not in TIMETABLE_DB:
        section_key = "CS-A"
        
    weekly_timetable = TIMETABLE_DB[section_key]
    
    # Count missed classes per subject during leave dates
    classes_missed_per_subject: Dict[str, int] = {}
    current_date = start_date
    while current_date <= end_date:
        day_name = current_date.strftime("%A")
        if day_name in weekly_timetable:
            periods = weekly_timetable[day_name]
            for p in periods:
                code = p["subject_code"]
                classes_missed_per_subject[code] = classes_missed_per_subject.get(code, 0) + 1
        current_date += timedelta(days=1)
        
    total_classes_affected = sum(classes_missed_per_subject.values())
    
    # Build subject impact list
    subject_details: List[SubjectLeaveImpact] = []
    dropping_subjects: List[str] = []
    
    total_curr_att = 0
    total_curr_cond = 0
    total_proj_att = 0
    total_proj_cond = 0
    
    for sub in student_records:
        sub_code = sub["subject_code"]
        sub_name = sub["subject_name"]
        curr_att = sub["attended"]
        curr_cond = sub["conducted"]
        
        missed = classes_missed_per_subject.get(sub_code, 0)
        proj_att = curr_att # missed classes mean attended doesn't increase
        proj_cond = curr_cond + missed # but conducted increases!
        
        curr_pct = calculate_attendance_percentage(curr_att, curr_cond)
        proj_pct = calculate_attendance_percentage(proj_att, proj_cond)
        
        drops_below = (curr_pct >= 75.0 and proj_pct < 75.0) or (proj_pct < 75.0)
        if drops_below:
            dropping_subjects.append(f"{sub_name} ({proj_pct}%)")
            
        total_curr_att += curr_att
        total_curr_cond += curr_cond
        total_proj_att += proj_att
        total_proj_cond += proj_cond
        
        subject_details.append(SubjectLeaveImpact(
            subject_code=sub_code,
            subject_name=sub_name,
            current_attended=curr_att,
            current_conducted=curr_cond,
            classes_in_leave_period=missed,
            projected_attended=proj_att,
            projected_conducted=proj_cond,
            current_percentage=curr_pct,
            projected_percentage=proj_pct,
            drops_below_75=drops_below
        ))
        
    curr_overall_pct = calculate_attendance_percentage(total_curr_att, total_curr_cond)
    proj_overall_pct = calculate_attendance_percentage(total_proj_att, total_proj_cond)
    
    if dropping_subjects:
        recommendation = f"CAUTION: Taking leave from {start_date_str} to {end_date_str} will drop your attendance in {', '.join(dropping_subjects)}. Consider attending classes on days with heavy period schedules."
    else:
        recommendation = f"SAFE: Your projected attendance remains at {proj_overall_pct}%, which is above the 75% threshold."
        
    return LeaveImpactResponse(
        student_id=student["student_id"],
        start_date=start_date_str,
        end_date=end_date_str,
        total_days=total_days,
        total_classes_affected=total_classes_affected,
        current_overall_percentage=curr_overall_pct,
        projected_overall_percentage=proj_overall_pct,
        subjects_dropping_below_75=dropping_subjects,
        subject_details=subject_details,
        recommendation=recommendation
    )

def find_optimal_leave_period(student_id: str, num_days: int = 5) -> Dict[str, Any]:
    """
    Evaluates timetable across the next 21 days to find the single BEST window
    of num_days duration that minimizes missed periods and maximizes projected attendance.
    """
    best_res = None
    best_pct = -1.0
    best_classes = 9999
    
    worst_res = None
    worst_pct = 101.0

    today = datetime.now()
    
    # Evaluate starting windows for next 21 days
    for start_offset in range(1, 22):
        start_dt = today + timedelta(days=start_offset)
        end_dt = start_dt + timedelta(days=num_days - 1)
        
        start_str = start_dt.strftime("%Y-%m-%d")
        end_str = end_dt.strftime("%Y-%m-%d")
        
        res = calculate_leave_impact_for_dates(student_id, start_str, end_str)
        proj_pct = res.projected_overall_percentage
        classes_missed = res.total_classes_affected
        
        # Best criteria: highest projected percentage, fewer missed classes
        if proj_pct > best_pct or (proj_pct == best_pct and classes_missed < best_classes):
            best_pct = proj_pct
            best_classes = classes_missed
            best_res = {
                "start_date": start_str,
                "end_date": end_str,
                "start_day_name": start_dt.strftime("%A"),
                "end_day_name": end_dt.strftime("%A"),
                "projected_percentage": proj_pct,
                "classes_affected": classes_missed,
                "dropping_subjects": res.subjects_dropping_below_75
            }
            
        # Worst criteria: lowest projected percentage
        if proj_pct < worst_pct:
            worst_pct = proj_pct
            worst_res = {
                "start_date": start_str,
                "end_date": end_str,
                "start_day_name": start_dt.strftime("%A"),
                "end_day_name": end_dt.strftime("%A"),
                "projected_percentage": proj_pct,
                "classes_affected": classes_missed,
                "dropping_subjects": res.subjects_dropping_below_75
            }
            
    return {
        "student_id": student_id,
        "num_days": num_days,
        "best_window": best_res,
        "worst_window": worst_res
    }

