
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, Zap, Lock, Eye, CheckCircle2, Award, 
  ChevronRight, Upload, ShieldCheck, ExternalLink, 
  Clock, Loader2, Check, Star, Gift, Info
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import StreakWidget from '../../components/user/StreakWidget';

const DailyWork = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [executingTask, setExecutingTask] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [fileData, setFileData] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await api.get('/work/tasks');
        setTasks(data);
      } catch (err) {
        console.error("Task fetch failed");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFileData(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleFinalSubmit = async () => {
    if (!fileData) return alert("Please attach proof screenshot.");
    setIsSubmitting(true);
    try {
      await api.post('/work/submit', {
        taskId: executingTask.id,
        taskTitle: executingTask.title,
        reward: executingTask.reward,
        image: fileData
      });
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      alert("Submission successful! Reward pending audit.");
      setExecutingTask(null);
      setStep(1);
      setFileData(null);
    } catch (err: any) {
      alert(err.message || "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="py-20 text-center"><Loader2 className="w-10 h-10 animate-spin mx-auto text-indigo-500" /></div>;

  return (
    <div className="max-w-md mx-auto px-2 pb-24 space-y-4 animate-fade-in">
      
      {/* 1. STREAK NODE */}
      <StreakWidget />

      {/* 2. TASK ENGINE */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-2">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Daily Assignments</h3>
           <span className="text-[9px] font-bold text-slate-300 uppercase">{tasks.length} Nodes Available</span>
        </div>

        <AnimatePresence mode="wait">
          {executingTask ? (
            <motion.div key="executing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-xl space-y-6">
               <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 leading-tight uppercase italic">{executingTask.title}</h2>
                    <p className="text-[9px] font-bold text-green-600 uppercase mt-1 tracking-widest">Yield: Rs. {executingTask.reward}</p>
                  </div>
                  <button onClick={() => setExecutingTask(null)} className="p-2 bg-slate-50 rounded-full text-slate-300"><Clock size={16} /></button>
               </div>

               {step === 1 ? (
                 <div className="space-y-6">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                       <p className="text-[10px] font-bold text-slate-600 leading-relaxed">{executingTask.instruction}</p>
                    </div>
                    <a href={executingTask.mediaUrl} target="_blank" rel="noreferrer" className="w-full h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-between px-6 font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all border border-indigo-100">
                       Open Assignment <ExternalLink size={18} />
                    </a>
                    <button onClick={() => setStep(2)} className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl">Continue to Proof</button>
                 </div>
               ) : (
                 <div className="space-y-6">
                    <div className="relative group">
                       <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                       <div className={clsx("w-full py-12 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-4 transition-all", fileData ? "bg-green-50 border-green-200" : "bg-slate-50 border-slate-100")}>
                          {fileData ? <div className="w-16 h-16 rounded-xl overflow-hidden shadow-lg border-2 border-white"><img src={fileData} className="w-full h-full object-cover" /></div> : <Upload size={28} className="text-slate-300" />}
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{fileData ? "Packet Cached" : "Upload Screenshot"}</p>
                       </div>
                    </div>
                    <div className="flex gap-2">
                       <button onClick={() => setStep(1)} className="flex-1 h-12 bg-slate-50 text-slate-400 rounded-xl font-black text-[10px] uppercase">Back</button>
                       <button onClick={handleFinalSubmit} disabled={isSubmitting || !fileData} className="flex-[2] h-12 bg-green-500 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl disabled:opacity-50">
                          {isSubmitting ? 'SYNCING...' : 'DEPLOY PROOF'}
                       </button>
                    </div>
                 </div>
               )}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {tasks.map((task) => (
                <motion.div 
                  key={task.id} 
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setExecutingTask(task); setStep(1); }}
                  className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-indigo-200 transition-all"
                >
                  <div className="flex items-center gap-4 overflow-hidden">
                    <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-sky-400 shadow-lg shrink-0"><Zap size={20} fill="currentColor" /></div>
                    <div className="overflow-hidden">
                      <h4 className="font-black text-slate-800 text-[11px] uppercase truncate leading-tight">{task.title}</h4>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Reward: <span className="text-green-600 font-black">Rs {task.reward}</span></p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-200 group-hover:text-indigo-500 transition-colors" />
                </motion.div>
              ))}
              {tasks.length === 0 && (
                <div className="bg-white p-12 rounded-[40px] border border-dashed border-slate-200 text-center">
                   <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200"><CheckCircle2 size={32}/></div>
                   <p className="text-slate-300 font-black uppercase text-[10px] tracking-widest">All Nodes Cleared</p>
                </div>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="px-5 py-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-start gap-3">
         <Info size={14} className="text-indigo-500 shrink-0 mt-0.5" />
         <p className="text-[8px] font-bold uppercase tracking-widest leading-relaxed text-indigo-700">Audit Node: Our human verification team manually checks every screenshot. Fake submissions result in permanent account termination.</p>
      </div>
    </div>
  );
};

export default DailyWork;
