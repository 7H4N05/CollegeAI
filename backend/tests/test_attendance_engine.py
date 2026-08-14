import pytest
from app.services.attendance_engine import (
    calculate_attendance_percentage,
    calculate_max_leave_capacity,
    calculate_classes_needed,
    calculate_attendance_metrics,
    calculate_leave_impact_for_dates
)

def test_attendance_percentage():
    assert calculate_attendance_percentage(41, 50) == 82.0
    assert calculate_attendance_percentage(38, 50) == 76.0
    assert calculate_attendance_percentage(32, 50) == 64.0
    assert calculate_attendance_percentage(0, 0) == 100.0

def test_prompt_example_41_50_attendance():
    # Prompt specification test:
    # attended = 41, conducted = 50 -> 82%
    # 41 / (50 + x) >= 0.75 -> x = 4 maximum missable classes
    attended = 41
    conducted = 50
    
    current_pct = calculate_attendance_percentage(attended, conducted)
    assert current_pct == 82.0
    
    max_missable_75 = calculate_max_leave_capacity(attended, conducted, 75.0)
    assert max_missable_75 == 4
    
    # Verify math: 41 / (50 + 4) = 41 / 54 = 75.92% >= 75%
    # If 5 classes missed: 41 / 55 = 74.54% < 75%
    assert (41 / (50 + max_missable_75)) >= 0.75
    assert (41 / (50 + max_missable_75 + 1)) < 0.75
    
    # Classes needed to reach 80%: 0 (already 82%)
    needed_80 = calculate_classes_needed(attended, conducted, 80.0)
    assert needed_80 == 0
    
    # Classes needed to reach 90%:
    # (41 + y) / (50 + y) >= 0.90 -> 41 + y >= 45 + 0.9y -> 0.1y >= 4 -> y = 40
    needed_90 = calculate_classes_needed(attended, conducted, 90.0)
    assert needed_90 == 40
    assert (41 + 40) / (50 + 40) == 0.90

def test_low_attendance_32_50():
    # 32/50 = 64% (below 75%)
    attended = 32
    conducted = 50
    
    current_pct = calculate_attendance_percentage(attended, conducted)
    assert current_pct == 64.0
    
    max_missable_75 = calculate_max_leave_capacity(attended, conducted, 75.0)
    assert max_missable_75 == 0
    
    # Needed to reach 75%:
    # (32 + y) / (50 + y) >= 0.75 -> 32 + y >= 37.5 + 0.75y -> 0.25y >= 5.5 -> y = 22
    needed_75 = calculate_classes_needed(attended, conducted, 75.0)
    assert needed_75 == 22
    assert (32 + 22) / (50 + 22) >= 0.75

def test_leave_impact_with_timetable():
    res = calculate_leave_impact_for_dates("STU102", "2026-08-17", "2026-08-19")
    assert res.student_id == "STU102"
    assert res.total_days == 3
    assert res.total_classes_affected > 0
    assert res.current_overall_percentage > 0
