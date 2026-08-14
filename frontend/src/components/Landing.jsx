import React from 'react';
import { 
  Bot, 
  ArrowRight, 
  Sparkles, 
  MessageSquare, 
  User, 
  Users,
  Mic,
  ShieldCheck,
  CheckCircle2,
  Smartphone,
  Zap,
  HelpCircle,
  Volume2,
  Lock,
  Calculator,
  Calendar,
  GraduationCap
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
    <div className="w-full flex flex-col items-center justify-center text-center py-6 sm:py-12 gap-10 max-w-5xl mx-auto animate-fade-in">
      
      {/* 1. HERO TAGLINE & INTRO */}
      <div className="flex flex-col items-center justify-center text-center gap-5 max-w-3xl mx-auto">
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-emerald-500/10 text-indigo-400 font-mono font-bold text-xs border border-indigo-500/20 shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
          <span>Built for Students & Parents • Zero Tech Friction</span>
        </div>

        <h1 className="font-display font-extrabold text-4xl sm:text-6xl tracking-tight text-white leading-[1.12]">
          College ERP Updates Made Effortless for{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
            Students & Parents
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed font-medium">
          Instant AI academic planning for <strong className="text-indigo-400 font-semibold">Students</strong> on the web, and zero-effort <strong className="text-emerald-400 font-semibold">WhatsApp Voice Notes & Texts</strong> for <strong className="text-emerald-400 font-semibold">Parents</strong> — no confusing ERP portals, app downloads, or complex login credentials required.
        </p>

        {/* PRIMARY CALL TO ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mt-2 w-full max-w-md">
          <button 
            onClick={() => onStart('login')}
            className="btn-primary text-xs sm:text-sm px-6 py-3.5 shadow-lg shadow-indigo-500/25 w-full sm:w-auto flex items-center justify-center gap-2 font-bold"
          >
            <Bot className="h-4 w-4" />
            <span>Launch Web AI Assistant</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button 
            onClick={() => handleQuickLogin('STU001', 'PARENT', 'whatsapp-bot')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10"
          >
            <MessageSquare className="h-4 w-4 text-emerald-400" />
            <span>Try WhatsApp Demo (Parents)</span>
          </button>
        </div>

      </div>

      {/* 2. CONSTRUCTIVE USE-CASE BREAKDOWN: STUDENTS VS PARENTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full text-left">
        
        {/* STUDENT CARD */}
        <div className="glass-card p-6 sm:p-7 rounded-3xl border border-indigo-500/20 flex flex-col justify-between gap-6 hover:border-indigo-500/40 transition-all relative overflow-hidden group shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all"></div>
          
          <div className="flex flex-col gap-4 relative z-10">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 font-mono text-[10px] font-bold border border-indigo-500/20">
                Web Portal & AI Calculators
              </span>
            </div>

            <div>
              <h3 className="font-display font-extrabold text-xl text-white">
                For Students
              </h3>
              <p className="text-xs text-slate-300 mt-1 font-medium leading-relaxed">
                Smart tools to plan attendance, project grade targets, and get instant answers without digging through ERP tables.
              </p>
            </div>

            <ul className="flex flex-col gap-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">Leave Capacity Engine:</strong> Know exactly how many classes you can skip while maintaining 75% attendance.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">Marks Target Calculator:</strong> Calculate required end-sem scores for S/A grades.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">Timetable & Fee Tracking:</strong> Real-time alerts for upcoming exams and pending payments.</span>
              </li>
            </ul>
          </div>

          <button 
            onClick={() => onStart('login')}
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5 relative z-10"
          >
            <span>Explore Student Dashboard</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* PARENT CARD (SPECIAL FOCUS ON WHATSAPP) */}
        <div className="glass-card p-6 sm:p-7 rounded-3xl border border-emerald-500/20 flex flex-col justify-between gap-6 hover:border-emerald-500/40 transition-all relative overflow-hidden group shadow-xl bg-gradient-to-b from-emerald-950/20 to-transparent">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
          
          <div className="flex flex-col gap-4 relative z-10">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold">
                <MessageSquare className="h-5 w-5" />
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> WhatsApp Bot & Voice Notes
              </span>
            </div>

            <div>
              <h3 className="font-display font-extrabold text-xl text-white flex items-center gap-2">
                For Parents
                <span className="text-xs font-normal text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Specially via WhatsApp</span>
              </h3>
              <p className="text-xs text-slate-300 mt-1 font-medium leading-relaxed">
                Parents shouldn't need technical skills or complex logins. Get real-time updates directly on WhatsApp using voice or simple text.
              </p>
            </div>

            <ul className="flex flex-col gap-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">🎙️ Send Voice Notes:</strong> Parents can hold the WhatsApp mic and ask in their own voice: <em>"Aarav's attendance status?"</em></span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">🚫 Zero Portal Logins:</strong> No app downloads, no forgotten passwords, and no navigating desktop ERPs.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">🔒 Instant Verified ERP Data:</strong> Verified WhatsApp bot responds directly with live database records.</span>
              </li>
            </ul>
          </div>

          <button 
            onClick={() => handleQuickLogin('STU001', 'PARENT', 'whatsapp-bot')}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5 relative z-10"
          >
            <span>Simulate Parent WhatsApp Bot</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

      </div>

      {/* 3. MINIMAL SPOTLIGHT: WHY WHATSAPP FOR PARENTS? */}
      <div className="w-full glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 text-left flex flex-col gap-5 shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-emerald-400 font-display font-extrabold text-sm uppercase tracking-wider">
            <Smartphone className="h-4 w-4" />
            <span>Why WhatsApp Integration for Non-Tech Savvy Parents?</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Zero Learning Curve Access</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          
          <div className="flex flex-col gap-2 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xs">
              <Lock className="h-4 w-4" />
            </div>
            <h4 className="font-bold text-xs text-white">No Forgotten Passwords</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Parents rarely remember ERP credentials. WhatsApp uses phone number authentication natively — hassle free.
            </p>
          </div>

          <div className="flex flex-col gap-2 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs">
              <Mic className="h-4 w-4" />
            </div>
            <h4 className="font-bold text-xs text-white">Voice Note AI Transcription</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Parents don't even need to type. Just record a voice note in natural speech; Groq Whisper transcribes and fetches ERP data instantly.
            </p>
          </div>

          <div className="flex flex-col gap-2 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-xs">
              <Zap className="h-4 w-4" />
            </div>
            <h4 className="font-bold text-xs text-white">App They Already Use Daily</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              No need to install new mobile apps or open desktop web portals. Everything happens inside WhatsApp.
            </p>
          </div>

        </div>
      </div>

      {/* 4. HACKATHON 1-CLICK DEMO PERSONA SIGN IN */}
      <div className="w-full glass-card p-6 rounded-3xl border border-indigo-500/20 max-w-4xl mx-auto flex flex-col gap-5 text-left shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
          <div className="flex items-center gap-2 text-indigo-400 font-display font-bold text-xs">
            <ShieldCheck className="h-4 w-4" />
            <span>Hackathon Instant Persona Demo (1-Click Test)</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Select a Student or Parent persona to test live</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* STUDENT 1: AARAV */}
          <div 
            onClick={() => handleQuickLogin('STU001', 'STUDENT', 'dashboard')}
            className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-all flex flex-col justify-between gap-2 group"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white group-hover:text-indigo-400 transition-colors">Aarav Sharma</span>
                <span className="text-[10px] text-emerald-400 font-bold">88% Att.</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">Student • High Attendance</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-800/80 pt-2 text-[10px]">
              <span className="text-slate-400">Role: <strong className="text-indigo-300 font-medium">Student Portal</strong></span>
              <span className="font-bold text-indigo-400 flex items-center gap-0.5">Test <ArrowRight className="h-3 w-3" /></span>
            </div>
          </div>

          {/* PARENT 1: RAJESH (AARAV'S FATHER) */}
          <div 
            onClick={() => handleQuickLogin('STU001', 'PARENT', 'whatsapp-bot')}
            className="p-3.5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 hover:border-emerald-500/60 cursor-pointer transition-all flex flex-col justify-between gap-2 group"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white group-hover:text-emerald-400 transition-colors">Rajesh Sharma</span>
                <span className="text-[10px] text-emerald-400 font-bold font-mono">WhatsApp</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">Parent of Aarav Sharma</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-800/80 pt-2 text-[10px]">
              <span className="text-slate-400">Role: <strong className="text-emerald-300 font-medium">Parent WA Bot</strong></span>
              <span className="font-bold text-emerald-400 flex items-center gap-0.5">Test <ArrowRight className="h-3 w-3" /></span>
            </div>
          </div>

          {/* STUDENT 2: ROHAN (LOW ATTENDANCE & PENDING FEE) */}
          <div 
            onClick={() => handleQuickLogin('STU003', 'STUDENT', 'dashboard')}
            className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition-all flex flex-col justify-between gap-2 group"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white group-hover:text-indigo-400 transition-colors">Rohan Das</span>
                <span className="text-[10px] text-red-400 font-bold">68% Att.</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">Student • Low Att. & Pending Fee</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-800/80 pt-2 text-[10px]">
              <span className="text-slate-400">Role: <strong className="text-indigo-300 font-medium">Student Portal</strong></span>
              <span className="font-bold text-indigo-400 flex items-center gap-0.5">Test <ArrowRight className="h-3 w-3" /></span>
            </div>
          </div>

          {/* PARENT 2: ALOK DAS (ROHAN'S FATHER) */}
          <div 
            onClick={() => handleQuickLogin('STU003', 'PARENT', 'whatsapp-bot')}
            className="p-3.5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 hover:border-emerald-500/60 cursor-pointer transition-all flex flex-col justify-between gap-2 group"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white group-hover:text-emerald-400 transition-colors">Alok Das</span>
                <span className="text-[10px] text-emerald-400 font-bold font-mono">WhatsApp</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">Parent of Rohan Das</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-800/80 pt-2 text-[10px]">
              <span className="text-slate-400">Role: <strong className="text-emerald-300 font-medium">Parent WA Bot</strong></span>
              <span className="font-bold text-emerald-400 flex items-center gap-0.5">Test <ArrowRight className="h-3 w-3" /></span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

