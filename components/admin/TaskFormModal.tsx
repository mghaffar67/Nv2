import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Save, Zap, Briefcase, RefreshCw, 
  FileText, Layers, Users, ShieldCheck, 
  Search, Check, Image as ImageIcon, File,
  Upload, Camera, FileDown
} from 'lucide-react';
import { api } from '../../utils/api';
import { clsx } from 'clsx';

const CATEGORIES = [
  { value: 'social_media', label: 'Social Media' },
  { value: 'data_entry', label: 'Data Entry' },
  { value: 'content_creation', label: 'Article/Writing' },
  { value: 'verification', label: 'Manual Review' },
  { value: 'network', label: 'Network Task' }
];

const PLAN_TIERS = ['ANY', 'BASIC', 'STANDARD', 'GOLD ELITE', 'DIAMOND'];

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: any | null;
  onUpdate: () => void;
}

const TaskFormModal = ({ isOpen, onClose, task, onUpdate }: TaskFormModalProps) => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState('');
  
  const [form, setForm] = useState({
    title: '', 
    category: 'verification', 
    mediaType: 'image' as 'image' | 'text' | 'pdf' | 'link',
    mediaUrl: '',
    requiredLines: 0, 
    reward: 25, 
    plan: 'ANY', 
    instruction: '',
    assignmentType: 'all' as 'all' | 'specific',
    targetUsers: [] as string[]
  });

  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    const initModal = async () => {
      if (isOpen) {
        try {
          const registry = await api.get('/admin/users');
          setUsers(registry || []);
        } catch (e) {}
        
        if (task) {
          setForm({ ...task });
          setPreview(task.mediaType === 'image' ? task.mediaUrl : task.mediaType === 'pdf' ? 'pdf_detected' : null);
        } else {
          setForm({ 
            title: '', category: 'verification', mediaType: 'image', mediaUrl: '',
            requiredLines: 0, reward: 25, plan: 'ANY', instruction: '',
            assignmentType: 'all', targetUsers: []
          });
          setPreview(null);
        }
      }
    };
    initModal();
  }, [task, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'pdf') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File too large. Max 10MB allowed.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (type === 'image') setPreview(base64);
        else setPreview('pdf_detected');
        setForm(prev => ({ ...prev, mediaUrl: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/admin/tasks', { ...form, id: task?.id });
      onUpdate(); 
      onClose();
    } catch (e) {
      alert("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-2">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" />
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative w-full max-w-2xl bg-white rounded-[44px] shadow-2xl overflow-hidden flex flex-col border border-white max-h-[90vh]">
            
            <div className="bg-slate-950 p-6 text-white shrink-0 flex justify-between items-center">
               <div className="flex items-center gap-4 relative z-10">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-600 text-white shadow-xl"><Briefcase size={20}/></div>
                  <div>
                    <h3 className="text-lg font-black uppercase italic tracking-tight">{task ? 'Edit Task Node' : 'Initialize Task'}</h3>
                    <p className="text-[7px] font-bold text-slate-500 uppercase tracking-widest mt-1">Assignment Configuration Protocol</p>
                  </div>
               </div>
               <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-white/40 transition-all"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-6 overflow-y-auto no-scrollbar bg-[#fcfdfe] flex-grow">
               
               <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Task Headline</label>
                    <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full h-14 px-6 bg-white border border-slate-200 rounded-[22px] font-black text-slate-900 outline-none shadow-sm focus:border-indigo-400 transition-all" placeholder="e.g. Document Verification" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Registry Class</label>
                      <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full h-13 px-6 bg-white border border-slate-200 rounded-[20px] font-black text-slate-900 text-[10px] uppercase outline-none">
                         {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Yield (PKR)</label>
                      <input type="number" required value={form.reward} onChange={e => setForm({...form, reward: Number(e.target.value)})} className="w-full h-13 px-6 bg-white border border-slate-200 rounded-[20px] font-black text-slate-900 text-sm outline-none text-emerald-600" />
                    </div>
                  </div>
               </div>

               <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Plan Eligibility</label>
                        <select 
                          value={form.plan} 
                          onChange={e => setForm({...form, plan: e.target.value})}
                          className="w-full h-12 px-5 bg-white border border-slate-200 rounded-xl font-black text-[10px] uppercase outline-none"
                        >
                           {PLAN_TIERS.map(p => <option key={p} value={p}>{p} STATION</option>)}
                        </select>
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Targeting Logic</label>
                        <div className="flex bg-white p-1 rounded-xl border border-slate-200">
                           <button type="button" onClick={() => setForm({...form, assignmentType: 'all'})} className={clsx("flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all", form.assignmentType === 'all' ? "bg-slate-900 text-white shadow-md" : "text-slate-400")}>Global</button>
                           <button type="button" onClick={() => setForm({...form, assignmentType: 'specific'})} className={clsx("flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all", form.assignmentType === 'specific' ? "bg-slate-900 text-white shadow-md" : "text-slate-400")}>Selected</button>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="pt-4 pb-10">
                  <button type="submit" disabled={loading} className="w-full h-16 rounded-[32px] bg-slate-950 text-white font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3">
                     {loading ? <RefreshCw className="animate-spin" size={20}/> : <><ShieldCheck size={20} className="text-sky-400"/> COMMIT TO REGISTRY</>}
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