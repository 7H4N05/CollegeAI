import React from 'react';
import { Bot, ShieldCheck, Sparkles } from 'lucide-react';
import AiAssistantView from './AiAssistantView';

export default function Dashboard({ currentUser, currentStudentId, onAskChatShortcut, onNavigate }) {
  const isParent = currentUser?.role === 'PARENT';

  return (
    <div className="flex flex-col gap-4 animate-fade-in w-full max-w-6xl mx-auto py-2">
      
      {/* ULTRA-MINIMAL TOP CONTEXT HEADER */}
      <div className="flex items-center justify-between glass-card px-5 py-3.5 border-l-4 border-l-indigo-600">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0 border border-indigo-500/20">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-display font-extrabold text-slate-900 dark:text-white">
                Hello, {currentUser.name.split(' ')[0]} 👋
              </h2>
              <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono text-[10px] font-bold border border-indigo-500/20">
                ERP Sync: {currentStudentId || 'STU001'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              {isParent ? `Fetching live ERP data for your child.` : `Ask anything via voice note or text.`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[11px] font-bold border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            ERP Bridge Online
          </span>
        </div>
      </div>

      {/* HERO CHATBOT INTERFACE (SINGLE CORE PRODUCT) */}
      <div className="w-full flex-grow">
        <AiAssistantView 
          currentUser={currentUser} 
          currentStudentId={currentStudentId} 
          presetQuery={null}
          isEmbedded={true}
        />
      </div>

    </div>
  );
}
