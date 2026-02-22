import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Zap, CheckCircle2, Clock, Eye, Edit3, Trash2, X, Filter, RefreshCw, Briefcase, FileText, Sparkles, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { api } from '../../utils/api';
import TaskFormModal from '../../components/admin/TaskFormModal';
import { gemini } from '../../utils/gemini';

const CATEGORIES = [
  { id: 'all', label: 'All Categories' },
  { id: 'social_media', label: 'Social Media' },
  { id: 'data_entry', label: 'Data Entry' },
  { id: 'content_creation', label: 'Writing Work' },
  { id: 'verification', label: 'Reviewing' }
];

const WorkManager = () => {
  const [activeTab, setActiveTab] = useState<'manage' | 'review'>('manage');
  const [activeCategory, setActiveCategory] = useState('all');
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [aiGenerating, setAiGenerating] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const taskRes = await api.get('/admin/tasks');
      setTasks(Array.isArray(taskRes) ? taskRes : []);
      const subsRes = await api.get('/work/all-submissions'); 
      setSubmissions(Array.isArray(subsRes) ? subsRes : []);
    } catch (e) {
      console.error("Data fetch error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAiGenerate = async () => {
    setAiGenerating(true);
    try {
      const cat = activeCategory === 'all' ? 'online work' : activeCategory;
      const newTask = await gemini.generateTask(cat);
      setSelectedTask({
        ...newTask,
        category: activeCategory === 'all' ? 'verification' : activeCategory,
        plan: 'ANY'
      });
      setIsTaskModalOpen(true);
    } catch (err) {
      alert("AI task generation failed.");
    } finally {
      setAiGenerating(false);
    }
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
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic leading-none">Task <span className="text-indigo-600">Manager.</span></h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px] mt-2 italic">Create and Manage Daily Work Assignments</p>
         </div>
         <div className="flex gap-2">
            <button 
              onClick={handleAiGenerate}
              disabled={aiGenerating}
              className="h-12 px-6 bg-slate-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2 active:scale-95 transition-all disabled:opacity-50"
            >
              {aiGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} className="text-sky-400" />} 
              Create with AI
            </button>
            <button onClick={() => { setSelectedTask(null); setIsTaskModalOpen(true); }} className="h-12 px-8 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2 active:scale-95 transition-all"><Plus size={18}/> New Assignment</button>
         </div>
      </header>

      <div className="flex bg-white p-1.5 rounded-[28px] border border-slate-100 shadow-sm mx-1">
         <button onClick={() => setActiveTab('manage')} className={clsx("flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all", activeTab === 'manage' ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:text-slate-900")}>Active Assignments</button>
         <button onClick={() => setActiveTab('review')} className={clsx("flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all relative", activeTab === 'review' ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:text-slate-900")}>Pending Reviews</button>
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
                      <div className="w-12 h-12 bg-slate-950 text-sky-400 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Zap size={22} fill="currentColor"/>
                      </div>
                      <div className="text-right">
                         <p className="text-[11px] font-black text-slate-900 leading-none mb-1.5">Rs {task.reward}</p>
                         <span className="text-[8px] font-black bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md border border-indigo-100 uppercase">{task.plan}</span>
                      </div>
                   </div>
                   <h4 className="text-sm font-black text-slate-800 uppercase italic mb-1 truncate">{task.title}</h4>
                   <p className="text-[10px] font-medium text-slate-400 line-clamp-2 leading-relaxed mb-6 italic flex-grow">"{task.instruction}"</p>
                   <div className="flex gap-2 border-t border-slate-50 pt-4 mt-auto">
                      <button onClick={() => { setSelectedTask(task); setIsTaskModalOpen(true); }} className="flex-1 h-11 bg-slate-50 text-slate-400 rounded-xl font-black text-[9px] uppercase flex items-center justify-center gap-2 hover:bg-slate-900 hover:text-white transition-all"><Edit3 size={14}/> Edit</button>
                      <button onClick={() => {if(window.confirm('Delete task?')) { fetchData(); }}} className="w-11 h-11 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center active:scale-90 transition-all"><Trash2 size={16}/></button>
                   </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="py-40 text-center flex flex-col items-center opacity-30">
            <CheckCircle2 size={64} className="text-slate-200 mb-6" />
            <p className="text-[11px] font-black uppercase tracking-[0.4em]">Review Registry Is Current.</p>
          </div>
        )}
      </AnimatePresence>

      <TaskFormModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} task={selectedTask} onUpdate={fetchData} />
    </div>
  );
};

export default WorkManager;