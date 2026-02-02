
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Save, Zap, Briefcase, RefreshCw, 
  FileText, Layers, Users, ShieldCheck, 
  Search, Check, Image as ImageIcon, File,
  Upload, Camera, FileDown
} from 'lucide-react';
import { dbNode } from '../../backend_core/utils/db';
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
    const loadRegistry = async () => {
      if (isOpen) {
        // Add await to fix Promise data error
        const registry = await dbNode.getUsers();
        setUsers(registry);
        
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
    loadRegistry();
  }, [task, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'pdf') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File too large. Max 10MB allowed for registry nodes.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (type === 'image') {
          setPreview(base64);
        } else {
          setPreview('pdf_detected');
        }
        setForm(prev => ({ ...prev, mediaUrl: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleUserSelection = (userId: string) => {
    const current = [...form.targetUsers];
    if (current.includes(userId)) {
      setForm({ ...form, targetUsers: current.filter(id => id !== userId) });
    } else {
      setForm({ ...form, targetUsers: [...current, userId] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Add await to fix Promise array method error
    const db = await dbNode.getTasks();
    const newTask = { 
      ...form, 
      id: task?.id || `TASK-${Math.random().toString(36).substr(2, 4).toUpperCase()}`, 
      createdAt: new Date().toISOString() 
    };
    
    if (task) {
      // Fix property access on Promise
      const idx = db.findIndex((t: any) => t.id === task.id);
      if (idx !== -1) db[idx] = newTask;
    } else {
      // Fix unshift on Promise error
      db.unshift(newTask);
    }
    
    // Fix argument type error
    await dbNode.saveTasks(db);
    setTimeout(() => { 
      onUpdate(); 
      onClose(); 
      setLoading(false); 
    }, 600);
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
                    <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full h-14 px-6 bg-white border border-slate-200 rounded-[22px] font-black text-slate-900 outline-none shadow-sm focus:border-indigo-400 transition-all" placeholder="e.g. Document Verification Phase 2" />
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

               <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Format</label>
                        <select value={form.mediaType} onChange={e => {
                          const newType = e.target.value as any;
                          setForm({...form, mediaType: newType, mediaUrl: ''});
                          setPreview(null);
                        }} className="w-full h-12 px-5 bg-white border border-slate-200 rounded-xl font-black text-[10px] uppercase outline-none">
                           <option value="image">IMAGE NODE</option>
                           <option value="pdf">PDF DOCUMENT</option>
                           <option value="link">WEB LINK</option>
                        </select>
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Payload Injection</label>
                        {form.mediaType === 'image' || form.mediaType === 'pdf' ? (
                           <div className="relative group">
                              <input type="file" accept={form.mediaType === 'image' ? "image/*" : "application/pdf"} onChange={e => handleFileChange(e, form.mediaType as any)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                              <div className={clsx(
                                "h-12 px-4 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 transition-all overflow-hidden",
                                preview ? "border-emerald-400 bg-emerald-50/20" : "border-slate-200 bg-white hover:border-indigo-400"
                              )}>
                                 {preview ? <Check size={14} className="text-emerald-500"/> : <Upload size={14} className="text-slate-300"/>}
                                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{preview ? "ASSET LOADED" : `UPLOAD ${form.mediaType.toUpperCase()}`}</span>
                              </div>
                           </div>
                        ) : (
                           <input 
                             type="text" 
                             value={form.mediaUrl} 
                             onChange={e => setForm({...form, mediaUrl: e.target.value})}
                             className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl font-mono text-[9px] outline-none"
                             placeholder="https://resource-link.com"
                           />
                        )}
                     </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Execution Instructions</label>
                    <textarea rows={4} value={form.instruction} onChange={e => setForm({...form, instruction: e.target.value})} className="w-full p-6 bg-white border border-slate-200 rounded-[32px] font-medium text-xs text-slate-600 outline-none shadow-sm resize-none focus:border-indigo-400" placeholder="Provide step-by-step guidance for the user node..." />
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
