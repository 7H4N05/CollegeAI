import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Percent, 
  BookOpen, 
  FileText, 
  Receipt, 
  ShieldAlert, 
  ShieldCheck, 
  MessageSquare,
  ArrowRight,
  TrendingDown,
  Calendar,
  AlertTriangle,
  Award,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import { CircularProgress } from './ResponseCards';

export default function ParentDashboard({ currentUser, currentStudentId, onAskChatShortcut }) {
  const [childProfile, setChildProfile] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [marks, setMarks] = useState(null);
  const [exams, setExams] = useState(null);
  const [fees, setFees] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadChildData() {
      if (!currentStudentId) return;
      setLoading(true);
      try {
        const profRes = await api.getProfile(currentStudentId);
        setChildProfile(profRes);

        const attRes = await api.getAttendance(currentStudentId);
        setAttendance(attRes);

        const marksRes = await api.getMarks(currentStudentId);
        setMarks(marksRes);

        const examRes = await api.getExams(currentStudentId);
        setExams(examRes);

        const feeRes = await api.getFees(currentStudentId);
        setFees(feeRes);
      } catch (err) {
        console.error("Failed to load child's data for parent portal", err);
      } finally {
        setLoading(false);
      }
    }
    loadChildData();
  }, [currentStudentId]);

  if (loading || !childProfile || !attendance || !marks || !fees) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <div className="h-12 w-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin mb-4 shadow-lg shadow-indigo-500/20"></div>
        <p className="text-sm font-semibold">Verifying child authorization status & loading records...</p>
      </div>
    );
  }

  const overallAtt = attendance.overall_percentage;
  const isCriticalAttendance = overallAtt < 75;
  const hasPendingFees = fees.pending > 0;

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      
      {/* Parent Welcome / Child Authorized Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/30 text-emerald-400 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 flex-shrink-0 text-emerald-400" />
          <div>
            <p className="font-bold text-sm text-white">Parent Access Verification Active</p>
            <p className="text-slate-300 text-xs mt-0.5">
              Authorized to monitor: <span className="font-bold text-teal-300">{childProfile.name}</span> ({childProfile.roll_number} • {childProfile.course})
            </p>
          </div>
        </div>
        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full font-bold uppercase tracking-wider border border-emerald-500/30 w-fit">
          PARENT PORTAL
        </span>
      </div>

      {/* Critical Warnings Section */}
      {(isCriticalAttendance || hasPendingFees) && (
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Priority Safety Alerts</h3>
          
          {isCriticalAttendance && (
            <div className="p-5 bg-red-950/60 border border-red-500/30 text-red-300 rounded-2xl flex flex-col sm:flex-row gap-4 shadow-lg">
              <AlertTriangle className="h-6 w-6 flex-shrink-0 text-red-400" />
              <div className="text-xs flex flex-col gap-2">
                <span className="font-bold text-sm text-white">⚠️ Attendance Warning: Below 75% Threshold</span>
                <p className="text-slate-300 leading-relaxed">
                  {childProfile.name}'s overall attendance is currently <span className="text-red-400 font-bold">{overallAtt}%</span>. College guidelines enforce a mandatory 75% minimum to sit for final semester examinations.
                </p>
                <div>
                  <button
                    onClick={() => onAskChatShortcut("How is my child's attendance?")}
                    className="bg-red-500/20 hover:bg-red-500/35 border border-red-500/40 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all w-fit mt-1"
                  >
                    <MessageSquare className="h-3.5 w-3.5" /> Ask AI Advisor for Breakdown
                  </button>
                </div>
              </div>
            </div>
          )}

          {hasPendingFees && (
            <div className="p-5 bg-amber-950/60 border border-amber-500/30 text-amber-300 rounded-2xl flex flex-col sm:flex-row gap-4 shadow-lg">
              <ShieldAlert className="h-6 w-6 flex-shrink-0 text-amber-400" />
              <div className="text-xs flex flex-col gap-2">
                <span className="font-bold text-sm text-white">⚠️ Pending Fees Payment</span>
                <p className="text-slate-300 leading-relaxed">
                  Outstanding tuition balance: <span className="text-amber-400 font-bold">₹{fees.pending.toLocaleString('en-IN')}</span> (Due: {fees.due_date}).
                </p>
                <div>
                  <button
                    onClick={() => onAskChatShortcut("Are there any pending fees?")}
                    className="bg-amber-500/20 hover:bg-amber-500/35 border border-amber-500/40 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all w-fit mt-1"
                  >
                    <MessageSquare className="h-3.5 w-3.5" /> View Detailed Fee Breakdown
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Main Dash Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Child Attendance Progress Circle */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-3xl border border-white/10 flex flex-col items-center justify-center text-center gap-4">
          <h4 className="font-display font-bold text-xs uppercase tracking-wider text-slate-400">Child's Attendance Meter</h4>
          <CircularProgress 
            percentage={overallAtt} 
            size={130} 
            color={overallAtt >= 75 ? 'stroke-teal-400' : 'stroke-red-400'} 
          />
          <div>
            <p className="font-bold text-sm text-white">
              {overallAtt >= 75 ? 'Status: Approved to Sit Exams' : 'Status: At Risk / Warning'}
            </p>
            <p className="text-xs text-slate-400 mt-1">Requires 75% minimum attendance</p>
          </div>
        </div>

        {/* Child Academic Summary */}
        <div className="lg:col-span-8 glass-panel p-6 rounded-3xl border border-white/10 flex flex-col gap-5">
          <div className="flex justify-between items-center">
            <h4 className="font-display font-bold text-lg text-white">Academic Performance Overview</h4>
            <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
              CGPA: {marks.current_cgpa}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {attendance.records.map((rec) => (
              <div key={rec.subject_code} className="bg-slate-900/60 p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">{rec.subject_name}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{rec.attended} / {rec.conducted} classes attended</p>
                </div>
                <span className={`text-sm font-bold ${rec.percentage >= 75 ? 'text-teal-400' : 'text-red-400'}`}>
                  {rec.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Quick Questions Parent Can Ask */}
      <div className="glass-panel-glow p-6 rounded-3xl border border-indigo-500/30 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-indigo-400">
          <Sparkles className="h-5 w-5" />
          <h3 className="text-base font-bold font-display text-white">Ask AI Parent Advisor</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            "How is my child's attendance?",
            "Does my child have any exams this week?",
            "Are there any pending fees?",
            "How are the internal marks?",
            "Are there any important announcements?"
          ].map((q, idx) => (
            <button
              key={idx}
              onClick={() => onAskChatShortcut(q)}
              className="text-left p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 text-xs font-medium text-slate-300 hover:text-white hover:border-indigo-400 transition-all flex items-center justify-between"
            >
              <span>"{q}"</span>
              <ArrowRight className="h-4 w-4 text-indigo-400 flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
