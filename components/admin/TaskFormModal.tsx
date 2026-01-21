
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Zap, Users, Search, Check, Clock, Calendar, Globe, UserCheck } from 'lucide-react';
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
  const [userSearch, setUserSearch] = useState('');
  const [form, setForm] = useState({
    title: '',
    mediaUrl: '',
    mediaType: 'link',
    reward: 25,
    plan: 'BASIC',
    instruction: '',
    assignmentType: 'all' as 'all' | 'specific',
    targetUsers: [] as string[],
    validityDays: 30,
    timeLimitSeconds: 600,
    status: 'active'
  });

  useEffect(() => {
    const fetchPartners = async () => {
      const res = await new Promise<any>((resolve) => {
        adminController.getPartnerList({}, { status: () => ({ json: resolve }) });
      });
      setPartners(res || []);
    };
    
    if (isOpen) {
      fetchPartners();
      if (task) {
        setForm({ ...task, targetUsers: task.targetUsers || [] });
      } else {
        setForm({
          title: '', mediaUrl: '', mediaType: 'link', reward: 25,
          plan: 'BASIC', instruction: '', assignmentType: 'all', 
          targetUsers: [], validityDays: 30, timeLimitSeconds: 600, status: 'active'
        });
      }
    }
  }, [task, isOpen]);

  const toggleUserSelection = (id: string) => {
    setForm(prev => ({
      ...prev,
      targetUsers: prev.targetUsers.includes(id) 
        ? prev.targetUsers.filter(uid => uid !== id)
        : [...prev.targetUsers, id]
    }));
  };

  const filteredPartners = partners.filter(p => 
    p.name.toLowerCase().includes(userSearch.toLowerCase()) || 
    p.phone.includes(userSearch)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const db = JSON.parse(localStorage.getItem('noor_tasks_db') || '[]');
    const newTask = { 
      ...form, 
      id: task?.id || `NODE-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      createdAt: task?.createdAt || new Date().toISOString()
    };
    
    if (task) {
      const idx = db.findIndex((t: any) => t.id === task.id);
      if (idx !== -1) db[idx] = newTask;
    } else {
      db.unshift(newTask);
    }
    
    localStorage.setItem('noor_tasks_db', JSON.stringify(db));
    
    setTimeout(() => {
      onUpdate();
      onClose();
      setLoading(false);
    }, 600);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-2">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
          
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] border border-white">
            <div className="bg-slate-950 p-6 text-white shrink-0 flex justify-between items-center">
               <div>
                  <h3 className="text-xl font-black uppercase italic tracking-tight">{task ? 'Modify Node' : 'Initialize Yield Node'}</h3>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Assignment Specification Node</p>
               </div>
               <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-all"><X size={18} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6 overflow-y-auto no-scrollbar flex-grow bg-[#fcfdfe]">
               <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Task Specification Title</label>
                    <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full h-12 px-5 bg-white border border-slate-200 rounded-2xl font-black text-slate-900 outline-none shadow-sm focus:ring-4 focus:ring-indigo-50" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Reward Yield (PKR)</label>
                      <input type="number" required value={form.reward} onChange={e => setForm({...form, reward: Number(e.target.value)})} className="w-full h-12 px-5 bg-white border border-slate-200 rounded-2xl font-black text-slate-900 shadow-sm outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Authorization Tier</label>
                      <select value={form.plan} onChange={e => setForm({...form, plan: e.target.value})} className="w-full h-12 px-5 bg-white border border-slate-200 rounded-2xl font-black text-slate-900 shadow-sm outline-none">
                         <option value="BASIC">BASIC</option>
                         <option value="STANDARD">STANDARD</option>
                         <option value="GOLD ELITE">GOLD ELITE</option>
                         <option value="DIAMOND">DIAMOND</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 p-5 bg-slate-50 rounded-[28px] border border-slate-100">
                    <div className="space-y-1.5">
                      <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1"><Calendar size={10}/> Validity (Days)</label>
                      <input type="number" value={form.validityDays} onChange={e => setForm({...form, validityDays: Number(e.target.value)})} className="w-full h-10 px-4 bg-white border border-slate-200 rounded-xl font-bold text-xs" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1"><Clock size={10}/> Timer (Sec)</label>
                      <input type="number" value={form.timeLimitSeconds} onChange={e => setForm({...form, timeLimitSeconds: Number(e.target.value)})} className="w-full h-10 px-4 bg-white border border-slate-200 rounded-xl font-bold text-xs" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Distribution Logic</label>
                    <div className="flex bg-slate-100 p-1 rounded-2xl">
                      <button type="button" onClick={() => setForm({...form, assignmentType: 'all'})} className={clsx("flex-1 py-3 rounded-xl text-[9px] font-black uppercase transition-all", form.assignmentType === 'all' ? "bg-white text-slate-950 shadow-md" : "text-slate-400")}>Global Fleet</button>
                      <button type="button" onClick={() => setForm({...form, assignmentType: 'specific'})} className={clsx("flex-1 py-3 rounded-xl text-[9px] font-black uppercase transition-all", form.assignmentType === 'specific' ? "bg-white text-slate-950 shadow-md" : "text-slate-400")}>Target Nodes</button>
                    </div>
                    
                    {form.assignmentType === 'specific' && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="space-y-3 pt-2">
                        <div className="relative">
                          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                          <input placeholder="Search Partner ID/Phone..." value={userSearch} onChange={e => setUserSearch(e.target.value)} className="w-full h-11 pl-11 pr-4 bg-white border border-slate-200 rounded-xl text-xs font-bold" />
                        </div>
                        <div className="max-h-[160px] overflow-y-auto no-scrollbar border border-slate-100 rounded-2xl p-1 bg-white">
                          {filteredPartners.map(p => (
                            <div key={p.id} onClick={() => toggleUserSelection(p.id)} className="p-3 flex items-center justify-between hover:bg-slate-50 cursor-pointer rounded-xl transition-all mb-1">
                               <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 font-black text-[10px] italic">{p.name.charAt(0)}</div>
                                  <div>
                                    <p className="text-[10px] font-black text-slate-800 leading-none">{p.name}</p>
                                    <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase">{p.phone}</p>
                                  </div>
                               </div>
                               <div className={clsx("w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all", form.targetUsers.includes(p.id) ? "bg-emerald-500 border-emerald-500" : "border-slate-200")}>
                                  {form.targetUsers.includes(p.id) && <Check size={12} className="text-white" strokeWidth={4}/>}
                               </div>
                            </div>
                          ))}
                        </div>
                        <p className="text-[8px] font-black text-indigo-500 uppercase tracking-widest ml-2 italic">Targets Synchronized: {form.targetUsers.length}</p>
                      </motion.div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Earning Guidelines</label>
                    <textarea rows={3} value={form.instruction} onChange={e => setForm({...form, instruction: e.target.value})} className="w-full p-4 bg-white border border-slate-200 rounded-2xl font-medium text-xs text-slate-600 outline-none shadow-sm resize-none focus:ring-4 focus:ring-indigo-50" placeholder="Step-by-step instructions for the partner..." />
                  </div>
               </div>

               <div className="pt-4 flex gap-3">
                  <button type="submit" disabled={loading} className="flex-grow h-14 bg-slate-950 text-white rounded-[20px] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all">
                     {loading ? 'SYNCHRONIZING...' : 'PUBLISH NODE'}
                  </button>
                  <button type="button" onClick={onClose} className="px-6 bg-slate-50 text-slate-400 rounded-[20px] font-black text-[9px] uppercase tracking-widest">Abort</button>
               </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TaskFormModal;
