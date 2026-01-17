
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Zap, FileText, Image as ImageIcon, Film, Users, Upload, Search, Check, Info } from 'lucide-react';
import { clsx } from 'clsx';
import { adminController } from '../../backend_core/controllers/adminController';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: any | null;
  onUpdate: () => void;
}

const TaskFormModal = ({ isOpen, onClose, task, onUpdate }: TaskFormModalProps) => {
  const [loading, setLoading] = useState(false);
  const [partners, setPartners] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [form, setForm] = useState({
    title: '',
    mediaUrl: '',
    mediaType: 'image',
    reward: 25,
    plan: 'BASIC',
    instruction: '',
    targetUsers: [] as string[],
    status: 'active'
  });

  useEffect(() => {
    const fetchPartners = async () => {
      const res = await new Promise<any>((resolve) => {
        adminController.getPartnerList({}, { status: () => ({ json: resolve }) });
      });
      setPartners(res || []);
    };
    if (isOpen) fetchPartners();
    
    if (task) {
      setForm({ ...task, targetUsers: task.targetUsers || [] });
    } else {
      setForm({
        title: '', mediaUrl: '', mediaType: 'image', reward: 25,
        plan: 'BASIC', instruction: '', targetUsers: [], status: 'active'
      });
    }
  }, [task, isOpen]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, mediaUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleUser = (userId: string) => {
    setForm(prev => ({
      ...prev,
      targetUsers: prev.targetUsers.includes(userId) 
        ? prev.targetUsers.filter(id => id !== userId)
        : [...prev.targetUsers, userId]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.mediaUrl) return alert("Task media proof is required");
    setLoading(true);
    
    const db = JSON.parse(localStorage.getItem('noor_tasks_db') || '[]');
    const newTask = { ...form, id: task?.id || `NODE-${Math.random().toString(36).substr(2, 4).toUpperCase()}` };
    
    if (task) {
      const idx = db.findIndex((t: any) => t.id === task.id);
      db[idx] = newTask;
    } else {
      db.unshift(newTask);
    }
    
    localStorage.setItem('noor_tasks_db', JSON.stringify(db));
    
    setTimeout(() => {
      onUpdate();
      onClose();
      setLoading(false);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-3">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
          
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="relative w-full max-w-xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
            
            <div className="bg-slate-900 p-6 text-white shrink-0">
               <div className="flex justify-between items-center mb-1">
                  <h3 className="text-xl font-black uppercase tracking-tight italic">{task ? 'Modify Node' : 'Initialize Node'}</h3>
                  <button onClick={onClose} className="p-2 bg-white/5 rounded-full"><X size={18} /></button>
               </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6 overflow-y-auto no-scrollbar flex-grow bg-[#fcfdfe]">
               <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Identity Title</label>
                    <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full h-12 px-5 bg-white border border-slate-100 rounded-2xl font-black text-slate-900 outline-none shadow-sm" placeholder="Assignment Name" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Reward Yield</label>
                      <input type="number" required value={form.reward} onChange={e => setForm({...form, reward: Number(e.target.value)})} className="w-full h-12 px-5 bg-white border border-slate-100 rounded-2xl font-black text-slate-900 outline-none shadow-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Earning Tier</label>
                      <select value={form.plan} onChange={e => setForm({...form, plan: e.target.value})} className="w-full h-12 px-5 bg-white border border-slate-100 rounded-2xl font-black text-slate-900 outline-none shadow-sm">
                         <option value="BASIC">BASIC</option>
                         <option value="STANDARD">STANDARD</option>
                         <option value="GOLD ELITE">GOLD ELITE</option>
                         <option value="DIAMOND">DIAMOND</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3 flex items-center gap-2"><ImageIcon size={12}/> Secure Media Packet</label>
                    <div className="relative group">
                       <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                       <div className={clsx("w-full py-10 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-2 transition-all", form.mediaUrl ? "bg-green-50 border-green-200" : "bg-white border-slate-100 shadow-sm")}>
                          {form.mediaUrl ? (
                            <div className="w-16 h-16 rounded-xl overflow-hidden shadow-lg mb-2"><img src={form.mediaUrl} className="w-full h-full object-cover" /></div>
                          ) : (
                            <Upload size={24} className="text-slate-300" />
                          )}
                          <span className="text-[9px] font-black text-slate-400 uppercase">{form.mediaUrl ? "Packet Locked" : "Click to Upload Proof"}</span>
                       </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">System Instructions</label>
                    <textarea rows={4} value={form.instruction} onChange={e => setForm({...form, instruction: e.target.value})} className="w-full p-4 bg-white border border-slate-100 rounded-2xl font-medium text-xs text-slate-600 outline-none shadow-sm resize-none" placeholder="1. Step one..." />
                  </div>
               </div>

               <div className="pt-4 flex gap-3">
                  <button type="submit" disabled={loading} className="flex-grow h-14 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all">
                     {loading ? 'DEPLOYING...' : 'COMMIT CHANGES'}
                  </button>
                  <button type="button" onClick={onClose} className="px-6 bg-slate-50 text-slate-400 rounded-2xl font-black text-[9px] uppercase tracking-widest">Abort</button>
               </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TaskFormModal;
