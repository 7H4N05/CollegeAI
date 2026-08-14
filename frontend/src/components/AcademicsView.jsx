import React, { useState, useEffect } from 'react';
import { Award, BookOpen, AlertTriangle, CheckCircle2, Bot } from 'lucide-react';
import { api } from '../services/api';

export default function AcademicsView({ currentStudentId, onAskChatShortcut }) {
  const [marks, setMarks] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState('S (90+)');

  useEffect(() => {
    async function loadData() {
      if (!currentStudentId) return;
      try {
        const res = await api.getMarks(currentStudentId);
        setMarks(res);
      } catch (err) {
        console.error("Error loading marks", err);
      }
    }
    loadData();
  }, [currentStudentId]);

  if (!marks) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <div className="h-8 w-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mb-2"></div>
        <p className="text-xs font-semibold">Loading academic scores...</p>
      </div>
    );
  }

  const gradeOptions = ['S (90+)', 'A (80+)', 'B (70+)', 'C (60+)'];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* CGPA Banner */}
      <div className="glass-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-display font-extrabold text-xl border border-purple-500/20">
            {marks.current_cgpa}
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">Current Cumulative GPA</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Based on mid-semester exams and continuous internal assessment evaluations.
            </p>
          </div>
        </div>

        <button
          onClick={() => onAskChatShortcut("What marks do I need in the end semester to achieve a target grade?")}
          className="btn-primary text-xs px-4 py-2.5 shadow-lg shadow-purple-500/20 w-fit"
        >
          <Bot className="h-4 w-4" />
          <span>Ask End-Sem Target Solver</span>
        </button>
      </div>

      {/* Grade Matrix Calculator */}
      <div className="glass-card p-6 flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
          <div>
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              End-Semester Grade Target Matrix
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Calculates exact marks required in final 100-mark written exams to achieve your target grade.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
            {gradeOptions.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGrade(g)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-display transition-all ${
                  selectedGrade === g
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {g.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Subject Internal Marks Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {marks.subjects.map((sub) => {
            // Formula: EndsemNeeded = 2 * (TargetTotal - InternalTotal)
            const targetMin = selectedGrade.includes('90') ? 90 : selectedGrade.includes('80') ? 80 : selectedGrade.includes('70') ? 70 : 60;
            let endsemNeeded = 2 * (targetMin - sub.internal_total);
            if (endsemNeeded < 0) endsemNeeded = 0;
            const isUnachievable = endsemNeeded > 100;

            return (
              <div key={sub.code} className="p-4 rounded-xl bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{sub.name}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">{sub.code}</span>
                  </div>
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                    Internal: {sub.internal_total} / 50
                  </span>
                </div>

                <div className="flex justify-between items-center border-t border-slate-200/60 dark:border-slate-800/60 pt-2 text-xs">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">End-Sem Needed for Grade {selectedGrade.split(' ')[0]}:</span>
                  {isUnachievable ? (
                    <span className="text-[11px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" /> Unachievable
                    </span>
                  ) : endsemNeeded === 0 ? (
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      Secured
                    </span>
                  ) : (
                    <span className="font-display font-extrabold text-slate-900 dark:text-white text-sm">
                      {endsemNeeded} / 100
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
