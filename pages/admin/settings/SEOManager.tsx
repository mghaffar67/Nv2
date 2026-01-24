
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
      siteTitle: config.seo.metaTitle || '',
      metaDescription: config.seo.metaDescription || '',
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
      await new Promise(r => setTimeout(r, 800));
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-24 px-1 md:px-0">
      
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 px-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase italic italic leading-none">Indexing Core.</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px] mt-2">Metadata Architecture</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="bg-slate-950 text-white h-11 px-8 rounded-2xl font-black text-[9px] uppercase tracking-widest flex items-center gap-2 active:scale-95 shadow-xl disabled:opacity-50"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Save size={14} />}
          Update Meta
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        <div className="lg:col-span-7 space-y-4">
          <section className="bg-white p-6 md:p-8 rounded-[36px] border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
               <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shadow-sm"><Globe2 size={16} /></div>
               <h2 className="text-[9px] font-black uppercase tracking-widest text-slate-800">Search Protocol</h2>
            </div>

            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-2">Public Title</label>
                <input 
                  value={formData.siteTitle}
                  onChange={e => setFormData({...formData, siteTitle: e.target.value})}
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-100 rounded-xl font-black text-xs outline-none focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-2">Meta Description</label>
                <textarea 
                  rows={3}
                  value={formData.metaDescription}
                  onChange={e => setFormData({...formData, metaDescription: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-[10px] text-slate-600 outline-none resize-none focus:bg-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-2">Primary Keywords</label>
                <input 
                  value={formData.keywords}
                  onChange={e => setFormData({...formData, keywords: e.target.value})}
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-100 rounded-xl font-black text-xs outline-none"
                />
              </div>
            </div>

            <div className="p-5 bg-slate-50 rounded-[28px] border border-slate-100 group">
               <p className="text-[7px] font-black text-indigo-400 uppercase tracking-widest mb-3 italic">Google Visualizer</p>
               <h4 className="text-[#1a0dab] text-sm font-medium hover:underline leading-tight mb-0.5">{formData.siteTitle || 'Title Node'}</h4>
               <p className="text-[#006621] text-[10px] mb-1 italic">noorofficial.pk</p>
               <p className="text-[#545454] text-[9px] leading-relaxed line-clamp-2 font-medium">{formData.metaDescription || 'Add description logic.'}</p>
            </div>
          </section>
        </div>

        <div className="lg:col-span-5 space-y-4">
           <section className="bg-slate-950 p-6 md:p-8 rounded-[36px] text-white shadow-xl relative overflow-hidden h-full flex flex-col">
              <div className="absolute top-0 right-0 p-8 opacity-5 scale-125 rotate-12"><Monitor size={80} /></div>
              <div className="relative z-10 flex-grow space-y-6">
                 <div>
                    <h3 className="text-lg font-black italic tracking-tighter uppercase mb-1">Hero Asset.</h3>
                    <p className="text-slate-500 text-[8px] font-black uppercase tracking-widest mb-6">Landing Configuration</p>
                 </div>

                 <div className="space-y-4">
                    <div className="space-y-1.5">
                       <label className="text-[7px] font-black text-slate-500 uppercase tracking-widest ml-2">Headline</label>
                       <input value={formData.heroTitle} onChange={e => setFormData({...formData, heroTitle: e.target.value})} className="w-full h-10 px-4 bg-white/5 border border-white/10 rounded-lg font-black text-xs text-white" />
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="relative group h-32 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center transition-all hover:border-sky-500 overflow-hidden">
                        <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                        {previewFile || formData.heroImage ? (
                          <img src={previewFile || formData.heroImage} className="w-full h-full object-cover opacity-40" />
                        ) : (
                          <ImageIcon size={24} className="text-white/10" />
                        )}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                           <div className="bg-white p-1.5 rounded-lg text-slate-900 mb-1.5"><Upload size={14} /></div>
                           <p className="text-[7px] font-black text-white uppercase">Replace Identity Asset</p>
                        </div>
                      </div>
                    </div>
                 </div>
              </div>
           </section>
        </div>
      </div>
    </div>
  );
};

export default SEOManager;
