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
  Award
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
        <div className="h-10 w-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xs font-semibold">Verifying child authorization status & loading dashboard...</p>
      </div>
    );
  }

  const overallAtt = attendance.overall_percentage;
  const isCriticalAttendance = overallAtt < 75;
  const hasPendingFees = fees.pending > 0;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* Parent Welcome / Child Authorized Header Banner */}
      <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-xl text-xs flex justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 flex-shrink-0" />
          <div>
            <p className="font-bold">Authorized Parental Access Granted</p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Securely connected to student profile: <span className="font-bold text-slate-700 dark:text-slate-350">{childProfile.name}</span> (Roll: {childProfile.roll_number})
            </p>
          </div>
        </div>
        <span className="text-[10px] bg-emerald-500/15 text-emerald-600 px-2 py-0.5 rounded font-extrabold select-none uppercase">
          Parent Mode
        </span>
      </div>

      {/* Critical Warnings Section */}
      {(isCriticalAttendance || hasPendingFees) && (
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Attention Required</h3>
          
          {isCriticalAttendance && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 rounded-xl flex gap-3">
              <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5 text-red-500" />
              <div className="text-xs flex flex-col gap-1">
                <span className="font-bold">⚠️ CRITICAL: Attendance Below 75% Threshold</span>
                <p className="text-slate-500 leading-normal">
                  {childProfile.name}'s overall attendance is currently **{overallAtt}%**. College rules require a minimum of 75% to appear for final examinations. Continued absence may lead to academic debarment.
                </p>
                <div className="mt-2.5">
                  <button
                    onClick={() => onAskChatShortcut("How is my child's attendance?")}
                    className="bg-red-500/20 hover:bg-red-500/35 border border-red-500/30 text-red-700 dark:text-red-300 font-bold px-3 py-1.5 rounded text-[10px] flex items-center gap-1 transition-all"
                  >
                    <MessageSquare className="h-3 w-3" /> Chat Advisor for Details
                  </button>
                </div>
              </div>
            </div>
          )}

          {hasPendingFees && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 rounded-xl flex gap-3">
              <ShieldAlert className="h-5 w-5 flex-shrink-0 mt-0.5 text-amber-500" />
              <div className="text-xs flex flex-col gap-1">
                <span className="font-bold">⚠️ Outstanding Fees Balance</span>
                <p className="text-slate-500 leading-normal">
                  There is an outstanding tuition balance of **₹{fees.pending.toLocaleString('en-IN')}** (due date: {fees.due_date}). Please clear the dues immediately to prevent portal blockades.
                </p>
                <div className="mt-2.5">
                  <button
                    onClick={() => onAskChatShortcut("Are there any pending fees?")}
                    className="bg-amber-500/20 hover:bg-amber-500/35 border border-amber-500/30 text-amber-700 dark:text-amber-300 font-bold px-3 py-1.5 rounded text-[10px] flex items-center gap-1 transition-all"
                  >
                    <MessageSquare className="h-3 w-3" /> View Dues Invoice
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Main Dash Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Child Attendance Progress Circle */}
        <div className="md:col-span-4 glass-panel p-5 rounded-xl flex flex-col items-center justify-center text-center gap-4">
          <h4 className="font-display font-bold text-xs uppercase text-slate-500">Child's Attendance Overall</h4>
          <CircularProgress 
            percentage={overallAtt} 
            size={120} 
            color={overallAtt >= 75 ? 'stroke-emerald-500' : 'stroke-rose-500'} 
          />
          <div className="text-xs">
            <p className="font-bold text-slate-800 dark:text-slate-200">
              {overallAtt >= 75 ? 'Status: Approved' : 'Status: Restricted'}
            </p>
            <p className="text-slate-400 text-[10px] mt-1">
              Minimum 75% required by Academic Senate
            </p>
          </div>
        </div>

        {/* Child Subject Breakdown */}
        <div className="md:col-span-8 glass-panel p-5 rounded-xl flex flex-col gap-4">
          <h4 className="font-display font-bold text-xs uppercase text-slate-500 border-b border-slate-100 dark:border-slate-850 pb-2">
            Subject-wise Academic Performance
          </h4>
          <div className="flex flex-col gap-3">
            {attendance.records.map((rec, i) => {
              const isBelow = rec.percentage < 75;
              return (
                <div key={i} className="flex justify-between items-center text-xs p-2 bg-slate-50 dark:bg-slate-950/40 rounded border border-slate-100 dark:border-slate-850">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{rec.subject_name}</span>
                    <span className="text-[10px] text-slate-400">Faculty: {rec.faculty}</span>
                  </div>
                  <div className="text-right">
                    <span className={`font-extrabold text-sm ${isBelow ? 'text-rose-500 animate-pulse' : 'text-slate-800 dark:text-white'}`}>
                      {rec.percentage}%
                    </span>
                    <p className="text-[9px] text-slate-400">({rec.attended} / {rec.conducted} classes)</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Internal Marks and Exams */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Child Internal Marks Summary */}
        <div className="glass-panel p-5 rounded-xl flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-2">
            <h4 className="font-display font-bold text-xs uppercase text-slate-500 flex items-center gap-1">
              <Award className="h-4 w-4 text-teal-500" /> Internal Marks (Out of 50)
            </h4>
            <span className="text-[10px] font-bold text-slate-600 bg-teal-500/10 px-2 py-0.5 rounded">
              GPA: {marks.cgpa}
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {marks.records.map((rec, i) => (
              <div key={i} className="flex justify-between items-center text-xs">
                <span className="text-slate-700 dark:text-slate-350 truncate max-w-[200px]">{rec.subject_name}</span>
                <span className="font-bold text-slate-900 dark:text-white">{rec.internals} / 50</span>
              </div>
            ))}
          </div>
        </div>

        {/* Child Exams Details */}
        <div className="glass-panel p-5 rounded-xl flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-2">
            <h4 className="font-display font-bold text-xs uppercase text-slate-500 flex items-center gap-1">
              <Calendar className="h-4 w-4 text-teal-500" /> Upcoming Examinations
            </h4>
            <span className="text-[9px] font-bold text-slate-400">COMMENCING AUG 24</span>
          </div>

          <div className="flex flex-col gap-2">
            {exams.exams.length > 0 ? (
              exams.exams.map((exam, i) => (
                <div key={i} className="flex justify-between items-center text-xs p-2 bg-slate-50 dark:bg-slate-950/40 rounded border border-slate-100 dark:border-slate-850">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{exam.subject_name}</span>
                    <span className="text-[9px] text-slate-400">Date: {exam.date} • {exam.time}</span>
                  </div>
                  <span className="text-[9px] bg-teal-600/15 text-teal-600 px-2 py-0.5 rounded font-extrabold uppercase shrink-0">
                    Room {exam.room}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-xs py-4 text-center">No exams scheduled.</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
