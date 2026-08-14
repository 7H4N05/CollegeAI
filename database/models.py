import datetime
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, Date, DateTime, ForeignKey, Text, Enum
)
from sqlalchemy.orm import relationship
from database.connection import Base

class UserRole:
    STUDENT = "STUDENT"
    PARENT = "PARENT"
    ADMIN = "ADMIN"

class AttendanceStatus:
    PRESENT = "PRESENT"
    ABSENT = "ABSENT"
    EXCUSED = "EXCUSED"

class ExamType:
    INTERNAL_1 = "INTERNAL_1"
    INTERNAL_2 = "INTERNAL_2"
    MID_SEM = "MID_SEM"
    END_SEM = "END_SEM"
    ASSIGNMENT = "ASSIGNMENT"

class AssignmentStatus:
    PENDING = "PENDING"
    SUBMITTED = "SUBMITTED"
    GRADED = "GRADED"

class FeeStatus:
    PAID = "PAID"
    PENDING = "PENDING"
    OVERDUE = "OVERDUE"

class PriorityLevel:
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"

class User(Base):
    __tablename__ = "users"

    id = Column(String(50), primary_key=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=False)
    role = Column(String(20), nullable=False)  # STUDENT, PARENT, ADMIN
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc), onupdate=lambda: datetime.datetime.now(datetime.timezone.utc))

    # Relationships
    student_profile = relationship("Student", back_populates="user", uselist=False, cascade="all, delete-orphan")
    parent_profile = relationship("Parent", back_populates="user", uselist=False, cascade="all, delete-orphan")

class Student(Base):
    __tablename__ = "students"

    id = Column(String(50), primary_key=True)
    user_id = Column(String(50), ForeignKey("users.id"), nullable=False, unique=True)
    roll_number = Column(String(50), unique=True, nullable=False, index=True)
    department = Column(String(100), nullable=False)
    semester = Column(Integer, nullable=False)
    section = Column(String(10), nullable=False, default="A")
    cgpa = Column(Float, nullable=False, default=0.0)
    target_cgpa = Column(Float, nullable=False, default=8.5)

    # Relationships
    user = relationship("User", back_populates="student_profile")
    parent_relationships = relationship("ParentStudentRelationship", back_populates="student", cascade="all, delete-orphan")
    attendance_records = relationship("Attendance", back_populates="student", cascade="all, delete-orphan")
    marks = relationship("Mark", back_populates="student", cascade="all, delete-orphan")
    assignment_submissions = relationship("StudentAssignment", back_populates="student", cascade="all, delete-orphan")
    fee_records = relationship("Fee", back_populates="student", cascade="all, delete-orphan")

class Parent(Base):
    __tablename__ = "parents"

    id = Column(String(50), primary_key=True)
    user_id = Column(String(50), ForeignKey("users.id"), nullable=False, unique=True)
    phone_number = Column(String(20), nullable=False)

    # Relationships
    user = relationship("User", back_populates="parent_profile")
    student_relationships = relationship("ParentStudentRelationship", back_populates="parent", cascade="all, delete-orphan")

class ParentStudentRelationship(Base):
    __tablename__ = "parent_student_relationships"

    id = Column(Integer, primary_key=True, autoincrement=True)
    parent_id = Column(String(50), ForeignKey("parents.id"), nullable=False)
    student_id = Column(String(50), ForeignKey("students.id"), nullable=False)
    relationship_type = Column(String(50), nullable=False, default="PARENT") # FATHER, MOTHER, GUARDIAN
    is_active = Column(Boolean, default=True, nullable=False)

    # Relationships
    parent = relationship("Parent", back_populates="student_relationships")
    student = relationship("Student", back_populates="parent_relationships")

class Subject(Base):
    __tablename__ = "subjects"

    id = Column(String(50), primary_key=True)
    code = Column(String(20), nullable=False, index=True)
    name = Column(String(150), nullable=False)
    department = Column(String(100), nullable=False)
    semester = Column(Integer, nullable=False)
    credits = Column(Integer, nullable=False, default=4)

    # Relationships
    attendance_records = relationship("Attendance", back_populates="subject", cascade="all, delete-orphan")
    timetable_entries = relationship("Timetable", back_populates="subject", cascade="all, delete-orphan")
    marks = relationship("Mark", back_populates="subject", cascade="all, delete-orphan")
    examinations = relationship("Examination", back_populates="subject", cascade="all, delete-orphan")
    assignments = relationship("Assignment", back_populates="subject", cascade="all, delete-orphan")

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(String(50), ForeignKey("students.id"), nullable=False, index=True)
    subject_id = Column(String(50), ForeignKey("subjects.id"), nullable=False, index=True)
    date = Column(Date, nullable=False)
    session_number = Column(Integer, nullable=False, default=1)
    status = Column(String(20), nullable=False)  # PRESENT, ABSENT, EXCUSED

    # Relationships
    student = relationship("Student", back_populates="attendance_records")
    subject = relationship("Subject", back_populates="attendance_records")

class Timetable(Base):
    __tablename__ = "timetable"

    id = Column(Integer, primary_key=True, autoincrement=True)
    department = Column(String(100), nullable=False)
    semester = Column(Integer, nullable=False)
    section = Column(String(10), nullable=False, default="A")
    day_of_week = Column(String(20), nullable=False)  # MONDAY, TUESDAY, etc.
    time_slot = Column(String(50), nullable=False)    # e.g., "09:00-10:00"
    subject_id = Column(String(50), ForeignKey("subjects.id"), nullable=False)
    room = Column(String(50), nullable=False)

    # Relationships
    subject = relationship("Subject", back_populates="timetable_entries")

class Mark(Base):
    __tablename__ = "marks"

    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(String(50), ForeignKey("students.id"), nullable=False, index=True)
    subject_id = Column(String(50), ForeignKey("subjects.id"), nullable=False, index=True)
    exam_type = Column(String(50), nullable=False)  # INTERNAL_1, INTERNAL_2, MID_SEM, ASSIGNMENT
    marks_obtained = Column(Float, nullable=False)
    max_marks = Column(Float, nullable=False, default=100.0)
    weightage = Column(Float, nullable=False, default=20.0)

    # Relationships
    student = relationship("Student", back_populates="marks")
    subject = relationship("Subject", back_populates="marks")

class Examination(Base):
    __tablename__ = "examinations"

    id = Column(Integer, primary_key=True, autoincrement=True)
    subject_id = Column(String(50), ForeignKey("subjects.id"), nullable=False)
    department = Column(String(100), nullable=False)
    semester = Column(Integer, nullable=False)
    exam_name = Column(String(100), nullable=False)
    exam_date = Column(Date, nullable=False)
    start_time = Column(String(20), nullable=False)
    end_time = Column(String(20), nullable=False)
    room = Column(String(50), nullable=False)
    max_marks = Column(Float, nullable=False, default=100.0)

    # Relationships
    subject = relationship("Subject", back_populates="examinations")

class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(Integer, primary_key=True, autoincrement=True)
    subject_id = Column(String(50), ForeignKey("subjects.id"), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    due_date = Column(Date, nullable=False)
    max_marks = Column(Float, nullable=False, default=100.0)

    # Relationships
    subject = relationship("Subject", back_populates="assignments")
    submissions = relationship("StudentAssignment", back_populates="assignment", cascade="all, delete-orphan")

class StudentAssignment(Base):
    __tablename__ = "student_assignments"

    id = Column(Integer, primary_key=True, autoincrement=True)
    assignment_id = Column(Integer, ForeignKey("assignments.id"), nullable=False)
    student_id = Column(String(50), ForeignKey("students.id"), nullable=False)
    status = Column(String(20), nullable=False, default="PENDING")  # PENDING, SUBMITTED, GRADED
    submitted_at = Column(DateTime, nullable=True)
    marks_obtained = Column(Float, nullable=True)

    # Relationships
    assignment = relationship("Assignment", back_populates="submissions")
    student = relationship("Student", back_populates="assignment_submissions")

class Fee(Base):
    __tablename__ = "fees"

    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(String(50), ForeignKey("students.id"), nullable=False, index=True)
    fee_type = Column(String(100), nullable=False)  # Tuition Fee, Hostel Fee, Examination Fee, Library Fee
    amount = Column(Float, nullable=False)
    paid_amount = Column(Float, nullable=False, default=0.0)
    due_date = Column(Date, nullable=False)
    status = Column(String(20), nullable=False, default="PENDING")  # PAID, PENDING, OVERDUE

    # Relationships
    student = relationship("Student", back_populates="fee_records")

class Announcement(Base):
    __tablename__ = "announcements"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    target_audience = Column(String(20), nullable=False, default="ALL")  # ALL, STUDENT, PARENT
    department = Column(String(100), nullable=True)
    priority = Column(String(20), nullable=False, default="MEDIUM")  # LOW, MEDIUM, HIGH
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))
