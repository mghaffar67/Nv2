
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Clock, CheckCircle2, ShieldCheck, 
  Loader2, X, Sparkles, ChevronLeft, Layout,
  Target, Info, Lock, ArrowRight, Award,
  ExternalLink, MousePointer2, Briefcase, RefreshCw,
  Eye, Monitor, ShieldAlert, Cpu, Camera, Upload, User as UserIcon,
  ImageIcon, FileText, Download, FileDown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { clsx } from 'clsx';

const TaskSubmissionModal = ({ task, onComplete, onCancel }: any) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(user?.name || '');
  const [preview, setPreview] = useState<string | null>(null);
  const [evidence, setEvidence] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setEvidence(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWorkSubmit = async () => {
    if (!username || !evidence) return alert("Please provide your name and the proof photo.");
    setLoading(true);
    try {
      await onComplete(task, evidence, username);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadAsset = () => {
    if (!task.mediaUrl) return;
    const link = document.createElement('a');
    link.href = task.mediaUrl;
    link.download = `task-asset-${task.id}.${task.mediaType === 'pdf' ? 'pdf' : 'png'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-white/40 backdrop-blur-3xl flex flex-col items-center justify-center p-4 overflow-y-auto"
    >
      <div className="absolute top-6 right-6">
        <button onClick={onCancel} className="p-3 bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition-all"><X size={20} /></button>
      </div>

      <div className="max-w-md w-full space-y-6 py-10 relative">
        {/* Soft Mesh Background Decor */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-sky-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="text-center space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border border-indigo-100">
            <Briefcase size={12} /> TASK SUBMISSION
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Complete Task</h2>
          <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">{task.title}</p>
        </div>

        <div className="bg-white/80 border border-white rounded-[44px] shadow-2xl p-8 space-y-6 relative z-10 backdrop-blur-md">
           <div className="space-y-5">
              {/* Task Asset Preview if PDF or Image */}
              {(task.mediaType === 'image' || task.mediaType === 'pdf') && (
                <div className="p-4 bg-slate-900 rounded-[28px] text-white flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
                         {task.mediaType === 'image' ? <ImageIcon size={20}/> : <FileText size={20}/>}
                      </div>
                      <div>
                         <p className="text-[8px] font-black text-indigo-300 uppercase tracking-widest">Instruction Asset</p>
                         <p className="text-[10px] font-bold text-white uppercase">{task.mediaType === 'pdf' ? 'PDF Document' : 'Reference Image'}</p>
                      </div>
                   </div>
                   <button 
                     onClick={handleDownloadAsset}
                     className="h-10 px-4 bg-white/10 hover:bg-white/20 rounded-xl flex items-center gap-2 text-[9px] font-black uppercase transition-all"
                   >
                     <Download size={14}/> Download
                   </button>
                </div>
              )}

              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                    <UserIcon size={12} className="text-indigo-500"/> Full Name
                 </label>
                 <input 
                   value={username} onChange={e => setUsername(e.target.value)} 
                   className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50/50 transition-all shadow-inner" 
                   placeholder="Enter your name" 
                 />
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2">
                    <Camera size={12} className="text-indigo-500"/> Proof Screenshot
                 </label>
                 <div className="relative group h-48">
                    <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                    <div className={clsx(
                      "w-full h-full rounded-[36px] border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all duration-500",
                      preview ? "border-emerald-500 bg-emerald-50/20" : "border-slate-200 bg-slate-50 hover:border-indigo-400"
                    )}>
                       {preview ? (
                          <img src={preview} className="w-full h-full object-cover rounded-[30px] p-1" />
                       ) : (
                         <>
                           <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-slate-300 shadow-sm border border-slate-50 group-hover:scale-110 transition-transform"><Upload size={28}/></div>
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Evidence</span>
                         </>
                       )}
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-slate-50 p-5 rounded-[28px] border border-slate-100 flex gap-3 items-start">
              <Info size={18} className="text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Guide</p>
                <p className="text-[11px] font-medium text-slate-600 leading-relaxed italic">"{task.instruction}"</p>
              </div>
           </div>
        </div>

        <button 
          onClick={handleWorkSubmit} disabled={loading || !evidence} 
          className="w-full h-16 bg-slate-900 text-white rounded-[32px] font-black text-[12px] uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all disabled:opacity-30 flex items-center justify-center gap-3"
        >
          {loading ? <Loader2 className="animate-spin" size={20}/> : <><CheckCircle2 size={20} className="text-emerald-400" /> SUBMIT NOW</>}
        </button>
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
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleTaskComplete = async (task: any, evidence: string, username: string) => {
    try {
      await api.post('/work/complete', { taskId: task.id, evidence, username, taskTitle: task.title, reward: task.reward });
      confetti({ particleCount: 200, spread: 90, origin: { y: 0.8 } });
      setActiveTask(null);
      fetchTasks();
    } catch (err: any) {
      alert(err.message || "Failed to submit work.");
    }
  };

  const hasNoPlan = !user?.currentPlan || user.currentPlan === 'None';

  return (
    <div className="w-full max-w-full pb-24 space-y-6 animate-fade-in px-1">
      <header className="flex items-center justify-between pt-2 px-1">
        <Link to="/user/dashboard" className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 active:scale-90 transition-all">
          <ChevronLeft size={22} />
        </Link>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight italic">Daily <span className="text-indigo-600">Tasks.</span></h1>
        <div className="w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center text-sky-400 shadow-lg border border-white/10">
          <Briefcase size={20} />
        </div>
      </header>

      {hasNoPlan ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-12 rounded-[56px] border border-slate-100 text-center shadow-2xl flex flex-col items-center mx-1 relative overflow-hidden group">
           <div className="absolute top-0 left-0 w-full h-2 bg-rose-500 opacity-50" />
           <div className="w-24 h-24 bg-slate-950 text-rose-500 rounded-[35px] flex items-center justify-center mb-8 shadow-xl">
              <ShieldAlert size={48} />
           </div>
           <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase mb-4">Plan Required.</h2>
           <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed mb-10 px-8">Please select an earning plan to start receiving daily assignments.</p>
           <button onClick={() => navigate('/user/plans')} className="w-full h-16 bg-indigo-600 text-white rounded-[32px] font-black text-xs uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all">
             See Plans <ArrowRight size={20} />
           </button>
        </motion.div>
      ) : (
        <>
          <div className="bg-indigo-600 p-7 rounded-[44px] text-white flex justify-between items-center relative overflow-hidden shadow-2xl mx-1 border border-white/10">
             <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 scale-150"><Zap size={100} fill="currentColor"/></div>
             <div className="relative z-10">
                <p className="text-[9px] font-black text-indigo-100 uppercase tracking-widest mb-1.5 opacity-80">STATION LEVEL</p>
                <h3 className="text-3xl font-black tracking-tight uppercase italic">{user?.currentPlan}</h3>
             </div>
             <div className="text-right relative z-10 bg-white/10 px-6 py-3 rounded-3xl border border-white/10 backdrop-blur-md">
                <p className="text-[9px] font-black text-indigo-100 uppercase mb-1">OPEN WORK</p>
                <p className="text-2xl font-black text-white leading-none">{tasks.length}</p>
             </div>
          </div>

          <div className="space-y-4 px-1 min-h-[400px]">
            {loading ? (
              <div className="py-24 text-center flex flex-col items-center gap-4"><RefreshCw className="animate-spin text-indigo-500" size={40} /><p className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Searching node network...</p></div>
            ) : tasks.length > 0 ? (
              tasks.map((task, idx) => (
                <motion.div key={task.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }} className="bg-white p-6 rounded-[40px] border border-slate-100 shadow-sm space-y-6 group hover:border-indigo-200 transition-all">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                           <Zap size={28} fill="currentColor" />
                        </div>
                        <div>
                           <div className="flex items-center gap-2 mb-1.5">
                              <h4 className="font-black text-slate-900 text-base tracking-tight leading-none">{task.title}</h4>
                           </div>
                           <div className="flex items-center gap-2.5">
                              <span className="text-xs font-black text-emerald-600">Rs {task.reward} Reward</span>
                              <span className="w-1 h-1 bg-slate-200 rounded-full" />
                              {task.mediaType === 'pdf' && (
                                <span className="flex items-center gap-1 text-[8px] font-black text-indigo-500 uppercase bg-indigo-50 px-2 py-0.5 rounded-md">
                                   <FileDown size={10} /> PDF Guide Included
                                </span>
                              )}
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">Manual Process</span>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-[28px] border border-slate-50">
                     <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic">"{task.instruction}"</p>
                  </div>
                  <button onClick={() => setActiveTask(task)} className="w-full h-14 bg-slate-900 text-white rounded-[24px] font-black text-[11px] uppercase tracking-widest shadow-lg flex items-center justify-center gap-3 active:scale-95 transition-all">
                     <MousePointer2 size={18} /> START WORK
                  </button>
                </motion.div>
              ))
            ) : (
              <div className="bg-white p-20 rounded-[56px] border border-dashed border-slate-100 text-center flex flex-col items-center opacity-60 shadow-inner mx-1">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-[36px] flex items-center justify-center mb-8 shadow-inner"><CheckCircle2 size={40} /></div>
                <p className="text-slate-900 font-black uppercase text-base tracking-tight">Queue Clear!</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase mt-2 tracking-widest max-w-[200px] leading-relaxed">You have completed all work for today. Check back tomorrow.</p>
              </div>
            )}
          </div>
        </>
      )}

      <AnimatePresence>
        {activeTask && (
          <TaskSubmissionModal task={activeTask} onComplete={handleTaskComplete} onCancel={() => setActiveTask(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DailyWork;
