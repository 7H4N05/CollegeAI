import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Paperclip, 
  Mic, 
  AlertCircle,
  HelpCircle,
  CornerDownLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Bot,
  User,
  Zap
} from 'lucide-react';
import { api } from '../services/api';
import InteractiveResponseCard from './ResponseCards';

export default function ChatInterface({ currentUser, currentStudentId, presetQuery, onClearPresetQuery }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: `Hello ${currentUser.name}! I am your EduMitra Personal Companion. I have secure access to your academic database records. Feel free to ask me anything.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      card: null
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [micActive, setMicActive] = useState(false);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (presetQuery) {
      handleSendMessage(presetQuery);
      if (onClearPresetQuery) {
        onClearPresetQuery();
      }
    }
  }, [presetQuery]);

  const quickPrompts = currentUser.role === 'PARENT' 
    ? [
        "How is my child's attendance?",
        "Are there any pending fees?",
        "Does my child have exams next week?",
        "Show me important announcements."
      ]
    : [
        "What is my current attendance?",
        "How many classes can I miss while maintaining 75%?",
        "What exams do I have next week?",
        "If I take 3 days leave next week, which subjects will fall below 75%?",
        "How much fee is pending?",
        "Show my internal marks and grades target."
      ];

  const handleSendMessage = async (textToSend) => {
    if (!textToSend.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      card: null
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const result = await api.sendChatMessage(currentUser.role, currentStudentId, textToSend);
      
      const botMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: result.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        card: result.data ? { type: result.data.type, payload: result.data } : null
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: `⚠️ Error: I encountered a database connection failure. Please try again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        card: null
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleMicClick = () => {
    setMicActive(true);
    setTimeout(() => {
      setMicActive(false);
      const voiceText = currentUser.role === 'PARENT' 
        ? "How is my child's attendance?" 
        : "How many classes can I miss?";
      setInputValue(voiceText);
    }, 2000);
  };

  return (
    <div className="flex-grow grid grid-cols-12 gap-6 min-h-[calc(100vh-10rem)] max-h-[calc(100vh-10rem)] overflow-hidden">
      
      {/* Left Sidebar (Desktop): Quick Suggestion Panel */}
      <div className="hidden lg:flex lg:col-span-4 flex-col gap-4 max-h-full overflow-hidden">
        
        {/* Helper Banner */}
        <div className="glass-panel p-5 rounded-3xl border border-white/10 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-teal-400 font-display font-bold text-xs">
            <ShieldCheck className="h-4 w-4" /> Role Security Verified
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Logged in as <span className="font-bold text-white">{currentUser.name}</span> ({currentUser.role}). 
            Data restricted to Student ID: <span className="font-mono bg-teal-500/10 text-teal-300 px-2 py-0.5 rounded font-bold">{currentStudentId || 'ADMIN'}</span>.
          </p>
        </div>

        {/* Suggestion list */}
        <div className="glass-panel p-5 rounded-3xl border border-white/10 flex-grow flex flex-col gap-3 overflow-hidden">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Sparkles className="h-4 w-4 text-teal-400" />
            <span className="font-display font-bold text-xs text-white">Suggested Conversational Prompts</span>
          </div>

          <div className="flex flex-col gap-2.5 overflow-y-auto pr-1">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                className="w-full flex items-center justify-between text-left text-xs font-medium text-slate-300 bg-slate-900/60 p-3 rounded-2xl border border-white/5 hover:bg-teal-500/10 hover:border-teal-500/30 hover:text-white transition-all group shrink-0"
              >
                <span>"{prompt}"</span>
                <ChevronRight className="h-3.5 w-3.5 text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Main Chat Canvas */}
      <div className="col-span-12 lg:col-span-8 glass-panel rounded-3xl border border-white/10 flex flex-col h-full overflow-hidden shadow-2xl relative">
        
        {/* WhatsApp-Style Chat Header */}
        <div className="bg-slate-950/90 border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-500 to-indigo-600 text-white flex items-center justify-center font-display font-bold text-sm shadow-md">
              CA
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
                CollegeAI Assistant
                <span className="text-[10px] bg-teal-500/20 text-teal-300 font-semibold px-2 py-0.5 rounded-full border border-teal-500/30">
                  Verified Engine
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
                Connected to REST APIs & Deterministic Solvers
              </p>
            </div>
          </div>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-grow p-6 overflow-y-auto flex flex-col gap-4 bg-slate-950/40">
          
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} max-w-full`}
            >
              <div
                className={`message-bubble ${
                  msg.sender === 'user' ? 'message-out' : 'message-in'
                }`}
              >
                <p className="text-xs sm:text-sm leading-relaxed font-normal">{msg.text}</p>
                
                {/* Embed Interactive Response Card if attached */}
                {msg.card && (
                  <div className="mt-3">
                    <InteractiveResponseCard cardData={msg.card} onAskShortcut={handleSendMessage} />
                  </div>
                )}

                <div className="text-[10px] opacity-60 text-right mt-1.5 font-mono">
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {/* Loading Indicator when Bot is thinking */}
          {loading && (
            <div className="flex items-center gap-2 message-bubble message-in w-fit">
              <div className="flex items-center gap-1.5 py-1 px-2">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                <span className="text-xs text-slate-400 font-semibold ml-2">Calculating backend formula...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Bar */}
        <div className="p-4 bg-slate-950/90 border-t border-white/10 flex flex-col gap-2">
          
          {micActive && (
            <div className="flex items-center gap-2 text-xs text-teal-400 font-bold bg-teal-500/10 p-2.5 rounded-xl border border-teal-500/20 animate-pulse">
              <Mic className="h-4 w-4 animate-bounce" />
              <span>Listening to voice message... Transcribing query into chat...</span>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="flex items-center gap-3"
          >
            <div className="relative flex-grow flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={currentUser.role === 'PARENT' ? "Ask: 'How is my child's attendance?' or 'Any pending fees?'" : "Ask: 'What is my attendance?' or 'If I take 3 days leave...'"}
                className="w-full glass-input text-xs sm:text-sm py-3 pr-10 text-white placeholder-slate-500"
              />
              <button
                type="button"
                onClick={handleMicClick}
                className={`absolute right-3 p-1.5 rounded-lg transition-colors ${micActive ? 'text-teal-400 bg-teal-500/20' : 'text-slate-400 hover:text-white'}`}
                title="Voice Input (WhatsApp Voice Message Simulation)"
              >
                <Mic className="h-4 w-4" />
              </button>
            </div>

            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="btn-primary py-3 px-5 text-xs font-bold rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-teal-500/20"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
