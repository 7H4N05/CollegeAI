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
  User,
  Sparkles,
  Award,
  Zap
} from 'lucide-react';
import { api } from '../services/api';
import { CircularProgress } from './ResponseCards';

export default function StudentDashboard({ currentStudentId, onAskChatShortcut }) {
  const [activeTab, setActiveTab] = useState('overview');
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
        <div className="h-12 w-12 border-4 border-teal-400 border-t-transparent rounded-full animate-spin mb-4 shadow-lg shadow-teal-500/20"></div>
        <p className="text-sm font-semibold">Retrieving academic profile data...</p>
      </div>
    );
  }

  const overallAtt = attendance.overall_percentage;
  const pendingAssignments = assignments ? assignments.assignments.filter(a => a.status === 'PENDING').length : 0;
  const upcomingExamsCount = exams ? exams.exams.length : 0;
  const pendingFeesAmount = fees.pending;

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      
      {/* Student Profile Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-500 to-indigo-600 text-white flex items-center justify-center font-display font-extrabold text-xl shadow-lg shadow-teal-500/30">
            {profile.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-display font-extrabold text-white">
                {profile.name}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20">
                {profile.roll_number}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-1">
              {profile.course} • Semester {profile.semester} • Section {profile.section}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => onAskChatShortcut("What is my current attendance?")}
            className="btn-primary text-xs px-4 py-2.5 shadow-lg shadow-teal-500/20"
          >
            <MessageSquare className="h-4 w-4" /> Ask AI Advisor
          </button>
        </div>

      </div>

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div 
          onClick={() => setActiveTab('attendance')}
          className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center justify-between cursor-pointer hover:scale-[1.02] transition-all"
        >
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Overall Attendance</span>
            <span className={`text-2xl font-display font-black ${overallAtt >= 75 ? 'text-teal-400' : 'text-red-400'}`}>
              {overallAtt}%
            </span>
          </div>
          <div className={`p-3 rounded-xl ${overallAtt >= 75 ? 'bg-teal-500/15 text-teal-400' : 'bg-red-500/15 text-red-400'}`}>
            <Percent className="h-6 w-6" />
          </div>
        </div>

        {/* Metric 2 */}
        <div 
          onClick={() => setActiveTab('tasks')}
          className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center justify-between cursor-pointer hover:scale-[1.02] transition-all"
        >
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Pending Tasks</span>
            <span className="text-2xl font-display font-black text-amber-400">
              {pendingAssignments}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/15 text-amber-400">
            <FileText className="h-6 w-6" />
          </div>
        </div>

        {/* Metric 3 */}
        <div 
          onClick={() => setActiveTab('overview')}
          className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center justify-between cursor-pointer hover:scale-[1.02] transition-all"
        >
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Upcoming Exams</span>
            <span className="text-2xl font-display font-black text-indigo-400">
              {upcomingExamsCount}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-indigo-500/15 text-indigo-400">
            <Calendar className="h-6 w-6" />
          </div>
        </div>

        {/* Metric 4 */}
        <div 
          onClick={() => setActiveTab('billing')}
          className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center justify-between cursor-pointer hover:scale-[1.02] transition-all"
        >
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Pending Fee</span>
            <span className={`text-2xl font-display font-black ${pendingFeesAmount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              ₹{pendingFeesAmount.toLocaleString()}
            </span>
          </div>
          <div className={`p-3 rounded-xl ${pendingFeesAmount > 0 ? 'bg-rose-500/15 text-rose-400' : 'bg-emerald-500/15 text-emerald-400'}`}>
            <Receipt className="h-6 w-6" />
          </div>
        </div>

      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'overview', label: 'Overview', icon: BookOpen },
          { id: 'attendance', label: 'Attendance Breakdown', icon: Percent },
          { id: 'marks', label: 'Marks & Targets', icon: Award },
          { id: 'timetable', label: 'Weekly Timetable', icon: Calendar },
          { id: 'tasks', label: 'Assignments & Exams', icon: FileText },
          { id: 'billing', label: 'Fees & Receipts', icon: Receipt },
          { id: 'notifications', label: 'Announcements', icon: Megaphone }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-display text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-md shadow-teal-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Subject Attendance Cards */}
            <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white font-display">Subject Attendance</h3>
                <span className="text-xs text-slate-400 font-semibold">Min Threshold: 75%</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {attendance.records.map((rec) => (
                  <div key={rec.subject_code} className="bg-slate-900/60 border border-white/5 p-4 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">{rec.subject_name}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{rec.subject_code}</p>
                      <p className="text-xs font-semibold text-slate-300 mt-2">
                        {rec.attended} / {rec.conducted} classes
                      </p>
                    </div>
                    <CircularProgress percentage={rec.percentage} size={64} strokeWidth={6} />
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Exams */}
            <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col gap-4">
              <h3 className="text-lg font-bold text-white font-display">Scheduled Examinations</h3>
              <div className="flex flex-col gap-3">
                {exams.exams.map((ex) => (
                  <div key={ex.id} className="bg-slate-900/60 border border-white/5 p-4 rounded-2xl flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{ex.subject_name} ({ex.exam_type})</h4>
                      <p className="text-xs text-slate-400 mt-1">Portion: {ex.portion}</p>
                    </div>
                    <div className="text-right">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
                        {ex.date}
                      </span>
                      <p className="text-[10px] text-slate-400 font-semibold mt-1">Room {ex.room}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Quick AI Prompt Shortcuts */}
            <div className="glass-panel-glow p-6 rounded-3xl border border-teal-500/30 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-teal-400">
                <Sparkles className="h-5 w-5" />
                <h3 className="text-base font-bold font-display text-white">Ask CollegeAI Advisor</h3>
              </div>

              <div className="flex flex-col gap-2.5">
                {[
                  "What is my current attendance?",
                  "How many classes can I miss while maintaining 75%?",
                  "If I take 3 days leave next week, which subjects fall below 75%?",
                  "What marks do I need in end-sem for 8.5 CGPA?",
                  "How much fee is pending?"
                ].map((query, idx) => (
                  <button
                    key={idx}
                    onClick={() => onAskChatShortcut(query)}
                    className="w-full text-left p-3 rounded-xl bg-slate-900/80 border border-white/10 text-xs font-medium text-slate-300 hover:text-white hover:border-teal-400 transition-all flex items-center justify-between"
                  >
                    <span>"{query}"</span>
                    <ArrowRight className="h-3.5 w-3.5 text-teal-400 flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Announcements */}
            <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col gap-4">
              <h3 className="text-base font-bold text-white font-display">Campus Announcements</h3>
              <div className="flex flex-col gap-3">
                {announcements.slice(0, 3).map((ann) => (
                  <div key={ann.id} className="p-3 rounded-xl bg-slate-900/50 border border-white/5">
                    <span className="text-[9px] font-bold text-teal-400 uppercase">{ann.category}</span>
                    <h4 className="text-xs font-bold text-white mt-0.5">{ann.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{ann.content}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB CONTENT: Attendance Breakdown */}
      {activeTab === 'attendance' && (
        <div className="flex flex-col gap-6">
          
          <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col gap-4">
            <h3 className="text-xl font-bold font-display text-white">Target Attendance Calculator</h3>
            <p className="text-xs text-slate-400">Calculate how many consecutive classes you must attend to achieve your target percentage.</p>
            
            <div className="flex items-center gap-4 bg-slate-900/80 p-4 rounded-2xl border border-white/5 w-fit">
              <label className="text-xs font-bold text-slate-300">Set Target Percentage:</label>
              <input
                type="number"
                min="50"
                max="99"
                value={targetPct}
                onChange={(e) => setTargetPct(Number(e.target.value))}
                className="w-20 glass-input text-sm py-1 px-3 text-center font-bold text-teal-400"
              />
              <span className="text-xs text-slate-400 font-bold">%</span>
            </div>

            <div className="overflow-x-auto mt-2">
              <table className="glass-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Attended / Conducted</th>
                    <th>Current %</th>
                    <th>Target %</th>
                    <th>Consecutive Classes Needed</th>
                  </tr>
                </thead>
                <tbody>
                  {targetResults.map((res) => (
                    <tr key={res.subject_name}>
                      <td className="font-bold text-white">{res.subject_name}</td>
                      <td>
                        {attendance.records.find(r => r.subject_name === res.subject_name)?.attended} / {attendance.records.find(r => r.subject_name === res.subject_name)?.conducted}
                      </td>
                      <td className={`font-bold ${res.current_percentage >= 75 ? 'text-teal-400' : 'text-red-400'}`}>
                        {res.current_percentage}%
                      </td>
                      <td className="font-semibold text-slate-300">{targetPct}%</td>
                      <td>
                        {res.required === 0 ? (
                          <span className="indicator-pill success">Target Achieved</span>
                        ) : (
                          <span className="indicator-pill warning">Need {res.required} classes</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB CONTENT: Marks */}
      {activeTab === 'marks' && (
        <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold font-display text-white">Internal Academic Marks</h3>
              <p className="text-xs text-slate-400">Mid-semester & continuous evaluation scores</p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-purple-500/15 text-purple-300 border border-purple-500/30 text-xs font-bold">
              Current CGPA: {marks.current_cgpa}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {marks.subjects.map((s) => (
              <div key={s.code} className="bg-slate-900/60 p-5 rounded-2xl border border-white/5 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-white">{s.name}</h4>
                    <p className="text-[10px] text-slate-400 font-mono">{s.code}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20">
                    Mid-Sem: {s.mid_sem} / 30
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Assignment Marks: {s.assignment_marks} / 20</span>
                  <span>Total Internal: {s.internal_total} / 50</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Timetable */}
      {activeTab === 'timetable' && (
        <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col gap-6">
          <h3 className="text-xl font-bold font-display text-white">Weekly Class Schedule</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
              <div key={day} className="bg-slate-900/60 p-5 rounded-2xl border border-white/5 flex flex-col gap-3">
                <h4 className="text-sm font-bold text-teal-400 font-display border-b border-white/10 pb-2">{day}</h4>
                <div className="flex flex-col gap-2">
                  {timetable.days[day]?.map((slot, i) => (
                    <div key={i} className="timetable-slot">
                      <p className="text-xs font-bold text-white">{slot.subject}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">{slot.time} • Room {slot.room}</p>
                    </div>
                  )) || <p className="text-xs text-slate-500 italic">No classes scheduled</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Tasks */}
      {activeTab === 'tasks' && (
        <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col gap-6">
          <h3 className="text-xl font-bold font-display text-white">Assignments & Submissions</h3>
          
          <div className="flex flex-col gap-3">
            {assignments.assignments.map((asn) => (
              <div key={asn.id} className="bg-slate-900/60 p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{asn.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{asn.subject_name} • Due Date: {asn.due_date}</p>
                </div>
                {asn.status === 'COMPLETED' ? (
                  <span className="indicator-pill success">Submitted</span>
                ) : (
                  <span className="indicator-pill danger">Pending</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Billing */}
      {activeTab === 'billing' && (
        <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold font-display text-white">Fee Receipts & Accounts</h3>
              <p className="text-xs text-slate-400">Total Semester Fee: ₹{fees.total.toLocaleString()}</p>
            </div>
            <div className={`px-4 py-2 rounded-xl text-xs font-bold ${fees.pending > 0 ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'}`}>
              Pending: ₹{fees.pending.toLocaleString()}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {fees.receipts.map((r, i) => (
              <div key={i} className="bg-slate-900/60 p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{r.description}</h4>
                  <p className="text-xs text-slate-400">Paid Date: {r.date}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-teal-400">₹{r.amount.toLocaleString()}</span>
                  <p className="text-[10px] text-emerald-400 font-semibold">{r.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Notifications */}
      {activeTab === 'notifications' && (
        <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col gap-6">
          <h3 className="text-xl font-bold font-display text-white">College Notices & Broadcasts</h3>
          
          <div className="flex flex-col gap-4">
            {announcements.map((ann) => (
              <div key={ann.id} className="bg-slate-900/60 p-5 rounded-2xl border border-white/5 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/20">
                    {ann.category}
                  </span>
                  <span className="text-xs text-slate-500">{ann.date}</span>
                </div>
                <h4 className="text-base font-bold text-white">{ann.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{ann.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
