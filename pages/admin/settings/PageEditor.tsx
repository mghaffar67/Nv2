
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Save, Globe, Zap, Edit3, 
  ShieldCheck, Loader2, CheckCircle2, Layout,
  Monitor, RefreshCw, Eye, Image as ImageIcon, Camera, 
  ChevronRight, ArrowRight, EyeOff
} from 'lucide-react';
import { api } from '../../../utils/api';
import { clsx } from 'clsx';

const PAGE_CONFIGS: Record<string, { label: string, icon: any, fields: { key: string, label: string, type: 'input' | 'rich' | 'image' | 'toggle' }[] }> = {
  home: {
    label: 'Landing Hub',
    icon: Globe,
    fields: [
      { key: 'heroTitle', label: 'Primary Heading', type: 'input' },
      { key: 'heroSubtitle', label: 'Hero Sub-Description', type: 'rich' },
      { key: 'heroImage', label: 'Hero Banner Image', type: 'image' },
      { key: 'showPlans', label: 'Show Plans Section', type: 'toggle' },
      { key: 'isVisible', label: 'Active on Website', type: 'toggle' }
    ]
  },
  about: {
    label: 'Company Info',
    icon: Layout,
    fields: [
      { key: 'mainTitle', label: 'About Heading', type: 'input' },
      { key: 'mission', label: 'Detailed Mission (Rich)', type: 'rich' },
      { key: 'aboutImg', label: 'Branding Image', type: 'image' },
      { key: 'isVisible', label: 'Active on Website', type: 'toggle' }
    ]
  },
  terms: {
    label: 'Legal System',
    icon: ShieldCheck,
    fields: [
      { key: 'termsContent', label: 'Terms & Conditions (Markdown/HTML)', type: 'rich' },
      { key: 'isVisible', label: 'Active on Website', type: 'toggle' }
    ]
  }
};

const PageEditor = () => {
  const [activePage, setActivePage] = useState('home');
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleUpdate = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleUpdate(key, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto px-1">
      
      <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100 w-fit gap-1 mb-8 shadow-sm">
         {Object.keys(PAGE_CONFIGS).map(key => (
           <button 
            key={key} onClick={() => setActivePage(key)}
            className={clsx(
              "px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shrink-0",
              activePage === key ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"
            )}
           >
             {key === activePage && <Zap size={10} fill="currentColor" className="text-sky-400" />}
             {PAGE_CONFIGS[key].label}
           </button>
         ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        <div className="xl:col-span-8">
           <form onSubmit={handleSave} className="bg-white p-8 md:p-12 rounded-[48px] border border-slate-100 shadow-sm space-y-8 relative overflow-hidden">
              <div className="flex justify-between items-center border-b border-slate-50 pb-8">
                 <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner"><PageIcon size={28} /></div>
                    <div>
                       <h3 className="text-xl font-black text-slate-900 uppercase italic leading-none">{PAGE_CONFIGS[activePage].label} Node</h3>
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                         <Monitor size={14} className="text-indigo-400" /> Active CMS Deployment Console
                       </p>
                    </div>
                 </div>
                 <button type="submit" disabled={saveLoading} className="h-14 px-10 bg-slate-950 text-white rounded-[24px] font-black text-[11px] uppercase tracking-widest shadow-2xl flex items-center gap-3 active:scale-95 transition-all disabled:opacity-50">
                    {saveLoading ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} className="text-sky-400" /> Save Page</>}
                 </button>
              </div>

              {loading ? (
                 <div className="py-24 text-center"><RefreshCw className="animate-spin mx-auto text-slate-200" size={44}/></div>
              ) : (
                <div className="space-y-10 animate-fade-in">
                   {PAGE_CONFIGS[activePage].fields.map(field => (
                     <div key={field.key} className="space-y-4">
                        <div className="flex justify-between items-center px-4">
                           <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest italic">{field.label}</label>
                           <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded">NODE: {field.key}</span>
                        </div>

                        {field.type === 'input' && (
                          <input 
                            value={formData[field.key] || ''}
                            onChange={e => handleUpdate(field.key, e.target.value)}
                            className="w-full h-16 px-6 bg-slate-50 border border-slate-200 rounded-[24px] font-black text-lg outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all"
                          />
                        )}

                        {field.type === 'rich' && (
                          <div className="relative group">
                             <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[8px] font-black uppercase border border-indigo-100 shadow-sm z-10">
                                <Zap size={10} fill="currentColor" /> Rich Text Enabled
                             </div>
                             <textarea 
                               rows={8}
                               value={formData[field.key] || ''}
                               onChange={e => handleUpdate(field.key, e.target.value)}
                               className="w-full p-8 bg-slate-50 border border-slate-200 rounded-[32px] font-medium text-sm text-slate-600 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all resize-none shadow-inner"
                               placeholder="<h1>Heading</h1><p>Main text...</p>"
                             />
                          </div>
                        )}

                        {field.type === 'image' && (
                          <div className="relative group">
                             <div className="w-full h-48 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] overflow-hidden flex flex-col items-center justify-center gap-4 transition-all group-hover:border-indigo-300">
                                {formData[field.key] ? (
                                  <img src={formData[field.key]} className="w-full h-full object-cover" alt="Asset" />
                                ) : (
                                  <>
                                    <ImageIcon size={40} className="text-slate-200" />
                                    <span className="text-[10px] font-black uppercase text-slate-300">No Image Node</span>
                                  </>
                                )}
                                <input type="file" accept="image/*" onChange={e => handleImageUpload(field.key, e)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                             </div>
                             <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md text-white px-5 py-2 rounded-xl text-[9px] font-black uppercase flex items-center gap-2 pointer-events-none group-hover:scale-105 transition-all shadow-xl">
                                <Camera size={14} /> Replace Asset
                             </div>
                          </div>
                        )}

                        {field.type === 'toggle' && (
                           <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[28px] border border-slate-100 transition-all">
                              <div className="flex items-center gap-4">
                                 {formData[field.key] ? <Eye size={20} className="text-indigo-600" /> : <EyeOff size={20} className="text-slate-300" />}
                                 <span className="text-sm font-black text-slate-900 uppercase italic">Status: {formData[field.key] ? "VISIBLE" : "HIDDEN"}</span>
                              </div>
                              <button 
                                type="button" 
                                onClick={() => handleUpdate(field.key, !formData[field.key])}
                                className={clsx(
                                  "w-14 h-7 rounded-full relative flex items-center px-1 transition-all",
                                  formData[field.key] ? "bg-indigo-600" : "bg-slate-200"
                                )}
                              >
                                 <motion.div animate={{ x: formData[field.key] ? 28 : 0 }} className="w-5 h-5 bg-white rounded-full shadow-md" />
                              </button>
                           </div>
                        )}
                     </div>
                   ))}
                </div>
              )}
           </form>
        </div>

        {/* GUIDANCE COLUMN */}
        <div className="xl:col-span-4 flex flex-col gap-6">
           <div className="bg-slate-950 p-8 rounded-[44px] text-white shadow-2xl relative overflow-hidden h-fit">
              <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12 scale-[2.5]"><ShieldCheck size={64}/></div>
              <div className="relative z-10 space-y-6">
                 <div>
                    <h4 className="text-2xl font-black italic tracking-tighter uppercase mb-4 leading-none text-sky-400">Identity <br/> Node.</h4>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed italic">Changes are pushed to the live production environment. Ensure markdown is correct for rich text sections.</p>
                 </div>
                 <div className="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
                    <div className="flex items-center gap-3 mb-3 text-emerald-400">
                       <CheckCircle2 size={16} />
                       <span className="text-[10px] font-black uppercase tracking-widest">Protocol Sync Ready</span>
                    </div>
                    <p className="text-[8px] text-slate-500 font-black uppercase italic tracking-widest leading-loose">Validated by Noor Core v3.2 CMS Engine.</p>
                 </div>
              </div>
           </div>

           <a href="/" target="_blank" className="p-8 bg-white border border-slate-100 rounded-[44px] shadow-sm flex items-center justify-between group hover:border-indigo-100 transition-all">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner group-hover:scale-110 transition-transform"><Globe size={24}/></div>
                 <div>
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Public Hub</h5>
                    <p className="text-sm font-black text-slate-900 uppercase">View Live Site</p>
                 </div>
              </div>
              <ArrowRight size={20} className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
           </a>
        </div>
      </div>
      
      <AnimatePresence>
         {success && (
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-10 py-4 rounded-full font-black text-[11px] uppercase tracking-widest shadow-2xl z-[100] flex items-center gap-3 border-2 border-white/20">
              <CheckCircle2 size={18}/> Registry Hub Updated
           </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
};

export default PageEditor;
