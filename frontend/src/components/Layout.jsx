import React, { useState } from 'react';
import { 
  GraduationCap, 
  MessageSquare, 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  X, 
  Sliders, 
  User, 
  Users, 
  Shield, 
  CornerDownRight 
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoConsoleOpen, setDemoConsoleOpen] = useState(false);
  
  // Get all mock students to show in the switcher
  const mockStudentsList = api.getMockStudents();

  const handlePersonaSwitch = async (studentId, role) => {
    try {
      const student = mockStudentsList.find(s => s.id === studentId);
      if (!student) return;
      
      let username = student.roll_number;
      if (role === 'PARENT') {
        const parent = api.getMockParents().find(p => p.student_id === studentId);
        username = parent ? parent.name : 'parent';
      } else if (role === 'ADMIN') {
        username = 'admin';
      }

      const session = await api.login(role, username, 'password', studentId);
      onLoginBypass(session.user, session.student_id);
      
      // Auto-navigate to dashboard or chat
      if (role === 'ADMIN') {
        setCurrentView('admin');
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
      setCurrentView('admin');
      setDemoConsoleOpen(false);
    } catch (err) {
      console.error("Failed to switch to Admin", err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      
      {/* Header */}
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setCurrentView('landing')}
          >
            <div className="p-2 bg-teal-600 rounded-lg text-white">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <span className="font-display font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                College<span className="text-teal-600 dark:text-teal-400">AI</span>
              </span>
              <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-bold bg-amber-500/10 text-amber-600 rounded-md border border-amber-500/20">
                PROTOTYPE
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          {currentUser && (
            <nav className="hidden md:flex items-center gap-6">
              {currentUser.role !== 'ADMIN' && (
                <>
                  <button
                    onClick={() => setCurrentView('dashboard')}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-md font-medium text-sm transition-all ${
                      currentView === 'dashboard'
                        ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/30'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </button>
                  <button
                    onClick={() => setCurrentView('chat')}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-md font-medium text-sm transition-all ${
                      currentView === 'chat'
                        ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/30'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <MessageSquare className="h-4 w-4" />
                    Chat with AI
                  </button>
                </>
              )}
              {currentUser.role === 'ADMIN' && (
                <button
                  onClick={() => setCurrentView('admin')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-md font-medium text-sm transition-all ${
                    currentView === 'admin'
                      ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/30'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Shield className="h-4 w-4" />
                  Admin Console
                </button>
              )}
            </nav>
          )}

          {/* Right: Auth Profile Section */}
          <div className="hidden md:flex items-center gap-4">
            {currentUser ? (
              <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-800 pl-4">
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
                    {currentUser.name}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    {currentUser.role} {currentStudentId && `• ID: ${currentStudentId}`}
                  </p>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentView('login')}
                className="btn-primary text-sm px-4 py-2"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {currentUser && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            )}
            {!currentUser && (
              <button
                onClick={() => setCurrentView('login')}
                className="btn-primary text-xs px-3 py-1.5"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && currentUser && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 flex flex-col gap-2">
            {currentUser.role !== 'ADMIN' && (
              <>
                <button
                  onClick={() => { setCurrentView('dashboard'); setMobileMenuOpen(false); }}
                  className="flex items-center gap-2 px-3 py-2 rounded-md font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-left"
                >
                  <LayoutDashboard className="h-5 w-5 text-slate-500" />
                  Dashboard
                </button>
                <button
                  onClick={() => { setCurrentView('chat'); setMobileMenuOpen(false); }}
                  className="flex items-center gap-2 px-3 py-2 rounded-md font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-left"
                >
                  <MessageSquare className="h-5 w-5 text-slate-500" />
                  Chat with AI
                </button>
              </>
            )}
            {currentUser.role === 'ADMIN' && (
              <button
                onClick={() => { setCurrentView('admin'); setMobileMenuOpen(false); }}
                className="flex items-center gap-2 px-3 py-2 rounded-md font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-left"
              >
                <Shield className="h-5 w-5 text-slate-500" />
                Admin Console
              </button>
            )}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 mt-1 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{currentUser.name}</p>
                <p className="text-xs text-slate-500">{currentUser.role}</p>
              </div>
              <button
                onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-md text-red-500 font-semibold hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-6 text-center text-slate-500 dark:text-slate-400 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 CollegeAI Hackathon Prototype. Developed by Team Member 2.</p>
          <div className="flex gap-4">
            <span className="px-2 py-1 bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 font-bold rounded border border-teal-500/10">
              Mock Mode: Active
            </span>
            <span className="px-2 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold rounded border border-indigo-500/10">
              Future WhatsApp Hook Ready
            </span>
          </div>
        </div>
      </footer>

      {/* Floating Demo Console (Personas Switcher) */}
      <div className="demo-floating-console">
        {!demoConsoleOpen ? (
          <button
            onClick={() => setDemoConsoleOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-4 py-2.5 rounded-lg shadow-lg font-display text-sm font-semibold hover:brightness-110 transition-all border border-teal-500"
          >
            <Sliders className="h-4 w-4" />
            <span>Demo Console</span>
          </button>
        ) : (
          <div className="glass-panel w-80 bg-white dark:bg-slate-900 border border-teal-500/30 rounded-xl overflow-hidden shadow-2xl flex flex-col animate-fade-in max-h-[85vh]">
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-600 to-indigo-700 p-3 text-white flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sliders className="h-4.5 w-4.5" />
                <span className="font-display font-bold text-sm">CollegeAI Demo Panel</span>
              </div>
              <button 
                onClick={() => setDemoConsoleOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-4 flex flex-col gap-3.5 overflow-y-auto">
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  System Roles
                </p>
                <button
                  onClick={handleAdminSwitch}
                  className="w-full flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 p-2 rounded-lg border border-indigo-200 dark:border-indigo-900 hover:brightness-105 transition-all"
                >
                  <span className="flex items-center gap-1"><Shield className="h-3.5 w-3.5" /> Login as Admin</span>
                  <span>Manage Data</span>
                </button>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Student/Parent Personas
                </p>
                <div className="flex flex-col gap-2 max-h-[40vh] overflow-y-auto pr-1">
                  
                  {/* Persona 1: Aarav Sharma */}
                  <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 hover:border-teal-500/50 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Aarav Sharma</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-extrabold bg-green-500/10 text-green-500">
                        88% Attendance
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mb-2">
                      Perfect student. Dues cleared. No critical warnings.
                    </p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handlePersonaSwitch('STU001', 'STUDENT')}
                        className="flex-1 flex items-center justify-center gap-0.5 text-[10px] font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400 hover:bg-teal-500/25 p-1 rounded transition-colors"
                      >
                        <User className="h-2.5 w-2.5" /> Student
                      </button>
                      <button 
                        onClick={() => handlePersonaSwitch('STU001', 'PARENT')}
                        className="flex-1 flex items-center justify-center gap-0.5 text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/25 p-1 rounded transition-colors"
                      >
                        <Users className="h-2.5 w-2.5" /> Parent
                      </button>
                    </div>
                  </div>

                  {/* Persona 2: Sneha Patel */}
                  <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 hover:border-teal-500/50 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Sneha Patel</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-extrabold bg-amber-500/10 text-amber-500">
                        76% Attendance
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mb-2">
                      Borderline student. 1 pending assignment.
                    </p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handlePersonaSwitch('STU002', 'STUDENT')}
                        className="flex-1 flex items-center justify-center gap-0.5 text-[10px] font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400 hover:bg-teal-500/25 p-1 rounded transition-colors"
                      >
                        <User className="h-2.5 w-2.5" /> Student
                      </button>
                      <button 
                        onClick={() => handlePersonaSwitch('STU002', 'PARENT')}
                        className="flex-1 flex items-center justify-center gap-0.5 text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/25 p-1 rounded transition-colors"
                      >
                        <Users className="h-2.5 w-2.5" /> Parent
                      </button>
                    </div>
                  </div>

                  {/* Persona 3: Rohan Das */}
                  <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 hover:border-teal-500/50 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Rohan Das</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-extrabold bg-red-500/10 text-red-500">
                        68% Attendance
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mb-2">
                      Critical low attendance. ₹25,000 pending fee.
                    </p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handlePersonaSwitch('STU003', 'STUDENT')}
                        className="flex-1 flex items-center justify-center gap-0.5 text-[10px] font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400 hover:bg-teal-500/25 p-1 rounded transition-colors"
                      >
                        <User className="h-2.5 w-2.5" /> Student
                      </button>
                      <button 
                        onClick={() => handlePersonaSwitch('STU003', 'PARENT')}
                        className="flex-1 flex items-center justify-center gap-0.5 text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/25 p-1 rounded transition-colors"
                      >
                        <Users className="h-2.5 w-2.5" /> Parent
                      </button>
                    </div>
                  </div>

                  {/* Persona 4: Priya Nair */}
                  <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 hover:border-teal-500/50 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Priya Nair</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-extrabold bg-teal-500/10 text-teal-500">
                        82% Attendance
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mb-2">
                      High GPA. ₹15,000 pending fee past due date.
                    </p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handlePersonaSwitch('STU004', 'STUDENT')}
                        className="flex-1 flex items-center justify-center gap-0.5 text-[10px] font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400 hover:bg-teal-500/25 p-1 rounded transition-colors"
                      >
                        <User className="h-2.5 w-2.5" /> Student
                      </button>
                      <button 
                        onClick={() => handlePersonaSwitch('STU004', 'PARENT')}
                        className="flex-1 flex items-center justify-center gap-0.5 text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/25 p-1 rounded transition-colors"
                      >
                        <Users className="h-2.5 w-2.5" /> Parent
                      </button>
                    </div>
                  </div>

                  {/* Persona 5: Aditya Verma */}
                  <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 hover:border-teal-500/50 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Aditya Verma</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-extrabold bg-teal-500/10 text-teal-500">
                        80% Attendance
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mb-2">
                      Has 2 upcoming exams next week.
                    </p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handlePersonaSwitch('STU005', 'STUDENT')}
                        className="flex-1 flex items-center justify-center gap-0.5 text-[10px] font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400 hover:bg-teal-500/25 p-1 rounded transition-colors"
                      >
                        <User className="h-2.5 w-2.5" /> Student
                      </button>
                      <button 
                        onClick={() => handlePersonaSwitch('STU005', 'PARENT')}
                        className="flex-1 flex items-center justify-center gap-0.5 text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/25 p-1 rounded transition-colors"
                      >
                        <Users className="h-2.5 w-2.5" /> Parent
                      </button>
                    </div>
                  </div>

                  {/* Persona 6: Ananya Iyer */}
                  <div className="border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 hover:border-teal-500/50 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Ananya Iyer</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-extrabold bg-red-500/10 text-red-500">
                        74% Attendance
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mb-2">
                      Just below 75% threshold. High GPA.
                    </p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handlePersonaSwitch('STU006', 'STUDENT')}
                        className="flex-1 flex items-center justify-center gap-0.5 text-[10px] font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400 hover:bg-teal-500/25 p-1 rounded transition-colors"
                      >
                        <User className="h-2.5 w-2.5" /> Student
                      </button>
                      <button 
                        onClick={() => handlePersonaSwitch('STU006', 'PARENT')}
                        className="flex-1 flex items-center justify-center gap-0.5 text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/25 p-1 rounded transition-colors"
                      >
                        <Users className="h-2.5 w-2.5" /> Parent
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="bg-slate-50 dark:bg-slate-950 p-2.5 text-center border-t border-slate-100 dark:border-slate-850">
              <span className="text-[9px] font-semibold text-slate-400">
                Click any persona to log in instantly & populate dashboard/chat data.
              </span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
