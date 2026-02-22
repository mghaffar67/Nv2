import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Save, Trash2, Target, 
  RefreshCw, Image as ImageIcon, Zap, 
  Bell, CheckCircle2, X, Globe,
  Loader2, Monitor, Filter, Settings,
  Eye, EyeOff, BadgeCheck, ShieldCheck,
  Smartphone, Activity, Box, Sparkles,
  MousePointer2, Palette, AlertTriangle
} from 'lucide-react';
import { api } from '../../../utils/api';
import { clsx } from 'clsx';

const TEMPLATES = {
  MODERN_ANNOUNCEMENT: {
    name: 'General News',
    title: 'Important Update',
    bodyText: 'Our payment systems have been updated for faster processing. Expect your funds soon.',
    btnText: 'View Details',
    templateStyle: 'modern_modal',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800'
  },
  VIP_OFFER: {
    name: 'Special Offer',
    title: 'Plan Upgrade Bonus',
    bodyText: 'Upgrade your station today and get an extra 15% bonus in your wallet instantly.',
    btnText: 'Upgrade Now',
    templateStyle: 'bottom_sheet',
    imageUrl: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=800'
  },
  COMMUNITY: {
    name: 'Community Link',
    title: 'Official WhatsApp',
    bodyText: 'Join our official group for daily payment proof and support from our team.',
    btnText: 'Join Group',
    templateStyle: 'full_screen_offer',
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800'
  }
};

const CampaignManager = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get('/system/integrations');
      setItems(res.filter((i: any) => i.type === 'campaign' || i.type === 'popup') || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      await api.post('/system/integrations', { ...editing, type: 'campaign' });
      setEditing(null);
      fetchItems();
      alert("Popup successfully deployed.");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  const startNew = () => {
    setEditing({
      name: `New Notification`,
      type: 'campaign',
      isActive: true,
      templateStyle: 'modern_modal',
      frequency: 'once_daily',
      targetAudience: 'all',
      title: 'Attention Members!',
      bodyText: 'A new update is available for your account.',
      btnText: 'View Now',
      btnAction: '/user/dashboard'
    });
  };

  const applyTemplate = (t: any) => {
    setEditing({ ...editing, ...t });
  };

  const deleteItem = async (id: string) => {
    if (!window.confirm("Delete this notification permanently?")) return;
    try {
      await api.handleRequest('DELETE', `/system/integrations/${id}`);
      fetchItems();
    } catch (e) {}
  };

  return (
    <div className="space-y-10 animate-fade-in relative z-10">
      <header className="px-1 pt-2 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
           <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase italic tracking-tighter flex items-center gap-3 leading-none">
             <Target size={28} className="text-indigo-600" /> Popups & Alerts.
           </h1>
           <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px] md:text-[10px] mt-2 italic">Manage Marketing Notifications & Important Messages</p>
        </div>
        <button 
           onClick={startNew}
           className="h-14 px-10 bg-slate-950 text-white rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl flex items-center gap-3 active:scale-95 transition-all"
        >
           <Plus size={20} className="text-sky-400" /> New Notification
        </button>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
        {/* Selection List */}
        <div className="xl:col-span-3 space-y-3">
           <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em] ml-4 mb-4 flex items-center gap-2">Active Notifications</p>
           {loading ? <div className="py-20 text-center opacity-30"><RefreshCw className="animate-spin mx-auto" size={32}/></div> : 
             items.map(item => (
               <motion.div 
                 key={item.id} onClick={() => setEditing(item)}
                 className={clsx(
                    "p-5 bg-white rounded-[32px] border transition-all cursor-pointer group flex items-center justify-between", 
                    editing?.id === item.id ? "border-indigo-600 shadow-xl ring-4 ring-indigo-50" : "border-slate-100 hover:border-slate-300"
                 )}
               >
                  <div className="flex items-center gap-4">
                     <div className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg", item.isActive ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-300")}>
                        <Bell size={20}/>
                     </div>
                     <div>
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-tight truncate max-w-[120px] leading-none mb-1">{item.name || item.title || 'Untitled'}</h4>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter italic">{item.isActive ? 'Active' : 'Off'}</p>
                     </div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }} className="text-rose-400 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={16}/></button>
               </motion.div>
             ))
           }
        </div>

        {/* Editor Area */}
        <div className="xl:col-span-5">
           <AnimatePresence mode="wait">
              {editing ? (
                 <motion.form 
                   key="editor" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                   onSubmit={handleSave} className="bg-slate-950 p-1.5 rounded-[48px] shadow-2xl relative overflow-hidden"
                 >
                    <div className="bg-white rounded-[44px] p-8 space-y-8">
                        <div className="flex justify-between items-center border-b border-slate-50 pb-6">
                           <h3 className="text-sm font-black text-slate-900 uppercase italic tracking-widest">Notification Settings</h3>
                           <button type="button" onClick={() => setEditing(null)} className="p-2 hover:bg-slate-50 rounded-full"><X size={20}/></button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                           {Object.entries(TEMPLATES).map(([key, t]) => (
                              <button key={key} type="button" onClick={() => applyTemplate(t)} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-[7px] uppercase tracking-widest hover:border-indigo-400 transition-all text-slate-400 hover:text-indigo-600">
                                 <Palette size={14} className="mb-1 mx-auto" /> {t.name}
                              </button>
                           ))}
                        </div>

                        <div className="space-y-5">
                           <div className="space-y-2">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Main Heading</label>
                              <input value={editing.title} onChange={e => setEditing({...editing, title: e.target.value})} className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl font-black text-sm outline-none focus:bg-white" placeholder="Heading Text" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Settings</label>
                              <div className="grid grid-cols-2 gap-4">
                                 <select value={editing.frequency} onChange={e => setEditing({...editing, frequency: e.target.value})} className="h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl font-black text-[9px] uppercase outline-none">
                                    <option value="always">Always Show</option>
                                    <option value="once_daily">Once Daily</option>
                                    <option value="one_time_ever">Only Once</option>
                                 </select>
                                 <select value={editing.targetAudience} onChange={e => setEditing({...editing, targetAudience: e.target.value})} className="h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl font-black text-[9px] uppercase outline-none">
                                    <option value="all">All Users</option>
                                    <option value="free_users">Free Members</option>
                                    <option value="vip_users">Plan Holders</option>
                                 </select>
                              </div>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Message Body</label>
                              <textarea rows={4} value={editing.bodyText} onChange={e => setEditing({...editing, bodyText: e.target.value})} className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[32px] font-bold text-xs text-slate-600 resize-none outline-none focus:bg-white shadow-inner" placeholder="Message content..." />
                           </div>
                        </div>

                        <button type="submit" disabled={saveLoading} className="w-full h-16 bg-slate-950 text-white rounded-[24px] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3">
                           {saveLoading ? <Loader2 className="animate-spin" /> : <><CheckCircle2 size={20} className="text-sky-400"/> Save & Deploy</>}
                        </button>
                    </div>
                 </motion.form>
              ) : (
                <div className="h-[500px] border-4 border-dashed border-slate-100 rounded-[64px] flex flex-col items-center justify-center text-center p-12 opacity-40">
                   <div className="w-24 h-24 bg-white rounded-[40px] flex items-center justify-center shadow-inner mb-6"><Bell size={48} className="text-slate-200" /></div>
                   <h3 className="text-2xl font-black text-slate-400 uppercase italic">Editor Idle</h3>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4 max-w-[280px]">Select a notification or template to start editing.</p>
                </div>
              )}
           </AnimatePresence>
        </div>

        {/* Preview Area */}
        <div className="xl:col-span-4 sticky top-24 hidden xl:block">
           <div className="flex items-center justify-between w-full px-8 mb-6">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 italic"><Monitor size={14} /> Phone Preview</p>
              <button onClick={() => setShowPreview(!showPreview)} className="text-slate-300 hover:text-indigo-600 transition-colors">
                 {showPreview ? <Eye size={20}/> : <EyeOff size={20}/>}
              </button>
           </div>
           
           <div className="w-[310px] h-[620px] bg-slate-950 rounded-[60px] border-[10px] border-slate-900 shadow-[0_60px_120px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-slate-900 rounded-b-3xl z-40" />
              <div className="flex-grow bg-slate-100 p-5 pt-16 relative">
                 <div className="w-full h-32 bg-white rounded-3xl mb-4 shadow-sm border border-slate-200/50" />
                 
                 <AnimatePresence>
                 {editing && showPreview && (
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-5">
                      <motion.div initial={{ scale: 0.8, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} className="bg-white w-full rounded-[44px] overflow-hidden shadow-2xl flex flex-col border border-white">
                         {editing.imageUrl && <div className="h-40 overflow-hidden"><img src={editing.imageUrl} className="w-full h-full object-cover" /></div>}
                         <div className="p-8 text-center">
                            <h4 className="text-xl font-black text-slate-900 uppercase italic mb-3 tracking-tighter leading-none">{editing.title}</h4>
                            <p className="text-[9px] font-bold text-slate-400 leading-relaxed uppercase mb-6">{editing.bodyText}</p>
                            <button className="w-full h-12 bg-slate-950 text-white rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] shadow-xl">{editing.btnText}</button>
                         </div>
                      </motion.div>
                   </motion.div>
                 )}
                 </AnimatePresence>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignManager;