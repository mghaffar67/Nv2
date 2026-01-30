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

  const streakProgress = (streak % 7) * (100 / 7);

  return (
    <div className="w-full max-w-5xl mx-auto pb-32 space-y-6 animate-fade-in px-2">
      
      {/* 1. STREAK HEADER */}
      <section className="bg-slate-950 p-6 md:p-10 rounded-[44px] relative overflow-hidden flex flex-col md:flex-row items-center gap-8 group shadow-2xl border border-white/5">
         <div className="absolute top-0 right-0 p-8 opacity-10 scale-150 rotate-12 text-rose-500 pointer-events-none group-hover:rotate-45 transition-transform duration-[3s]"><Flame size={120} /></div>
         
         <div className="relative shrink-0">
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                boxShadow: ["0 0 0px rgba(244,63,94,0)", "0 0 30px rgba(244,63,94,0.4)", "0 0 0px rgba(244,63,94,0)"]
              }} 
              transition={{ repeat: Infinity, duration: 3 }} 
              className="w-24 h-24 bg-rose-600 rounded-[35px] flex flex-col items-center justify-center text-white border-2 border-white/20"
            >
               <Flame size={36} fill="currentColor" className="animate-pulse" />
               <span className="text-2xl font-black italic tracking-tighter">{streak}</span>
            </motion.div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-lg border border-slate-100">
               <span className="text-[7px] font-black text-slate-900 uppercase tracking-widest whitespace-nowrap italic">DAILY STREAK</span>
            </div>
         </div>

         <div className="flex-grow space-y-5 text-center md:text-left">
            <div className="space-y-1">
               <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter leading-none">Task Dashboard.</h2>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Complete your daily tasks to maintain your streak and earn rewards.</p>
            </div>
            
            <div className="space-y-3">
               <div className="flex justify-between items-end px-1">
                  <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Efficiency: {streak}% Capacity</span>
                  <span className="text-[9px] font-black text-white uppercase tracking-widest flex items-center gap-1.5"><Trophy size={12} className="text-amber-400" /> Goal: Day 7 Bonus</span>
               </div>
               <div className="h-3 w-full bg-white/5 rounded-full border border-white/10 overflow-hidden shadow-inner p-0.5">
                  <motion.div 
                    initial={{ width: 0 }} animate={{ width: `${streakProgress}%` }} 
                    className="h-full bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 rounded-full"
                  />
               </div>
            </div>
         </div>
      </section>

      {/* 2. ANALYTICS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
         <StatItem label="Daily Limit" val={limits.total} icon={Briefcase} color="bg-indigo-600" />
         <StatItem label="Completed" val={limits.used} icon={CheckCircle2} color="bg-emerald-600" />
         <StatItem label="Available" val={limits.remaining} icon={Clock} color="bg-slate-900" />
         <div className="bg-white p-5 rounded-[32px] border border-slate-100 flex items-center justify-between shadow-sm">
            <div>
               <p className="text-[8px] font-black uppercase text-slate-400 mb-1 italic">Current Plan</p>
               <h4 className="text-[10px] font-black italic uppercase text-indigo-600">{user?.currentPlan || 'NONE'}</h4>
            </div>
            <Link to="/user/plans" className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all"><ArrowUpRight size={18}/></Link>
         </div>
      </div>

      {/* 3. TABS CONTROL */}
      <div className="flex bg-white p-1.5 rounded-[28px] border border-slate-100 shadow-sm w-fit gap-1 mx-auto md:mx-0">
         <button onClick={() => setTab('work')} className={clsx("px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all", tab === 'work' ? "bg-slate-900 text-white shadow-xl" : "text-slate-400")}>Daily Work</button>
         <button onClick={() => setTab('history')} className={clsx("px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all", tab === 'history' ? "bg-slate-900 text-white shadow-xl" : "text-slate-400")}>Proof History</button>
      </div>

      <AnimatePresence mode="wait">
        {tab === 'work' ? (
          <motion.div key="work" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {loading ? (
               <div className="col-span-full py-32 text-center flex flex-col items-center gap-4">
                  <RefreshCw className="animate-spin text-indigo-500" size={44} />
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Loading Tasks...</p>
               </div>
             ) : tasks.map((task, idx) => (
                <div key={task.id} className="relative group">
                   <div className={clsx(
                     "bg-white p-6 rounded-[40px] border transition-all flex flex-col h-[220px]",
                     task.myStatus === 'completed' ? "border-emerald-200 bg-emerald-50/10" : "border-slate-100 shadow-sm"
                   )}>
                      <div className="flex justify-between items-start mb-6">
                         <div className="w-12 h-12 bg-slate-950 text-sky-400 rounded-2xl flex items-center justify-center shadow-lg border border-white/10 group-hover:rotate-6 transition-transform">
                            <Zap size={22} fill="currentColor" />
                         </div>
                         <div className="text-right">
                            <p className="text-lg font-black text-slate-900 italic leading-none mb-1">Rs {task.reward}</p>
                            <span className="text-[7px] font-black uppercase bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md border border-indigo-100 italic">{task.plan}</span>
                         </div>
                      </div>
                      <h4 className="text-[12px] font-black text-slate-800 uppercase italic mb-2 truncate tracking-tight">{task.title}</h4>
                      <p className="text-[10px] text-slate-400 font-medium line-clamp-2 italic mb-6 leading-relaxed">"{task.instruction}"</p>
                      
                      <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                         {task.myStatus === 'completed' ? (
                           <div className="flex items-center gap-2 text-emerald-500 text-[9px] font-black uppercase">
                              <CheckCircle2 size={14} /> Completed
                           </div>
                         ) : (
                           <button 
                             onClick={() => setActiveTask(task)}
                             className="h-10 px-6 bg-slate-950 text-white rounded-xl font-black text-[8px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg active:scale-95"
                           >
                              Start Task
                           </button>
                         )}
                         <span className="text-[8px] font-bold text-slate-300 uppercase tracking-tighter">ID: {task.id.slice(-6)}</span>
                      </div>
                   </div>

                   {/* LOCK SYSTEM OVERLAY */}
                   {task.isLocked && task.myStatus !== 'completed' && (
                     <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[4px] rounded-[40px] flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-indigo-100 group-hover:bg-white/80 transition-all">
                        <div className="w-12 h-12 bg-slate-950 text-white rounded-[20px] flex items-center justify-center mb-3 shadow-xl">
                           <Lock size={22} />
                        </div>
                        <h4 className="text-[11px] font-black text-slate-900 uppercase italic mb-1">Limit Reached.</h4>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed mb-4">
                           {task.lockReason === 'No Active Station' ? 'Activation Required' : 'Upgrade Plan to continue'}
                        </p>
                        <button onClick={() => navigate('/user/plans')} className="h-9 px-6 bg-indigo-600 text-white rounded-xl font-black text-[8px] uppercase tracking-widest shadow-lg flex items-center gap-2 active:scale-95 transition-all">
                           Upgrade Plan <ArrowRight size={12}/>
                        </button>
                     </div>
                   )}
                </div>
             ))}
          </motion.div>
        ) : (
          <motion.div key="history" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
             {(user?.workSubmissions || []).length > 0 ? (user?.workSubmissions || []).map((sub: any, idx: number) => (
                <div key={idx} className="bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-indigo-100 transition-all">
                   <div className="flex items-center gap-4 overflow-hidden">
                      <div className={clsx(
                        "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner",
                        sub.status === 'approved' ? "bg-emerald-50 text-emerald-600" : sub.status === 'rejected' ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
                      )}>
                         {sub.status === 'approved' ? <CheckCircle2 size={24}/> : sub.status === 'rejected' ? <XCircle size={24}/> : <Clock size={24}/>}
                      </div>
                      <div className="overflow-hidden">
                         <h4 className="font-black text-slate-800 text-[11px] uppercase truncate max-w-[180px] mb-1">{sub.taskTitle}</h4>
                         <div className="flex items-center gap-2">
                           <span className="text-[8px] font-bold text-slate-400 uppercase italic">{new Date(sub.timestamp).toLocaleDateString()}</span>
                           {sub.adminNote && (
                             <span className="text-[8px] font-black text-rose-500 uppercase flex items-center gap-1">
                               <AlertCircle size={8}/> {sub.adminNote}
                             </span>
                           )}
                         </div>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="font-black text-sm text-slate-900 italic mb-0.5">Rs {sub.reward}</p>
                      <span className={clsx(
                        "text-[7px] font-black uppercase px-2 py-0.5 rounded-md border",
                        sub.status === 'approved' ? "bg-green-50 text-green-600 border-green-100" : 
                        sub.status === 'pending' ? "bg-amber-50 text-amber-600 border-amber-100" : 
                        "bg-rose-50 text-rose-600 border-rose-100"
                      )}>{sub.status}</span>
                   </div>
                </div>
             )) : (
               <div className="py-32 text-center opacity-30 flex flex-col items-center">
                  <History size={64} className="text-slate-200 mb-6" />
                  <p className="text-[11px] font-black uppercase tracking-[0.3em]">No proof history found.</p>
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

const StatItem = ({ label, val, icon: Icon, color }: any) => (
  <div className={clsx("p-5 rounded-[32px] text-white shadow-xl relative overflow-hidden", color)}>
    <div className="absolute top-0 right-0 p-4 opacity-10"><Icon size={60} /></div>
    <p className="text-[8px] font-black uppercase opacity-60 mb-1 italic">{label}</p>
    <h4 className="text-2xl font-black italic tracking-tighter leading-none">{val}</h4>
  </div>
);

export default DailyWork;