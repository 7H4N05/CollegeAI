import React, { useState, useEffect } from 'react';
import { CheckSquare, Clock, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export default function AssignmentsView({ currentStudentId }) {
  const [assignments, setAssignments] = useState(null);
  const [filter, setFilter] = useState('ALL'); // ALL, PENDING, COMPLETED

  useEffect(() => {
    async function loadData() {
      if (!currentStudentId) return;
      try {
        const res = await api.getAssignments(currentStudentId);
        setAssignments(res.assignments);
      } catch (err) {
        console.error("Error loading assignments", err);
      }
    }
    loadData();
  }, [currentStudentId]);

  if (!assignments) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <div className="h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2"></div>
        <p className="text-xs font-semibold">Loading assignments list...</p>
      </div>
    );
  }

  const filtered = assignments.filter(a => {
    if (filter === 'PENDING') return a.status === 'PENDING';
    if (filter === 'COMPLETED') return a.status === 'COMPLETED';
    return true;
  });

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* Header */}
      <div className="glass-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">Assignments Tracker</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Track coursework deadlines, submissions, and status.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
          {['ALL', 'PENDING', 'COMPLETED'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-display transition-all ${
                filter === f
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Assignment List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((asn) => {
          const isPending = asn.status === 'PENDING';
          return (
            <div 
              key={asn.id} 
              className={`glass-card p-5 flex flex-col justify-between gap-3 border-l-4 ${
                isPending ? 'border-l-amber-500' : 'border-l-emerald-500'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{asn.title}</h3>
                  <span className={`status-pill ${isPending ? 'warning' : 'safe'}`}>
                    {asn.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                  Subject: <span className="font-bold text-slate-700 dark:text-slate-300">{asn.subject_name}</span>
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-200/60 dark:border-slate-800/60 pt-3 text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> Due: {asn.due_date}
                </span>
                <span className="text-[10px] font-bold text-slate-400">Max Score: 20 Marks</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
