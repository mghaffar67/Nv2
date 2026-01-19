import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Clock, Play, CheckCircle2, ShieldCheck, 
  Loader2, X, Sparkles, ChevronLeft, Layout
} from 'lucide-react';
import { clsx } from 'clsx';
import confetti from 'canvas-confetti';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';

const AdTimerModal = ({ task, onComplete, onCancel }: any) => {
  const [timeLeft, setTimeLeft] = useState(10);

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
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-white"
    >
      <div className="absolute top-6 right-6">
        <button onClick={onCancel} className="p-4 text-white/30 hover:text-white transition-all"><X size={24} /></button>
      </div>

      <div className="text-center max-w-sm space-y-10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-400 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border border-indigo-500/30">
            <ShieldCheck size={12} /> VERIFYING ATTENTION
          </div>
          <h2 className="text-2xl font-black uppercase italic tracking-tight">Syncing Reward Packet...</h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed">Closing this node will terminate the session without yield.</p>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="w-48 h-48 rounded-full border-[12px] border-white/5 flex items-center justify-center">
            <span className="text-7xl font-black italic tracking-tighter">{timeLeft}</span>
          </div>
        </div>

        <div className="w-full">
          {timeLeft === 0 ? (
            <motion.button 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              onClick={() => onComplete(task)}
              className="w-full h-16 bg-white text-slate-900 rounded-3xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all"
            >
              Claim Rs. {task.reward} <Sparkles size={18} className="text-indigo-500" />
            </motion.button>
          ) : (
            <div className="h-16 flex items-center justify-center gap-2 text-slate-500 font-black text-[10px] uppercase tracking-widest border border-white/5 rounded-3xl bg-white/5">
              <Loader2 className="animate-spin" size={16} /> Audit in progress...
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
      console.error("Task sync failure.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

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
      <header className="flex items-center justify-between px-2 pt-2">
        <Link to="/user/dashboard" className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 active:scale-90 transition-all">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Daily <span className="text-indigo-600">Terminal</span></h1>
        <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-sky-400 shadow-lg">
          <Layout size={16} />
        </div>
      </header>

      <div className="bg-slate-950 p-6 rounded-[32px] text-white flex justify-between items-center relative overflow-hidden mx-1 shadow-xl">
         <div>
            <p className="text-[8px] font-black text-sky-400 uppercase tracking-widest mb-1 italic">Active Node</p>
            <h3 className="text-2xl font-black tracking-tighter uppercase">{user?.currentPlan || 'BASIC'}</h3>
         </div>
         <div className="text-right">
            <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Queue Status</p>
            <p className="text-xl font-black text-emerald-400">{tasks.length} REMAINING</p>
         </div>
      </div>

      <div className="space-y-2.5 mx-1">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center gap-3">
            <Loader2 className="animate-spin text-indigo-500" size={32} />
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Scanning Nodes...</p>
          </div>
        ) : tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task.id} className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm flex items-center justify-between active:scale-[0.98] transition-all">
              <div className="flex items-center gap-4 overflow-hidden">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-sky-400 shadow-lg shrink-0">
                  <Zap size={22} fill="currentColor" />
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-black text-slate-900 text-[11px] uppercase truncate">{task.title}</h4>
                  <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest mt-1">Reward: Rs. {task.reward}</p>
                </div>
              </div>
              <button onClick={() => setActiveTask(task)} className="h-10 px-5 bg-indigo-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-md">Start Audit</button>
            </div>
          ))
        ) : (
          <div className="bg-white p-12 rounded-[40px] border border-dashed border-slate-100 text-center">
            <CheckCircle2 size={32} className="mx-auto text-emerald-500 mb-4" />
            <p className="text-slate-900 font-black uppercase text-xs italic">Sector Clear</p>
            <p className="text-[8px] text-slate-400 uppercase mt-2 tracking-widest font-bold">New assignments re-index in 24h.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {activeTask && (
          <AdTimerModal task={activeTask} onComplete={handleTaskComplete} onCancel={() => setActiveTask(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DailyWork;