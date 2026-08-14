from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from database.repositories import AcademicRepository, StudentRepository

class MarksCalculator:
    @staticmethod
    def calculate_required_end_sem_marks(
        current_internal_marks: float,
        internal_max_marks: float,
        internal_weightage_pct: float = 40.0,
        end_sem_weightage_pct: float = 60.0,
        target_overall_pct: float = 80.0,
        end_sem_max_marks: float = 100.0
    ) -> Dict[str, Any]:
        """
        Calculates required end-sem marks out of end_sem_max_marks to achieve overall target percentage.
        Overall % = (Internal % * Internal_Weight) + (End_Sem % * End_Sem_Weight)
        Target_Overall = (internal_obtained / internal_max * internal_weight) + (required_end_sem / end_sem_max * end_sem_weight)
        """
        internal_pct = (current_internal_marks / internal_max_marks * 100.0) if internal_max_marks > 0 else 0.0
        internal_contrib = (internal_pct * (internal_weightage_pct / 100.0))

        needed_end_sem_contrib = target_overall_pct - internal_contrib
        needed_end_sem_pct = (needed_end_sem_contrib / (end_sem_weightage_pct / 100.0)) if end_sem_weightage_pct > 0 else 0.0

        required_raw_marks = (needed_end_sem_pct / 100.0) * end_sem_max_marks
        required_raw_marks = round(required_raw_marks, 2)

        is_achievable = required_raw_marks <= end_sem_max_marks

        status_msg = ""
        if required_raw_marks <= 0:
            status_msg = f"You already have enough internal marks to achieve {target_overall_pct}% target!"
        elif is_achievable:
            status_msg = f"You need at least {required_raw_marks} out of {end_sem_max_marks} in the end semester exam."
        else:
            status_msg = f"Target {target_overall_pct}% is mathematically unachievable as you would need {required_raw_marks} out of {end_sem_max_marks}."

        return {
            "current_internal_marks": current_internal_marks,
            "internal_max_marks": internal_max_marks,
            "internal_percentage": round(internal_pct, 2),
            "target_overall_percentage": target_overall_pct,
            "required_end_sem_marks": max(0.0, min(end_sem_max_marks, required_raw_marks)),
            "required_raw_marks": required_raw_marks,
            "end_sem_max_marks": end_sem_max_marks,
            "is_achievable": is_achievable,
            "status_message": status_msg
        }

    @staticmethod
    def calculate_subject_required_marks(
        db: Session,
        student_id: str,
        subject_id: str,
        target_overall_pct: float = 80.0
    ) -> Dict[str, Any]:
        """Calculates required end-sem marks for a student's specific subject using actual DB marks records."""
        academic_repo = AcademicRepository(db)
        all_marks = academic_repo.get_marks(student_id)

        subject_marks = [m for m in all_marks if m["subject_id"] == subject_id]

        total_internal_obtained = 0.0
        total_internal_max = 0.0

        for m in subject_marks:
            if m["exam_type"] != "END_SEM":
                total_internal_obtained += m["marks_obtained"]
                total_internal_max += m["max_marks"]

        if total_internal_max == 0.0:
            total_internal_max = 100.0

        return MarksCalculator.calculate_required_end_sem_marks(
            current_internal_marks=total_internal_obtained,
            internal_max_marks=total_internal_max,
            internal_weightage_pct=40.0,
            end_sem_weightage_pct=60.0,
            target_overall_pct=target_overall_pct,
            end_sem_max_marks=100.0
        )
