
import React, { useState, useEffect } from 'react';
import { 
  Search, Save, Loader2, CheckCircle2, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useConfig } from '../../../context/ConfigContext';

const SEOManager = () => {
  const { config, updateConfig } = useConfig();
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formData, setFormData] = useState({ siteTitle: '', metaDescription: '', keywords: '' });

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
      updateConfig({ seo: { metaTitle: formData.siteTitle, metaDescription: formData.metaDescription, keywords: formData.keywords } } as any);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200 pb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Search <span className="text-indigo-600">Visibility</span></h2>
          <p className="text-sm text-slate-500 mt-2 flex items-center gap-2">
             <Globe size={16} className="text-indigo-500" /> Control how Google sees your platform
          </p>
        </div>
        <button onClick={handleSave} disabled={loading} className="h-11 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm flex items-center gap-2 shadow-sm transition-colors disabled:opacity-50">
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Save size={18} />} Update Metadata
        </button>
      </div>

      <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 ml-1">Browser Title</label>
            <input 
              value={formData.siteTitle} 
              onChange={e => setFormData({...formData, siteTitle: e.target.value})} 
              className="w-full h-11 px-4 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" 
              placeholder="e.g., Noor Official - Premium Earning Platform"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 ml-1">App Description</label>
            <textarea 
              rows={4} 
              value={formData.metaDescription} 
              onChange={e => setFormData({...formData, metaDescription: e.target.value})} 
              className="w-full p-4 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 outline-none resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" 
              placeholder="A brief description of your platform for search engines..."
            />
          </div>
        </div>

        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
           <div className="flex items-center gap-2 mb-4">
             <Search size={16} className="text-indigo-500" />
             <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Google Search Preview</p>
           </div>
           <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
             <p className="text-[#006621] text-xs mb-1">https://noorofficial.pk</p>
             <h4 className="text-[#1a0dab] text-lg font-medium hover:underline cursor-pointer leading-tight mb-1">{formData.siteTitle || 'Noor Official'}</h4>
             <p className="text-[#545454] text-sm leading-relaxed line-clamp-2">{formData.metaDescription || 'Noor Official is the trusted earning platform in Pakistan.'}</p>
           </div>
        </div>
      </section>

      <AnimatePresence>
        {saveSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0 }} 
            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-lg font-medium text-sm shadow-xl z-[200] flex items-center gap-3 border border-slate-700"
          >
            <CheckCircle2 size={18} className="text-emerald-400" /> Settings Saved
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SEOManager;
