import React from 'react';
import { 
  GraduationCap, 
  MessageSquare, 
  Calendar, 
  Percent, 
  Bell, 
  ShieldAlert, 
  Calculator,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

export default function Landing({ onStart }) {
  return (
    <div className="flex flex-col gap-12 py-6 animate-fade-in">
      
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto flex flex-col items-center gap-6 mt-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 font-display font-semibold text-xs border border-teal-500/20">
          <GraduationCap className="h-4 w-4" />
          <span>Polished Hackathon Demo Showcase</span>
        </div>
        
        <h1 className="font-display font-extrabold text-4xl sm:text-6xl tracking-tight leading-none text-slate-900 dark:text-white">
          Your Personalized <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-600 dark:from-teal-400 dark:to-blue-500">AI College Companion</span>
        </h1>
        
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          CollegeAI combines role-based identity permissions with real college data and deterministic math calculators to deliver accurate, conversational academic intelligence.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          <button 
            onClick={() => onStart('login')}
            className="btn-primary px-8 py-3 text-base"
          >
            Enter Demo Portals <ArrowRight className="h-5 w-5" />
          </button>
          <a
            href="https://github.com/7H4N05/CollegeAI"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary px-8 py-3 text-base text-slate-700 dark:text-slate-200"
          >
            View Code Repository
          </a>
        </div>
      </section>

      {/* WhatsApp Feature Highlight */}
      <section className="glass-panel rounded-2xl p-8 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 max-w-4xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          <div className="md:col-span-6 flex flex-col gap-4">
            <h2 className="text-2xl sm:text-3xl font-display font-bold">Future WhatsApp Assistant Integration</h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              While we show a web interface for the hackathon presentation, the backend uses an API-first design. The exact same business logic and AI agents will power a WhatsApp bot for parents and students.
            </p>
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <div className="h-2 w-2 rounded-full bg-teal-500"></div>
                <span>Role-based child authorization validation</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <div className="h-2 w-2 rounded-full bg-teal-500"></div>
                <span>Timetable-aware leave capacity projections</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <div className="h-2 w-2 rounded-full bg-teal-500"></div>
                <span>Deterministic calculators (no LLM hallucination)</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-6 bg-slate-100 dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800 font-sans relative overflow-hidden flex flex-col gap-4 min-h-[220px]">
            {/* Header of WhatsApp Mock */}
            <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-850 pb-3">
              <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-display font-bold text-sm">
                CA
              </div>
              <div>
                <p className="text-xs font-bold text-slate-950 dark:text-white">CollegeAI Chatbot</p>
                <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold">Verified Business</span>
              </div>
            </div>

            {/* Chats bubbles */}
            <div className="flex flex-col gap-3">
              <div className="bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs py-2 px-3 rounded-lg rounded-tl-none max-w-[85%] self-start leading-tight">
                "If I take 3 days leave next week, which subjects will fall below 75%?"
              </div>
              
              <div className="bg-teal-650 text-white dark:bg-teal-900 text-xs py-2.5 px-3 rounded-lg rounded-tr-none max-w-[85%] self-end leading-tight shadow-md flex flex-col gap-2">
                <p>If you take leave next Monday to Wednesday, you will miss 3 lectures.</p>
                <div className="p-2 bg-black/10 rounded border border-white/10 flex flex-col gap-1 text-[10px]">
                  <p className="font-bold">⚠️ Subject Projection Alert:</p>
                  <p>• Operating Systems: Drops to 73.1% (FALLS BELOW 75%)</p>
                  <p>• Data Structures: Drops to 80.0% (Safe)</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="flex flex-col gap-6">
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-center">Interactive Capabilities</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Attendance Projections */}
          <div className="glass-panel p-6 rounded-xl flex flex-col gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Percent className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold">Leave Calculations</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Calculate exact leave capacity and project how upcoming leave dates impact your subject percentages.
            </p>
          </div>

          {/* Card 2: Exams & Assignments */}
          <div className="glass-panel p-6 rounded-xl flex flex-col gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Calendar className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold">Deadlines & Timetables</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Get instant updates on exam dates, portions, pending homework, and custom room allocations.
            </p>
          </div>

          {/* Card 3: Grade Calculator */}
          <div className="glass-panel p-6 rounded-xl flex flex-col gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Calculator className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold">Target Grade Matrix</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Compute the precise marks required in end-semester examinations to secure your target CGPA grade.
            </p>
          </div>

          {/* Card 4: Parent Alerts */}
          <div className="glass-panel p-6 rounded-xl flex flex-col gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold">Parental Safety Guard</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Provides authorized parents secure access to view child alerts, fees balances, and exam attendance.
            </p>
          </div>

        </div>
      </section>

      {/* Developer Context Section */}
      <section className="bg-slate-200/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col gap-4 text-center max-w-2xl mx-auto w-full">
        <h3 className="text-sm font-semibold tracking-wider text-teal-600 dark:text-teal-400 uppercase font-display">
          Hackathon Demo Instruction
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed">
          Open the floating **Demo Console** in the bottom-right corner at any time to instantly bypass authentication and login as preset student personas (with attendance under 75%, pending fees, etc.).
        </p>
      </section>

    </div>
  );
}
