
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Clock, CheckCircle2, ShieldCheck, 
  Loader2, X, Sparkles, ChevronLeft, Layout,
  Target, Info, Lock, ArrowRight, Award,
  ExternalLink, MousePointer2,
  // Add missing icons
  Briefcase, RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';

const AssignmentModal = ({ task, onComplete, onCancel }: any) => {
  const [timeLeft, setTimeLeft] = useState(task.timeLimitSeconds || 10);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev: number) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsReady(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-white"
    >
      <div className="absolute top-6 right-6">
        {!isReady && (
          <button onClick={onCancel} className="p-4 bg-white/5 rounded-full text-white/30 hover:text-white transition-all">
            <X size={20} />
          </button>
        )}
      </div>

      <div className="text-center max-w-sm w-full space-y-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-400 px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border border-indigo-500/30">
            <ShieldCheck size={10} className="animate-pulse" /> SCANNING ASSIGNMENT NODE
          </div>
          <h2 className="text-xl font-black uppercase italic tracking-tighter">Syncing Profit Point.</h2>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">Please wait for the secure validation to complete.</p>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="w-48 h-48 rounded-full border-[12px] border-white/5 flex items-center justify-center relative">
             <motion.div 
               animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }} 
               transition={{ repeat: Infinity, duration: 3 }}
               className="text-7xl font-black italic tracking-tighter text-indigo-400"
             >
               {timeLeft}
             </motion.div>
             <svg className="absolute -inset-4 w-[210px] h-[210px] -rotate-90">
                <circle cx="105" cy="105" r="90" fill="none" stroke="currentColor" strokeWidth="4" className="text-white/5" />
                <motion.circle 
                  cx="105" cy="105" r="90" fill="none" stroke="currentColor" strokeWidth="4" 
                  strokeDasharray="565" 
                  initial={{ strokeDashoffset: 565 }}
                  animate={{ strokeDashoffset: 565 - (565 * ( (task.timeLimitSeconds || 10) - timeLeft) / (task.timeLimitSeconds || 10)) }}
                  className="text-indigo-500" 
                />
             </svg>
          </div>
          {isReady && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-4 -right-4 bg-emerald-500 text-white p-4 rounded-[22px] shadow-2xl">
               <Sparkles size={24} />
            </motion.div>
          )}
        </div>

        <div className="w-full pt-4">
          {isReady ? (
            <motion.button 
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              onClick={() => onComplete(task)}
              className="w-full h-16 bg-white text-slate-900 rounded-[28px] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all"
            >
              Collect Reward <CheckCircle2 size={18} className="text-emerald-500" />
            </motion.button>
          ) : (
            <div className="h-16 flex items-center justify-center gap-3 text-slate-500 font-black text-[9px] uppercase tracking-widest border border-white/5 rounded-[28px] bg-white/5 backdrop-blur-sm">
              <Loader2 className="animate-spin" size={14} /> Verification in Progress...
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const DailyWork = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTask, setActiveTask] = useState<any>(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await api.get('/work/tasks');
      setTasks(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Task failure");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleTaskComplete = async (task: any) => {
    try {
      const res = await api.post('/work/complete', { taskId: task.id });
      confetti({ particleCount: 200, spread: 90, origin: { y: 0.8 } });
      
      const savedUserStr = localStorage.getItem('noor_user');
      if (savedUserStr) {
        const savedUser = JSON.parse(savedUserStr);
        savedUser.balance = res.newBalance;
        localStorage.setItem('noor_user', JSON.stringify(savedUser));
      }
      setActiveTask(null);
      fetchTasks();
    } catch (err: any) {
      alert(err.message || "Failed to collect reward.");
    }
  };

  const hasNoPlan = !user?.currentPlan || user.currentPlan === 'None';

  return (
    <div className="w-full max-w-full pb-24 space-y-6 animate-fade-in px-1">
      <header className="flex items-center justify-between pt-2 px-1">
        <Link to="/user/dashboard" className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 active:scale-90 transition-all">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">Work <span className="text-indigo-600">Hub.</span></h1>
        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-sky-400 shadow-xl">
          {/* Fix: Icon Briefcase is now imported from lucide-react */}
          <Briefcase size={18} />
        </div>
      </header>

      {hasNoPlan ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-12 rounded-[48px] border border-slate-100 text-center shadow-2xl flex flex-col items-center mx-1">
           <div className="w-24 h-24 bg-slate-950 text-sky-400 rounded-[36px] flex items-center justify-center mb-8 shadow-xl relative">
              <Lock size={36} />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-rose-500 rounded-full border-4 border-white animate-pulse" />
           </div>
           <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic mb-3">Access Denied.</h2>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed mb-10 px-4">
             Your account is currently idle. Please activate an Earning Station to start daily work.
           </p>
           <button onClick={() => navigate('/user/plans')} className="w-full h-16 bg-indigo-600 text-white rounded-[28px] font-black text-[11px] uppercase tracking-[0.3em] shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 active:scale-95 transition-all">
             Activate Station <ArrowRight size={18} />
           </button>
        </motion.div>
      ) : (
        <>
          <div className="bg-slate-950 p-6 rounded-[36px] text-white flex justify-between items-center relative overflow-hidden shadow-2xl mx-1 border border-white/5">
             <div className="relative z-10">
                <p className="text-[7px] font-black text-sky-400 uppercase tracking-widest mb-1 italic">Authorized Tier</p>
                <h3 className="text-2xl font-black tracking-tighter uppercase italic">{user?.currentPlan}</h3>
             </div>
             <div className="text-right relative z-10">
                <p className="text-[7px] font-black text-slate-500 uppercase mb-1 italic">Tasks Open</p>
                <p className="text-xl font-black text-emerald-400 leading-none">{tasks.length}</p>
             </div>
          </div>

          <div className="space-y-3 px-1 min-h-[400px]">
            {loading ? (
              <div className="py-24 text-center flex flex-col items-center gap-3">
                {/* Fix: Icon RefreshCw is now imported from lucide-react */}
                <RefreshCw className="animate-spin text-indigo-500" size={32} />
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Scanning Fleet...</p>
              </div>
            ) : tasks.length > 0 ? (
              tasks.map((task, idx) => (
                <motion.div 
                  key={task.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}
                  className="bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm space-y-4 group hover:border-indigo-200 transition-all"
                >
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-[20px] bg-slate-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                           <Zap size={24} fill="currentColor" />
                        </div>
                        <div>
                           <h4 className="font-black text-slate-800 text-xs uppercase tracking-tight leading-none mb-1.5">{task.title}</h4>
                           <div className="flex items-center gap-2">
                              <span className="text-[8px] font-black text-emerald-600 uppercase">Rs. {task.reward} Yield</span>
                              <span className="w-1 h-1 bg-slate-200 rounded-full" />
                              <span className="text-[7px] font-bold text-slate-400 uppercase italic">Station Ready</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-50">
                     <p className="text-[9px] text-slate-500 font-medium leading-relaxed italic line-clamp-2">"{task.instruction}"</p>
                  </div>

                  <button 
                    onClick={() => setActiveTask(task)} 
                    className="w-full h-12 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                     <MousePointer2 size={14} /> Start Assignment
                  </button>
                </motion.div>
              ))
            ) : (
              <div className="bg-white p-20 rounded-[48px] border border-dashed border-slate-100 text-center flex flex-col items-center opacity-60">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mb-6">
                   <CheckCircle2 size={32} />
                </div>
                <p className="text-slate-900 font-black uppercase text-sm italic tracking-tighter">Sector Purified.</p>
                <p className="text-[9px] font-black text-slate-400 uppercase mt-2 tracking-widest font-bold max-w-[220px] leading-relaxed">
                   All assigned assignments have been scanned. Check back in 24 hours.
                </p>
              </div>
            )}
          </div>

          <div className="mx-1 p-6 bg-blue-50 rounded-[32px] border border-blue-100 flex items-start gap-4">
             <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
             <div>
                <h4 className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-1 italic">Protocol Warning</h4>
                <p className="text-[8px] font-bold text-blue-700 uppercase tracking-widest leading-relaxed">
                   Always stay on the assignment page until verification is 100% complete. Premature exit results in packet loss.
                </p>
             </div>
          </div>
        </>
      )}

      <AnimatePresence>
        {activeTask && (
          <AssignmentModal task={activeTask} onComplete={handleTaskComplete} onCancel={() => setActiveTask(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DailyWork;
