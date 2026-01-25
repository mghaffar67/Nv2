
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Clock, CheckCircle2, ShieldCheck, 
  Loader2, X, ChevronLeft, Briefcase, RefreshCw,
  MousePointer2, Camera, Upload, User as UserIcon,
  ShieldAlert, ArrowRight, History, AlertCircle, ExternalLink,
  MessageSquareWarning
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { clsx } from 'clsx';

const SkeletonCard = () => (
  <div className="bg-white p-6 rounded-[40px] border border-slate-100 shadow-sm space-y-6 animate-pulse mx-1">
    <div className="flex items-center gap-5">
      <div className="w-14 h-14 rounded-2xl bg-slate-100" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-slate-100 rounded-full w-2/3" />
        <div className="h-3 bg-slate-50 rounded-full w-1/3" />
      </div>
    </div>
    <div className="h-14 bg-slate-50 rounded-[24px] w-full" />
  </div>
);

const TaskSubmissionModal = ({ task, onComplete, onCancel }: any) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(user?.name || '');
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!preview) return alert("Screenshot proof is required.");
    setLoading(true);
    try {
      await onComplete(task, preview, username);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[40px] overflow-hidden shadow-2xl relative">
        <button onClick={onCancel} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900"><X size={24}/></button>
        <div className="p-8 space-y-6">
           <div className="text-center">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">File Proof.</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Identity: {user?.name}</p>
           </div>
           
           <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
              <p className="text-[10px] font-black text-indigo-600 uppercase mb-2">Instructions</p>
              <p className="text-[11px] font-medium text-slate-600 leading-relaxed italic">"{task.instruction}"</p>
              <a href={task.mediaUrl || '#'} target="_blank" className="mt-4 flex items-center justify-center gap-2 h-10 w-full bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest">
                <ExternalLink size={14}/> Open Task Link
              </a>
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Upload Screenshot</label>
              <div className="relative group h-48">
                 <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                 <div className={clsx(
                   "w-full h-full rounded-[32px] border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all duration-500",
                   preview ? "border-emerald-500 bg-emerald-50/20" : "border-slate-200 bg-slate-50 hover:border-indigo-400"
                 )}>
                    {preview ? <img src={preview} className="w-full h-full object-cover rounded-[28px] p-1" /> : (
                      <>
                        <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-slate-300 shadow-sm border border-slate-50"><Upload size={28}/></div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tap to select photo</span>
                      </>
                    )}
                 </div>
              </div>
           </div>

           <button onClick={handleSubmit} disabled={loading || !preview} className="w-full h-16 bg-indigo-600 text-white rounded-[24px] font-black text-[12px] uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 disabled:opacity-30">
              {loading ? <Loader2 size={24} className="animate-spin" /> : <>Submit for Audit <ArrowRight size={18}/></>}
           </button>
        </div>
      </div>
    </motion.div>
  );
};

const DailyWork = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'daily' | 'history'>('daily');
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
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.8 } });
      setActiveTask(null);
      fetchTasks();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const hasNoPlan = !user?.currentPlan || user.currentPlan === 'None';

  return (
    <div className="w-full max-w-full pb-24 space-y-6 animate-fade-in px-1">
      <header className="flex items-center justify-between pt-2 px-1">
        <Link to="/user/dashboard" className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 active:scale-90 transition-all"><ChevronLeft size={22} /></Link>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight italic">Work <span className="text-indigo-600">Hub.</span></h1>
        <button onClick={fetchTasks} className="w-11 h-11 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 shadow-sm active:rotate-180 transition-all duration-700">
           <RefreshCw size={20}/>
        </button>
      </header>

      {/* SUB-NAV */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm mx-1">
         <button onClick={() => setActiveTab('daily')} className={clsx("flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", activeTab === 'daily' ? "bg-slate-950 text-white shadow-lg" : "text-slate-400")}>Open Cycle</button>
         <button onClick={() => setActiveTab('history')} className={clsx("flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", activeTab === 'history' ? "bg-slate-950 text-white shadow-lg" : "text-slate-400")}>Submission Log</button>
      </div>

      {hasNoPlan ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-12 rounded-[56px] border border-slate-100 text-center shadow-2xl flex flex-col items-center mx-1 relative overflow-hidden group">
           <div className="w-20 h-20 bg-slate-950 text-rose-500 rounded-[35px] flex items-center justify-center mb-8 shadow-xl"><ShieldAlert size={48} /></div>
           <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase mb-4 leading-none">Authorization Failed</h2>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed mb-10 px-6">Your identity node is currently inactive. Activate an earning station to begin receiving assignments.</p>
           <button onClick={() => navigate('/user/plans')} className="w-full h-16 bg-indigo-600 text-white rounded-[32px] font-black text-xs uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all">Go to Stations <ArrowRight size={20} /></button>
        </motion.div>
      ) : (
        <div className="space-y-4 px-1 min-h-[400px]">
          {loading ? (
            <div className="space-y-4">
              <SkeletonCard /><SkeletonCard /><SkeletonCard />
            </div>
          ) : activeTab === 'daily' ? (
             tasks.filter(t => t.myStatus === 'new').length > 0 ? (
               tasks.filter(t => t.myStatus === 'new').map((task, idx) => (
                <motion.div key={task.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }} className="bg-white p-6 rounded-[40px] border border-slate-100 shadow-sm space-y-6 group hover:border-indigo-200 transition-all">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                        <Zap size={28} fill="currentColor" />
                    </div>
                    <div>
                        <h4 className="font-black text-slate-900 text-base tracking-tight leading-none mb-1.5">{task.title}</h4>
                        <p className="text-xs font-black text-emerald-600 uppercase">Rs {task.reward} Reward</p>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-[28px] border border-slate-50">
                     <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic">"{task.instruction}"</p>
                  </div>
                  <button onClick={() => setActiveTask(task)} className="w-full h-14 bg-indigo-600 text-white rounded-[24px] font-black text-[11px] uppercase tracking-widest shadow-lg flex items-center justify-center gap-3 active:scale-95 transition-all">
                     <MousePointer2 size={18} /> INITIALIZE TASK
                  </button>
                </motion.div>
               ))
             ) : (
               <div className="bg-white p-20 rounded-[56px] border border-dashed border-slate-100 text-center flex flex-col items-center opacity-60 shadow-inner">
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-[36px] flex items-center justify-center mb-8 shadow-inner"><CheckCircle2 size={40} /></div>
                  <p className="text-slate-900 font-black uppercase text-base tracking-tight">Queue Depleted</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-2 tracking-widest max-w-[200px] leading-relaxed">Check Submission Log for status updates on pending audits.</p>
               </div>
             )
          ) : (
            <div className="space-y-3">
               {tasks.filter(t => t.myStatus !== 'new').map((task, idx) => (
                 <div key={task.id} className="bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                       <div className={clsx(
                         "w-11 h-11 rounded-2xl flex items-center justify-center transition-all shadow-inner",
                         task.myStatus === 'approved' ? "bg-emerald-50 text-emerald-600" :
                         task.myStatus === 'rejected' ? "bg-rose-50 text-rose-500" : "bg-amber-50 text-amber-500"
                       )}>
                          {task.myStatus === 'approved' ? <ShieldCheck size={20}/> : task.myStatus === 'rejected' ? <ShieldAlert size={20}/> : <Clock size={20} className="animate-spin-slow"/>}
                       </div>
                       <div className="overflow-hidden">
                          <h4 className="font-black text-slate-800 text-[11px] uppercase truncate tracking-tight">{task.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                             <span className="text-[7px] font-black uppercase text-slate-400 italic">PKR {task.reward}</span>
                             <div className="w-1 h-1 bg-slate-200 rounded-full" />
                             <span className={clsx(
                               "text-[7px] font-black uppercase tracking-widest",
                               task.myStatus === 'approved' ? "text-emerald-500" :
                               task.myStatus === 'rejected' ? "text-rose-500" : "text-amber-500"
                             )}>{task.myStatus}</span>
                          </div>
                       </div>
                    </div>
                    {task.myStatus === 'rejected' && task.adminNote && (
                      <div className="px-3 py-1 bg-rose-50 border border-rose-100 rounded-lg text-[7px] font-bold text-rose-600 max-w-[100px] truncate uppercase">
                         {task.adminNote}
                      </div>
                    )}
                 </div>
               ))}
               {tasks.filter(t => t.myStatus !== 'new').length === 0 && (
                 <div className="py-20 text-center flex flex-col items-center opacity-30">
                    <History size={48} className="text-slate-300 mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest italic">Submission Log Empty</p>
                 </div>
               )}
            </div>
          )}
        </div>
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
