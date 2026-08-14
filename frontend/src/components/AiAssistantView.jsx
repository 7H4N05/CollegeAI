import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Mic, Sparkles, ShieldCheck, ChevronRight, User, RefreshCw, Radio, Volume2 } from 'lucide-react';
import { api } from '../services/api';
import InteractiveResponseCard from './ResponseCards';

export default function AiAssistantView({ currentUser, currentStudentId, presetQuery, onClearPresetQuery, isEmbedded = false }) {
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
  const recognitionRef = useRef(null);

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
        text: `⚠️ Error: Could not connect to AI service. Please try again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        card: null
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleMicClick = () => {
    // If mic recognition is currently active, stop it
    if (micActive) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e) {}
      }
      setMicActive(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Fallback for browsers without native Web Speech API support
      setMicActive(true);
      setTimeout(() => {
        const fallbackText = currentUser?.role === 'PARENT' 
          ? "How is my child's attendance?" 
          : "What is my current attendance?";
        setInputValue(fallbackText);
        setMicActive(false);
      }, 1000);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setMicActive(true);
      };

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setInputValue(transcript);
        }
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition notice:", event.error);
        setMicActive(false);
        // Autofill sample query if speech wasn't captured
        const fallbackText = currentUser?.role === 'PARENT' 
          ? "How is my child's attendance?" 
          : "What is my current attendance?";
        setInputValue(fallbackText);
      };

      recognition.onend = () => {
        setMicActive(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn("Speech recognition initialization error:", err);
      setMicActive(false);
      const fallbackText = currentUser?.role === 'PARENT' 
        ? "How is my child's attendance?" 
        : "What is my current attendance?";
      setInputValue(fallbackText);
    }
  };

  return (
    <div className={`grid grid-cols-12 gap-5 w-full overflow-hidden ${isEmbedded ? 'h-[580px]' : 'h-[calc(100vh-9.5rem)] min-h-[500px]'}`}>
      
      {/* Left Suggestion Sidebar (Hide on embedded view for clean minimal design) */}
      {!isEmbedded && (
        <div className="hidden lg:flex lg:col-span-4 flex-col gap-4 h-full overflow-hidden">
          <div className="glass-card p-4 flex flex-col gap-1.5 border-l-4 border-l-indigo-600 shrink-0">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-display font-bold text-xs">
              <ShieldCheck className="h-4 w-4" /> Role Security Verified
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Logged in as <span className="font-bold text-slate-900 dark:text-white">{currentUser.name}</span> ({currentUser.role}). 
              Target: <span className="font-mono bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded font-bold">{currentStudentId || 'ADMIN'}</span>.
            </p>
          </div>

          <div className="glass-card p-4 flex-grow flex flex-col gap-3 overflow-hidden">
            <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800/80 pb-2.5 shrink-0">
              <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span className="font-display font-bold text-xs text-slate-900 dark:text-white">Suggested Prompts</span>
            </div>

            <div className="flex flex-col gap-2 overflow-y-auto pr-1">
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(prompt)}
                  className="w-full flex items-center justify-between text-left text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100/60 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 hover:border-indigo-500/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all group shrink-0"
                >
                  <span className="truncate">"{prompt}"</span>
                  <ChevronRight className="h-3.5 w-3.5 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className={`col-span-12 ${isEmbedded ? 'lg:col-span-12' : 'lg:col-span-8'} glass-card flex flex-col h-full overflow-hidden shadow-xl relative border border-indigo-500/20`}>
        
        {/* Chat Header */}
        <div className="bg-slate-100/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800/80 px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-display font-extrabold text-xs shadow-md shadow-indigo-500/20 shrink-0">
              AI
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                CollegeAI Assistant
                <span className="text-[10px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold px-2 py-0.5 rounded-full border border-indigo-500/20">
                  Verified Engine
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                Connected to REST APIs & Deterministic Math Solvers
              </p>
            </div>
          </div>
        </div>

        {/* Message Trajectory */}
        <div className="flex-grow p-5 overflow-y-auto flex flex-col gap-3.5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} max-w-full`}
            >
              <div
                className={`p-3.5 rounded-2xl max-w-[90%] text-xs sm:text-sm leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none'
                }`}
              >
                <div 
                  className="whitespace-pre-line leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: msg.text
                      ? msg.text
                          .replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-indigo-400">$1</strong>')
                          .replace(/(^|\s)\*([^\*\n]+)\*($|\s)/g, '$1<strong class="font-bold text-slate-100">$2</strong>$3')
                      : '' 
                  }} 
                />
                
                {msg.card && (
                  <div className="mt-3">
                    <InteractiveResponseCard cardData={msg.card} />
                  </div>
                )}

                <span className="block text-[9px] opacity-60 text-right mt-1 font-mono">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-fit text-xs text-slate-400 font-medium">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" style={{ animationDelay: '0.4s' }}></span>
              </div>
              <span className="ml-2">Calculating backend response...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompt Chips (Minimal Horizontal Bar) */}
        <div className="px-5 py-2 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0 bg-slate-50/50 dark:bg-slate-950/50">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-indigo-500" /> Prompts:
          </span>
          {quickPrompts.slice(0, 4).map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-white/80 dark:bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 hover:text-indigo-600 dark:hover:text-indigo-400 whitespace-nowrap shrink-0 transition-all"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col gap-2 shrink-0 bg-white/40 dark:bg-slate-900/40">
          {micActive && (
            <div className="text-xs text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-500/10 p-2.5 rounded-xl border border-indigo-500/20 text-center animate-pulse flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 animate-bounce text-indigo-500" />
                <span>Listening to microphone... Speak clearly!</span>
              </div>
              <button 
                type="button" 
                onClick={() => {
                  const fallbackText = currentUser?.role === 'PARENT' 
                    ? "How is my child's attendance?" 
                    : "What is my current attendance?";
                  setInputValue(fallbackText);
                  setMicActive(false);
                }}
                className="px-2 py-0.5 rounded bg-indigo-600 text-white font-bold text-[10px]"
              >
                Insert Sample Query
              </button>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="flex items-center gap-2.5"
          >
            <div className="relative flex-grow">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={currentUser.role === 'PARENT' ? "Ask AI: 'How is my child's attendance?' or 'Any pending fees?'" : "Ask AI: 'What is my attendance?' or 'If I take 3 days leave...'"}
                className="w-full glass-input text-xs sm:text-sm py-3 pr-10 rounded-xl"
              />
              <button
                type="button"
                onClick={handleMicClick}
                title="Voice Input (Click to Speak / Click to Stop)"
                className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all ${
                  micActive 
                    ? 'bg-red-500 text-white animate-pulse shadow-md shadow-red-500/30' 
                    : 'text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                <Mic className="h-4 w-4" />
              </button>
            </div>

            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="btn-primary py-3 px-4 text-xs font-bold rounded-xl disabled:opacity-40 shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
