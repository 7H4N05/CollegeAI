import sys
import os
import datetime
from sqlalchemy.orm import Session

# Add project root to sys.path for direct execution
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from database.connection import engine, Base, SessionLocal
from database.models import (
    User, Student, Parent, ParentStudentRelationship, Subject,
    Attendance, Timetable, Mark, Examination, Assignment,
    StudentAssignment, Fee, Announcement, UserRole, AttendanceStatus,
    AssignmentStatus, FeeStatus, PriorityLevel, ExamType
)
from backend.app.auth.security import hash_password

def seed_database():
    print("Resetting database schema...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db: Session = SessionLocal()
    try:
        print("Seeding Users, Students, and Parents...")
        default_pwd = hash_password("password123")

        # 1. Admin User
        admin_user = User(
            id="USR_ADMIN",
            email="admin@college.edu",
            password_hash=default_pwd,
            full_name="Dr. Rajesh Vice Chancellor",
            role=UserRole.ADMIN
        )
        db.add(admin_user)

        # 2. Seed 10 Students & 10 Parents
        student_data = [
            # (student_id, roll_no, name, email, parent_name, parent_email, dept, sem, sec, cgpa, target_cgpa, target_att_pct)
            ("STU001", "2024CS001", "Aarav Sharma", "aarav.sharma@college.edu", "Rajesh Sharma", "rajesh.sharma@gmail.com", "Computer Science", 4, "A", 9.1, 9.5, 90),
            ("STU002", "2024CS002", "Rohan Mehta", "rohan.mehta@college.edu", "Sanjay Mehta", "sanjay.mehta@gmail.com", "Computer Science", 4, "A", 7.6, 8.0, 76),
            ("STU003", "2024CS003", "Priya Patel", "priya.patel@college.edu", "Sunita Patel", "sunita.patel@gmail.com", "Computer Science", 4, "A", 6.8, 7.5, 64),
            ("STU004", "2024CS004", "Vikram Singh", "vikram.singh@college.edu", "Harpal Singh", "harpal.singh@gmail.com", "Computer Science", 4, "B", 8.8, 9.0, 88),
            ("STU005", "2024DS001", "Sneha Reddy", "sneha.reddy@college.edu", "Venkat Reddy", "venkat.reddy@gmail.com", "Data Science", 4, "A", 8.2, 8.5, 82),
            ("STU006", "2024DS002", "Ananya Verma", "ananya.verma@college.edu", "Ramesh Verma", "ramesh.verma@gmail.com", "Data Science", 4, "A", 8.5, 9.0, 85),
            ("STU007", "2024DS003", "Kabir Joshi", "kabir.joshi@college.edu", "Alok Joshi", "alok.joshi@gmail.com", "Data Science", 4, "A", 7.2, 8.0, 72),
            ("STU008", "2024CS005", "Diya Nair", "diya.nair@college.edu", "Kiran Nair", "kiran.nair@gmail.com", "Computer Science", 4, "B", 9.4, 9.8, 93),
            ("STU009", "2024CS006", "Aditya Kumar", "aditya.kumar@college.edu", "Vijay Kumar", "vijay.kumar@gmail.com", "Computer Science", 4, "B", 7.9, 8.2, 78),
            ("STU010", "2024DS004", "Ishita Gupta", "ishita.gupta@college.edu", "Pankaj Gupta", "pankaj.gupta@gmail.com", "Data Science", 4, "A", 8.9, 9.2, 87),
        ]

        students_dict = {}

        for idx, (stu_id, roll, s_name, s_email, p_name, p_email, dept, sem, sec, cgpa, target_cgpa, target_att) in enumerate(student_data, start=1):
            # Student User
            s_u_id = f"USR_STU_{idx:03d}"
            s_user = User(
                id=s_u_id,
                email=s_email,
                password_hash=default_pwd,
                full_name=s_name,
                role=UserRole.STUDENT
            )
            db.add(s_user)

            student = Student(
                id=stu_id,
                user_id=s_u_id,
                roll_number=roll,
                department=dept,
                semester=sem,
                section=sec,
                cgpa=cgpa,
                target_cgpa=target_cgpa
            )
            db.add(student)
            students_dict[stu_id] = (student, target_att)

            # Parent User
            p_u_id = f"USR_PAR_{idx:03d}"
            p_id = f"PAR{idx:03d}"
            p_user = User(
                id=p_u_id,
                email=p_email,
                password_hash=default_pwd,
                full_name=p_name,
                role=UserRole.PARENT
            )
            db.add(p_user)

            parent = Parent(
                id=p_id,
                user_id=p_u_id,
                phone_number=f"+91 98765 {idx:05d}"
            )
            db.add(parent)

            # Parent-Student Link
            rel = ParentStudentRelationship(
                parent_id=p_id,
                student_id=stu_id,
                relationship_type="FATHER" if idx % 2 != 0 else "MOTHER",
                is_active=True
            )
            db.add(rel)

        db.commit()

        # 3. Seed 15 Subjects
        print("Seeding 15 Subjects...")
        subjects_data = [
            ("SUB101", "CS401", "Data Structures & Algorithms", "Computer Science", 4, 4),
            ("SUB102", "CS402", "Database Management Systems", "Computer Science", 4, 4),
            ("SUB103", "CS403", "Operating Systems", "Computer Science", 4, 4),
            ("SUB104", "CS404", "Computer Networks", "Computer Science", 4, 3),
            ("SUB105", "CS405", "Artificial Intelligence", "Computer Science", 4, 3),
            ("SUB106", "CS406", "Software Engineering", "Computer Science", 4, 3),
            ("SUB107", "CS407", "Theory of Computation", "Computer Science", 4, 3),
            ("SUB108", "CS408", "Web Technologies & APIs", "Computer Science", 4, 3),

            ("SUB201", "DS401", "Linear Algebra & Statistics", "Data Science", 4, 4),
            ("SUB202", "DS402", "Data Mining & Analytics", "Data Science", 4, 4),
            ("SUB203", "DS403", "Deep Learning & Neural Nets", "Data Science", 4, 4),
            ("SUB204", "DS404", "Cloud Computing & DevOps", "Data Science", 4, 3),
            ("SUB205", "DS405", "Big Data Engineering", "Data Science", 4, 3),
            ("SUB206", "DS406", "Cyber Security & Cryptography", "Data Science", 4, 3),
            ("SUB207", "DS407", "Natural Language Processing", "Data Science", 4, 3)
        ]

        for s_id, s_code, s_name, dept, sem, cred in subjects_data:
            subj = Subject(
                id=s_id,
                code=s_code,
                name=s_name,
                department=dept,
                semester=sem,
                credits=cred
            )
            db.add(subj)
        db.commit()

        # 4. Seed Timetable Slots (Monday - Friday)
        print("Seeding Timetable...")
        days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"]
        time_slots = [
            "09:00 - 10:00",
            "10:00 - 11:00",
            "11:15 - 12:15",
            "01:15 - 02:15",
            "02:15 - 03:15"
        ]

        # CS Timetable (SUB101 - SUB105)
        cs_subjs = ["SUB101", "SUB102", "SUB103", "SUB104", "SUB105"]
        for d_idx, day in enumerate(days):
            for t_idx, slot in enumerate(time_slots):
                s_id = cs_subjs[(d_idx + t_idx) % len(cs_subjs)]
                tt = Timetable(
                    department="Computer Science",
                    semester=4,
                    section="A",
                    day_of_week=day,
                    time_slot=slot,
                    subject_id=s_id,
                    room=f"CS-LH-{101 + t_idx}"
                )
                db.add(tt)
                # Section B timetable
                tt_b = Timetable(
                    department="Computer Science",
                    semester=4,
                    section="B",
                    day_of_week=day,
                    time_slot=slot,
                    subject_id=s_id,
                    room=f"CS-LH-{201 + t_idx}"
                )
                db.add(tt_b)

        # DS Timetable (SUB201 - SUB205)
        ds_subjs = ["SUB201", "SUB202", "SUB203", "SUB204", "SUB205"]
        for d_idx, day in enumerate(days):
            for t_idx, slot in enumerate(time_slots):
                s_id = ds_subjs[(d_idx + t_idx) % len(ds_subjs)]
                tt = Timetable(
                    department="Data Science",
                    semester=4,
                    section="A",
                    day_of_week=day,
                    time_slot=slot,
                    subject_id=s_id,
                    room=f"DS-Lab-{301 + t_idx}"
                )
                db.add(tt)

        db.commit()

        # 5. Seed Historical Attendance (8 weeks = 40 weekdays)
        print("Seeding Attendance Records...")
        start_date = datetime.date(2026, 6, 1) # 8 weeks history
        total_days = 40

        for stu_id, (student, target_att) in students_dict.items():
            s_subjs = cs_subjs if student.department == "Computer Science" else ds_subjs
            
            # Probability of present
            prob = target_att / 100.0

            curr = start_date
            day_count = 0
            while day_count < total_days:
                if curr.weekday() < 5: # Monday-Friday
                    day_count += 1
                    # 2 classes per day
                    for sess in range(1, 3):
                        subj_id = s_subjs[(day_count + sess) % len(s_subjs)]
                        
                        # Determine status based on target_att tuning
                        import random
                        # Fixed deterministic seed for reproducible hackathon data
                        random.seed(hash(stu_id + str(day_count) + str(sess)))
                        val = random.random()

                        if val <= prob:
                            status = AttendanceStatus.PRESENT
                        else:
                            status = AttendanceStatus.ABSENT

                        att = Attendance(
                            student_id=stu_id,
                            subject_id=subj_id,
                            date=curr,
                            session_number=sess,
                            status=status
                        )
                        db.add(att)

                curr += datetime.timedelta(days=1)

        db.commit()

        # 6. Seed Internal Marks
        print("Seeding Internal Marks...")
        for stu_id, (student, target_att) in students_dict.items():
            s_subjs = cs_subjs if student.department == "Computer Science" else ds_subjs
            
            for s_id in s_subjs:
                # Internal 1 out of 50
                base_marks = 35 + (student.cgpa * 1.5)
                m1 = Mark(
                    student_id=stu_id,
                    subject_id=s_id,
                    exam_type=ExamType.INTERNAL_1,
                    marks_obtained=min(50.0, round(base_marks, 1)),
                    max_marks=50.0,
                    weightage=15.0
                )
                # Internal 2 out of 50
                m2 = Mark(
                    student_id=stu_id,
                    subject_id=s_id,
                    exam_type=ExamType.INTERNAL_2,
                    marks_obtained=min(50.0, round(base_marks - 2.0, 1)),
                    max_marks=50.0,
                    weightage=15.0
                )
                db.add(m1)
                db.add(m2)

        db.commit()

        # 7. Seed Examinations (Upcoming End-Sem Exams next week)
        print("Seeding Examinations...")
        exam_start = datetime.date(2026, 8, 18) # Next week
        
        # CS Exams
        for i, s_id in enumerate(cs_subjs):
            ex = Examination(
                subject_id=s_id,
                department="Computer Science",
                semester=4,
                exam_name="End Semester Examination",
                exam_date=exam_start + datetime.timedelta(days=i * 2),
                start_time="10:00 AM",
                end_time="01:00 PM",
                room="Main Exam Hall A",
                max_marks=100.0
            )
            db.add(ex)

        # DS Exams
        for i, s_id in enumerate(ds_subjs):
            ex = Examination(
                subject_id=s_id,
                department="Data Science",
                semester=4,
                exam_name="End Semester Examination",
                exam_date=exam_start + datetime.timedelta(days=i * 2),
                start_time="10:00 AM",
                end_time="01:00 PM",
                room="Main Exam Hall B",
                max_marks=100.0
            )
            db.add(ex)

        db.commit()

        # 8. Seed Assignments & Student Submissions
        print("Seeding Assignments...")
        assign1 = Assignment(
            subject_id="SUB101",
            title="Assignment 1: Graph Algorithms Implementation",
            description="Implement Dijkstra and Kruskal algorithms in Python.",
            due_date=datetime.date(2026, 8, 20),
            max_marks=20.0
        )
        assign2 = Assignment(
            subject_id="SUB102",
            title="Assignment 2: SQL Query Optimization",
            description="Write optimized indexing and join queries.",
            due_date=datetime.date(2026, 8, 22),
            max_marks=20.0
        )
        assign3 = Assignment(
            subject_id="SUB201",
            title="Assignment 1: Matrix Factorization & SVD",
            description="Complete the Jupyter Notebook on SVD applications.",
            due_date=datetime.date(2026, 8, 21),
            max_marks=20.0
        )
        db.add_all([assign1, assign2, assign3])
        db.commit()

        # Submissions
        for stu_id, (student, _) in students_dict.items():
            if student.department == "Computer Science":
                # High performer submitted
                if stu_id in ["STU001", "STU004", "STU008"]:
                    sa1 = StudentAssignment(
                        assignment_id=assign1.id,
                        student_id=stu_id,
                        status=AssignmentStatus.SUBMITTED,
                        submitted_at=datetime.datetime.now(datetime.timezone.utc),
                        marks_obtained=18.5
                    )
                    sa2 = StudentAssignment(
                        assignment_id=assign2.id,
                        student_id=stu_id,
                        status=AssignmentStatus.SUBMITTED,
                        submitted_at=datetime.datetime.now(datetime.timezone.utc),
                        marks_obtained=19.0
                    )
                else:
                    # Borderline/Low performer pending
                    sa1 = StudentAssignment(
                        assignment_id=assign1.id,
                        student_id=stu_id,
                        status=AssignmentStatus.PENDING
                    )
                    sa2 = StudentAssignment(
                        assignment_id=assign2.id,
                        student_id=stu_id,
                        status=AssignmentStatus.SUBMITTED,
                        submitted_at=datetime.datetime.now(datetime.timezone.utc),
                        marks_obtained=15.0
                    )
                db.add_all([sa1, sa2])
            else:
                sa3 = StudentAssignment(
                    assignment_id=assign3.id,
                    student_id=stu_id,
                    status=AssignmentStatus.SUBMITTED if stu_id in ["STU005", "STU006", "STU010"] else AssignmentStatus.PENDING,
                    submitted_at=datetime.datetime.now(datetime.timezone.utc) if stu_id in ["STU005", "STU006", "STU010"] else None,
                    marks_obtained=17.0 if stu_id in ["STU005", "STU006", "STU010"] else None
                )
                db.add(sa3)

        db.commit()

        # 9. Seed Fee Records
        print("Seeding Fee Records...")
        for stu_id, (student, _) in students_dict.items():
            # STU001 (Aarav): Fully paid
            if stu_id == "STU001":
                f1 = Fee(
                    student_id=stu_id,
                    fee_type="Semester Tuition Fee",
                    amount=65000.0,
                    paid_amount=65000.0,
                    due_date=datetime.date(2026, 7, 31),
                    status=FeeStatus.PAID
                )
            # STU002 (Rohan): Pending 15,000 INR
            elif stu_id == "STU002":
                f1 = Fee(
                    student_id=stu_id,
                    fee_type="Semester Tuition Fee",
                    amount=65000.0,
                    paid_amount=50000.0,
                    due_date=datetime.date(2026, 7, 31),
                    status=FeeStatus.PENDING
                )
            # STU005 (Sneha): Pending 45,000 INR (Hostel + Exam)
            elif stu_id == "STU005":
                f1 = Fee(
                    student_id=stu_id,
                    fee_type="Hostel & Mess Fee",
                    amount=45000.0,
                    paid_amount=0.0,
                    due_date=datetime.date(2026, 8, 10),
                    status=FeeStatus.OVERDUE
                )
            else:
                f1 = Fee(
                    student_id=stu_id,
                    fee_type="Semester Tuition Fee",
                    amount=65000.0,
                    paid_amount=65000.0,
                    due_date=datetime.date(2026, 7, 31),
                    status=FeeStatus.PAID
                )
            db.add(f1)

        db.commit()

        # 10. Seed College Announcements
        print("Seeding College Announcements...")
        ann1 = Announcement(
            title="End Semester Examination Schedule Released",
            content="The timetable for End Semester Examinations (Spring 2026) has been published. Exams begin on August 18, 2026.",
            target_audience="ALL",
            department=None,
            priority=PriorityLevel.HIGH
        )
        ann2 = Announcement(
            title="75% Mandatory Attendance Reminder",
            content="Students with attendance below 75% will not be issued admit cards for the final end-semester examinations. Check your current attendance immediately.",
            target_audience="STUDENT",
            department=None,
            priority=PriorityLevel.HIGH
        )
        ann3 = Announcement(
            title="Fee Clearance Deadline for Admit Card Generation",
            content="Parents and students are requested to clear pending semester fees by August 16 to avoid delays in admit card issuance.",
            target_audience="PARENT",
            department=None,
            priority=PriorityLevel.MEDIUM
        )
        ann4 = Announcement(
            title="Annual Tech Symposium 'HackAI 2026'",
            content="Computer Science & Data Science departments are organizing HackAI 2026. Registrations close on August 25.",
            target_audience="STUDENT",
            department="Computer Science",
            priority=PriorityLevel.LOW
        )
        db.add_all([ann1, ann2, ann3, ann4])
        db.commit()

        print("Database seeding completed successfully!")
    
    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
