import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Clock, CheckCircle2, ShieldCheck, 
  Loader2, X, Sparkles, ChevronLeft, Layout,
  Target, Info, Lock, ArrowRight, Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';

const AdTimerModal = ({ task, onComplete, onCancel }: any) => {
  const [timeLeft, setTimeLeft] = useState(task.timer || 10);
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
        {!isReady && <button onClick={onCancel} className="p-4 text-white/30 hover:text-white transition-all"><X size={24} /></button>}
      </div>

      <div className="text-center max-w-sm space-y-10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-400 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border border-indigo-500/30">
            <ShieldCheck size={12} /> STATION VERIFICATION ACTIVE
          </div>
          <h2 className="text-2xl font-black uppercase italic tracking-tight">Processing Profit...</h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed">Verification protocol in progress. Hold terminal position.</p>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="w-40 h-40 rounded-full border-[10px] border-white/5 flex items-center justify-center">
             <motion.div 
               animate={{ scale: [1, 1.05, 1] }} 
               transition={{ repeat: Infinity, duration: 2 }}
               className="text-6xl font-black italic tracking-tighter"
             >
               {timeLeft}
             </motion.div>
          </div>
          {isReady && (
            <motion.div 
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="absolute -top-4 -right-4 bg-emerald-500 text-white p-3 rounded-2xl shadow-xl"
            >
               <Sparkles size={24} />
            </motion.div>
          )}
        </div>

        <div className="w-full">
          {isReady ? (
            <motion.button 
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              onClick={() => onComplete(task)}
              className="w-full h-16 bg-white text-slate-900 rounded-[28px] font-black text-xs uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all"
            >
              Sync Reward <CheckCircle2 size={20} className="text-indigo-600" />
            </motion.button>
          ) : (
            <div className="h-16 flex items-center justify-center gap-3 text-slate-500 font-black text-[9px] uppercase tracking-widest border border-white/5 rounded-[28px] bg-white/5">
              <Loader2 className="animate-spin" size={16} /> Verification in progress...
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
      console.error("Task sync failure.");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleTaskComplete = async (task: any) => {
    try {
      const res = await api.post('/work/complete', { taskId: task.id });
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.7 } });
      
      const savedUserStr = localStorage.getItem('noor_user');
      if (savedUserStr) {
        const savedUser = JSON.parse(savedUserStr);
        savedUser.balance = res.newBalance;
        localStorage.setItem('noor_user', JSON.stringify(savedUser));
      }
      setActiveTask(null);
      fetchTasks();
    } catch (err: any) {
      alert(err.message || "Failed to sync reward point.");
    }
  };

  const hasNoPlan = !user?.currentPlan || user.currentPlan === 'None';

  return (
    <div className="w-full max-w-full overflow-x-hidden px-2 pb-24 space-y-5 animate-fade-in">
      <header className="flex items-center justify-between pt-2 px-1">
        <Link to="/user/dashboard" className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 active:scale-90 transition-all">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-lg font-black text-slate-900 tracking-tighter uppercase italic leading-none">Console <span className="text-indigo-600">Tasks</span></h1>
        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-sky-400 shadow-lg">
          <Target size={18} />
        </div>
      </header>

      {hasNoPlan ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-10 rounded-[44px] border border-slate-100 text-center shadow-xl flex flex-col items-center mx-1">
           <div className="w-20 h-20 bg-slate-900 text-sky-400 rounded-[30px] flex items-center justify-center mb-8 shadow-2xl relative">
              <Lock size={32} />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 rounded-full border-4 border-white animate-pulse" />
           </div>
           <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic mb-3">Station Restricted</h2>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed mb-10 px-4">
             Your account is currently in 'BASIC-IDLE' mode. Please activate an Earning Station to unlock the primary terminal and view tasks.
           </p>
           
           <div className="grid grid-cols-2 gap-3 w-full mb-8">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                 <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Standard Tasks</p>
                 <p className="text-sm font-black text-slate-900">10 Daily</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                 <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Elite Profit</p>
                 <p className="text-sm font-black text-slate-900">Rs. 650/D</p>
              </div>
           </div>

           <button 
             onClick={() => navigate('/user/plans')}
             className="w-full h-16 bg-indigo-600 text-white rounded-[26px] font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 active:scale-95 transition-all"
           >
             Activate Earning Hub <ArrowRight size={18} />
           </button>
           <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-8">Official Noor V3 Security Protocol</p>
        </motion.div>
      ) : (
        <>
          <div className="bg-slate-950 p-6 rounded-[32px] text-white flex justify-between items-center relative overflow-hidden shadow-2xl border border-white/5 mx-1">
             <div className="relative z-10 overflow-hidden">
                <p className="text-[7px] font-black text-sky-400 uppercase tracking-widest mb-1 italic">Authorized Hub</p>
                <h3 className="text-xl font-black tracking-tighter uppercase leading-none truncate max-w-[150px]">{user?.currentPlan}</h3>
             </div>
             <div className="text-right relative z-10 shrink-0">
                <p className="text-[7px] font-black text-slate-500 uppercase mb-1 italic">Daily Quota</p>
                <p className="text-lg font-black text-emerald-400 leading-none">{tasks.length} OPEN</p>
             </div>
          </div>

          <div className="space-y-2.5 min-h-[300px] px-1">
            {loading ? (
              <div className="py-16 text-center flex flex-col items-center gap-3">
                <Loader2 className="animate-spin text-indigo-500" size={24} />
                <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.3em]">Checking Work Sector...</p>
              </div>
            ) : tasks.length > 0 ? (
              tasks.map((task, idx) => (
                <motion.div 
                  key={task.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}
                  className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between active:scale-[0.98] transition-all group"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center text-indigo-600 shadow-inner shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <Zap size={20} fill="currentColor" />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-black text-slate-800 text-[10px] uppercase truncate leading-none mb-1.5">{task.title}</h4>
                      <div className="flex items-center gap-1.5">
                         <p className="text-[8px] font-black text-emerald-600 uppercase">Rs. {task.reward}</p>
                         <span className="w-0.5 h-0.5 rounded-full bg-slate-200" />
                         <p className="text-[7px] font-bold text-slate-400 uppercase italic">Check Ready</p>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setActiveTask(task)} className="h-9 px-4 bg-slate-950 text-white rounded-lg font-black text-[9px] uppercase tracking-widest shadow-lg active:scale-95 transition-all shrink-0 ml-2">Start</button>
                </motion.div>
              ))
            ) : (
              <div className="bg-white p-12 rounded-[40px] border border-dashed border-slate-100 text-center shadow-sm flex flex-col items-center">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mb-6">
                   <CheckCircle2 size={28} />
                </div>
                <p className="text-slate-900 font-black uppercase text-xs italic tracking-tight">Zone Purified</p>
                <p className="text-[8px] text-slate-400 uppercase mt-2 tracking-widest font-bold max-w-[200px] leading-relaxed">
                   All assigned hubs have been scanned. New protocols arrive in 24h.
                </p>
              </div>
            )}
          </div>

          <div className="bg-amber-50 p-6 rounded-[32px] border border-amber-100 flex items-start gap-4 mx-1">
             <Info size={16} className="text-amber-500 shrink-0 mt-0.5" />
             <p className="text-[8px] font-bold text-amber-800 uppercase tracking-widest leading-relaxed">
               Verification Station: Ensure your browser remains active during scanning. Earnings distribution is calculated in PKR units.
             </p>
          </div>
        </>
      )}

      <AnimatePresence>
        {activeTask && (
          <AdTimerModal task={activeTask} onComplete={handleTaskComplete} onCancel={() => setActiveTask(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DailyWork;