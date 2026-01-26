
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Clock, CheckCircle2, ShieldCheck, 
  Loader2, X, ChevronLeft, Briefcase, RefreshCw,
  Camera, Upload, ArrowRight, History, ExternalLink,
  ChevronRight, Play, FileCheck, Info, MousePointer2,
  Target
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { clsx } from 'clsx';

const DailyWork = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'daily' | 'history'>('daily');
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTask, setActiveTask] = useState<any>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await api.get('/work/tasks');
      setTasks(Array.isArray(data) ? data : []);
    } catch (e) {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleTaskComplete = async () => {
    if (!preview) return alert("Please upload evidence.");
    setSubmitting(true);
    try {
      await api.post('/work/complete', { 
        taskId: activeTask.id, 
        evidence: preview, 
        username: user?.name, 
        taskTitle: activeTask.title, 
        reward: activeTask.reward 
      });
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.8 } });
      setActiveTask(null);
      setPreview(null);
      fetchTasks();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const hasNoPlan = !user?.currentPlan || user.currentPlan === 'None';

  return (
    <div className="w-full max-w-full pb-20 space-y-4 animate-fade-in">
      <header className="flex items-center justify-between px-1">
        <Link to="/user/dashboard" className="p-2 bg-white rounded-lg shadow-sm border border-slate-100 text-slate-400 active:scale-90 transition-all"><ChevronLeft size={16} /></Link>
        <h1 className="text-sm font-black text-slate-900 tracking-tight italic uppercase">Work <span className="text-indigo-600">Protocol.</span></h1>
        <button onClick={fetchTasks} className="w-8 h-8 bg-white border border-slate-100 rounded-lg flex items-center justify-center text-slate-400 shadow-sm active:scale-95">
           <RefreshCw size={14} className={clsx(loading && "animate-spin")} />
        </button>
      </header>

      <div className="flex bg-white p-1 rounded-xl border border-slate-100 shadow-sm">
         <button onClick={() => setActiveTab('daily')} className={clsx("flex-1 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all", activeTab === 'daily' ? "bg-slate-950 text-white" : "text-slate-400")}>Open Hub</button>
         <button onClick={() => setActiveTab('history')} className={clsx("flex-1 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all", activeTab === 'history' ? "bg-slate-950 text-white" : "text-slate-400")}>Log</button>
      </div>

      <AnimatePresence mode="wait">
        {activeTask ? (
          <motion.div 
            key="active-task" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
            className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xl space-y-4"
          >
             <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center"><Target size={14}/></div>
                   <h3 className="text-xs font-black text-slate-800 uppercase truncate max-w-[150px]">{activeTask.title}</h3>
                </div>
                <button onClick={() => setActiveTask(null)} className="p-1.5 bg-slate-100 rounded-full text-slate-400"><X size={14}/></button>
             </div>

             <div className="bg-slate-900 p-4 rounded-xl text-white space-y-2.5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-5"><Zap size={24}/></div>
                <p className="text-[7px] font-black text-indigo-400 uppercase tracking-widest">Execution Guide</p>
                <p className="text-[10px] font-bold leading-relaxed">{activeTask.instruction}</p>
                {activeTask.mediaUrl && (
                  <a href={activeTask.mediaUrl} target="_blank" className="flex items-center justify-center gap-2 h-9 w-full bg-white/10 hover:bg-white/20 text-white rounded-lg text-[8px] font-black uppercase border border-white/5 transition-all">
                    <ExternalLink size={12}/> Open Resource
                  </a>
                )}
             </div>

             <div className="space-y-4">
                <div className="relative h-32 group">
                   <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                   <div className={clsx(
                     "w-full h-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all",
                     preview ? "bg-indigo-50 border-indigo-300" : "bg-slate-50 border-slate-200"
                   )}>
                      {preview ? <img src={preview} className="h-full w-full object-cover rounded-lg p-1" /> : (
                        <>
                           <Camera size={20} className="text-slate-300" />
                           <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Attach Proof Screenshot</span>
                        </>
                      )}
                   </div>
                </div>

                <button 
                  onClick={handleTaskComplete} 
                  disabled={submitting || !preview}
                  className="w-full h-12 bg-indigo-600 text-white rounded-xl font-black text-[9px] uppercase tracking-[0.2em] shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
                >
                   {submitting ? <Loader2 size={16} className="animate-spin" /> : <>Submit Packet <ChevronRight size={14}/></>}
                </button>
             </div>
          </motion.div>
        ) : hasNoPlan ? (
          <motion.div key="lock" className="bg-white p-8 rounded-3xl border border-slate-100 text-center flex flex-col items-center">
             <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mb-5"><ShieldCheck size={28} /></div>
             <h2 className="text-sm font-black text-slate-900 uppercase mb-1">Access Denied.</h2>
             <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-6 leading-relaxed">No active production station linked to your identity.</p>
             <button onClick={() => navigate('/user/plans')} className="h-10 w-full bg-indigo-600 text-white rounded-xl font-black text-[8px] uppercase tracking-widest shadow-md">Initialize Plan</button>
          </motion.div>
        ) : (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
            {loading ? (
               <div className="py-20 text-center"><Loader2 size={24} className="animate-spin mx-auto text-slate-200" /></div>
            ) : tasks.filter(t => t.myStatus === 'new').length > 0 ? (
               tasks.filter(t => t.myStatus === 'new').map((task, idx) => (
                  <motion.div 
                    key={task.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}
                    className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between gap-4 group hover:border-indigo-200 transition-all"
                  >
                     <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 bg-slate-950 text-sky-400 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"><Zap size={18} fill="currentColor"/></div>
                        <div className="overflow-hidden">
                           <h4 className="font-black text-slate-900 text-[10px] uppercase truncate leading-none mb-1.5">{task.title}</h4>
                           <p className="text-[8px] font-bold text-emerald-600 uppercase tracking-widest">Revenue: Rs {task.reward}</p>
                        </div>
                     </div>
                     <button 
                       onClick={() => setActiveTask(task)}
                       className="h-8 px-4 bg-slate-100 text-slate-600 rounded-lg font-black text-[7px] uppercase tracking-widest hover:bg-slate-950 hover:text-white transition-all shadow-sm shrink-0"
                     >
                        Process
                     </button>
                  </motion.div>
               ))
            ) : (
               <div className="py-20 text-center opacity-30">
                  <CheckCircle2 size={32} className="mx-auto mb-3" />
                  <p className="text-[9px] font-black uppercase tracking-widest">All assignments synchronized</p>
               </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DailyWork;
