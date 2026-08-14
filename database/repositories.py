from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_
import datetime

from database.models import (
    User, Student, Parent, ParentStudentRelationship, Subject,
    Attendance, Timetable, Mark, Examination, Assignment,
    StudentAssignment, Fee, Announcement, AttendanceStatus
)

class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, user_id: str) -> Optional[User]:
        return self.db.query(User).filter(User.id == user_id).first()

    def get_by_email(self, email: str) -> Optional[User]:
        return self.db.query(User).filter(func.lower(User.email) == email.lower()).first()

    def create(self, user_id: str, email: str, password_hash: str, full_name: str, role: str) -> User:
        user = User(
            id=user_id,
            email=email.lower(),
            password_hash=password_hash,
            full_name=full_name,
            role=role
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user


class ParentRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, parent_id: str) -> Optional[Parent]:
        return self.db.query(Parent).filter(Parent.id == parent_id).first()

    def get_by_user_id(self, user_id: str) -> Optional[Parent]:
        return self.db.query(Parent).filter(Parent.user_id == user_id).first()

    def get_authorized_student_ids(self, parent_id: str) -> List[str]:
        rel_records = self.db.query(ParentStudentRelationship).filter(
            ParentStudentRelationship.parent_id == parent_id,
            ParentStudentRelationship.is_active == True
        ).all()
        return [r.student_id for r in rel_records]

    def is_authorized_for_student(self, parent_id: str, student_id: str) -> bool:
        rel = self.db.query(ParentStudentRelationship).filter(
            ParentStudentRelationship.parent_id == parent_id,
            ParentStudentRelationship.student_id == student_id,
            ParentStudentRelationship.is_active == True
        ).first()
        return rel is not None


class StudentRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, student_id: str) -> Optional[Student]:
        return self.db.query(Student).filter(Student.id == student_id).first()

    def get_by_user_id(self, user_id: str) -> Optional[Student]:
        return self.db.query(Student).filter(Student.user_id == user_id).first()

    def get_all(self) -> List[Student]:
        return self.db.query(Student).all()

    def get_profile_data(self, student_id: str) -> Optional[Dict[str, Any]]:
        student = self.get_by_id(student_id)
        if not student:
            return None

        user = student.user
        return {
            "student_id": student.id,
            "roll_number": student.roll_number,
            "full_name": user.full_name if user else "Unknown",
            "email": user.email if user else "",
            "department": student.department,
            "semester": student.semester,
            "section": student.section,
            "cgpa": student.cgpa,
            "target_cgpa": student.target_cgpa
        }


class AcademicRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_attendance_records(self, student_id: str) -> List[Attendance]:
        return self.db.query(Attendance).filter(Attendance.student_id == student_id).order_by(Attendance.date.desc()).all()

    def get_attendance_summary(self, student_id: str) -> Dict[str, Any]:
        """Calculates per-subject and total attendance statistics deterministically."""
        records = self.get_attendance_records(student_id)
        
        # Group by subject
        subject_stats: Dict[str, Dict[str, Any]] = {}
        total_conducted = 0
        total_attended = 0

        for r in records:
            subj_id = r.subject_id
            if subj_id not in subject_stats:
                subject_stats[subj_id] = {
                    "subject_id": subj_id,
                    "subject_code": r.subject.code if r.subject else subj_id,
                    "subject_name": r.subject.name if r.subject else "Subject " + subj_id,
                    "conducted": 0,
                    "attended": 0,
                    "absent": 0,
                    "excused": 0
                }
            
            subject_stats[subj_id]["conducted"] += 1
            total_conducted += 1

            if r.status == AttendanceStatus.PRESENT:
                subject_stats[subj_id]["attended"] += 1
                total_attended += 1
            elif r.status == AttendanceStatus.ABSENT:
                subject_stats[subj_id]["absent"] += 1
            elif r.status == AttendanceStatus.EXCUSED:
                subject_stats[subj_id]["excused"] += 1

        # Calculate percentages
        by_subject = []
        for subj_id, stats in subject_stats.items():
            conducted = stats["conducted"]
            attended = stats["attended"]
            pct = round((attended / conducted * 100.0), 2) if conducted > 0 else 0.0
            stats["attendance_percentage"] = pct
            by_subject.append(stats)

        overall_pct = round((total_attended / total_conducted * 100.0), 2) if total_conducted > 0 else 0.0

        return {
            "student_id": student_id,
            "overall_conducted": total_conducted,
            "overall_attended": total_attended,
            "overall_percentage": overall_pct,
            "subject_wise": by_subject
        }

    def get_marks(self, student_id: str) -> List[Dict[str, Any]]:
        marks = self.db.query(Mark).filter(Mark.student_id == student_id).all()
        result = []
        for m in marks:
            result.append({
                "id": m.id,
                "subject_id": m.subject_id,
                "subject_code": m.subject.code if m.subject else m.subject_id,
                "subject_name": m.subject.name if m.subject else "",
                "exam_type": m.exam_type,
                "marks_obtained": m.marks_obtained,
                "max_marks": m.max_marks,
                "weightage": m.weightage,
                "percentage": round((m.marks_obtained / m.max_marks * 100.0), 2) if m.max_marks > 0 else 0.0
            })
        return result

    def get_timetable(self, department: str, semester: int, section: str = "A") -> List[Dict[str, Any]]:
        slots = self.db.query(Timetable).filter(
            Timetable.department == department,
            Timetable.semester == semester,
            Timetable.section == section
        ).order_by(Timetable.day_of_week, Timetable.time_slot).all()

        result = []
        for slot in slots:
            result.append({
                "id": slot.id,
                "day_of_week": slot.day_of_week,
                "time_slot": slot.time_slot,
                "subject_id": slot.subject_id,
                "subject_code": slot.subject.code if slot.subject else slot.subject_id,
                "subject_name": slot.subject.name if slot.subject else "",
                "room": slot.room
            })
        return result

    def get_examinations(self, department: str, semester: int) -> List[Dict[str, Any]]:
        exams = self.db.query(Examination).filter(
            Examination.department == department,
            Examination.semester == semester
        ).order_by(Examination.exam_date).all()

        result = []
        for e in exams:
            result.append({
                "id": e.id,
                "subject_id": e.subject_id,
                "subject_code": e.subject.code if e.subject else e.subject_id,
                "subject_name": e.subject.name if e.subject else "",
                "exam_name": e.exam_name,
                "exam_date": e.exam_date.isoformat(),
                "start_time": e.start_time,
                "end_time": e.end_time,
                "room": e.room,
                "max_marks": e.max_marks
            })
        return result

    def get_assignments(self, student_id: str) -> List[Dict[str, Any]]:
        student = self.db.query(Student).filter(Student.id == student_id).first()
        if not student:
            return []

        # Find assignments for student's department and semester
        assignments = self.db.query(Assignment).join(Subject).filter(
            Subject.department == student.department,
            Subject.semester == student.semester
        ).all()

        # Find student submissions
        submissions = self.db.query(StudentAssignment).filter(
            StudentAssignment.student_id == student_id
        ).all()
        sub_map = {s.assignment_id: s for s in submissions}

        result = []
        for a in assignments:
            sub = sub_map.get(a.id)
            result.append({
                "assignment_id": a.id,
                "subject_code": a.subject.code if a.subject else "",
                "subject_name": a.subject.name if a.subject else "",
                "title": a.title,
                "description": a.description,
                "due_date": a.due_date.isoformat(),
                "max_marks": a.max_marks,
                "status": sub.status if sub else "PENDING",
                "submitted_at": sub.submitted_at.isoformat() if sub and sub.submitted_at else None,
                "marks_obtained": sub.marks_obtained if sub else None
            })
        return result


class FeeRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_student_fees(self, student_id: str) -> List[Dict[str, Any]]:
        fees = self.db.query(Fee).filter(Fee.student_id == student_id).all()
        result = []
        for f in fees:
            pending_amt = max(0.0, f.amount - f.paid_amount)
            result.append({
                "id": f.id,
                "fee_type": f.fee_type,
                "amount": f.amount,
                "paid_amount": f.paid_amount,
                "pending_amount": pending_amt,
                "due_date": f.due_date.isoformat(),
                "status": f.status
            })
        return result


class AnnouncementRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_announcements(self, target_audience: Optional[str] = None, department: Optional[str] = None) -> List[Dict[str, Any]]:
        query = self.db.query(Announcement)

        if target_audience:
            query = query.filter(
                or_(
                    Announcement.target_audience == "ALL",
                    Announcement.target_audience == target_audience
                )
            )

        if department:
            query = query.filter(
                or_(
                    Announcement.department == None,
                    Announcement.department == department
                )
            )

        announcements = query.order_by(Announcement.created_at.desc()).all()
        result = []
        for a in announcements:
            result.append({
                "id": a.id,
                "title": a.title,
                "content": a.content,
                "target_audience": a.target_audience,
                "department": a.department,
                "priority": a.priority,
                "created_at": a.created_at.isoformat() if a.created_at else None
            })
        return result
