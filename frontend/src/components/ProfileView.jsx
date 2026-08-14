import React, { useState, useEffect } from 'react';
import { User, GraduationCap, ShieldCheck, Mail, Phone, BookOpen } from 'lucide-react';
import { api } from '../services/api';

export default function ProfileView({ currentUser, currentStudentId }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function loadData() {
      if (!currentStudentId) return;
      try {
        const res = await api.getProfile(currentStudentId);
        setProfile(res);
      } catch (err) {
        console.error("Error loading profile", err);
      }
    }
    loadData();
  }, [currentStudentId]);

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-3xl mx-auto w-full">
      
      <div className="glass-card p-8 flex flex-col items-center text-center gap-4">
        <div className="w-20 h-20 rounded-full bg-indigo-600 text-white font-display font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
          {currentUser.name[0]}
        </div>

        <div>
          <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">{currentUser.name}</h2>
          <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 uppercase mt-1 inline-block">
            {currentUser.role} Account
          </span>
        </div>

        {profile && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full mt-4 pt-6 border-t border-slate-200/80 dark:border-slate-800/80 text-xs">
            <div className="flex flex-col">
              <span className="text-slate-400 font-medium">Roll Number</span>
              <span className="font-bold text-slate-900 dark:text-white mt-0.5">{profile.roll_number}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-400 font-medium">Course</span>
              <span className="font-bold text-slate-900 dark:text-white mt-0.5">{profile.course}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-400 font-medium">Semester</span>
              <span className="font-bold text-slate-900 dark:text-white mt-0.5">Sem {profile.semester} ({profile.section})</span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-400 font-medium">Student ID</span>
              <span className="font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-0.5">{currentStudentId}</span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
