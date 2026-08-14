import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Mic, Send, Phone, Video, MoreVertical, CheckCheck, Play, Pause, Sparkles, Copy, Check, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

export default function WhatsAppSimulator({ currentUser, currentStudentId }) {
  const [messages, setMessages] = useState([
    {
      id: 'system',
      sender: 'system',
      text: '🔒 End-to-end encrypted • WhatsApp Business Verified Bot',
      timestamp: ''
    },
    {
      id: 'welcome',
      sender: 'bot',
      text: `🤖 *EduMitra WhatsApp Assistant*\n\nHello ${currentUser?.name || 'User'}! Welcome to the EduMitra WhatsApp service.\n\nYou can send me text messages or *WhatsApp Voice Notes* to check attendance, exam schedules, fee dues, or calculate leave impact.`,
      timestamp: '10:15 AM'
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  const chatContainerRef = useRef(null);

  useEffect(() => {
    chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const webhookUrl = "https://collegeai-nine.vercel.app/api/v1/whatsapp/webhook";

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  const handleSendWhatsApp = async (textToSend, isVoiceNote = false) => {
    const text = textToSend || inputValue;
    if (!text && !isVoiceNote) return;

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Push User message
    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: isVoiceNote ? null : text,
      isVoiceNote,
      voiceText: isVoiceNote ? (text || "What is my current attendance?") : null,
      timestamp: userTime
    };

    setMessages(prev => [...prev, userMsg]);
    if (!isVoiceNote) setInputValue('');
    setLoading(true);

    try {
      const res = await api.simulateWhatsAppMessage(
        "+919876543210",
        text || "What is my current attendance?",
        isVoiceNote,
        currentStudentId || "STU001",
        currentUser?.role || "PARENT"
      );

      const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const botMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: res.reply,
        timestamp: botTime
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error("WhatsApp simulation error:", err);
      const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: `⚠️ *WhatsApp Connection Notice*\nCould not reach WhatsApp serverless gateway.`,
          timestamp: botTime
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto py-2">
      
      {/* HEADER BANNER */}
      <div className="glass-card p-5 border-l-4 border-l-emerald-500 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">
              WA
            </div>
            <h2 className="text-xl font-display font-extrabold text-slate-900 dark:text-white">
              WhatsApp AI Bot & Voice Note Gateway
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/20">
              Twilio / Meta Ready
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Send WhatsApp text messages or <span className="font-bold text-emerald-600 dark:text-emerald-400">WhatsApp Voice Notes</span> (powered by Groq Whisper AI transcription).
          </p>
        </div>

        {/* WEBHOOK URL COPY CHIP */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0">
          <span className="text-[10px] font-mono text-slate-500 truncate max-w-[200px] sm:max-w-[280px]">
            {webhookUrl}
          </span>
          <button
            onClick={handleCopyWebhook}
            className="btn-primary text-xs py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1 shrink-0"
          >
            {copiedWebhook ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedWebhook ? 'Copied' : 'Copy Webhook'}</span>
          </button>
        </div>
      </div>

      {/* WHATSAPP MAIN SIMULATOR CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: QUICK ACTION PRESETS */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="glass-card p-5 flex flex-col gap-3">
            <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800/80 pb-2.5">
              <Mic className="h-4 w-4 text-emerald-500" />
              <h3 className="font-display font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                Simulate WhatsApp Voice Notes
              </h3>
            </div>
            
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Click below to send a simulated WhatsApp audio voice note. Groq Whisper API transcribes the audio voice note in real time:
            </p>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleSendWhatsApp("What is my child's attendance?", true)}
                className="w-full text-left p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold text-xs hover:bg-emerald-500/20 transition-all flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Mic className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-bold text-[11px] block text-slate-900 dark:text-white">🎙️ Voice Note 1</span>
                  <span className="text-[10px] opacity-80 font-normal">"What is my child's attendance?"</span>
                </div>
              </button>

              <button
                onClick={() => handleSendWhatsApp("If I take 3 days leave next week, which subjects will drop below 75%?", true)}
                className="w-full text-left p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold text-xs hover:bg-emerald-500/20 transition-all flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Mic className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-bold text-[11px] block text-slate-900 dark:text-white">🎙️ Voice Note 2</span>
                  <span className="text-[10px] opacity-80 font-normal">"If I take 3 days leave next week..."</span>
                </div>
              </button>
            </div>
          </div>

          <div className="glass-card p-5 flex flex-col gap-3">
            <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800/80 pb-2.5">
              <MessageSquare className="h-4 w-4 text-emerald-500" />
              <h3 className="font-display font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                Simulate Text Messages
              </h3>
            </div>

            <div className="flex flex-col gap-2">
              {[
                "Show pending fee statement",
                "What exams do I have next week?",
                "What marks do I need in end sem for Grade A?"
              ].map((query, i) => (
                <button
                  key={i}
                  onClick={() => handleSendWhatsApp(query, false)}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-emerald-500/40 hover:text-emerald-600 transition-all truncate"
                >
                  💬 "{query}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: WHATSAPP SMARTPHONE FRAME */}
        <div className="lg:col-span-8 flex justify-center">
          <div className="w-full max-w-md bg-[#efeae2] dark:bg-[#0b141a] rounded-[32px] border-8 border-slate-800 dark:border-slate-900 shadow-2xl overflow-hidden flex flex-col h-[600px] relative">
            
            {/* WHATSAPP PHONE STATUS BAR */}
            <div className="bg-[#075e54] text-white px-4 py-1 flex items-center justify-between text-[10px] font-mono shrink-0">
              <span>9:41 AM</span>
              <div className="flex items-center gap-1">
                <span>5G</span>
                <span>100%</span>
              </div>
            </div>

            {/* WHATSAPP HEADER */}
            <div className="bg-[#075e54] text-white px-4 py-3 flex items-center justify-between shadow-md shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-400 text-slate-900 flex items-center justify-center font-bold text-sm shadow">
                  EM
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight flex items-center gap-1.5">
                    EduMitra Assistant
                    <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
                  </h3>
                  <span className="text-[10px] text-emerald-100 font-medium">Business Account • online</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-emerald-100">
                <Video className="h-4 w-4 cursor-pointer" />
                <Phone className="h-4 w-4 cursor-pointer" />
                <MoreVertical className="h-4 w-4 cursor-pointer" />
              </div>
            </div>

            {/* CHAT MESSAGES STREAM */}
            <div ref={chatContainerRef} className="flex-grow p-4 overflow-y-auto flex flex-col gap-3">
              {messages.map((msg) => {
                if (msg.sender === 'system') {
                  return (
                    <div key={msg.id} className="self-center bg-[#ffeebd] dark:bg-[#182229] text-amber-900 dark:text-amber-200 text-[10px] px-3 py-1 rounded-lg font-semibold shadow-xs text-center my-1 max-w-[85%]">
                      {msg.text}
                    </div>
                  );
                }

                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[85%] ${isUser ? 'self-end' : 'self-start'}`}
                  >
                    <div
                      className={`p-3 rounded-xl text-xs leading-relaxed shadow-sm relative ${
                        isUser 
                          ? 'bg-[#d9fdd3] dark:bg-[#005c4b] text-slate-900 dark:text-slate-100 rounded-tr-none' 
                          : 'bg-white dark:bg-[#202c33] text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200/50 dark:border-slate-800/50'
                      }`}
                    >
                      {/* VOICE NOTE WAVEFORM BUBBLE */}
                      {msg.isVoiceNote ? (
                        <div className="flex items-center gap-3 py-1">
                          <button 
                            onClick={() => setPlayingAudioId(playingAudioId === msg.id ? null : msg.id)}
                            className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm"
                          >
                            {playingAudioId === msg.id ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 ml-0.5" />}
                          </button>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1">
                              <span className="font-bold text-[11px]">🎙️ Voice Note</span>
                              <span className="text-[9px] opacity-70 font-mono">0:04</span>
                            </div>
                            <span className="text-[10px] opacity-80 italic truncate max-w-[180px]">
                              "{msg.voiceText}"
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div 
                          className="whitespace-pre-line leading-relaxed"
                          dangerouslySetInnerHTML={{ 
                            __html: msg.text
                              ? msg.text
                                  .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-emerald-400">$1</strong>')
                                  .replace(/(^|\s)\*([^\*\n]+)\*($|\s)/g, '$1<strong class="font-semibold text-slate-100">$2</strong>$3')
                              : '' 
                          }} 
                        />
                      )}

                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-[9px] opacity-60 font-mono">{msg.timestamp}</span>
                        {isUser && <CheckCheck className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />}
                      </div>
                    </div>
                  </div>
                );
              })}

              {loading && (
                <div className="self-start bg-white dark:bg-[#202c33] p-3 rounded-xl text-xs text-slate-400 font-medium shadow-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>Transcribing & calculating query...</span>
                </div>
              )}
            </div>

            {/* INPUT FOOTER BAR */}
            <div className="bg-[#f0f2f5] dark:bg-[#202c33] p-3 border-t border-slate-300 dark:border-slate-800 flex items-center gap-2 shrink-0">
              <button 
                onClick={() => handleSendWhatsApp("What is my attendance?", true)} 
                title="Send WhatsApp Voice Note"
                className="p-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shrink-0 shadow"
              >
                <Mic className="h-4 w-4" />
              </button>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendWhatsApp(inputValue, false);
                }}
                className="flex items-center gap-2 flex-grow"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type WhatsApp message..."
                  className="w-full bg-white dark:bg-[#2a3942] text-xs py-2.5 px-4 rounded-full border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="p-2 rounded-full bg-emerald-600 text-white disabled:opacity-40 shrink-0"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
