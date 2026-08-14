import React, { useState } from 'react';
import { 
  User, 
  Users, 
  Shield, 
  AlertCircle, 
  ArrowRight, 
  Lock,
  Sparkles,
  CheckCircle2
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
    <div className="max-w-md w-full mx-auto my-10 animate-fade-in flex flex-col gap-6">
      
      <div className="text-center flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 font-display font-semibold text-xs border border-teal-500/20 w-fit mx-auto">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Role-Based Identity Portal</span>
        </div>
        <h2 className="text-3xl font-display font-extrabold tracking-tight">Sign In to CollegeAI</h2>
        <p className="text-sm text-slate-400">
          Select your role to access customized dashboards & conversational AI.
        </p>
      </div>

      {/* Role Selector Tabs */}
      <div className="grid grid-cols-3 gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-800 shadow-xl">
        <button
          type="button"
          onClick={() => handleRoleChange('STUDENT')}
          className={`flex flex-col items-center gap-1.5 py-3 rounded-xl text-xs font-bold font-display transition-all ${
            role === 'STUDENT'
              ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <User className="h-4 w-4" />
          Student
        </button>
        <button
          type="button"
          onClick={() => handleRoleChange('PARENT')}
          className={`flex flex-col items-center gap-1.5 py-3 rounded-xl text-xs font-bold font-display transition-all ${
            role === 'PARENT'
              ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="h-4 w-4" />
          Parent
        </button>
        <button
          type="button"
          onClick={() => handleRoleChange('ADMIN')}
          className={`flex flex-col items-center gap-1.5 py-3 rounded-xl text-xs font-bold font-display transition-all ${
            role === 'ADMIN'
              ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Shield className="h-4 w-4" />
          Admin
        </button>
      </div>

      {/* Main Login Card */}
      <div className="glass-panel p-8 rounded-3xl border border-white/10 flex flex-col gap-6 shadow-2xl relative overflow-hidden">
        
        {error && (
          <div className="flex gap-2.5 p-3.5 text-xs bg-red-500/15 border border-red-500/30 text-red-400 rounded-xl">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* Demo Fast Selector Dropdown */}
        {role !== 'ADMIN' && (
          <div className="flex flex-col gap-2 p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/20">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-3 w-3" /> Quick Persona Autofill
              </label>
              <span className="text-[10px] text-teal-300 font-semibold">1-Click Setup</span>
            </div>
            <select
              value={studentId}
              onChange={(e) => handleQuickFill(e.target.value)}
              className="w-full bg-slate-900 border border-teal-500/30 text-white rounded-xl p-2.5 text-xs font-medium outline-none focus:border-teal-400"
            >
              <option value="">-- Select a test persona --</option>
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
            <label className="text-xs font-bold text-slate-300">
              {role === 'STUDENT' ? 'Roll Number / Username' : role === 'PARENT' ? 'Parent Name / Mobile' : 'Admin Username'}
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={role === 'STUDENT' ? 'e.g. 2024CS001 or aarav' : role === 'PARENT' ? 'e.g. Rajesh Sharma' : 'admin'}
              className="glass-input text-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (any password for demo)"
                className="glass-input text-sm w-full pr-10"
              />
              <Lock className="h-4 w-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {role !== 'ADMIN' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">Associated Student ID</label>
              <input
                type="text"
                required
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="e.g. STU001"
                className="glass-input text-sm"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 text-sm mt-2 shadow-lg shadow-teal-500/25"
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-white/5">
          <p className="text-[11px] text-slate-400">
            Hackathon Tip: Use the floating <span className="text-teal-400 font-bold">Demo Console</span> in the bottom-right for instant 1-click persona switching anytime.
          </p>
        </div>

      </div>

    </div>
  );
}
