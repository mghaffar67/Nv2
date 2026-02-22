import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Puzzle, Code, Save, Trash2, Plus, Zap, ShieldCheck, 
  Monitor, CheckCircle2, X, Loader2, RefreshCw, Layout,
  MessageSquare, AlertTriangle, Gift, Globe, Search,
  Terminal, BarChart3, Mail, Target, Sliders, BadgeCheck,
  Smartphone, Activity, Box, Database
} from 'lucide-react';
import { api } from '../../../utils/api';
import { clsx } from 'clsx';

const IntegrationHub = () => {
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [saveLoading, setSaveLoading] = useState(false);

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
      await api.post('/system/integrations', { ...editing, type: 'script' });
      setEditing(null);
      fetchAll();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  const deleteItem = async (id: string) => {
    if (!window.confirm("Delete this script connection?")) return;
    try {
      await api.handleRequest('DELETE', `/system/integrations/${id}`);
      fetchAll();
    } catch (e) {}
  };

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 px-2">
        <div>
           <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">Third-Party <span className="text-indigo-600">Tools.</span></h2>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 italic">Connect External Scripts like WhatsApp, Pixel, or Analytics</p>
        </div>
        <button 
           onClick={() => setEditing({ name: '', type: 'script', position: 'head', content: '', isActive: true })}
           className="h-12 px-8 bg-slate-950 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-xl flex items-center gap-2 active:scale-95 transition-all"
        >
           <Plus size={16} className="text-sky-400" /> New Integration
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full py-24 text-center opacity-30"><RefreshCw className="animate-spin mx-auto" size={40}/></div>
        ) : integrations.filter(i => i.type === 'script').map(item => (
          <div key={item.id} className="bg-slate-50/50 p-6 rounded-[40px] border border-slate-100 flex flex-col justify-between group transition-all hover:bg-white hover:shadow-xl hover:border-indigo-100 min-h-[180px]">
             <div className="flex justify-between items-start mb-6">
                <div className={clsx(
                  "w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-inner",
                  item.isActive ? "bg-indigo-50 text-indigo-600" : "bg-slate-100 text-slate-300"
                )}>
                   <Code size={28}/>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                   <button onClick={() => setEditing(item)} className="p-3 bg-white border border-slate-100 text-slate-400 rounded-xl hover:bg-slate-950 hover:text-white transition-all"><Sliders size={16}/></button>
                   <button onClick={() => deleteItem(item.id)} className="p-3 bg-white border border-slate-100 text-rose-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={16}/></button>
                </div>
             </div>
             <div>
                <h4 className="text-lg font-black text-slate-900 uppercase italic truncate mb-1">{item.name}</h4>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active Integration</p>
             </div>
             <div className="mt-6 pt-4 border-t border-slate-100/50 flex items-center gap-2">
                <div className={clsx("w-1.5 h-1.5 rounded-full", item.isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-300")} />
                <span className={clsx("text-[8px] font-black uppercase tracking-[0.2em]", item.isActive ? "text-emerald-600" : "text-slate-400")}>{item.isActive ? 'Online' : 'Off'}</span>
             </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {editing && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-3">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditing(null)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
             <motion.form 
                initial={{ scale: 0.95, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                onSubmit={handleSave} className="relative w-full max-w-xl bg-white rounded-[56px] shadow-2xl overflow-hidden border border-white flex flex-col"
             >
                <div className="bg-slate-950 p-10 text-white shrink-0">
                   <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-xl"><Puzzle size={24}/></div>
                        <div>
                           <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-none">Setup Tool.</h3>
                           <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-2 italic">Connect Third-Party Scripts</p>
                        </div>
                      </div>
                      <button type="button" onClick={() => setEditing(null)} className="p-3 bg-white/5 rounded-full hover:bg-rose-50 transition-all"><X size={24}/></button>
                   </div>
                </div>

                <div className="p-10 space-y-8 overflow-y-auto no-scrollbar flex-grow bg-[#fcfdfe]">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6">Tool Name</label>
                         <input required value={editing.name} onChange={e => setEditing({...editing, name: e.target.value})} className="w-full h-14 px-7 bg-slate-50 border border-slate-200 rounded-[28px] font-black text-sm text-slate-900 outline-none focus:ring-4 focus:ring-indigo-50/50 shadow-inner" placeholder="e.g. Chat Support" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6">Placement</label>
                         <select value={editing.position} onChange={e => setEditing({...editing, position: e.target.value})} className="w-full h-14 px-7 bg-slate-50 border border-slate-200 rounded-[28px] font-black text-[10px] uppercase outline-none focus:ring-4 focus:ring-indigo-50/50 appearance-none">
                            <option value="head">Website Header</option>
                            <option value="body_end">Website Footer</option>
                         </select>
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6 italic">Integration Code (HTML)</label>
                      <textarea rows={10} required value={editing.content} onChange={e => setEditing({...editing, content: e.target.value})} className="w-full p-8 bg-slate-950 text-emerald-400 font-mono text-[10px] rounded-[44px] border-4 border-slate-900 outline-none focus:ring-8 focus:ring-indigo-50/50 transition-all resize-none shadow-inner" placeholder="Paste script here..." />
                   </div>
                </div>

                <div className="p-10 bg-white border-t border-slate-50 shrink-0">
                   <button type="submit" disabled={saveLoading} className="w-full h-18 bg-slate-950 text-white rounded-[32px] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4">
                      {saveLoading ? <Loader2 className="animate-spin" /> : <><Save size={28} className="text-sky-400" /> Save Integration</>}
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