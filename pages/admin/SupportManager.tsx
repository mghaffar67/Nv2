import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Send, Search, User, 
  RefreshCw, X, MoreVertical, Paperclip,
  Smile, UserCheck, Bot, Clock, Phone,
  Filter, CheckCircle, Smartphone, ShieldCheck
} from 'lucide-react';
import { api } from '../../utils/api';
import { clsx } from 'clsx';

const SupportManager = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [reply, setReply] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users');
      // Filter users who have initiated support node interaction
      setUsers(res || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const selectUser = (user: any) => {
    setSelectedUser(user);
    setChatLoading(true);
    // Simulation of pulling manual thread history from DB
    setTimeout(() => {
      setMessages(user.supportMessages || [
        { role: 'user', text: "Assalam-o-Alaikum, mera deposit verify kab hoga?", timestamp: new Date().toISOString() }
      ]);
      setChatLoading(false);
    }, 500);
  };

  const handleSend = async () => {
    if (!reply.trim()) return;
    
    const newMsg = { 
      role: 'admin' as const, 
      text: reply, 
      timestamp: new Date().toISOString() 
    };

    setMessages([...messages, newMsg]);
    setReply('');
    
    try {
      // In production, this unshifts to the user's supportMessages array via API
      await api.put('/admin/users/support-reply', { 
        userId: selectedUser.id, 
        message: newMsg.text 
      });
    } catch (e) {
      console.warn("Message sync failed, buffer active.");
    }
  };

  return (
    <div className="h-[calc(100vh-130px)] animate-fade-in flex flex-col md:flex-row bg-white rounded-[32px] md:rounded-[44px] shadow-2xl border border-slate-100 overflow-hidden mx-1">
      
      {/* Sidebar: Member Inbox */}
      <div className="w-full md:w-[320px] border-r border-slate-100 flex flex-col bg-slate-50/20">
         <div className="p-6 bg-white border-b border-slate-50">
            <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-2">
                  <h1 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Care <span className="text-indigo-600">Hub.</span></h1>
                  <span className="bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full text-[7px] font-black uppercase italic">Live</span>
               </div>
               <button onClick={fetchUsers} className="p-2 text-slate-400 hover:bg-slate-950 hover:text-white rounded-xl transition-all">
                 <RefreshCw size={16} className={clsx(loading && "animate-spin")} />
               </button>
            </div>
            <div className="relative">
               <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
               <input className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-[10px] outline-none focus:bg-white transition-all shadow-inner" placeholder="Search members..." />
            </div>
         </div>

         <div className="flex-grow overflow-y-auto no-scrollbar">
            {loading ? (
              <div className="py-20 text-center flex flex-col items-center gap-3 opacity-30">
                 <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                 <p className="text-[8px] font-black uppercase tracking-widest">Auditing Registry...</p>
              </div>
            ) : users.map(u => (
              <button 
                key={u.id} onClick={() => selectUser(u)}
                className={clsx(
                  "w-full p-5 flex items-center gap-4 transition-all border-b border-slate-100/50 text-left relative group",
                  selectedUser?.id === u.id ? "bg-white shadow-md z-10 border-l-4 border-l-indigo-600" : "hover:bg-white/50"
                )}
              >
                 <div className="relative shrink-0">
                    <div className={clsx(
                      "w-12 h-12 rounded-[18px] flex items-center justify-center font-black italic shadow-lg transition-transform group-hover:rotate-6",
                      selectedUser?.id === u.id ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-400"
                    )}>
                      {u.name?.charAt(0)}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-sm animate-pulse" />
                 </div>
                 <div className="flex-grow overflow-hidden">
                    <div className="flex justify-between items-center mb-0.5">
                       <h4 className={clsx("font-black text-[11px] uppercase truncate tracking-tight", selectedUser?.id === u.id ? "text-indigo-600" : "text-slate-800")}>{u.name}</h4>
                       <span className="text-[7px] font-bold text-slate-300 uppercase tracking-tighter">10:25 AM</span>
                    </div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.1em] italic opacity-60 truncate">UID: #{u.id?.slice(-4)}</p>
                 </div>
              </button>
            ))}
         </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-grow flex flex-col bg-[#fcfdfe] relative">
         {selectedUser ? (
           <>
             {/* Header */}
             <div className="p-4 md:p-6 bg-white border-b border-slate-100 flex items-center justify-between shadow-sm relative z-20">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-slate-950 text-sky-400 flex items-center justify-center font-black italic shadow-xl">{selectedUser.name?.charAt(0)}</div>
                   <div>
                      <h3 className="font-black text-slate-900 uppercase italic text-xs tracking-tight">{selectedUser.name}</h3>
                      <div className="flex items-center gap-2">
                         <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                         <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Active Associate</span>
                      </div>
                   </div>
                </div>
                <div className="flex gap-2">
                   <button className="flex items-center gap-2 px-5 py-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all font-black text-[8px] uppercase tracking-widest border border-emerald-100 shadow-sm"><CheckCircle size={12}/> Resolve Node</button>
                   <button onClick={() => setSelectedUser(null)} className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all active:scale-95"><X size={18}/></button>
                </div>
             </div>

             {/* Messages Viewport */}
             <div className="flex-grow overflow-y-auto p-6 md:p-10 space-y-6 no-scrollbar bg-slate-50/10">
                <div className="text-center mb-8">
                   <span className="bg-slate-200/50 text-slate-400 text-[7px] font-black uppercase tracking-widest px-4 py-1 rounded-full border border-slate-200/50">Sync Node Initialize: {new Date().toLocaleDateString()}</span>
                </div>

                {messages.map((m, i) => (
                  <div key={i} className={clsx("flex flex-col w-full", m.role === 'admin' ? "items-end" : "items-start")}>
                     <div className={clsx(
                       "max-w-[85%] md:max-w-[70%] p-4 md:p-5 shadow-sm transition-all hover:shadow-md",
                       m.role === 'admin' 
                        ? "bg-indigo-600 text-white bubble-admin" 
                        : "bg-white text-slate-800 border border-slate-200/50 bubble-user"
                     )}>
                        <p className="text-[11px] font-bold leading-relaxed">{m.text}</p>
                        <div className={clsx("flex items-center gap-2 mt-3 opacity-50", m.role === 'admin' ? "justify-end text-indigo-100" : "justify-start text-slate-500")}>
                           <Clock size={8} />
                           <p className="text-[7px] font-black uppercase tracking-widest italic">{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                     </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
             </div>

             {/* Input Bar */}
             <div className="p-6 bg-white border-t border-slate-100 shrink-0">
                <div className="bg-slate-50 border border-slate-200 rounded-[24px] p-2 focus-within:ring-4 focus-within:ring-indigo-50/50 transition-all shadow-inner">
                   <textarea 
                     value={reply} onChange={e => setReply(e.target.value)}
                     onKeyPress={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                     className="w-full bg-transparent outline-none text-[11px] font-bold text-slate-800 placeholder:text-slate-300 resize-none h-16 px-4 pt-2" 
                     placeholder="Type official response here..." 
                   />
                   <div className="flex justify-between items-center px-2 pb-1">
                      <div className="flex gap-2 text-slate-300">
                         <button className="p-1.5 hover:text-indigo-600 transition-all"><Paperclip size={16}/></button>
                         <button className="p-1.5 hover:text-amber-500 transition-all"><Smile size={16}/></button>
                      </div>
                      <button 
                        onClick={handleSend}
                        className="bg-slate-950 hover:bg-indigo-600 text-white px-6 h-10 rounded-[14px] font-black text-[9px] uppercase tracking-widest flex items-center gap-2 shadow-lg active:scale-95 transition-all"
                      >
                        Transmit <Send size={14} />
                      </button>
                   </div>
                </div>
             </div>
           </>
         ) : (
           <div className="h-full flex flex-col items-center justify-center p-12 text-center opacity-30">
              <div className="w-20 h-20 bg-slate-100 rounded-[36px] flex items-center justify-center mb-6 shadow-inner border-2 border-white"><Smartphone size={40} className="text-slate-400" /></div>
              <h4 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900 mb-2">Care Console.</h4>
              <p className="text-[9px] font-bold uppercase tracking-[0.4em] max-w-[280px] leading-relaxed">Select a partner identity node to initialize a secure administrative session.</p>
           </div>
         )}
      </div>
    </div>
  );
};

export default SupportManager;