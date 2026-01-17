
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Zap, CheckCircle2, XCircle, Clock, 
  Eye, Edit3, Trash2, Check, X, Smartphone, 
  ShieldCheck, AlertCircle, Info, LayoutList,
  Layers, Search
} from 'lucide-react';
import { clsx } from 'clsx';
import { workController } from '../../backend_core/controllers/workController';
import TaskFormModal from '../../components/admin/TaskFormModal';
import { ImageModal } from '../../components/ui/ImageModal';

const WorkManager = () => {
  const [activeTab, setActiveTab] = useState<'manage' | 'review'>('manage');
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [selectedProof, setSelectedProof] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const taskRes = JSON.parse(localStorage.getItem('noor_tasks_db') || '[]');
      setTasks(taskRes);
      
      const subsRes = await new Promise<any[]>((resolve) => {
        workController.getAllSubmissions({}, { status: () => ({ json: resolve }) });
      });
      setSubmissions(subsRes || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const stats = useMemo(() => ({
    active: tasks.length,
    pending: submissions.filter(s => s.status === 'pending').length,
    approved: submissions.filter(s => s.status === 'approved').length
  }), [tasks, submissions]);

  const handleReview = async (sub: any, action: 'approved' | 'rejected') => {
    try {
      await workController.reviewSubmission({ 
        body: { userId: sub.userId, submissionId: sub.id, status: action, reward: sub.reward } 
      }, { status: () => ({ json: () => {} }) });
      fetchData();
    } catch (err) { alert("Audit node failed"); }
  };

  const handleDeleteTask = (id: string) => {
    if (!window.confirm("Terminate this task node?")) return;
    const db = tasks.filter(t => t.id !== id);
    localStorage.setItem('noor_tasks_db', JSON.stringify(db));
    fetchData();
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-24 animate-fade-in max-w-6xl mx-auto px-1">
      
      {/* 1. Header & Stats */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2">
         <div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Task Hub.</h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px] md:text-xs mt-2">Centralized Command for Member Yield</p>
         </div>
         <div className="flex gap-2 w-full md:w-auto">
            <StatPill label="ACTIVE" value={stats.active} icon={Zap} color="bg-sky-50 text-sky-600" />
            <StatPill label="QUEUE" value={stats.pending} icon={Clock} color="bg-amber-50 text-amber-600" animate={stats.pending > 0} />
         </div>
      </header>

      {/* 2. Navigation Control */}
      <div className="flex bg-white p-1.5 rounded-[24px] border border-slate-100 shadow-sm mx-1">
         <button onClick={() => setActiveTab('manage')} className={clsx("flex-1 py-3.5 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all", activeTab === 'manage' ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:text-slate-900")}>Manager</button>
         <button onClick={() => setActiveTab('review')} className={clsx("flex-1 py-3.5 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all relative", activeTab === 'review' ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:text-slate-900")}>
           Audit Queue
           {stats.pending > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[8px] rounded-full flex items-center justify-center ring-4 ring-white">{stats.pending}</span>}
         </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'manage' ? (
          <motion.div key="manage" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
             <div className="flex justify-between items-center px-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 italic"><Layers size={14}/> Operational Nodes</h3>
                <button onClick={() => { setSelectedTask(null); setIsTaskModalOpen(true); }} className="h-10 px-6 bg-indigo-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center gap-2"><Plus size={16}/> New Task</button>
             </div>

             {/* TASK LIST - RESPONSIVE */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-1">
                {tasks.map(task => (
                  <div key={task.id} className="bg-white p-6 rounded-[36px] border border-slate-100 shadow-sm group hover:border-indigo-200 transition-all">
                     <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 bg-slate-900 text-sky-400 rounded-2xl flex items-center justify-center shadow-lg"><Zap size={22} fill="currentColor"/></div>
                        <div className="text-right">
                           <p className="text-[10px] font-black text-slate-900 uppercase">Rs {task.reward}</p>
                           <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">{task.plan || 'BASIC'}</span>
                        </div>
                     </div>
                     <h4 className="text-sm font-black text-slate-800 uppercase italic mb-1 truncate">{task.title}</h4>
                     <p className="text-[8px] font-medium text-slate-400 line-clamp-2 leading-relaxed mb-6">{task.instruction}</p>
                     
                     <div className="flex gap-2 border-t border-slate-50 pt-4">
                        <button onClick={() => { setSelectedTask(task); setIsTaskModalOpen(true); }} className="flex-1 h-10 bg-slate-50 text-slate-400 rounded-xl font-black text-[9px] uppercase flex items-center justify-center gap-2 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"><Edit3 size={14}/> Modify</button>
                        <button onClick={() => handleDeleteTask(task.id)} className="w-10 h-10 bg-rose-50 text-rose-400 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors"><Trash2 size={16}/></button>
                     </div>
                  </div>
                ))}
                {tasks.length === 0 && <div className="col-span-full py-20 text-center bg-white rounded-[44px] border-2 border-dashed border-slate-100 text-slate-300 font-black uppercase text-[10px] tracking-widest">No active tasks in database</div>}
             </div>
          </motion.div>
        ) : (
          <motion.div key="review" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4 mx-1">
             {submissions.filter(s => s.status === 'pending').map(sub => (
               <div key={sub.id} className="bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
                  <div className="flex items-center gap-4 overflow-hidden">
                     <div className="w-11 h-11 bg-slate-950 text-white rounded-xl flex items-center justify-center font-black italic shadow-lg shrink-0">{sub.userName?.charAt(0)}</div>
                     <div className="overflow-hidden">
                        <h4 className="font-black text-slate-900 text-[11px] leading-tight truncate uppercase">{sub.userName}</h4>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1 truncate">{sub.taskTitle}</p>
                     </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 md:border-l md:pl-6 border-slate-50">
                     <button onClick={() => setSelectedProof(sub.userAnswer)} className="w-16 h-11 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 hover:border-sky-400 transition-all group relative">
                        <img src={sub.userAnswer} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-sky-500/10 opacity-0 group-hover:opacity-100 flex items-center justify-center text-sky-600"><Eye size={16}/></div>
                     </button>
                     <div className="text-right">
                        <p className="text-xs font-black text-emerald-600 leading-none">Rs {sub.reward}</p>
                        <p className="text-[7px] font-bold text-slate-300 uppercase tracking-tighter mt-1">{new Date(sub.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                     </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                     <button onClick={() => handleReview(sub, 'approved')} className="flex-grow md:flex-none px-6 h-11 bg-green-500 text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg shadow-green-50 active:scale-95">Authorize</button>
                     <button onClick={() => handleReview(sub, 'rejected')} className="px-4 h-11 bg-rose-50 text-rose-500 rounded-xl border border-rose-100 active:scale-95"><X size={18}/></button>
                  </div>
               </div>
             ))}
             {submissions.filter(s => s.status === 'pending').length === 0 && <div className="py-24 text-center bg-white rounded-[44px] border border-slate-100 text-slate-300 font-black uppercase text-[10px] tracking-widest">Audit Queue Empty</div>}
          </motion.div>
        )}
      </AnimatePresence>

      <TaskFormModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} task={selectedTask} onUpdate={fetchData} />
      <ImageModal isOpen={!!selectedProof} onClose={() => setSelectedProof(null)} imageUrl={selectedProof || ''} />
    </div>
  );
};

const StatPill = ({ label, value, icon: Icon, color, animate }: any) => (
  <div className={clsx("flex-1 bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 active:scale-95 transition-all")}>
     <div className={clsx("w-8 h-8 rounded-xl flex items-center justify-center shrink-0", color, animate && "animate-pulse")}>
        <Icon size={16} />
     </div>
     <div className="overflow-hidden">
        <p className="text-[6px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1 truncate">{label}</p>
        <p className="text-xs font-black text-slate-900 leading-none">{value}</p>
     </div>
  </div>
);

export default WorkManager;
