from typing import Dict, Any, List

# Users Mock Store (Students, Parents, Admin)
USERS_DB: Dict[str, Dict[str, Any]] = {
    # Students
    "student1": {
        "user_id": "U101",
        "username": "student1",
        "password_hash": "password123",
        "name": "Rahul Sharma",
        "email": "rahul.sharma@college.edu",
        "role": "STUDENT",
        "student_id": "STU101",
        "authorized_children": []
    },
    "student2": {
        "user_id": "U102",
        "username": "student2",
        "password_hash": "password123",
        "name": "Priya Patel",
        "email": "priya.patel@college.edu",
        "role": "STUDENT",
        "student_id": "STU102",
        "authorized_children": []
    },
    "student3": {
        "user_id": "U103",
        "username": "student3",
        "password_hash": "password123",
        "name": "Amit Kumar",
        "email": "amit.kumar@college.edu",
        "role": "STUDENT",
        "student_id": "STU103",
        "authorized_children": []
    },
    "student4": {
        "user_id": "U104",
        "username": "student4",
        "password_hash": "password123",
        "name": "Ananya Roy",
        "email": "ananya.roy@college.edu",
        "role": "STUDENT",
        "student_id": "STU104",
        "authorized_children": []
    },
    "student5": {
        "user_id": "U105",
        "username": "student5",
        "password_hash": "password123",
        "name": "Vikram Singh",
        "email": "vikram.singh@college.edu",
        "role": "STUDENT",
        "student_id": "STU105",
        "authorized_children": []
    },
    "student6": {
        "user_id": "U106",
        "username": "student6",
        "password_hash": "password123",
        "name": "Sneha Reddy",
        "email": "sneha.reddy@college.edu",
        "role": "STUDENT",
        "student_id": "STU106",
        "authorized_children": []
    },
    "student7": {
        "user_id": "U107",
        "username": "student7",
        "password_hash": "password123",
        "name": "Rohan Gupta",
        "email": "rohan.gupta@college.edu",
        "role": "STUDENT",
        "student_id": "STU107",
        "authorized_children": []
    },
    "student8": {
        "user_id": "U108",
        "username": "student8",
        "password_hash": "password123",
        "name": "Kavya Nair",
        "email": "kavya.nair@college.edu",
        "role": "STUDENT",
        "student_id": "STU108",
        "authorized_children": []
    },
    "student9": {
        "user_id": "U109",
        "username": "student9",
        "password_hash": "password123",
        "name": "Aditya Verma",
        "email": "aditya.verma@college.edu",
        "role": "STUDENT",
        "student_id": "STU109",
        "authorized_children": []
    },
    "student10": {
        "user_id": "U110",
        "username": "student10",
        "password_hash": "password123",
        "name": "Neha Joshi",
        "email": "neha.joshi@college.edu",
        "role": "STUDENT",
        "student_id": "STU110",
        "authorized_children": []
    },

    # Parents (10 Parents linked to corresponding children)
    "parent1": {
        "user_id": "P201",
        "username": "parent1",
        "password_hash": "password123",
        "name": "Rajesh Sharma",
        "email": "rajesh.sharma@gmail.com",
        "role": "PARENT",
        "student_id": None,
        "authorized_children": ["STU101"]
    },
    "parent2": {
        "user_id": "P202",
        "username": "parent2",
        "password_hash": "password123",
        "name": "Suresh Patel",
        "email": "suresh.patel@gmail.com",
        "role": "PARENT",
        "student_id": None,
        "authorized_children": ["STU102"]
    },
    "parent3": {
        "user_id": "P203",
        "username": "parent3",
        "password_hash": "password123",
        "name": "Sunil Kumar",
        "email": "sunil.kumar@gmail.com",
        "role": "PARENT",
        "student_id": None,
        "authorized_children": ["STU103"]
    },
    "parent4": {
        "user_id": "P204",
        "username": "parent4",
        "password_hash": "password123",
        "name": "Subhash Roy",
        "email": "subhash.roy@gmail.com",
        "role": "PARENT",
        "student_id": None,
        "authorized_children": ["STU104"]
    },
    "parent5": {
        "user_id": "P205",
        "username": "parent5",
        "password_hash": "password123",
        "name": "Mahendra Singh",
        "email": "mahendra.singh@gmail.com",
        "role": "PARENT",
        "student_id": None,
        "authorized_children": ["STU105"]
    },
    "parent6": {
        "user_id": "P206",
        "username": "parent6",
        "password_hash": "password123",
        "name": "Venkat Reddy",
        "email": "venkat.reddy@gmail.com",
        "role": "PARENT",
        "student_id": None,
        "authorized_children": ["STU106"]
    },
    "parent7": {
        "user_id": "P207",
        "username": "parent7",
        "password_hash": "password123",
        "name": "Ramesh Gupta",
        "email": "ramesh.gupta@gmail.com",
        "role": "PARENT",
        "student_id": None,
        "authorized_children": ["STU107"]
    },
    "parent8": {
        "user_id": "P208",
        "username": "parent8",
        "password_hash": "password123",
        "name": "Rajan Nair",
        "email": "rajan.nair@gmail.com",
        "role": "PARENT",
        "student_id": None,
        "authorized_children": ["STU108"]
    },
    "parent9": {
        "user_id": "P209",
        "username": "parent9",
        "password_hash": "password123",
        "name": "Vijay Verma",
        "email": "vijay.verma@gmail.com",
        "role": "PARENT",
        "student_id": None,
        "authorized_children": ["STU109"]
    },
    "parent10": {
        "user_id": "P210",
        "username": "parent10",
        "password_hash": "password123",
        "name": "Prakash Joshi",
        "email": "prakash.joshi@gmail.com",
        "role": "PARENT",
        "student_id": None,
        "authorized_children": ["STU110"]
    },
    "admin": {
        "user_id": "A301",
        "username": "admin",
        "password_hash": "password123",
        "name": "Dean Academic Affairs",
        "email": "admin@college.edu",
        "role": "ADMIN",
        "student_id": None,
        "authorized_children": []
    }
}

# 10 Student Profiles
STUDENTS_DB: Dict[str, Dict[str, Any]] = {
    "STU101": {
        "student_id": "STU101",
        "name": "Rahul Sharma",
        "roll_number": "2024-CSE-01",
        "branch": "Computer Science",
        "section": "A",
        "semester": 6,
        "cgpa": 8.9,
        "email": "rahul.sharma@college.edu",
        "phone": "+91-9876543210",
        "parent_name": "Rajesh Sharma",
        "parent_phone": "+91-9876543211"
    },
    "STU102": {
        "student_id": "STU102",
        "name": "Priya Patel",
        "roll_number": "2024-CSE-02",
        "branch": "Computer Science",
        "section": "A",
        "semester": 6,
        "cgpa": 7.8,
        "email": "priya.patel@college.edu",
        "phone": "+91-9876543212",
        "parent_name": "Suresh Patel",
        "parent_phone": "+91-9876543213"
    },
    "STU103": {
        "student_id": "STU103",
        "name": "Amit Kumar",
        "roll_number": "2024-CSE-03",
        "branch": "Computer Science",
        "section": "A",
        "semester": 6,
        "cgpa": 6.5,
        "email": "amit.kumar@college.edu",
        "phone": "+91-9876543214",
        "parent_name": "Sunil Kumar",
        "parent_phone": "+91-9876543215"
    },
    "STU104": {
        "student_id": "STU104",
        "name": "Ananya Roy",
        "roll_number": "2024-ECE-01",
        "branch": "Electronics & Comm",
        "section": "B",
        "semester": 6,
        "cgpa": 8.2,
        "email": "ananya.roy@college.edu",
        "phone": "+91-9876543216",
        "parent_name": "Subhash Roy",
        "parent_phone": "+91-9876543217"
    },
    "STU105": {
        "student_id": "STU105",
        "name": "Vikram Singh",
        "roll_number": "2024-MECH-01",
        "branch": "Mechanical Engineering",
        "section": "A",
        "semester": 4,
        "cgpa": 7.4,
        "email": "vikram.singh@college.edu",
        "phone": "+91-9876543218",
        "parent_name": "Mahendra Singh",
        "parent_phone": "+91-9876543219"
    },
    "STU106": {
        "student_id": "STU106",
        "name": "Sneha Reddy",
        "roll_number": "2024-CSE-04",
        "branch": "Computer Science",
        "section": "B",
        "semester": 6,
        "cgpa": 9.1,
        "email": "sneha.reddy@college.edu",
        "phone": "+91-9876543220",
        "parent_name": "Venkat Reddy",
        "parent_phone": "+91-9876543221"
    },
    "STU107": {
        "student_id": "STU107",
        "name": "Rohan Gupta",
        "roll_number": "2024-CIVIL-01",
        "branch": "Civil Engineering",
        "section": "A",
        "semester": 4,
        "cgpa": 8.5,
        "email": "rohan.gupta@college.edu",
        "phone": "+91-9876543222",
        "parent_name": "Ramesh Gupta",
        "parent_phone": "+91-9876543223"
    },
    "STU108": {
        "student_id": "STU108",
        "name": "Kavya Nair",
        "roll_number": "2024-CSE-05",
        "branch": "Computer Science",
        "section": "B",
        "semester": 6,
        "cgpa": 7.9,
        "email": "kavya.nair@college.edu",
        "phone": "+91-9876543224",
        "parent_name": "Rajan Nair",
        "parent_phone": "+91-9876543225"
    },
    "STU109": {
        "student_id": "STU109",
        "name": "Aditya Verma",
        "roll_number": "2024-EEE-01",
        "branch": "Electrical Engineering",
        "section": "A",
        "semester": 4,
        "cgpa": 7.1,
        "email": "aditya.verma@college.edu",
        "phone": "+91-9876543226",
        "parent_name": "Vijay Verma",
        "parent_phone": "+91-9876543227"
    },
    "STU110": {
        "student_id": "STU110",
        "name": "Neha Joshi",
        "roll_number": "2024-CSE-06",
        "branch": "Computer Science",
        "section": "A",
        "semester": 6,
        "cgpa": 8.7,
        "email": "neha.joshi@college.edu",
        "phone": "+91-9876543228",
        "parent_name": "Prakash Joshi",
        "parent_phone": "+91-9876543229"
    }
}

# 15 Subjects
SUBJECTS_DB: Dict[str, Dict[str, Any]] = {
    "CS601": {"code": "CS601", "name": "Data Structures & Algorithms", "credits": 4},
    "CS602": {"code": "CS602", "name": "Database Management Systems", "credits": 4},
    "CS603": {"code": "CS603", "name": "Operating Systems", "credits": 3},
    "CS604": {"code": "CS604", "name": "Computer Networks", "credits": 3},
    "CS605": {"code": "CS605", "name": "Artificial Intelligence", "credits": 3},

    "EC601": {"code": "EC601", "name": "Digital Signal Processing", "credits": 4},
    "EC602": {"code": "EC602", "name": "VLSI Design", "credits": 4},
    "EC603": {"code": "EC603", "name": "Microprocessors & Microcontrollers", "credits": 3},

    "ME401": {"code": "ME401", "name": "Thermodynamics", "credits": 4},
    "ME402": {"code": "ME402", "name": "Fluid Mechanics", "credits": 4},
    "ME403": {"code": "ME403", "name": "Manufacturing Processes", "credits": 3},

    "CE401": {"code": "CE401", "name": "Structural Analysis", "credits": 4},
    "CE402": {"code": "CE402", "name": "Geotechnical Engineering", "credits": 4},

    "EE401": {"code": "EE401", "name": "Power Systems", "credits": 4},
    "EE402": {"code": "EE402", "name": "Control Systems", "credits": 3}
}

# Attendance DB for Students
ATTENDANCE_DB: Dict[str, List[Dict[str, Any]]] = {
    # STU101: Rahul Sharma - High attendance (Overall 88.0% - 44/50 in math terms or 176/200 total)
    "STU101": [
        {"subject_code": "CS601", "subject_name": "Data Structures & Algorithms", "attended": 44, "conducted": 50},
        {"subject_code": "CS602", "subject_name": "Database Management Systems", "attended": 45, "conducted": 50},
        {"subject_code": "CS603", "subject_name": "Operating Systems", "attended": 43, "conducted": 50},
        {"subject_code": "CS604", "subject_name": "Computer Networks", "attended": 44, "conducted": 50},
    ],
    # STU102: Priya Patel - Borderline attendance (Overall ~76.0%, e.g. 41/50 in CS601, 38/50 overall)
    "STU102": [
        {"subject_code": "CS601", "subject_name": "Data Structures & Algorithms", "attended": 41, "conducted": 50}, # 82% (Prompt example: 41/50)
        {"subject_code": "CS602", "subject_name": "Database Management Systems", "attended": 37, "conducted": 50}, # 74%
        {"subject_code": "CS603", "subject_name": "Operating Systems", "attended": 38, "conducted": 50}, # 76%
        {"subject_code": "CS604", "subject_name": "Computer Networks", "attended": 36, "conducted": 50}, # 72%
    ],
    # STU103: Amit Kumar - Low attendance (<75%, e.g. 32/50 in CS601, 128/200 total = 64%)
    "STU103": [
        {"subject_code": "CS601", "subject_name": "Data Structures & Algorithms", "attended": 32, "conducted": 50}, # 64%
        {"subject_code": "CS602", "subject_name": "Database Management Systems", "attended": 31, "conducted": 50}, # 62%
        {"subject_code": "CS603", "subject_name": "Operating Systems", "attended": 33, "conducted": 50}, # 66%
        {"subject_code": "CS604", "subject_name": "Computer Networks", "attended": 32, "conducted": 50}, # 64%
    ],
    # STU104: Ananya Roy - ECE Student
    "STU104": [
        {"subject_code": "EC601", "subject_name": "Digital Signal Processing", "attended": 42, "conducted": 50},
        {"subject_code": "EC602", "subject_name": "VLSI Design", "attended": 40, "conducted": 50},
        {"subject_code": "EC603", "subject_name": "Microprocessors & Microcontrollers", "attended": 41, "conducted": 50},
    ],
    # STU105: Vikram Singh - Mechanical Student
    "STU105": [
        {"subject_code": "ME401", "subject_name": "Thermodynamics", "attended": 36, "conducted": 50},
        {"subject_code": "ME402", "subject_name": "Fluid Mechanics", "attended": 38, "conducted": 50},
        {"subject_code": "ME403", "subject_name": "Manufacturing Processes", "attended": 37, "conducted": 50},
    ],
    # STU106: Sneha Reddy - High Performer (DBMS Upcoming Exam)
    "STU106": [
        {"subject_code": "CS601", "subject_name": "Data Structures & Algorithms", "attended": 47, "conducted": 50},
        {"subject_code": "CS602", "subject_name": "Database Management Systems", "attended": 48, "conducted": 50},
        {"subject_code": "CS603", "subject_name": "Operating Systems", "attended": 46, "conducted": 50},
        {"subject_code": "CS604", "subject_name": "Computer Networks", "attended": 47, "conducted": 50},
    ],
    # STU107: Rohan Gupta
    "STU107": [
        {"subject_code": "CE401", "subject_name": "Structural Analysis", "attended": 45, "conducted": 50},
        {"subject_code": "CE402", "subject_name": "Geotechnical Engineering", "attended": 46, "conducted": 50},
    ],
    # STU108: Kavya Nair
    "STU108": [
        {"subject_code": "CS601", "subject_name": "Data Structures & Algorithms", "attended": 40, "conducted": 50},
        {"subject_code": "CS602", "subject_name": "Database Management Systems", "attended": 39, "conducted": 50},
    ],
    # STU109: Aditya Verma
    "STU109": [
        {"subject_code": "EE401", "subject_name": "Power Systems", "attended": 36, "conducted": 50},
        {"subject_code": "EE402", "subject_name": "Control Systems", "attended": 35, "conducted": 50},
    ],
    # STU110: Neha Joshi
    "STU110": [
        {"subject_code": "CS601", "subject_name": "Data Structures & Algorithms", "attended": 43, "conducted": 50},
        {"subject_code": "CS602", "subject_name": "Database Management Systems", "attended": 44, "conducted": 50},
    ]
}

# Internal Marks DB
MARKS_DB: Dict[str, List[Dict[str, Any]]] = {
    "STU101": [
        {"subject_code": "CS601", "subject_name": "Data Structures & Algorithms", "internal_1": 18.5, "internal_2": 19.0, "assignment_score": 9.5}, # Total Internal: 37/40
        {"subject_code": "CS602", "subject_name": "Database Management Systems", "internal_1": 19.0, "internal_2": 18.0, "assignment_score": 9.0}, # Total Internal: 36/40
    ],
    "STU102": [
        {"subject_code": "CS601", "subject_name": "Data Structures & Algorithms", "internal_1": 14.0, "internal_2": 15.0, "assignment_score": 8.0}, # Total Internal: 29/40
        {"subject_code": "CS602", "subject_name": "Database Management Systems", "internal_1": 13.5, "internal_2": 14.0, "assignment_score": 7.5}, # Total Internal: 27.5/40
    ],
    "STU103": [
        {"subject_code": "CS601", "subject_name": "Data Structures & Algorithms", "internal_1": 10.0, "internal_2": 11.0, "assignment_score": 6.0}, # Total Internal: 21/40
        {"subject_code": "CS602", "subject_name": "Database Management Systems", "internal_1": 9.5, "internal_2": 10.5, "assignment_score": 6.0}, # Total Internal: 20/40
    ],
    "STU104": [
        {"subject_code": "EC601", "subject_name": "Digital Signal Processing", "internal_1": 16.0, "internal_2": 17.0, "assignment_score": 8.5},
    ],
    "STU105": [
        {"subject_code": "ME401", "subject_name": "Thermodynamics", "internal_1": 12.0, "internal_2": 13.0, "assignment_score": 7.0},
    ],
    "STU106": [
        {"subject_code": "CS601", "subject_name": "Data Structures & Algorithms", "internal_1": 19.5, "internal_2": 20.0, "assignment_score": 10.0},
        {"subject_code": "CS602", "subject_name": "Database Management Systems", "internal_1": 19.0, "internal_2": 19.5, "assignment_score": 9.5},
    ]
}

# Timetable DB (Weekly Schedule for CS Section A, Section B, ECE, MECH)
TIMETABLE_DB: Dict[str, Dict[str, List[Dict[str, Any]]]] = {
    "CS-A": {
        "Monday": [
            {"period_number": 1, "time_slot": "09:00 - 10:00", "subject_code": "CS601", "subject_name": "Data Structures & Algorithms", "faculty": "Dr. Aris", "room": "LH-101"},
            {"period_number": 2, "time_slot": "10:00 - 11:00", "subject_code": "CS602", "subject_name": "Database Management Systems", "faculty": "Prof. Mehta", "room": "LH-101"},
            {"period_number": 3, "time_slot": "11:15 - 12:15", "subject_code": "CS603", "subject_name": "Operating Systems", "faculty": "Dr. Kapoor", "room": "LH-101"},
            {"period_number": 4, "time_slot": "14:00 - 16:00", "subject_code": "CS601", "subject_name": "Data Structures Lab", "faculty": "Dr. Aris", "room": "CS-LAB2"}
        ],
        "Tuesday": [
            {"period_number": 1, "time_slot": "09:00 - 10:00", "subject_code": "CS604", "subject_name": "Computer Networks", "faculty": "Dr. Sen", "room": "LH-101"},
            {"period_number": 2, "time_slot": "10:00 - 11:00", "subject_code": "CS601", "subject_name": "Data Structures & Algorithms", "faculty": "Dr. Aris", "room": "LH-101"},
            {"period_number": 3, "time_slot": "11:15 - 12:15", "subject_code": "CS602", "subject_name": "Database Management Systems", "faculty": "Prof. Mehta", "room": "LH-101"}
        ],
        "Wednesday": [
            {"period_number": 1, "time_slot": "09:00 - 10:00", "subject_code": "CS603", "subject_name": "Operating Systems", "faculty": "Dr. Kapoor", "room": "LH-101"},
            {"period_number": 2, "time_slot": "10:00 - 11:00", "subject_code": "CS604", "subject_name": "Computer Networks", "faculty": "Dr. Sen", "room": "LH-101"},
            {"period_number": 3, "time_slot": "11:15 - 12:15", "subject_code": "CS601", "subject_name": "Data Structures & Algorithms", "faculty": "Dr. Aris", "room": "LH-101"},
            {"period_number": 4, "time_slot": "14:00 - 16:00", "subject_code": "CS602", "subject_name": "DBMS Lab", "faculty": "Prof. Mehta", "room": "CS-LAB1"}
        ],
        "Thursday": [
            {"period_number": 1, "time_slot": "09:00 - 10:00", "subject_code": "CS602", "subject_name": "Database Management Systems", "faculty": "Prof. Mehta", "room": "LH-101"},
            {"period_number": 2, "time_slot": "10:00 - 11:00", "subject_code": "CS603", "subject_name": "Operating Systems", "faculty": "Dr. Kapoor", "room": "LH-101"},
            {"period_number": 3, "time_slot": "11:15 - 12:15", "subject_code": "CS604", "subject_name": "Computer Networks", "faculty": "Dr. Sen", "room": "LH-101"}
        ],
        "Friday": [
            {"period_number": 1, "time_slot": "09:00 - 10:00", "subject_code": "CS601", "subject_name": "Data Structures & Algorithms", "faculty": "Dr. Aris", "room": "LH-101"},
            {"period_number": 2, "time_slot": "10:00 - 11:00", "subject_code": "CS604", "subject_name": "Computer Networks", "faculty": "Dr. Sen", "room": "LH-101"},
            {"period_number": 3, "time_slot": "11:15 - 12:15", "subject_code": "CS605", "subject_name": "Artificial Intelligence", "faculty": "Dr. Rao", "room": "LH-101"}
        ]
    }
}

# Examinations DB
EXAMINATIONS_DB: Dict[str, List[Dict[str, Any]]] = {
    "STU101": [
        {"exam_id": "EX101", "subject_code": "CS601", "subject_name": "Data Structures & Algorithms", "exam_type": "MID_TERM", "date": "2026-08-20", "time": "10:00 AM - 12:00 PM", "room": "LH-201", "max_marks": 50.0},
        {"exam_id": "EX102", "subject_code": "CS602", "subject_name": "Database Management Systems", "exam_type": "MID_TERM", "date": "2026-08-22", "time": "10:00 AM - 12:00 PM", "room": "LH-201", "max_marks": 50.0}
    ],
    "STU106": [
        {"exam_id": "EX103", "subject_code": "CS602", "subject_name": "Database Management Systems", "exam_type": "MID_TERM", "date": "2026-08-17", "time": "09:30 AM - 11:30 AM", "room": "LH-105", "max_marks": 50.0},
        {"exam_id": "EX104", "subject_code": "CS603", "subject_name": "Operating Systems", "exam_type": "MID_TERM", "date": "2026-08-19", "time": "09:30 AM - 11:30 AM", "room": "LH-105", "max_marks": 50.0}
    ]
}

# Assignments DB
ASSIGNMENTS_DB: Dict[str, List[Dict[str, Any]]] = {
    "STU101": [
        {"assignment_id": "ASG101", "subject_code": "CS601", "subject_name": "Data Structures", "title": "B-Trees & AVL Implementation", "due_date": "2026-08-18", "status": "SUBMITTED", "max_marks": 10.0}
    ],
    "STU105": [
        {"assignment_id": "ASG102", "subject_code": "ME401", "subject_name": "Thermodynamics", "title": "Second Law Numerical Problems", "due_date": "2026-08-16", "status": "PENDING", "max_marks": 10.0},
        {"assignment_id": "ASG103", "subject_code": "ME402", "subject_name": "Fluid Mechanics", "title": "Bernoulli Equation Lab Report", "due_date": "2026-08-19", "status": "PENDING", "max_marks": 10.0}
    ]
}

# Fees DB
FEES_DB: Dict[str, Dict[str, Any]] = {
    "STU101": {
        "student_id": "STU101",
        "student_name": "Rahul Sharma",
        "tuition_fee_total": 75000.0,
        "tuition_fee_paid": 75000.0,
        "tuition_fee_pending": 0.0,
        "hostel_fee_pending": 0.0,
        "bus_fee_pending": 0.0,
        "total_pending_fee": 0.0,
        "due_date": "2026-07-31",
        "status": "PAID"
    },
    "STU104": {
        "student_id": "STU104",
        "student_name": "Ananya Roy",
        "tuition_fee_total": 85000.0,
        "tuition_fee_paid": 60000.0,
        "tuition_fee_pending": 25000.0,
        "hostel_fee_pending": 5000.0,
        "bus_fee_pending": 0.0,
        "total_pending_fee": 30000.0,
        "due_date": "2026-08-25",
        "status": "PARTIAL"
    },
    "STU103": {
        "student_id": "STU103",
        "student_name": "Amit Kumar",
        "tuition_fee_total": 75000.0,
        "tuition_fee_paid": 50000.0,
        "tuition_fee_pending": 25000.0,
        "hostel_fee_pending": 0.0,
        "bus_fee_pending": 0.0,
        "total_pending_fee": 25000.0,
        "due_date": "2026-08-20",
        "status": "PENDING"
    }
}

# Announcements DB
ANNOUNCEMENTS_DB: List[Dict[str, Any]] = [
    {
        "announcement_id": "ANC001",
        "title": "Mid-Term Examinations Schedule Released",
        "category": "EXAM",
        "date": "2026-08-10",
        "content": "The Mid-Term examinations for Semester 4 and 6 start on August 17th, 2026. Hall tickets are available on the portal.",
        "target_audience": "ALL",
        "important": True
    },
    {
        "announcement_id": "ANC002",
        "title": "Mandatory 75% Attendance Requirement Notice",
        "category": "ACADEMIC",
        "date": "2026-08-05",
        "content": "Students with overall or subject attendance below 75% will not be permitted to sit for the End-Semester examinations without prior medical condonation.",
        "target_audience": "ALL",
        "important": True
    },
    {
        "announcement_id": "ANC003",
        "title": "Tuition Fee Installment Clearance Reminder",
        "category": "FEE",
        "date": "2026-08-01",
        "content": "Parents and students are requested to clear all pending semester tuition fees before August 25th to avoid late submission penalties.",
        "target_audience": "PARENT",
        "important": False
    }
]
