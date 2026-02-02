
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, Plus, Trash2, Edit3, RefreshCw, Briefcase, 
  Image as ImageIcon, Upload, FileDown
} from 'lucide-react';
import { dbNode } from '../../../backend_core/utils/db';
import TaskFormModal from '../../../components/admin/TaskFormModal';

const DailyTaskConfig = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = dbNode.getTasks();
      setTasks(data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleDelete = (id: string) => {
    if (!window.confirm("Remove this assignment node from platform inventory?")) return;
    const updated = tasks.filter(t => t.id !== id);
    dbNode.saveTasks(updated);
    fetchTasks();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
           <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Inventory <span className="text-[#4A6CF7]">Node.</span></h2>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2 italic">
             <Zap size={14} className="text-[#4A6CF7]" /> Manage Global Daily Assignment Protocols
           </p>
        </div>
        <button 
          onClick={() => { setSelectedTask(null); setIsModalOpen(true); }}
          className="h-14 px-10 bg-slate-950 text-white rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl flex items-center gap-3 active:scale-95 transition-all"
        >
          <Plus size={20} className="text-sky-400" /> New Daily Task
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-24 text-center"><RefreshCw className="animate-spin mx-auto text-slate-200" size={48}/></div>
        ) : tasks.length > 0 ? tasks.map(task => (
          <motion.div layout key={task.id} className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-sm flex flex-col relative group hover:border-indigo-100 transition-all overflow-hidden h-[360px]">
             <div className="flex justify-between items-start mb-10">
                <div className="w-16 h-16 rounded-[24px] bg-slate-50 text-[#4A6CF7] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                   <Zap size={32} fill="currentColor" />
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Yield Node</p>
                   <p className="text-2xl font-black text-emerald-600 italic leading-none">Rs {task.reward}</p>
                </div>
             </div>

             <div className="space-y-3 mb-10">
                <h4 className="text-xl font-black text-slate-900 uppercase italic truncate">{task.title}</h4>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-indigo-100">
                   {task.plan} STATION REQUIRED
                </div>
             </div>

             <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 mb-auto shadow-inner">
                <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase italic line-clamp-2">"{task.instruction}"</p>
             </div>

             <div className="flex gap-2 pt-6 border-t border-slate-50">
                <button onClick={() => { setSelectedTask(task); setIsModalOpen(true); }} className="flex-1 h-12 bg-slate-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all shadow-md active:scale-95"><Edit3 size={18}/> Edit</button>
                <button onClick={() => handleDelete(task.id)} className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-90"><Trash2 size={20}/></button>
             </div>
          </motion.div>
        )) : (
          <div className="col-span-full py-40 text-center bg-white rounded-[64px] border-4 border-dashed border-slate-50 opacity-20">
             <Briefcase size={80} className="text-slate-100 mx-auto mb-8" />
             <p className="text-xs font-black uppercase tracking-[0.4em] italic">No active assignments found</p>
          </div>
        )}
      </div>

      <TaskFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        task={selectedTask} 
        onUpdate={fetchTasks} 
      />
    </div>
  );
};

export default DailyTaskConfig;
