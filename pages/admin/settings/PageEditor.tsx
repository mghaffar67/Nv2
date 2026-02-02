
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
      { key: 'termsContent', label: 'Terms & Conditions (Rich Text)', type: 'rich' },
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
      reader.onloadend = () => handleUpdate(key, reader.result as string);
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
           <button key={key} onClick={() => setActivePage(key)} className={clsx("px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shrink-0", activePage === key ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-600")}>
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
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">CMS Deployment Console</p>
                    </div>
                 </div>
                 <button type="submit" disabled={saveLoading} className="h-14 px-10 bg-slate-950 text-white rounded-[24px] font-black text-[11px] uppercase tracking-widest shadow-2xl flex items-center gap-3 active:scale-95 transition-all disabled:opacity-50">
                    {saveLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save Page
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
                        </div>
                        {field.type === 'input' && <input value={formData[field.key] || ''} onChange={e => handleUpdate(field.key, e.target.value)} className="w-full h-16 px-6 bg-slate-50 border border-slate-200 rounded-[24px] font-black text-lg outline-none focus:bg-white" />}
                        {field.type === 'rich' && <textarea rows={8} value={formData[field.key] || ''} onChange={e => handleUpdate(field.key, e.target.value)} className="w-full p-8 bg-slate-50 border border-slate-200 rounded-[32px] font-medium text-sm text-slate-600 outline-none focus:bg-white resize-none shadow-inner" placeholder="Enter content..." />}
                        {field.type === 'image' && (
                          <div className="relative group">
                             <div className="w-full h-48 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] overflow-hidden flex flex-col items-center justify-center gap-4">
                                {formData[field.key] ? <img src={formData[field.key]} className="w-full h-full object-cover" alt="Asset" /> : <ImageIcon size={40} className="text-slate-200" />}
                                <input type="file" accept="image/*" onChange={e => handleImageUpload(field.key, e)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                             </div>
                             <div className="absolute bottom-4 right-4 bg-slate-900/80 text-white px-5 py-2 rounded-xl text-[9px] font-black uppercase flex items-center gap-2 pointer-events-none transition-all shadow-xl"><Camera size={14} /> Replace Asset</div>
                          </div>
                        )}
                        {field.type === 'toggle' && (
                           <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[28px] border border-slate-100">
                              <span className="text-sm font-black text-slate-900 uppercase italic">Status: {formData[field.key] ? "VISIBLE" : "HIDDEN"}</span>
                              <button type="button" onClick={() => handleUpdate(field.key, !formData[field.key])} className={clsx("w-14 h-7 rounded-full relative flex items-center px-1 transition-all", formData[field.key] ? "bg-indigo-600" : "bg-slate-200")}>
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
        <div className="xl:col-span-4 space-y-6">
           <div className="bg-slate-950 p-8 rounded-[44px] text-white shadow-2xl relative overflow-hidden h-fit">
              <h4 className="text-2xl font-black italic tracking-tighter uppercase mb-4 leading-none text-sky-400">Identity <br/> Node.</h4>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed italic">Changes are pushed live to the production environment.</p>
           </div>
        </div>
      </div>
      <AnimatePresence>{success && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-10 py-4 rounded-full font-black text-[11px] uppercase tracking-widest shadow-2xl z-[100] flex items-center gap-3"><CheckCircle2 size={18}/> Registry Updated</motion.div>}</AnimatePresence>
    </div>
  );
};

export default PageEditor;
