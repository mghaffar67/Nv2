
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
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useConfig } from '../../../context/ConfigContext';
import { api } from '../../../utils/api';
import { clsx } from 'clsx';

const SEOManager = () => {
  const { config, updateConfig } = useConfig();
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [previewFile, setPreviewFile] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    siteTitle: '',
    metaDescription: '',
    keywords: '',
    heroTitle: '',
    heroSubtitle: '',
    heroImage: ''
  });

  useEffect(() => {
    setFormData({
      siteTitle: config.seo.title || config.seo.metaTitle || '',
      metaDescription: config.seo.description || config.seo.metaDescription || '',
      keywords: config.seo.keywords || '',
      heroTitle: config.appearance.heroTitle || '',
      heroSubtitle: config.appearance.heroSubtitle || '',
      heroImage: config.appearance.heroSlides?.[0]?.image || ''
    });
  }, [config]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreviewFile(base64);
        setFormData(prev => ({ ...prev, heroImage: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.post('/system/seo', formData); 
      
      updateConfig({
        seo: {
          ...config.seo,
          metaTitle: formData.siteTitle,
          metaDescription: formData.metaDescription,
          keywords: formData.keywords
        },
        appearance: {
          ...config.appearance,
          heroTitle: formData.heroTitle,
          heroSubtitle: formData.heroSubtitle
        }
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || "Failed to sync SEO nodes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-24">
      
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 px-2">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Search Core.</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] mt-2">Visibility & Content Control</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="bg-slate-950 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-2xl active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {loading ? 'Syncing Hub...' : 'Deploy Protocol'}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* GOOGLE PREVIEW & SEO */}
        <div className="lg:col-span-7 space-y-6">
          <section className="bg-white p-8 rounded-[44px] border border-slate-100 shadow-sm space-y-6">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-300 flex items-center gap-2">
              <Globe size={18} /> Search Metadata
            </h2>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Site Global Title</label>
                <input 
                  value={formData.siteTitle}
                  onChange={e => setFormData({...formData, siteTitle: e.target.value})}
                  className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl font-black text-sm outline-none focus:ring-4 focus:ring-indigo-50 transition-all"
                  placeholder="Noor Official - Pakistani Earning Node"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Meta Description</label>
                <textarea 
                  rows={3}
                  value={formData.metaDescription}
                  onChange={e => setFormData({...formData, metaDescription: e.target.value})}
                  className="w-full p-6 bg-slate-50 border border-slate-100 rounded-3xl font-bold text-xs text-slate-600 outline-none resize-none focus:ring-4 focus:ring-indigo-50 transition-all"
                  placeholder="The #1 trusted platform for youth earning in Pakistan..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">SEO Keywords (CSV)</label>
                <input 
                  value={formData.keywords}
                  onChange={e => setFormData({...formData, keywords: e.target.value})}
                  className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl font-black text-sm outline-none focus:ring-4 focus:ring-indigo-50 transition-all"
                  placeholder="earning, pkr, pakistan, online work"
                />
              </div>
            </div>

            {/* Google Snippet Preview */}
            <div className="mt-8 p-6 bg-[#fcfdfe] rounded-[32px] border border-slate-100 space-y-1">
               <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-3 italic">Google Node Preview</p>
               <h4 className="text-[#1a0dab] text-lg font-medium hover:underline cursor-pointer leading-tight">{formData.siteTitle || 'Site Title'}</h4>
               <p className="text-[#006621] text-xs mb-1">https://noorofficial.com</p>
               <p className="text-[#545454] text-xs leading-relaxed line-clamp-2">{formData.metaDescription || 'Fill in the description node to see how your site appears to search engines.'}</p>
            </div>
          </section>
        </div>

        {/* HERO CMS */}
        <div className="lg:col-span-5 space-y-6">
           <section className="bg-white p-8 rounded-[44px] border border-slate-100 shadow-sm space-y-6">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-300 flex items-center gap-2">
                <Monitor size={18} /> Hero CMS Engine
              </h2>

              <div className="space-y-4">
                <div className="space-y-1.5">
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Hero Headline</label>
                   <input 
                     value={formData.heroTitle}
                     onChange={e => setFormData({...formData, heroTitle: e.target.value})}
                     className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl font-black text-sm outline-none"
                   />
                </div>

                <div className="space-y-1.5">
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Hero Sub-text</label>
                   <textarea 
                     rows={2}
                     value={formData.heroSubtitle}
                     onChange={e => setFormData({...formData, heroSubtitle: e.target.value})}
                     className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-[11px] text-slate-500 outline-none resize-none"
                   />
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Primary Banner Image</label>
                  <div className="relative group">
                    <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    <div className={clsx(
                      "w-full h-44 border-2 border-dashed rounded-[32px] flex flex-col items-center justify-center gap-3 transition-all",
                      previewFile || formData.heroImage ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200 group-hover:border-indigo-400"
                    )}>
                      {previewFile || formData.heroImage ? (
                        <img src={previewFile || formData.heroImage} className="w-full h-full object-cover rounded-[28px] opacity-50" />
                      ) : (
                        <ImageIcon size={32} className="text-slate-300" />
                      )}
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                         <div className="bg-white p-2.5 rounded-full shadow-lg text-slate-900 mb-2">
                            <Upload size={18} />
                         </div>
                         <p className="text-[8px] font-black text-white uppercase tracking-widest drop-shadow-md">Swap Visual Node</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
           </section>

           <div className="bg-amber-50 p-6 rounded-[32px] border border-amber-100 flex items-start gap-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-500 shadow-sm shrink-0">
                 <Search size={20} />
              </div>
              <p className="text-[9px] text-amber-700 font-bold leading-relaxed uppercase tracking-wider">
                 Hero changes are instant. SEO changes may take up to 72 hours to reflect in live search indices.
              </p>
           </div>
        </div>
      </div>

      <AnimatePresence>
        {saveSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-green-500 text-white px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl flex items-center gap-3 z-[200]"
          >
             <CheckCircle2 size={16} /> SEO Protocols Synchronized
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SEOManager;
