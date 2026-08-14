import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, FileText, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export default function ExamsView({ currentStudentId }) {
  const [exams, setExams] = useState(null);

  useEffect(() => {
    async function loadData() {
      if (!currentStudentId) return;
      try {
        const res = await api.getExams(currentStudentId);
        setExams(res.exams);
      } catch (err) {
        console.error("Error loading exams", err);
      }
    }
    loadData();
  }, [currentStudentId]);

  if (!exams) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <div className="h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2"></div>
        <p className="text-xs font-semibold">Loading exam schedule...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      <div className="glass-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">Examination Timetable</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Scheduled mid-semester and end-semester written examinations.
          </p>
        </div>
        <span className="px-3 py-1.5 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 text-xs font-bold w-fit">
          {exams.length} Exams Scheduled
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {exams.map((ex, i) => (
          <div key={ex.id} className="glass-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-display font-extrabold text-sm border border-indigo-500/20 shrink-0">
                #{i + 1}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{ex.subject_name}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 uppercase">
                    {ex.exam_type}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                  Portion: <span className="text-slate-700 dark:text-slate-300 font-semibold">{ex.portion}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-300 font-semibold bg-slate-100/60 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-indigo-500" />
                <span>{ex.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-indigo-500" />
                <span>{ex.time}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-indigo-500" />
                <span>Hall: {ex.room}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
