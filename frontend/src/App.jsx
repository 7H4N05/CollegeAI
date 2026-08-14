import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Landing from './components/Landing';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AttendanceView from './components/AttendanceView';
import AcademicsView from './components/AcademicsView';
import AssignmentsView from './components/AssignmentsView';
import ExamsView from './components/ExamsView';
import FeesView from './components/FeesView';
import NoticesView from './components/NoticesView';
import AiAssistantView from './components/AiAssistantView';
import ProfileView from './components/ProfileView';
import AdminDashboard from './components/AdminDashboard';
import WhatsAppSimulator from './components/WhatsAppSimulator';
import { api } from './services/api';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentStudentId, setCurrentStudentId] = useState(null);
  const [currentView, setCurrentView] = useState('landing');
  const [chatPresetQuery, setChatPresetQuery] = useState(null);

  // Helper to generate URL slug from name
  const getSlugForStudent = (name) => {
    if (!name) return 'student';
    return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
  };

  // Helper to synchronize browser URL
  const updateUrlRoute = (view, user, studentId) => {
    if (view === 'landing') {
      window.history.pushState({}, '', '/home');
    } else if (view === 'login') {
      window.history.pushState({}, '', '/login');
    } else if (user) {
      const slug = getSlugForStudent(user.name);
      window.history.pushState({}, '', `/${slug}`);
    }
  };

  // On initial load, handle dark mode & URL routing sync (/home vs /<student_name>)
  useEffect(() => {
    document.documentElement.classList.add('dark');

    const path = window.location.pathname.toLowerCase().replace(/^\/+|\/+$/g, '');
    
    if (!path || path === 'home') {
      setCurrentView('landing');
      window.history.replaceState({}, '', '/home');
    } else if (path === 'login') {
      setCurrentView('login');
    } else if (path) {
      // Auto-load matching student persona from URL path slug
      const mockStudents = api.getMockStudents();
      const match = mockStudents.find(s => 
        s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === path ||
        s.roll_number.toLowerCase() === path ||
        path.includes(s.name.toLowerCase().split(' ')[0])
      );

      if (match) {
        api.login('STUDENT', match.roll_number, 'password', match.id).then(session => {
          setCurrentUser(session.user);
          setCurrentStudentId(session.student_id);
          setCurrentView('dashboard');
          window.history.replaceState({}, '', `/${getSlugForStudent(session.user.name)}`);
        }).catch(err => {
          console.error("Failed to load persona from URL", err);
          setCurrentView('landing');
          window.history.replaceState({}, '', '/home');
        });
      } else {
        setCurrentView('landing');
        window.history.replaceState({}, '', '/home');
      }
    }
  }, []);

  const handleLoginSuccess = (user, studentId) => {
    setCurrentUser(user);
    setCurrentStudentId(studentId);
    if (user.role === 'ADMIN') {
      setCurrentView('admin-dashboard');
      window.history.pushState({}, '', '/admin');
    } else {
      setCurrentView('dashboard');
      updateUrlRoute('dashboard', user, studentId);
    }
  };

  const handleLoginBypass = (user, studentId) => {
    setCurrentUser(user);
    setCurrentStudentId(studentId);
    if (user.role === 'ADMIN') {
      window.history.pushState({}, '', '/admin');
    } else {
      updateUrlRoute('dashboard', user, studentId);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentStudentId(null);
    setCurrentView('landing');
    setChatPresetQuery(null);
    window.history.pushState({}, '', '/home');
  };

  const handleNavigateView = (view) => {
    setCurrentView(view);
    if (view === 'landing') {
      window.history.pushState({}, '', '/home');
    } else if (view === 'login') {
      window.history.pushState({}, '', '/login');
    } else if (currentUser) {
      updateUrlRoute(view, currentUser, currentStudentId);
    }
  };

  const handleAskChatShortcut = (queryText) => {
    setChatPresetQuery(queryText);
    setCurrentView('ai-assistant');
  };

  const handleClearPresetQuery = () => {
    setChatPresetQuery(null);
  };

  return (
    <Layout
      currentUser={currentUser}
      currentStudentId={currentStudentId}
      onLogout={handleLogout}
      onLoginBypass={handleLoginBypass}
      currentView={currentView}
      setCurrentView={handleNavigateView}
    >
      <div className="w-full flex-grow flex flex-col items-center justify-start">
        
        {currentView === 'landing' && (
          <Landing onStart={(view) => handleNavigateView(view)} />
        )}

        {currentView === 'login' && (
          <Login onLoginSuccess={handleLoginSuccess} />
        )}

        {currentView === 'dashboard' && currentUser && (
          <Dashboard 
            currentUser={currentUser}
            currentStudentId={currentStudentId} 
            onAskChatShortcut={handleAskChatShortcut}
            onNavigate={(view) => handleNavigateView(view)}
          />
        )}

        {currentView === 'whatsapp-bot' && currentUser && (
          <WhatsAppSimulator 
            currentUser={currentUser} 
            currentStudentId={currentStudentId}
          />
        )}

        {currentView === 'attendance' && currentUser && (
          <AttendanceView 
            currentStudentId={currentStudentId} 
            onAskChatShortcut={handleAskChatShortcut}
          />
        )}

        {currentView === 'academics' && currentUser && (
          <AcademicsView 
            currentStudentId={currentStudentId} 
            onAskChatShortcut={handleAskChatShortcut}
          />
        )}

        {currentView === 'assignments' && currentUser && (
          <AssignmentsView 
            currentStudentId={currentStudentId} 
          />
        )}

        {currentView === 'exams' && currentUser && (
          <ExamsView 
            currentStudentId={currentStudentId} 
          />
        )}

        {currentView === 'fees' && currentUser && (
          <FeesView 
            currentStudentId={currentStudentId} 
            onAskChatShortcut={handleAskChatShortcut}
          />
        )}

        {currentView === 'notices' && currentUser && (
          <NoticesView />
        )}

        {currentView === 'ai-assistant' && currentUser && (
          <AiAssistantView 
            currentUser={currentUser} 
            currentStudentId={currentStudentId} 
            presetQuery={chatPresetQuery}
            onClearPresetQuery={handleClearPresetQuery}
          />
        )}

        {currentView === 'profile' && currentUser && (
          <ProfileView 
            currentUser={currentUser} 
            currentStudentId={currentStudentId}
          />
        )}

        {(currentView === 'admin-dashboard' || currentView === 'admin-attendance' || currentView === 'admin-notices') && currentUser && currentUser.role === 'ADMIN' && (
          <AdminDashboard initialTab={currentView} />
        )}

      </div>
    </Layout>
  );
}
