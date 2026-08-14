import React, { useState } from 'react';
import Layout from './components/Layout';
import Landing from './components/Landing';
import Login from './components/Login';
import ChatInterface from './components/ChatInterface';
import StudentDashboard from './components/StudentDashboard';
import ParentDashboard from './components/ParentDashboard';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentStudentId, setCurrentStudentId] = useState(null);
  const [currentView, setCurrentView] = useState('landing'); // landing, login, dashboard, chat, admin
  const [chatPresetQuery, setChatPresetQuery] = useState(null);

  const handleLoginSuccess = (user, studentId) => {
    setCurrentUser(user);
    setCurrentStudentId(studentId);
    if (user.role === 'ADMIN') {
      setCurrentView('admin');
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
    setCurrentView('chat');
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
    >
      
      {/* Route Switcher */}
      <div className="flex-grow flex flex-col justify-start">
        
        {currentView === 'landing' && (
          <Landing onStart={(view) => setCurrentView(view)} />
        )}

        {currentView === 'login' && (
          <Login onLoginSuccess={handleLoginSuccess} />
        )}

        {currentView === 'dashboard' && currentUser && (
          <>
            {currentUser.role === 'STUDENT' && (
              <StudentDashboard 
                currentStudentId={currentStudentId} 
                onAskChatShortcut={handleAskChatShortcut} 
              />
            )}
            {currentUser.role === 'PARENT' && (
              <ParentDashboard 
                currentUser={currentUser}
                currentStudentId={currentStudentId} 
                onAskChatShortcut={handleAskChatShortcut} 
              />
            )}
          </>
        )}

        {currentView === 'chat' && currentUser && (
          <ChatInterface 
            currentUser={currentUser} 
            currentStudentId={currentStudentId} 
            presetQuery={chatPresetQuery}
            onClearPresetQuery={handleClearPresetQuery}
          />
        )}

        {currentView === 'admin' && currentUser && currentUser.role === 'ADMIN' && (
          <AdminDashboard />
        )}

      </div>

    </Layout>
  );
}
