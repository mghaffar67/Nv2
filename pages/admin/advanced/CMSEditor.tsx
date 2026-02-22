import React, { useState, useEffect } from 'react';
import { FileEdit, Save, Globe, History, CheckCircle2, Layout, ExternalLink, RefreshCw, X, Loader2, FileText, ShieldCheck, Zap, ChevronRight, Eye, Monitor, Search, Code } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../../utils/api';
import { clsx } from 'clsx';

const CMSEditor = () => {
  const pages = [
    { slug: 'privacy', title: 'Privacy Policy', desc: 'Identity protection rules' },
    { slug: 'terms', title: 'Terms of Service', desc: 'Anti-fraud & Work policy' },
    { slug: 'about', title: 'About Noor V3', desc: 'Platform mission statement' },
    { slug: 'landing_home', title: 'Landing Text', desc: 'Front-facing marketing info' }
  ];
  const [selectedSlug, setSelectedSlug] = useState('privacy');
  const [pageData, setPageData] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const fetchPageContent = async (slug: string) => {
    setLoading(true);
    try {
      // In Noor V3, CMS resides in /system/site-content/:slug
      const res = await api.get(`/system/site-content/${slug}`);
      if (res && res.sections) {
        setPageData({ 
          title: res.sections.title || '', 
          content: res.sections.content || '' 
        });
      } else {
         setPageData({ title: 'New Document', content: '<p>Synchronize your content node...</p>' });
      }
    } catch (e) {
      console.error("CMS load failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSlug) fetchPageContent(selectedSlug);
  }, [selectedSlug]);

  const handleSave = async () => {
    setSaveLoading(true);
    setSaveStatus(null);
    try {
      await api.post('/system/site-content', { 
        slug: selectedSlug, 
        sections: { title: pageData.title, content: pageData.content } 
      });
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err: any) {
      alert("Failed to synchronize content.");
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-fade-in relative z-10">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-1">
         <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase italic tracking-tighter flex items-center gap-3 leading-none">
              <Layout size={24} className="text-indigo-600" /> Platform <span className="text-indigo-600">Copy.</span>
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 italic">Global Site Content & Compliance Registry</p>
         </div>
         <div className="flex gap-3">
            <AnimatePresence>
               {saveStatus === 'success' && (
                 <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-emerald-500 text-[9px] font-black uppercase bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 shadow-sm">
                    <CheckCircle2 size={14} /> Synced to Live
                 </motion.div>
               )}
            </AnimatePresence>
            <button 
               onClick={handleSave} disabled={saveLoading}
               className="bg-slate-950 text-white h-14 px-10 rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl flex items-center gap-3 active:scale-95 transition-all disabled:opacity-50"
            >
               {saveLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} className="text-sky-400" />} 
               Push Content
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
        <div className="xl:col-span-3 space-y-3 px-1">
           <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em] ml-4 mb-4 flex items-center gap-2 italic">Select Registry Node</p>
           {pages.map((p) => (
             <button
              key={p.slug}
              onClick={() => setSelectedSlug(p.slug)}
              className={clsx(
                "w-full p-5 rounded-[32px] transition-all border text-left group flex items-center justify-between",
                selectedSlug === p.slug 
                  ? "bg-white border-indigo-600 shadow-xl ring-4 ring-indigo-50" 
                  : "bg-slate-50 border-slate-100 text-slate-400 hover:bg-white hover:border-slate-300"
              )}
             >
               <div className="overflow-hidden">
                  <h4 className={clsx("font-black text-[11px] uppercase tracking-widest leading-none mb-1.5", selectedSlug === p.slug ? "text-slate-900" : "text-slate-400")}>{p.title}</h4>
                  <p className="text-[7px] font-bold uppercase opacity-40 truncate">{p.desc}</p>
               </div>
               <ChevronRight size={14} className={clsx("transition-transform shrink-0", selectedSlug === p.slug ? "text-indigo-600 translate-x-1" : "opacity-0")} />
             </button>
           ))}

           <div className="pt-6">
              <a 
                href={`#/pages/${selectedSlug}`} target="_blank" 
                className="w-full h-14 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-[22px] font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-600 hover:text-white transition-all active:scale-95 shadow-sm"
              >
                 <Eye size={16} /> View External Link
              </a>
           </div>
        </div>

        <div className="xl:col-span-9">
           <section className="bg-white rounded-[48px] border border-slate-100 shadow-sm p-8 md:p-12 space-y-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none rotate-12 scale-150"><Layout size={100} /></div>
              
              <div className="flex items-center justify-between border-b border-slate-50 pb-8 relative z-10">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-900 text-sky-400 rounded-2xl flex items-center justify-center shadow-xl border border-white/5"><Globe size={24}/></div>
                    <div>
                       <h3 className="text-xl font-black text-slate-900 uppercase italic leading-none mb-1.5">Editor Terminal.</h3>
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Target Path: /pages/{selectedSlug}</p>
                    </div>
                 </div>
              </div>

              {loading ? (
                 <div className="py-24 text-center opacity-30 flex flex-col items-center gap-4">
                    <RefreshCw className="animate-spin text-indigo-600" size={44}/>
                    <p className="text-[10px] font-black uppercase tracking-widest">Querying Registry...</p>
                 </div>
              ) : (
                <div className="space-y-8 relative z-10">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6 italic">Document Headline</label>
                      <input 
                        type="text" value={pageData.title}
                        onChange={(e) => setPageData({...pageData, title: e.target.value})}
                        className="w-full h-16 px-8 bg-slate-50 border border-slate-200 rounded-[28px] font-black text-lg md:text-xl text-slate-900 outline-none focus:ring-8 focus:ring-indigo-50/50 shadow-inner"
                      />
                   </div>

                   <div className="space-y-2">
                      <div className="flex justify-between items-center px-6 mb-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">HTML Source Code</label>
                         <div className="flex items-center gap-2 text-indigo-600 text-[8px] font-black uppercase">
                            <Code size={12} /> Rich Content Allowed
                         </div>
                      </div>
                      <textarea 
                        rows={16} value={pageData.content}
                        onChange={(e) => setPageData({...pageData, content: e.target.value})}
                        className="w-full p-8 bg-slate-900 text-sky-400 font-mono text-[11px] rounded-[44px] border-4 border-slate-950 outline-none focus:ring-8 focus:ring-indigo-50/50 resize-none shadow-2xl"
                      />
                   </div>
                </div>
              )}
           </section>
        </div>
      </div>
    </div>
  );
};

export default CMSEditor;