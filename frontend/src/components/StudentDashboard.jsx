import React, { useState, useEffect } from 'react';
import { 
  Percent, 
  BookOpen, 
  Calendar, 
  FileText, 
  Receipt, 
  Megaphone,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  MessageSquare,
  ArrowRight,
  TrendingDown,
  User
} from 'lucide-react';
import { api } from '../services/api';
import { CircularProgress } from './ResponseCards';

export default function StudentDashboard({ currentStudentId, onAskChatShortcut }) {
  const [activeTab, setActiveTab] = useState('overview'); // overview, attendance, marks, timetable, tasks, billing, notifications
  const [profile, setProfile] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [marks, setMarks] = useState(null);
  const [timetable, setTimetable] = useState(null);
  const [exams, setExams] = useState(null);
  const [assignments, setAssignments] = useState(null);
  const [fees, setFees] = useState(null);
  const [announcements, setAnnouncements] = useState(null);
  const [targetPct, setTargetPct] = useState(80);
  const [targetResults, setTargetResults] = useState([]);

  // Fetch student data on load or ID change
  useEffect(() => {
    async function loadData() {
      if (!currentStudentId) return;
      try {
        const profRes = await api.getProfile(currentStudentId);
        setProfile(profRes);

        const attRes = await api.getAttendance(currentStudentId);
        setAttendance(attRes);

        const marksRes = await api.getMarks(currentStudentId);
        setMarks(marksRes);

        const timeRes = await api.getTimetable(currentStudentId);
        setTimetable(timeRes);

        const examRes = await api.getExams(currentStudentId);
        setExams(examRes);

        const asnRes = await api.getAssignments(currentStudentId);
        setAssignments(asnRes);

        const feeRes = await api.getFees(currentStudentId);
        setFees(feeRes);

        const annRes = await api.getAnnouncements();
        setAnnouncements(annRes.announcements);
      } catch (err) {
        console.error("Error loading student dashboard data", err);
      }
    }
    loadData();
  }, [currentStudentId]);

  // Recalculate target attendance when targetPct or attendance changes
  useEffect(() => {
    if (!attendance) return;
    const targetFraction = targetPct / 100;
    const computed = attendance.records.map(record => {
      let req = 0;
      if (record.percentage < targetPct) {
        req = Math.ceil((targetFraction * record.conducted - record.attended) / (1 - targetFraction));
        if (req < 0) req = 0;
      }
      return {
        subject_name: record.subject_name,
        current_percentage: record.percentage,
        required: req
      };
    });
    setTargetResults(computed);
  }, [attendance, targetPct]);

  if (!profile || !attendance || !marks || !fees) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <div className="h-10 w-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xs font-semibold">Syncing student college database files...</p>
      </div>
    );
  }

  const overallAtt = attendance.overall_percentage;
  const pendingAssignments = assignments ? assignments.assignments.filter(a => a.status === 'PENDING').length : 0;
  const upcomingExamsCount = exams ? exams.exams.length : 0;
  const pendingFeesAmount = fees.pending;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* Student Profile Overview Card */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-teal-600/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <User className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-xl font-display font-extrabold text-slate-950 dark:text-white leading-tight">
              {profile.name}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
              Roll No: {profile.roll_number} • {profile.course} (Sem {profile.semester})
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => onAskChatShortcut("How is my attendance?")}
            className="btn-primary text-xs px-3.5 py-2"
          >
            <MessageSquare className="h-3.5 w-3.5" /> Chat Advisor
          </button>
        </div>
      </div>

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Metric 1: Overall Attendance */}
        <div 
          onClick={() => setActiveTab('attendance')}
          className="glass-panel p-4 rounded-xl border border-slate-200 dark:border-slate-850 bg-white/70 dark:bg-slate-900/50 flex items-center justify-between cursor-pointer hover:scale-[1.02] transition-all"
        >
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Attendance</span>
            <span className={`text-xl font-display font-extrabold ${overallAtt >= 75 ? 'text-slate-800 dark:text-white' : 'text-rose-500 animate-pulse'}`}>
              {overallAtt}%
            </span>
          </div>
          <Percent className={`h-6 w-6 ${overallAtt >= 75 ? 'text-teal-500' : 'text-rose-500'}`} />
        </div>

        {/* Metric 2: Pending Assignments */}
        <div 
          onClick={() => setActiveTab('tasks')}
          className="glass-panel p-4 rounded-xl border border-slate-200 dark:border-slate-850 bg-white/70 dark:bg-slate-900/50 flex items-center justify-between cursor-pointer hover:scale-[1.02] transition-all"
        >
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Pending Homework</span>
            <span className="text-xl font-display font-extrabold text-slate-800 dark:text-white">
              {pendingAssignments}
            </span>
          </div>
          <CheckCircle className="h-6 w-6 text-indigo-500" />
        </div>

        {/* Metric 3: Upcoming Exams */}
        <div 
          onClick={() => setActiveTab('tasks')}
          className="glass-panel p-4 rounded-xl border border-slate-200 dark:border-slate-850 bg-white/70 dark:bg-slate-900/50 flex items-center justify-between cursor-pointer hover:scale-[1.02] transition-all"
        >
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Upcoming Exams</span>
            <span className="text-xl font-display font-extrabold text-slate-800 dark:text-white">
              {upcomingExamsCount}
            </span>
          </div>
          <FileText className="h-6 w-6 text-purple-500" />
        </div>

        {/* Metric 4: Outstanding Dues */}
        <div 
          onClick={() => setActiveTab('billing')}
          className="glass-panel p-4 rounded-xl border border-slate-200 dark:border-slate-850 bg-white/70 dark:bg-slate-900/50 flex items-center justify-between cursor-pointer hover:scale-[1.02] transition-all"
        >
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Outstanding Fees</span>
            <span className={`text-xl font-display font-extrabold ${pendingFeesAmount > 0 ? 'text-rose-500' : 'text-slate-800 dark:text-white'}`}>
              ₹{pendingFeesAmount.toLocaleString('en-IN')}
            </span>
          </div>
          <Receipt className="h-6 w-6 text-amber-500" />
        </div>

      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto gap-2 pb-1.5 shrink-0">
        {[
          { id: 'overview', label: 'Overview', icon: User },
          { id: 'attendance', label: 'Attendance Detail', icon: Percent },
          { id: 'marks', label: 'Grades & CGPA', icon: BookOpen },
          { id: 'timetable', label: 'Weekly Timetable', icon: Calendar },
          { id: 'tasks', label: 'Exams & Assignments', icon: FileText },
          { id: 'billing', label: 'Fee Invoice', icon: Receipt },
          { id: 'notifications', label: 'Notices', icon: Megaphone }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 font-display text-xs font-bold transition-all shrink-0 ${
                activeTab === tab.id
                  ? 'border-teal-600 text-teal-600 dark:border-teal-400 dark:text-teal-400 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-950 dark:hover:text-white hover:border-slate-300'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="min-h-[400px]">

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fade-in">
            
            {/* Quick Summary Timetable */}
            <div className="md:col-span-8 flex flex-col gap-4">
              <div className="glass-panel p-5 rounded-xl flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-2">
                  <h3 className="text-sm font-display font-bold">Today's Class Schedule</h3>
                  <button 
                    onClick={() => setActiveTab('timetable')} 
                    className="text-[10px] text-teal-600 dark:text-teal-400 font-bold hover:underline"
                  >
                    View Full Schedule
                  </button>
                </div>
                
                <div className="flex flex-col gap-2">
                  {timetable && timetable.schedule.Monday && timetable.schedule.Monday.length > 0 ? (
                    timetable.schedule.Monday.map((slot, i) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-950/40 rounded border border-slate-100 dark:border-slate-850">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{slot.subject_name}</span>
                          <span className="text-[9px] text-slate-400">{slot.time} • Room {slot.room}</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500">{slot.faculty}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 text-xs py-4 text-center">No classes today.</p>
                  )}
                </div>
              </div>

              {/* Quick What-If Calculator Card */}
              <div className="glass-panel p-5 rounded-xl bg-gradient-to-r from-teal-900/10 to-indigo-900/10 border border-teal-500/25 flex flex-col gap-3">
                <h3 className="text-sm font-display font-bold text-teal-600 dark:text-teal-400">Conversational AI What-If Projection</h3>
                <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed">
                  Thinking of taking leave next week? Ask our AI assistant how consecutive missing classes affects your subject percentages.
                </p>
                <div className="flex">
                  <button
                    onClick={() => onAskChatShortcut("If I take 3 days leave next week, which subjects will fall below 75%?")}
                    className="btn-primary text-xs px-4 py-2 font-display font-semibold"
                  >
                    Simulate 3 Days Leave next week <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Announcements widget */}
            <div className="md:col-span-4 flex flex-col gap-4">
              <div className="glass-panel p-5 rounded-xl flex flex-col gap-4">
                <h3 className="text-sm font-display font-bold border-b border-slate-100 dark:border-slate-850 pb-2">
                  Notices Bulletin
                </h3>
                <div className="flex flex-col gap-3">
                  {announcements && announcements.slice(0, 3).map((anc, i) => (
                    <div key={i} className="flex flex-col gap-1 border-b border-slate-150 dark:border-slate-850 last:border-0 pb-2.5 last:pb-0">
                      <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{anc.title}</span>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{anc.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Attendance Detail */}
        {activeTab === 'attendance' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fade-in">
            
            {/* Subject Meters */}
            <div className="md:col-span-8 flex flex-col gap-4">
              <div className="glass-panel p-5 rounded-xl flex flex-col gap-4">
                <h3 className="text-sm font-display font-bold border-b border-slate-100 dark:border-slate-850 pb-2">Subject Attendance Breakdown</h3>
                <div className="flex flex-col gap-4">
                  {attendance.records.map((rec, i) => {
                    const below75 = rec.percentage < 75;
                    return (
                      <div key={i} className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 dark:text-white">{rec.subject_name}</span>
                            {below75 && (
                              <span className="text-[9px] font-extrabold bg-rose-500/10 text-rose-500 px-1.5 py-0.2 rounded border border-rose-500/25 flex items-center gap-0.5 animate-pulse">
                                <AlertTriangle className="h-3 w-3" /> Debarment Alert
                              </span>
                            )}
                          </div>
                          <span className={`font-bold ${below75 ? 'text-rose-500' : 'text-slate-800 dark:text-white'}`}>
                            {rec.percentage}% ({rec.attended} / {rec.conducted} lectures)
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-150 dark:bg-slate-850 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-700 ${
                              below75 ? 'bg-rose-500' : (rec.percentage >= 85 ? 'bg-emerald-500' : 'bg-teal-500')
                            }`}
                            style={{ width: `${rec.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Attendance Target Calculator Widget */}
            <div className="md:col-span-4 flex flex-col gap-4">
              <div className="glass-panel p-5 rounded-xl flex flex-col gap-4">
                <h3 className="text-sm font-display font-bold border-b border-slate-100 dark:border-slate-850 pb-2">Target Calculator</h3>
                
                <div className="flex flex-col gap-3 text-xs">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-semibold text-slate-400">Target Attendance (%)</label>
                    <input
                      type="number"
                      min="75"
                      max="100"
                      value={targetPct}
                      onChange={(e) => setTargetPct(parseInt(e.target.value) || 75)}
                      className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-2.5 rounded-lg text-sm font-bold outline-none focus:border-teal-500"
                    />
                  </div>

                  <div className="flex flex-col gap-2 mt-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Required Consecutive Lectures:</span>
                    {targetResults.map((item, i) => (
                      <div key={i} className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-950/40 rounded border border-slate-100 dark:border-slate-850">
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-350 truncate max-w-[140px]">
                          {item.subject_name}
                        </span>
                        {item.required === 0 ? (
                          <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                            Met Target
                          </span>
                        ) : (
                          <span className="text-[10px] font-extrabold text-teal-600 dark:text-teal-400">
                            Attend {item.required} more
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* Tab 3: Grades & CGPA */}
        {activeTab === 'marks' && (
          <div className="max-w-2xl mx-auto w-full animate-fade-in">
            <div className="p-1">
              <CircularProgress percentage={78} /> {/* Placeholder wrapper to render Marks Card */}
              <div className="mt-4">
                <InteractiveResponseCard cardType="marks" payload={marks} />
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Timetable */}
        {activeTab === 'timetable' && (
          <div className="max-w-3xl mx-auto w-full animate-fade-in">
            <InteractiveResponseCard cardType="timetable" payload={timetable} />
          </div>
        )}

        {/* Tab 5: Exams & Assignments */}
        {activeTab === 'tasks' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            <InteractiveResponseCard cardType="exams" payload={exams} />
            <InteractiveResponseCard cardType="assignments" payload={assignments} />
          </div>
        )}

        {/* Tab 6: Billing / Fees */}
        {activeTab === 'billing' && (
          <div className="max-w-2xl mx-auto w-full animate-fade-in">
            <InteractiveResponseCard cardType="fees" payload={fees} />
          </div>
        )}

        {/* Tab 7: Announcements */}
        {activeTab === 'notifications' && (
          <div className="max-w-2xl mx-auto w-full animate-fade-in">
            <InteractiveResponseCard cardType="announcements" payload={{ announcements }} />
          </div>
        )}

      </div>

    </div>
  );
}
