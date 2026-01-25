
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Zap, Briefcase, RefreshCw, FileText, Layers } from 'lucide-react';
import { dbNode } from '../../backend_core/utils/db';

const CATEGORIES = [
  { value: 'social_media', label: 'Social Media' },
  { value: 'data_entry', label: 'Data Entry' },
  { value: 'content_creation', label: 'Article/Writing' },
  { value: 'verification', label: 'Manual Review' },
  { value: 'network', label: 'Network Task' }
];

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: any | null;
  onUpdate: () => void;
}

const TaskFormModal = ({ isOpen, onClose, task, onUpdate }: TaskFormModalProps) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', category: 'verification', 
    mediaType: 'image' as 'image' | 'text' | 'pdf',
    requiredLines: 0, reward: 25, plan: 'BASIC', instruction: ''
  });

  useEffect(() => {
    if (isOpen && task) setForm({ ...task });
    else if (isOpen) setForm({ title: '', category: 'verification', mediaType: 'image', requiredLines: 0, reward: 25, plan: 'BASIC', instruction: '' });
  }, [task, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const db = dbNode.getTasks();
    const newTask = { 
      ...form, 
      id: task?.id || `TASK-${Math.random().toString(36).substr(2, 4).toUpperCase()}`, 
      createdAt: new Date().toISOString() 
    };
    if (task) {
      const idx = db.findIndex((t: any) => t.id === task.id);
      if (idx !== -1) db[idx] = newTask;
    } else {
      db.unshift(newTask);
    }
    dbNode.saveTasks(db);
    setTimeout(() => { onUpdate(); onClose(); setLoading(false); }, 600);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-2">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" />
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative w-full max-w-2xl bg-white rounded-[44px] shadow-2xl overflow-hidden flex flex-col border border-white max-h-[90vh]">
            <div className="bg-slate-900 p-6 text-white shrink-0 flex justify-between items-center">
               <div className="flex items-center gap-4 relative z-10">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-600 text-white shadow-xl"><Briefcase size={20}/></div>
                  <h3 className="text-xl font-black uppercase italic tracking-tight">{task ? 'Edit Registry' : 'New Task Entry'}</h3>
               </div>
               <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-white/40 transition-all"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-6 overflow-y-auto no-scrollbar bg-[#fcfdfe]">
               <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Task Name</label>
                    <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full h-14 px-6 bg-white border border-slate-200 rounded-[24px] font-black text-slate-900 outline-none shadow-sm" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Work Category</label>
                      <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full h-14 px-6 bg-white border border-slate-200 rounded-[24px] font-black text-slate-900 outline-none">
                         {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Format</label>
                      <select value={form.mediaType} onChange={e => setForm({...form, mediaType: e.target.value as any})} className="w-full h-14 px-6 bg-white border border-slate-200 rounded-[24px] font-black text-slate-900 outline-none">
                         <option value="image">Screenshot Proof</option>
                         <option value="text">Text Submission</option>
                         <option value="pdf">Document Upload</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Reward (PKR)</label>
                      <input type="number" required value={form.reward} onChange={e => setForm({...form, reward: Number(e.target.value)})} className="w-full h-14 px-6 bg-white border border-slate-200 rounded-[24px] font-black text-slate-900" />
                    </div>
                    {form.mediaType === 'text' && (
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Required Lines</label>
                        <input type="number" value={form.requiredLines} onChange={e => setForm({...form, requiredLines: Number(e.target.value)})} className="w-full h-14 px-6 bg-white border border-slate-200 rounded-[24px] font-black text-slate-900" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Description</label>
                    <textarea rows={4} value={form.instruction} onChange={e => setForm({...form, instruction: e.target.value})} className="w-full p-6 bg-white border border-slate-200 rounded-[32px] font-medium text-xs text-slate-600 outline-none shadow-sm resize-none" placeholder="Task details here..." />
                  </div>
               </div>
               <div className="pt-4">
                  <button type="submit" disabled={loading} className="w-full h-16 rounded-[28px] bg-slate-900 text-white font-black text-[11px] uppercase tracking-widest shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3">
                     {loading ? <RefreshCw className="animate-spin" size={20}/> : <><Save size={20}/> Apply Task</>}
                  </button>
               </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TaskFormModal;
