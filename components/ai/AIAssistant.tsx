import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Headphones, X, Send, ShieldCheck, MessageSquare, 
  ChevronRight, HelpCircle, Loader2, BadgeCheck, 
  Smartphone, Activity, Clock
} from 'lucide-react';
import { api } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { clsx } from 'clsx';

export const AIAssistant = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'admin', text: string, time: string }[]>([
    { role: 'admin', text: "Assalam-o-Alaikum! Noor Official V3 Support Hub mein khush-amdeed. Humari team aapki help ke liye online hai.", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = { 
      role: 'user' as const, 
      text: input, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Manual Registry Sync: Sending message to admin queue
      await api.post('/auth/support-message', { 
        userId: user?.id, 
        message: userMsg.text,
        userName: user?.name 
      });

      // Simulation of live agent response (Manual Support Experience)
      setTimeout(() => {
        setLoading(false);
        setMessages(prev => [...prev, {
          role: 'admin',
          text: "Ji bilkul, aapka message record kar liya gaya hai. Support Agent aap se jald hi rabta karega.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 1500);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'admin', text: 'Gateway Error: Support registry offline.', time: 'Error' }]);
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-20 lg:bottom-8 right-6 z-[999]">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-18 right-0 w-[320px] md:w-[380px] bg-white rounded-[44px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.25)] border border-slate-100 overflow-hidden flex flex-col"
          >
            {/* Header: Manual Hub Identity */}
            <div className="bg-slate-950 p-6 text-white flex items-center justify-between relative overflow-hidden shrink-0">
              <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12"><Headphones size={40} /></div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 bg-indigo-600 rounded-[18px] flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <Headphones size={24} />
                </div>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest leading-none mb-1.5">Noor Care Hub</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">Manual Node Online</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-all relative z-10"><X size={20} /></button>
            </div>

            {/* Chat Body */}
            <div className="h-[350px] overflow-y-auto p-6 space-y-5 bg-slate-50/50 no-scrollbar">
              {messages.map((m, i) => (
                <div key={i} className={clsx("flex flex-col", m.role === 'user' ? "items-end" : "items-start")}>
                  <div className={clsx(
                    "max-w-[85%] p-4 text-[11px] font-bold leading-relaxed shadow-sm transition-all",
                    m.role === 'user' 
                      ? "bg-slate-900 text-white bubble-user shadow-slate-200" 
                      : "bg-white text-slate-700 border border-slate-100 bubble-admin"
                  )}>
                    {m.text}
                  </div>
                  <span className="text-[6px] font-black text-slate-300 uppercase tracking-tighter mt-1.5 px-2">{m.time}</span>
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-start">
                   <div className="bg-white px-5 py-3 rounded-2xl bubble-admin border border-slate-100 flex items-center gap-1 shadow-sm">
                      <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce" />
                   </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-5 bg-white border-t border-slate-100">
               <div className="flex gap-2 bg-slate-50 p-2 rounded-[24px] border border-slate-100 shadow-inner focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-50/50 transition-all">
                  <input 
                    value={input} 
                    onChange={e => setInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSend()}
                    placeholder="Type message for support agent..."
                    className="flex-grow bg-transparent px-4 text-xs font-bold outline-none"
                  />
                  <button 
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    className="w-11 h-11 bg-slate-900 text-white rounded-[18px] flex items-center justify-center hover:bg-indigo-600 transition-all disabled:opacity-30 shadow-xl active:scale-95 shrink-0"
                  >
                    <Send size={18} />
                  </button>
               </div>
               <div className="flex items-center justify-center gap-2 mt-4 opacity-20">
                  <ShieldCheck size={12} />
                  <p className="text-[7px] font-black uppercase tracking-[0.4em]">Direct Peer-to-Peer Relay</p>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "w-16 h-16 rounded-[24px] flex items-center justify-center shadow-2xl transition-all relative overflow-hidden group",
          isOpen ? "bg-rose-500 text-white" : "bg-slate-950 text-white"
        )}
      >
        <div className="absolute inset-0 bg-indigo-600 opacity-0 group-hover:opacity-20 transition-opacity" />
        {isOpen ? <X size={26} /> : (
          <div className="relative">
             <MessageSquare size={28} fill="currentColor" />
             <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-400 rounded-full animate-ping" />
          </div>
        )}
      </motion.button>
    </div>
  );
};