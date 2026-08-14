import React from 'react';
import { 
  Bot, 
  ArrowRight, 
  Sparkles, 
  MessageSquare, 
  GraduationCap,
  Mic,
  ShieldCheck
} from 'lucide-react';
import { api } from '../services/api';

export default function Landing({ onStart }) {
  const mockStudentsList = api.getMockStudents();
  const mockParentsList = api.getMockParents();

  const handleQuickLogin = async (studentId, role, targetView = 'dashboard') => {
    try {
      const student = mockStudentsList.find(s => s.id === studentId);
      if (!student) return;
      
      let username = student.roll_number;
      if (role === 'PARENT') {
        const parent = mockParentsList.find(p => p.student_id === studentId);
        username = parent ? parent.name : 'parent';
      }

      await api.login(role, username, 'password', studentId);
      onStart(targetView);
    } catch (err) {
      onStart('login');
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center text-center py-6 sm:py-12 gap-8 max-w-4xl mx-auto animate-fade-in">
      
      {/* MINIMAL HERO */}
      <div className="flex flex-col items-center text-center gap-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 font-mono font-bold text-xs border border-indigo-500/20 shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          <span>Built for Students & Parents</span>
        </div>

        <h1 className="font-display font-extrabold text-4xl sm:text-6xl tracking-tight text-white leading-tight">
          Edu<span className="text-indigo-400">Mitra</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed font-medium">
          Instant ERP AI assistant for <strong className="text-indigo-400 font-semibold">Students</strong> on web, and zero-effort <strong className="text-emerald-400 font-semibold">WhatsApp Voice Notes</strong> for <strong className="text-emerald-400 font-semibold">Parents</strong> — no app downloads or passwords required.
        </p>

        {/* PRIMARY CALL TO ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-2 w-full max-w-md">
          <button 
            onClick={() => onStart('login')}
            className="btn-primary text-xs sm:text-sm px-6 py-3 shadow-lg shadow-indigo-500/20 w-full sm:w-auto flex items-center justify-center gap-2 font-bold"
          >
            <Bot className="h-4 w-4" />
            <span>Launch Web AI</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button 
            onClick={() => handleQuickLogin('STU001', 'PARENT', 'whatsapp-bot')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2"
          >
            <MessageSquare className="h-4 w-4 text-emerald-400" />
            <span>Try Parent WhatsApp Bot</span>
          </button>
        </div>
      </div>

      {/* MINIMAL DUAL USE CASE CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full text-left max-w-3xl mx-auto">
        
        {/* STUDENT CARD */}
        <div className="glass-card p-5 rounded-2xl border border-indigo-500/20 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-white flex items-center gap-1.5">
                <GraduationCap className="h-4 w-4 text-indigo-400" /> For Students
              </span>
              <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">Web Portal</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Attendance leave planner, end-sem marks target calculator, fee tracking, and instant timetables.
            </p>
          </div>
          <button 
            onClick={() => onStart('login')}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 mt-1"
          >
            Open Student Portal <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* PARENT CARD */}
        <div className="glass-card p-5 rounded-2xl border border-emerald-500/20 flex flex-col justify-between gap-4 bg-emerald-950/10">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-white flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4 text-emerald-400" /> For Parents
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">WhatsApp Voice</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Designed for non-tech savvy parents. Send simple <strong className="text-emerald-400">WhatsApp Voice Notes</strong> in your own voice — no login or password stress.
            </p>
          </div>
          <button 
            onClick={() => handleQuickLogin('STU001', 'PARENT', 'whatsapp-bot')}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 mt-1"
          >
            Test WhatsApp Simulator <ArrowRight className="h-3 w-3" />
          </button>
        </div>

      </div>

      {/* QUICK 1-CLICK PERSONA TEST */}
      <div className="w-full glass-card p-5 rounded-2xl border border-slate-800 max-w-3xl mx-auto flex flex-col gap-3 text-left">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="font-bold text-xs text-slate-300 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-indigo-400" /> 1-Click Demo Persona Test
          </span>
          <span className="text-[10px] text-slate-400 font-mono">Select persona</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          
          <div 
            onClick={() => handleQuickLogin('STU001', 'STUDENT', 'dashboard')}
            className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-all flex items-center justify-between"
          >
            <div>
              <div className="font-bold text-xs text-white">Aarav Sharma (Student)</div>
              <div className="text-[10px] text-slate-400">88% Attendance • Web Portal</div>
            </div>
            <span className="text-[10px] font-bold text-indigo-400 flex items-center gap-0.5">Test <ArrowRight className="h-3 w-3" /></span>
          </div>

          <div 
            onClick={() => handleQuickLogin('STU001', 'PARENT', 'whatsapp-bot')}
            className="p-3 rounded-xl bg-slate-900/60 border border-emerald-500/30 hover:border-emerald-500/60 cursor-pointer transition-all flex items-center justify-between"
          >
            <div>
              <div className="font-bold text-xs text-white">Rajesh Sharma (Parent)</div>
              <div className="text-[10px] text-emerald-400">WhatsApp Voice Bot • Parent</div>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">Test <ArrowRight className="h-3 w-3" /></span>
          </div>

          <div 
            onClick={() => handleQuickLogin('STU003', 'STUDENT', 'dashboard')}
            className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-all flex items-center justify-between"
          >
            <div>
              <div className="font-bold text-xs text-white">Rohan Das (Student)</div>
              <div className="text-[10px] text-red-400">68% Att. • Pending Fee</div>
            </div>
            <span className="text-[10px] font-bold text-indigo-400 flex items-center gap-0.5">Test <ArrowRight className="h-3 w-3" /></span>
          </div>

          <div 
            onClick={() => handleQuickLogin('STU003', 'PARENT', 'whatsapp-bot')}
            className="p-3 rounded-xl bg-slate-900/60 border border-emerald-500/30 hover:border-emerald-500/60 cursor-pointer transition-all flex items-center justify-between"
          >
            <div>
              <div className="font-bold text-xs text-white">Alok Das (Parent)</div>
              <div className="text-[10px] text-emerald-400">WhatsApp Voice Bot • Parent</div>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">Test <ArrowRight className="h-3 w-3" /></span>
          </div>

        </div>
      </div>

    </div>
  );
}


