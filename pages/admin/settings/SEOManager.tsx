
import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Search, 
  Monitor, 
  Save, 
  Image as ImageIcon, 
  Upload, 
  Loader2, 
  CheckCircle2,
  Info,
  ExternalLink,
  Zap,
  Globe2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useConfig } from '../../../context/ConfigContext';
import { clsx } from 'clsx';

const SEOManager = () => {
  const { config, updateConfig } = useConfig();
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [formData, setFormData] = useState({
    siteTitle: '',
    metaDescription: '',
    keywords: ''
  });

  useEffect(() => {
    setFormData({
      siteTitle: config.seo?.metaTitle || '',
      metaDescription: config.seo?.metaDescription || '',
      keywords: config.seo?.keywords || ''
    });
  }, [config]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 600));
      updateConfig({
        seo: {
          metaTitle: formData.siteTitle,
          metaDescription: formData.metaDescription,
          keywords: formData.keywords
        }
      } as any);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-24 px-1 md:px-0">
      
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 px-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Search <span className="text-indigo-600">Visibility.</span></h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px] mt-2">Manage Google Search Metadata</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="bg-slate-950 text-white h-11 px-8 rounded-2xl font-black text-[9px] uppercase tracking-widest flex items-center gap-2 shadow-xl disabled:opacity-50"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Save size={14} />}
          Update SEO
        </button>
      </header>

      <div className="grid grid-cols-1 gap-6">
          <section className="bg-white p-6 md:p-10 rounded-[44px] border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shadow-sm"><Search size={20} /></div>
               <div>
                  <h2 className="text-sm font-black uppercase text-slate-800">SEO Configuration</h2>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Help users find Noor Official on the web</p>
               </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Browser Tab Title</label>
                <input 
                  value={formData.siteTitle}
                  onChange={e => setFormData({...formData, siteTitle: e.target.value})}
                  className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl font-black text-sm outline-none focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Meta Description</label>
                <textarea 
                  rows={4}
                  value={formData.metaDescription}
                  onChange={e => setFormData({...formData, metaDescription: e.target.value})}
                  className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[32px] font-bold text-[11px] text-slate-600 outline-none resize-none focus:bg-white"
                  placeholder="Short summary of your app..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Search Keywords</label>
                <input 
                  value={formData.keywords}
                  onChange={e => setFormData({...formData, keywords: e.target.value})}
                  className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl font-black text-sm outline-none"
                  placeholder="earning app, pakistan, earn daily"
                />
              </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-[36px] border border-slate-100 group">
               <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-4 italic">Search Preview</p>
               <h4 className="text-[#1a0dab] text-lg font-medium hover:underline cursor-pointer leading-tight mb-1">{formData.siteTitle || 'Noor Official V3'}</h4>
               <p className="text-[#006621] text-xs mb-1 italic">https://noorofficial.pk</p>
               <p className="text-[#545454] text-[10px] leading-relaxed line-clamp-2 font-medium">{formData.metaDescription || 'Pakistan\'s leading digital earning platform for youth.'}</p>
            </div>
          </section>
      </div>

      <AnimatePresence>
        {saveSuccess && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-green-500 text-white px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl z-[200]">
             <CheckCircle2 size={16} className="inline mr-2" /> SEO Meta Data Saved
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SEOManager;
