import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Save, Globe, Zap, Image as ImageIcon, 
  RefreshCw, Layout, Smartphone, Search, 
  ChevronRight, ArrowRight, Loader2, CheckCircle2,
  Edit3, Eye, UserPlus
} from 'lucide-react';
import { api } from '../../../utils/api';
import { clsx } from 'clsx';

const EDITABLE_PAGES = [
  { id: 'landing_home', label: 'Landing Page', icon: Globe },
  { id: 'auth_login', label: 'Login Screen', icon: Smartphone },
  // fix: added missing UserPlus icon import from lucide-react
  { id: 'auth_register', label: 'Registration Screen', icon: UserPlus },
  { id: 'user_dashboard', label: 'Member Dashboard', icon: Layout },
  { id: 'global_layout', label: 'Header & Footer', icon: FileText }
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
      [sectionKey]: {
        ...sections[sectionKey],
        [fieldKey]: value
      }
    });
  };

  const handleImageUpload = (sectionKey: string, fieldKey: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleUpdate(sectionKey, fieldKey, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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
    <div className="space-y-6 animate-fade-in pb-24 max-w-7xl mx-auto px-1.5">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2 pt-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Global <span className="text-indigo-600">Content.</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px] mt-3 italic flex items-center gap-2">
            <Layout size={14} className="text-indigo-500" /> Master Visual & Text Control Panel
          </p>
        </div>
        
        <button 
          onClick={handleSave} disabled={saveLoading}
          className="h-14 px-10 bg-slate-950 text-white rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl flex items-center gap-3 active:scale-95 transition-all"
        >
          {saveLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} className="text-sky-400" />}
          Deploy All Changes
        </button>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Sidebar: Page List */}
        <div className="xl:col-span-3 space-y-2">
           {EDITABLE_PAGES.map(page => (
             <button
               key={page.id}
               onClick={() => setSelectedSlug(page.id)}
               className={clsx(
                 "w-full flex items-center justify-between p-5 rounded-[24px] transition-all group border",
                 selectedSlug === page.id 
                   ? "bg-slate-900 border-slate-900 text-white shadow-xl" 
                   : "bg-white border-slate-100 text-slate-500 hover:bg-slate-50"
               )}
             >
                <div className="flex items-center gap-4">
                  <page.icon size={18} className={clsx(selectedSlug === page.id ? "text-sky-400" : "text-slate-300")} />
                  <span className="font-black text-[9px] uppercase tracking-widest">{page.label}</span>
                </div>
                <ChevronRight size={14} className={clsx("transition-transform", selectedSlug === page.id ? "rotate-90 text-sky-400" : "opacity-0 group-hover:opacity-100")} />
             </button>
           ))}
        </div>

        {/* Main Editor: Dynamic Sections */}
        <div className="xl:col-span-9">
           {loading ? (
             <div className="h-[500px] bg-white rounded-[44px] border border-slate-100 flex flex-col items-center justify-center gap-4">
                <RefreshCw className="animate-spin text-indigo-600" size={40} />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accessing Content Node...</p>
             </div>
           ) : (
             <div className="space-y-6">
                {Object.keys(sections).map(sectionKey => (
                  <motion.div 
                    key={sectionKey} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-8 md:p-10 rounded-[44px] border border-slate-100 shadow-sm"
                  >
                     <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-6">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><Edit3 size={18}/></div>
                        <h3 className="text-sm font-black text-slate-900 uppercase italic tracking-widest">{sectionKey.replace('_', ' ')}</h3>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {Object.keys(sections[sectionKey]).map(fieldKey => {
                          const value = sections[sectionKey][fieldKey];
                          const isImage = fieldKey.toLowerCase().includes('img') || fieldKey.toLowerCase().includes('banner') || fieldKey.toLowerCase().includes('logo');
                          const isLongText = fieldKey.toLowerCase().includes('desc') || fieldKey.toLowerCase().includes('subtext') || fieldKey.toLowerCase().includes('about');

                          return (
                            <div key={fieldKey} className={clsx("space-y-3", (isLongText || isImage) && "md:col-span-2")}>
                               <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">{fieldKey.replace('_', ' ')}</label>
                               
                               {isImage ? (
                                 <div className="relative group">
                                    <div className="w-full h-48 rounded-[32px] bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden transition-all group-hover:border-indigo-300">
                                       {value ? (
                                         <img src={value} className="w-full h-full object-cover" alt="Preview" />
                                       ) : (
                                         <ImageIcon size={32} className="text-slate-200" />
                                       )}
                                       <input type="file" accept="image/*" onChange={(e) => handleImageUpload(sectionKey, fieldKey, e)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                    </div>
                                    <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md text-white px-4 py-2 rounded-xl text-[8px] font-black uppercase flex items-center gap-2 pointer-events-none group-hover:scale-105 transition-all shadow-xl">
                                      <ImageIcon size={12} /> Replace Asset
                                    </div>
                                 </div>
                               ) : isLongText ? (
                                 <textarea 
                                   rows={4} value={value} onChange={e => handleUpdate(sectionKey, fieldKey, e.target.value)}
                                   className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[28px] font-medium text-xs text-slate-600 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50/50 transition-all resize-none shadow-inner"
                                 />
                               ) : (
                                 <input 
                                   type="text" value={value} onChange={e => handleUpdate(sectionKey, fieldKey, e.target.value)}
                                   className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm text-slate-900 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50/50 transition-all shadow-inner"
                                 />
                               )}
                            </div>
                          );
                        })}
                     </div>
                  </motion.div>
                ))}
             </div>
           )}
        </div>
      </div>

      <AnimatePresence>
        {success && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-10 py-4 rounded-full font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl z-[100] flex items-center gap-3">
             <CheckCircle2 size={18} /> CMS Assets Synchronized Successfully
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GlobalEditor;