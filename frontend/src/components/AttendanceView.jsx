import React, { useState, useEffect } from 'react';
import { Percent, Calculator, CheckCircle2, AlertTriangle, HelpCircle, Bot } from 'lucide-react';
import { api } from '../services/api';

export default function AttendanceView({ currentStudentId, onAskChatShortcut }) {
  const [attendance, setAttendance] = useState(null);
  const [targetPct, setTargetPct] = useState(80);
  const [targetResults, setTargetResults] = useState([]);

  useEffect(() => {
    async function loadData() {
      if (!currentStudentId) return;
      try {
        const attRes = await api.getAttendance(currentStudentId);
        setAttendance(attRes);
      } catch (err) {
        console.error("Error loading attendance data", err);
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
      // Calculate max missable classes to stay above 75%
      let missable = Math.floor((record.attended / 0.75) - record.conducted);
      if (missable < 0) missable = 0;

      return {
        subject_name: record.subject_name,
        subject_code: record.subject_code,
        attended: record.attended,
        conducted: record.conducted,
        current_percentage: record.percentage,
        required: req,
        classes_can_miss: missable
      };
    });
    setTargetResults(computed);
  }, [attendance, targetPct]);

  if (!attendance) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <div className="h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2"></div>
        <p className="text-xs font-semibold">Loading attendance records...</p>
      </div>
    );
  }

  const overall = attendance.overall_percentage;
  const isSafe = overall >= 75;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* Overview Card */}
      <div className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-display font-extrabold text-xl ${
            isSafe ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'
          }`}>
            {overall}%
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">Overall Attendance Status</h2>
              <span className={`status-pill ${isSafe ? 'safe' : 'critical'}`}>
                {isSafe ? 'Safe' : 'Critical Warning'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Minimum mandatory college threshold: 75% • {isSafe ? `+${(overall - 75).toFixed(1)}% safe margin` : `Requires immediate attendance`}
            </p>
          </div>
        </div>

        <button
          onClick={() => onAskChatShortcut("How many classes can I miss to maintain 75%?")}
          className="btn-primary text-xs px-4 py-2.5 shadow-lg shadow-indigo-500/20 w-fit"
        >
          <Bot className="h-4 w-4" />
          <span>Ask AI Leave Calculator</span>
        </button>
      </div>

      {/* Target Percentage Calculator Control */}
      <div className="glass-card p-6 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
          <div>
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Calculator className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              Target Percentage Solver
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Calculate consecutive classes needed to hit a target percentage, or maximum leave allowed.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Set Target %:</label>
            <input
              type="number"
              min="50"
              max="99"
              value={targetPct}
              onChange={(e) => setTargetPct(Number(e.target.value))}
              className="w-16 glass-input text-xs py-1 px-2 text-center font-bold text-indigo-600 dark:text-indigo-400"
            />
          </div>
        </div>

        {/* Detailed Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-display font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Attended / Conducted</th>
                <th className="py-3 px-4">Current %</th>
                <th className="py-3 px-4">Max Leave Allowed (≥75%)</th>
                <th className="py-3 px-4">Classes Needed for {targetPct}%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {targetResults.map((res) => (
                <tr key={res.subject_code} className="hover:bg-slate-100/50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                    {res.subject_name}
                    <span className="block text-[10px] text-slate-400 font-mono font-normal">{res.subject_code}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                    {res.attended} / {res.conducted} classes
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`font-bold ${res.current_percentage >= 75 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                      {res.current_percentage}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                      res.classes_can_miss === 0 ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    }`}>
                      {res.classes_can_miss} classes missable
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {res.required === 0 ? (
                      <span className="status-pill safe">Target Reached</span>
                    ) : (
                      <span className="status-pill warning">Need {res.required} classes</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
