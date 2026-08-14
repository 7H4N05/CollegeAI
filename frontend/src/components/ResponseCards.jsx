import React, { useState } from 'react';
import { 
  Percent, 
  Calendar, 
  BookOpen, 
  Clock, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  Calculator, 
  AlertTriangle, 
  Receipt,
  FileText,
  Megaphone,
  User,
  ArrowRight,
  TrendingDown,
  ChevronRight
} from 'lucide-react';

// ==========================================
// 1. CIRCULAR PROGRESS COMPONENT
// ==========================================
export function CircularProgress({ percentage, size = 100, strokeWidth = 8, color = 'stroke-teal-400' }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90 w-full h-full">
        <circle
          className="stroke-slate-800"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={`transition-all duration-700 ease-in-out ${color}`}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-display font-extrabold text-sm text-white leading-none">
          {percentage}%
        </span>
      </div>
    </div>
  );
}

// ==========================================
// 2. ATTENDANCE CARD
// ==========================================
export function AttendanceCard({ data }) {
  if (!data) return null;
  const { overall, records } = data;

  const getMeterColor = (pct) => {
    if (pct >= 80) return 'stroke-teal-400';
    if (pct >= 75) return 'stroke-amber-400';
    return 'stroke-red-400';
  };

  const getProgressBarColor = (pct) => {
    if (pct >= 80) return 'bg-teal-400';
    if (pct >= 75) return 'bg-amber-400';
    return 'bg-red-400';
  };

  return (
    <div className="flex flex-col gap-4 bg-slate-900/90 border border-white/10 p-5 rounded-2xl shadow-xl w-full">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Percent className="h-5 w-5 text-teal-400" />
          <h4 className="font-display font-bold text-sm text-white">Academic Attendance Report</h4>
        </div>
        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${overall >= 75 ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
          {overall >= 75 ? 'Satisfactory' : 'Critical Warning'}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 py-2">
        <CircularProgress percentage={overall} size={90} color={getMeterColor(overall)} />
        <div className="flex-grow w-full flex flex-col gap-3">
          {records.map((rec, i) => (
            <div key={i} className="flex flex-col gap-1 text-xs">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-200 truncate max-w-[220px]">{rec.subject_name}</span>
                <span className="text-white font-bold">{rec.percentage}% ({rec.attended}/{rec.conducted})</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor(rec.percentage)}`}
                  style={{ width: `${rec.percentage}%` }}
                ></div>
              </div>
              <span className="text-[10px] text-slate-400">Faculty: {rec.faculty}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. LEAVE CAPACITY CARD
// ==========================================
export function LeaveCapacityCard({ data }) {
  if (!data || !data.capacities) return null;
  const { capacities } = data;

  return (
    <div className="flex flex-col gap-4 bg-slate-900/90 border border-white/10 p-5 rounded-2xl shadow-xl w-full">
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <Calculator className="h-5 w-5 text-teal-400" />
        <h4 className="font-display font-bold text-sm text-white">Leave Cushion Limits (75% Threshold)</h4>
      </div>

      <div className="flex flex-col gap-2.5">
        {capacities.map((item, i) => {
          const isCritical = item.classes_can_miss === 0;
          return (
            <div 
              key={i} 
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                isCritical 
                  ? 'bg-red-500/10 border-red-500/30 text-red-300' 
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              }`}
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold text-white">{item.subject_name}</span>
                <span className="text-[10px] text-slate-400">Current Attendance: {item.current_percentage}%</span>
              </div>
              <div className="text-right">
                <span className={`font-display font-extrabold text-sm ${isCritical ? 'text-red-400' : 'text-emerald-400'}`}>
                  {item.classes_can_miss} classes
                </span>
                <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">missable</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// 4. ATTENDANCE PROJECTION CARD
// ==========================================
export function AttendanceProjectionCard({ data }) {
  if (!data) return null;
  const { label, summary, subjects } = data;

  const currentOverall = summary.current_overall_percentage;
  const projectedOverall = summary.projected_overall_percentage;
  const drop = Math.round((currentOverall - projectedOverall) * 10) / 10;
  
  const fallsBelow = subjects.some(s => s.falls_below_75);

  return (
    <div className="flex flex-col gap-4 bg-slate-900/90 border border-white/10 p-5 rounded-2xl shadow-xl w-full">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-red-400" />
          <h4 className="font-display font-bold text-sm text-white">Leave Attendance Projection</h4>
        </div>
        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
          fallsBelow 
            ? 'bg-red-500/15 text-red-400 border-red-500/30' 
            : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
        }`}>
          {fallsBelow ? 'Debarment Risk' : 'Attendance Safe'}
        </span>
      </div>

      <div className="p-3 bg-slate-950/80 rounded-xl flex justify-between items-center text-xs font-semibold border border-white/5">
        <div className="flex flex-col">
          <span className="text-slate-400 text-[10px] uppercase">Leave Range</span>
          <span className="text-white font-bold mt-0.5">{label}</span>
        </div>
        <div className="text-right flex flex-col">
          <span className="text-slate-400 text-[10px] uppercase">Lectures Affected</span>
          <span className="text-red-400 font-bold mt-0.5">{summary.classes_missed_count} missed</span>
        </div>
      </div>

      <div className="flex items-center justify-around py-2 border-b border-white/10">
        <div className="text-center">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Current Overall</span>
          <p className="font-display font-extrabold text-lg text-slate-200">{currentOverall}%</p>
        </div>
        <div className="text-slate-500 flex flex-col items-center">
          <ArrowRight className="h-5 w-5 text-slate-400" />
          <span className="text-[10px] text-red-400 font-bold">-{drop}%</span>
        </div>
        <div className="text-center">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Projected Overall</span>
          <p className={`font-display font-extrabold text-lg ${fallsBelow ? 'text-red-400' : 'text-emerald-400'}`}>
            {projectedOverall}%
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subject-by-Subject Impact</span>
        {subjects.map((s, i) => (
          <div key={i} className="flex justify-between items-center text-xs p-3 bg-slate-950/40 rounded-xl border border-white/5">
            <div className="flex flex-col gap-0.5 max-w-[200px]">
              <span className="font-bold text-white truncate">{s.subject_name}</span>
              <span className="text-[10px] text-slate-400">Misses {s.classes_missed} class(es)</span>
            </div>
            <div className="text-right flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-slate-500 line-through text-[10px]">{s.current_percentage}%</span>
                <span className={`font-extrabold ${s.falls_below_75 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {s.projected_percentage}%
                </span>
              </div>
              <div>
                {s.falls_below_75 ? (
                  <XCircle className="h-4.5 w-4.5 text-red-400" title="Falls below 75%" />
                ) : (
                  <CheckCircle className="h-4.5 w-4.5 text-emerald-400" title="Safe" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 5. TIMETABLE CARD
// ==========================================
export function TimetableCard({ data }) {
  if (!data || !data.schedule) return null;
  const { schedule } = data;

  const [activeDay, setActiveDay] = useState(
    ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(new Date().toLocaleDateString('en-US', { weekday: 'long' }))
      ? new Date().toLocaleDateString('en-US', { weekday: 'long' })
      : 'Monday'
  );

  return (
    <div className="flex flex-col gap-4 bg-slate-900/90 border border-white/10 p-5 rounded-2xl shadow-xl w-full">
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <Calendar className="h-5 w-5 text-teal-400" />
        <h4 className="font-display font-bold text-sm text-white">Academic Timetable</h4>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-display transition-all shrink-0 ${
              activeDay === day
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            {day.slice(0, 3)}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2 min-h-[120px]">
        {schedule[activeDay] && schedule[activeDay].length > 0 ? (
          schedule[activeDay].map((slot, i) => (
            <div 
              key={i} 
              className="flex justify-between items-center p-3 bg-slate-950/50 rounded-xl border-l-4 border-teal-400 border border-white/5"
            >
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-white">{slot.subject_name}</span>
                <div className="flex items-center gap-3 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {slot.time}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Room {slot.room}</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                {slot.faculty.split(' ').pop()}
              </span>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-slate-400 text-xs">
            <CheckCircle className="h-8 w-8 text-teal-400/30 mb-1" />
            No classes scheduled on this day.
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 6. MARKS CARD (TARGET CALCULATOR)
// ==========================================
export function MarksCard({ data }) {
  if (!data) return null;
  const { cgpa, records } = data;
  const [selectedGrade, setSelectedGrade] = useState('S (90+)');

  const gradeOptions = ['S (90+)', 'A (80+)', 'B (70+)', 'C (60+)'];

  return (
    <div className="flex flex-col gap-4 bg-slate-900/90 border border-white/10 p-5 rounded-2xl shadow-xl w-full">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-purple-400" />
          <h4 className="font-display font-bold text-sm text-white">Grades & End-Sem Target Matrix</h4>
        </div>
        <span className="text-xs font-bold text-purple-300 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
          CGPA: {cgpa}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-semibold text-slate-400 uppercase">
          Select Target Grade:
        </label>
        <div className="grid grid-cols-4 gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-white/5">
          {gradeOptions.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGrade(g)}
              className={`py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                selectedGrade === g
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {g.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {records.map((rec, i) => {
          const needed = rec.target_grades[selectedGrade];
          const isAchievable = needed !== null;
          const isAlreadyAchieved = needed === 0;

          return (
            <div 
              key={i} 
              className="flex justify-between items-center p-3 bg-slate-950/40 rounded-xl border border-white/5"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold text-white truncate max-w-[180px]">{rec.subject_name}</span>
                <span className="text-[10px] text-slate-400">Internals: {rec.internals} / 50</span>
              </div>
              <div className="text-right">
                {isAlreadyAchieved ? (
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    Secured
                  </span>
                ) : !isAchievable ? (
                  <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-2.5 py-0.5 rounded-full border border-red-500/20 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> Unachievable
                  </span>
                ) : (
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-extrabold text-white">
                      {needed} / 100
                    </span>
                    <span className="text-[9px] text-slate-400">({needed/2}% endsem)</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// 7. EXAMS CARD
// ==========================================
export function ExamsCard({ data }) {
  if (!data || !data.exams) return null;
  const { exams } = data;

  return (
    <div className="flex flex-col gap-4 bg-slate-900/90 border border-white/10 p-5 rounded-2xl shadow-xl w-full">
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <FileText className="h-5 w-5 text-indigo-400" />
        <h4 className="font-display font-bold text-sm text-white">Upcoming Examinations</h4>
      </div>

      <div className="flex flex-col gap-3">
        {exams.length > 0 ? (
          exams.map((exam, i) => (
            <div 
              key={i} 
              className="p-3.5 bg-slate-950/50 rounded-xl border border-white/5 flex flex-col gap-2"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold text-white">{exam.subject_name}</span>
                  <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider">{exam.exam_type}</p>
                </div>
                <div className="text-right text-[10px] text-slate-400">
                  <span className="flex items-center gap-1 font-semibold justify-end"><Clock className="h-3.5 w-3.5 text-slate-400" /> {exam.date}</span>
                  <span className="text-[9px]">{exam.time}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] border-t border-white/5 pt-2 text-slate-400">
                <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" /> Hall: {exam.room}</span>
                <span className="truncate max-w-[180px] italic">Portion: {exam.portion}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-slate-400 text-xs">
            <CheckCircle className="h-8 w-8 text-indigo-400/30 mb-1" />
            No upcoming exams scheduled.
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 8. ASSIGNMENTS CARD
// ==========================================
export function AssignmentsCard({ data }) {
  if (!data || !data.assignments) return null;
  const { assignments } = data;

  return (
    <div className="flex flex-col gap-4 bg-slate-900/90 border border-white/10 p-5 rounded-2xl shadow-xl w-full">
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <CheckCircle className="h-5 w-5 text-amber-400" />
        <h4 className="font-display font-bold text-sm text-white">Assignments Tracker</h4>
      </div>

      <div className="flex flex-col gap-2.5">
        {assignments.length > 0 ? (
          assignments.map((asn, i) => {
            const isPending = asn.status === 'PENDING';
            return (
              <div 
                key={i} 
                className={`p-3 rounded-xl border flex justify-between items-center ${
                  isPending 
                    ? 'bg-amber-500/10 border-amber-500/20' 
                    : 'bg-emerald-500/10 border-emerald-500/20'
                }`}
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-white">{asn.title}</span>
                  <span className="text-[10px] text-slate-400 font-semibold">{asn.subject_name}</span>
                  <span className="text-[9px] text-slate-400">Due Date: {asn.due_date}</span>
                </div>
                <div>
                  <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full ${
                    isPending 
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {asn.status}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-slate-400 text-xs py-8 text-center">
            No assignments allocated.
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 9. FEES CARD
// ==========================================
export function FeesCard({ data }) {
  if (!data) return null;
  const { total_fee, paid, pending, due_date, status, transactions } = data;

  const isCleared = pending === 0;

  return (
    <div className="flex flex-col gap-4 bg-slate-900/90 border border-white/10 p-5 rounded-2xl shadow-xl w-full">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Receipt className="h-5 w-5 text-emerald-400" />
          <h4 className="font-display font-bold text-sm text-white">Fee Invoice & Dues</h4>
        </div>
        <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full border ${
          isCleared 
            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
            : 'bg-red-500/15 text-red-400 border-red-500/30'
        }`}>
          {status}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 py-1 text-center">
        <div className="flex flex-col">
          <span className="text-[9px] text-slate-400 uppercase font-semibold">Total Tuition</span>
          <span className="font-display font-extrabold text-sm text-slate-200 mt-0.5">
            ₹{total_fee.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] text-slate-400 uppercase font-semibold">Paid Amount</span>
          <span className="font-display font-extrabold text-sm text-emerald-400 mt-0.5">
            ₹{paid.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] text-slate-400 uppercase font-semibold">Outstanding</span>
          <span className={`font-display font-extrabold text-sm mt-0.5 ${isCleared ? 'text-slate-400' : 'text-red-400 animate-pulse'}`}>
            ₹{pending.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {!isCleared && (
        <div className="p-3 bg-red-950/60 border border-red-500/30 text-[10px] text-red-300 rounded-xl flex items-center justify-between font-semibold">
          <span>⚠️ Payment due immediately!</span>
          <span>Deadline: {due_date}</span>
        </div>
      )}

      <div className="flex flex-col gap-2 border-t border-white/10 pt-3">
        <span className="text-[9px] text-slate-400 uppercase font-semibold tracking-wider">Transaction Records</span>
        {transactions && transactions.length > 0 ? (
          transactions.map((tx, i) => (
            <div key={i} className="flex justify-between items-center text-[10px] p-2.5 bg-slate-950/40 rounded-xl border border-white/5">
              <div className="flex flex-col gap-0.5">
                <span className="font-bold text-slate-200">Ref: {tx.transaction_id}</span>
                <span className="text-slate-400">{tx.date} • {tx.method}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-emerald-400">₹{tx.amount.toLocaleString('en-IN')}</span>
                <p className="text-[8px] text-emerald-300 uppercase font-extrabold tracking-wider">{tx.status}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-slate-400 text-xs italic py-2">No transaction records found.</div>
        )}
      </div>

    </div>
  );
}

// ==========================================
// 10. ANNOUNCEMENTS CARD
// ==========================================
export function AnnouncementsCard({ data }) {
  if (!data || !data.announcements) return null;
  const { announcements } = data;

  return (
    <div className="flex flex-col gap-4 bg-slate-900/90 border border-white/10 p-5 rounded-2xl shadow-xl w-full">
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <Megaphone className="h-5 w-5 text-teal-400" />
        <h4 className="font-display font-bold text-sm text-white">Notice Board Broadcasts</h4>
      </div>

      <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
        {announcements.map((anc, i) => (
          <div key={i} className="flex flex-col gap-1 border-b border-white/5 last:border-0 pb-3 last:pb-0">
            <div className="flex justify-between items-start gap-2">
              <span className="text-xs font-bold text-white leading-tight">{anc.title}</span>
              <span className="text-[8px] font-bold px-2 py-0.5 rounded border uppercase shrink-0 bg-teal-500/10 text-teal-300 border-teal-500/20">
                {anc.category}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-normal">{anc.content}</p>
            <span className="text-[9px] text-slate-400 mt-0.5">Published: {anc.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 11. DYNAMIC COMPONENT RESOLVER FOR CHAT
// ==========================================
export default function InteractiveResponseCard({ cardData }) {
  if (!cardData) return null;
  const { type, payload } = cardData;

  switch (type) {
    case 'attendance':
      return <AttendanceCard data={payload} />;
    case 'leave_capacity':
      return <LeaveCapacityCard data={payload} />;
    case 'projection':
      return <AttendanceProjectionCard data={payload} />;
    case 'timetable':
      return <TimetableCard data={payload} />;
    case 'marks':
      return <MarksCard data={payload} />;
    case 'exams':
      return <ExamsCard data={payload} />;
    case 'assignments':
      return <AssignmentsCard data={payload} />;
    case 'fees':
      return <FeesCard data={payload} />;
    case 'announcements':
      return <AnnouncementsCard data={payload} />;
    default:
      return null;
  }
}
