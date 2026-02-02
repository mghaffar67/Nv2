import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Puzzle, Code, Eye, Save, Trash2, Plus, 
  Zap, ShieldCheck, Monitor, CheckCircle2, 
  X, Loader2, RefreshCw, Layout, MessageSquare, 
  AlertTriangle, Gift, Terminal, Globe
} from 'lucide-react';
import { api } from '../../../utils/api';
import { clsx } from 'clsx';

const AdvancedHub = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'scripts' | 'campaigns'>('scripts');
  const [editing, setEditing] = useState<any>(null);
  const [saveLoading, setSaveLoading] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get('/system/integrations');
      setItems(res || []);
    } catch (e) {
      console.error("Advanced Hub Sync Failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      await api.post('/system/integrations', editing);
      setEditing(null);
      fetchItems();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  const deleteItem = async (id: string) => {
    if (!window.confirm("Disconnect this functional node?")) return;
    try {
      await api.handleRequest('DELETE', `/system/integrations/${id}`);
      fetchItems();
    } catch (e) {}
  };

  const filteredItems = items.filter(i => 
    activeTab === 'scripts' ? i.type === 'script' : i.type === 'campaign'
  );

  return (
    <div className="space-y-8 animate-fade-in pb-24">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-50 pb-8 px-2">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Advanced <span className="text-indigo-600">Hub.</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] mt-4 flex items-center gap-2 italic">
            <Terminal size={14} className="text-indigo-500" /> Integrated Broadcast & Code Management
          </p>
        </div>
        <button 
          onClick={() => setEditing({ 
            name: '', 
            type: activeTab === 'scripts' ? 'script' : 'campaign', 
            content: '', 
            isActive: true, 
            position: activeTab === 'scripts' ? 'head' : 'center_modal' 
          })}
          className="h-14 px-10 bg-slate-950 text-white rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl flex items-center gap-3 active:scale-95 transition-all"
        >
          <Plus size={20} className="text-sky-400" /> New Component
        </button>
      </header>

      <div className="flex bg-white p-1.5 rounded-[22px] border border-slate-100 shadow-sm w-fit">
         <button onClick={() => setActiveTab('scripts')} className={clsx("px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", activeTab === 'scripts' ? "bg-slate-900 text-white shadow-lg" : "text-slate-400")}>
           External Scripts
         </button>
         <button onClick={() => setActiveTab('campaigns')} className={clsx("px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", activeTab === 'campaigns' ? "bg-slate-900 text-white shadow-lg" : "text-slate-400")}>
           Broadcast Popups
         </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        <div className="xl:col-span-4 space-y-4">
           {loading ? (
             <div className="py-20 text-center"><RefreshCw className="animate-spin mx-auto text-slate-200" size={32}/></div>
           ) : filteredItems.map(item => (
             <motion.div 
               key={item.id} onClick={() => setEditing(item)}
               className={clsx("bg-white p-5 rounded-[32px] border transition-all cursor-pointer group shadow-sm", editing?.id === item.id ? "border-indigo-500 ring-4 ring-indigo-50" : "border-slate-100 hover:border-slate-300")}
             >
                <div className="flex items-center justify-between mb-2">
                   <div className="flex items-center gap-3">
                      <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center", item.isActive ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400")}>
                         {item.type === 'script' ? <Code size={18} /> : <Layout size={18} />}
                      </div>
                      <div>
                         <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-tight truncate max-w-[120px]">{item.name || 'Untitled Node'}</h4>
                         <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">{item.position}</p>
                      </div>
                   </div>
                   <button onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }} className="opacity-0 group-hover:opacity-100 p-2 bg-rose-50 text-rose-500 rounded-lg transition-all"><Trash2 size={14}/></button>
                </div>
             </motion.div>
           ))}
        </div>

        <div className="xl:col-span-8">
           <AnimatePresence mode="wait">
             {editing ? (
               <motion.form 
                 key="editor" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                 onSubmit={handleSave} className="bg-white p-8 md:p-12 rounded-[56px] border border-slate-100 shadow-2xl space-y-10"
               >
                  <div className="flex justify-between items-center">
                     <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">Node Protocol.</h3>
                     <button type="button" onClick={() => setEditing(null)} className="p-3 bg-slate-50 rounded-full hover:bg-rose-50 hover:text-rose-500 transition-all"><X size={24}/></button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-4 italic">Reference Name</label>
                        <input required value={editing.name} onChange={e => setEditing({...editing, name: e.target.value})} className="w-full h-14 px-7 bg-slate-50 border border-slate-100 rounded-[28px] font-black text-sm outline-none focus:bg-white transition-all shadow-inner" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-4 italic">Deployment Slot</label>
                        <select value={editing.position} onChange={e => setEditing({...editing, position: e.target.value})} className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-[28px] font-black text-[10px] uppercase outline-none appearance-none cursor-pointer">
                           <option value="head">Header (&lt;head&gt;)</option>
                           <option value="body_end">Footer (&lt;/body&gt;)</option>
                           <option value="center_modal">Center Popup Modal</option>
                        </select>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-4 block mb-2">Payload (HTML/JS)</label>
                     <textarea required value={editing.content} onChange={e => setEditing({...editing, content: e.target.value})} className="w-full h-[300px] p-8 bg-slate-900 text-sky-400 font-mono text-[11px] rounded-[44px] border-4 border-slate-950 outline-none resize-none shadow-inner" />
                  </div>

                  <button type="submit" disabled={saveLoading} className="w-full h-18 bg-slate-950 text-white rounded-[32px] font-black text-[12px] uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4">
                     {saveLoading ? <Loader2 className="animate-spin" size={24}/> : <><ShieldCheck size={24} className="text-sky-400" /> Deploy Node</>}
                  </button>
               </motion.form>
             ) : (
               <div className="h-[600px] flex flex-col items-center justify-center text-center p-12 bg-slate-50 border-4 border-dashed border-slate-100 rounded-[64px] opacity-40">
                  <div className="w-24 h-24 bg-white rounded-[40px] flex items-center justify-center text-slate-200 shadow-inner mb-8">
                     <Puzzle size={48} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-400 italic tracking-tighter uppercase mb-2">Editor Dormant</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] max-w-[300px] leading-relaxed">Select a functional hub node from the left to begin deployment.</p>
               </div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdvancedHub;