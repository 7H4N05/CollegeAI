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
export function CircularProgress({ percentage, size = 100, strokeWidth = 8, color = 'stroke-teal-500' }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90 w-full h-full">
        {/* Background circle */}
        <circle
          className="stroke-slate-200 dark:stroke-slate-800"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Foreground circle */}
        <circle
          className={`transition-all duration-500 ease-in-out ${color}`}
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
        <span className="font-display font-extrabold text-sm text-slate-800 dark:text-white leading-none">
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

  const getPercentageColor = (pct) => {
    if (pct >= 80) return 'text-emerald-500 stroke-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    if (pct >= 75) return 'text-amber-500 stroke-amber-500 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-500 stroke-rose-500 bg-rose-500/10 border-rose-500/20';
  };

  const getMeterColor = (pct) => {
    if (pct >= 80) return 'stroke-emerald-500';
    if (pct >= 75) return 'stroke-amber-500';
    return 'stroke-rose-500';
  };

  const getProgressBarColor = (pct) => {
    if (pct >= 80) return 'bg-emerald-500';
    if (pct >= 75) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="flex flex-col gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-4 rounded-xl shadow-sm w-full">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3">
        <div className="flex items-center gap-2">
          <Percent className="h-5 w-5 text-teal-500" />
          <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">Academic Attendance Report</h4>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPercentageColor(overall).split(' ').slice(2).join(' ')}`}>
          {overall >= 75 ? 'Satisfactory' : 'Critical Warning'}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 py-2">
        <CircularProgress percentage={overall} size={90} color={getMeterColor(overall)} />
        <div className="flex-grow w-full flex flex-col gap-3">
          {records.map((rec, i) => (
            <div key={i} className="flex flex-col gap-1 text-xs">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-700 dark:text-slate-200 truncate max-w-[220px]">{rec.subject_name}</span>
                <span className="text-slate-900 dark:text-white">{rec.percentage}% ({rec.attended}/{rec.conducted})</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor(rec.percentage)}`}
                  style={{ width: `${rec.percentage}%` }}
                ></div>
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">Faculty: {rec.faculty}</span>
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
    <div className="flex flex-col gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm w-full">
      <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
        <Calculator className="h-5 w-5 text-teal-500" />
        <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">Leave Cushion Limits (Stay above 75%)</h4>
      </div>

      <div className="flex flex-col gap-2.5">
        {capacities.map((item, i) => {
          const isCritical = item.classes_can_miss === 0;
          return (
            <div 
              key={i} 
              className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${
                isCritical 
                  ? 'bg-rose-500/5 border-rose-500/25 dark:bg-rose-950/10 dark:border-rose-900/30' 
                  : 'bg-emerald-500/5 border-emerald-500/25 dark:bg-emerald-950/10 dark:border-emerald-900/30'
              }`}
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.subject_name}</span>
                <span className="text-[10px] text-slate-400">Current Attendance: {item.current_percentage}%</span>
              </div>
              <div className="text-right">
                <span className={`font-display font-extrabold text-sm ${isCritical ? 'text-rose-500' : 'text-emerald-500'}`}>
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
    <div className="flex flex-col gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm w-full">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3">
        <div className="flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-red-500" />
          <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">Leave Attendance Projection</h4>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
          fallsBelow 
            ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' 
            : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
        }`}>
          {fallsBelow ? 'Debarment Risk' : 'Attendance Safe'}
        </span>
      </div>

      {/* Meta Summary */}
      <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg flex justify-between items-center text-xs font-semibold">
        <div className="flex flex-col">
          <span className="text-slate-400 text-[10px] uppercase">Leave Range</span>
          <span className="text-slate-800 dark:text-slate-200 mt-0.5">{label}</span>
        </div>
        <div className="text-right flex flex-col">
          <span className="text-slate-400 text-[10px] uppercase">Lectures Affected</span>
          <span className="text-red-500 dark:text-red-400 font-bold mt-0.5">{summary.classes_missed_count} missed</span>
        </div>
      </div>

      {/* Overall stats change */}
      <div className="flex items-center justify-around py-2 border-b border-slate-100 dark:border-slate-850">
        <div className="text-center">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Current Overall</span>
          <p className="font-display font-extrabold text-lg text-slate-700 dark:text-slate-350">{currentOverall}%</p>
        </div>
        <div className="text-slate-300 dark:text-slate-700 flex flex-col items-center">
          <ArrowRight className="h-5 w-5 text-slate-400" />
          <span className="text-[10px] text-rose-500 font-bold">-{drop}%</span>
        </div>
        <div className="text-center">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Projected Overall</span>
          <p className={`font-display font-extrabold text-lg ${fallsBelow ? 'text-rose-500' : 'text-emerald-500'}`}>
            {projectedOverall}%
          </p>
        </div>
      </div>

      {/* Detailed breakdowns */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subject-by-Subject Impacts</span>
        {subjects.map((s, i) => (
          <div key={i} className="flex justify-between items-center text-xs p-2 bg-slate-50 dark:bg-slate-950/30 rounded border border-slate-100 dark:border-slate-850">
            <div className="flex flex-col gap-0.5 max-w-[200px]">
              <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{s.subject_name}</span>
              <span className="text-[10px] text-slate-400">Misses {s.classes_missed} class(es)</span>
            </div>
            <div className="text-right flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-slate-400 line-through text-[10px]">{s.current_percentage}%</span>
                <span className={`font-extrabold ${s.falls_below_75 ? 'text-rose-500' : 'text-emerald-500'}`}>
                  {s.projected_percentage}%
                </span>
              </div>
              <div>
                {s.falls_below_75 ? (
                  <XCircle className="h-4.5 w-4.5 text-rose-500" title="Falls below 75%" />
                ) : (
                  <CheckCircle className="h-4.5 w-4.5 text-emerald-500" title="Safe" />
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
    <div className="flex flex-col gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm w-full">
      <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
        <Calendar className="h-5 w-5 text-teal-500" />
        <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">Academic Timetable</h4>
      </div>

      {/* Tab select */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`px-3 py-1 rounded-md text-xs font-semibold font-display transition-all shrink-0 ${
              activeDay === day
                ? 'bg-teal-500/10 text-teal-600 dark:bg-teal-950 dark:text-teal-400 border border-teal-500/20'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850'
            }`}
          >
            {day.slice(0, 3)}
          </button>
        ))}
      </div>

      {/* Schedule Slots */}
      <div className="flex flex-col gap-2 min-h-[120px]">
        {schedule[activeDay] && schedule[activeDay].length > 0 ? (
          schedule[activeDay].map((slot, i) => (
            <div 
              key={i} 
              className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-950/40 rounded-lg border-l-4 border-teal-500 border border-slate-100 dark:border-slate-850"
            >
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-900 dark:text-white">{slot.subject_name}</span>
                <div className="flex items-center gap-3 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {slot.time}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Room {slot.room}</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-200/50 dark:bg-slate-850 px-2 py-0.5 rounded">
                {slot.faculty.split(' ').pop()}
              </span>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-slate-400 text-xs">
            <CheckCircle className="h-8 w-8 text-teal-500/30 mb-1" />
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
    <div className="flex flex-col gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm w-full">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-teal-500" />
          <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">Grades & End-Sem Matrix</h4>
        </div>
        <span className="text-xs font-bold text-slate-700 dark:text-slate-350 bg-teal-500/10 px-2.5 py-0.5 rounded border border-teal-500/20">
          CGPA: {cgpa}
        </span>
      </div>

      {/* Grade Selector */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-semibold text-slate-400 uppercase">
          Select Target End-Semester Grade
        </label>
        <div className="grid grid-cols-4 gap-1.5 bg-slate-50 dark:bg-slate-950 p-1 rounded-lg border border-slate-100 dark:border-slate-850">
          {gradeOptions.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGrade(g)}
              className={`py-1.5 rounded-md text-[10px] font-bold transition-all ${
                selectedGrade === g
                  ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {g.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Subject list and targets */}
      <div className="flex flex-col gap-2.5">
        {records.map((rec, i) => {
          const needed = rec.target_grades[selectedGrade];
          const isAchievable = needed !== null;
          const isAlreadyAchieved = needed === 0;

          return (
            <div 
              key={i} 
              className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-slate-950/20 rounded-lg border border-slate-100 dark:border-slate-850"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[180px]">{rec.subject_name}</span>
                <span className="text-[10px] text-slate-400">Internals: {rec.internals} / 50</span>
              </div>
              <div className="text-right">
                {isAlreadyAchieved ? (
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                    Already Secured
                  </span>
                ) : !isAchievable ? (
                  <span className="text-[10px] font-bold text-rose-500 bg-rose-500/5 px-2 py-0.5 rounded border border-rose-500/10 flex items-center gap-0.5">
                    <AlertTriangle className="h-3 w-3" /> Unachievable
                  </span>
                ) : (
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-extrabold text-slate-800 dark:text-white">
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
    <div className="flex flex-col gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm w-full">
      <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
        <FileText className="h-5 w-5 text-teal-500" />
        <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">Upcoming Examinations</h4>
      </div>

      <div className="flex flex-col gap-3">
        {exams.length > 0 ? (
          exams.map((exam, i) => (
            <div 
              key={i} 
              className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-lg border border-slate-100 dark:border-slate-850 flex flex-col gap-2"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{exam.subject_name}</span>
                  <p className="text-[9px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">{exam.exam_type}</p>
                </div>
                <div className="text-right text-[10px] text-slate-500">
                  <span className="flex items-center gap-1 font-semibold justify-end"><Clock className="h-3.5 w-3.5 text-slate-400" /> {exam.date}</span>
                  <span className="text-[9px]">{exam.time}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] border-t border-slate-100 dark:border-slate-850 pt-2 text-slate-400">
                <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" /> Hall: {exam.room}</span>
                <span className="truncate max-w-[180px] italic">Portion: {exam.portion}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-slate-400 text-xs">
            <CheckCircle className="h-8 w-8 text-teal-500/30 mb-1" />
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
    <div className="flex flex-col gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm w-full">
      <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
        <CheckCircle className="h-5 w-5 text-teal-500" />
        <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">Assignments Tracker</h4>
      </div>

      <div className="flex flex-col gap-2.5">
        {assignments.length > 0 ? (
          assignments.map((asn, i) => {
            const isPending = asn.status === 'PENDING';
            return (
              <div 
                key={i} 
                className={`p-3 rounded-lg border flex justify-between items-center ${
                  isPending 
                    ? 'bg-amber-500/5 border-amber-500/20 dark:bg-amber-950/10' 
                    : 'bg-emerald-500/5 border-emerald-500/20 dark:bg-emerald-950/10'
                }`}
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{asn.title}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">{asn.subject_name}</span>
                  <span className="text-[9px] text-slate-400">Due Date: {asn.due_date}</span>
                </div>
                <div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    isPending 
                      ? 'bg-amber-500/10 text-amber-500' 
                      : 'bg-emerald-500/10 text-emerald-500'
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
    <div className="flex flex-col gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm w-full">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3">
        <div className="flex items-center gap-2">
          <Receipt className="h-5 w-5 text-teal-500" />
          <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">Fee Invoice & Dues</h4>
        </div>
        <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full border ${
          isCleared 
            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
            : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
        }`}>
          {status}
        </span>
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-3 gap-2 py-1 text-center">
        <div className="flex flex-col">
          <span className="text-[9px] text-slate-400 uppercase font-semibold">Total Tuition</span>
          <span className="font-display font-extrabold text-sm text-slate-700 dark:text-slate-300 mt-0.5">
            ₹{total_fee.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] text-slate-400 uppercase font-semibold">Paid Amount</span>
          <span className="font-display font-extrabold text-sm text-emerald-500 mt-0.5">
            ₹{paid.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] text-slate-400 uppercase font-semibold">Outstanding</span>
          <span className={`font-display font-extrabold text-sm mt-0.5 ${isCleared ? 'text-slate-400' : 'text-rose-500 animate-pulse'}`}>
            ₹{pending.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {!isCleared && (
        <div className="p-2.5 bg-rose-500/5 dark:bg-rose-950/15 border border-rose-500/15 text-[10px] text-rose-600 dark:text-rose-400 rounded-lg flex items-center justify-between font-semibold">
          <span>⚠️ Payment due immediately!</span>
          <span>Deadline: {due_date}</span>
        </div>
      )}

      {/* Transaction History */}
      <div className="flex flex-col gap-2 border-t border-slate-100 dark:border-slate-850 pt-3">
        <span className="text-[9px] text-slate-400 uppercase font-semibold tracking-wider">Transaction Records</span>
        {transactions && transactions.length > 0 ? (
          transactions.map((tx, i) => (
            <div key={i} className="flex justify-between items-center text-[10px] p-2 bg-slate-50 dark:bg-slate-950/40 rounded border border-slate-100 dark:border-slate-850">
              <div className="flex flex-col gap-0.5">
                <span className="font-bold text-slate-700 dark:text-slate-350">Transaction Ref: {tx.transaction_id}</span>
                <span className="text-slate-400">Date: {tx.date} • Method: {tx.method}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-emerald-500">₹{tx.amount.toLocaleString('en-IN')}</span>
                <p className="text-[8px] text-emerald-600 uppercase font-extrabold tracking-wider">{tx.status}</p>
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

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'ADMIN': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'EXAM': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'FEST': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'ACADEMIC': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  return (
    <div className="flex flex-col gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm w-full">
      <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
        <Megaphone className="h-5 w-5 text-teal-500" />
        <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white">Announcements notice board</h4>
      </div>

      <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
        {announcements.map((anc, i) => (
          <div key={i} className="flex flex-col gap-1 border-b border-slate-100 dark:border-slate-850 last:border-0 pb-3 last:pb-0">
            <div className="flex justify-between items-start gap-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{anc.title}</span>
              <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border uppercase shrink-0 ${getCategoryBadge(anc.category)}`}>
                {anc.category}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-350 leading-normal">{anc.content}</p>
            <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">Published on: {anc.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 11. DYNAMIC COMPONENT RESOLVER FOR CHAT
// ==========================================
export default function InteractiveResponseCard({ cardType, payload }) {
  switch (cardType) {
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
