
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Zap, CheckCircle2, XCircle, Clock, 
  Eye, Edit3, Trash2, Check, X, Smartphone, 
  ShieldCheck, AlertCircle, Info, LayoutList,
  Layers, Search, MessageSquare, AlertTriangle,
  RefreshCw, Terminal, ArrowRight, Briefcase, Filter,
  FileText, ImageIcon, File
} from 'lucide-react';
import { clsx } from 'clsx';
import { workController } from '../../backend_core/controllers/workController';
import { dbNode } from '../../backend_core/utils/db';
import TaskFormModal from '../../components/admin/TaskFormModal';
import { ImageModal } from '../../components/ui/ImageModal';

const CATEGORY_MAP: Record<string, string> = {
  verification: 'Verification Task',
  data_entry: 'Data Entry',
  social_media: 'Social Work',
  content_creation: 'Creative',
  network: 'Network'
};

const WorkManager = () => {
  const [activeTab, setActiveTab] = useState<'manage' | 'review'>('manage');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [selectedProof, setSelectedProof] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const taskRes = dbNode.getTasks();
      setTasks(taskRes || []);
      
      const subsRes = await new Promise<any[]>((resolve) => {
        workController.getAllSubmissions({}, { status: () => ({ json: resolve }) });
      });
      setSubmissions(subsRes || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchData();
    window.addEventListener('noor_db_update', fetchData);
    return () => window.removeEventListener('noor_db_update', fetchData);
  }, []);

  const openNewTaskModal = () => {
    setSelectedTask(null);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: any) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleReview = async (sub: any, action: 'approved' | 'rejected') => {
    try {
      await workController.reviewSubmission({ 
        body: { 
          userId: sub.userId, 
          submissionId: sub.id, 
          status: action, 
          reward: sub.reward
        } 
      }, { status: () => ({ json: () => {} }) });
      fetchData();
    } catch (err) { alert("Failed to save review."); }
  };

  const filteredTasks = useMemo(() => {
    if (categoryFilter === 'all') return tasks;
    return tasks.filter(t => t.category === categoryFilter);
  }, [tasks, categoryFilter]);

  const stats = useMemo(() => ({
    active: tasks.length,
    pending: submissions.filter(s => s.status === 'pending').length,
  }), [tasks, submissions]);

  return (
    <div className="space-y-6 md:space-y-8 pb-24 animate-fade-in max-w-7xl mx-auto px-1">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2 pt-4">
         <div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Task <span className="text-indigo-600">Center.</span></h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px] md:text-xs mt-2 italic">Global Task Registry Management</p>
         </div>
         <div className="flex gap-2 w-full md:w-auto">
            <StatPill label="OPERATIONAL" value={stats.active} icon={ShieldCheck} color="bg-emerald-50 text-emerald-600" />
            <StatPill label="REVIEW QUEUE" value={stats.pending} icon={Clock} color="bg-amber-50 text-amber-600" animate={stats.pending > 0} />
         </div>
      </header>

      <div className="flex bg-white p-1.5 rounded-[24px] border border-slate-100 shadow-sm mx-1">
         <button onClick={() => setActiveTab('manage')} className={clsx("flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all", activeTab === 'manage' ? "bg-slate-950 text-white shadow-xl" : "text-slate-400 hover:text-slate-900")}>Manager</button>
         <button onClick={() => setActiveTab('review')} className={clsx("flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all relative", activeTab === 'review' ? "bg-slate-950 text-white shadow-xl" : "text-slate-400 hover:text-slate-900")}>
           Reviews
           {stats.pending > 0 && <span className="absolute -top-1 -right-1 w-6 h-6 bg-rose-500 text-white text-[9px] rounded-full flex items-center justify-center ring-4 ring-white font-black">{stats.pending}</span>}
         </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'manage' ? (
          <motion.div key="manage" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-4">
                <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 w-full md:w-auto">
                   <div className="p-2.5 bg-slate-900 text-white rounded-xl"><Filter size={14}/></div>
                   <select 
                     value={categoryFilter} 
                     onChange={e => setCategoryFilter(e.target.value)}
                     className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none pr-8 cursor-pointer"
                   >
                      <option value="all">All Types</option>
                      <option value="verification">Verification</option>
                      <option value="data_entry">Data Entry</option>
                      <option value="social_media">Social Media</option>
                      <option value="content_creation">Content Creation</option>
                   </select>
                </div>
                <button onClick={openNewTaskModal} className="h-12 px-8 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center gap-2 w-full md:w-auto justify-center"><Plus size={18}/> New Task</button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-1">
                {filteredTasks.map(task => (
                  <div key={task.id} className="bg-white p-6 rounded-[36px] border border-slate-100 shadow-sm group hover:border-indigo-200 transition-all flex flex-col">
                     <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 bg-slate-950 text-sky-400 rounded-2xl flex items-center justify-center shadow-lg">
                          {task.mediaType === 'pdf' ? <FileText size={22}/> : <Zap size={22} fill="currentColor"/>}
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] font-black text-slate-900 uppercase leading-none mb-1">PKR {task.reward}</p>
                           <span className="text-[8px] font-bold text-indigo-400 uppercase tracking-widest border border-indigo-50 px-2 py-0.5 rounded-md bg-indigo-50/30">{CATEGORY_MAP[task.category] || 'Task'}</span>
                        </div>
                     </div>
                     <h4 className="text-sm font-black text-slate-800 uppercase italic mb-1 truncate">{task.title}</h4>
                     <p className="text-[9px] font-medium text-slate-400 line-clamp-2 leading-relaxed mb-6 flex-grow italic">"{task.instruction}"</p>
                     
                     <div className="flex gap-2 border-t border-slate-50 pt-4 mt-auto">
                        <button 
                          onClick={() => handleEditTask(task)} 
                          className="flex-1 h-11 bg-slate-50 text-slate-400 rounded-xl font-black text-[9px] uppercase flex items-center justify-center gap-2 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                        >
                          <Edit3 size={14}/> Edit
                        </button>
                        <button onClick={() => {if(window.confirm('Delete task?')) { const db = tasks.filter(t => t.id !== task.id); dbNode.saveTasks(db); fetchData(); }}} className="w-11 h-11 bg-rose-50 text-rose-400 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors">
                          <Trash2 size={16}/>
                        </button>
                     </div>
                  </div>
                ))}
             </div>
          </motion.div>
        ) : (
          <motion.div key="review" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4 mx-1">
             {submissions.filter(s => s.status === 'pending').map(sub => (
               <div key={sub.id} className="bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
                  <div className="flex items-center gap-4 overflow-hidden">
                     <div className="w-12 h-12 bg-slate-950 text-sky-400 rounded-xl flex items-center justify-center font-black italic shadow-lg shrink-0 text-lg border border-white/5">{sub.userName?.charAt(0)}</div>
                     <div className="overflow-hidden">
                        <h4 className="font-black text-slate-900 text-[11px] leading-tight truncate uppercase">{sub.userName}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest truncate italic">{sub.taskTitle}</p>
                        </div>
                     </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 md:border-l md:pl-6 border-slate-50">
                     <button onClick={() => setSelectedProof(sub.userAnswer)} className="w-16 h-12 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 hover:border-sky-400 transition-all group relative">
                        <img src={sub.userAnswer} className="w-full h-full object-cover opacity-50 group-hover:opacity-100" />
                        <div className="absolute inset-0 flex items-center justify-center text-slate-900 group-hover:text-sky-600"><Eye size={16}/></div>
                     </button>
                     <div className="text-right">
                        <p className="text-xs font-black text-emerald-600 leading-none italic">Rs {sub.reward}</p>
                     </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                     <button onClick={() => handleReview(sub, 'approved')} className="flex-grow md:flex-none px-8 h-12 bg-green-500 text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg shadow-green-100 active:scale-95">Approve</button>
                     <button onClick={() => handleReview(sub, 'rejected')} className="px-5 h-12 bg-rose-50 text-rose-500 rounded-xl border border-rose-100 active:scale-95" title="Reject"><X size={20}/></button>
                  </div>
               </div>
             ))}
          </motion.div>
        )}
      </AnimatePresence>

      <TaskFormModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} task={selectedTask} onUpdate={fetchData} />
      <ImageModal isOpen={!!selectedProof} onClose={() => setSelectedProof(null)} imageUrl={selectedProof || ''} />
    </div>
  );
};

const StatPill = ({ label, value, icon: Icon, color, animate }: any) => (
  <div className={clsx("flex-1 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 transition-all min-w-[120px]")}>
     <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-inner", color, animate && "animate-pulse")}>
        <Icon size={20} />
     </div>
     <div className="overflow-hidden">
        <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5 truncate">{label}</p>
        <p className="text-sm font-black text-slate-900 leading-none tracking-tighter">{value}</p>
     </div>
  </div>
);

export default WorkManager;
