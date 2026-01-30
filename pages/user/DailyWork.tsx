
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Clock, CheckCircle2, ShieldCheck, 
  Loader2, X, ChevronLeft, Briefcase, RefreshCw,
  ArrowRight, History, ExternalLink,
  ChevronRight, Play, FileCheck, Info,
  Target, FileText, ListChecks, Smartphone,
  XCircle, AlertCircle, Flame, Lock, Trophy, BarChart3,
  ArrowUpRight, Sparkles, Timer, Calendar
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { clsx } from 'clsx';
import { SubmissionModal } from '../../components/user/SubmissionModal';
import StreakWidget from '../../components/user/StreakWidget';

const TaskTimer = ({ seconds, onComplete }: { seconds: number, onComplete: () => void }) => {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isLow = timeLeft < 300; // Under 5 minutes

  return (
    <div className={clsx(
      "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors",
      isLow ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-indigo-50 text-indigo-600 border-indigo-100"
    )}>
       <Timer size={14} className={clsx(isLow && "animate-pulse")} />
       <span className="text-[11px] font-black font-mono">{formatTime(timeLeft)}</span>
    </div>
  );
};

const DailyWork = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<any[]>([]);
  const [streak, setStreak] = useState(0);
  const [limits, setLimits] = useState({ total: 0, used: 0, remaining: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTask, setActiveTask] = useState<any>(null);
  const [tab, setTab] = useState<'work' | 'history'>('work');

  const fetchWorkData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/work/tasks');
      setTasks(res.tasks || []);
      setStreak(res.streak || 0);
      setLimits(res.limitInfo || { total: 0, used: 0, remaining: 0 });
    } catch (e) {
      console.error("Work Hub error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWorkData(); }, []);

  const handleSubmitWork = async (evidence: string) => {
    try {
      await api.post('/work/complete', { 
        taskId: activeTask.id, 
        evidence, 
        taskTitle: activeTask.title, 
        reward: activeTask.reward 
      });
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.8 } });
      setActiveTask(null);
      fetchWorkData();
    } catch (err: any) {
      alert(err.message || "Sync error.");
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto pb-32 space-y-6 animate-fade-in px-2">
      
      {/* 1. STREAK & STATS MODULE */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8">
           <section className="bg-slate-950 p-6 md:p-8 rounded-[44px] relative overflow-hidden flex flex-col md:flex-row items-center gap-8 group shadow-2xl border border-white/5 h-full">
              <div className="absolute top-0 right-0 p-8 opacity-10 scale-150 rotate-12 text-indigo-500 pointer-events-none group-hover:rotate-45 transition-transform duration-[3s]"><Zap size={120} /></div>
              
              <div className="relative shrink-0">
                 <motion.div 
                   animate={{ scale: [1, 1.05, 1] }} 
                   transition={{ repeat: Infinity, duration: 3 }} 
                   className="w-20 h-20 bg-indigo-600 rounded-[30px] flex flex-col items-center justify-center text-white border-2 border-white/20 shadow-xl shadow-indigo-500/20"
                 >
                    <Flame size={28} fill="currentColor" className="text-amber-400" />
                    <span className="text-xl font-black italic">{streak}</span>
                 </motion.div>
              </div>

              <div className="flex-grow space-y-4 text-center md:text-left">
                 <div>
                    <h2 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter leading-none">Yield Console.</h2>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Authorized work nodes assigned to your station.</p>
                 </div>
                 
                 <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white/5 p-2.5 rounded-2xl border border-white/5 text-center">
                       <p className="text-[7px] font-black text-slate-500 uppercase mb-1">ALLOCATED</p>
                       <p className="text-xs font-black text-white">{limits.total}</p>
                    </div>
                    <div className="bg-white/5 p-2.5 rounded-2xl border border-white/5 text-center">
                       <p className="text-[7px] font-black text-slate-500 uppercase mb-1">PROCESSED</p>
                       <p className="text-xs font-black text-white">{limits.used}</p>
                    </div>
                    <div className="bg-white/5 p-2.5 rounded-2xl border border-white/5 text-center">
                       <p className="text-[7px] font-black text-slate-500 uppercase mb-1">REMAINING</p>
                       <p className="text-xs font-black text-sky-400">{limits.remaining}</p>
                    </div>
                 </div>
              </div>
           </section>
        </div>
        <div className="md:col-span-4">
           <StreakWidget />
        </div>
      </div>

      {/* 2. TAB CONTROL */}
      <div className="flex bg-white p-1.5 rounded-[28px] border border-slate-100 shadow-sm w-fit gap-1 mx-auto md:mx-0">
         <button onClick={() => setTab('work')} className={clsx("px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all", tab === 'work' ? "bg-slate-900 text-white shadow-xl" : "text-slate-400")}>Available</button>
         <button onClick={() => setTab('history')} className={clsx("px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all", tab === 'history' ? "bg-slate-900 text-white shadow-xl" : "text-slate-400")}>Log</button>
      </div>

      <AnimatePresence mode="wait">
        {tab === 'work' ? (
          <motion.div key="work" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {loading ? (
               <div className="col-span-full py-32 text-center flex flex-col items-center gap-4">
                  <RefreshCw className="animate-spin text-indigo-500" size={40} />
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Querying Registry...</p>
               </div>
             ) : tasks.length > 0 ? tasks.map((task) => (
                <div key={task.id} className="relative group">
                   <div className={clsx(
                     "bg-white p-5 rounded-[40px] border transition-all flex flex-col h-[200px] shadow-sm hover:shadow-xl",
                     task.myStatus === 'completed' ? "border-emerald-100 bg-emerald-50/10" : "border-slate-100"
                   )}>
                      <div className="flex justify-between items-start mb-4">
                         <div className="w-11 h-11 bg-slate-950 text-sky-400 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
                            <Zap size={20} fill="currentColor" />
                         </div>
                         <div className="text-right">
                            <p className="text-lg font-black text-slate-900 italic leading-none mb-1">Rs {task.reward}</p>
                            <div className="flex flex-col items-end gap-1">
                               <span className="text-[8px] font-black uppercase bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md border border-indigo-100 italic">{task.plan} STATION</span>
                               {task.validityDays && task.myStatus !== 'completed' && (
                                 <span className={clsx(
                                   "text-[7px] font-black uppercase tracking-widest flex items-center gap-1.5 px-2 py-0.5 rounded-md border",
                                   task.validityDays < 5 ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-slate-50 text-slate-400 border-slate-100"
                                 )}>
                                    <Calendar size={10} /> {task.validityDays}D LEFT
                                 </span>
                               )}
                            </div>
                         </div>
                      </div>
                      <h4 className="text-[12px] font-black text-slate-800 uppercase italic mb-1.5 truncate">{task.title}</h4>
                      <p className="text-[10px] text-slate-400 font-medium line-clamp-2 italic mb-6 leading-relaxed">"{task.instruction}"</p>
                      
                      <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                         {task.myStatus === 'completed' ? (
                           <div className="flex items-center gap-1.5 text-emerald-500 text-[9px] font-black uppercase tracking-widest">
                              <CheckCircle2 size={14} /> Synced
                           </div>
                         ) : (
                           <div className="flex items-center gap-3">
                              <button 
                                onClick={() => setActiveTask(task)}
                                className="h-10 px-6 bg-slate-900 text-white rounded-[18px] font-black text-[9px] uppercase tracking-widest transition-all shadow-lg active:scale-95 group-hover:bg-indigo-600"
                              >
                                Process
                              </button>
                              {activeTask?.id === task.id && task.timeLimitSeconds && (
                                <TaskTimer seconds={task.timeLimitSeconds} onComplete={() => { alert("Session Terminated. Buffer Timeout."); setActiveTask(null); }} />
                              )}
                           </div>
                         )}
                         <span className="text-[8px] font-black text-slate-200 uppercase tracking-widest">ID-{task.id.slice(-4)}</span>
                      </div>
                   </div>

                   {task.isLocked && task.myStatus !== 'completed' && (
                     <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-[1px] rounded-[40px] flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-indigo-100">
                        <Lock size={20} className="text-slate-400 mb-3" />
                        <h4 className="text-[11px] font-black text-slate-800 uppercase mb-1">STATION LOCKED</h4>
                        <p className="text-[8px] font-bold text-slate-400 uppercase leading-relaxed mb-4">Upgrade to activate node</p>
                        <button onClick={() => navigate('/user/plans')} className="h-9 px-6 bg-indigo-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-xl">Upgrade</button>
                     </div>
                   )}
                </div>
             )) : (
               <div className="col-span-full py-40 text-center flex flex-col items-center opacity-30">
                  <Briefcase size={64} className="text-slate-200 mb-6" />
                  <p className="text-[11px] font-black uppercase tracking-[0.4em]">Inventory Exhausted.</p>
               </div>
             )}
          </motion.div>
        ) : (
          <motion.div key="history" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
             {(user?.workSubmissions || []).length > 0 ? (
               <div className="bg-white rounded-[44px] border border-slate-100 shadow-sm overflow-hidden p-2">
                 <div className="divide-y divide-slate-50">
                   {(user?.workSubmissions || []).map((sub: any, idx: number) => (
                      <motion.div 
                        key={idx} 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ delay: idx * 0.03 }}
                        className="p-5 flex items-center justify-between group hover:bg-slate-50 transition-all rounded-[32px]"
                      >
                         <div className="flex items-center gap-5">
                            <div className={clsx(
                              "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110",
                              sub.status === 'approved' ? "bg-emerald-50 text-emerald-600" : sub.status === 'rejected' ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
                            )}>
                               {sub.status === 'approved' ? <CheckCircle2 size={24}/> : sub.status === 'rejected' ? <XCircle size={24}/> : <Clock size={24}/>}
                            </div>
                            <div>
                               <h4 className="font-black text-slate-800 text-[12px] uppercase truncate max-w-[200px] mb-1.5">{sub.taskTitle}</h4>
                               <div className="flex items-center gap-2">
                                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest italic">{new Date(sub.timestamp).toLocaleDateString()}</span>
                                  <span className="w-1 h-1 rounded-full bg-slate-200" />
                                  <span className="text-[8px] font-black text-indigo-400 uppercase">NODE: {sub.id?.slice(-8)}</span>
                               </div>
                            </div>
                         </div>
                         <div className="text-right">
                            <p className="font-black text-sm text-slate-900 italic mb-1.5 leading-none">Rs {sub.reward}</p>
                            <span className={clsx(
                              "text-[8px] font-black uppercase px-3 py-1 rounded-lg border shadow-sm",
                              sub.status === 'approved' ? "bg-green-50 text-green-600 border-green-100" : 
                              sub.status === 'pending' ? "bg-amber-50 text-amber-600 border-amber-100" : 
                              "bg-rose-50 text-rose-600 border-rose-100"
                            )}>{sub.status}</span>
                         </div>
                      </motion.div>
                   ))}
                 </div>
               </div>
             ) : (
               <div className="py-40 text-center opacity-30 flex flex-col items-center bg-white rounded-[44px] border border-dashed border-slate-200">
                  <History size={48} className="text-slate-200 mb-6" />
                  <p className="text-[11px] font-black uppercase tracking-[0.4em]">Ledger Stream Empty.</p>
               </div>
             )}
          </motion.div>
        )}
      </AnimatePresence>

      <SubmissionModal 
        isOpen={!!activeTask} 
        onClose={() => setActiveTask(null)} 
        task={activeTask} 
        onSubmit={handleSubmitWork}
      />
    </div>
  );
};

export default DailyWork;
