
import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Filter, MoreVertical, CheckCircle, Clock, 
  User, Send, Phone, Video, Paperclip, RefreshCw,
  ShieldAlert, MessageSquare, ArrowLeft, Headphones,
  CheckCircle2, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../utils/api';
import { clsx } from 'clsx';

const AdminSupportHub = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendLoading, setSendLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const fetchChats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/system/support/chats');
      setTickets(res || []);
      if (res.length > 0 && !activeId) setActiveId(res[0].userId);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchChats(); }, []);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [activeId, tickets]);

  const activeChat = tickets.find(t => t.userId === activeId);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim() || !activeId) return;
    setSendLoading(true);
    try {
      await api.post('/system/support/send', { userId: activeId, text: reply, sender: 'admin' });
      setReply("");
      fetchChats();
    } finally {
      setSendLoading(false);
    }
  };

  const handleResolve = async () => {
    if (!activeId) return;
    try {
      await api.post('/system/support/resolve', { userId: activeId });
      fetchChats();
    } catch (e) {}
  };

  return (
    <div className="h-[calc(100vh-140px)] flex bg-white rounded-[44px] border border-slate-100 shadow-sm overflow-hidden font-sans">
      
      {/* 1. LEFT SIDEBAR (QUEUE) */}
      <aside className="w-80 md:w-96 border-r border-slate-50 flex flex-col shrink-0 bg-slate-50/20">
         <div className="p-6 border-b border-slate-50">
            <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter mb-4 flex items-center justify-between">
                Support Hub 
                <span className="text-[10px] bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full border border-indigo-100 font-black tracking-widest">{tickets.filter(t => t.status === 'active').length} ACTIVE</span>
            </h2>
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input className="w-full h-11 pl-11 pr-4 bg-white border border-slate-100 rounded-2xl text-[11px] font-bold outline-none shadow-sm" placeholder="Search associate..." />
            </div>
         </div>

         <div className="flex-grow overflow-y-auto no-scrollbar p-3 space-y-2">
            {loading ? (
              <div className="py-20 text-center"><RefreshCw className="animate-spin mx-auto text-slate-200" size={32}/></div>
            ) : tickets.map((t) => (
                <div 
                    key={t.userId} 
                    onClick={() => setActiveId(t.userId)}
                    className={clsx(
                      "p-4 rounded-[28px] cursor-pointer transition-all border-2",
                      activeId === t.userId ? "bg-white border-indigo-100 shadow-xl" : "border-transparent hover:bg-white hover:shadow-lg"
                    )}
                >
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                            <div className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center font-black italic shadow-lg text-lg", activeId === t.userId ? "bg-slate-950 text-sky-400" : "bg-slate-200 text-slate-500")}>
                                {t.avatar}
                            </div>
                            <div className="overflow-hidden">
                                <h4 className="text-[12px] font-black text-slate-900 uppercase truncate max-w-[120px] leading-none mb-1.5">{t.userName}</h4>
                                <span className="text-[8px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded uppercase">ID: #{t.userId.slice(-6)}</span>
                            </div>
                        </div>
                        <span className="text-[8px] font-black text-slate-300 uppercase">{t.lastTime}</span>
                    </div>
                    <div className="flex justify-between items-center pl-1">
                        <p className="text-[10px] font-bold text-slate-400 truncate w-40 uppercase tracking-tighter italic">"{t.lastMsg}"</p>
                        {t.status === 'active' && <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_8px_indigo]" />}
                    </div>
                </div>
            ))}
         </div>
      </aside>

      {/* 2. CHAT WINDOW (RIGHT) */}
      <main className="flex-grow flex flex-col bg-white min-w-0">
         {activeChat ? (
           <>
              <header className="h-24 px-8 border-b border-slate-50 flex items-center justify-between shrink-0 bg-white relative z-10">
                 <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-3xl bg-slate-900 text-white flex items-center justify-center font-black italic shadow-xl text-xl border-4 border-slate-50">{activeChat.avatar}</div>
                    <div>
                       <h3 className="text-lg font-black text-slate-900 uppercase italic leading-none mb-2">{activeChat.userName}</h3>
                       <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Session Established</span>
                       </div>
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                    <button onClick={handleResolve} className="h-12 px-8 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-sm flex items-center gap-2">
                       <CheckCircle2 size={16}/> Mark Resolved
                    </button>
                    <button className="w-12 h-12 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all border border-slate-100 shadow-sm active:scale-90"><ShieldAlert size={22}/></button>
                 </div>
              </header>

              <div ref={chatRef} className="flex-grow overflow-y-auto no-scrollbar p-10 space-y-10 bg-slate-50/20">
                 {activeChat.messages.map((c: any) => (
                   <div key={c.id} className={clsx("flex flex-col max-w-[80%]", c.sender === 'admin' ? "ml-auto items-end" : "items-start")}>
                      <div className={clsx(
                        "p-6 rounded-[32px] shadow-sm text-xs font-bold leading-relaxed border",
                        c.sender === 'admin' ? "bg-slate-950 text-white border-slate-800 rounded-tr-none" : "bg-white border-slate-100 text-slate-700 rounded-tl-none"
                      )}>
                         {c.text}
                      </div>
                      <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] mt-3 px-3 italic">{c.time}</span>
                   </div>
                 ))}
              </div>

              <div className="p-8 bg-white border-t border-slate-50 shrink-0">
                 <form onSubmit={handleSend} className="bg-slate-50 border border-slate-200 rounded-[32px] p-2 focus-within:ring-4 focus-within:ring-indigo-50 transition-all shadow-inner">
                    <textarea 
                      className="w-full bg-transparent border-none outline-none text-sm font-bold text-slate-800 p-4 resize-none h-24 no-scrollbar placeholder:text-slate-300"
                      placeholder="Type your response to associate... (PKR, Earning, Work queries)"
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                    ></textarea>
                    <div className="flex justify-between items-center px-4 pb-2">
                        <div className="flex gap-4 text-slate-300">
                           <button type="button" className="hover:text-indigo-600 transition-all"><Paperclip size={20}/></button>
                           <button type="button" className="hover:text-indigo-600 transition-all"><Clock size={20}/></button>
                        </div>
                        <button type="submit" disabled={sendLoading || !reply.trim()} className="h-12 px-10 bg-[#4A6CF7] hover:bg-slate-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all flex items-center gap-3">
                           {sendLoading ? <RefreshCw className="animate-spin" size={16}/> : <><Send size={16} /> Deploy Reply</>}
                        </button>
                    </div>
                 </form>
              </div>
           </>
         ) : (
           <div className="flex-grow flex flex-col items-center justify-center opacity-40 text-center p-20">
              <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center text-slate-200 shadow-inner mb-10"><MessageSquare size={48}/></div>
              <h3 className="text-3xl font-black text-slate-400 uppercase italic tracking-tighter">Terminal Idle.</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">Select an active ticket from the registry to initialize support logic.</p>
           </div>
         )}
      </main>
    </div>
  );
};

export default AdminSupportHub;
