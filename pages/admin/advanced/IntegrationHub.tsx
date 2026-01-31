import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Puzzle, Code, Save, Trash2, Plus, Zap, ShieldCheck, 
  Monitor, CheckCircle2, X, Loader2, RefreshCw, Layout,
  MessageSquare, AlertTriangle, Gift, Globe, Search,
  Terminal, BarChart3, Mail, Target, Sliders, BadgeCheck
} from 'lucide-react';
import { api } from '../../../utils/api';
import { clsx } from 'clsx';

const CATEGORIES = [
  { id: 'marketing', label: 'Marketing Pixels', icon: Target },
  { id: 'analytics', label: 'Analytics Hub', icon: BarChart3 },
  { id: 'customer', label: 'Customer Support', icon: MessageSquare },
  { id: 'security', label: 'Security Protocols', icon: ShieldCheck }
];

const IntegrationHub = () => {
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await api.get('/system/integrations');
      setIntegrations(res || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      await api.post('/system/integrations', editing);
      setEditing(null);
      fetchAll();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  const deleteItem = async (id: string) => {
    if (!window.confirm("Terminate this connection node? All associated features will stop immediately.")) return;
    try {
      await api.handleRequest('DELETE', `/system/integrations/${id}`);
      fetchAll();
    } catch (e) {}
  };

  const startNew = () => {
    setEditing({
      name: '',
      type: 'script',
      position: 'head',
      category: 'marketing',
      content: '',
      isActive: true
    });
  };

  return (
    <div className="space-y-8 animate-fade-in pb-24">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-50 pb-8 px-2">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Integration <span className="text-indigo-600">Market.</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] mt-4 flex items-center gap-2 italic">
            <Globe size={14} className="text-sky-500" /> Professional Code Injections & Webhook Nodes
          </p>
        </div>
        
        <div className="flex gap-2">
           <button 
             onClick={startNew}
             className="h-12 px-8 bg-slate-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-3 active:scale-95 transition-all"
           >
             <Plus size={18} className="text-sky-400" /> New Connection
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        <div className="xl:col-span-12">
           {loading ? (
             <div className="py-24 text-center"><RefreshCw className="animate-spin mx-auto text-indigo-500" size={44}/></div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-1">
                {integrations.filter(i => i.type === 'script').map(item => (
                  <motion.div 
                    key={item.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-6 rounded-[44px] border border-slate-100 shadow-sm group hover:shadow-xl hover:border-indigo-100 transition-all flex flex-col h-full"
                  >
                     <div className="flex justify-between items-start mb-8">
                        <div className={clsx(
                          "w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner",
                          item.isActive ? "bg-indigo-50 text-indigo-600" : "bg-slate-50 text-slate-300"
                        )}>
                           <Code size={28}/>
                        </div>
                        <div className="flex gap-2">
                           <button onClick={() => setEditing(item)} className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all"><RefreshCw size={16}/></button>
                           <button onClick={() => deleteItem(item.id)} className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={16}/></button>
                        </div>
                     </div>
                     <h4 className="text-xl font-black text-slate-900 uppercase italic tracking-tight truncate leading-none mb-2">{item.name}</h4>
                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.position?.replace('_', ' ')} Node</p>

                     <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                        <div className={clsx(
                           "px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-2 border shadow-inner",
                           item.isActive ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-100"
                        )}>
                           <div className={clsx("w-1.5 h-1.5 rounded-full", item.isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-300")} />
                           {item.isActive ? 'Linked' : 'Offline'}
                        </div>
                     </div>
                  </motion.div>
                ))}
             </div>
           )}
        </div>
      </div>

      <AnimatePresence>
        {editing && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditing(null)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
             <motion.form 
                initial={{ scale: 0.95, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                onSubmit={handleSave} className="relative w-full max-w-2xl bg-white rounded-[56px] shadow-2xl overflow-hidden border border-white flex flex-col"
             >
                <div className="bg-slate-950 p-8 text-white shrink-0 relative">
                   <div className="flex items-center justify-between mb-8 relative z-10">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl"><Sliders size={24}/></div>
                        <div>
                           <h3 className="text-xl font-black uppercase italic tracking-tighter">Connection Config.</h3>
                           <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">S3-Compatible Registry Sync</p>
                        </div>
                      </div>
                      <button type="button" onClick={() => setEditing(null)} className="p-3 bg-white/10 rounded-full hover:bg-rose-500 transition-all"><X size={20}/></button>
                   </div>
                </div>

                <div className="p-8 md:p-12 overflow-y-auto no-scrollbar space-y-8 flex-grow">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Friendly Name</label>
                         <input required value={editing.name} onChange={e => setEditing({...editing, name: e.target.value})} className="w-full h-14 px-7 bg-slate-50 border border-slate-100 rounded-[28px] font-black text-sm text-slate-900 outline-none focus:bg-white transition-all shadow-inner" placeholder="e.g. Analytics v4" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Injection Position</label>
                         <select value={editing.position} onChange={e => setEditing({...editing, position: e.target.value})} className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-[28px] font-black text-[10px] uppercase outline-none focus:bg-white">
                            <option value="head">Header Node</option>
                            <option value="body_end">Footer Node</option>
                         </select>
                      </div>
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Payload Data (HTML/JavaScript)</label>
                      <textarea rows={10} required value={editing.content} onChange={e => setEditing({...editing, content: e.target.value})} className="w-full p-8 bg-slate-900 text-sky-400 font-mono text-[11px] rounded-[44px] border-4 border-slate-950 outline-none focus:ring-8 focus:ring-indigo-50 transition-all" placeholder="<script> ... </script>" />
                   </div>
                </div>

                <div className="p-8 bg-white border-t border-slate-50 shrink-0">
                   <button type="submit" disabled={saveLoading} className="w-full h-18 bg-slate-950 text-white rounded-[32px] font-black text-[12px] uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4">
                      {saveLoading ? <Loader2 className="animate-spin" /> : <><BadgeCheck size={28} className="text-sky-400" /> Commit to Cluster</>}
                   </button>
                </div>
             </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IntegrationHub;