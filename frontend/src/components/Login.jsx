import React, { useState } from 'react';
import { 
  User, 
  Users, 
  Shield, 
  AlertCircle, 
  ArrowRight, 
  Lock 
} from 'lucide-react';
import { api } from '../services/api';

export default function Login({ onLoginSuccess }) {
  const [role, setRole] = useState('STUDENT'); // STUDENT, PARENT, ADMIN
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [studentId, setStudentId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const mockStudents = api.getMockStudents();
  const mockParents = api.getMockParents();

  // Handle Quick Fill dropdown
  const handleQuickFill = (stuId) => {
    if (!stuId) {
      setUsername('');
      setStudentId('');
      return;
    }

    if (role === 'STUDENT') {
      const student = mockStudents.find(s => s.id === stuId);
      if (student) {
        setUsername(student.roll_number);
        setPassword('password');
        setStudentId(student.id);
      }
    } else if (role === 'PARENT') {
      const parent = mockParents.find(p => p.student_id === stuId);
      const student = mockStudents.find(s => s.id === stuId);
      if (parent && student) {
        setUsername(parent.name);
        setPassword('password');
        setStudentId(student.id);
      }
    }
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setUsername('');
    setPassword('');
    setStudentId('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // For Admin, no student ID is needed
      const finalStudentId = role === 'ADMIN' ? null : studentId;
      const res = await api.login(role, username, password || 'password', finalStudentId);
      onLoginSuccess(res.user, res.student_id);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto my-12 animate-fade-in flex flex-col gap-6">
      
      <div className="text-center flex flex-col gap-2">
        <h2 className="text-3xl font-display font-extrabold tracking-tight">Access Portals</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Select your role and authenticate to enter the companion dashboard.
        </p>
      </div>

      {/* Role Selector Tabs */}
      <div className="grid grid-cols-3 gap-2 bg-slate-200/50 dark:bg-slate-950 p-1.5 rounded-xl border border-slate-200 dark:border-slate-850">
        <button
          type="button"
          onClick={() => handleRoleChange('STUDENT')}
          className={`flex flex-col items-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold font-display transition-all ${
            role === 'STUDENT'
              ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-sm border border-teal-500/10'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <User className="h-4 w-4" />
          Student
        </button>
        <button
          type="button"
          onClick={() => handleRoleChange('PARENT')}
          className={`flex flex-col items-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold font-display transition-all ${
            role === 'PARENT'
              ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-sm border border-teal-500/10'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="h-4 w-4" />
          Parent
        </button>
        <button
          type="button"
          onClick={() => handleRoleChange('ADMIN')}
          className={`flex flex-col items-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold font-display transition-all ${
            role === 'ADMIN'
              ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-sm border border-teal-500/10'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Shield className="h-4 w-4" />
          Admin
        </button>
      </div>

      {/* Main Login Card */}
      <div className="glass-panel p-8 rounded-2xl border border-slate-200 dark:border-slate-850 bg-white/70 dark:bg-slate-900/60 flex flex-col gap-5">
        
        {error && (
          <div className="flex gap-2 p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-lg">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* Demo Fast Selector Dropdown (Highly valuable for Hackathon Presentation) */}
        {role !== 'ADMIN' && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Quick Fill Persona (Hackathon Helper)
            </label>
            <select
              value={studentId}
              onChange={(e) => handleQuickFill(e.target.value)}
              className="w-full bg-teal-500/5 dark:bg-teal-950/20 border border-teal-500/20 text-teal-700 dark:text-teal-400 rounded-lg p-2.5 text-xs font-semibold outline-none focus:border-teal-500"
            >
              <option value="">-- Choose a mock persona to fill fields --</option>
              <option value="STU001">Aarav Sharma (88% - Overall Attendance)</option>
              <option value="STU002">Sneha Patel (76% - Borderline Attendance)</option>
              <option value="STU003">Rohan Das (68% - Low Att., ₹25k pending fee)</option>
              <option value="STU004">Priya Nair (82% - ₹15k pending fee due Aug 15)</option>
              <option value="STU005">Aditya Verma (80% - 2 Exams scheduled next week)</option>
              <option value="STU006">Ananya Iyer (74% - Low Attendance, Borderline)</option>
            </select>
          </div>
        )}

        {role === 'ADMIN' && (
          <div className="p-3.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-xs flex flex-col gap-1 text-indigo-700 dark:text-indigo-400">
            <p className="font-bold flex items-center gap-1"><Shield className="h-3.5 w-3.5" /> Admin Hackathon Account</p>
            <p>Admin allows you to edit student attendance data or dispatch announcements to mock databases in real-time.</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Username / ID */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="username-input" className="text-xs font-semibold text-slate-600 dark:text-slate-350">
              {role === 'ADMIN' 
                ? 'Admin Username' 
                : (role === 'STUDENT' ? 'Student Roll Number / Username' : 'Parent Name / Username')}
            </label>
            <input
              id="username-input"
              type="text"
              required
              placeholder={role === 'ADMIN' ? 'admin' : (role === 'STUDENT' ? '2023CS1001' : 'Rajesh Sharma')}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm p-3 rounded-lg outline-none focus:border-teal-500 text-slate-900 dark:text-white"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password-input" className="text-xs font-semibold text-slate-600 dark:text-slate-350">
              Password
            </label>
            <div className="relative">
              <input
                id="password-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm p-3 rounded-lg outline-none focus:border-teal-500 text-slate-900 dark:text-white pr-10"
              />
              <Lock className="absolute right-3 top-3 h-4.5 w-4.5 text-slate-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 justify-center text-sm font-semibold mt-2"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

      </div>

    </div>
  );
}
