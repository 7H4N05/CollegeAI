import React, { useState, useEffect } from 'react';
import { 
  Percent, 
  Award, 
  CreditCard, 
  CheckSquare, 
  Calendar, 
  Bot, 
  ArrowRight, 
  AlertTriangle, 
  ShieldCheck, 
  TrendingUp, 
  Clock,
  Sparkles,
  ChevronRight,
  BookOpen,
  Calculator,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';

function ProgressRing({ percentage, size = 52, strokeWidth = 4.5, color = '#10b981' }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg className="progress-ring w-full h-full">
        <circle
          className="stroke-slate-200 dark:stroke-slate-800"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="progress-ring-circle"
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <span className="absolute font-display font-extrabold text-xs text-slate-900 dark:text-white">
        {percentage}%
      </span>
    </div>
  );
}

export default function Dashboard({ currentUser, currentStudentId, onAskChatShortcut, onNavigate }) {
  const [profile, setProfile] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [marks, setMarks] = useState(null);
  const [exams, setExams] = useState(null);
  const [assignments, setAssignments] = useState(null);
  const [fees, setFees] = useState(null);
  const [announcements, setAnnouncements] = useState(null);
  const [loading, setLoading] = useState(true);

  // Quick interactive leave slider state
  const [simulatedLeaves, setSimulatedLeaves] = useState(0);

  useEffect(() => {
    async function loadDashboardData() {
      if (!currentStudentId) return;
      setLoading(true);
      try {
        const profRes = await api.getProfile(currentStudentId);
        setProfile(profRes);

        const attRes = await api.getAttendance(currentStudentId);
        setAttendance(attRes);

        const marksRes = await api.getMarks(currentStudentId);
        setMarks(marksRes);

        const examRes = await api.getExams(currentStudentId);
        setExams(examRes);

        const asnRes = await api.getAssignments(currentStudentId);
        setAssignments(asnRes);

        const feeRes = await api.getFees(currentStudentId);
        setFees(feeRes);

        const annRes = await api.getAnnouncements();
        setAnnouncements(annRes.announcements);
      } catch (err) {
        console.error("Error loading dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [currentStudentId]);

  if (loading || !profile || !attendance || !marks || !fees) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400 my-auto">
        <div className="h-10 w-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-xs font-semibold font-display">Loading academic dashboard...</p>
      </div>
    );
  }

  const overallAtt = attendance.overall_percentage;
  const isParent = currentUser?.role === 'PARENT';
  const pendingAssignmentsList = assignments?.assignments.filter(a => a.status === 'PENDING') || [];
  const upcomingExam = exams?.exams[0];
  const isCriticalAttendance = overallAtt < 75;

  // Calculate simulated attendance
  let totalAttended = 0;
  let totalConducted = 0;
  attendance.records.forEach(r => {
    totalAttended += r.attended;
    totalConducted += r.conducted;
  });

  const projectedConducted = totalConducted + (simulatedLeaves * 3);
  const projectedPct = projectedConducted > 0 
    ? Number(((totalAttended / projectedConducted) * 100).toFixed(1))
    : overallAtt;

  return (
    <div className="flex flex-col gap-6 animate-fade-in w-full">
      
      {/* GREETING HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 border-l-4 border-l-indigo-600">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight">
              Good morning, {currentUser.name.split(' ')[0]} 👋
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono text-[10px] font-bold border border-indigo-500/20">
              Sem {profile.semester} • {profile.course}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            {isParent ? `Monitoring academic records for ${profile.name}` : `Here is your real-time academic status & intelligence solver.`}
          </p>
        </div>

        <button
          onClick={() => onAskChatShortcut("What is my current attendance?")}
          className="btn-primary text-xs px-4 py-2.5 shadow-lg shadow-indigo-500/20 w-fit shrink-0"
        >
          <Bot className="h-4 w-4" />
          <span>Ask AI Companion</span>
        </button>
      </div>

      {/* PARENT SAFETY ALERT BANNER */}
      {isParent && isCriticalAttendance && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 text-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0 text-red-500" />
            <div>
              <span className="font-bold">⚠️ Critical Attendance Warning for {profile.name}</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Current attendance is {overallAtt}%, which is below the mandatory 75% threshold.
              </p>
            </div>
          </div>
          <button 
            onClick={() => onAskChatShortcut("How is my child's attendance?")}
            className="px-3 py-1.5 rounded-xl bg-red-500/20 text-red-600 dark:text-red-300 font-bold text-[10px] whitespace-nowrap hover:bg-red-500/30 transition-all shrink-0"
          >
            Query Advisor
          </button>
        </div>
      )}

      {/* 5 KEY METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Card 1: Attendance */}
        <div 
          onClick={() => onNavigate('attendance')}
          className="glass-card p-5 flex flex-col justify-between gap-3 cursor-pointer hover:border-indigo-500/30 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-display">Attendance</span>
            <span className={`status-pill ${overallAtt >= 75 ? 'safe' : 'critical'}`}>
              {overallAtt >= 75 ? 'Safe' : 'Critical'}
            </span>
          </div>

          <div className="flex items-center justify-between my-1">
            <div>
              <span className="font-display font-extrabold text-2xl text-slate-900 dark:text-white">
                {overallAtt}%
              </span>
              <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
                {overallAtt >= 75 ? `+${(overallAtt - 75).toFixed(1)}% safe` : `-${(75 - overallAtt).toFixed(1)}% below limit`}
              </p>
            </div>
            <ProgressRing percentage={overallAtt} size={48} color={overallAtt >= 75 ? '#10b981' : '#ef4444'} />
          </div>
        </div>

        {/* Card 2: CGPA */}
        <div 
          onClick={() => onNavigate('academics')}
          className="glass-card p-5 flex flex-col justify-between gap-3 cursor-pointer hover:border-indigo-500/30 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-display">CGPA Score</span>
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Award className="h-3.5 w-3.5" />
            </div>
          </div>

          <div className="my-1">
            <span className="font-display font-extrabold text-2xl text-slate-900 dark:text-white">
              {marks.current_cgpa}
            </span>
            <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
              Grade S Performance
            </p>
          </div>
        </div>

        {/* Card 3: Pending Fees */}
        <div 
          onClick={() => onNavigate('fees')}
          className="glass-card p-5 flex flex-col justify-between gap-3 cursor-pointer hover:border-indigo-500/30 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-display">Pending Dues</span>
            <div className={`p-1.5 rounded-lg ${fees.pending > 0 ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
              <CreditCard className="h-3.5 w-3.5" />
            </div>
          </div>

          <div className="my-1">
            <span className={`font-display font-extrabold text-2xl ${fees.pending > 0 ? 'text-amber-500' : 'text-slate-900 dark:text-white'}`}>
              ₹{fees.pending.toLocaleString('en-IN')}
            </span>
            <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
              {fees.pending > 0 ? `Due: ${fees.due_date}` : 'All fees paid'}
            </p>
          </div>
        </div>

        {/* Card 4: Pending Tasks */}
        <div 
          onClick={() => onNavigate('assignments')}
          className="glass-card p-5 flex flex-col justify-between gap-3 cursor-pointer hover:border-indigo-500/30 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-display">Assignments</span>
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <CheckSquare className="h-3.5 w-3.5" />
            </div>
          </div>

          <div className="my-1">
            <span className="font-display font-extrabold text-2xl text-slate-900 dark:text-white">
              {pendingAssignmentsList.length}
            </span>
            <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
              {pendingAssignmentsList.length > 0 ? 'Tasks pending review' : 'All clear'}
            </p>
          </div>
        </div>

        {/* Card 5: Upcoming Exam */}
        <div 
          onClick={() => onNavigate('exams')}
          className="glass-card p-5 flex flex-col justify-between gap-3 cursor-pointer hover:border-indigo-500/30 transition-all col-span-2 lg:col-span-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-display">Next Exam</span>
            <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <Calendar className="h-3.5 w-3.5" />
            </div>
          </div>

          <div className="my-1">
            <span className="font-display font-extrabold text-sm text-slate-900 dark:text-white truncate block">
              {upcomingExam ? upcomingExam.subject_name : 'No Exams'}
            </span>
            <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
              {upcomingExam ? `${upcomingExam.date} • Room ${upcomingExam.room}` : 'Schedule updated'}
            </p>
          </div>
        </div>

      </div>

      {/* DASHBOARD CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (8 cols): Attendance Insights & Performance */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Interactive Leave Simulator Widget */}
          <div className="glass-card p-6 flex flex-col gap-4 border border-indigo-500/20">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                  Quick Leave Attendance Simulator
                </h3>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                {simulatedLeaves} Days Leave
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-col gap-1 w-full sm:w-2/3">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Simulate taking leave days next week:
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={simulatedLeaves}
                  onChange={(e) => setSimulatedLeaves(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between gap-4 w-full sm:w-1/3">
                <span className="text-xs text-slate-400 font-medium">Projected %:</span>
                <span className={`font-display font-extrabold text-lg ${projectedPct >= 75 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {projectedPct}%
                </span>
              </div>
            </div>
          </div>

          {/* Attendance Insights Panel */}
          <div className="glass-card p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Percent className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                  Course Subject Breakdown
                </h3>
              </div>
              <button 
                onClick={() => onNavigate('attendance')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                Detailed Breakdown <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Subject Breakdown List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {attendance.records.map((rec) => (
                <div key={rec.subject_code} className="p-4 rounded-xl bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{rec.subject_name}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{rec.attended} / {rec.conducted} classes conducted</span>
                  </div>
                  <span className={`font-display font-extrabold text-sm ${rec.percentage >= 75 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {rec.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Performance Marks Matrix */}
          <div className="glass-card p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                  Internal Assessment Scores
                </h3>
              </div>
              <button 
                onClick={() => onNavigate('academics')}
                className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
              >
                Grade Target Solver <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {marks.subjects.map((sub) => (
                <div key={sub.code} className="p-4 rounded-xl bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{sub.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400">
                      Mid-Sem: {sub.mid_sem}/30
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-medium pt-1 border-t border-slate-200/40 dark:border-slate-800/40">
                    <span>Assignments: {sub.assignment_marks}/20</span>
                    <span>Total Internal: {sub.internal_total}/50</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (4 cols): AI Quick Actions, Assignments, & Notices */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* AI Quick Prompts Card */}
          <div className="glass-card p-5 border-l-4 border-l-indigo-600 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-display font-bold text-xs">
              <Sparkles className="h-4 w-4" />
              <span>AI Companion Quick Shortcuts</span>
            </div>

            <div className="flex flex-col gap-2">
              {[
                "What is my current attendance?",
                "How many classes can I miss to maintain 75%?",
                "If I take 3 days leave next week...",
                "What marks do I need in end-sem?"
              ].map((query, i) => (
                <button
                  key={i}
                  onClick={() => onAskChatShortcut(query)}
                  className="w-full text-left text-xs p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800/60 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/30 transition-all flex items-center justify-between"
                >
                  <span className="truncate">"{query}"</span>
                  <ArrowRight className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Pending Tasks */}
          <div className="glass-card p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-2">
              <h4 className="font-display font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                Pending Assignments
              </h4>
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">{pendingAssignmentsList.length} Tasks</span>
            </div>

            <div className="flex flex-col gap-2.5">
              {pendingAssignmentsList.slice(0, 3).map((asn) => (
                <div key={asn.id} className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 flex flex-col gap-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{asn.title}</span>
                  <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                    <span>{asn.subject_name}</span>
                    <span className="text-amber-500 font-semibold">Due: {asn.due_date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Announcements */}
          <div className="glass-card p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-2">
              <h4 className="font-display font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                Campus Notices
              </h4>
              <button onClick={() => onNavigate('notices')} className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">View All</button>
            </div>

            <div className="flex flex-col gap-3">
              {announcements?.slice(0, 2).map((ann) => (
                <div key={ann.id} className="flex flex-col gap-1 text-xs border-b border-slate-200/50 dark:border-slate-800/50 pb-2.5 last:border-0 last:pb-0">
                  <span className="font-bold text-slate-900 dark:text-white">{ann.title}</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
