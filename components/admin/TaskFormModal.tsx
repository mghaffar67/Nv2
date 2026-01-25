
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Save, Zap, Users, Search, Check, Clock, Calendar, 
  Briefcase, Info, RefreshCw, Terminal, Edit3, UserPlus,
  ShieldCheck, Target, UserCheck, Layers, FileText, ImageIcon
} from 'lucide-react';
import { clsx } from 'clsx';
import { adminController } from '../../backend_core/controllers/adminController';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: any | null;
  onUpdate: () => void;
}

const CATEGORIES = [
  { value: 'verification', label: 'Manual Review' },
  { value: 'data_entry', label: 'Data Entry' },
  { value: 'social_media', label: 'Social Task' },
  { value: 'content_creation', label: 'Creative Work' }
];

const TaskFormModal = ({ isOpen, onClose, task, onUpdate }: TaskFormModalProps) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    category: 'verification',
    mediaUrl: '',
    mediaType: 'image' as 'image' | 'pdf' | 'text',
    requiredLines: 5,
    reward: 25,
    plan: 'BASIC',
    instruction: '',
    assignmentType: 'all' as 'all' | 'specific',
    isActive: true
  });

  useEffect(() => {
    if (isOpen && task) {
      setForm({ ...task });
    } else if (isOpen) {
      setForm({
        title: '', category: 'verification', mediaUrl: '', mediaType: 'image',
        requiredLines: 5, reward: 25, plan: 'BASIC', instruction: '',
        assignmentType: 'all', isActive: true
      });
    }
  }, [task, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const db = JSON.parse(localStorage.getItem('noor_tasks_db') || '[]');
    const newTask = { 
      ...form, 
      id: task?.id || `TASK-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      createdAt: task?.createdAt || new Date().toISOString()
    };
    
    if (task) {
      const idx = db.findIndex((t: any) => t.id === task.id);
      if (idx !== -1) db[idx] = newTask;
    } else {
      db.unshift(newTask);
    }
    
    setTimeout(() => {
      localStorage.setItem('noor_tasks_db', JSON.stringify(db));
      onUpdate();
      onClose();
      setLoading(false);
    }, 600);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-2">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
          
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col h-[90vh] border border-white">
            <div className="bg-slate-950 p-6 text-white shrink-0 flex justify-between items-center relative overflow-hidden">
               <div className="flex items-center gap-4 relative z-10">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-600 text-white shadow-xl">
                    <Briefcase size={20}/>
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase italic tracking-tight">{task ? 'Edit Task' : 'New Task'}</h3>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Global Task Management</p>
                  </div>
               </div>
               <button onClick={onClose} className="p-2.5 bg-white/5 rounded-full hover:bg-white/10 transition-all text-white/40 hover:text-white relative z-10"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8 overflow-y-auto no-scrollbar flex-grow bg-[#fcfdfe]">
               <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Task Name</label>
                      <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full h-14 px-6 bg-white border border-slate-200 rounded-[24px] font-black text-slate-900 outline-none shadow-sm focus:ring-4 focus:ring-indigo-50" placeholder="e.g. Daily Social Review" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Category</label>
                        <select required value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full h-14 px-6 bg-white border border-slate-200 rounded-[24px] font-black text-slate-900 outline-none">
                          {CATEGORIES.map(cat => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Format</label>
                        <select required value={form.mediaType} onChange={e => setForm({...form, mediaType: e.target.value as any})} className="w-full h-14 px-6 bg-white border border-slate-200 rounded-[24px] font-black text-slate-900 outline-none">
                           <option value="image">Image Only</option>
                           <option value="pdf">PDF Guide</option>
                           <option value="text">Text Only</option>
                        </select>
                      </div>
                    </div>

                    {form.mediaType === 'text' && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Required Lines</label>
                        <input type="number" value={form.requiredLines} onChange={e => setForm({...form, requiredLines: Number(e.target.value)})} className="w-full h-14 px-6 bg-white border border-slate-200 rounded-[24px] font-black text-slate-900" />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Reward (PKR)</label>
                        <input type="number" required value={form.reward} onChange={e => setForm({...form, reward: Number(e.target.value)})} className="w-full h-14 px-6 bg-white border border-slate-200 rounded-[24px] font-black text-slate-900 shadow-sm" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Station Tier</label>
                        <select value={form.plan} onChange={e => setForm({...form, plan: e.target.value})} className="w-full h-14 px-5 bg-white border border-slate-200 rounded-[24px] font-black text-slate-900 appearance-none">
                           <option value="BASIC">BASIC</option>
                           <option value="STANDARD">STANDARD</option>
                           <option value="GOLD ELITE">GOLD ELITE</option>
                           <option value="DIAMOND">DIAMOND</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Instructions</label>
                      <textarea rows={4} value={form.instruction} onChange={e => setForm({...form, instruction: e.target.value})} className="w-full p-6 bg-white border border-slate-200 rounded-[32px] font-medium text-xs text-slate-600 outline-none shadow-sm resize-none" placeholder="What should the user do?" />
                    </div>
                  </div>
               </div>

               <div className="pt-6 flex gap-3">
                  <button type="submit" disabled={loading} className="flex-grow h-16 rounded-[28px] bg-slate-900 text-white font-black text-[11px] uppercase tracking-widest shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3">
                     {loading ? <RefreshCw className="animate-spin" size={20}/> : <><Save size={20}/> Save Changes</>}
                  </button>
                  <button type="button" onClick={onClose} className="px-10 h-16 bg-slate-100 text-slate-400 rounded-[28px] font-black text-[10px] uppercase tracking-widest hover:bg-slate-200">Cancel</button>
               </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TaskFormModal;
