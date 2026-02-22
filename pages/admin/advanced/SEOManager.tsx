import React, { useState, useEffect } from 'react';
import { Search, Save, Loader2, CheckCircle2, Globe, Activity, ShieldCheck, Info, Monitor, Smartphone, Layout, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useConfig } from '../../../context/ConfigContext';

const SEOManager = () => {
  const { config, updateConfig } = useConfig();
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formData, setFormData] = useState({ 
    siteTitle: config.seo?.metaTitle || '', 
    metaDescription: config.seo?.metaDescription || '', 
    keywords: config.seo?.keywords || '' 
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 800));
      updateConfig({ 
        seo: { 
          metaTitle: formData.siteTitle, 
          metaDescription: formData.metaDescription, 
          keywords: formData.keywords 
        } 
      } as any);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-10 animate-fade-in relative z-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-1">
        <div>
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Search <span className="text-indigo-600">Sync.</span></h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px] md:text-[10px] mt-2 italic flex items-center gap-2">
             <Globe size={14} className="text-indigo-600" /> Google Visibility & Metadata Control
          </p>
        </div>
        <button onClick={handleSave} disabled={loading} className="bg-slate-950 text-white h-14 px-10 rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl flex items-center gap-3 active:scale-95 transition-all disabled:opacity-50">
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} className="text-sky-400" />} 
          Deploy SEO
        </button>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        <div className="xl:col-span-7">
           <section className="bg-white p-8 md:p-12 rounded-[48px] border border-slate-100 shadow-sm space-y-10 relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none rotate-12 scale-150"><Search size={100} /></div>
              
              <div className="space-y-8 relative z-10">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6 italic">Browser Page Title</label>
                    <input 
                      value={formData.siteTitle} 
                      onChange={e => setFormData({...formData, siteTitle: e.target.value})} 
                      className="w-full h-16 px-8 bg-slate-50 border border-slate-200 rounded-[28px] font-black text-base text-slate-900 outline-none focus:ring-8 focus:ring-indigo-50/50 shadow-inner" 
                      placeholder="e.g. Noor Official - #1 Earning Platform in Pakistan"
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6 italic">Search Meta Description</label>
                    <textarea 
                      rows={5} 
                      value={formData.metaDescription} 
                      onChange={e => setFormData({...formData, metaDescription: e.target.value})} 
                      className="w-full p-8 bg-slate-50 border border-slate-200 rounded-[44px] font-bold text-xs text-slate-600 outline-none resize-none focus:ring-8 focus:ring-indigo-50/50 shadow-inner" 
                      placeholder="Enter the description snippet users will see in Google results..."
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6 italic">Indexer Keywords (Comma Separated)</label>
                    <input 
                      value={formData.keywords} 
                      onChange={e => setFormData({...formData, keywords: e.target.value})} 
                      className="w-full h-14 px-8 bg-slate-50 border border-slate-200 rounded-[24px] font-mono text-[10px] text-indigo-500 outline-none shadow-inner" 
                      placeholder="earning app, pakistan, m ghaffar, daily profit..."
                    />
                 </div>
              </div>
           </section>
        </div>

        <div className="xl:col-span-5 space-y-6">
           <div className="bg-slate-900 p-8 md:p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-10">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2 italic"><Smartphone size={18} className="text-sky-400" /> Virtual Probe</h3>
                 <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-[7px] font-black uppercase text-emerald-400 border border-white/5">
                    Live Snippet
                 </div>
              </div>

              <div className="space-y-6">
                 <div className="bg-white rounded-[32px] p-8 shadow-inner border border-white/10">
                    <p className="text-[#1a0dab] text-xl font-black hover:underline cursor-pointer leading-tight mb-2 tracking-tight italic">{formData.siteTitle || 'Noor Official'}</p>
                    <p className="text-[#006621] text-xs mb-3 italic">https://noorofficial.com</p>
                    <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-3 font-medium">
                       {formData.metaDescription || 'The #1 trusted earning platform in Pakistan. Join our community for daily tasks and instant payouts via EasyPaisa & JazzCash.'}
                    </p>
                 </div>
              </div>
              
              <div className="mt-10 p-6 bg-white/5 border border-white/10 rounded-[32px] flex items-start gap-4">
                 <Zap size={24} className="text-amber-400 shrink-0" />
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                   Syncing metadata affects the entire platform's SEO headers. Indexing on major search engines typically takes 24-48 hours post-deployment.
                 </p>
              </div>
           </div>
        </div>
      </div>

      <AnimatePresence>
        {saveSuccess && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-10 py-4 rounded-full font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl z-[100] flex items-center gap-3 border-2 border-white/20">
             <CheckCircle2 size={18} /> Registry Metadata Synchronized
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SEOManager;