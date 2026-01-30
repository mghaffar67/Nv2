import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Save, Trash2, Smartphone, Target, 
  RefreshCw, Image as ImageIcon, Zap, 
  MessageSquare, Gift, Bell, CheckCircle2,
  ChevronRight, X, ExternalLink, Globe,
  Loader2, Layout, Monitor, Filter, Settings, Code,
  Eye, EyeOff, BadgeCheck, ShieldCheck, Clock,
  MousePointer2, Palette, Sparkles, AlertTriangle
} from 'lucide-react';
import { api } from '../../../utils/api';
import { clsx } from 'clsx';

const TEMPLATES = {
  MODERN_ANNOUNCEMENT: {
    name: 'General News',
    title: 'Important System Update',
    bodyText: 'We have updated our payout nodes for faster processing. Expect your funds within 2 hours.',
    btnText: 'View Details',
    templateStyle: 'modern_modal',
    animationType: 'zoom_bounce',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800'
  },
  VIP_OFFER: {
    name: 'Sales Offer',
    title: 'Upgrade to Diamond Node',
    bodyText: 'Unlock unlimited daily tasks and 0% withdrawal fees for the next 48 hours only!',
    btnText: 'Get VIP Now',
    templateStyle: 'bottom_sheet',
    animationType: 'slide_up',
    imageUrl: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=800'
  },
  CRITICAL_WARNING: {
    name: 'Critical Alert',
    title: 'Maintenance Advisory',
    bodyText: 'System ledger synchronization is in progress. Some balance updates may be delayed.',
    btnText: 'Understood',
    templateStyle: 'full_screen_offer',
    animationType: 'fade_in',
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800'
  }
};

const UnifiedCampaignManager = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<'popups' | 'scripts'>('popups');

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get('/system/integrations');
      setItems(res || []);
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
    } finally {
      setSaveLoading(false);
    }
  };

  const startNew = (type: 'campaign' | 'script') => {
    setEditing({
      name: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
      type: type,
      isActive: true,
      // Campaign defaults
      templateStyle: 'modern_modal',
      triggerDelay: 2,
      frequency: 'once_daily',
      targetAudience: 'all',
      animationType: 'fade_in',
      content: '',
      title: 'Attention Members!',
      bodyText: 'Your global earning station has new updates.',
      btnText: 'Explore Now',
      // Script defaults
      position: 'head'
    });
  };

  const applyTemplate = (t: any) => {
    setEditing({ ...editing, ...t });
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-24 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2 pt-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Unified <span className="text-indigo-600">Campaigns.</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] mt-3 flex items-center gap-2 italic">
            <Sparkles size={14} className="text-amber-500" /> Integrated Popups & External Code Injections
          </p>
        </div>
        <div className="flex gap-2">
           <button onClick={() => startNew('campaign')} className="h-12 px-6 bg-indigo-600 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-lg flex items-center gap-2 active:scale-95 transition-all"><Zap size={16}/> New Popup</button>
           <button onClick={() => startNew('script')} className="h-12 px-6 bg-slate-900 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-lg flex items-center gap-2 active:scale-95 transition-all"><Code size={16}/> Add Script</button>
        </div>
      </header>

      <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm w-fit gap-1 mx-2">
         <button onClick={() => setActiveMode('popups')} className={clsx("px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", activeMode === 'popups' ? "bg-slate-900 text-white shadow-lg" : "text-slate-400")}>Popups</button>
         <button onClick={() => setActiveMode('scripts')} className={clsx("px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", activeMode === 'scripts' ? "bg-slate-900 text-white shadow-lg" : "text-slate-400")}>Integrations</button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start px-2">
        <div className="xl:col-span-4 space-y-3">
           {loading ? <div className="py-20 text-center"><RefreshCw className="animate-spin mx-auto text-slate-200" size={32}/></div> : 
             items.filter(i => activeMode === 'popups' ? i.type === 'campaign' : i.type === 'script').map(item => (
               <motion.div 
                 key={item.id} onClick={() => setEditing(item)}
                 className={clsx("p-5 bg-white rounded-[32px] border transition-all cursor-pointer group shadow-sm flex items-center justify-between", editing?.id === item.id ? "border-indigo-500 ring-4 ring-indigo-50" : "border-slate-100 hover:border-slate-300")}
               >
                  <div className="flex items-center gap-4">
                     <div className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center", item.isActive ? "bg-indigo-50 text-indigo-600" : "bg-slate-100 text-slate-300")}>
                        {item.type === 'campaign' ? <Bell size={20}/> : <Code size={20}/>}
                     </div>
                     <div>
                        <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-tight truncate max-w-[140px]">{item.name || 'Untitled Node'}</h4>
                        <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">{item.isActive ? 'Active' : 'Suspended'}</p>
                     </div>
                  </div>
                  <ChevronRight size={14} className="text-slate-200 group-hover:text-indigo-400 transition-colors" />
               </motion.div>
             ))
           }
        </div>

        <div className="xl:col-span-8">
           <AnimatePresence mode="wait">
              {editing ? (
                 <motion.form 
                   key="editor" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                   onSubmit={handleSave} className="bg-white p-8 md:p-12 rounded-[56px] border border-slate-100 shadow-2xl space-y-10"
                 >
                    <div className="flex justify-between items-center">
                       <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">Design <span className="text-indigo-600">Terminal.</span></h3>
                       <button type="button" onClick={() => setEditing(null)} className="p-3 bg-slate-50 rounded-full hover:bg-rose-500 hover:text-white transition-all"><X size={24}/></button>
                    </div>

                    {editing.type === 'campaign' && (
                       <div className="space-y-10">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                             {Object.entries(TEMPLATES).map(([key, t]) => (
                                <button key={key} type="button" onClick={() => applyTemplate(t)} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-[8px] uppercase tracking-widest hover:border-indigo-400 transition-all flex flex-col items-center gap-2">
                                   <Palette size={16} className="text-indigo-500" />
                                   {t.name}
                                </button>
                             ))}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-4">Behavioral Logic</label>
                                <div className="space-y-3">
                                   <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                      <span className="text-[9px] font-black uppercase text-slate-500">Frequency</span>
                                      <select value={editing.frequency} onChange={e => setEditing({...editing, frequency: e.target.value})} className="bg-transparent font-black text-[9px] uppercase text-indigo-600 outline-none">
                                         <option value="once_per_session">Per Session</option>
                                         <option value="once_daily">Once Daily</option>
                                         <option value="one_time_ever">Single Ever</option>
                                         <option value="always">Continuous</option>
                                      </select>
                                   </div>
                                   <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                      <span className="text-[9px] font-black uppercase text-slate-500">Animation</span>
                                      <select value={editing.animationType} onChange={e => setEditing({...editing, animationType: e.target.value})} className="bg-transparent font-black text-[9px] uppercase text-indigo-600 outline-none">
                                         <option value="fade_in">Fade In</option>
                                         <option value="slide_up">Slide Up</option>
                                         <option value="zoom_bounce">Zoom Bounce</option>
                                      </select>
                                   </div>
                                </div>
                             </div>

                             <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-4">Target Audience</label>
                                <div className="grid grid-cols-1 gap-2">
                                   {['all', 'free_users', 'vip_users'].map(a => (
                                      <button key={a} type="button" onClick={() => setEditing({...editing, targetAudience: a})} className={clsx("p-4 rounded-2xl border-2 text-[9px] font-black uppercase tracking-widest transition-all", editing.targetAudience === a ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-50 bg-slate-50 text-slate-400")}>
                                         {a.replace('_', ' ')}
                                      </button>
                                   ))}
                                </div>
                             </div>
                          </div>

                          <div className="space-y-6 pt-6 border-t border-slate-50">
                             <input value={editing.title} onChange={e => setEditing({...editing, title: e.target.value})} className="w-full h-16 px-8 bg-slate-50 rounded-[28px] font-black text-xl text-slate-900 outline-none focus:bg-white transition-all shadow-inner" placeholder="Popup Title" />
                             <textarea rows={4} value={editing.bodyText} onChange={e => setEditing({...editing, bodyText: e.target.value})} className="w-full p-8 bg-slate-50 rounded-[36px] font-medium text-xs text-slate-600 resize-none outline-none focus:bg-white shadow-inner" placeholder="Message content..." />
                          </div>
                       </div>
                    )}

                    {editing.type === 'script' && (
                       <div className="space-y-6">
                          <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[32px]">
                             <label className="text-[10px] font-black text-slate-400 uppercase">Injection Position</label>
                             <select value={editing.position} onChange={e => setEditing({...editing, position: e.target.value})} className="bg-transparent font-black text-[10px] uppercase text-indigo-600 outline-none">
                                <option value="head">Header (CSS/Meta)</option>
                                <option value="body_end">Footer (Scripts/Pixels)</option>
                             </select>
                          </div>
                          <textarea rows={12} value={editing.content} onChange={e => setEditing({...editing, content: e.target.value})} className="w-full p-8 bg-slate-950 text-emerald-400 font-mono text-[10px] rounded-[36px] resize-none outline-none border-4 border-slate-900" placeholder="<script>...</script>" />
                       </div>
                    )}

                    <div className="flex gap-4">
                       <button type="submit" disabled={saveLoading} className="flex-1 h-16 bg-slate-950 text-white rounded-[32px] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4">
                          {saveLoading ? <Loader2 className="animate-spin" size={20}/> : <><BadgeCheck size={24} className="text-sky-400"/> Commit to Cluster</>}
                       </button>
                    </div>
                 </motion.form>
              ) : (
                <div className="h-[600px] bg-slate-50 border-4 border-dashed border-white rounded-[64px] flex flex-col items-center justify-center text-center p-12 opacity-40">
                   <Target size={64} className="text-slate-200 mb-6" />
                   <h3 className="text-2xl font-black text-slate-400 uppercase italic">Node Control Offline</h3>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4 max-w-sm">Select an existing campaign node or script from the left registry to start editing visual logic.</p>
                </div>
              )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default UnifiedCampaignManager;