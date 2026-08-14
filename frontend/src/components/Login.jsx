import React, { useState } from 'react';
import { User, Users, Shield, AlertCircle, ArrowRight, Lock, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export default function Login({ onLoginSuccess }) {
  const [role, setRole] = useState('STUDENT');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [studentId, setStudentId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const mockStudents = api.getMockStudents();
  const mockParents = api.getMockParents();

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
      const finalStudentId = role === 'ADMIN' ? null : studentId;
      const res = await api.login(role, username, password || 'password', finalStudentId);
      onLoginSuccess(res.user, res.student_id);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto my-10 animate-fade-in flex flex-col gap-6">
      
      <div className="text-center flex flex-col gap-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-display font-semibold text-xs border border-indigo-500/20 w-fit mx-auto">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Role-Based Identity Portal</span>
        </div>
        <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Sign In to CollegeAI</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Select your role to access personalized companion dashboards.
        </p>
      </div>

      {/* Role Selector Tabs */}
      <div className="grid grid-cols-3 gap-1.5 bg-slate-200/60 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
        <button
          type="button"
          onClick={() => handleRoleChange('STUDENT')}
          className={`flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-bold font-display transition-all ${
            role === 'STUDENT'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <User className="h-4 w-4" />
          Student
        </button>
        <button
          type="button"
          onClick={() => handleRoleChange('PARENT')}
          className={`flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-bold font-display transition-all ${
            role === 'PARENT'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="h-4 w-4" />
          Parent
        </button>
        <button
          type="button"
          onClick={() => handleRoleChange('ADMIN')}
          className={`flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-bold font-display transition-all ${
            role === 'ADMIN'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Shield className="h-4 w-4" />
          Admin
        </button>
      </div>

      {/* Main Form Glass Card */}
      <div className="glass-card p-6 flex flex-col gap-5">
        {error && (
          <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-2 font-medium">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {role !== 'ADMIN' && (
          <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/15">
            <label className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Quick Persona Autofill (Hackathon Helper)
            </label>
            <select
              value={studentId}
              onChange={(e) => handleQuickFill(e.target.value)}
              className="glass-input text-xs font-medium text-slate-800 dark:text-slate-200 bg-white/80 dark:bg-slate-900/80"
            >
              <option value="">-- Choose a test persona --</option>
              <option value="STU001">Aarav Sharma (88% Attendance - High GPA)</option>
              <option value="STU002">Sneha Patel (76% Attendance - Borderline)</option>
              <option value="STU003">Rohan Das (68% Attendance - Low, Pending Fees)</option>
              <option value="STU004">Priya Nair (82% Attendance - ₹15k Fee Due)</option>
              <option value="STU005">Aditya Verma (80% Attendance - 2 Exams Next Week)</option>
              <option value="STU006">Ananya Iyer (74% Attendance - Warning State)</option>
            </select>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {role === 'STUDENT' ? 'Roll Number / Username' : role === 'PARENT' ? 'Parent Name' : 'Admin Username'}
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={role === 'STUDENT' ? 'e.g. 2024CS001 or aarav' : role === 'PARENT' ? 'e.g. Rajesh Sharma' : 'admin'}
              className="glass-input text-xs"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (any password for demo)"
                className="glass-input text-xs w-full pr-8"
              />
              <Lock className="h-3.5 w-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {role !== 'ADMIN' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Associated Student ID</label>
              <input
                type="text"
                required
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="e.g. STU001"
                className="glass-input text-xs"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-xs font-bold mt-1 shadow-lg shadow-indigo-500/20"
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
