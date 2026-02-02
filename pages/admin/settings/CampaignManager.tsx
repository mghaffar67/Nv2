
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Save, Trash2, Smartphone, Target, 
  RefreshCw, Image as ImageIcon, Zap, 
  MessageSquare, Gift, Bell, CheckCircle2,
  ChevronRight, X, ExternalLink, Globe,
  Loader2, Layout, Monitor, Filter, Settings, Code,
  Eye, EyeOff,
  // Added missing icon imports
  BadgeCheck, ShieldCheck
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
  },
  COMMUNITY: {
    title: 'M Ghaffar Official',
    body: 'Join our WhatsApp group for real-time payout screenshots and team support.',
    btn: 'Join Group',
    img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800'
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
      alert("Campaign Deployed to Cluster.");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  const deleteCampaign = async (id: string) => {
    if (!window.confirm("Remove this campaign node permanently?")) return;
    try {
      await api.handleRequest('DELETE', `/system/integrations/${id}`);
      fetchCampaigns();
    } catch (e) {}
  };

  const applyTemplate = (key: keyof typeof TEMPLATES) => {
    const t = TEMPLATES[key];
    setEditing({
      ...editing,
      title: t.title,
      bodyText: t.body,
      btnText: t.btn,
      imageUrl: t.img
    });
  };

  const startNew = () => {
    setEditing({
      title: 'New Announcement',
      bodyText: 'Enter your important message here for all members.',
      imageUrl: '',
      btnText: 'View More',
      btnAction: '/user/dashboard',
      targetAudience: 'all',
      frequency: 'once_daily',
      isActive: true
    });
  };

  return (
    <div className="space-y-8 animate-fade-in pb-24">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-50 pb-8 px-2">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Marketing <span className="text-indigo-600">Hub.</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] mt-4 flex items-center gap-2 italic">
            <Target size={14} className="text-indigo-500" /> Interactive Popups & Targeted Notifications
          </p>
        </div>
        <button 
          onClick={startNew}
          className="h-14 px-10 bg-slate-950 text-white rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl flex items-center gap-3 active:scale-95 transition-all"
        >
          <Plus size={20} className="text-sky-400" /> New Campaign
        </button>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Editor & List Column */}
        <div className="xl:col-span-8 space-y-6">
           <AnimatePresence mode="wait">
             {editing ? (
               <motion.form 
                  key="editor" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                  onSubmit={handleSave} className="bg-white p-8 md:p-12 rounded-[56px] border border-slate-100 shadow-2xl space-y-10"
               >
                  <div className="flex justify-between items-center mb-4">
                     <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Campaign <span className="text-indigo-600">Designer.</span></h3>
                     <button type="button" onClick={() => setEditing(null)} className="p-3 bg-slate-50 rounded-full hover:bg-rose-50 hover:text-rose-500 transition-all"><X size={24}/></button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-10">
                   {Object.keys(TEMPLATES).map(k => (
                     <button key={k} type="button" onClick={() => applyTemplate(k as any)} className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all text-slate-400 italic">Load {k} Template</button>
                   ))}
                </div>

                <div className="space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase ml-4 italic">Campaign Title</label>
                         <input required value={editing.title} onChange={e => setEditing({...editing, title: e.target.value})} className="w-full h-14 px-7 bg-slate-50 border border-slate-100 rounded-[28px] font-black text-sm text-slate-900 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50/50 transition-all shadow-inner" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase ml-4 italic">Media Asset URL</label>
                         <div className="relative">
                            <ImageIcon size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
                            <input value={editing.imageUrl} onChange={e => setEditing({...editing, imageUrl: e.target.value})} className="w-full h-14 pl-14 pr-7 bg-slate-50 border border-slate-100 rounded-[28px] font-mono text-[9px] text-slate-500" placeholder="https://..." />
                         </div>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-4 italic">Message Logic (Body)</label>
                      <textarea rows={4} value={editing.bodyText} onChange={e => setEditing({...editing, bodyText: e.target.value})} className="w-full p-8 bg-slate-50 border border-slate-100 rounded-[44px] font-medium text-xs text-slate-600 resize-none outline-none focus:bg-white transition-all shadow-inner" />
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase ml-4 italic">Action Button Text</label>
                         <input value={editing.btnText} onChange={e => setEditing({...editing, btnText: e.target.value})} className="w-full h-14 px-7 bg-slate-50 border border-slate-100 rounded-[28px] font-bold text-xs" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase ml-4 italic">Redirect Node (Path)</label>
                         <input value={editing.btnAction} onChange={e => setEditing({...editing, btnAction: e.target.value})} className="w-full h-14 px-7 bg-slate-50 border border-slate-100 rounded-[28px] font-mono text-[10px] text-indigo-600" placeholder="/user/plans" />
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase ml-4 italic">Target Filter</label>
                         <select value={editing.targetAudience} onChange={e => setEditing({...editing, targetAudience: e.target.value})} className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-[28px] font-black text-[10px] uppercase outline-none focus:bg-white appearance-none">
                            <option value="all">Global (All Members)</option>
                            <option value="free_users">Unsubscribed Nodes Only</option>
                            <option value="paid_users">Active Earning Stations Only</option>
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase ml-4 italic">Display Frequency</label>
                         <select value={editing.frequency} onChange={e => setEditing({...editing, frequency: e.target.value})} className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-[28px] font-black text-[10px] uppercase outline-none focus:bg-white appearance-none">
                            <option value="always">Continuous Protocol</option>
                            <option value="once_daily">Once per 24h Cycle</option>
                            <option value="once_lifetime">Single Impression</option>
                         </select>
                      </div>
                   </div>
                </div>

                <div className="flex gap-4 pt-6">
                   <button type="submit" disabled={saveLoading} className="flex-1 h-18 bg-slate-950 text-white rounded-[32px] font-black text-[12px] uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-all">
                      {/* BadgeCheck icon used here */}
                      {saveLoading ? <Loader2 className="animate-spin" size={24}/> : <><BadgeCheck size={24} className="text-sky-400" /> Deploy to Public Stream</>}
                   </button>
                </div>
             </motion.form>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {campaigns.map(c => (
                  <div key={c.id} className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-sm hover:border-indigo-100 hover:shadow-xl transition-all group relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-6 opacity-[0.03] rotate-12 scale-150"><Zap size={100} /></div>
                     <div className="flex justify-between items-start mb-8">
                        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-[22px] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform"><Bell size={24}/></div>
                        <div className="flex gap-2">
                           <button onClick={() => setEditing(c)} className="w-11 h-11 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-950 hover:text-white transition-all flex items-center justify-center"><RefreshCw size={18}/></button>
                           <button onClick={() => deleteCampaign(c.id)} className="w-11 h-11 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center"><Trash2 size={18}/></button>
                        </div>
                     </div>
                     <h4 className="text-lg font-black text-slate-900 uppercase italic truncate mb-2">{c.title}</h4>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 italic leading-relaxed">Scope: {c.targetAudience?.replace('_', ' ')} • {c.frequency?.replace('_', ' ')}</p>
                     <div className={clsx("inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-inner transition-colors", c.isActive ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-100")}>
                        <div className={clsx("w-1.5 h-1.5 rounded-full", c.isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-400")} /> {c.isActive ? 'Active Node' : 'Suspended'}
                     </div>
                  </div>
                ))}
                {campaigns.length === 0 && !loading && (
                   <div className="md:col-span-2 py-40 bg-slate-50 border-4 border-dashed border-white rounded-[64px] text-center flex flex-col items-center">
                      <Target size={64} className="text-slate-200 mb-6" />
                      <p className="text-slate-400 font-black uppercase text-[11px] tracking-[0.3em] italic">Marketing Registry is Empty.</p>
                      <button onClick={startNew} className="mt-6 text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:underline">Click to Initialize Node</button>
                   </div>
                )}
             </div>
           )}
           </AnimatePresence>
        </div>

        {/* Live Visual Preview Engine */}
        <div className="xl:col-span-4 flex flex-col items-center sticky top-24">
           <div className="flex items-center justify-between w-full px-8 mb-6">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 italic"><Monitor size={14} /> Viewport Probe</p>
              <button onClick={() => setShowRealPreview(!showRealPreview)} className="text-slate-300 hover:text-indigo-600 transition-colors">
                 {showRealPreview ? <Eye size={20}/> : <EyeOff size={20}/>}
              </button>
           </div>
           
           <div className="w-[310px] h-[640px] bg-slate-950 rounded-[60px] border-[10px] border-slate-900 shadow-[0_60px_120px_-20px_rgba(0,0,0,0.6)] relative overflow-hidden flex flex-col">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-slate-900 rounded-b-3xl z-40" /> {/* Speaker/Sensors */}
              
              <div className="flex-grow bg-slate-100 p-5 pt-16 relative">
                 {/* Mock App Interface */}
                 <div className="w-full h-36 bg-white rounded-3xl mb-4 shadow-sm relative overflow-hidden border border-slate-200/50">
                    <div className="absolute top-4 left-4 w-12 h-2 bg-slate-100 rounded-full" />
                    <div className="absolute bottom-4 left-4 w-24 h-6 bg-slate-50 rounded-xl" />
                 </div>
                 <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="h-24 bg-white rounded-3xl shadow-sm border border-slate-200/50" />
                    <div className="h-24 bg-white rounded-3xl shadow-sm border border-slate-200/50" />
                 </div>
                 <div className="w-full h-12 bg-white rounded-2xl mb-4 shadow-sm border border-slate-200/50" />
                 <div className="w-full h-40 bg-white rounded-3xl shadow-sm border border-slate-200/50" />
                 
                 {/* The Interactive Popup Simulation */}
                 <AnimatePresence>
                 {editing && showRealPreview && (
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-5">
                      <motion.div initial={{ scale: 0.8, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} className="bg-white w-full rounded-[44px] overflow-hidden shadow-2xl flex flex-col border border-white">
                         {editing.imageUrl && (
                            <div className="relative h-40 overflow-hidden">
                               <img src={editing.imageUrl} className="w-full h-full object-cover" alt="Campaign Banner" />
                               <div className="absolute top-4 left-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/10"><Zap size={20} fill="currentColor" className="text-amber-400" /></div>
                            </div>
                         )}
                         <div className="p-8 text-center space-y-5">
                            <div>
                               <h4 className="text-xl font-black text-slate-900 uppercase italic leading-none mb-3 tracking-tighter">{editing.title}</h4>
                               <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase">{editing.bodyText}</p>
                            </div>
                            <button className="w-full h-12 bg-slate-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl">
                               {editing.btnText || 'Explore Node'}
                            </button>
                            <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest cursor-pointer hover:text-slate-500 transition-colors">Dismiss Intelligence</p>
                         </div>
                      </motion.div>
                   </motion.div>
                 )}
                 </AnimatePresence>
              </div>
              
              {/* Home Indicator */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-slate-800/20 rounded-full" />
           </div>
           
           <div className="mt-8 flex items-center gap-4 text-[9px] font-black text-slate-400 uppercase tracking-widest bg-white py-3 px-6 rounded-2xl border border-slate-100 shadow-sm italic">
              {/* ShieldCheck icon used here */}
              <ShieldCheck size={14} className="text-emerald-500" /> Authorized Real-time Sync Engine
           </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignManager;
