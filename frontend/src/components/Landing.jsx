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
  Sparkles,
  Zap,
  CheckCircle2,
  Lock,
  Cpu
} from 'lucide-react';

export default function Landing({ onStart }) {
  return (
    <div className="flex flex-col gap-16 py-8 animate-fade-in relative">
      
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none -z-10 animate-float" />
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none -z-10 animate-float" style={{ animationDelay: '2s' }} />

      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto flex flex-col items-center gap-6 mt-4">
        
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-teal-500/10 text-teal-400 font-display font-semibold text-xs border border-teal-500/30 shadow-lg shadow-teal-500/10 animate-pulse">
          <Sparkles className="h-4 w-4 text-teal-400" />
          <span>Hackathon Prototype & Demo Showcase</span>
        </div>
        
        <h1 className="font-display font-extrabold text-4xl sm:text-7xl tracking-tight leading-tight">
          Your Intelligent <br />
          <span className="text-gradient-teal">AI College Companion</span>
        </h1>
        
        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl leading-relaxed font-normal">
          CollegeAI fuses identity-based authorization with real college data and deterministic math calculators to deliver instant academic intelligence to <span className="text-white font-semibold">students & parents</span>.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <button 
            onClick={() => onStart('login')}
            className="btn-primary text-base px-8 py-3.5 shadow-xl shadow-teal-500/25"
          >
            Launch Demo Portal <ArrowRight className="h-5 w-5" />
          </button>
          <button
            onClick={() => onStart('login')}
            className="btn-secondary text-base px-8 py-3.5"
          >
            Explore Personas & Chat
          </button>
        </div>

        {/* Feature Badges */}
        <div className="flex flex-wrap justify-center gap-6 mt-6 text-xs font-semibold text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-teal-400" />
            <span>Zero LLM Math Hallucination</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-indigo-400" />
            <span>Timetable-Aware Projections</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-purple-400" />
            <span>Parent Authorization Guard</span>
          </div>
        </div>

      </section>

      {/* WhatsApp Feature Showcase Card */}
      <section className="glass-panel-glow rounded-3xl p-8 sm:p-10 border border-teal-500/30 max-w-5xl mx-auto w-full relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-6 flex flex-col gap-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-500/10 text-indigo-400 font-display font-semibold text-xs border border-indigo-500/20 w-fit">
              <Zap className="h-3.5 w-3.5" />
              <span>Future WhatsApp Architecture</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-display font-bold leading-tight">
              API-First Engine Ready for <span className="text-gradient-teal">WhatsApp Webhooks</span>
            </h2>

            <p className="text-slate-300 text-sm leading-relaxed">
              While we present a web demo for judges, the backend business logic and calculation APIs are completely decoupled. The WhatsApp bot will consume the exact same identity, security, and attendance services.
            </p>

            <div className="flex flex-col gap-3 mt-1">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <div className="p-2 rounded-lg bg-teal-500/20 text-teal-400">
                  <Lock className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Authorized Child Data Access</h4>
                  <p className="text-[11px] text-slate-400">Parents can only query their own verified child's records.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                  <Cpu className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Deterministic Backend Solvers</h4>
                  <p className="text-[11px] text-slate-400">Attendance percentages, leave limits & target marks use verified math formulas.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Mock Chat Window */}
          <div className="lg:col-span-6 bg-slate-950/90 p-5 rounded-2xl border border-slate-800 font-sans shadow-2xl relative flex flex-col gap-4">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-600 text-white flex items-center justify-center font-display font-bold text-sm shadow-md">
                  CA
                </div>
                <div>
                  <p className="text-xs font-bold text-white">CollegeAI Assistant</p>
                  <span className="text-[10px] text-teal-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
                    Verified WhatsApp Integration
                  </span>
                </div>
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded-full font-mono">LIVE DEMO</span>
            </div>

            {/* Chat preview bubbles */}
            <div className="flex flex-col gap-3 text-xs">
              <div className="bg-slate-800/90 text-slate-200 py-2.5 px-3.5 rounded-2xl rounded-tl-sm max-w-[88%] self-start border border-slate-700/50">
                "If I take 3 days leave next week, which subjects will fall below 75%?"
              </div>

              <div className="bg-gradient-to-r from-teal-900/90 to-slate-900 text-white py-3 px-4 rounded-2xl rounded-tr-sm max-w-[92%] self-end border border-teal-500/30 shadow-lg flex flex-col gap-2.5">
                <p className="font-medium text-[11px] leading-relaxed">
                  If you take leave from <span className="text-teal-300 font-bold">Mon (Aug 18) to Wed (Aug 20)</span>, you will miss 9 scheduled lectures.
                </p>

                <div className="p-3 rounded-xl bg-black/40 border border-teal-500/20 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-amber-400 flex items-center gap-1">
                      ⚠️ Subject Impact Alert
                    </span>
                    <span className="text-[10px] text-slate-400">Timetable Projection</span>
                  </div>
                  <div className="flex flex-col gap-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-300">• Operating Systems</span>
                      <span className="text-red-400 font-bold">73.1% (FALLS BELOW 75%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">• Data Structures</span>
                      <span className="text-emerald-400 font-bold">80.0% (Safe)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="flex flex-col gap-8 max-w-5xl mx-auto w-full">
        <div className="text-center flex flex-col gap-2">
          <h2 className="text-3xl sm:text-4xl font-display font-bold">Core Capabilities</h2>
          <p className="text-sm text-slate-400">Everything accessible via conversational chat and interactive visual cards</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1 */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 border border-white/10 hover:border-teal-500/40">
            <div className="w-12 h-12 rounded-xl bg-teal-500/15 text-teal-400 flex items-center justify-center border border-teal-500/20">
              <Percent className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Leave Projections</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Determine your exact leave capacity before hitting the 75% attendance threshold.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 border border-white/10 hover:border-indigo-500/40">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Exams & Timetables</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Instant schedules, upcoming test portions, room numbers, and assignment deadlines.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 border border-white/10 hover:border-purple-500/40">
            <div className="w-12 h-12 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <Calculator className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Grade Target Matrix</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Compute the exact marks needed in end-semester exams to reach your target CGPA grade.
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 border border-white/10 hover:border-amber-500/40">
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Parental Safety Guard</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Empowers parents to monitor attendance, fee dues, and warnings for authorized students.
              </p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
