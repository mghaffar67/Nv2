
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
    if (isOpen) {
      const registry = dbNode.getUsers();
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
  }, [task, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'pdf') => {
    const file = e.target.files?.[0];
    if (file) {
      // Basic size check (10MB limit for base64 storage)
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
    setTimeout(() => { 
      onUpdate(); 
      onClose(); 
      setLoading(false); 
    }, 600);
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.phone.includes(userSearch)
  );

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
                    <h3 className="text-lg font-black uppercase italic tracking-tight">{task ? 'Edit Task' : 'Deploy Task'}</h3>
                    <p className="text-[7px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-1">Work Hub Node Configuration</p>
                  </div>
               </div>
               <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-white/40 transition-all"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-6 overflow-y-auto no-scrollbar bg-[#fcfdfe] flex-grow">
               
               {/* 1. CORE IDENTITY */}
               <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Task Title</label>
                    <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full h-14 px-6 bg-white border border-slate-200 rounded-[22px] font-black text-slate-900 outline-none shadow-sm focus:border-indigo-400 transition-all" placeholder="e.g. Handwriting Review #102" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Category</label>
                      <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full h-13 px-6 bg-white border border-slate-200 rounded-[20px] font-black text-slate-900 text-xs outline-none">
                         {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Reward (PKR)</label>
                      <input type="number" required value={form.reward} onChange={e => setForm({...form, reward: Number(e.target.value)})} className="w-full h-13 px-6 bg-white border border-slate-200 rounded-[20px] font-black text-slate-900 text-xs outline-none" />
                    </div>
                  </div>
               </div>

               {/* 2. TARGETING & PLAN GATING */}
               <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Plan Requirement</label>
                        <select 
                          value={form.plan} 
                          onChange={e => setForm({...form, plan: e.target.value})}
                          className="w-full h-12 px-5 bg-white border border-slate-200 rounded-xl font-black text-[10px] uppercase outline-none"
                        >
                           {PLAN_TIERS.map(p => <option key={p} value={p}>{p} STATION</option>)}
                        </select>
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Audience</label>
                        <div className="flex bg-white p-1 rounded-xl border border-slate-200">
                           <button type="button" onClick={() => setForm({...form, assignmentType: 'all'})} className={clsx("flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all", form.assignmentType === 'all' ? "bg-slate-900 text-white shadow-md" : "text-slate-400")}>All Nodes</button>
                           <button type="button" onClick={() => setForm({...form, assignmentType: 'specific'})} className={clsx("flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all", form.assignmentType === 'specific' ? "bg-slate-900 text-white shadow-md" : "text-slate-400")}>Specific</button>
                        </div>
                     </div>
                  </div>

                  {/* Specific User Selection Grid */}
                  <AnimatePresence>
                     {form.assignmentType === 'specific' && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-4 pt-4 border-t border-slate-200">
                           <div className="relative">
                              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                              <input 
                                type="text" 
                                placeholder="Search by name or phone..." 
                                value={userSearch}
                                onChange={e => setUserSearch(e.target.value)}
                                className="w-full h-10 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-[10px] font-bold outline-none"
                              />
                           </div>
                           <div className="max-h-[180px] overflow-y-auto no-scrollbar grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {filteredUsers.map(user => (
                                 <button 
                                   key={user.id} type="button"
                                   onClick={() => toggleUserSelection(user.id)}
                                   className={clsx(
                                     "flex items-center justify-between p-3 rounded-xl border transition-all text-left",
                                     form.targetUsers.includes(user.id) ? "bg-indigo-50 border-indigo-200" : "bg-white border-slate-100"
                                   )}
                                 >
                                    <div className="overflow-hidden">
                                       <p className="text-[10px] font-black text-slate-800 uppercase truncate">{user.name}</p>
                                       <p className="text-[7px] font-bold text-slate-400 tracking-tighter">{user.phone}</p>
                                    </div>
                                    {form.targetUsers.includes(user.id) && <Check size={14} className="text-indigo-600 shrink-0" />}
                                 </button>
                              ))}
                           </div>
                           <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest text-center">{form.targetUsers.length} Nodes Selected</p>
                        </motion.div>
                     )}
                  </AnimatePresence>
               </div>

               {/* 3. ASSET HUB (MEDIA & INSTRUCTIONS) */}
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
                           <option value="text">TEXT ONLY</option>
                        </select>
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Payload</label>
                        {form.mediaType === 'image' ? (
                           <div className="relative group">
                              <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'image')} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                              <div className={clsx(
                                "h-12 px-4 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 transition-all overflow-hidden",
                                preview ? "border-emerald-400 bg-emerald-50/20" : "border-slate-200 bg-white hover:border-indigo-400"
                              )}>
                                 {preview ? <Check size={14} className="text-emerald-500"/> : <Upload size={14} className="text-slate-300"/>}
                                 <span className="text-[9px] font-black text-slate-500 uppercase">{preview ? "IMAGE READY" : "UPLOAD IMAGE"}</span>
                              </div>
                           </div>
                        ) : form.mediaType === 'pdf' ? (
                          <div className="relative group">
                             <input type="file" accept="application/pdf" onChange={e => handleFileChange(e, 'pdf')} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                             <div className={clsx(
                               "h-12 px-4 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 transition-all overflow-hidden",
                               preview === 'pdf_detected' ? "border-emerald-400 bg-emerald-50/20" : "border-slate-200 bg-white hover:border-indigo-400"
                             )}>
                                {preview === 'pdf_detected' ? <Check size={14} className="text-emerald-500"/> : <FileDown size={14} className="text-slate-300"/>}
                                <span className="text-[9px] font-black text-slate-500 uppercase">{preview === 'pdf_detected' ? "PDF LOADED" : "UPLOAD PDF"}</span>
                             </div>
                          </div>
                        ) : (
                           <input 
                             type="text" 
                             value={form.mediaUrl} 
                             onChange={e => setForm({...form, mediaUrl: e.target.value})}
                             className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl font-mono text-[9px] outline-none"
                             placeholder={form.mediaType === 'link' ? "Enter Resource URL" : "Enter Text Instruction"}
                           />
                        )}
                     </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Execution Instructions</label>
                    <textarea rows={4} value={form.instruction} onChange={e => setForm({...form, instruction: e.target.value})} className="w-full p-6 bg-white border border-slate-200 rounded-[32px] font-medium text-xs text-slate-600 outline-none shadow-sm resize-none focus:border-indigo-400" placeholder="Provide clear step-by-step guidance for the user..." />
                  </div>
               </div>

               <div className="pt-4 pb-8">
                  <button type="submit" disabled={loading} className="w-full h-16 rounded-[32px] bg-slate-950 text-white font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3">
                     {loading ? <RefreshCw className="animate-spin" size={20}/> : <><Save size={20} className="text-sky-400"/> COMMIT TO REGISTRY</>}
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
