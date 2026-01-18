
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Clock, Play, CheckCircle2, 
  ShieldCheck, AlertCircle, Loader2, X,
  ExternalLink, Sparkles, Award
} from 'lucide-react';
import { clsx } from 'clsx';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import StreakWidget from '../../components/user/StreakWidget';

const AdTimerModal = ({ task, onComplete, onCancel }: any) => {
  const [timeLeft, setTimeLeft] = useState(15);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const progTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progTimer);
          return 100;
        }
        return prev + (100 / (15 * 10)); // smoother 100ms updates
      });
    }, 100);

    return () => {
      clearInterval(timer);
      clearInterval(progTimer);
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center justify-center p-6 text-white"
    >
      <div className="absolute top-0 right-0 p-8 opacity-5 scale-[3] text-sky-400 pointer-events-none">
        <Zap size={100} fill="currentColor" />
      </div>

      <button onClick={onCancel} className="absolute top-6 right-6 p-4 text-white/40 hover:text-white transition-all">
        <X size={24} />
      </button>

      <div className="text-center max-w-sm space-y-8 relative z-10">
        <div className="space-y-2">
           <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-400 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border border-indigo-500/30">
              <ShieldCheck size={12} /> SECURE AUDIT NODE
           </div>
           <h2 className="text-2xl font-black tracking-tight leading-none uppercase italic">Auditing Media Packet...</h2>
           <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
             Please remain on this screen. Closing early will terminate the reward session.
           </p>
        </div>

        <div className="relative flex items-center justify-center">
           <svg className="w-48 h-48 transform -rotate-90">
              <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
              <motion.circle 
                cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="8" fill="transparent"
                strokeDasharray={2 * Math.PI * 80}
                animate={{ strokeDashoffset: (2 * Math.PI * 80) * (1 - progress / 100) }}
                className="text-indigo-500"
              />
           </svg>
           <div className="absolute flex flex-col items-center">
              <span className="text-5xl font-black tracking-tighter">{timeLeft}s</span>
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Remains</span>
           </div>
        </div>

        <div className="space-y-4">
           {timeLeft === 0 ? (
             <motion.button 
               initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
               onClick={() => onComplete(task)}
               className="w-full h-16 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all"
             >
               Claim Rs. {task.reward} <Sparkles size={18} className="text-indigo-500" />
             </motion.button>
           ) : (
             <div className="h-16 flex items-center justify-center gap-2 text-slate-500 font-black text-[10px] uppercase tracking-widest border border-white/5 rounded-2xl bg-white/5">
                <Loader2 className="animate-spin" size={16} /> Syncing Proof...
             </div>
           )}
        </div>
      </div>
    </motion.div>
  );
};

const DailyWork = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTask, setActiveTask] = useState<any>(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await api.get('/work/tasks');
      setTasks(data);
    } catch (e) {
      console.error("Task sync failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskComplete = async (task: any) => {
    try {
      await api.post('/work/complete', { taskId: task.id });
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.8 } });
      setActiveTask(null);
      fetchTasks();
    } catch (err: any) {
      alert(err.message || "Failed to sync reward.");
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-4 pb-24 animate-fade-in px-1">
      
      {/* 1. STATUS HEADER */}
      <div className="bg-slate-950 p-6 rounded-[32px] text-white flex justify-between items-center relative overflow-hidden mx-1 shadow-xl">
         <div className="absolute top-0 right-0 p-3 opacity-5"><Zap size={40} /></div>
         <div>
            <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-1">Operational Station</p>
            <h3 className="text-2xl font-black tracking-tighter">{user?.currentPlan || 'BASIC'} NODE</h3>
         </div>
         <div className="text-right">
            <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Quota Today</p>
            <p className="text-xl font-black text-emerald-400">{tasks.length} REMAINING</p>
         </div>
      </div>

      {/* 2. STREAK PROGRESS */}
      <StreakWidget />

      {/* 3. TASK LIST */}
      <div className="space-y-2.5 mx-1">
         <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-3">
            <Play size={10} fill="currentColor" /> Daily Terminal Nodes
         </h3>

         <div className="space-y-2">
            {loading ? (
               <div className="py-20 text-center"><Loader2 size={32} className="animate-spin mx-auto text-indigo-500 opacity-20" /></div>
            ) : tasks.length > 0 ? (
               tasks.map((task) => (
                 <motion.div 
                  key={task.id} 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm flex items-center justify-between group active:scale-[0.98] transition-all"
                 >
                    <div className="flex items-center gap-4">
                       <div className="w-11 h-11 rounded-xl bg-slate-900 flex items-center justify-center text-sky-400 shadow-lg">
                          <Zap size={20} fill="currentColor" />
                       </div>
                       <div>
                          <h4 className="font-black text-slate-900 text-[11px] uppercase tracking-tight">{task.title}</h4>
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Reward: <span className="text-emerald-600">Rs. {task.reward}</span></p>
                       </div>
                    </div>
                    <button 
                      onClick={() => setActiveTask(task)}
                      className="h-10 px-5 bg-indigo-50 text-indigo-600 rounded-xl font-black text-[9px] uppercase tracking-widest group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm"
                    >
                      Audit
                    </button>
                 </motion.div>
               ))
            ) : (
               <div className="bg-white p-12 rounded-[40px] border border-dashed border-slate-100 text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200 shadow-inner">
                     <CheckCircle2 size={32} />
                  </div>
                  <p className="text-slate-300 font-black uppercase text-[10px] tracking-widest">All Cycles Completed</p>
                  <p className="text-[8px] text-slate-200 uppercase mt-1 tracking-widest">Returns in 24:00:00</p>
               </div>
            )}
         </div>
      </div>

      <div className="bg-amber-50 p-6 rounded-[32px] border border-amber-100 flex items-start gap-4 mx-1">
         <AlertCircle size={20} className="text-amber-500 shrink-0 mt-0.5" />
         <p className="text-[9px] font-bold text-amber-800 leading-relaxed uppercase tracking-wider italic">
           Security node active. Do not refresh or exit the ad screen. System audits human interaction patterns for payout verification.
         </p>
      </div>

      <AnimatePresence>
        {activeTask && (
          <AdTimerModal 
            task={activeTask} 
            onComplete={handleTaskComplete} 
            onCancel={() => setActiveTask(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DailyWork;
