
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Clock, CheckCircle2, ShieldCheck, 
  Loader2, X, ChevronLeft, Briefcase, RefreshCw,
  Camera, Upload, ArrowRight, History, ExternalLink,
  ChevronRight, Play, FileCheck, Info, MousePointer2,
  Target, FileText, Download
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

      <AnimatePresence mode="wait">
        {activeTask ? (
          <motion.div 
            key="active-task" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
            className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xl space-y-5"
          >
             <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                <div className="flex items-center gap-2">
                   <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><Target size={16}/></div>
                   <h3 className="text-xs font-black text-slate-800 uppercase truncate max-w-[200px]">{activeTask.title}</h3>
                </div>
                <button onClick={() => setActiveTask(null)} className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-slate-900"><X size={18}/></button>
             </div>

             <div className="bg-slate-900 p-5 rounded-2xl text-white space-y-3.5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10"><Zap size={32} fill="currentColor" /></div>
                <p className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.2em]">Deployment Protocol</p>
                <p className="text-[11px] font-bold leading-relaxed italic">"{activeTask.instruction}"</p>
                
                {/* PDF HANDLER */}
                {activeTask.mediaType === 'pdf' && (
                  <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between backdrop-blur-md">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-rose-500/20 text-rose-400 rounded-lg flex items-center justify-center border border-rose-500/30">
                           <FileText size={20} />
                        </div>
                        <div className="overflow-hidden">
                           <p className="text-[10px] font-black uppercase text-white truncate">Assignment Node</p>
                           <p className="text-[8px] font-bold text-slate-400 uppercase">Document Asset (PDF)</p>
                        </div>
                     </div>
                     <a 
                       href={activeTask.mediaUrl} 
                       download={`${activeTask.title}.pdf`}
                       className="h-10 px-4 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg active:scale-95"
                     >
                       Download <Download size={14} />
                     </a>
                  </div>
                )}

                {activeTask.mediaType === 'link' && (
                  <a href={activeTask.mediaUrl} target="_blank" className="flex items-center justify-center gap-2 h-11 w-full bg-white/10 hover:bg-white/20 text-white rounded-xl text-[9px] font-black uppercase border border-white/5 transition-all">
                    <ExternalLink size={14}/> Visit Target Source
                  </a>
                )}
             </div>

             <div className="space-y-4">
                <div className="relative h-40 group">
                   <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                   <div className={clsx(
                     "w-full h-full rounded-[28px] border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all",
                     preview ? "bg-indigo-50 border-indigo-400" : "bg-slate-50 border-slate-200"
                   )}>
                      {preview ? <img src={preview} className="h-full w-full object-contain rounded-2xl p-2" /> : (
                        <>
                           <Camera size={28} className="text-slate-300" />
                           <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest text-center px-6">Upload Verification Screenshot <br/> of Completed Work</p>
                        </>
                      )}
                   </div>
                </div>

                <button 
                  onClick={handleTaskComplete} 
                  disabled={submitting || !preview}
                  className="w-full h-16 bg-slate-950 text-white rounded-[28px] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-40"
                >
                   {submitting ? <Loader2 size={24} className="animate-spin" /> : <>Submit For Audit <ShieldCheck size={20}/></>}
                </button>
             </div>
          </motion.div>
        ) : hasNoPlan ? (
          <motion.div key="lock" className="bg-white p-10 rounded-[44px] border border-slate-100 text-center flex flex-col items-center shadow-sm">
             <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-[28px] flex items-center justify-center mb-6 shadow-inner"><ShieldCheck size={32} /></div>
             <h2 className="text-lg font-black text-slate-900 uppercase italic mb-2 tracking-tighter">Station Offline.</h2>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-10 leading-relaxed">No active production station linked to your identity node. Activation required.</p>
             <button onClick={() => navigate('/user/plans')} className="h-14 w-full bg-slate-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl active:scale-95">Connect Station</button>
          </motion.div>
        ) : (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            {loading ? (
               <div className="py-32 text-center flex flex-col items-center gap-4">
                  <RefreshCw className="animate-spin text-slate-200" size={32} />
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">Querying Hub...</p>
               </div>
            ) : tasks.filter(t => t.myStatus === 'new').length > 0 ? (
               tasks.filter(t => t.myStatus === 'new').map((task, idx) => (
                  <motion.div 
                    key={task.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}
                    className="bg-white p-4 rounded-[28px] border border-slate-100 shadow-sm flex items-center justify-between gap-4 group hover:border-indigo-100 transition-all"
                  >
                     <div className="flex items-center gap-4 overflow-hidden">
                        <div className="w-12 h-12 bg-slate-900 text-sky-400 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                           {task.mediaType === 'pdf' ? <FileText size={22}/> : <Zap size={22} fill="currentColor"/>}
                        </div>
                        <div className="overflow-hidden">
                           <h4 className="font-black text-slate-800 text-[11px] uppercase truncate leading-none mb-1.5">{task.title}</h4>
                           <div className="flex items-center gap-2">
                              <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Yield: Rs {task.reward}</span>
                              {task.mediaType === 'pdf' && <span className="bg-rose-50 text-rose-500 px-1.5 py-0.5 rounded text-[6px] font-black uppercase">DOC</span>}
                           </div>
                        </div>
                     </div>
                     <button 
                       onClick={() => setActiveTask(task)}
                       className="h-10 px-6 bg-slate-100 text-slate-900 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-slate-950 hover:text-white transition-all shadow-sm shrink-0"
                     >
                        Process
                     </button>
                  </motion.div>
               ))
            ) : (
               <div className="py-24 text-center opacity-30">
                  <CheckCircle2 size={48} className="mx-auto mb-4 text-slate-200" />
                  <p className="text-[10px] font-black uppercase tracking-[0.4em]">All assignments synchronized</p>
               </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DailyWork;
