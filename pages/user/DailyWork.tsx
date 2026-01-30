import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Clock, CheckCircle2, ShieldCheck, 
  Loader2, X, ChevronLeft, Briefcase, RefreshCw,
  ArrowRight, History, ExternalLink,
  ChevronRight, Play, FileCheck, Info,
  Target, FileText, ListChecks, Smartphone,
  XCircle, AlertCircle, Flame, Lock, Trophy, BarChart3,
  ArrowUpRight, Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { clsx } from 'clsx';
import { SubmissionModal } from '../../components/user/SubmissionModal';
import StreakWidget from '../../components/user/StreakWidget';

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
      console.error("Task Center Offline.");
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
      alert(err.message || "Submission Failed.");
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto pb-32 space-y-6 animate-fade-in px-2">
      
      {/* 1. STREAK & CHECK-IN MODULE */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8">
           <section className="bg-slate-950 p-8 rounded-[44px] relative overflow-hidden flex flex-col md:flex-row items-center gap-8 group shadow-2xl border border-white/5 h-full">
              <div className="absolute top-0 right-0 p-8 opacity-10 scale-150 rotate-12 text-rose-500 pointer-events-none group-hover:rotate-45 transition-transform duration-[3s]"><Flame size={120} /></div>
              
              <div className="relative shrink-0">
                 <motion.div 
                   animate={{ 
                     scale: [1, 1.05, 1],
                     boxShadow: ["0 0 0px rgba(244,63,94,0)", "0 0 30px rgba(244,63,94,0.3)", "0 0 0px rgba(244,63,94,0)"]
                   }} 
                   transition={{ repeat: Infinity, duration: 3 }} 
                   className="w-20 h-20 bg-rose-600 rounded-[30px] flex flex-col items-center justify-center text-white border-2 border-white/20"
                 >
                    <Flame size={28} fill="currentColor" />
                    <span className="text-xl font-black italic">{streak}</span>
                 </motion.div>
              </div>

              <div className="flex-grow space-y-4 text-center md:text-left">
                 <div>
                    <h2 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter leading-none">Task Dashboard.</h2>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Complete your daily cycle to receive rewards.</p>
                 </div>
                 
                 <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white/5 p-2.5 rounded-2xl border border-white/5 text-center">
                       <p className="text-[7px] font-black text-slate-500 uppercase mb-1">LIMIT</p>
                       <p className="text-xs font-black text-white">{limits.total}</p>
                    </div>
                    <div className="bg-white/5 p-2.5 rounded-2xl border border-white/5 text-center">
                       <p className="text-[7px] font-black text-slate-500 uppercase mb-1">DONE</p>
                       <p className="text-xs font-black text-white">{limits.used}</p>
                    </div>
                    <div className="bg-white/5 p-2.5 rounded-2xl border border-white/5 text-center">
                       <p className="text-[7px] font-black text-slate-500 uppercase mb-1">AVAIL</p>
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
         <button onClick={() => setTab('work')} className={clsx("px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all", tab === 'work' ? "bg-slate-900 text-white shadow-xl" : "text-slate-400")}>Daily Tasks</button>
         <button onClick={() => setTab('history')} className={clsx("px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all", tab === 'history' ? "bg-slate-900 text-white shadow-xl" : "text-slate-400")}>Proof of Work</button>
      </div>

      <AnimatePresence mode="wait">
        {tab === 'work' ? (
          <motion.div key="work" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {loading ? (
               <div className="col-span-full py-32 text-center flex flex-col items-center gap-4">
                  <RefreshCw className="animate-spin text-indigo-500" size={40} />
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Scanning System Registry...</p>
               </div>
             ) : tasks.map((task) => (
                <div key={task.id} className="relative group">
                   <div className={clsx(
                     "bg-white p-6 rounded-[36px] border transition-all flex flex-col h-[210px]",
                     task.myStatus === 'completed' ? "border-emerald-200 bg-emerald-50/10" : "border-slate-100 shadow-sm hover:shadow-lg"
                   )}>
                      <div className="flex justify-between items-start mb-4">
                         <div className="w-10 h-10 bg-slate-950 text-sky-400 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                            <Zap size={18} fill="currentColor" />
                         </div>
                         <div className="text-right">
                            <p className="text-base font-black text-slate-900 italic leading-none mb-1">Rs {task.reward}</p>
                            <span className="text-[7px] font-black uppercase bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md border border-indigo-100 italic">{task.plan}</span>
                         </div>
                      </div>
                      <h4 className="text-[11px] font-black text-slate-800 uppercase italic mb-2 truncate">{task.title}</h4>
                      <p className="text-[9px] text-slate-400 font-medium line-clamp-2 italic mb-6 leading-relaxed">"{task.instruction}"</p>
                      
                      <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                         {task.myStatus === 'completed' ? (
                           <div className="flex items-center gap-1.5 text-emerald-500 text-[8px] font-black uppercase">
                              <CheckCircle2 size={12} /> Verified
                           </div>
                         ) : (
                           <button 
                             onClick={() => setActiveTask(task)}
                             className="h-9 px-5 bg-slate-950 text-white rounded-xl font-black text-[8px] uppercase tracking-widest transition-all shadow-lg active:scale-95"
                           >
                              Start
                           </button>
                         )}
                         <span className="text-[7px] font-bold text-slate-200 uppercase">#{task.id.slice(-4)}</span>
                      </div>
                   </div>

                   {task.isLocked && task.myStatus !== 'completed' && (
                     <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] rounded-[36px] flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-indigo-50">
                        <Lock size={18} className="text-slate-400 mb-2" />
                        <h4 className="text-[10px] font-black text-slate-800 uppercase mb-1">Locked.</h4>
                        <p className="text-[7px] font-bold text-slate-400 uppercase leading-relaxed mb-3">Upgrade Account to unlock</p>
                        <button onClick={() => navigate('/user/plans')} className="h-8 px-4 bg-indigo-600 text-white rounded-lg font-black text-[7px] uppercase tracking-widest shadow-md">Upgrade</button>
                     </div>
                   )}
                </div>
             ))}
          </motion.div>
        ) : (
          <motion.div key="history" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
             {loading ? (
               <div className="py-32 text-center flex flex-col items-center gap-4">
                  <RefreshCw className="animate-spin text-indigo-500" size={40} />
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Syncing History...</p>
               </div>
             ) : (user?.workSubmissions || []).length > 0 ? (
               <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden p-2">
                 <div className="space-y-1">
                   {(user?.workSubmissions || []).map((sub: any, idx: number) => (
                      <motion.div 
                        key={idx} 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ delay: idx * 0.03 }}
                        className="p-5 flex items-center justify-between group hover:bg-slate-50 transition-all rounded-[28px]"
                      >
                         <div className="flex items-center gap-4">
                            <div className={clsx(
                              "w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110",
                              sub.status === 'approved' ? "bg-emerald-50 text-emerald-600" : sub.status === 'rejected' ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
                            )}>
                               {sub.status === 'approved' ? <CheckCircle2 size={20}/> : sub.status === 'rejected' ? <XCircle size={20}/> : <Clock size={20}/>}
                            </div>
                            <div>
                               <h4 className="font-black text-slate-800 text-[11px] uppercase truncate max-w-[200px] mb-1">{sub.taskTitle}</h4>
                               <p className="text-[8px] font-bold text-slate-400 uppercase italic">Ref: {sub.id?.slice(-8)} • {new Date(sub.timestamp).toLocaleDateString()}</p>
                            </div>
                         </div>
                         <div className="text-right">
                            <p className="font-black text-xs text-slate-900 italic mb-1">Rs {sub.reward}</p>
                            <span className={clsx(
                              "text-[7px] font-black uppercase px-2 py-0.5 rounded-md border",
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
               <div className="py-32 text-center opacity-30 flex flex-col items-center bg-white rounded-[40px] border border-dashed border-slate-200">
                  <History size={48} className="text-slate-200 mb-6" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em]">History is Empty.</p>
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