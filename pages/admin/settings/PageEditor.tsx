
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Save, 
  Globe, 
  ChevronRight, 
  Layout, 
  Loader2, 
  CheckCircle2,
  AlertCircle,
  Eye,
  Zap,
  Edit3,
  ShieldCheck
} from 'lucide-react';
import { api } from '../../../utils/api';
import { clsx } from 'clsx';

// Mapped Friendly Labels
const PAGE_CONFIGS: Record<string, { label: string, icon: any, fields: { key: string, label: string, type: 'input' | 'textarea' }[] }> = {
  home: {
    label: 'Landing Page',
    icon: Globe,
    fields: [
      { key: 'heroTitle', label: 'Hero Main Heading', type: 'input' },
      { key: 'heroSubtitle', label: 'Hero Sub-text / Description', type: 'textarea' },
      { key: 'planTitle', label: 'Plan Section Title', type: 'input' },
      { key: 'ctaText', label: 'Landing Button Text', type: 'input' }
    ]
  },
  about: {
    label: 'About System',
    icon: Layout,
    fields: [
      { key: 'mainTitle', label: 'About Page Heading', type: 'input' },
      { key: 'mission', label: 'Our Mission Node', type: 'textarea' },
      { key: 'history', label: 'Company Background', type: 'textarea' }
    ]
  },
  terms: {
    label: 'Legal Terms',
    icon: ShieldCheck,
    fields: [
      { key: 'termsContent', label: 'Platform Policy Content', type: 'textarea' }
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

  useEffect(() => {
    fetchContent(activePage);
  }, [activePage]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      await api.post('/system/page-content', { pageKey: activePage, sections: formData });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      alert("Deployment failure node.");
    } finally {
      setSaveLoading(false);
    }
  };

  const PageIcon = PAGE_CONFIGS[activePage].icon;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex bg-white p-1 rounded-[24px] border border-slate-100 shadow-sm w-fit overflow-hidden gap-1 mb-4">
         {Object.keys(PAGE_CONFIGS).map(key => (
           <button 
            key={key}
            onClick={() => setActivePage(key)}
            className={clsx(
              "px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
              activePage === key ? "bg-slate-950 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"
            )}
           >
             {key === activePage && <Zap size={10} fill="currentColor" />}
             {PAGE_CONFIGS[key].label}
           </button>
         ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-8">
           <form onSubmit={handleSave} className="bg-white p-6 md:p-10 rounded-[44px] border border-slate-100 shadow-sm space-y-8 relative">
              <AnimatePresence mode="wait">
                 {loading ? (
                   <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-96 flex flex-col items-center justify-center gap-4">
                      <Loader2 className="animate-spin text-indigo-500" size={40} />
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 italic">Reading Page Node...</p>
                   </motion.div>
                 ) : (
                   <motion.div key="form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                      <div className="flex items-center gap-4 border-b border-slate-50 pb-6 mb-8">
                         <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 shadow-inner">
                            <PageIcon size={24} />
                         </div>
                         <div>
                            <h3 className="text-lg font-black text-slate-900 uppercase italic leading-none">{PAGE_CONFIGS[activePage].label} Content</h3>
                            <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mt-1">Live Endpoint Modification Node</p>
                         </div>
                      </div>

                      {PAGE_CONFIGS[activePage].fields.map(field => (
                        <div key={field.key} className="space-y-3">
                           <div className="flex justify-between items-center px-4">
                              <label className="text-[9px] font-black text-slate-900 uppercase tracking-widest italic">{field.label}</label>
                              <span className="text-[6px] font-bold text-slate-300 uppercase tracking-widest border px-1.5 rounded bg-slate-50">{field.key}</span>
                           </div>
                           {field.type === 'input' ? (
                             <input 
                               value={formData[field.key] || ''}
                               onChange={e => setFormData({...formData, [field.key]: e.target.value})}
                               className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50/50 transition-all shadow-inner"
                             />
                           ) : (
                             <textarea 
                               rows={6}
                               value={formData[field.key] || ''}
                               onChange={e => setFormData({...formData, [field.key]: e.target.value})}
                               className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[32px] font-medium text-sm text-slate-600 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50/50 transition-all resize-none shadow-inner"
                             />
                           )}
                        </div>
                      ))}
                   </motion.div>
                 )}
              </AnimatePresence>

              <button 
                type="submit"
                disabled={saveLoading}
                className="w-full h-14 bg-slate-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
              >
                {saveLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} className="text-sky-400" />} 
                Update Live Content
              </button>
           </form>
        </div>

        <div className="xl:col-span-4 space-y-6">
           <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 scale-[2.5]"><Edit3 size={64}/></div>
              <h3 className="text-xl font-black italic tracking-tighter uppercase mb-4 leading-none text-sky-400">Advanced <br/> Content Hub.</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed mb-8 italic">Text updates are stored in the Page Registry Hub and injected dynamically into the Website Core.</p>
              <ShieldCheck size={32} className="text-emerald-500" />
           </div>
        </div>
      </div>
    </div>
  );
};

export default PageEditor;
