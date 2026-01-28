
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Clock, CheckCircle2, ShieldCheck, 
  Loader2, X, ChevronLeft, Briefcase, RefreshCw,
  Camera, Upload, ArrowRight, History, ExternalLink,
  ChevronRight, Play, FileCheck, Info, MousePointer2,
  Target, FileText, Download, ListChecks,
  // Added missing Smartphone icon import
  Smartphone
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { clsx } from 'clsx';

const DailyWork = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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
            className="bg-white p-5 rounded-[40px] border border-slate-100 shadow-xl space-y-6"
          >
             <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner"><Target size={20}/></div>
                   <div>
                      <h3 className="text-xs font-black text-slate-800 uppercase truncate max-w-[180px]">{activeTask.title}</h3>
                      <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">Task ID: {activeTask.id}</p>
                   </div>
                </div>
                <button onClick={() => { setActiveTask(null); setPreview(null); }} className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-rose-500 transition-colors"><X size={20}/></button>
             </div>

             <div className="bg-slate-950 p-6 rounded-[32px] text-white space-y-4 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 scale-150"><Zap size={100} fill="currentColor" /></div>
                <div className="flex items-center gap-2 mb-2">
                   <ListChecks size={14} className="text-indigo-400" />
                   <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em]">Deployment Protocol</p>
                </div>
                
                <div className="space-y-3 relative z-10">
                   <p className="text-xs font-bold leading-relaxed italic text-slate-200">
                     {activeTask.instruction}
                   </p>
                   
                   {/* Verification steps helper */}
                   {activeTask.instruction.includes('screenshot') && (
                     <div className="pt-2 flex flex-col gap-2">
                        {[
                          "Execute the required digital task.",
                          "Capture a clear, visible screenshot of the result.",
                          "Upload the image in the section below for audit."
                        ].map((step, i) => (
                          <div key={i} className="flex items-center gap-2 text-[8px] font-black uppercase text-indigo-300/80 tracking-widest">
                             <div className="w-4 h-4 rounded-full bg-indigo-500/20 flex items-center justify-center text-white text-[6px] border border-white/10">{i+1}</div>
                             {step}
                          </div>
                        ))}
                     </div>
                   )}
                </div>
                
                {/* MEDIA ASSETS */}
                {activeTask.mediaType === 'pdf' && (
                  <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between backdrop-blur-md">
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
                       className="h-10 px-4 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg active:scale-95"
                     >
                       Get File <Download size={14} />
                     </a>
                  </div>
                )}

                {activeTask.mediaType === 'link' && (
                  <a href={activeTask.mediaUrl} target="_blank" className="flex items-center justify-center gap-2 h-12 w-full bg-white/10 hover:bg-white/20 text-white rounded-2xl text-[9px] font-black uppercase border border-white/5 transition-all mt-4">
                    <ExternalLink size={16}/> Access External Resource
                  </a>
                )}
             </div>

             <div className="space-y-4">
                <div className="relative h-44 group">
                   <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                   <div className={clsx(
                     "w-full h-full rounded-[36px] border-2 border-dashed flex flex-col items-center justify-center gap-4 transition-all duration-500",
                     preview ? "bg-indigo-50 border-indigo-500 shadow-inner" : "bg-slate-50 border-slate-200 hover:border-indigo-300"
                   )}>
                      {preview ? (
                        <div className="relative w-full h-full flex items-center justify-center p-4 animate-in zoom-in-95">
                           <img src={preview} className="max-h-full max-w-full object-contain rounded-2xl shadow-xl border-4 border-white" />
                           <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-1.5 shadow-lg border-2 border-white">
                              <CheckCircle2 size={16} />
                           </div>
                        </div>
                      ) : (
                        <>
                           <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-300 shadow-md border border-slate-100 group-hover:scale-110 transition-transform">
                              <Camera size={32} />
                           </div>
                           <div className="text-center px-6">
                              <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest">Evidence Required</p>
                              <p className="text-[7px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1 leading-relaxed">Upload screenshot of completed work</p>
                           </div>
                        </>
                      )}
                   </div>
                </div>

                <button 
                  onClick={handleTaskComplete} 
                  disabled={submitting || !preview}
                  className="w-full h-16 bg-slate-950 text-white rounded-[32px] font-black text-[11px] uppercase tracking-[0.3em] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.3)] flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-40"
                >
                   {submitting ? <Loader2 size={24} className="animate-spin" /> : <><ShieldCheck size={20} className="text-sky-400" /> Submit for Audit</>}
                </button>
             </div>
          </motion.div>
        ) : hasNoPlan ? (
          <motion.div key="lock" className="bg-white p-12 rounded-[56px] border border-slate-100 text-center flex flex-col items-center shadow-sm">
             <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-[30px] flex items-center justify-center mb-8 shadow-inner border border-rose-100/50"><ShieldCheck size={40} /></div>
             <h2 className="text-xl font-black text-slate-900 uppercase italic mb-3 tracking-tighter">Station Offline.</h2>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-12 leading-relaxed max-w-[240px]">No active production station linked to your identity node. Activation is required to view daily assignments.</p>
             <button onClick={() => navigate('/user/plans')} className="h-16 w-full bg-slate-950 text-white rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all">Connect Station Hub</button>
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
                    className="bg-white p-4 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between gap-4 group hover:border-indigo-100 transition-all"
                  >
                     <div className="flex items-center gap-4 overflow-hidden">
                        <div className="w-12 h-12 bg-slate-900 text-sky-400 rounded-[20px] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-lg border border-white/10">
                           {task.mediaType === 'pdf' ? <FileText size={22}/> : <Zap size={22} fill="currentColor"/>}
                        </div>
                        <div className="overflow-hidden">
                           <h4 className="font-black text-slate-800 text-[11px] uppercase truncate leading-none mb-1.5">{task.title}</h4>
                           <div className="flex items-center gap-2">
                              <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1"><Smartphone size={8}/> Reward: Rs {task.reward}</span>
                              {task.mediaType === 'pdf' && <span className="bg-rose-50 text-rose-500 px-1.5 py-0.5 rounded text-[6px] font-black uppercase border border-rose-100">DOC</span>}
                           </div>
                        </div>
                     </div>
                     <button 
                       onClick={() => setActiveTask(task)}
                       className="h-11 px-6 bg-slate-950 text-white rounded-2xl font-black text-[8px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg shrink-0"
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
