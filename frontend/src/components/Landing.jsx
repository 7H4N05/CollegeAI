import React, { useState } from 'react';
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
  Bot,
  MessageSquare,
  Activity,
  Layers
} from 'lucide-react';
import { api } from '../services/api';

export default function Landing({ onStart }) {
  const [activeDemoQuery, setActiveDemoQuery] = useState("What is my current attendance?");
  const [demoReply, setDemoReply] = useState(
    "Hello Aarav! Your overall attendance is 88.0% across 5 subjects. You are currently in the Safe Zone (+13% above the mandatory 75% threshold)."
  );

  const demoQueries = [
    {
      q: "What is my current attendance?",
      a: "Hello Aarav! Your overall attendance is 88.0% across 5 subjects. You are in the Safe Zone (+13% above 75%)."
    },
    {
      q: "How many classes can I miss while maintaining 75%?",
      a: "You can safely miss up to 4 classes without dropping below the 75% attendance threshold."
    },
    {
      q: "If I take 3 days leave next week, which subjects drop?",
      a: "If you take leave Mon to Wed next week, Operating Systems will drop to 73.1% (FALLS BELOW 75% THRESHOLD)."
    },
    {
      q: "What marks do I need in end-sem for Grade S (90+)?",
      a: "Your internal total is 46/50. You need at least 88/100 in the final 100-mark written exam to secure Grade S."
    }
  ];

  const handleDemoSelect = (item) => {
    setActiveDemoQuery(item.q);
    setDemoReply(item.a);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center py-6 gap-16 max-w-5xl mx-auto w-full animate-fade-in relative">
      
      {/* Ambient Glow Backdrops */}
      <div className="ambient-glow -top-20 -left-20"></div>
      <div className="ambient-glow top-1/2 -right-20"></div>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto gap-6 mt-4 relative z-10">
        
        <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-display font-bold text-xs border border-indigo-500/20 shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
          <span>Hackathon Prototype Showcase • CollegeAI Engine</span>
        </div>

        <h1 className="font-display font-extrabold text-4xl sm:text-6xl tracking-tight text-slate-900 dark:text-white leading-[1.15] text-center">
          Your Intelligent <br />
          <span className="text-gradient-indigo">AI College Companion</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed font-normal text-center">
          CollegeAI combines identity permissions with real college data and deterministic math solvers to deliver instant academic intelligence for <span className="font-semibold text-slate-900 dark:text-white">students & parents</span>.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-2">
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
        <div className="flex flex-wrap items-center justify-center gap-6 mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
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

      {/* STATISTICS COUNTER BAR */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-4xl mx-auto relative z-10">
        <div className="glass-card p-4 flex flex-col items-center justify-center text-center">
          <span className="font-display font-extrabold text-2xl text-gradient-indigo">100%</span>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">Deterministic Accuracy</span>
        </div>
        <div className="glass-card p-4 flex flex-col items-center justify-center text-center">
          <span className="font-display font-extrabold text-2xl text-gradient-indigo">10</span>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">Pre-loaded Student Personas</span>
        </div>
        <div className="glass-card p-4 flex flex-col items-center justify-center text-center">
          <span className="font-display font-extrabold text-2xl text-gradient-indigo">0</span>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">Math Hallucinations</span>
        </div>
        <div className="glass-card p-4 flex flex-col items-center justify-center text-center">
          <span className="font-display font-extrabold text-2xl text-gradient-indigo">REST</span>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">WhatsApp Ready API</span>
        </div>
      </section>

      {/* INTERACTIVE DEMO PREVIEW SWITCHER */}
      <section className="glass-card p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 max-w-4xl mx-auto w-full relative z-10">
        <div className="flex flex-col gap-6 text-left">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-teal-500/10 text-teal-600 dark:text-teal-400 font-display font-semibold text-xs border border-teal-500/20 mb-1">
                <Zap className="h-3.5 w-3.5" />
                <span>Interactive Chatbot Simulator</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-white">
                Try Sample Queries in Real Time
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 w-fit">
              Persona: Aarav Sharma (STU001)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Query Selector Buttons */}
            <div className="md:col-span-5 flex flex-col gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Click a sample prompt:</span>
              {demoQueries.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDemoSelect(item)}
                  className={`p-3 rounded-xl text-xs text-left font-medium transition-all flex items-center justify-between ${
                    activeDemoQuery === item.q
                      ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-500/20'
                      : 'bg-slate-100/70 dark:bg-slate-900/70 text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800/70'
                  }`}
                >
                  <span className="line-clamp-1">"{item.q}"</span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 ml-2" />
                </button>
              ))}
            </div>

            {/* Chat Response Box */}
            <div className="md:col-span-7 bg-slate-900 p-5 rounded-2xl border border-slate-800 font-sans shadow-2xl flex flex-col justify-between gap-4">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-display font-bold text-xs">
                  CA
                </div>
                <div>
                  <p className="text-xs font-bold text-white">CollegeAI Engine Output</p>
                  <span className="text-[10px] text-teal-400 font-semibold">Verified Deterministic Query</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 text-xs">
                <div className="bg-slate-800 text-slate-200 p-2.5 rounded-xl rounded-tl-none max-w-[85%] self-start">
                  "{activeDemoQuery}"
                </div>
                <div className="bg-indigo-600 text-white p-3 rounded-xl rounded-tr-none max-w-[90%] self-end shadow-md flex flex-col gap-1.5">
                  <p className="text-xs font-medium leading-relaxed">{demoReply}</p>
                </div>
              </div>

              <button 
                onClick={() => onStart('login')}
                className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 underline self-end"
              >
                Launch full portal & chat →
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto w-full gap-6 relative z-10">
        <div className="flex flex-col items-center justify-center text-center gap-1">
          <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Core System Capabilities</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Everything accessible via conversational chat and interactive visual cards</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
          
          <div className="glass-card p-6 flex flex-col items-center text-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Percent className="h-5 w-5" />
            </div>
            <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">Leave Capacity</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
              Calculate exact leave limits before hitting the 75% attendance threshold.
            </p>
          </div>

          <div className="glass-card p-6 flex flex-col items-center text-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Award className="h-5 w-5" />
            </div>
            <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">Target Grade Matrix</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
              Compute exact marks needed in end-semester exams for your CGPA goal.
            </p>
          </div>

          <div className="glass-card p-6 flex flex-col items-center text-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Calendar className="h-5 w-5" />
            </div>
            <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">Exams & Timetables</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
              Instant schedules, test portions, room numbers, and homework due dates.
            </p>
          </div>

          <div className="glass-card p-6 flex flex-col items-center text-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Bot className="h-5 w-5" />
            </div>
            <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">Parent Safety Guard</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
              Empowers parents to monitor attendance alerts and fee balances for authorized children.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
