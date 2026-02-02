import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Clock, CheckCircle2, ShieldCheck, 
  Loader2, X, ChevronLeft, Briefcase, RefreshCw,
  ArrowRight, History, ExternalLink,
  ChevronRight, Play, FileCheck, Info,
  Target, FileText, ListChecks, Smartphone,
  XCircle, AlertCircle, Flame, Lock, Trophy, BarChart3,
  ArrowUpRight, Sparkles, Moon, Sun
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
  const [lockStatus, setLockStatus] = useState<{ isLocked: boolean, reason: string, message: string } | null>(null);

  const fetchWorkData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/work/tasks');
      if (res.isLocked) {
        setLockStatus({ isLocked: true, reason: res.lockReason, message: res.message });
        setTasks([]);
      } else {
        setLockStatus(null);
        setTasks(res.tasks || []);
        setLimits(res.limitInfo || { total: 0, used: 0, remaining: 0 });
      }
      setStreak(res.streak || 0);
    } catch (e) {
      console.error("Registry Node Offline.");
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
      alert(err.message || "Protocol Failure.");
    }
  };

  const streakProgress = (streak % 7) * (100 / 7);

  return (
    <div className="w-full max-w-5xl mx-auto pb-32 space-y-6 animate-fade-in px-2">
      
      {/* 1. STATION OPERATIONAL CLOCK */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-4">
         <div className="md:col-span-8 bg-slate-950 p-8 rounded-[44px] relative overflow-hidden flex flex-col justify-between shadow-2xl border border-white/5">
            <div className="absolute top-0 right-0 p-8 opacity-10 scale-150 rotate-12 text-indigo-500 pointer-events-none"><Zap size={120} fill="currentColor" /></div>
            
            <div className="relative z-10 flex justify-between items-start mb-10">
               <div>
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-3 italic">Station Status</p>
                  <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">Operation <span className="text-indigo-500">Center.</span></h2>
               </div>
               <div className={clsx(
                 "px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 border",
                 lockStatus ? "bg-rose-500/20 text-rose-400 border-rose-500/30" : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
               )}>
                  <div className={clsx("w-2 h-2 rounded-full", lockStatus ? "bg-rose-500" : "bg-emerald-500 animate-pulse")} />
                  {lockStatus ? 'Offline' : 'Operational'}
               </div>
            </div>

            <div className="relative z-10 grid grid-cols-2 gap-4">
               <div className="p-4 bg-white/5 rounded-3xl border border-white/10">
                  <p className="text-[7px] font-black text-slate-500 uppercase mb-1">Work Days</p>
                  <p className="text-xs font-black text-white uppercase">Monday - Friday</p>
               </div>
               <div className="p-4 bg-white/5 rounded-3xl border border-white/10">
                  <p className="text-[7px] font-black text-slate-500 uppercase mb-1">Work Hours</p>
                  <p className="text-xs font-black text-white uppercase">09:00 AM - 10:00 PM</p>
               </div>
            </div>
         </div>

         <div className="md:col-span-4 bg-white p-8 rounded-[44px] border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
              className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-indigo-600 mb-4 shadow-inner"
            >
               <RefreshCw size={24} />
            </motion.div>
            <h4 className="text-[11px] font-black text-slate-900 uppercase italic">Live Sync</h4>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Registry auto-refreshes <br/> every 60 seconds</p>
         </div>
      </section>

      {/* 2. ANALYTICS & LOCKDOWN STATES */}
      <AnimatePresence mode="wait">
        {lockStatus ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-rose-50 border border-rose-100 p-10 rounded-[48px] text-center space-y-6 mx-1"
          >
             <div className="w-20 h-20 bg-rose-600 text-white rounded-[30px] flex items-center justify-center mx-auto shadow-xl">
                {lockStatus.reason === 'weekend' ? <Moon size={40} /> : <Sun size={40} />}
             </div>
             <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight">Station Lockdown Active.</h3>
                <p className="text-xs font-bold text-rose-600 uppercase tracking-widest leading-relaxed max-w-sm mx-auto">{lockStatus.message}</p>
             </div>
             <button onClick={fetchWorkData} className="px-10 h-14 bg-slate-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 mx-auto active:scale-95 transition-all">
                <RefreshCw size={14} /> Re-probe Hub
             </button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
               <StatItem label="Active Capacity" val={limits.total} icon={Briefcase} color="bg-indigo-600" />
               <StatItem label="V3 Verified" val={limits.used} icon={CheckCircle2} color="bg-emerald-600" />
               <StatItem label="Remaining" val={limits.remaining} icon={Clock} color="bg-slate-900" />
               <div className="bg-white p-5 rounded-[32px] border border-slate-100 flex items-center justify-between shadow-sm group hover:border-indigo-200 transition-all">
                  <div>
                     <p className="text-[8px] font-black uppercase text-slate-400 mb-1 italic">Identity Tier</p>
                     <h4 className="text-[10px] font-black italic uppercase text-indigo-600">{user?.currentPlan || 'NONE'}</h4>
                  </div>
                  <Link to="/user/plans" className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner"><ArrowUpRight size={18}/></Link>
               </div>
            </div>

            <div className="flex bg-white p-1.5 rounded-[28px] border border-slate-100 shadow-sm w-fit gap-1">
               <button onClick={() => setTab('work')} className={clsx("px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all", tab === 'work' ? "bg-slate-900 text-white shadow-xl" : "text-slate-400")}>Active Tasks</button>
               <button onClick={() => setTab('history')} className={clsx("px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all", tab === 'history' ? "bg-slate-900 text-white shadow-xl" : "text-slate-400")}>Submission Log</button>
            </div>

            {tab === 'work' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {loading ? (
                   <div className="col-span-full py-32 text-center flex flex-col items-center gap-4">
                      <RefreshCw className="animate-spin text-indigo-500" size={44} />
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Querying Cloud Nodes...</p>
                   </div>
                 ) : tasks.length > 0 ? tasks.map((task, idx) => (
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
                                  Process Node
                               </button>
                             )}
                             <span className="text-[8px] font-bold text-slate-300 uppercase tracking-tighter">REF: {task.id.slice(-4)}</span>
                          </div>
                       </div>

                       {task.isLocked && task.myStatus !== 'completed' && (
                         <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-[6px] rounded-[40px] flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-indigo-200">
                            <div className="w-12 h-12 bg-slate-950 text-white rounded-[20px] flex items-center justify-center mb-3 shadow-xl">
                               <Lock size={22} />
                            </div>
                            <h4 className="text-[11px] font-black text-slate-900 uppercase italic mb-1">Node Locked.</h4>
                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed mb-4">
                               {task.lockReason}
                            </p>
                            <button onClick={() => navigate('/user/plans')} className="h-9 px-6 bg-indigo-600 text-white rounded-xl font-black text-[8px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                               Activate Capacity
                            </button>
                         </div>
                       )}
                    </div>
                 )) : (
                   <div className="col-span-full py-40 bg-white rounded-[64px] border-4 border-dashed border-slate-50 text-center flex flex-col items-center">
                      <Target size={64} className="text-slate-100 mb-6" />
                      <h4 className="text-slate-900 font-black uppercase text-sm italic mb-2 tracking-tighter">Inventory Dry.</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest max-w-[280px]">All available tasks for your station tier have been consumed or locked.</p>
                   </div>
                 )}
              </div>
            ) : (
              <div className="space-y-3">
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
                               <span className="w-1 h-1 bg-slate-200 rounded-full" />
                               <span className="text-[8px] font-black text-indigo-400 uppercase">SYN: {sub.id?.slice(-6)}</span>
                             </div>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="font-black text-sm text-slate-900 italic mb-0.5">Rs {sub.reward}</p>
                          <span className={clsx("text-[7px] font-black uppercase", sub.status === 'approved' ? "text-emerald-500" : sub.status === 'pending' ? "text-amber-500" : "text-rose-500")}>{sub.status}</span>
                       </div>
                    </div>
                 )) : (
                   <div className="py-32 text-center opacity-30 flex flex-col items-center">
                      <History size={64} className="text-slate-200 mb-6" />
                      <p className="text-[11px] font-black uppercase tracking-[0.3em]">No submission records found.</p>
                   </div>
                 )}
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