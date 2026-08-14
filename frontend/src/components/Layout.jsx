import React, { useState } from 'react';
import { 
  GraduationCap, 
  Bot, 
  User, 
  Shield, 
  LogOut, 
  Sparkles,
  Users,
  MessageSquare,
  Sliders,
  X
} from 'lucide-react';
import { api } from '../services/api';

export default function Layout({ 
  children, 
  currentUser, 
  currentStudentId, 
  onLogout, 
  onLoginBypass, 
  currentView, 
  setCurrentView
}) {
  const [demoConsoleOpen, setDemoConsoleOpen] = useState(false);

  const mockStudentsList = api.getMockStudents();

  // Persona switching handler
  const handlePersonaSwitch = async (studentId, role) => {
    try {
      const student = mockStudentsList.find(s => s.id === studentId);
      if (!student) return;
      
      let username = student.roll_number;
      if (role === 'PARENT') {
        const parent = api.getMockParents().find(p => p.student_id === studentId);
        username = parent ? parent.name : 'parent';
      }

      const session = await api.login(role, username, 'password', studentId);
      onLoginBypass(session.user, session.student_id);
      
      if (role === 'ADMIN') {
        setCurrentView('admin-dashboard');
      } else {
        setCurrentView('dashboard');
      }
      setDemoConsoleOpen(false);
    } catch (err) {
      console.error("Failed to switch persona", err);
    }
  };

  const handleAdminSwitch = async () => {
    try {
      const session = await api.login('ADMIN', 'admin', 'password');
      onLoginBypass(session.user, null);
      setCurrentView('admin-dashboard');
      setDemoConsoleOpen(false);
    } catch (err) {
      console.error("Failed to switch to Admin", err);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#070a12] text-slate-100 transition-colors duration-300">
      
      {/* MINIMAL TOP NAVBAR */}
      <header className="w-full sticky top-0 z-30 glass-header h-16 px-4 sm:px-8 flex items-center justify-between border-b border-slate-800/80">
        
        {/* LOGO & TITLE */}
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setCurrentView(currentUser ? 'dashboard' : 'landing')}
        >
          <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20 shrink-0">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-display font-extrabold text-xl text-white leading-none">
              College<span className="text-indigo-400">AI</span>
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-mono text-[10px] font-bold border border-indigo-500/20">
              ERP Voice & Chat Bridge
            </span>
          </div>
        </div>

        {/* MINIMAL CENTER MODE TOGGLE (ONLY THE CHATBOT & WHATSAPP) */}
        {currentUser && currentUser.role !== 'ADMIN' && (
          <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentView === 'dashboard'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bot className="h-3.5 w-3.5" />
              <span>AI Chatbot</span>
            </button>

            <button
              onClick={() => setCurrentView('whatsapp-bot')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentView === 'whatsapp-bot'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />
              <span>WhatsApp Bot</span>
            </button>
          </div>
        )}

        {/* HEADER ACTIONS */}
        <div className="flex items-center gap-3">
          
          {/* Persona Switcher Quick Pill */}
          {currentUser && (
            <button
              onClick={() => setDemoConsoleOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Persona: {currentUser.name.split(' ')[0]}</span>
            </button>
          )}

          {/* User Sign Out */}
          {currentUser ? (
            <button
              onClick={onLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => setCurrentView('login')}
              className="btn-primary text-xs px-5 py-2 shadow-md shadow-indigo-500/20"
            >
              Sign In
            </button>
          )}

        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="w-full flex-grow p-4 sm:p-6 max-w-6xl mx-auto flex flex-col items-center justify-start">
        {children}
      </main>

      {/* MINIMAL FOOTER */}
      <footer className="w-full px-6 py-3 border-t border-slate-800/80 text-center text-xs text-slate-400 flex flex-col sm:flex-row justify-between items-center gap-2 max-w-6xl mx-auto">
        <span>© 2026 CollegeAI Assistant • Fetching ERP Data on Demand</span>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/20 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> ERP Sync Ready
          </span>
        </div>
      </footer>

      {/* FLOATING DEMO CONSOLE (Persona Switcher) */}
      <div className="demo-console-fab">
        {!demoConsoleOpen ? (
          <button
            onClick={() => setDemoConsoleOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-4 py-2 rounded-full shadow-xl font-display text-xs font-bold hover:scale-105 transition-all border border-indigo-400/30"
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>Demo Personas</span>
          </button>
        ) : (
          <div className="glass-card w-80 p-4 border border-indigo-500/30 shadow-2xl flex flex-col gap-4 animate-fade-in max-h-[85vh] overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2 text-indigo-400">
                <Sliders className="h-4 w-4" />
                <span className="font-display font-bold text-xs text-white">Demo Persona Switcher</span>
              </div>
              <button 
                onClick={() => setDemoConsoleOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col gap-2 overflow-y-auto max-h-[60vh] pr-1">
              <button
                onClick={handleAdminSwitch}
                className="w-full flex items-center justify-between text-xs font-bold text-purple-400 bg-purple-500/10 p-2.5 rounded-xl border border-purple-500/20 hover:bg-purple-500/20 transition-all"
              >
                <span className="flex items-center gap-1.5"><Shield className="h-4 w-4" /> System Administrator</span>
                <span className="text-[10px]">Admin</span>
              </button>

              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Student & Parent Personas</span>

              {[
                { id: 'STU001', name: 'Aarav Sharma', att: '88%', status: 'Safe', color: 'text-emerald-500', desc: 'High attendance, fees paid' },
                { id: 'STU002', name: 'Sneha Patel', att: '76%', status: 'Borderline', color: 'text-amber-500', desc: '1 assignment pending' },
                { id: 'STU003', name: 'Rohan Das', att: '68%', status: 'Warning', color: 'text-red-500', desc: 'Low att., ₹25k pending fee' },
                { id: 'STU004', name: 'Priya Nair', att: '82%', status: 'Safe', color: 'text-emerald-500', desc: 'High GPA, ₹15k fee due' },
                { id: 'STU005', name: 'Aditya Verma', att: '80%', status: 'Safe', color: 'text-emerald-500', desc: '2 upcoming exams' },
                { id: 'STU006', name: 'Ananya Iyer', att: '74%', status: 'Warning', color: 'text-red-500', desc: 'Below 75% threshold' }
              ].map((p) => (
                <div key={p.id} className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/50 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-white">{p.name}</span>
                    <span className={`text-[10px] ${p.color}`}>{p.att} ({p.status})</span>
                  </div>
                  <p className="text-[10px] text-slate-400">{p.desc}</p>
                  <div className="flex gap-2 mt-0.5">
                    <button
                      onClick={() => handlePersonaSwitch(p.id, 'STUDENT')}
                      className="flex-1 py-1 rounded-lg text-[10px] font-bold bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-all flex items-center justify-center gap-1"
                    >
                      <User className="h-3 w-3" /> Student
                    </button>
                    <button
                      onClick={() => handlePersonaSwitch(p.id, 'PARENT')}
                      className="flex-1 py-1 rounded-lg text-[10px] font-bold bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-all flex items-center justify-center gap-1"
                    >
                      <Users className="h-3 w-3" /> Parent
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
