import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
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

const DailyWork = () => {
  const { user } = useAuth();
  const { category } = useParams(); // Get category from URL if present
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
      let filteredTasks = res.tasks || [];
      
      // Category Filter Node
      if (category) {
        filteredTasks = filteredTasks.filter((t: any) => t.category === category);
      }

      setTasks(filteredTasks);
      setStreak(res.streak || 0);
      setLimits(res.limitInfo || { total: 0, used: 0, remaining: 0 });
    } catch (e) {
      console.error("Work registry sync failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWorkData(); }, [category]); // Refetch when category changes

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
      alert(err.message || "Protocol error.");
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto pb-32 space-y-4 animate-fade-in px-1">
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4">
        <div className="md:col-span-8">
           <section className="bg-slate-950 p-5 rounded-[28px] relative overflow-hidden flex flex-col md:flex-row items-center gap-5 group shadow-xl border border-white/5 h-full">
              <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12 scale-110 pointer-events-none group-hover:rotate-45 transition-transform duration-[3s]"><Zap size={100} /></div>
              
              <div className="relative shrink-0">
                 <motion.div 
                   animate={{ scale: [1, 1.05, 1] }} 
                   transition={{ repeat: Infinity, duration: 4 }} 
                   className="w-14 h-14 bg-indigo-600 rounded-2xl flex flex-col items-center justify-center text-white border border-white/10 shadow-lg"
                 >
                    <Flame size={20} fill="currentColor" className="text-amber-400" />
                    <span className="text-base font-black italic">{streak}</span>
                 </motion.div>
              </div>

              <div className="flex-grow space-y-3 text-center md:text-left">
                 <div>
                    <h2 className="text-lg font-black text-white uppercase italic tracking-tighter leading-none">Console.</h2>
                    <p className="text-[7px] font-bold text-slate-500 uppercase tracking-widest mt-1">Authorized {category?.replace('_', ' ') || 'Global'} associate assignment nodes.</p>
                 </div>
                 
                 <div className="grid grid-cols-3 gap-2">
                    <StatBox label="TOTAL" val={limits.total} />
                    <StatBox label="DONE" val={limits.used} />
                    <StatBox label="LEFT" val={limits.remaining} color="text-sky-400" />
                 </div>
              </div>
           </section>
        </div>
        <div className="md:col-span-4 h-full">
           <StreakWidget />
        </div>
      </div>

      <div className="flex bg-white p-1 rounded-xl border border-slate-100 shadow-sm w-fit gap-0.5 mx-auto md:mx-0">
         <button onClick={() => setTab('work')} className={clsx("px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all", tab === 'work' ? "bg-slate-900 text-white shadow-md" : "text-slate-400")}>Stream</button>
         <button onClick={() => setTab('history')} className={clsx("px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all", tab === 'history' ? "bg-slate-900 text-white shadow-md" : "text-slate-400")}>Records</button>
      </div>

      <AnimatePresence mode="wait">
        {tab === 'work' ? (
          <motion.div key="work" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
             {loading ? (
               <div className="col-span-full py-24 text-center flex flex-col items-center gap-3">
                  <RefreshCw className="animate-spin text-indigo-500" size={24} />
                  <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Auditing Inventory...</p>
               </div>
             ) : tasks.length > 0 ? tasks.map((task) => (
                <div key={task.id} className="relative group h-full">
                   <div className={clsx(
                     "bg-white p-4 rounded-[28px] border transition-all flex flex-col h-full shadow-sm hover:shadow-lg",
                     task.myStatus === 'completed' ? "border-emerald-100 bg-emerald-50/10" : "border-slate-50"
                   )}>
                      <div className="flex justify-between items-start mb-3">
                         <div className="w-8 h-8 bg-slate-950 text-sky-400 rounded-lg flex items-center justify-center shadow-md">
                            <Zap size={14} fill="currentColor" />
                         </div>
                         <div className="text-right">
                            <p className="text-base font-black text-slate-900 italic leading-none mb-1">Rs {task.reward}</p>
                            <span className="text-[6px] font-black uppercase bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded-md border border-indigo-100 italic">{task.plan}</span>
                         </div>
                      </div>
                      <h4 className="text-[10px] font-black text-slate-800 uppercase italic mb-1 truncate leading-none">{task.title}</h4>
                      <p className="text-[9px] text-slate-400 font-medium line-clamp-2 italic mb-6 leading-relaxed flex-grow">"{task.instruction}"</p>
                      
                      <div className="pt-3 border-t border-slate-50 flex items-center justify-between mt-auto">
                         {task.myStatus === 'completed' ? (
                           <div className="flex items-center gap-1 text-emerald-500 text-[7px] font-black uppercase tracking-widest">
                              <CheckCircle2 size={10} /> Sync Complete
                           </div>
                         ) : (
                           <button 
                             onClick={() => setActiveTask(task)}
                             className="h-8 px-4 bg-slate-950 text-white rounded-lg font-black text-[8px] uppercase tracking-widest transition-all shadow-md active:scale-95 hover:bg-indigo-600"
                           >
                             Execute
                           </button>
                         )}
                         <span className="text-[6px] font-black text-slate-200 uppercase tracking-widest">#{task.id.slice(-4)}</span>
                      </div>
                   </div>

                   {task.isLocked && task.myStatus !== 'completed' && (
                     <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-[1px] rounded-[28px] flex flex-col items-center justify-center p-4 text-center border border-dashed border-indigo-100">
                        <Lock size={14} className="text-slate-300 mb-2" />
                        <h4 className="text-[8px] font-black text-slate-800 uppercase mb-0.5">NODE LOCKED</h4>
                        <p className="text-[6px] font-bold text-slate-400 uppercase leading-relaxed mb-3">Upgrade to activate</p>
                        <button onClick={() => navigate('/user/plans')} className="h-7 px-3 bg-indigo-600 text-white rounded-lg font-black text-[8px] uppercase tracking-widest shadow-md">Get Station</button>
                     </div>
                   )}
                </div>
             )) : (
               <div className="col-span-full py-24 text-center flex flex-col items-center opacity-30">
                  <Briefcase size={40} className="text-slate-200 mb-4" />
                  <p className="text-[9px] font-black uppercase tracking-[0.4em]">Inventory Offline.</p>
               </div>
             )}
          </motion.div>
        ) : (
          <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-2">
             {(user?.workSubmissions || []).length > 0 ? (
               <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden p-1.5">
                 <div className="divide-y divide-slate-50">
                   {(user?.workSubmissions || []).map((sub: any, idx: number) => (
                      <motion.div 
                        key={idx} 
                        initial={{ opacity: 0, x: -5 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        className="p-3.5 flex items-center justify-between group hover:bg-slate-50 transition-all rounded-2xl"
                      >
                         <div className="flex items-center gap-3 overflow-hidden">
                            <div className={clsx(
                              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-inner",
                              sub.status === 'approved' ? "bg-emerald-50 text-emerald-600" : sub.status === 'rejected' ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
                            )}>
                               {sub.status === 'approved' ? <CheckCircle2 size={16}/> : sub.status === 'rejected' ? <XCircle size={16}/> : <Clock size={16}/>}
                            </div>
                            <div className="overflow-hidden">
                               <h4 className="font-black text-slate-800 text-[10px] uppercase truncate max-w-[150px] mb-1 leading-none italic">{sub.taskTitle}</h4>
                               <p className="text-[7px] font-bold text-slate-300 uppercase tracking-widest italic">{new Date(sub.timestamp).toLocaleDateString()}</p>
                            </div>
                         </div>
                         <div className="text-right shrink-0">
                            <p className="font-black text-[11px] text-slate-900 italic leading-none mb-1">Rs {sub.reward}</p>
                            <span className={clsx(
                              "text-[6px] font-black uppercase px-1.5 py-0.2 rounded border",
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
               <div className="py-24 text-center opacity-30 flex flex-col items-center bg-white rounded-[32px] border border-dashed border-slate-100">
                  <History size={32} className="text-slate-200 mb-4" />
                  <p className="text-[9px] font-black uppercase tracking-[0.4em]">Registry Empty.</p>
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

const StatBox = ({ label, val, color = "text-white" }: any) => (
  <div className="bg-white/5 p-2 rounded-xl border border-white/5 text-center">
     <p className="text-[6px] font-black text-slate-500 uppercase mb-1">{label}</p>
     <p className={clsx("text-xs font-black", color)}>{val}</p>
  </div>
);

export default DailyWork;