/**
 * CollegeAI API Client Service
 * Handles both Mock Mode (for local development and hackathon demos)
 * and Live Mode (connecting to FastAPI backend via HTTP requests).
 */

const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env.VITE_API_BASE_URL || '/api' : '/api';
const USE_MOCK_API = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env.VITE_USE_MOCK_API !== 'false' : true;

// ==========================================
// 1. MOCK SEED DATA
// ==========================================

const mockSubjects = [
  { id: 'SUB001', name: 'Data Structures & Algorithms', faculty: 'Dr. Ramesh Gupta' },
  { id: 'SUB002', name: 'Database Management Systems', faculty: 'Prof. Seema Rao' },
  { id: 'SUB003', name: 'Operating Systems', faculty: 'Dr. John Miller' },
  { id: 'SUB004', name: 'Computer Networks', faculty: 'Prof. Anand Verma' },
  { id: 'SUB005', name: 'Theory of Computation', faculty: 'Dr. S. K. Bose' },
  { id: 'SUB006', name: 'Mathematics I', faculty: 'Prof. M. K. Sen' },
  { id: 'SUB007', name: 'Physics I', faculty: 'Dr. Anita Roy' },
  { id: 'SUB008', name: 'Chemistry I', faculty: 'Dr. R. P. Singh' },
  { id: 'SUB009', name: 'Introduction to Programming', faculty: 'Prof. J. N. Sharma' },
  { id: 'SUB010', name: 'Engineering Graphics', faculty: 'Mr. Amit Pal' },
  { id: 'SUB011', name: 'Professional Communication', faculty: 'Mrs. L. D\'Souza' },
  { id: 'SUB012', name: 'Calculus & Linear Algebra', faculty: 'Prof. M. K. Sen' },
  { id: 'SUB013', name: 'Digital Logic Design', faculty: 'Dr. Anita Roy' },
  { id: 'SUB014', name: 'Discrete Mathematics', faculty: 'Dr. S. K. Bose' },
  { id: 'SUB015', name: 'Software Engineering', faculty: 'Prof. J. N. Sharma' }
];

const mockStudents = [
  {
    id: 'STU001',
    name: 'Aarav Sharma',
    roll_number: '2023CS1001',
    course: 'B.Tech Computer Science',
    semester: 6,
    email: 'aarav.sharma@college.edu',
    attendance: {
      overall: 88.0,
      subjects: [
        { subject_id: 'SUB001', attended: 18, conducted: 20 },
        { subject_id: 'SUB002', attended: 17, conducted: 20 },
        { subject_id: 'SUB003', attended: 18, conducted: 20 },
        { subject_id: 'SUB004', attended: 19, conducted: 20 },
        { subject_id: 'SUB005', attended: 16, conducted: 20 }
      ]
    },
    marks: {
      cgpa: 8.45,
      subjects: [
        { subject_id: 'SUB001', internals: 42, max_internals: 50 },
        { subject_id: 'SUB002', internals: 38, max_internals: 50 },
        { subject_id: 'SUB003', internals: 40, max_internals: 50 },
        { subject_id: 'SUB004', internals: 45, max_internals: 50 },
        { subject_id: 'SUB005', internals: 35, max_internals: 50 }
      ]
    },
    fees: {
      total: 75000,
      paid: 75000,
      pending: 0,
      due_date: '2026-07-31',
      status: 'PAID',
      transactions: [
        { transaction_id: 'TXN9832', amount: 75000, date: '2026-07-15', method: 'Net Banking', status: 'SUCCESS' }
      ]
    },
    assignments: [
      { id: 'ASN001', subject_id: 'SUB001', title: 'Graph Algorithms Analysis', description: 'Analyze BFS/DFS complex structures.', due_date: '2026-08-18', status: 'SUBMITTED', max_marks: 20 },
      { id: 'ASN002', subject_id: 'SUB002', title: 'SQL Query Optimization', description: 'Optimize 10 complex analytical queries.', due_date: '2026-08-20', status: 'SUBMITTED', max_marks: 20 }
    ],
    exams: [
      { subject_id: 'SUB001', exam_type: 'Mid Semester II', date: '2026-08-24', time: '10:00 AM - 12:00 PM', room: 'LHC-302', portion: 'Binary Trees, Graphs, Hash Tables' },
      { subject_id: 'SUB003', exam_type: 'Mid Semester II', date: '2026-08-25', time: '10:00 AM - 12:00 PM', room: 'LHC-304', portion: 'Process Synchronization, Deadlocks' }
    ]
  },
  {
    id: 'STU002',
    name: 'Sneha Patel',
    roll_number: '2023CS1002',
    course: 'B.Tech Computer Science',
    semester: 6,
    email: 'sneha.patel@college.edu',
    attendance: {
      overall: 76.0,
      subjects: [
        { subject_id: 'SUB001', attended: 15, conducted: 20 },
        { subject_id: 'SUB002', attended: 16, conducted: 20 },
        { subject_id: 'SUB003', attended: 14, conducted: 20 },
        { subject_id: 'SUB004', attended: 16, conducted: 20 },
        { subject_id: 'SUB005', attended: 15, conducted: 20 }
      ]
    },
    marks: {
      cgpa: 7.21,
      subjects: [
        { subject_id: 'SUB001', internals: 32, max_internals: 50 },
        { subject_id: 'SUB002', internals: 35, max_internals: 50 },
        { subject_id: 'SUB003', internals: 28, max_internals: 50 },
        { subject_id: 'SUB004', internals: 34, max_internals: 50 },
        { subject_id: 'SUB005', internals: 30, max_internals: 50 }
      ]
    },
    fees: {
      total: 75000,
      paid: 75000,
      pending: 0,
      due_date: '2026-07-31',
      status: 'PAID',
      transactions: [
        { transaction_id: 'TXN9835', amount: 75000, date: '2026-07-16', method: 'UPI', status: 'SUCCESS' }
      ]
    },
    assignments: [
      { id: 'ASN003', subject_id: 'SUB002', title: 'SQL Query Optimization', description: 'Optimize 10 complex analytical queries.', due_date: '2026-08-20', status: 'PENDING', max_marks: 20 }
    ],
    exams: [
      { subject_id: 'SUB001', exam_type: 'Mid Semester II', date: '2026-08-24', time: '10:00 AM - 12:00 PM', room: 'LHC-302', portion: 'Binary Trees, Graphs, Hash Tables' }
    ]
  },
  {
    id: 'STU003',
    name: 'Rohan Das',
    roll_number: '2023CS1003',
    course: 'B.Tech Computer Science',
    semester: 6,
    email: 'rohan.das@college.edu',
    attendance: {
      overall: 68.0,
      subjects: [
        { subject_id: 'SUB001', attended: 12, conducted: 20 },
        { subject_id: 'SUB002', attended: 14, conducted: 20 },
        { subject_id: 'SUB003', attended: 13, conducted: 20 },
        { subject_id: 'SUB004', attended: 15, conducted: 20 },
        { subject_id: 'SUB005', attended: 14, conducted: 20 }
      ]
    },
    marks: {
      cgpa: 6.45,
      subjects: [
        { subject_id: 'SUB001', internals: 24, max_internals: 50 },
        { subject_id: 'SUB002', internals: 27, max_internals: 50 },
        { subject_id: 'SUB003', internals: 25, max_internals: 50 },
        { subject_id: 'SUB004', internals: 30, max_internals: 50 },
        { subject_id: 'SUB005', internals: 28, max_internals: 50 }
      ]
    },
    fees: {
      total: 75000,
      paid: 50000,
      pending: 25000,
      due_date: '2026-08-31',
      status: 'PARTIAL',
      transactions: [
        { transaction_id: 'TXN9128', amount: 50000, date: '2026-07-20', method: 'UPI', status: 'SUCCESS' }
      ]
    },
    assignments: [
      { id: 'ASN004', subject_id: 'SUB003', title: 'OS Process Simulator', description: 'Build a round-robin scheduler simulation in C.', due_date: '2026-08-19', status: 'PENDING', max_marks: 20 },
      { id: 'ASN005', subject_id: 'SUB005', title: 'TOC Turing Machines', description: 'Design state machines for complex languages.', due_date: '2026-08-22', status: 'PENDING', max_marks: 20 }
    ],
    exams: [
      { subject_id: 'SUB001', exam_type: 'Mid Semester II', date: '2026-08-24', time: '10:00 AM - 12:00 PM', room: 'LHC-302', portion: 'Binary Trees, Graphs, Hash Tables' },
      { subject_id: 'SUB004', exam_type: 'Mid Semester II', date: '2026-08-26', time: '02:00 PM - 04:00 PM', room: 'LHC-305', portion: 'Network Layer, Routing, Subnetting' }
    ]
  },
  {
    id: 'STU004',
    name: 'Priya Nair',
    roll_number: '2023CS1004',
    course: 'B.Tech Computer Science',
    semester: 6,
    email: 'priya.nair@college.edu',
    attendance: {
      overall: 82.0,
      subjects: [
        { subject_id: 'SUB001', attended: 16, conducted: 20 },
        { subject_id: 'SUB002', attended: 17, conducted: 20 },
        { subject_id: 'SUB003', attended: 16, conducted: 20 },
        { subject_id: 'SUB004', attended: 16, conducted: 20 },
        { subject_id: 'SUB005', attended: 17, conducted: 20 }
      ]
    },
    marks: {
      cgpa: 8.89,
      subjects: [
        { subject_id: 'SUB001', internals: 45, max_internals: 50 },
        { subject_id: 'SUB002', internals: 43, max_internals: 50 },
        { subject_id: 'SUB003', internals: 44, max_internals: 50 },
        { subject_id: 'SUB004', internals: 41, max_internals: 50 },
        { subject_id: 'SUB005', internals: 42, max_internals: 50 }
      ]
    },
    fees: {
      total: 75000,
      paid: 60000,
      pending: 15000,
      due_date: '2026-08-15', // Demanding fee case
      status: 'PARTIAL',
      transactions: [
        { transaction_id: 'TXN9130', amount: 60000, date: '2026-07-21', method: 'Debit Card', status: 'SUCCESS' }
      ]
    },
    assignments: [
      { id: 'ASN006', subject_id: 'SUB004', title: 'Socket Programming Client/Server', description: 'Implement TCP and UDP file transfers in Python.', due_date: '2026-08-25', status: 'PENDING', max_marks: 20 }
    ],
    exams: [
      { subject_id: 'SUB004', exam_type: 'Mid Semester II', date: '2026-08-26', time: '02:00 PM - 04:00 PM', room: 'LHC-305', portion: 'Network Layer, Routing, Subnetting' }
    ]
  },
  {
    id: 'STU005',
    name: 'Aditya Verma',
    roll_number: '2023CS1005',
    course: 'B.Tech Computer Science',
    semester: 6,
    email: 'aditya.verma@college.edu',
    attendance: {
      overall: 80.0,
      subjects: [
        { subject_id: 'SUB001', attended: 16, conducted: 20 },
        { subject_id: 'SUB002', attended: 15, conducted: 20 },
        { subject_id: 'SUB003', attended: 16, conducted: 20 },
        { subject_id: 'SUB004', attended: 17, conducted: 20 },
        { subject_id: 'SUB005', attended: 16, conducted: 20 }
      ]
    },
    marks: {
      cgpa: 7.95,
      subjects: [
        { subject_id: 'SUB001', internals: 38, max_internals: 50 },
        { subject_id: 'SUB002', internals: 40, max_internals: 50 },
        { subject_id: 'SUB003', internals: 36, max_internals: 50 },
        { subject_id: 'SUB004', internals: 39, max_internals: 50 },
        { subject_id: 'SUB005', internals: 37, max_internals: 50 }
      ]
    },
    fees: {
      total: 75000,
      paid: 75000,
      pending: 0,
      due_date: '2026-07-31',
      status: 'PAID',
      transactions: [
        { transaction_id: 'TXN9133', amount: 75000, date: '2026-07-18', method: 'Credit Card', status: 'SUCCESS' }
      ]
    },
    assignments: [],
    exams: [
      { subject_id: 'SUB001', exam_type: 'Mid Semester II', date: '2026-08-24', time: '10:00 AM - 12:00 PM', room: 'LHC-302', portion: 'Binary Trees, Graphs, Hash Tables' },
      { subject_id: 'SUB002', exam_type: 'Mid Semester II', date: '2026-08-25', time: '02:00 PM - 04:00 PM', room: 'LHC-303', portion: 'Transaction Management, Concurrency Control' }
    ]
  },
  {
    id: 'STU006',
    name: 'Ananya Iyer',
    roll_number: '2023CS1006',
    course: 'B.Tech Computer Science',
    semester: 6,
    email: 'ananya.iyer@college.edu',
    attendance: {
      overall: 74.0, // Borderline below 75%
      subjects: [
        { subject_id: 'SUB001', attended: 14, conducted: 20 },
        { subject_id: 'SUB002', attended: 15, conducted: 20 },
        { subject_id: 'SUB003', attended: 14, conducted: 20 },
        { subject_id: 'SUB004', attended: 16, conducted: 20 },
        { subject_id: 'SUB005', attended: 15, conducted: 20 }
      ]
    },
    marks: {
      cgpa: 8.12,
      subjects: [
        { subject_id: 'SUB001', internals: 40, max_internals: 50 },
        { subject_id: 'SUB002', internals: 39, max_internals: 50 },
        { subject_id: 'SUB003', internals: 41, max_internals: 50 },
        { subject_id: 'SUB004', internals: 42, max_internals: 50 },
        { subject_id: 'SUB005', internals: 38, max_internals: 50 }
      ]
    },
    fees: {
      total: 75000,
      paid: 75000,
      pending: 0,
      due_date: '2026-07-31',
      status: 'PAID',
      transactions: [
        { transaction_id: 'TXN9138', amount: 75000, date: '2026-07-15', method: 'Net Banking', status: 'SUCCESS' }
      ]
    },
    assignments: [],
    exams: [
      { subject_id: 'SUB005', exam_type: 'Mid Semester II', date: '2026-08-27', time: '10:00 AM - 12:00 PM', room: 'LHC-306', portion: 'Context-Free Grammars, Pushdown Automata' }
    ]
  },
  {
    id: 'STU007',
    name: 'Kabir Singh',
    roll_number: '2023CS1007',
    course: 'B.Tech Computer Science',
    semester: 6,
    email: 'kabir.singh@college.edu',
    attendance: {
      overall: 92.0, // High attendance
      subjects: [
        { subject_id: 'SUB001', attended: 19, conducted: 20 },
        { subject_id: 'SUB002', attended: 18, conducted: 20 },
        { subject_id: 'SUB003', attended: 19, conducted: 20 },
        { subject_id: 'SUB004', attended: 18, conducted: 20 },
        { subject_id: 'SUB005', attended: 18, conducted: 20 }
      ]
    },
    marks: {
      cgpa: 9.10,
      subjects: [
        { subject_id: 'SUB001', internals: 47, max_internals: 50 },
        { subject_id: 'SUB002', internals: 46, max_internals: 50 },
        { subject_id: 'SUB003', internals: 48, max_internals: 50 },
        { subject_id: 'SUB004', internals: 45, max_internals: 50 },
        { subject_id: 'SUB005', internals: 46, max_internals: 50 }
      ]
    },
    fees: {
      total: 75000,
      paid: 75000,
      pending: 0,
      due_date: '2026-07-31',
      status: 'PAID',
      transactions: [
        { transaction_id: 'TXN9140', amount: 75000, date: '2026-07-14', method: 'UPI', status: 'SUCCESS' }
      ]
    },
    assignments: [
      { id: 'ASN007', subject_id: 'SUB005', title: 'Context Free Grammar Simplifier', description: 'Write a parser that simplifies CFG rules.', due_date: '2026-08-21', status: 'PENDING', max_marks: 20 }
    ],
    exams: [
      { subject_id: 'SUB005', exam_type: 'Mid Semester II', date: '2026-08-27', time: '10:00 AM - 12:00 PM', room: 'LHC-306', portion: 'Context-Free Grammars, Pushdown Automata' }
    ]
  },
  {
    id: 'STU008',
    name: 'Meera Reddy',
    roll_number: '2023CS1008',
    course: 'B.Tech Computer Science',
    semester: 6,
    email: 'meera.reddy@college.edu',
    attendance: {
      overall: 70.0, // Below 75%
      subjects: [
        { subject_id: 'SUB001', attended: 14, conducted: 20 },
        { subject_id: 'SUB002', attended: 13, conducted: 20 },
        { subject_id: 'SUB003', attended: 14, conducted: 20 },
        { subject_id: 'SUB004', attended: 15, conducted: 20 },
        { subject_id: 'SUB005', attended: 14, conducted: 20 }
      ]
    },
    marks: {
      cgpa: 7.02,
      subjects: [
        { subject_id: 'SUB001', internals: 32, max_internals: 50 },
        { subject_id: 'SUB002', internals: 31, max_internals: 50 },
        { subject_id: 'SUB003', internals: 35, max_internals: 50 },
        { subject_id: 'SUB004', internals: 33, max_internals: 50 },
        { subject_id: 'SUB005', internals: 30, max_internals: 50 }
      ]
    },
    fees: {
      total: 75000,
      paid: 50000,
      pending: 25000,
      due_date: '2026-08-20', // Pending fees & low attendance
      status: 'PARTIAL',
      transactions: [
        { transaction_id: 'TXN9142', amount: 50000, date: '2026-07-22', method: 'UPI', status: 'SUCCESS' }
      ]
    },
    assignments: [],
    exams: [
      { subject_id: 'SUB003', exam_type: 'Mid Semester II', date: '2026-08-25', time: '10:00 AM - 12:00 PM', room: 'LHC-304', portion: 'Process Synchronization, Deadlocks' }
    ]
  },
  {
    id: 'STU009',
    name: 'Yash Gupta',
    roll_number: '2023CS1009',
    course: 'B.Tech Computer Science',
    semester: 6,
    email: 'yash.gupta@college.edu',
    attendance: {
      overall: 78.0,
      subjects: [
        { subject_id: 'SUB001', attended: 16, conducted: 20 },
        { subject_id: 'SUB002', attended: 15, conducted: 20 },
        { subject_id: 'SUB003', attended: 15, conducted: 20 },
        { subject_id: 'SUB004', attended: 16, conducted: 20 },
        { subject_id: 'SUB005', attended: 16, conducted: 20 }
      ]
    },
    marks: {
      cgpa: 7.82,
      subjects: [
        { subject_id: 'SUB001', internals: 36, max_internals: 50 },
        { subject_id: 'SUB002', internals: 38, max_internals: 50 },
        { subject_id: 'SUB003', internals: 35, max_internals: 50 },
        { subject_id: 'SUB004', internals: 37, max_internals: 50 },
        { subject_id: 'SUB005', internals: 36, max_internals: 50 }
      ]
    },
    fees: {
      total: 75000,
      paid: 75000,
      pending: 0,
      due_date: '2026-07-31',
      status: 'PAID',
      transactions: [
        { transaction_id: 'TXN9145', amount: 75000, date: '2026-07-15', method: 'Net Banking', status: 'SUCCESS' }
      ]
    },
    assignments: [],
    exams: []
  },
  {
    id: 'STU010',
    name: 'Riya Sen',
    roll_number: '2023CS1010',
    course: 'B.Tech Computer Science',
    semester: 6,
    email: 'riya.sen@college.edu',
    attendance: {
      overall: 85.0,
      subjects: [
        { subject_id: 'SUB001', attended: 17, conducted: 20 },
        { subject_id: 'SUB002', attended: 17, conducted: 20 },
        { subject_id: 'SUB003', attended: 17, conducted: 20 },
        { subject_id: 'SUB004', attended: 17, conducted: 20 },
        { subject_id: 'SUB005', attended: 17, conducted: 20 }
      ]
    },
    marks: {
      cgpa: 8.65,
      subjects: [
        { subject_id: 'SUB001', internals: 44, max_internals: 50 },
        { subject_id: 'SUB002', internals: 41, max_internals: 50 },
        { subject_id: 'SUB003', internals: 43, max_internals: 50 },
        { subject_id: 'SUB004', internals: 42, max_internals: 50 },
        { subject_id: 'SUB005', internals: 43, max_internals: 50 }
      ]
    },
    fees: {
      total: 75000,
      paid: 75000,
      pending: 0,
      due_date: '2026-07-31',
      status: 'PAID',
      transactions: [
        { transaction_id: 'TXN9148', amount: 75000, date: '2026-07-16', method: 'UPI', status: 'SUCCESS' }
      ]
    },
    assignments: [],
    exams: [
      { subject_id: 'SUB002', exam_type: 'Mid Semester II', date: '2026-08-25', time: '02:00 PM - 04:00 PM', room: 'LHC-303', portion: 'Transaction Management, Concurrency Control' }
    ]
  }
];

const mockParents = [
  { id: 'PAR001', name: 'Rajesh Sharma', student_id: 'STU001' },
  { id: 'PAR002', name: 'Kiran Patel', student_id: 'STU002' },
  { id: 'PAR003', name: 'Alok Das', student_id: 'STU003' },
  { id: 'PAR004', name: 'Saraswathi Nair', student_id: 'STU004' },
  { id: 'PAR005', name: 'Vikram Verma', student_id: 'STU005' },
  { id: 'PAR006', name: 'Lakshmi Iyer', student_id: 'STU006' },
  { id: 'PAR007', name: 'Harbhajan Singh', student_id: 'STU007' },
  { id: 'PAR008', name: 'Venkat Reddy', student_id: 'STU008' },
  { id: 'PAR009', name: 'Sanjay Gupta', student_id: 'STU009' },
  { id: 'PAR010', name: 'Amit Sen', student_id: 'STU010' }
];

// Timetable schedule (grouped by Day of Week)
const mockTimetable = {
  Monday: [
    { subject_id: 'SUB001', time: '09:00 AM - 10:00 AM', room: 'LHC-302' },
    { subject_id: 'SUB002', time: '11:00 AM - 12:00 PM', room: 'LHC-303' },
    { subject_id: 'SUB003', time: '02:00 PM - 03:00 PM', room: 'LHC-304' }
  ],
  Tuesday: [
    { subject_id: 'SUB004', time: '09:00 AM - 10:00 AM', room: 'LHC-305' },
    { subject_id: 'SUB005', time: '11:00 AM - 12:00 PM', room: 'LHC-306' },
    { subject_id: 'SUB001', time: '02:00 PM - 03:00 PM', room: 'LHC-302' }
  ],
  Wednesday: [
    { subject_id: 'SUB002', time: '09:00 AM - 10:00 AM', room: 'LHC-303' },
    { subject_id: 'SUB003', time: '11:00 AM - 12:00 PM', room: 'LHC-304' },
    { subject_id: 'SUB004', time: '02:00 PM - 03:00 PM', room: 'LHC-305' }
  ],
  Thursday: [
    { subject_id: 'SUB005', time: '09:00 AM - 10:00 AM', room: 'LHC-306' },
    { subject_id: 'SUB001', time: '11:00 AM - 12:00 PM', room: 'LHC-302' },
    { subject_id: 'SUB003', time: '02:00 PM - 03:00 PM', room: 'LHC-304' }
  ],
  Friday: [
    { subject_id: 'SUB002', time: '09:00 AM - 10:00 AM', room: 'LHC-303' },
    { subject_id: 'SUB004', time: '11:00 AM - 12:00 PM', room: 'LHC-305' },
    { subject_id: 'SUB005', time: '02:00 PM - 03:00 PM', room: 'LHC-306' }
  ]
};

// Announcements seed data
let mockAnnouncements = [
  { id: 'ANC001', title: 'Independence Day Celebrations', content: 'Flag hoisting at 08:30 AM in the central courtyard. Attendance is highly encouraged.', date: '2026-08-12', category: 'ADMIN' },
  { id: 'ANC002', title: 'Mid Semester II Exam Schedule', content: 'Mid-Sem II examinations will commence from 24th August 2026. Hall tickets available on portal.', date: '2026-08-10', category: 'EXAM' },
  { id: 'ANC003', title: 'AI/ML Hackathon Registrations Open', content: 'Register in groups of 3 for the CollegeAI hackathon before 20th August 2026.', date: '2026-08-08', category: 'FEST' },
  { id: 'ANC004', title: 'Odd Semester Course Registration Deadline', content: 'Complete online course registration for next semester by 18th August to avoid late fees.', date: '2026-08-05', category: 'ACADEMIC' }
];

// ==========================================
// 2. DETERMINISTIC CALCULATIONS (LOCAL IMPLEMENTATION)
// ==========================================

/**
 * Calculates leave capacity for a student.
 * Formulas:
 * attended / (conducted + x) >= 0.75
 * => conducted + x <= attended / 0.75
 * => x <= (attended / 0.75) - conducted
 */
export function localCalculateLeaveCapacity(student) {
  if (!student || !student.attendance || !student.attendance.subjects) return [];

  return student.attendance.subjects.map(record => {
    const sub = mockSubjects.find(s => s.id === record.subject_id);
    const name = sub ? sub.name : 'Unknown';
    const currentPct = (record.attended / record.conducted) * 100;
    
    let capacity = 0;
    if (currentPct >= 75) {
      capacity = Math.floor((record.attended / 0.75) - record.conducted);
      if (capacity < 0) capacity = 0;
    }
    
    return {
      subject_id: record.subject_id,
      subject_name: name,
      attended: record.attended,
      conducted: record.conducted,
      current_percentage: Math.round(currentPct * 10) / 10,
      classes_can_miss: capacity
    };
  });
}

/**
 * Calculates consecutive classes needed to reach a target percentage.
 * Formula:
 * (attended + y) / (conducted + y) >= target
 * => attended + y >= target * conducted + target * y
 * => y * (1 - target) >= target * conducted - attended
 * => y >= (target * conducted - attended) / (1 - target)
 */
export function localCalculateRequiredClasses(student, targetPct) {
  if (!student || !student.attendance) return [];
  const targetFraction = targetPct / 100;

  return student.attendance.subjects.map(record => {
    const sub = mockSubjects.find(s => s.id === record.subject_id);
    const name = sub ? sub.name : 'Unknown';
    const currentPct = (record.attended / record.conducted) * 100;
    
    let reqClasses = 0;
    if (currentPct < targetPct) {
      reqClasses = Math.ceil((targetFraction * record.conducted - record.attended) / (1 - targetFraction));
      if (reqClasses < 0) reqClasses = 0;
    }

    return {
      subject_id: record.subject_id,
      subject_name: name,
      attended: record.attended,
      conducted: record.conducted,
      current_percentage: Math.round(currentPct * 10) / 10,
      target_percentage: targetPct,
      required_classes: reqClasses
    };
  });
}

/**
 * Project attendance based on timetable and dates.
 * Analyzes dates and checks how many classes are conducted on those days of week.
 */
export function localCalculateAttendanceProject(student, startDateStr, endDateStr) {
  if (!student || !student.attendance) return null;

  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  const daysRequested = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

  if (isNaN(daysRequested) || daysRequested <= 0) return null;

  // Track missed classes per subject
  const missedCount = {};
  mockSubjects.forEach(s => { missedCount[s.id] = 0; });

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Loop through all dates in the range
  const currentDate = new Date(startDate);
  for (let i = 0; i < daysRequested; i++) {
    const dayName = daysOfWeek[currentDate.getDay()];
    if (mockTimetable[dayName]) {
      mockTimetable[dayName].forEach(slot => {
        if (missedCount[slot.subject_id] !== undefined) {
          missedCount[slot.subject_id]++;
        }
      });
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Calculate projected attendance
  let totalAttended = 0;
  let totalConductedCurrent = 0;
  let totalConductedProjected = 0;

  const subjects_affected = student.attendance.subjects.map(record => {
    const sub = mockSubjects.find(s => s.id === record.subject_id);
    const name = sub ? sub.name : 'Unknown';
    const missed = missedCount[record.subject_id] || 0;
    
    const currentPct = (record.attended / record.conducted) * 100;
    const projectedPct = (record.attended / (record.conducted + missed)) * 100;

    totalAttended += record.attended;
    totalConductedCurrent += record.conducted;
    totalConductedProjected += (record.conducted + missed);

    return {
      subject_id: record.subject_id,
      subject_name: name,
      current_percentage: Math.round(currentPct * 10) / 10,
      projected_percentage: Math.round(projectedPct * 10) / 10,
      classes_missed: missed,
      falls_below_75: projectedPct < 75
    };
  });

  const currentOverall = (totalAttended / totalConductedCurrent) * 100;
  const projectedOverall = (totalAttended / totalConductedProjected) * 100;
  const totalMissedClasses = Object.values(missedCount).reduce((a, b) => a + b, 0);

  return {
    student_id: student.id,
    current_overall_percentage: Math.round(currentOverall * 10) / 10,
    projected_overall_percentage: Math.round(projectedOverall * 10) / 10,
    days_requested: daysRequested,
    classes_missed_count: totalMissedClasses,
    subjects_affected
  };
}

// ==========================================
// 3. MOCK AI CONVERSATIONAL ROUTER
// ==========================================

export function simulateAIChatReply(role, studentId, message) {
  const student = mockStudents.find(s => s.id === studentId);
  if (!student) {
    return {
      reply: "I am unable to retrieve student records. Please ensure you are logged in correctly.",
      tool_called: null,
      data: null
    };
  }

  const query = message.toLowerCase();

  // Case 1: TIMETABLE
  if (query.includes('timetable') || query.includes('class schedule') || query.includes('schedule next week') || query.includes('calendar')) {
    const scheduleData = {};
    Object.keys(mockTimetable).forEach(day => {
      scheduleData[day] = mockTimetable[day].map(slot => {
        const sub = mockSubjects.find(s => s.id === slot.subject_id);
        return {
          time: slot.time,
          subject_name: sub ? sub.name : 'Unknown',
          room: slot.room,
          faculty: sub ? sub.faculty : 'Unknown'
        };
      });
    });

    return {
      reply: `Here is your weekly academic class schedule. Classes are held Monday through Friday at the Lecture Hall Complex (LHC).`,
      tool_called: 'get_timetable',
      data: {
        type: 'timetable',
        schedule: scheduleData
      }
    };
  }

  // Case 2: LEAVE PROJECTION (What-if leave next week)
  // Check if dates or leave duration are mentioned
  const leaveMatch = query.match(/(?:leave|miss)(?:\s+for)?\s+(\d+)\s+day/);
  if (query.includes('leave') && (query.includes('next week') || query.includes('days') || query.includes('monday') || leaveMatch)) {
    // Determine start/end date simulation relative to August 14, 2026 (Friday)
    // Next Monday is August 17, 2026.
    let start = '2026-08-17';
    let end = '2026-08-17';
    let label = 'next Monday (August 17)';

    if (query.includes('3 days') || (leaveMatch && leaveMatch[1] === '3')) {
      end = '2026-08-19';
      label = '3 days leave next week (August 17 - August 19)';
    } else if (query.includes('5 days') || query.includes('whole week') || (leaveMatch && leaveMatch[1] === '5')) {
      end = '2026-08-21';
      label = '5 days leave next week (August 17 - August 21)';
    } else if (query.includes('tuesday')) {
      start = '2026-08-18';
      end = '2026-08-18';
      label = 'next Tuesday (August 18)';
    }

    const projection = localCalculateAttendanceProject(student, start, end);
    if (!projection) {
      return {
        reply: "I couldn't process the leave projection calculation. Please verify the dates.",
        tool_called: null,
        data: null
      };
    }

    const criticalList = projection.subjects_affected
      .filter(s => s.falls_below_75)
      .map(s => `${s.subject_name} (${s.projected_percentage}%)`);

    let reply = `If you take leave for ${label}, you will miss a total of ${projection.classes_missed_count} lectures. Your overall attendance will drop from ${projection.current_overall_percentage}% to ${projection.projected_overall_percentage}%. `;
    
    if (criticalList.length > 0) {
      reply += `⚠️ WARNING: Your attendance will fall below the required 75% threshold in the following subjects: ${criticalList.join(', ')}. I advise against taking this leave or suggest arranging compensatory classes.`;
    } else {
      reply += `✅ Good news: Even after missing these classes, your attendance in all subjects will remain above 75%.`;
    }

    return {
      reply,
      tool_called: 'calculate_projected_attendance',
      data: {
        type: 'projection',
        label,
        summary: projection,
        subjects: projection.subjects_affected
      }
    };
  }

  // Case 3: LEAVE CAPACITY (how many classes can I miss)
  if (query.includes('miss') || query.includes('leave capacity') || query.includes('can i miss') || query.includes('skip class')) {
    const capacityList = localCalculateLeaveCapacity(student);
    const criticalList = capacityList.filter(s => s.classes_can_miss === 0);
    const safeList = capacityList.filter(s => s.classes_can_miss > 0);

    let reply = `Based on your current attendance records, here is how many classes you can miss and still maintain the required 75% attendance threshold: \n`;
    
    if (safeList.length > 0) {
      reply += `You have cushion in: \n` + safeList.map(s => `- ${s.subject_name}: ${s.classes_can_miss} classes`).join('\n') + `\n`;
    }
    if (criticalList.length > 0) {
      reply += `⚠️ Alert: You cannot miss ANY more classes in: \n` + criticalList.map(s => `- ${s.subject_name} (currently ${s.current_percentage}%)`).join('\n') + `\n`;
    }

    return {
      reply,
      tool_called: 'calculate_leave_capacity',
      data: {
        type: 'leave_capacity',
        capacities: capacityList
      }
    };
  }

  // Case 4: REACH TARGET (consecutive classes to attend)
  const targetMatch = query.match(/(?:reach|get to|raise to)\s+(\d+)\s*%/);
  if (query.includes('reach') || query.includes('raise') || query.includes('consecutive') || targetMatch) {
    const targetPct = targetMatch ? parseInt(targetMatch[1]) : 80;
    const reqList = localCalculateRequiredClasses(student, targetPct);
    const neededList = reqList.filter(s => s.required_classes > 0);

    let reply = `To reach an attendance target of ${targetPct}% in all your subjects, here are the consecutive classes you must attend: \n`;
    
    if (neededList.length > 0) {
      reply += neededList.map(s => `- ${s.subject_name}: Attend next ${s.required_classes} consecutive classes (currently at ${s.current_percentage}%)`).join('\n');
    } else {
      reply = `Your attendance in all subjects is already above ${targetPct}%! Nice work.`;
    }

    return {
      reply,
      tool_called: 'calculate_required_classes',
      data: {
        type: 'required_classes',
        target: targetPct,
        records: reqList
      }
    };
  }

  // Case 5: CURRENT ATTENDANCE
  if (query.includes('attendance') || query.includes('present') || query.includes('absent')) {
    const overall = student.attendance.overall;
    let feedback = overall >= 85 ? "Excellent! Keep it up." : (overall >= 75 ? "Your attendance is satisfactory but keep tracking it." : "⚠️ CRITICAL: Your attendance is below the 75% threshold. You are in danger of debarment!");
    
    const records = student.attendance.subjects.map(record => {
      const sub = mockSubjects.find(s => s.id === record.subject_id);
      return {
        subject_name: sub ? sub.name : 'Unknown',
        percentage: Math.round((record.attended / record.conducted) * 1000) / 10,
        attended: record.attended,
        conducted: record.conducted,
        faculty: sub ? sub.faculty : 'Unknown'
      };
    });

    return {
      reply: `Your overall attendance is **${overall}%** (${student.attendance.subjects.reduce((sum, s) => sum + s.attended, 0)} out of ${student.attendance.subjects.reduce((sum, s) => sum + s.conducted, 0)} classes). ${feedback}`,
      tool_called: 'get_attendance',
      data: {
        type: 'attendance',
        overall,
        records
      }
    };
  }

  // Case 6: MARKS & EXAMS
  if (query.includes('exam') || query.includes('test') || query.includes('mid sem') || query.includes('schedule')) {
    const examsList = student.exams.map(e => {
      const sub = mockSubjects.find(s => s.id === e.subject_id);
      return {
        ...e,
        subject_name: sub ? sub.name : 'Unknown'
      };
    });

    if (examsList.length === 0) {
      return {
        reply: "You have no upcoming examinations scheduled in the near future.",
        tool_called: 'get_examinations',
        data: { type: 'exams', exams: [] }
      };
    }

    return {
      reply: `You have ${examsList.length} upcoming exam(s) scheduled. Make sure to review the portions and check room allocations in the card details below.`,
      tool_called: 'get_examinations',
      data: {
        type: 'exams',
        exams: examsList
      }
    };
  }

  // Case 7: MARKS & CGPA / TARGET CALCULATOR
  if (query.includes('mark') || query.includes('grade') || query.includes('cgpa') || query.includes('internals') || query.includes('end semester')) {
    const marksRecords = student.marks.subjects.map(m => {
      const sub = mockSubjects.find(s => s.id === m.subject_id);
      // Calculate target end sem marks needed to achieve grade thresholds
      // Assume total score = 50% internal (out of 50) + 50% endsem (out of 100, weighted to 50)
      // Total score >= 90 for S (or A+), >= 80 for A, >= 70 for B, >= 60 for C
      // So weighted_endsem >= Target - internals
      // Which means end_sem_marks_out_of_100 >= (Target - internals) * 2
      const internals = m.internals;
      const getNeeded = (target) => {
        const diff = target - internals;
        if (diff <= 0) return 0;
        if (diff > 50) return 'UNACHIEVABLE';
        return diff * 2; // scale to 100
      };

      return {
        subject_name: sub ? sub.name : 'Unknown',
        internals,
        max_internals: m.max_internals,
        target_grades: {
          'S Grade (90+)': getNeeded(90),
          'A Grade (80+)': getNeeded(80),
          'B Grade (70+)': getNeeded(70),
          'C Grade (60+)': getNeeded(60)
        }
      };
    });

    return {
      reply: `Your current cumulative CGPA is **${student.marks.cgpa}**. Here is your internal marks status and what you need in the end-semester exams to secure target grades.`,
      tool_called: 'get_marks',
      data: {
        type: 'marks',
        cgpa: student.marks.cgpa,
        records: marksRecords
      }
    };
  }

  // Case 8: ASSIGNMENTS
  if (query.includes('assignment') || query.includes('pending') || query.includes('due') || query.includes('homework')) {
    const pendingList = student.assignments.map(a => {
      const sub = mockSubjects.find(s => s.id === a.subject_id);
      return {
        ...a,
        subject_name: sub ? sub.name : 'Unknown'
      };
    });

    const pendingCount = pendingList.filter(a => a.status === 'PENDING').length;
    let reply = `You have ${pendingCount} pending assignment(s). `;
    if (pendingCount > 0) {
      reply += `Please complete them before the due dates to avoid grade penalties. Check details in the attachments list.`;
    } else {
      reply += `Great job! All your assignments are currently submitted.`;
    }

    return {
      reply,
      tool_called: 'get_assignments',
      data: {
        type: 'assignments',
        assignments: pendingList
      }
    };
  }

  // Case 9: FEES
  if (query.includes('fee') || query.includes('fine') || query.includes('pending fee') || query.includes('payment') || query.includes('dues')) {
    const fee = student.fees;
    let reply = `Your fee payment status is **${fee.status}**. `;
    if (fee.pending > 0) {
      reply += `There is an outstanding balance of **₹${fee.pending.toLocaleString('en-IN')}** due by ${fee.due_date}. Please clear the dues immediately.`;
    } else {
      reply += `All college fees (₹${fee.total.toLocaleString('en-IN')}) are fully cleared. Thank you.`;
    }

    return {
      reply,
      tool_called: 'get_fees',
      data: {
        type: 'fees',
        ...fee
      }
    };
  }

  // Case 10: ANNOUNCEMENTS
  if (query.includes('announcement') || query.includes('notice') || query.includes('alert') || query.includes('circular')) {
    return {
      reply: `Here are the latest college notices and announcements from the administrative and academic offices:`,
      tool_called: 'get_announcements',
      data: {
        type: 'announcements',
        announcements: mockAnnouncements
      }
    };
  }

  // Fallback: General conversation
  let roleLabel = role === 'PARENT' ? 'parent' : 'student';
  return {
    reply: `Hello! I am CollegeAI, your personal assistant. As a logged-in ${roleLabel}, you can ask me real-time queries about class schedules, attendance calculations, leave capacity projections, exams, assignments, internal marks, or college fees. For example, ask me: "How many classes can I miss?" or "What are my upcoming exams?"`,
    tool_called: null,
    data: null
  };
}

// ==========================================
// 4. API CLIENT IMPLEMENTATION
// ==========================================

export const api = {
  // Authentication
  async login(role, username, password, studentId = null) {
    if (USE_MOCK_API) {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));

      let matchedUser = null;
      let targetStudentId = studentId;

      if (role === 'STUDENT') {
        const student = mockStudents.find(s => s.id === studentId || s.name.toLowerCase().includes(username.toLowerCase()));
        if (student) {
          matchedUser = { id: student.id, username: username || student.roll_number, role: 'STUDENT', name: student.name };
          targetStudentId = student.id;
        }
      } else if (role === 'PARENT') {
        const parent = mockParents.find(p => p.student_id === studentId || p.name.toLowerCase().includes(username.toLowerCase()));
        if (parent) {
          matchedUser = { id: parent.id, username: username || 'parent', role: 'PARENT', name: parent.name };
          targetStudentId = parent.student_id;
        }
      } else if (role === 'ADMIN') {
        matchedUser = { id: 'ADM001', username: username || 'admin', role: 'ADMIN', name: 'System Administrator' };
        targetStudentId = null;
      }

      if (!matchedUser) {
        throw new Error('Invalid username, password, or student combination.');
      }

      return {
        token: 'mock-jwt-token-xyz',
        user: matchedUser,
        student_id: targetStudentId
      };
    } else {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, username, password, student_id: studentId })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Login failed.');
      }
      return response.json();
    }
  },

  // Student Profile
  async getProfile(studentId) {
    if (USE_MOCK_API) {
      const s = mockStudents.find(stu => stu.id === studentId);
      if (!s) throw new Error('Student not found');
      return {
        student_id: s.id,
        name: s.name,
        roll_number: s.roll_number,
        course: s.course,
        semester: s.semester,
        email: s.email
      };
    }
    const res = await fetch(`${API_BASE_URL}/student/${studentId}/profile`);
    return res.json();
  },

  // Attendance Data
  async getAttendance(studentId) {
    if (USE_MOCK_API) {
      const s = mockStudents.find(stu => stu.id === studentId);
      if (!s) throw new Error('Student not found');
      const records = s.attendance.subjects.map(r => {
        const sub = mockSubjects.find(subObj => subObj.id === r.subject_id);
        return {
          subject_id: r.subject_id,
          subject_name: sub ? sub.name : 'Unknown',
          attended: r.attended,
          conducted: r.conducted,
          percentage: Math.round((r.attended / r.conducted) * 1000) / 10,
          faculty: sub ? sub.faculty : 'Unknown'
        };
      });
      return {
        student_id: studentId,
        overall_percentage: s.attendance.overall,
        total_attended: s.attendance.subjects.reduce((a, b) => a + b.attended, 0),
        total_conducted: s.attendance.subjects.reduce((a, b) => a + b.conducted, 0),
        records
      };
    }
    const res = await fetch(`${API_BASE_URL}/student/${studentId}/attendance`);
    return res.json();
  },

  // Timetable
  async getTimetable(studentId) {
    if (USE_MOCK_API) {
      const schedule = {};
      Object.keys(mockTimetable).forEach(day => {
        schedule[day] = mockTimetable[day].map(slot => {
          const sub = mockSubjects.find(s => s.id === slot.subject_id);
          return {
            time: slot.time,
            subject_name: sub ? sub.name : 'Unknown',
            room: slot.room,
            faculty: sub ? sub.faculty : 'Unknown'
          };
        });
      });
      return { student_id: studentId, schedule };
    }
    const res = await fetch(`${API_BASE_URL}/student/${studentId}/timetable`);
    return res.json();
  },

  // Marks / CGPA
  async getMarks(studentId) {
    if (USE_MOCK_API) {
      const s = mockStudents.find(stu => stu.id === studentId);
      if (!s) throw new Error('Student not found');
      const records = s.marks.subjects.map(m => {
        const sub = mockSubjects.find(subObj => subObj.id === m.subject_id);
        const internals = m.internals;
        const getNeeded = (target) => {
          const diff = target - internals;
          if (diff <= 0) return 0;
          if (diff > 50) return null; // unachievable (e.g. end sem out of 50 is max)
          return diff * 2; // scale to 100
        };
        return {
          subject_id: m.subject_id,
          subject_name: sub ? sub.name : 'Unknown',
          internals: m.internals,
          max_internals: m.max_internals,
          weightage_internals: 50,
          weightage_endsem: 50,
          target_grades: {
            'S (90+)': getNeeded(90),
            'A (80+)': getNeeded(80),
            'B (70+)': getNeeded(70),
            'C (60+)': getNeeded(60)
          }
        };
      });
      return {
        student_id: studentId,
        cgpa: s.marks.cgpa,
        records
      };
    }
    const res = await fetch(`${API_BASE_URL}/student/${studentId}/marks`);
    return res.json();
  },

  // Examinations
  async getExams(studentId) {
    if (USE_MOCK_API) {
      const s = mockStudents.find(stu => stu.id === studentId);
      if (!s) throw new Error('Student not found');
      const exams = s.exams.map(e => {
        const sub = mockSubjects.find(subObj => subObj.id === e.subject_id);
        return {
          subject_name: sub ? sub.name : 'Unknown',
          exam_type: e.exam_type,
          date: e.date,
          time: e.time,
          room: e.room,
          portion: e.portion
        };
      });
      return { student_id: studentId, exams };
    }
    const res = await fetch(`${API_BASE_URL}/student/${studentId}/exams`);
    return res.json();
  },

  // Assignments
  async getAssignments(studentId) {
    if (USE_MOCK_API) {
      const s = mockStudents.find(stu => stu.id === studentId);
      if (!s) throw new Error('Student not found');
      const list = s.assignments.map(a => {
        const sub = mockSubjects.find(subObj => subObj.id === a.subject_id);
        return {
          id: a.id,
          subject_name: sub ? sub.name : 'Unknown',
          title: a.title,
          description: a.description,
          due_date: a.due_date,
          status: a.status,
          max_marks: a.max_marks
        };
      });
      return { student_id: studentId, assignments: list };
    }
    const res = await fetch(`${API_BASE_URL}/student/${studentId}/assignments`);
    return res.json();
  },

  // Fees
  async getFees(studentId) {
    if (USE_MOCK_API) {
      const s = mockStudents.find(stu => stu.id === studentId);
      if (!s) throw new Error('Student not found');
      return {
        student_id: studentId,
        ...s.fees
      };
    }
    const res = await fetch(`${API_BASE_URL}/student/${studentId}/fees`);
    return res.json();
  },

  // Announcements
  async getAnnouncements() {
    if (USE_MOCK_API) {
      return { announcements: mockAnnouncements };
    }
    const res = await fetch(`${API_BASE_URL}/student/announcements`);
    return res.json();
  },

  // Leave projection calculations
  async projectAttendance(studentId, startDateStr, endDateStr) {
    if (USE_MOCK_API) {
      const s = mockStudents.find(stu => stu.id === studentId);
      if (!s) throw new Error('Student not found');
      return localCalculateAttendanceProject(s, startDateStr, endDateStr);
    }
    const res = await fetch(`${API_BASE_URL}/calculations/attendance-project`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_id: studentId, leave_start_date: startDateStr, leave_end_date: endDateStr })
    });
    return res.json();
  },

  // Leave capacity calculations
  async getLeaveCapacity(studentId) {
    if (USE_MOCK_API) {
      const s = mockStudents.find(stu => stu.id === studentId);
      if (!s) throw new Error('Student not found');
      return {
        student_id: studentId,
        capacity: localCalculateLeaveCapacity(s)
      };
    }
    const res = await fetch(`${API_BASE_URL}/calculations/leave-capacity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_id: studentId })
    });
    return res.json();
  },

  // Chat message AI Agent
  async sendChatMessage(role, studentId, message) {
    if (USE_MOCK_API) {
      // Simulate minor typing latency
      await new Promise(resolve => setTimeout(resolve, 1000));
      return simulateAIChatReply(role, studentId, message);
    }
    const res = await fetch(`${API_BASE_URL}/chat/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, student_id: studentId, message })
    });
    if (!res.ok) {
      throw new Error('Failed to send chat message.');
    }
    return res.json();
  },

  // Admin and Demo Helpers
  getMockStudents() {
    return mockStudents;
  },

  getMockParents() {
    return mockParents;
  },

  updateMockStudentAttendance(studentId, subjectId, attended, conducted) {
    const student = mockStudents.find(s => s.id === studentId);
    if (!student) return false;
    const record = student.attendance.subjects.find(r => r.subject_id === subjectId);
    if (!record) return false;
    record.attended = parseInt(attended);
    record.conducted = parseInt(conducted);
    
    // Re-evaluate overall attendance percentage
    const totalAtt = student.attendance.subjects.reduce((sum, r) => sum + r.attended, 0);
    const totalCond = student.attendance.subjects.reduce((sum, r) => sum + r.conducted, 0);
    student.attendance.overall = Math.round((totalAtt / totalCond) * 1000) / 10;
    return true;
  },

  updateMockStudentFees(studentId, pendingAmount) {
    const student = mockStudents.find(s => s.id === studentId);
    if (!student) return false;
    student.fees.pending = parseInt(pendingAmount);
    student.fees.status = pendingAmount === 0 ? 'PAID' : (pendingAmount === student.fees.total ? 'UNPAID' : 'PARTIAL');
    return true;
  },

  dispatchMockAnnouncement(title, content, category) {
    const newAnc = {
      id: `ANC00${mockAnnouncements.length + 1}`,
      title,
      content,
      category,
      date: new Date().toISOString().split('T')[0]
    };
    mockAnnouncements.unshift(newAnc);
    return newAnc;
  }
};
