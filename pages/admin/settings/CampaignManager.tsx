import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Save, Trash2, Smartphone, Target, 
  RefreshCw, Image as ImageIcon, Zap, 
  MessageSquare, Gift, Bell, CheckCircle2,
  ChevronRight, X, ExternalLink, Globe,
  Loader2, Layout, Monitor, Filter, Settings, Code,
  Eye, EyeOff, BadgeCheck, ShieldCheck, Clock, UserCheck
} from 'lucide-react';
import { api } from '../../../utils/api';
import { clsx } from 'clsx';

const TEMPLATES = {
  ALERT: {
    title: 'System Alert!',
    body: 'Maintenance is active. Payouts might be delayed by 2-3 hours.',
    btn: 'Understood',
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800'
  },
  OFFER: {
    title: 'Flash Earning!',
    body: 'Upgrade to Diamond station today and get 15% cashback instantly.',
    btn: 'Upgrade Now',
    img: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=800'
  }
};

const CampaignManager = () => {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [showRealPreview, setShowRealPreview] = useState(true);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const res = await api.get('/system/integrations');
      setCampaigns(res.filter((i: any) => i.type === 'campaign') || []);
    } catch (e) {
      console.error("Hub Sync failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCampaigns(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      await api.post('/system/integrations', { ...editing, type: 'campaign' });
      setEditing(null);
      fetchCampaigns();
      alert("Popup Notification Synchronized Live.");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  const deleteCampaign = async (id: string) => {
    if (!window.confirm("Remove this notification node?")) return;
    try {
      await api.handleRequest('DELETE', `/system/integrations/${id}`);
      fetchCampaigns();
    } catch (e) {}
  };

  const startNew = () => {
    setEditing({
      title: 'New Important Update',
      bodyText: 'Message for members...',
      imageUrl: '',
      btnText: 'Check Now',
      btnAction: '/user/dashboard',
      targetAudience: 'all',
      specificUserIds: '', 
      validFrom: new Date().toISOString().split('T')[0], 
      validUntil: '', 
      frequency: 'once_daily',
      isActive: true
    });
  };

  return (
    <div className="space-y-8 animate-fade-in pb-24 font-sans">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-50 pb-8 px-2">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Popup <span className="text-indigo-600">Notification.</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] mt-4 flex items-center gap-2 italic">
            <Target size={14} className="text-indigo-500" /> Targeted Community Broadcast Terminal
          </p>
        </div>
        <button onClick={startNew} className="h-14 px-10 bg-slate-950 text-white rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl flex items-center gap-3 active:scale-95 transition-all">
          <Plus size={20} className="text-sky-400" /> New Broadcast
        </button>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        <div className="xl:col-span-8 space-y-6">
           <AnimatePresence mode="wait">
             {editing ? (
               <motion.form 
                  key="editor" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                  onSubmit={handleSave} className="bg-white p-8 md:p-12 rounded-[56px] border border-slate-100 shadow-2xl space-y-10"
               >
                  <div className="flex justify-between items-center">
                     <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">Identity Broadcast Node.</h3>
                     <button type="button" onClick={() => setEditing(null)} className="p-3 bg-slate-50 rounded-full hover:bg-rose-50 hover:text-rose-500 transition-all"><X size={24}/></button>
                  </div>

                  <div className="space-y-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase ml-4 italic">Headline</label>
                           <input required value={editing.title} onChange={e => setEditing({...editing, title: e.target.value})} className="w-full h-14 px-7 bg-slate-50 border border-slate-100 rounded-[28px] font-black text-sm text-slate-900 outline-none focus:bg-white transition-all shadow-inner" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase ml-4 italic">Visual Node URL</label>
                           <input value={editing.imageUrl} onChange={e => setEditing({...editing, imageUrl: e.target.value})} className="w-full h-14 px-7 bg-slate-50 border border-slate-100 rounded-[28px] font-mono text-[9px]" placeholder="https://image-source.com/..." />
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-4 italic">Broadcast Packet</label>
                        <textarea rows={3} value={editing.bodyText} onChange={e => setEditing({...editing, bodyText: e.target.value})} className="w-full p-8 bg-slate-50 border border-slate-100 rounded-[44px] font-medium text-xs text-slate-600 resize-none outline-none focus:bg-white" />
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase ml-4 flex items-center gap-2"><Target size={12}/> Target Audience</label>
                           <select value={editing.targetAudience} onChange={e => setEditing({...editing, targetAudience: e.target.value})} className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-[28px] font-black text-[10px] uppercase outline-none appearance-none cursor-pointer">
                              <option value="all">Global (All Associates)</option>
                              <option value="free_users">Non-Station Hubs</option>
                              <option value="paid_users">Active Partners</option>
                              <option value="specific">Targeted User IDs</option>
                           </select>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase ml-4 flex items-center gap-2"><UserCheck size={12}/> Specific Identity IDs (Comma separated)</label>
                           <input disabled={editing.targetAudience !== 'specific'} value={editing.specificUserIds} onChange={e => setEditing({...editing, specificUserIds: e.target.value})} className="w-full h-14 px-7 bg-slate-50 border border-slate-100 rounded-[28px] font-mono text-[9px] disabled:opacity-30" placeholder="USR-228, USR-901..." />
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase ml-4 flex items-center gap-2"><Clock size={12}/> Start Epoch</label>
                           <input type="date" value={editing.validFrom} onChange={e => setEditing({...editing, validFrom: e.target.value})} className="w-full h-14 px-7 bg-slate-50 border border-slate-100 rounded-[28px] font-black text-xs" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase ml-4 flex items-center gap-2"><Clock size={12}/> End Epoch</label>
                           <input type="date" value={editing.validUntil} onChange={e => setEditing({...editing, validUntil: e.target.value})} className="w-full h-14 px-7 bg-slate-50 border border-slate-100 rounded-[28px] font-black text-xs" />
                        </div>
                     </div>
                  </div>

                  <div className="pt-6">
                     <button type="submit" disabled={saveLoading} className="w-full h-18 bg-slate-950 text-white rounded-[32px] font-black text-[12px] uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4">
                        {saveLoading ? <Loader2 className="animate-spin" size={24}/> : <><BadgeCheck size={24} className="text-sky-400" /> Deploy Notification</>}
                     </button>
                  </div>
               </motion.form>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {campaigns.map(c => (
                    <div key={c.id} className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-sm hover:border-indigo-100 hover:shadow-xl transition-all group relative overflow-hidden">
                       <div className="flex justify-between items-start mb-6">
                          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-[22px] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform"><Bell size={24}/></div>
                          <div className="flex gap-2">
                             <button onClick={() => setEditing(c)} className="w-11 h-11 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-950 hover:text-white transition-all flex items-center justify-center"><RefreshCw size={18}/></button>
                             <button onClick={() => deleteCampaign(c.id)} className="w-11 h-11 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center"><Trash2 size={18}/></button>
                          </div>
                       </div>
                       <h4 className="text-lg font-black text-slate-900 uppercase italic truncate mb-2">{c.title}</h4>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 italic leading-relaxed">Identity: {c.targetAudience?.toUpperCase()}</p>
                       <div className={clsx("inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-colors", c.isActive ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-100")}>
                          <div className={clsx("w-1.5 h-1.5 rounded-full", c.isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-400")} /> {c.isActive ? 'Active Node' : 'Hibernated'}
                       </div>
                    </div>
                  ))}
               </div>
             )}
           </AnimatePresence>
        </div>

        {/* Dynamic Mobile Logic Preview */}
        <div className="xl:col-span-4 sticky top-24 hidden xl:block">
           <div className="w-[310px] h-[640px] bg-slate-950 rounded-[60px] border-[10px] border-slate-900 shadow-[0_60px_120px_-20px_rgba(0,0,0,0.6)] relative overflow-hidden flex flex-col mx-auto">
              <div className="flex-grow bg-slate-100 p-5 pt-16 relative">
                 <AnimatePresence>
                 {editing && showRealPreview && (
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-5">
                      <motion.div initial={{ scale: 0.8, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} className="bg-white w-full rounded-[44px] overflow-hidden shadow-2xl border border-white">
                         {editing.imageUrl && <img src={editing.imageUrl} className="h-40 w-full object-cover" />}
                         <div className="p-8 text-center space-y-4">
                            <h4 className="text-xl font-black text-slate-900 uppercase italic leading-none tracking-tight">{editing.title}</h4>
                            <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase italic">{editing.bodyText}</p>
                            <button className="w-full h-12 bg-slate-900 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest">{editing.btnText || 'Explore Node'}</button>
                         </div>
                      </motion.div>
                   </motion.div>
                 )}
                 </AnimatePresence>
                 <div className="space-y-4 opacity-30">
                    <div className="w-full h-40 bg-white rounded-3xl" />
                    <div className="grid grid-cols-2 gap-3"><div className="h-24 bg-white rounded-3xl" /><div className="h-24 bg-white rounded-3xl" /></div>
                 </div>
              </div>
              <div className="h-14 bg-slate-950 flex items-center justify-center"><div className="w-20 h-1 bg-slate-800 rounded-full" /></div>
           </div>
           <p className="text-[9px] font-black text-slate-400 uppercase italic tracking-widest mt-8 text-center flex items-center justify-center gap-2"><ShieldCheck size={14} className="text-indigo-600"/> Production Probe Preview</p>
        </div>
      </div>
    </div>
  );
};

export default CampaignManager;