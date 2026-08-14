import math
import datetime
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from database.repositories import AcademicRepository, StudentRepository

class AttendanceCalculator:
    @staticmethod
    def calculate_current_stats(attended: int, conducted: int) -> Dict[str, Any]:
        """Calculates current attendance percentage."""
        if conducted <= 0:
            return {"conducted": 0, "attended": 0, "percentage": 0.0}
        
        pct = round((attended / conducted * 100.0), 2)
        return {
            "conducted": conducted,
            "attended": attended,
            "percentage": pct
        }

    @staticmethod
    def calculate_leave_capacity(attended: int, conducted: int, target_threshold: float = 75.0) -> Dict[str, Any]:
        """
        Calculates maximum number of future classes x that can be missed while maintaining >= target_threshold (e.g. 75%).
        41 / (50 + x) >= 0.75  =>  50 + x <= 41 / 0.75  => x <= floor(41/0.75 - 50)
        """
        threshold_decimal = target_threshold / 100.0
        current_pct = round((attended / conducted * 100.0), 2) if conducted > 0 else 0.0

        if conducted <= 0 or current_pct < target_threshold:
            return {
                "current_percentage": current_pct,
                "target_threshold": target_threshold,
                "max_missable_classes": 0,
                "can_take_leave": False,
                "status_message": f"Current attendance ({current_pct}%) is already below target threshold ({target_threshold}%)."
            }

        # Max total conducted classes allowed to maintain threshold
        max_total_conducted = math.floor(attended / threshold_decimal)
        max_missable = max(0, max_total_conducted - conducted)

        return {
            "current_percentage": current_pct,
            "target_threshold": target_threshold,
            "max_missable_classes": max_missable,
            "can_take_leave": max_missable > 0,
            "status_message": f"You can miss up to {max_missable} classes while maintaining at least {target_threshold}% attendance."
        }

    @staticmethod
    def calculate_required_classes(attended: int, conducted: int, target_threshold: float = 80.0) -> Dict[str, Any]:
        """
        Calculates minimum consecutive classes y to attend to reach target_threshold (e.g. 80%).
        (attended + y) / (conducted + y) >= T  => y >= ceil((T * conducted - attended) / (1 - T))
        """
        threshold_decimal = target_threshold / 100.0
        current_pct = round((attended / conducted * 100.0), 2) if conducted > 0 else 0.0

        if current_pct >= target_threshold:
            return {
                "current_percentage": current_pct,
                "target_threshold": target_threshold,
                "required_consecutive_classes": 0,
                "status_message": f"Current attendance ({current_pct}%) is already at or above target threshold ({target_threshold}%)."
            }

        numerator = (threshold_decimal * conducted) - attended
        denominator = 1.0 - threshold_decimal

        required_y = math.ceil(numerator / denominator)
        required_y = max(0, required_y)

        # Projected percentage after attending required classes
        projected_pct = round(((attended + required_y) / (conducted + required_y) * 100.0), 2)

        return {
            "current_percentage": current_pct,
            "target_threshold": target_threshold,
            "required_consecutive_classes": required_y,
            "projected_percentage": projected_pct,
            "status_message": f"You need to attend {required_y} consecutive classes to reach {target_threshold}% attendance."
        }

    @staticmethod
    def project_leave_impact(
        db: Session,
        student_id: str,
        start_date: datetime.date,
        end_date: datetime.date,
        target_threshold: float = 75.0
    ) -> Dict[str, Any]:
        """
        Evaluates exact timetable classes affected by planned leave between start_date and end_date (inclusive),
        calculating projected attendance by subject and flagging any subject falling below target_threshold.
        """
        student_repo = StudentRepository(db)
        academic_repo = AcademicRepository(db)

        student = student_repo.get_by_id(student_id)
        if not student:
            return {"error": f"Student ID '{student_id}' not found."}

        # Current summary per subject
        curr_summary = academic_repo.get_attendance_summary(student_id)
        timetable_slots = academic_repo.get_timetable(student.department, student.semester, student.section)

        # Map weekday string to weekday number (Monday=0 ... Sunday=6)
        day_map = {
            "MONDAY": 0, "TUESDAY": 1, "WEDNESDAY": 2,
            "THURSDAY": 3, "FRIDAY": 4, "SATURDAY": 5, "SUNDAY": 6
        }

        # Count classes per subject affected by the leave dates
        classes_missed_per_subject: Dict[str, int] = {}
        total_missed_classes = 0

        curr_date = start_date
        one_day = datetime.timedelta(days=1)

        while curr_date <= end_date:
            weekday_idx = curr_date.weekday()
            # Find timetable slots matching weekday
            for slot in timetable_slots:
                slot_day = slot["day_of_week"].upper()
                if day_map.get(slot_day) == weekday_idx:
                    subj_id = slot["subject_id"]
                    classes_missed_per_subject[subj_id] = classes_missed_per_subject.get(subj_id, 0) + 1
                    total_missed_classes += 1

            curr_date += one_day

        # Compute projected stats for each subject
        subject_projections = []
        at_risk_subjects = []

        overall_curr_attended = curr_summary["overall_attended"]
        overall_curr_conducted = curr_summary["overall_conducted"]

        for subj_stats in curr_summary["subject_wise"]:
            subj_id = subj_stats["subject_id"]
            missed = classes_missed_per_subject.get(subj_id, 0)

            c_conducted = subj_stats["conducted"]
            c_attended = subj_stats["attended"]
            c_pct = subj_stats["attendance_percentage"]

            p_conducted = c_conducted + missed
            p_attended = c_attended  # Assuming missed classes are ABSENT
            p_pct = round((p_attended / p_conducted * 100.0), 2) if p_conducted > 0 else 0.0

            is_below = p_pct < target_threshold

            proj_item = {
                "subject_id": subj_id,
                "subject_code": subj_stats["subject_code"],
                "subject_name": subj_stats["subject_name"],
                "current_conducted": c_conducted,
                "current_attended": c_attended,
                "current_percentage": c_pct,
                "classes_missed_on_leave": missed,
                "projected_conducted": p_conducted,
                "projected_attended": p_attended,
                "projected_percentage": p_pct,
                "falls_below_threshold": is_below
            }

            subject_projections.append(proj_item)

            if is_below:
                at_risk_subjects.append(proj_item)

        overall_proj_conducted = overall_curr_conducted + total_missed_classes
        overall_proj_attended = overall_curr_attended
        overall_proj_pct = round((overall_proj_attended / overall_proj_conducted * 100.0), 2) if overall_proj_conducted > 0 else 0.0

        can_safe_leave = len(at_risk_subjects) == 0

        return {
            "student_id": student_id,
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
            "total_classes_missed": total_missed_classes,
            "overall_current_percentage": curr_summary["overall_percentage"],
            "overall_projected_percentage": overall_proj_pct,
            "can_take_leave_safely": can_safe_leave,
            "at_risk_subjects_count": len(at_risk_subjects),
            "at_risk_subjects": at_risk_subjects,
            "subject_projections": subject_projections
        }
