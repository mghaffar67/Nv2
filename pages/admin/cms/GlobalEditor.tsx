import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Save, Globe, Zap, Image as ImageIcon, 
  RefreshCw, Layout, Smartphone, Search, 
  ChevronRight, ArrowRight, Loader2, CheckCircle2,
  Edit3, Eye, UserPlus, ShieldCheck, Upload
} from 'lucide-react';
import { api } from '../../../utils/api';
import { clsx } from 'clsx';

const EDITABLE_PAGES = [
  { id: 'landing_home', label: 'Landing Page', icon: Globe },
  { id: 'auth_login', label: 'Login Screen', icon: Smartphone },
  { id: 'auth_register', label: 'Register Screen', icon: UserPlus },
  { id: 'user_dashboard', label: 'Member Dashboard', icon: Layout }
];

const GlobalEditor = () => {
  const [selectedSlug, setSelectedSlug] = useState(EDITABLE_PAGES[0].id);
  const [sections, setSections] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const fetchContent = async (slug: string) => {
    setLoading(true);
    try {
      const res = await api.get(`/system/site-content/${slug}`);
      setSections(res.sections || {});
    } catch (e) {
      setSections({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContent(selectedSlug); }, [selectedSlug]);

  const handleUpdate = (sectionKey: string, fieldKey: string, value: string) => {
    setSections({
      ...sections,
      [sectionKey]: { ...sections[sectionKey], [fieldKey]: value }
    });
  };

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      await api.post('/system/site-content', { slug: selectedSlug, sections });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert("Deployment failure.");
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-fade-in relative">
      <header className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-black text-[#1F2937] uppercase italic tracking-tighter">GLOBAL CONTENT</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2 italic">
            Master Visual & Text Control Panel
          </p>
        </div>
        <button 
          onClick={handleSave} disabled={saveLoading}
          className="h-14 px-12 bg-[#1F2937] text-white rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl flex items-center gap-3 active:scale-95 transition-all"
        >
          {saveLoading ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} className="text-[#2EC4B6]" />}
          Deploy All Changes
        </button>
      </header>

      <div className="flex bg-[#F7F9FC] p-1.5 rounded-2xl gap-1 w-fit mb-10 overflow-x-auto no-scrollbar max-w-full">
         {EDITABLE_PAGES.map(page => (
           <button 
             key={page.id} onClick={() => setSelectedSlug(page.id)}
             className={clsx(
               "px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shrink-0",
               selectedSlug === page.id ? "bg-white text-indigo-600 shadow-md border border-slate-100" : "text-slate-400"
             )}
           >
             {page.label}
           </button>
         ))}
      </div>

      <div className="space-y-8 pb-10">
         {loading ? (
            <div className="py-24 text-center"><RefreshCw className="animate-spin mx-auto text-slate-200" size={44}/></div>
         ) : Object.keys(sections).map(sectionKey => (
           <div key={sectionKey} className="bg-[#F7F9FC] p-8 rounded-[44px] border border-slate-100 shadow-inner space-y-8">
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm"><Edit3 size={18}/></div>
                 <h3 className="text-xs font-black text-slate-800 uppercase italic tracking-widest">{sectionKey.replace('_', ' ')} Section</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {Object.keys(sections[sectionKey]).map(fieldKey => {
                    const value = sections[sectionKey][fieldKey];
                    const isImage = fieldKey.toLowerCase().includes('img') || fieldKey.toLowerCase().includes('banner');
                    
                    return (
                      <div key={fieldKey} className={clsx("space-y-3", isImage && "md:col-span-2")}>
                         <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2 italic">{fieldKey.replace('_', ' ')}</label>
                         {isImage ? (
                           <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm relative group overflow-hidden h-52 flex flex-col items-center justify-center">
                              {value ? (
                                <img src={value} className="w-full h-full object-cover rounded-2xl" alt="Preview" />
                              ) : (
                                <div className="text-center space-y-3">
                                   <ImageIcon size={40} className="text-slate-200 mx-auto" />
                                   <p className="text-[8px] font-black text-slate-300 uppercase italic">No Visual Data</p>
                                </div>
                              )}
                              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                 <button className="px-8 py-3 bg-white text-slate-900 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center gap-2"><Upload size={14}/> Change Banner</button>
                              </div>
                           </div>
                         ) : (
                           <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                              <input 
                                type="text" value={value} onChange={e => handleUpdate(sectionKey, fieldKey, e.target.value)}
                                className="w-full h-14 px-6 font-bold text-sm text-slate-800 outline-none focus:bg-slate-50 transition-colors"
                              />
                           </div>
                         )}
                      </div>
                    );
                 })}
              </div>
           </div>
         ))}
      </div>

      <AnimatePresence>
        {success && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-[#2EC4B6] text-white px-10 py-5 rounded-[30px] flex items-center gap-4 font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl z-[100] border-4 border-white">
             <CheckCircle2 size={24} /> Registry Synchronized Live
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GlobalEditor;