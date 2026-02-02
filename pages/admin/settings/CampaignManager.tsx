
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Save, Trash2, Smartphone, Target, 
  RefreshCw, Image as ImageIcon, Zap, 
  MessageSquare, Gift, Bell, CheckCircle2,
  ChevronRight, X, ExternalLink, Globe,
  // Added Loader2 import
  Loader2
} from 'lucide-react';
import { api } from '../../../utils/api';
import { clsx } from 'clsx';

const CampaignManager = () => {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [saveLoading, setSaveLoading] = useState(false);

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

  const startNew = () => {
    setEditing({
      title: 'Exciting Offer!',
      bodyText: 'Upgrade your earning station today and get 20% extra bonus on every task.',
      imageUrl: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=800',
      btnText: 'Claim Now',
      btnAction: '/user/plans',
      targetAudience: 'all',
      frequency: 'once_daily',
      isActive: true
    });
  };

  return (
    <div className="space-y-8 animate-fade-in pb-24">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-50 pb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Campaign <span className="text-indigo-600">Hub.</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-3 italic flex items-center gap-2">
            <Target size={14} className="text-indigo-500" /> Manage Targeted User Notifications & Offers
          </p>
        </div>
        <button 
          onClick={startNew}
          className="h-14 px-10 bg-slate-950 text-white rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl flex items-center gap-3 active:scale-95 transition-all"
        >
          <Plus size={18} className="text-sky-400" /> New Campaign
        </button>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Editor & List */}
        <div className="xl:col-span-8 space-y-6">
           {editing ? (
             <motion.form 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSave} className="bg-white p-8 md:p-10 rounded-[44px] border border-slate-100 shadow-xl space-y-8"
             >
                <div className="flex justify-between items-center">
                   <h3 className="text-xl font-black text-slate-900 uppercase italic">Campaign Editor</h3>
                   <button type="button" onClick={() => setEditing(null)} className="p-2 bg-slate-50 rounded-full"><X size={18}/></button>
                </div>

                <div className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                         <label className="text-[9px] font-black text-slate-400 uppercase ml-4 tracking-widest">Popup Title</label>
                         <input required value={editing.title} onChange={e => setEditing({...editing, title: e.target.value})} className="w-full h-12 px-6 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none" />
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-[9px] font-black text-slate-400 uppercase ml-4 tracking-widest">Banner Image URL</label>
                         <input value={editing.imageUrl} onChange={e => setEditing({...editing, imageUrl: e.target.value})} className="w-full h-12 px-6 bg-slate-50 border border-slate-100 rounded-2xl font-mono text-[10px]" placeholder="https://..." />
                      </div>
                   </div>

                   <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-4 tracking-widest">Message Body</label>
                      <textarea rows={3} value={editing.bodyText} onChange={e => setEditing({...editing, bodyText: e.target.value})} className="w-full p-6 bg-slate-50 border border-slate-100 rounded-3xl font-medium text-xs resize-none outline-none" />
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                         <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Button Text</label>
                         <input value={editing.btnText} onChange={e => setEditing({...editing, btnText: e.target.value})} className="w-full h-12 px-6 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm" />
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-[9px] font-black text-slate-400 uppercase ml-4 tracking-widest">Button Action (Path)</label>
                         <input value={editing.btnAction} onChange={e => setEditing({...editing, btnAction: e.target.value})} className="w-full h-12 px-6 bg-slate-50 border border-slate-100 rounded-2xl font-mono text-[10px]" placeholder="/user/plans" />
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                         <label className="text-[9px] font-black text-slate-400 uppercase ml-4 tracking-widest">Target Audience</label>
                         <select value={editing.targetAudience} onChange={e => setEditing({...editing, targetAudience: e.target.value})} className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-2xl font-black text-[9px] uppercase outline-none">
                            <option value="all">All Members</option>
                            <option value="free_users">Non-Subscribers Only</option>
                            <option value="paid_users">Active Plan Members Only</option>
                         </select>
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-[9px] font-black text-slate-400 uppercase ml-4 tracking-widest">Display Frequency</label>
                         <select value={editing.frequency} onChange={e => setEditing({...editing, frequency: e.target.value})} className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-2xl font-black text-[9px] uppercase outline-none">
                            <option value="always">Show Every Session</option>
                            <option value="once_daily">Once per Day</option>
                            <option value="once_lifetime">Only Once (Lifetime)</option>
                         </select>
                      </div>
                   </div>
                </div>

                <button type="submit" disabled={saveLoading} className="w-full h-16 bg-slate-950 text-white rounded-[28px] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3">
                   {/* Loader2 is now imported and available */}
                   {saveLoading ? <Loader2 className="animate-spin" size={20}/> : <><Save size={20} className="text-sky-400" /> Save & Launch</>}
                </button>
             </motion.form>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {campaigns.map(c => (
                  <div key={c.id} className="bg-white p-6 rounded-[36px] border border-slate-100 shadow-sm hover:border-indigo-200 transition-all group">
                     <div className="flex justify-between items-start mb-6">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><Bell size={20}/></div>
                        <div className="flex gap-2">
                           <button onClick={() => setEditing(c)} className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-slate-900 hover:text-white transition-all"><RefreshCw size={14}/></button>
                           <button onClick={() => deleteCampaign(c.id)} className="p-2 bg-rose-50 text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={14}/></button>
                        </div>
                     </div>
                     <h4 className="text-sm font-black text-slate-900 uppercase italic truncate mb-1">{c.title}</h4>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 italic">Audience: {c.targetAudience}</p>
                     <div className={clsx("inline-flex items-center gap-2 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border", c.isActive ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-100")}>
                        <div className={clsx("w-1 h-1 rounded-full", c.isActive ? "bg-emerald-500" : "bg-slate-400")} /> {c.isActive ? 'Active' : 'Disabled'}
                     </div>
                  </div>
                ))}
             </div>
           )}
        </div>

        {/* Mobile Preview Pane */}
        <div className="xl:col-span-4 flex flex-col items-center">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Live User Preview</p>
           <div className="w-[300px] h-[600px] bg-slate-900 rounded-[50px] border-[8px] border-slate-800 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-20" /> {/* Notch */}
              <div className="flex-grow bg-slate-100 p-4 pt-12 relative">
                 {/* Mock UI Background */}
                 <div className="w-full h-32 bg-white rounded-2xl mb-4 shadow-sm" />
                 <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="h-20 bg-white rounded-2xl shadow-sm" />
                    <div className="h-20 bg-white rounded-2xl shadow-sm" />
                 </div>
                 
                 {/* The Actual Popup Preview */}
                 {editing && (
                   <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-30 flex items-center justify-center p-4">
                      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full rounded-[32px] overflow-hidden shadow-2xl flex flex-col">
                         {editing.imageUrl && <img src={editing.imageUrl} className="w-full h-32 object-cover" alt="Banner" />}
                         <div className="p-6 text-center space-y-3">
                            <h4 className="text-sm font-black text-slate-900 uppercase italic leading-none">{editing.title}</h4>
                            <p className="text-[9px] font-bold text-slate-500 leading-relaxed">{editing.bodyText}</p>
                            <button className="w-full h-10 bg-indigo-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest">{editing.btnText}</button>
                            <p className="text-[7px] font-black text-slate-300 uppercase tracking-widest cursor-pointer">Dismiss</p>
                         </div>
                      </motion.div>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignManager;
