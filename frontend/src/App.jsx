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

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentStudentId, setCurrentStudentId] = useState(null);
  const [currentView, setCurrentView] = useState('landing');
  const [chatPresetQuery, setChatPresetQuery] = useState(null);
  const [theme, setTheme] = useState('light');

  // Handle Theme Toggling
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleLoginSuccess = (user, studentId) => {
    setCurrentUser(user);
    setCurrentStudentId(studentId);
    if (user.role === 'ADMIN') {
      setCurrentView('admin-dashboard');
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleLoginBypass = (user, studentId) => {
    setCurrentUser(user);
    setCurrentStudentId(studentId);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentStudentId(null);
    setCurrentView('landing');
    setChatPresetQuery(null);
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
      setCurrentView={setCurrentView}
      theme={theme}
      setTheme={setTheme}
    >
      <div className="w-full flex-grow flex flex-col items-center justify-start">
        
        {currentView === 'landing' && (
          <Landing onStart={(view) => setCurrentView(view)} />
        )}

        {currentView === 'login' && (
          <Login onLoginSuccess={handleLoginSuccess} />
        )}

        {currentView === 'dashboard' && currentUser && (
          <Dashboard 
            currentUser={currentUser}
            currentStudentId={currentStudentId} 
            onAskChatShortcut={handleAskChatShortcut}
            onNavigate={(view) => setCurrentView(view)}
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
