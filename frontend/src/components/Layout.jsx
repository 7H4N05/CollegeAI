import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  LayoutDashboard, 
  Percent, 
  Award, 
  CheckSquare, 
  Calendar, 
  CreditCard, 
  Bell, 
  Bot, 
  User, 
  Shield, 
  LogOut, 
  Sun, 
  Moon, 
  Search, 
  Sliders, 
  X, 
  Menu, 
  ChevronRight, 
  Sparkles,
  Users,
  CheckCircle2,
  Activity
} from 'lucide-react';
import { api } from '../services/api';

export default function Layout({ 
  children, 
  currentUser, 
  currentStudentId, 
  onLogout, 
  onLoginBypass, 
  currentView, 
  setCurrentView,
  theme,
  setTheme
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoConsoleOpen, setDemoConsoleOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  const studentNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'attendance', label: 'Attendance & Leave Solver', icon: Percent },
    { id: 'academics', label: 'Academics & Grade Matrix', icon: Award },
    { id: 'assignments', label: 'Assignments Tracker', icon: CheckSquare },
    { id: 'exams', label: 'Exam Timetable', icon: Calendar },
    { id: 'fees', label: 'Fees & Financial Dues', icon: CreditCard },
    { id: 'notices', label: 'Campus Notices', icon: Bell },
    { id: 'ai-assistant', label: 'AI Companion', icon: Bot, badge: 'AI' },
    { id: 'profile', label: 'Account Profile', icon: User }
  ];

  const adminNavItems = [
    { id: 'admin-dashboard', label: 'Admin Overview', icon: Shield },
    { id: 'admin-attendance', label: 'Attendance Manager', icon: Percent },
    { id: 'admin-notices', label: 'Broadcast Notices', icon: Bell }
  ];

  const navItems = currentUser?.role === 'ADMIN' ? adminNavItems : studentNavItems;

  const getPageTitle = (view) => {
    switch (view) {
      case 'dashboard': return 'Dashboard Overview';
      case 'attendance': return 'Attendance & Leave Solver';
      case 'academics': return 'Academic Marks & Target CGPA';
      case 'assignments': return 'Assignments Tracker';
      case 'exams': return 'Examination Timetable';
      case 'fees': return 'Fee Statement & Dues';
      case 'notices': return 'Campus Announcements';
      case 'ai-assistant': return 'CollegeAI Companion';
      case 'profile': return 'User Profile Details';
      case 'admin-dashboard': return 'Admin Management Console';
      case 'admin-attendance': return 'Modify Attendance Records';
      case 'admin-notices': return 'Broadcast Campus Notice';
      default: return 'CollegeAI Portal';
    }
  };

  return (
    <div className="w-full min-h-screen flex bg-slate-50 dark:bg-[#070a12] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* LEFT NAVIGATION SIDEBAR (Desktop) */}
      {currentUser && (
        <aside 
          className={`hidden md:flex flex-col glass-sidebar fixed top-0 bottom-0 left-0 z-40 transition-all duration-300 ${
            sidebarOpen ? 'w-64' : 'w-20'
          }`}
        >
          {/* Logo Section */}
          <div className="h-16 px-5 flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80">
            <div 
              className="flex items-center gap-3 cursor-pointer overflow-hidden"
              onClick={() => setCurrentView('dashboard')}
            >
              <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20 shrink-0">
                <GraduationCap className="h-5 w-5" />
              </div>
              {sidebarOpen && (
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-display font-extrabold text-base tracking-tight text-slate-900 dark:text-white leading-none">
                      College<span className="text-indigo-600 dark:text-indigo-400">AI</span>
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold mt-0.5 tracking-wide">Academic Companion</span>
                </div>
              )}
            </div>

            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            >
              <ChevronRight className={`h-4 w-4 transition-transform duration-300 ${sidebarOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Navigation Category Header */}
          {sidebarOpen && (
            <div className="px-5 pt-4 pb-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-display">
                {currentUser?.role === 'ADMIN' ? 'Admin Controls' : 'Main Navigation'}
              </span>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex-grow px-3 py-2 flex flex-col gap-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  title={!sidebarOpen ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-display text-xs font-semibold transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-500/25'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  {sidebarOpen && <span className="truncate">{item.label}</span>}
                  
                  {item.badge && sidebarOpen && (
                    <span className={`ml-auto text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer User Info */}
          <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/80">
            <div className={`p-2 rounded-xl flex items-center justify-between ${sidebarOpen ? 'bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50' : ''}`}>
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                  {currentUser.name[0]}
                </div>
                {sidebarOpen && (
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{currentUser.name}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{currentUser.role} {currentStudentId && `• ${currentStudentId}`}</span>
                  </div>
                )}
              </div>

              {sidebarOpen && (
                <button
                  onClick={onLogout}
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </aside>
      )}

      {/* MAIN CONTAINER - CENTERING & FULL WIDTH */}
      <div className={`w-full flex-grow flex flex-col items-center min-w-0 transition-all duration-300 ${
        currentUser ? (sidebarOpen ? 'md:ml-64' : 'md:ml-20') : ''
      }`}>
        
        {/* TOP HEADER */}
        <header className="w-full sticky top-0 z-30 glass-header h-16 px-4 sm:px-8 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            {currentUser && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Menu className="h-5 w-5" />
              </button>
            )}

            {!currentUser && (
              <div 
                className="flex items-center gap-2.5 cursor-pointer"
                onClick={() => setCurrentView('landing')}
              >
                <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-extrabold text-xl text-slate-900 dark:text-white leading-none">
                    College<span className="text-indigo-600 dark:text-indigo-400">AI</span>
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
              </div>
            )}

            {currentUser && (
              <div className="flex flex-col">
                <h1 className="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-none">
                  {getPageTitle(currentView)}
                </h1>
                <span className="text-[11px] text-slate-400 font-medium hidden sm:inline-block mt-0.5">
                  Personalized AI Academic Companion
                </span>
              </div>
            )}
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-3">
            
            {/* Global Search Input */}
            {currentUser && (
              <div className="relative hidden lg:flex items-center w-56">
                <input
                  type="text"
                  placeholder="Search portal..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full glass-input text-xs py-1.5 pl-8 pr-3 text-slate-800 dark:text-slate-200"
                />
                <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5" />
              </div>
            )}

            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>

            {/* Persona Switcher Quick Pill */}
            {currentUser && (
              <button
                onClick={() => setDemoConsoleOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Persona: {currentUser.name.split(' ')[0]}</span>
              </button>
            )}

            {!currentUser && (
              <button
                onClick={() => setCurrentView('login')}
                className="btn-primary text-xs px-5 py-2.5 shadow-md shadow-indigo-500/20"
              >
                Sign In
              </button>
            )}

          </div>
        </header>

        {/* MOBILE NAVIGATION DRAWER */}
        {mobileMenuOpen && currentUser && (
          <div className="w-full md:hidden glass-header border-b border-slate-200 dark:border-slate-800 p-4 flex flex-col gap-1 animate-fade-in">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setCurrentView(item.id); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-display text-xs font-semibold ${
                    isActive ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-3 mt-2 flex items-center justify-between">
              <span className="text-xs font-bold">{currentUser.name} ({currentUser.role})</span>
              <button onClick={onLogout} className="text-xs font-bold text-red-500">Sign Out</button>
            </div>
          </div>
        )}

        {/* MAIN BODY CONTENT - CENTERED MAXIMUM WIDTH CONTAINER */}
        <main className="w-full flex-grow p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto flex flex-col items-center justify-start">
          {children}
        </main>

        {/* FOOTER */}
        <footer className="w-full px-6 py-4 border-t border-slate-200/80 dark:border-slate-800/80 text-center text-xs text-slate-400 flex flex-col sm:flex-row justify-between items-center gap-2 max-w-6xl mx-auto">
          <span>© 2026 CollegeAI Hackathon Prototype.</span>
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/20 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Mock API Engine
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono text-[10px] font-bold border border-indigo-500/20">
              WhatsApp Integration Ready
            </span>
          </div>
        </footer>

      </div>

      {/* FLOATING DEMO CONSOLE (Persona Switcher) */}
      <div className="demo-console-fab">
        {!demoConsoleOpen ? (
          <button
            onClick={() => setDemoConsoleOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-4 py-2.5 rounded-full shadow-xl font-display text-xs font-bold hover:scale-105 transition-all border border-indigo-400/30"
          >
            <Sliders className="h-4 w-4" />
            <span>Demo Console</span>
          </button>
        ) : (
          <div className="glass-card w-80 p-4 border border-indigo-500/30 shadow-2xl flex flex-col gap-4 animate-fade-in max-h-[85vh] overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-3">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <Sliders className="h-4 w-4" />
                <span className="font-display font-bold text-xs text-slate-900 dark:text-white">Demo Persona Switcher</span>
              </div>
              <button 
                onClick={() => setDemoConsoleOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col gap-2 overflow-y-auto max-h-[60vh] pr-1">
              <button
                onClick={handleAdminSwitch}
                className="w-full flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 p-2.5 rounded-xl border border-purple-500/20 hover:bg-purple-500/20 transition-all"
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
                <div key={p.id} className="p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-900 dark:text-white">{p.name}</span>
                    <span className={`text-[10px] ${p.color}`}>{p.att} ({p.status})</span>
                  </div>
                  <p className="text-[10px] text-slate-400">{p.desc}</p>
                  <div className="flex gap-2 mt-0.5">
                    <button
                      onClick={() => handlePersonaSwitch(p.id, 'STUDENT')}
                      className="flex-1 py-1 rounded-lg text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 transition-all flex items-center justify-center gap-1"
                    >
                      <User className="h-3 w-3" /> Student
                    </button>
                    <button
                      onClick={() => handlePersonaSwitch(p.id, 'PARENT')}
                      className="flex-1 py-1 rounded-lg text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 transition-all flex items-center justify-center gap-1"
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
