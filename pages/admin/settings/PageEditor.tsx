
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Save, Globe, Zap, Edit3, 
  ShieldCheck, Loader2, CheckCircle2, Layout,
  Monitor, RefreshCw
} from 'lucide-react';
import { api } from '../../../utils/api';
import { clsx } from 'clsx';

const PAGE_CONFIGS: Record<string, { label: string, icon: any, fields: { key: string, label: string, type: 'input' | 'textarea' }[] }> = {
  home: {
    label: 'Landing Hub',
    icon: Globe,
    fields: [
      { key: 'heroTitle', label: 'Primary Heading', type: 'input' },
      { key: 'heroSubtitle', label: 'Sales Description', type: 'textarea' },
      { key: 'planTitle', label: 'Offer Section Title', type: 'input' }
    ]
  },
  about: {
    label: 'Company Intel',
    icon: Layout,
    fields: [
      { key: 'mainTitle', label: 'Intro Heading', type: 'input' },
      { key: 'mission', label: 'Mission Statement', type: 'textarea' }
    ]
  },
  terms: {
    label: 'Legal System',
    icon: ShieldCheck,
    fields: [
      { key: 'termsContent', label: 'Policies & Rules', type: 'textarea' }
    ]
  }
};

const PageEditor = () => {
  const [activePage, setActivePage] = useState('home');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const fetchContent = async (pageKey: string) => {
    setLoading(true);
    try {
      const res = await api.get(`/system/page-content/${pageKey}`);
      setFormData(res.sections || {});
    } catch (e) {
      setFormData({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContent(activePage); }, [activePage]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      await api.post('/system/page-content', { pageKey: activePage, sections: formData });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      alert("Sync node failure.");
    } finally {
      setSaveLoading(false);
    }
  };

  const PageIcon = PAGE_CONFIGS[activePage].icon;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100 w-fit gap-1 mb-6">
         {Object.keys(PAGE_CONFIGS).map(key => (
           <button 
            key={key} onClick={() => setActivePage(key)}
            className={clsx(
              "px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
              activePage === key ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"
            )}
           >
             {key === activePage && <Zap size={10} fill="currentColor" />}
             {PAGE_CONFIGS[key].label}
           </button>
         ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-8">
           <form onSubmit={handleSave} className="bg-white p-8 md:p-12 rounded-[48px] border border-slate-100 shadow-sm space-y-10 relative overflow-hidden">
              <div className="flex justify-between items-center border-b border-slate-50 pb-8 mb-4">
                 <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner"><PageIcon size={28} /></div>
                    <div>
                       <h3 className="text-xl font-black text-slate-900 uppercase italic leading-none">{PAGE_CONFIGS[activePage].label} Content</h3>
                       <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                         <Monitor size={12} className="text-indigo-400" /> Production Asset Synchronizer
                       </p>
                    </div>
                 </div>
                 <button type="submit" disabled={saveLoading} className="h-14 px-8 bg-slate-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-3 active:scale-95 disabled:opacity-50">
                    {saveLoading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} className="text-sky-400" />} Deploy Updates
                 </button>
              </div>

              {loading ? (
                 <div className="py-20 text-center flex flex-col items-center gap-4">
                    <RefreshCw className="animate-spin text-slate-200" size={40} />
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Querying Registry Hub...</p>
                 </div>
              ) : (
                <div className="space-y-8 animate-fade-in">
                   {PAGE_CONFIGS[activePage].fields.map(field => (
                     <div key={field.key} className="space-y-3">
                        <div className="flex justify-between items-center px-4">
                           <label className="text-[9px] font-black text-slate-800 uppercase tracking-widest italic">{field.label}</label>
                           <span className="text-[7px] font-bold text-slate-300 uppercase tracking-widest border border-slate-100 px-2 py-0.5 rounded bg-slate-50">NODE: {field.key}</span>
                        </div>
                        {field.type === 'input' ? (
                          <input 
                            value={formData[field.key] || ''}
                            onChange={e => setFormData({...formData, [field.key]: e.target.value})}
                            className="w-full h-14 px-6 bg-slate-50 border border-slate-200 rounded-[20px] font-bold text-sm outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50/50 transition-all shadow-inner"
                          />
                        ) : (
                          <textarea 
                            rows={6}
                            value={formData[field.key] || ''}
                            onChange={e => setFormData({...formData, [field.key]: e.target.value})}
                            className="w-full p-6 bg-slate-50 border border-slate-200 rounded-[32px] font-medium text-sm text-slate-600 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50/50 transition-all resize-none shadow-inner"
                          />
                        )}
                     </div>
                   ))}
                </div>
              )}
           </form>
        </div>

        <div className="xl:col-span-4">
           <div className="bg-slate-900 p-8 rounded-[44px] text-white shadow-2xl relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12 scale-[2.5]"><FileText size={64}/></div>
              <div className="relative z-10 flex flex-col h-full justify-between gap-12">
                 <div>
                    <h4 className="text-xl font-black italic tracking-tighter uppercase mb-4 leading-none text-sky-400">Content <br/> Integrity Node.</h4>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed italic">Your changes are pushed to the core content registry. Once saved, they update the public interface across all associate terminals instantly.</p>
                 </div>
                 <div className="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
                    <div className="flex items-center gap-3 mb-3">
                       <CheckCircle2 size={16} className="text-emerald-400" />
                       <span className="text-[10px] font-black uppercase tracking-widest">System Sync: Ready</span>
                    </div>
                    <p className="text-[9px] text-slate-500 font-bold uppercase">Last Audit: {new Date().toLocaleTimeString()}</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
      
      <AnimatePresence>
         {success && (
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl z-[100] flex items-center gap-2">
              <CheckCircle2 size={16}/> CMS Nodes Synchronized
           </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
};

export default PageEditor;
