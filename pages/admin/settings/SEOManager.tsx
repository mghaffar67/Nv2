
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
      siteTitle: config.seo.title || '',
      metaDescription: config.seo.description || '',
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
      // Use the new PUT /api/system/seo logic
      // Note: api.post is used here as a generic helper if PUT isn't explicitly defined in utils
      await api.post('/system/seo', formData); 
      
      updateConfig({
        seo: {
          title: formData.siteTitle,
          description: formData.metaDescription,
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
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">SEO Engine.</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Search Optimization & Visibility Control</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="bg-slate-950 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-2xl active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {loading ? 'Syncing...' : 'Deploy SEO Protocols'}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* GOOGLE SEARCH SECTION */}
        <div className="lg:col-span-7 space-y-8">
          <section className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-300 flex items-center gap-2 mb-4">
              <Globe size={18} /> Search Engine Metadata
            </h2>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Browser Tab Title</label>
                <input 
                  value={formData.siteTitle}
                  onChange={e => setFormData({...formData, siteTitle: e.target.value})}
                  className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl font-black text-sm outline-none focus:ring-4 focus:ring-indigo-50 transition-all"
                  placeholder="Noor Official - Best Earning Platform"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Meta Description</label>
                <textarea 
                  rows={3}
                  value={formData.metaDescription}
                  onChange={e => setFormData({...formData, metaDescription: e.target.value})}
                  className="w-full p-6 bg-slate-50 border border-slate-100 rounded-3xl font-bold text-xs text-slate-600 outline-none resize-none focus:ring-4 focus:ring-indigo-50 transition-all"
                  placeholder="Explain your platform for Google snippet..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">SEO Keywords (Comma Separated)</label>
                <input 
                  value={formData.keywords}
                  onChange={e => setFormData({...formData, keywords: e.target.value})}
                  className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl font-black text-sm outline-none focus:ring-4 focus:ring-indigo-50 transition-all"
                  placeholder="earning, pakistan, jazzcash, easypaisa"
                />
              </div>
            </div>

            {/* Google Snippet Preview */}
            <div className="mt-8 p-6 bg-slate-50 rounded-[32px] border border-slate-100 space-y-2">
               <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-3">Live Search Preview</p>
               <h4 className="text-[#1a0dab] text-lg font-medium hover:underline cursor-pointer">{formData.siteTitle || 'Site Title'}</h4>
               <p className="text-[#006621] text-xs">https://noorofficial.com</p>
               <p className="text-[#545454] text-xs leading-relaxed line-clamp-2">{formData.metaDescription || 'Add a meta description to see how it looks on Google.'}</p>
            </div>
          </section>
        </div>

        {/* HERO CONTENT SECTION */}
        <div className="lg:col-span-5 space-y-8">
           <section className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
              <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-300 flex items-center gap-2 mb-4">
                <Monitor size={18} /> Hero Section CMS
              </h2>

              <div className="space-y-5">
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Hero Headline</label>
                   <input 
                     value={formData.heroTitle}
                     onChange={e => setFormData({...formData, heroTitle: e.target.value})}
                     className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl font-black text-sm outline-none"
                   />
                </div>

                <div className="space-y-2">
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Hero Sub-text</label>
                   <textarea 
                     rows={2}
                     value={formData.heroSubtitle}
                     onChange={e => setFormData({...formData, heroSubtitle: e.target.value})}
                     className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-[10px] text-slate-500 outline-none resize-none"
                   />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Hero Banner Image</label>
                  <div className="relative group">
                    <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    <div className={clsx(
                      "w-full h-40 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-3 transition-all",
                      previewFile || formData.heroImage ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200 group-hover:border-indigo-400"
                    )}>
                      {previewFile || formData.heroImage ? (
                        <img src={previewFile || formData.heroImage} className="w-full h-full object-cover rounded-[22px] opacity-40" />
                      ) : (
                        <ImageIcon size={32} className="text-slate-300" />
                      )}
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                         <div className="bg-white p-2 rounded-full shadow-lg text-slate-900 mb-2">
                            <Upload size={16} />
                         </div>
                         <p className="text-[8px] font-black text-white uppercase tracking-widest drop-shadow-md">Upload New Artwork</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
           </section>

           <div className="bg-indigo-50 p-6 rounded-[32px] border border-indigo-100 flex items-start gap-4 shadow-sm">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-500 shadow-sm shrink-0">
                 <Search size={20} />
              </div>
              <div>
                 <h4 className="text-[10px] font-black text-indigo-900 uppercase tracking-widest mb-1 italic">SEO Logic Node</h4>
                 <p className="text-[9px] text-indigo-700 font-medium leading-relaxed">
                    Search engines cache metadata. Changes might take 24-72 hours to reflect on live search results. Hero changes are instant.
                 </p>
              </div>
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
