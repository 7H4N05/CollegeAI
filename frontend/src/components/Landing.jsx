import React from 'react';
import { 
  GraduationCap, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Percent, 
  Award, 
  Calendar, 
  CreditCard,
  Bot
} from 'lucide-react';

export default function Landing({ onStart }) {
  return (
    <div className="flex flex-col gap-16 py-8 animate-fade-in max-w-5xl mx-auto w-full">
      
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto flex flex-col items-center gap-6 mt-4">
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-display font-bold text-xs border border-indigo-500/20 shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
          <span>Hackathon Prototype Showcase</span>
        </div>

        <h1 className="font-display font-extrabold text-4xl sm:text-6xl tracking-tight text-slate-900 dark:text-white leading-tight">
          Your Intelligent <br />
          <span className="text-indigo-600 dark:text-indigo-400">AI College Companion</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed font-normal">
          CollegeAI combines identity permissions with real college data and deterministic math solvers to deliver instant academic intelligence for <span className="font-semibold text-slate-900 dark:text-white">students & parents</span>.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <button 
            onClick={() => onStart('login')}
            className="btn-primary text-sm px-8 py-3.5 shadow-xl shadow-indigo-500/25"
          >
            Launch Companion Portal <ArrowRight className="h-4 w-4" />
          </button>
          <button 
            onClick={() => onStart('login')}
            className="btn-secondary text-sm px-8 py-3.5"
          >
            Explore Personas & Chat
          </button>
        </div>

        {/* Feature Badges */}
        <div className="flex flex-wrap justify-center gap-6 mt-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>Zero LLM Math Hallucination</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-indigo-500" />
            <span>Timetable-Aware Solvers</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-purple-500" />
            <span>Parent Authorization Guard</span>
          </div>
        </div>

      </section>

      {/* WhatsApp Integration Preview Card */}
      <section className="glass-card p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          <div className="md:col-span-6 flex flex-col gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-teal-500/10 text-teal-600 dark:text-teal-400 font-display font-semibold text-xs border border-teal-500/20 w-fit">
              <Zap className="h-3.5 w-3.5" />
              <span>Future WhatsApp Architecture</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white leading-tight">
              API-First Engine Ready for WhatsApp Integration
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              While we show an Apple-style web interface for the presentation, the backend uses an API-first design. The exact same calculation APIs and identity checks will power the WhatsApp Business bot.
            </p>

            <div className="flex flex-col gap-2 mt-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>Role-based student & parent data access controls</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <ShieldCheck className="h-4 w-4 text-indigo-500" />
                <span>Timetable-aware leave capacity calculators</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-6 bg-slate-900 p-5 rounded-2xl border border-slate-800 font-sans shadow-2xl flex flex-col gap-3">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-display font-bold text-xs">
                CA
              </div>
              <div>
                <p className="text-xs font-bold text-white">CollegeAI Chatbot</p>
                <span className="text-[10px] text-teal-400 font-semibold">Verified WhatsApp Webhook</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 text-xs">
              <div className="bg-slate-800 text-slate-200 p-2.5 rounded-xl rounded-tl-none max-w-[85%] self-start">
                "If I take 3 days leave next week, which subjects will fall below 75%?"
              </div>
              <div className="bg-indigo-600 text-white p-3 rounded-xl rounded-tr-none max-w-[90%] self-end shadow-md flex flex-col gap-1.5">
                <p className="text-[11px] font-medium">If you take leave from Mon (Aug 18) to Wed (Aug 20), you miss 9 lectures.</p>
                <div className="p-2 rounded bg-black/20 text-[10px] flex flex-col gap-1">
                  <span className="font-bold text-amber-300">⚠️ Subject Projection Alert:</span>
                  <span>• Operating Systems: Drops to 73.1% (FALLS BELOW 75%)</span>
                  <span>• Data Structures: Drops to 80.0% (Safe)</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-card p-5 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Percent className="h-5 w-5" />
          </div>
          <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">Leave Capacity</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
            Calculate exact leave limits before hitting the 75% attendance threshold.
          </p>
        </div>

        <div className="glass-card p-5 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Award className="h-5 w-5" />
          </div>
          <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">Target Grade Matrix</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
            Compute the exact marks needed in end-semester written exams for your CGPA goal.
          </p>
        </div>

        <div className="glass-card p-5 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <Calendar className="h-5 w-5" />
          </div>
          <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">Exams & Timetables</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
            Instant schedules, test portions, room numbers, and homework due dates.
          </p>
        </div>

        <div className="glass-card p-5 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Bot className="h-5 w-5" />
          </div>
          <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">Parent Safety Guard</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
            Empowers parents to monitor attendance alerts and fee balances for authorized children.
          </p>
        </div>

      </section>

    </div>
  );
}
