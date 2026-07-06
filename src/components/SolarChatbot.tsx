import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sun, Sparkles, User, ShieldCheck } from 'lucide-react';
import { ChatMessage } from '../types';

export default function SolarChatbot() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      content: "Hello! I'm **Surya**, your virtual solar advisor at **Infinity Solar Power System** Indore. ☀️\n\nI can help you understand solar energy, check your eligibility for the **PM Surya Ghar scheme** (with subsidies up to **₹78,000**!), or estimate the ideal system size for your property.\n\nAre you looking for solar panels for your **home** or a **commercial business**?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    if (!textToSend) {
      setInput('');
    }

    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Limit to last 8 messages to prevent context overflow and remain fast
      const recentMessages = newMessages.slice(-8);
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: recentMessages }),
      });

      if (!response.ok) {
        throw new Error('Could not connect to Surya. Please try again.');
      }

      const data = await response.json();
      const modelMsg: ChatMessage = {
        id: 'msg_' + (Date.now() + 1),
        role: 'model',
        content: data.reply,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: 'msg_' + (Date.now() + 1),
        role: 'model',
        content: `I apologize, but I'm having trouble reaching my database at the moment. 

However, you can reach out directly to our human experts at **Infinity Solar Power System** in **Vijay Nagar, Indore** by calling us at **+91 98765 43210** (available 24/7)! Would you like to check the [Calculator] above as well?`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    "What is the PM Surya Ghar Subsidy?",
    "On-grid vs Off-grid systems?",
    "How much does a 3kW system cost?",
    "Where is Infinity Solar in Indore?",
  ];

  return (
    <div id="solar-chatbot-container" className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div id="chatbot-window" className="w-[360px] sm:w-[400px] h-[520px] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col mb-4 transition-all duration-300 transform scale-100 origin-bottom-right">
          
          {/* Window Header */}
          <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative p-1.5 bg-amber-500 rounded-xl">
                <Sun className="w-5 h-5 text-slate-950 animate-spin-slow" />
                <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-slate-900"></span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">Surya — Solar AI</h3>
                <p className="text-[10px] text-emerald-400 font-mono font-medium uppercase">Active &bull; Indore Advisor</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://wa.me/919876543210?text=Hi!%20I'm%20chatting%20with%20Surya%20but%20would%20like%20to%20connect%20with%20a%20human%20solar%20expert%20from%20Infinity%20Solar."
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider font-mono"
                title="Connect on WhatsApp"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.031 2c-5.51 0-9.99 4.48-9.99 9.99 0 2.07.63 4 1.71 5.61l-1.72 5.15 5.34-1.7c1.54.91 3.32 1.43 5.22 1.43 5.51 0 9.99-4.48 9.99-9.99s-4.48-9.99-9.99-9.99zm5.02 14.18c-.22.62-1.29 1.15-1.78 1.2-1.37.13-3.15-.37-5.26-1.28-3.04-1.31-5.1-4.32-5.26-4.52-.16-.21-1.27-1.7-1.27-3.23 0-1.53.8-2.28 1.09-2.58.29-.3.63-.38.84-.38.22 0 .43.01.62.02.2.01.46-.08.72.54.27.64.93 2.27 1.01 2.43.08.16.14.35.03.57-.11.22-.22.35-.43.59-.21.24-.44.54-.63.73-.21.2-.43.42-.18.84.25.42.1.9 2.11 2.7 1.51 1.35 2.78 1.77 3.17 1.97.39.2.62.17.86-.11.24-.28 1.03-1.2 1.31-1.61.28-.41.56-.34.95-.2.39.14 2.49 1.18 2.61 1.25.12.07.2.11.24.19.04.08.04.46-.18 1.08z" />
                </svg>
                <span>Live Chat</span>
              </a>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Conversation Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'model' && (
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sun className="w-4 h-4 text-amber-500" />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none'
                      : 'bg-slate-950 text-slate-200 border border-slate-800/80 rounded-tl-none whitespace-pre-wrap'
                  }`}
                >
                  {msg.content}
                </div>

                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-850 border border-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-4 h-4 text-slate-400" />
                  </div>
                )}
              </div>
            ))}
            
            {loading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sun className="w-4 h-4 text-amber-500 animate-spin-slow" />
                </div>
                <div className="bg-slate-950 border border-slate-800/80 rounded-2xl rounded-tl-none px-4 py-2.5 text-xs text-slate-400 flex items-center gap-1">
                  <span>Surya is compiling details...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies suggestion box */}
          {messages.length < 5 && (
            <div className="px-4 py-2.5 bg-slate-950/40 border-t border-slate-800/40 flex gap-1.5 overflow-x-auto scrollbar-none">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="flex-shrink-0 px-2.5 py-1 bg-slate-900 hover:bg-slate-850 hover:text-amber-400 border border-slate-800 rounded-full text-[10px] text-slate-300 transition-colors cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Message Input Bar */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Surya about Indore solar pricing..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <button
              onClick={() => handleSend()}
              className="p-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl transition-colors cursor-pointer flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* Floating Trigger Button */}
      <a
        href="https://wa.me/919876543210?text=Hi!%20I'm%20interested%20in%20a%20Solar%20Power%20System%20for%20my%20home/business.%20Please%20provide%20more%20details%20on%20subsidies%20and%20pricing."
        target="_blank"
        rel="noopener noreferrer"
        className="group relative p-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-[0_4px_25px_rgba(16,185,129,0.3)] hover:shadow-[0_4px_30px_rgba(16,185,129,0.5)] cursor-pointer transition-all hover:scale-105 active:scale-95 flex items-center justify-center mb-3"
        title="Chat with Us on WhatsApp"
      >
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M12.031 2c-5.51 0-9.99 4.48-9.99 9.99 0 2.07.63 4 1.71 5.61l-1.72 5.15 5.34-1.7c1.54.91 3.32 1.43 5.22 1.43 5.51 0 9.99-4.48 9.99-9.99s-4.48-9.99-9.99-9.99zm5.02 14.18c-.22.62-1.29 1.15-1.78 1.2-1.37.13-3.15-.37-5.26-1.28-3.04-1.31-5.1-4.32-5.26-4.52-.16-.21-1.27-1.7-1.27-3.23 0-1.53.8-2.28 1.09-2.58.29-.3.63-.38.84-.38.22 0 .43.01.62.02.2.01.46-.08.72.54.27.64.93 2.27 1.01 2.43.08.16.14.35.03.57-.11.22-.22.35-.43.59-.21.24-.44.54-.63.73-.21.2-.43.42-.18.84.25.42.1.9 2.11 2.7 1.51 1.35 2.78 1.77 3.17 1.97.39.2.62.17.86-.11.24-.28 1.03-1.2 1.31-1.61.28-.41.56-.34.95-.2.39.14 2.49 1.18 2.61 1.25.12.07.2.11.24.19.04.08.04.46-.18 1.08z" />
        </svg>
        <span className="absolute right-full mr-3 bg-slate-950 text-white border border-slate-850 px-3 py-1.5 rounded-xl text-xs font-medium tracking-tight whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center gap-1.5 shadow-lg">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>WhatsApp Business Hotline</span>
        </span>
      </a>

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group p-4 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-full shadow-[0_4px_25px_rgba(245,158,11,0.4)] hover:shadow-[0_4px_30px_rgba(245,158,11,0.6)] cursor-pointer transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
        title="Consult with Surya, our AI Solar Advisor"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <MessageSquare className="w-6 h-6" />
            <span className="absolute right-full mr-3 bg-slate-950 text-white border border-slate-850 px-3 py-1.5 rounded-xl text-xs font-medium tracking-tight whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center gap-1 shadow-lg">
              <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
              <span>Ask Surya (AI Advisor)</span>
            </span>
          </>
        )}
      </button>
    </div>
  );
}
