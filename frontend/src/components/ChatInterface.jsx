import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Paperclip, 
  Mic, 
  AlertCircle,
  HelpCircle,
  CornerDownLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { api } from '../services/api';
import InteractiveResponseCard from './ResponseCards';

export default function ChatInterface({ currentUser, currentStudentId, presetQuery, onClearPresetQuery }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: `Hello ${currentUser.name}! I am your CollegeAI Personal Companion. I have secure access to your academic database records. Feel free to ask me anything.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      card: null
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [micActive, setMicActive] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Handle preset query from shortcuts
  useEffect(() => {
    if (presetQuery) {
      handleSendMessage(presetQuery);
      if (onClearPresetQuery) {
        onClearPresetQuery();
      }
    }
  }, [presetQuery]);

  // Predefined prompts for students/parents
  const quickPrompts = currentUser.role === 'PARENT' 
    ? [
        "How is my child's attendance?",
        "Are there any pending fees?",
        "Does my child have exams next week?",
        "Show me important announcements."
      ]
    : [
        "What is my current attendance?",
        "How many classes can I miss to stay above 75%?",
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
      // Call mock or live chat endpoint
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
      // Simulate input voice-to-text transcript
      const voiceText = currentUser.role === 'PARENT' 
        ? "How is my child's attendance?" 
        : "How many classes can I miss?";
      setInputValue(voiceText);
    }, 2000);
  };

  return (
    <div className="flex-grow grid grid-cols-12 gap-6 min-h-[calc(100vh-10rem)] max-h-[calc(100vh-10rem)] overflow-hidden">
      
      {/* Left Sidebar (Desktop Only): Quick Suggestion Panel */}
      <div className="hidden lg:flex lg:col-span-4 flex-col gap-4 max-h-full overflow-hidden">
        
        {/* Helper Banner */}
        <div className="glass-panel p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 flex flex-col gap-2">
          <h4 className="font-display font-bold text-xs flex items-center gap-1 text-teal-600 dark:text-teal-400">
            <ShieldCheck className="h-4 w-4" /> Role Security Verified
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
            You are logged in as a verified <span className="font-bold text-slate-700 dark:text-slate-350">{currentUser.role}</span>. 
            All data queries will be restricted to authorized files belonging to Student ID: <span className="font-mono bg-slate-200/50 dark:bg-slate-850 px-1 py-0.5 rounded font-bold">{currentStudentId || 'N/A'}</span>.
          </p>
        </div>

        {/* Suggestion list */}
        <div className="glass-panel p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex-grow flex flex-col gap-3">
          <div className="flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-850 pb-2">
            <HelpCircle className="h-4 w-4 text-slate-400" />
            <span className="font-display font-bold text-xs text-slate-700 dark:text-slate-300">Suggested Questions</span>
          </div>

          <div className="flex flex-col gap-2 overflow-y-auto">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                className="w-full flex items-center justify-between text-left text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-100 dark:border-slate-850 hover:bg-teal-500/5 hover:border-teal-500/30 transition-all group shrink-0"
              >
                <span className="truncate pr-2">{prompt}</span>
                <ChevronRight className="h-3 w-3 text-slate-400 group-hover:text-teal-500 shrink-0" />
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Main Chat Panel */}
      <div className="col-span-12 lg:col-span-8 flex flex-col glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#efeae2] dark:bg-[#0b0f19] overflow-hidden max-h-full">
        
        {/* Chat Header */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-850 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-display font-extrabold text-sm shadow-inner relative">
              CA
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900"></span>
            </div>
            <div>
              <p className="text-xs font-extrabold text-slate-950 dark:text-white leading-tight">CollegeAI Companion</p>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Online & Active</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 lg:hidden">
            <span className="text-[9px] px-2 py-0.5 rounded font-extrabold bg-teal-500/10 text-teal-500 uppercase tracking-wider">
              {currentUser.role}
            </span>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-grow overflow-y-auto px-4 py-4 flex flex-col gap-3 max-h-[calc(100vh-21rem)] min-h-[calc(100vh-21rem)]">
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex flex-col w-full ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              {/* Message text bubble */}
              <div 
                className={`message-bubble ${
                  msg.sender === 'user' 
                    ? 'message-out' 
                    : 'message-in border border-slate-200/50 dark:border-slate-800/40'
                }`}
              >
                <p className="text-xs leading-normal">{msg.text}</p>
                <span className="block text-[8px] text-slate-400 text-right mt-1 font-mono font-medium">
                  {msg.timestamp}
                </span>
              </div>

              {/* Interactive payload cards if present */}
              {msg.card && (
                <div className="w-full sm:max-w-md my-1.5 animate-fade-in self-start pl-2">
                  <InteractiveResponseCard cardType={msg.card.type} payload={msg.card.payload} />
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex items-center gap-2 self-start bg-white dark:bg-slate-900 py-2.5 px-4 rounded-xl border border-slate-200/50 dark:border-slate-800/40 message-bubble max-w-max">
              <span className="text-[10px] font-bold text-slate-400 italic flex items-center gap-2">
                CollegeAI is thinking
                <span className="flex gap-0.5">
                  <span className="h-1 w-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="h-1 w-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="h-1 w-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </span>
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips (Mobile Viewport scrolling list) */}
        <div className="lg:hidden flex gap-2 overflow-x-auto px-4 py-2 border-t border-slate-200/50 dark:border-slate-850/40 bg-slate-50/50 dark:bg-slate-900/30 shrink-0">
          {quickPrompts.slice(0, 3).map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="text-[10px] font-bold text-slate-600 dark:text-slate-350 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 shrink-0 hover:bg-teal-500/10 hover:text-teal-600 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-850 px-4 py-3 flex items-center gap-2">
          
          {/* Attach */}
          <button 
            type="button" 
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
            title="Attach File"
          >
            <Paperclip className="h-5 w-5" />
          </button>

          {/* Form */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }}
            className="flex-grow flex items-center relative"
          >
            <input
              type="text"
              placeholder="Type message here..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs px-4 py-2.5 rounded-full outline-none focus:border-teal-500 pr-10 text-slate-900 dark:text-white"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className={`absolute right-1 p-1.5 rounded-full text-white transition-all ${
                inputValue.trim() 
                  ? 'bg-teal-600 hover:bg-teal-700' 
                  : 'bg-slate-300 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send className="h-4.5 w-4.5" />
            </button>
          </form>

          {/* Voice Memo Button */}
          <button 
            type="button" 
            onClick={handleMicClick}
            className={`p-2 rounded-full transition-all relative ${
              micActive 
                ? 'bg-red-500 text-white animate-pulse' 
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
            title="Voice message (Future WhatsApp integration)"
          >
            <Mic className="h-5 w-5" />
            {micActive && (
              <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2.5 py-1 bg-red-600 text-white text-[9px] font-bold rounded shadow-lg whitespace-nowrap">
                Recording...
              </span>
            )}
          </button>

        </div>

      </div>

    </div>
  );
}
