import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Paperclip, Headphones, Sparkles, Loader2, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { clsx } from 'clsx';

const LiveChatWidget = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isAiMode, setIsAiMode] = useState(true);
  const [chatHistory, setChatHistory] = useState([
    { sender: 'admin', text: 'Salam! Noor Support Center mein khushamdeed. Hum aap ki kaisay madad kar saktay hain?', time: 'Just Now' }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isOpen, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const userMsg = { sender: 'user', text: message, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setChatHistory(prev => [...prev, userMsg]);
    const currentMsg = message;
    setMessage("");
    setLoading(true);

    try {
      if (isAiMode) {
        const res = await api.post('/system/support/ai-query', { message: currentMsg, userId: user?.id });
        setChatHistory(prev => [...prev, { sender: 'admin', text: res.reply, time: 'Now' }]);
      } else {
        await api.post('/system/support/send', { userId: user?.id, text: currentMsg, sender: 'user' });
        // Real-time admin response simulation
        setTimeout(() => {
           setChatHistory(prev => [...prev, { sender: 'admin', text: 'Hamara staff associate abhi online hai. Please thora wait karein.', time: 'Now' }]);
        }, 3000);
      }
    } catch (err) {
      setChatHistory(prev => [...prev, { sender: 'admin', text: 'Sorry, connection error. Please try again.', time: 'Error' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[200] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white w-[320px] md:w-[380px] h-[520px] rounded-[40px] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col mb-4 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-indigo-600 p-6 text-white relative">
               <div className="absolute top-[-10%] right-[-10%] p-6 opacity-10 rotate-12 scale-150"><Zap size={60} fill="currentColor" /></div>
               <div className="flex justify-between items-start relative z-10">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20">
                        <Headphones size={24} />
                     </div>
                     <div>
                        <h3 className="text-lg font-black italic uppercase tracking-tighter leading-none">Support.</h3>
                        <p className="text-[8px] font-bold uppercase tracking-widest text-indigo-100 mt-1.5 flex items-center gap-1.5">
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active Node
                        </p>
                     </div>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all"><X size={20}/></button>
               </div>

               {/* Mode Switcher */}
               <div className="flex mt-6 bg-black/10 p-1 rounded-xl border border-white/5 relative z-10">
                  <button onClick={() => setIsAiMode(true)} className={clsx("flex-1 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all", isAiMode ? "bg-white text-indigo-600 shadow-sm" : "text-indigo-100")}>AI Assistant</button>
                  <button onClick={() => setIsAiMode(false)} className={clsx("flex-1 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all", !isAiMode ? "bg-white text-indigo-600 shadow-sm" : "text-indigo-100")}>Admin Agent</button>
               </div>
            </div>

            {/* Chat Content */}
            <div ref={scrollRef} className="flex-grow overflow-y-auto no-scrollbar p-6 space-y-6 bg-slate-50/50">
               {chatHistory.map((msg, i) => (
                 <div key={i} className={clsx("flex flex-col", msg.sender === 'user' ? "items-end" : "items-start")}>
                    <div className={clsx(
                      "p-4 rounded-[24px] text-xs font-bold leading-relaxed shadow-sm max-w-[85%]",
                      msg.sender === 'user' ? "bg-slate-900 text-white rounded-tr-none" : "bg-white border border-slate-100 text-slate-700 rounded-tl-none"
                    )}>
                       {msg.text}
                    </div>
                    <span className="text-[7px] font-black text-slate-300 uppercase mt-2 px-1">{msg.time}</span>
                 </div>
               ))}
               {loading && (
                 <div className="flex items-center gap-2 text-indigo-600 p-2">
                    <Loader2 size={12} className="animate-spin" />
                    <span className="text-[8px] font-black uppercase tracking-widest">AI Hub responding...</span>
                 </div>
               )}
            </div>

            {/* Input Bar */}
            <div className="p-4 bg-white border-t border-slate-100">
               <form onSubmit={handleSend} className="relative group">
                  <input 
                    value={message} onChange={e => setMessage(e.target.value)}
                    className="w-full h-14 pl-6 pr-16 bg-slate-50 border border-slate-100 rounded-[24px] text-sm font-bold outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50/30 transition-all"
                    placeholder="Type your query..." 
                  />
                  <button type="submit" disabled={!message.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-all disabled:opacity-30">
                     <Send size={18} />
                  </button>
               </form>
               <p className="text-[7px] text-center text-slate-400 font-bold uppercase tracking-widest mt-3">Verified Noor AI Node v3.3</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "w-16 h-16 rounded-[24px] shadow-2xl flex items-center justify-center transition-all duration-500 transform hover:scale-110 active:scale-95 border-4 border-white",
          isOpen ? "bg-slate-900 rotate-90" : "bg-indigo-600"
        )}
      >
        {isOpen ? <X size={28} className="text-white" /> : <MessageCircle size={32} className="text-white fill-white shadow-inner" />}
        {!isOpen && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 border-2 border-white rounded-full flex items-center justify-center text-[10px] font-bold text-white animate-bounce shadow-lg">
                1
            </span>
        )}
      </button>
    </div>
  );
};

export default LiveChatWidget;