import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Puzzle, 
  Code, 
  Eye, 
  Save, 
  Trash2, 
  Plus, 
  Zap, 
  ShieldCheck, 
  Monitor, 
  CheckCircle2, 
  X, 
  Loader2,
  RefreshCw,
  Layout,
  MessageSquare,
  AlertTriangle,
  Gift
} from 'lucide-react';
import { api } from '../../../utils/api';
import { clsx } from 'clsx';

const TEMPLATES = {
  ALERT: `
<div style="background: white; padding: 40px; border-radius: 40px; border: 4px solid #f43f5e; box-shadow: 0 30px 60px -12px rgba(0,0,0,0.25); text-align: center; max-width: 400px;">
  <div style="width: 80px; height: 80px; background: #fff1f2; border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; color: #f43f5e;">
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
  </div>
  <h2 style="font-size: 24px; font-weight: 900; color: #0f172a; text-transform: uppercase; margin-bottom: 10px; letter-spacing: -1px;">System Alert!</h2>
  <p style="font-size: 13px; color: #64748b; font-weight: 600; line-height: 1.6; margin-bottom: 30px;">Maintainance node is active. Payouts might be delayed by 2 hours. Please wait patiently.</p>
  <button onclick="window.closeNoorPopup()" style="width: 100%; height: 56px; background: #0f172a; color: white; border: none; border-radius: 20px; font-weight: 800; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; cursor: pointer; transition: all 0.3s;">Understood</button>
</div>`,
  OFFER: `
<div style="background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); padding: 50px; border-radius: 40px; box-shadow: 0 40px 100px -20px rgba(99,102,241,0.5); text-align: center; max-width: 400px; color: white; position: relative; overflow: hidden;">
  <div style="position: absolute; top: -20px; right: -20px; opacity: 0.1;">
    <svg width="150" height="150" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
  </div>
  <h4 style="font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 4px; margin-bottom: 15px; opacity: 0.8;">Special Reward Node</h4>
  <h2 style="font-size: 40px; font-weight: 900; margin-bottom: 10px; font-style: italic; line-height: 0.9;">GET 50% <br/> BONUS!</h2>
  <p style="font-size: 12px; font-weight: 600; margin-bottom: 35px; opacity: 0.9;">Upgrade your station today and receive instant cashback in your wallet node.</p>
  <a href="#/user/plans" onclick="window.closeNoorPopup()" style="display: block; width: 100%; height: 56px; background: white; color: #6366f1; border: none; border-radius: 20px; font-weight: 800; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; cursor: pointer; text-decoration: none; display: flex; align-items: center; justify-content: center;">Activate Plan</a>
</div>`,
  WHATSAPP: `
<div style="background: white; padding: 40px; border-radius: 40px; box-shadow: 0 30px 80px -15px rgba(34,197,94,0.3); text-align: center; max-width: 380px; border: 1px solid #f0fdf4;">
  <div style="width: 70px; height: 70px; background: #22c55e; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; color: white; box-shadow: 0 10px 25px rgba(34,197,94,0.4);">
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
  </div>
  <h2 style="font-size: 22px; font-weight: 900; color: #166534; margin-bottom: 8px;">Official Group</h2>
  <p style="font-size: 12px; color: #15803d; font-weight: 600; margin-bottom: 24px;">Join our verified community for daily earning updates and instant support.</p>
  <a href="https://wa.me/923068665907" target="_blank" onclick="window.closeNoorPopup()" style="display: flex; align-items: center; justify-content: center; width: 100%; height: 56px; background: #22c55e; color: white; border-radius: 20px; font-weight: 800; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; text-decoration: none; margin-bottom: 12px;">Join Community</a>
  <button onclick="window.closeNoorPopup()" style="background: none; border: none; font-size: 9px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 2px; cursor: pointer;">Dismiss</button>
</div>`
};

const IntegrationHub = () => {
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'scripts' | 'popups'>('scripts');
  const [editing, setEditing] = useState<any>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await api.get('/system/integrations');
      setIntegrations(res || []);
    } catch (e) {
      console.error("Hub Sync failed.");
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

  const toggleItem = async (id: string) => {
    try {
      await api.handleRequest('PATCH', `/system/integrations/${id}/toggle`);
      fetchAll();
    } catch (e) {}
  };

  const deleteItem = async (id: string) => {
    if (!window.confirm("Remove this Connection node permanently?")) return;
    try {
      await api.handleRequest('DELETE', `/system/integrations/${id}`);
      fetchAll();
    } catch (e) {}
  };

  const startNew = () => {
    setEditing({
      name: '',
      type: activeTab === 'scripts' ? 'script' : 'campaign',
      position: activeTab === 'scripts' ? 'head' : 'center_modal',
      content: '',
      isActive: true
    });
  };

  return (
    <div className="space-y-8 animate-fade-in pb-24">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-50 pb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Connection <span className="text-indigo-600">Hub.</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-3 italic flex items-center gap-2">
            <ShieldCheck size={14} className="text-indigo-500" /> Dynamic Code Injection & Popup Management
          </p>
        </div>
        
        <button 
          onClick={startNew}
          className="h-14 px-10 bg-slate-950 text-white rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl flex items-center gap-3 active:scale-95 transition-all"
        >
          <Plus size={18} className="text-sky-400" /> 
          New Node
        </button>
      </header>

      {/* Tabs */}
      <div className="flex bg-white p-1.5 rounded-[22px] border border-slate-100 shadow-sm w-fit">
         <button onClick={() => setActiveTab('scripts')} className={clsx("px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", activeTab === 'scripts' ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-600")}>
           External Scripts
         </button>
         <button onClick={() => setActiveTab('popups')} className={clsx("px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", activeTab === 'popups' ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-600")}>
           Popup Builder
         </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* List Column */}
        <div className="xl:col-span-4 space-y-4">
           {loading ? (
             <div className="py-20 text-center"><RefreshCw className="animate-spin mx-auto text-slate-200" size={32}/></div>
           ) : integrations.filter(i => activeTab === 'scripts' ? i.type === 'script' : (i.type === 'campaign' || i.type === 'popup')).map(item => (
             <motion.div 
               key={item.id} 
               className={clsx(
                 "bg-white p-5 rounded-[32px] border transition-all cursor-pointer group shadow-sm",
                 editing?.id === item.id ? "border-indigo-500 ring-4 ring-indigo-50" : "border-slate-100 hover:border-slate-300"
               )}
               onClick={() => setEditing(item)}
             >
                <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-3">
                      <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center", item.isActive ? "bg-indigo-50 text-indigo-600" : "bg-slate-100 text-slate-400")}>
                         {item.type === 'script' ? <Code size={18} /> : <Layout size={18} />}
                      </div>
                      <div>
                         <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-tight truncate max-w-[120px]">{item.name || 'Untitled Node'}</h4>
                         <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mt-1">{item.position?.replace('_', ' ')}</p>
                      </div>
                   </div>
                   <button 
                     onClick={(e) => { e.stopPropagation(); toggleItem(item.id); }}
                     className={clsx(
                       "w-10 h-5 rounded-full relative flex items-center px-1 transition-all",
                       item.isActive ? "bg-emerald-500" : "bg-slate-200"
                     )}
                   >
                      <div className={clsx("w-3 h-3 bg-white rounded-full shadow-sm transition-all", item.isActive ? "translate-x-5" : "translate-x-0")} />
                   </button>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }} className="p-2 bg-rose-50 text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={14}/></button>
                </div>
             </motion.div>
           ))}
        </div>

        {/* Editor Column */}
        <div className="xl:col-span-8">
           <AnimatePresence mode="wait">
             {editing ? (
               <motion.form 
                 key="editor" 
                 initial={{ opacity: 0, x: 20 }} 
                 animate={{ opacity: 1, x: 0 }} 
                 exit={{ opacity: 0, x: 20 }}
                 onSubmit={handleSave} 
                 className="bg-white p-8 md:p-10 rounded-[44px] border border-slate-100 shadow-xl space-y-8"
               >
                  <div className="flex justify-between items-center">
                     <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase italic flex items-center gap-2">
                        {editing.id ? 'Edit Connection' : 'Initialize Node'}
                     </h3>
                     <button type="button" onClick={() => setEditing(null)} className="p-2 hover:bg-slate-50 rounded-full"><X size={20}/></button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Node Name (Internal)</label>
                        <input 
                          required value={editing.name} onChange={e => setEditing({...editing, name: e.target.value})}
                          className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-[22px] font-bold text-sm outline-none focus:bg-white transition-all"
                          placeholder="e.g. Tawk.to Chat"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Deployment Slot</label>
                        <select 
                          value={editing.position} onChange={e => setEditing({...editing, position: e.target.value})}
                          className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-[22px] font-black text-[10px] uppercase outline-none focus:bg-white appearance-none"
                        >
                           {editing.type === 'script' ? (
                             <>
                               <option value="head">Header (Before &lt;/head&gt;)</option>
                               <option value="body_end">Footer (Before &lt;/body&gt;)</option>
                             </>
                           ) : (
                             <option value="center_modal">Center Display Modal</option>
                           )}
                        </select>
                     </div>
                  </div>

                  {editing.type === 'campaign' && (
                    <div className="space-y-4">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Quick Deploy Templates</p>
                       <div className="grid grid-cols-3 gap-3">
                          <button type="button" onClick={() => setEditing({...editing, content: TEMPLATES.ALERT, name: 'System Alert'})} className="h-12 border-2 border-slate-100 rounded-xl flex items-center justify-center gap-2 hover:border-rose-200 hover:bg-rose-50 transition-all text-slate-400 hover:text-rose-600">
                             <AlertTriangle size={14} /> <span className="text-[8px] font-black uppercase">Warning</span>
                          </button>
                          <button type="button" onClick={() => setEditing({...editing, content: TEMPLATES.OFFER, name: 'Promo Offer'})} className="h-12 border-2 border-slate-100 rounded-xl flex items-center justify-center gap-2 hover:border-amber-200 hover:bg-amber-50 transition-all text-slate-400 hover:text-amber-600">
                             <Gift size={14} /> <span className="text-[8px] font-black uppercase">Promo</span>
                          </button>
                          <button type="button" onClick={() => setEditing({...editing, content: TEMPLATES.WHATSAPP, name: 'WhatsApp Link'})} className="h-12 border-2 border-slate-100 rounded-xl flex items-center justify-center gap-2 hover:border-green-200 hover:bg-green-50 transition-all text-slate-400 hover:text-green-600">
                             <MessageSquare size={14} /> <span className="text-[8px] font-black uppercase">Community</span>
                          </button>
                       </div>
                    </div>
                  )}

                  <div className="space-y-2">
                     <div className="flex justify-between items-center px-4">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Payload Content (Raw HTML/JS)</label>
                        <button type="button" onClick={() => setShowPreview(!showPreview)} className="text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:underline flex items-center gap-1.5">
                           <Eye size={12} /> {showPreview ? 'Hide' : 'Live Preview'}
                        </button>
                     </div>
                     <textarea 
                        required value={editing.content} onChange={e => setEditing({...editing, content: e.target.value})}
                        className="w-full h-[300px] p-6 bg-slate-900 text-sky-400 font-mono text-[11px] rounded-[32px] border-4 border-slate-950 outline-none focus:ring-4 focus:ring-indigo-50/50 resize-none"
                        placeholder="<!-- Paste your code here -->"
                     />
                  </div>

                  <div className="flex gap-4">
                     <button 
                       type="submit" disabled={saveLoading}
                       className="flex-1 h-16 bg-slate-950 text-white rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
                     >
                        {saveLoading ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} className="text-sky-400" /> Save Configuration</>}
                     </button>
                  </div>
               </motion.form>
             ) : (
               <div className="h-[600px] flex flex-col items-center justify-center text-center p-12 bg-slate-50 border-4 border-dashed border-slate-100 rounded-[64px] opacity-40">
                  <div className="w-24 h-24 bg-white rounded-[40px] flex items-center justify-center text-slate-200 shadow-inner mb-8">
                     <Puzzle size={48} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-400 italic tracking-tighter uppercase mb-2">Editor Inactive</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] max-w-[300px] leading-relaxed">Select a connection node from the left or create a new one to begin development.</p>
               </div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default IntegrationHub;