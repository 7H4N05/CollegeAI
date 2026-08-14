import React, { useState, useEffect } from 'react';
import { CreditCard, Receipt, CheckCircle2, AlertCircle, Bot } from 'lucide-react';
import { api } from '../services/api';

export default function FeesView({ currentStudentId, onAskChatShortcut }) {
  const [fees, setFees] = useState(null);

  useEffect(() => {
    async function loadData() {
      if (!currentStudentId) return;
      try {
        const res = await api.getFees(currentStudentId);
        setFees(res);
      } catch (err) {
        console.error("Error loading fees data", err);
      }
    }
    loadData();
  }, [currentStudentId]);

  if (!fees) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <div className="h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2"></div>
        <p className="text-xs font-semibold">Loading fee records...</p>
      </div>
    );
  }

  const isCleared = fees.pending === 0;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* Financial Summary */}
      <div className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">Semester Fee Statement</h2>
            <span className={`status-pill ${isCleared ? 'safe' : 'critical'}`}>
              {fees.status}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Total Semester Tuition Fee: ₹{fees.total.toLocaleString('en-IN')}
          </p>
        </div>

        <button
          onClick={() => onAskChatShortcut("How much fee is pending?")}
          className="btn-primary text-xs px-4 py-2.5 shadow-lg shadow-indigo-500/20 w-fit"
        >
          <Bot className="h-4 w-4" />
          <span>Ask AI Fee Breakdown</span>
        </button>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 flex flex-col gap-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Tuition</span>
          <span className="font-display font-extrabold text-2xl text-slate-900 dark:text-white">
            ₹{fees.total.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="glass-card p-5 flex flex-col gap-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Paid Amount</span>
          <span className="font-display font-extrabold text-2xl text-emerald-600 dark:text-emerald-400">
            ₹{fees.paid.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="glass-card p-5 flex flex-col gap-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Outstanding Dues</span>
          <span className={`font-display font-extrabold text-2xl ${isCleared ? 'text-slate-400' : 'text-amber-500'}`}>
            ₹{fees.pending.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Receipt Transactions */}
      <div className="glass-card p-6 flex flex-col gap-4">
        <h3 className="font-display font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Receipt className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          Paid Transaction Receipts
        </h3>

        <div className="flex flex-col gap-3">
          {fees.receipts.map((r, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs">
              <div className="flex flex-col gap-0.5">
                <span className="font-bold text-slate-900 dark:text-white">{r.description}</span>
                <span className="text-slate-400">Paid Date: {r.date}</span>
              </div>
              <div className="text-right">
                <span className="font-display font-extrabold text-sm text-emerald-600 dark:text-emerald-400">
                  ₹{r.amount.toLocaleString('en-IN')}
                </span>
                <span className="block text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">{r.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
