
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Added missing Terminal and Edit3 imports
import { X, Save, Zap, Users, Search, Check, Clock, Calendar, Globe, UserCheck, Briefcase, Info, RefreshCw, Terminal, Edit3 } from 'lucide-react';
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
    timeLimitSeconds: 15,
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
          targetUsers: [], validityDays: 30, timeLimitSeconds: 15, status: 'active'
        });
      }
    }
  }, [task, isOpen]);

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
    
    // Simulate system audit delay
    setTimeout(() => {
      localStorage.setItem('noor_tasks_db', JSON.stringify(db));
      onUpdate();
      onClose();
      setLoading(false);
    }, 800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-2">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
          
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="relative w-full max-w-xl bg-white rounded-[40px] md:rounded-[56px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-white">
            {/* BRANDED HEADER */}
            <div className="bg-slate-950 p-6 md:p-8 text-white shrink-0 flex justify-between items-center relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-[0.02] rotate-12 scale-150"><Terminal size={100}/></div>
               <div className="flex items-center gap-4 relative z-10">
                  <div className={clsx(
                    "w-12 h-12 rounded-[22px] flex items-center justify-center text-white shadow-xl",
                    task ? "bg-amber-500" : "bg-indigo-600"
                  )}>
                    {task ? <Edit3 size={24}/> : <Briefcase size={24}/>}
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-black uppercase italic tracking-tight">
                      {task ? 'Modify Node' : 'Register Node'}
                    </h3>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-0.5">
                      {task ? `UPDATING LOG ID: ${task.id}` : 'INITIALIZING NEW ASSIGNMENT'}
                    </p>
                  </div>
               </div>
               <button onClick={onClose} className="p-2.5 bg-white/5 rounded-full hover:bg-white/10 transition-all text-white/40 hover:text-white relative z-10"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8 overflow-y-auto no-scrollbar flex-grow bg-[#fcfdfe]">
               <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Assignment Label</label>
                    <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full h-14 px-6 bg-white border border-slate-200 rounded-[24px] font-black text-slate-900 outline-none shadow-sm focus:ring-4 focus:ring-indigo-50 transition-all" placeholder="e.g. Premium Channel Subscription" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Reward Yield (PKR)</label>
                      <div className="relative">
                         <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-slate-300">Rs</span>
                         <input type="number" required value={form.reward} onChange={e => setForm({...form, reward: Number(e.target.value)})} className="w-full h-14 pl-12 pr-6 bg-white border border-slate-200 rounded-[24px] font-black text-slate-900 shadow-sm outline-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Authorized Station</label>
                      <select value={form.plan} onChange={e => setForm({...form, plan: e.target.value})} className="w-full h-14 px-5 bg-white border border-slate-200 rounded-[24px] font-black text-slate-900 shadow-sm outline-none appearance-none">
                         <option value="BASIC">BASIC</option>
                         <option value="STANDARD">STANDARD</option>
                         <option value="GOLD ELITE">GOLD ELITE</option>
                         <option value="DIAMOND">DIAMOND</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 p-6 bg-slate-50 rounded-[36px] border border-slate-100">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2"><Calendar size={12}/> Persistence (Days)</label>
                      <input type="number" value={form.validityDays} onChange={e => setForm({...form, validityDays: Number(e.target.value)})} className="w-full h-12 px-5 bg-white border border-slate-200 rounded-2xl font-black text-xs" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2"><Clock size={12}/> Scan Time (Sec)</label>
                      <input type="number" value={form.timeLimitSeconds} onChange={e => setForm({...form, timeLimitSeconds: Number(e.target.value)})} className="w-full h-12 px-5 bg-white border border-slate-200 rounded-2xl font-black text-xs" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Operational Protocol (Instructions)</label>
                    <textarea rows={4} value={form.instruction} onChange={e => setForm({...form, instruction: e.target.value})} className="w-full p-6 bg-white border border-slate-200 rounded-[32px] font-medium text-xs text-slate-600 outline-none shadow-sm resize-none focus:ring-4 focus:ring-indigo-50 leading-relaxed" placeholder="1. Open URL\n2. Perform Verification\n3. Capture Ledger Evidence..." />
                  </div>
               </div>

               <div className="pt-6 flex gap-3">
                  <button type="submit" disabled={loading} className={clsx(
                    "flex-grow h-16 rounded-[28px] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3",
                    task ? "bg-slate-900 text-white" : "bg-indigo-600 text-white"
                  )}>
                     {loading ? <RefreshCw className="animate-spin" size={20}/> : <><Save size={20}/> {task ? 'COMMIT LOGS' : 'PUBLISH NODE'}</>}
                  </button>
                  <button type="button" onClick={onClose} className="px-10 h-16 bg-slate-100 text-slate-400 rounded-[28px] font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-colors">Cancel</button>
               </div>
               
               <div className="flex items-start gap-4 p-5 bg-indigo-50/50 rounded-3xl border border-indigo-100/50">
                  <Info size={18} className="text-indigo-500 shrink-0 mt-0.5" />
                  <p className="text-[9px] font-bold text-indigo-700 uppercase tracking-widest leading-relaxed italic">
                    Note: Updating an existing node will force a registry refresh for all active partners currently scanning this task.
                  </p>
               </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TaskFormModal;
