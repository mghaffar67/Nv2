
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Zap, CheckCircle2, Clock, Eye, Edit3, Trash2, X, Filter, RefreshCw, Briefcase, FileText } from 'lucide-react';
import { clsx } from 'clsx';
import { api } from '../../utils/api';
import TaskFormModal from '../../components/admin/TaskFormModal';
import { ImageModal } from '../../components/ui/ImageModal';

const CATEGORIES = [
  { id: 'all', label: 'All Work' },
  { id: 'social_media', label: 'Social Media' },
  { id: 'data_entry', label: 'Data Entry' },
  { id: 'content_creation', label: 'Article/Text' },
  { id: 'verification', label: 'Review Work' }
];

const WorkManager = () => {
  const [activeTab, setActiveTab] = useState<'manage' | 'review'>('manage');
  const [activeCategory, setActiveCategory] = useState('all');
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [selectedProof, setSelectedProof] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const taskRes = await api.get('/admin/tasks');
      setTasks(Array.isArray(taskRes) ? taskRes : []);
      // In a production environment, this would come from a dedicated review endpoint
      const users = await api.get('/admin/users');
      let allSubs: any[] = [];
      users.forEach((u: any) => {
        if (u.workSubmissions) {
          allSubs = [...allSubs, ...u.workSubmissions.map((s: any) => ({ ...s, userName: u.name, userId: u.id }))];
        }
      });
      setSubmissions(allSubs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    } catch (e) {
        console.error("Registry Sync failure.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleReview = async (sub: any, action: 'approved' | 'rejected') => {
    try {
      await api.post('/admin/finance/requests/manage', { 
        transactionId: sub.id, 
        userId: sub.userId, 
        action,
        type: 'work_submission'
      });
      fetchData();
    } catch (err) { alert("Review sync failed."); }
  };

  const handleDeleteTask = async (id: string) => {
    if (!window.confirm("Terminate this task node?")) return;
    try {
        await api.delete(`/admin/tasks/${id}`);
        fetchData();
    } catch (e) { alert("Deletion failed."); }
  };

  const filteredTasks = useMemo(() => {
    if (!Array.isArray(tasks)) return [];
    if (activeCategory === 'all') return tasks;
    return tasks.filter(t => t.category === activeCategory);
  }, [tasks, activeCategory]);

  return (
    <div className="space-y-6 md:space-y-8 pb-24 animate-fade-in max-w-7xl mx-auto px-1.5">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2 pt-4">
         <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic leading-none">Task <span className="text-indigo-600">Inventory.</span></h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px] mt-2 italic">Global Work Registry Management</p>
         </div>
         <button onClick={() => { setSelectedTask(null); setIsTaskModalOpen(true); }} className="h-12 px-8 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2 active:scale-95 transition-all"><Plus size={18}/> New Task</button>
      </header>

      <div className="flex bg-white p-1.5 rounded-[28px] border border-slate-100 shadow-sm mx-1">
         <button onClick={() => setActiveTab('manage')} className={clsx("flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all", activeTab === 'manage' ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:text-slate-900")}>Manager</button>
         <button onClick={() => setActiveTab('review')} className={clsx("flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all relative", activeTab === 'review' ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:text-slate-900")}>Reviews Queue</button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'manage' ? (
          <motion.div key="manage" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex gap-2 overflow-x-auto no-scrollbar px-1">
               {CATEGORIES.map(cat => (
                 <button 
                  key={cat.id} onClick={() => setActiveCategory(cat.id)}
                  className={clsx(
                    "px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                    activeCategory === cat.id ? "bg-indigo-600 text-white" : "bg-white text-slate-400 border border-slate-100"
                  )}
                 >
                   {cat.label}
                 </button>
               ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-1">
              {filteredTasks.map(task => (
                <div key={task.id} className="bg-white p-6 rounded-[40px] border border-slate-100 shadow-sm flex flex-col group hover:border-indigo-200 transition-all">
                   <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-slate-900 text-sky-400 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Zap size={22} fill="currentColor"/>
                      </div>
                      <div className="text-right">
                         <p className="text-[11px] font-black text-slate-900 leading-none mb-1.5">Rs {task.reward}</p>
                         <span className="text-[8px] font-black bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md border border-indigo-100 uppercase">{task.category?.replace('_', ' ') || 'Work'}</span>
                      </div>
                   </div>
                   <h4 className="text-sm font-black text-slate-800 uppercase italic mb-1 truncate">{task.title}</h4>
                   <p className="text-[10px] font-medium text-slate-400 line-clamp-2 leading-relaxed mb-6 italic flex-grow">"{task.instruction}"</p>
                   <div className="flex gap-2 border-t border-slate-50 pt-4 mt-auto">
                      <button onClick={() => { setSelectedTask(task); setIsTaskModalOpen(true); }} className="flex-1 h-11 bg-slate-50 text-slate-400 rounded-xl font-black text-[9px] uppercase flex items-center justify-center gap-2 hover:bg-slate-900 hover:text-white transition-all"><Edit3 size={14}/> Edit</button>
                      <button onClick={() => handleDeleteTask(task.id)} className="w-11 h-11 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center active:scale-90 transition-all"><Trash2 size={16}/></button>
                   </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="review" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 mx-1">
             {(Array.isArray(submissions) ? submissions : []).filter(s => s.status === 'pending').map(sub => (
               <div key={sub.id} className="bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
                  <div className="flex items-center gap-4 overflow-hidden">
                     <div className="w-12 h-12 bg-slate-900 text-sky-400 rounded-xl flex items-center justify-center font-black italic shadow-lg shrink-0 text-lg">{sub.userName?.charAt(0)}</div>
                     <div className="overflow-hidden">
                        <h4 className="font-black text-slate-900 text-[11px] uppercase truncate">{sub.userName}</h4>
                        <p className="text-[8px] font-bold text-slate-400 uppercase italic truncate mt-1">{sub.taskTitle}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0 md:border-l md:pl-6 border-slate-50">
                     <button onClick={() => setSelectedProof(sub.userAnswer)} className="w-16 h-12 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 hover:border-sky-400 transition-all group relative shadow-inner">
                        <img src={sub.userAnswer} className="w-full h-full object-cover opacity-50 group-hover:opacity-100" />
                        <div className="absolute inset-0 flex items-center justify-center text-slate-900 group-hover:text-sky-600"><Eye size={16}/></div>
                     </button>
                     <p className="text-xs font-black text-emerald-600 italic">Rs {sub.reward}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                     <button onClick={() => handleReview(sub, 'approved')} className="px-8 h-12 bg-green-500 text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">Approve</button>
                     <button onClick={() => handleReview(sub, 'rejected')} className="px-5 h-12 bg-rose-50 text-rose-500 rounded-xl border border-rose-100 active:scale-95 transition-all"><X size={20}/></button>
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

export default WorkManager;
