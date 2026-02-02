
import React, { useState, useEffect } from 'react';
import { 
  FileEdit, 
  Save, 
  Globe, 
  History, 
  CheckCircle2, 
  ChevronRight,
  Monitor,
  Layout,
  ExternalLink,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { pageController } from '../../../backend_core/controllers/pageController';
import { clsx } from 'clsx';

const CMSEditor = () => {
  const [pages, setPages] = useState<any[]>([]);
  const [selectedSlug, setSelectedSlug] = useState('');
  const [pageData, setPageData] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const fetchSlugs = async () => {
    const res = await new Promise<any>((resolve) => {
      pageController.getAllSlugs({}, {
        status: () => ({ json: (data: any) => resolve(data) })
      });
    });
    setPages(res);
    if (res.length > 0 && !selectedSlug) setSelectedSlug(res[0].slug);
  };

  const fetchPageContent = async (slug: string) => {
    setLoading(true);
    try {
      const res = await new Promise<any>((resolve) => {
        pageController.getPage({ params: { slug } }, {
          status: () => ({ json: (data: any) => resolve(data) })
        });
      });
      setPageData({ title: res.title, content: res.content });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlugs();
  }, []);

  useEffect(() => {
    if (selectedSlug) fetchPageContent(selectedSlug);
  }, [selectedSlug]);

  const handleSave = async () => {
    setLoading(true);
    setSaveStatus(null);
    try {
      await new Promise<any>((resolve) => {
        pageController.updatePage({ 
          body: { slug: selectedSlug, ...pageData } 
        }, {
          status: () => ({ json: (data: any) => resolve(data) })
        });
      });
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-20 animate-fade-in px-1 md:px-0">
      
      <div className="bg-slate-900 p-6 md:p-10 rounded-[32px] md:rounded-[44px] text-white relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 p-10 opacity-5 scale-[2] rotate-12"><Layout size={64} /></div>
         <div className="relative z-10">
            <h2 className="text-xl md:text-2xl font-black mb-1 uppercase tracking-tight flex items-center gap-3">
              <Globe size={24} className="text-sky-400" /> Platform CMS Editor
            </h2>
            <p className="text-slate-400 text-[8px] md:text-xs font-bold uppercase tracking-[0.2em]">Manage legal documents and static pages</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        
        {/* Page Selector */}
        <div className="lg:col-span-3 space-y-4">
           <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-6 flex items-center gap-2">
                 <History size={14} /> Page Registry
              </h3>
              <div className="space-y-2">
                 {pages.map((p) => (
                   <button
                    key={p.slug}
                    onClick={() => setSelectedSlug(p.slug)}
                    className={clsx(
                      "w-full px-4 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-left transition-all border",
                      selectedSlug === p.slug 
                        ? "bg-slate-900 text-white border-slate-900 shadow-lg" 
                        : "bg-white text-slate-500 border-slate-50 hover:bg-slate-50"
                    )}
                   >
                     {p.title}
                   </button>
                 ))}
                 <button className="w-full mt-4 p-3 border-2 border-dashed border-slate-100 text-slate-300 rounded-xl text-[9px] font-black uppercase flex items-center justify-center gap-2 hover:border-sky-200 hover:text-sky-500 transition-all">
                    <Plus size={14} /> Create Custom
                 </button>
              </div>
           </div>

           <a 
            href={`#/pages/${selectedSlug}`} 
            target="_blank" 
            className="flex items-center justify-between p-6 bg-sky-50 rounded-[32px] border border-sky-100 group transition-all"
           >
              <div>
                <p className="text-[10px] font-black text-sky-900 uppercase tracking-widest mb-1">Live Link</p>
                <p className="text-[8px] font-bold text-sky-600 uppercase tracking-tighter truncate max-w-[120px]">/pages/{selectedSlug}</p>
              </div>
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-sky-500 shadow-sm group-hover:scale-110 transition-transform">
                <ExternalLink size={16} />
              </div>
           </a>
        </div>

        {/* Editor Area */}
        <div className="lg:col-span-9 space-y-4 md:space-y-6">
           <div className="bg-white p-6 md:p-10 rounded-[32px] md:rounded-[48px] border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-8 md:mb-10">
                 <h2 className="text-xs md:text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3">
                   <FileEdit size={18} className="text-indigo-500" /> Content Engine
                 </h2>
                 <div className="flex gap-2">
                    <AnimatePresence>
                      {saveStatus === 'success' && (
                        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5 text-green-500 text-[10px] font-black uppercase">
                           <CheckCircle2 size={14} /> Saved
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <button 
                      onClick={handleSave}
                      disabled={loading}
                      className="bg-slate-900 text-white px-6 py-3 rounded-xl md:rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                    >
                      <Save size={16} /> {loading ? 'Syncing...' : 'Push to Production'}
                    </button>
                 </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Display Title</label>
                  <input 
                    type="text" 
                    value={pageData.title}
                    onChange={(e) => setPageData({...pageData, title: e.target.value})}
                    className="w-full p-4 md:p-6 bg-slate-50 border border-slate-100 rounded-2xl md:rounded-3xl font-black text-slate-800 outline-none focus:ring-4 focus:ring-sky-50"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-4 mb-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Document Source (HTML Allowed)</label>
                    <div className="text-[8px] font-bold text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-md">Rich Mode</div>
                  </div>
                  <textarea 
                    rows={16}
                    value={pageData.content}
                    onChange={(e) => setPageData({...pageData, content: e.target.value})}
                    className="w-full p-6 md:p-10 bg-slate-50 border border-slate-100 rounded-[32px] md:rounded-[44px] font-mono text-xs md:text-sm text-slate-600 outline-none focus:ring-4 focus:ring-sky-50 resize-none"
                    placeholder="<h1>Heading</h1> <p>Content...</p>"
                  />
                </div>
              </div>
           </div>

           <div className="bg-amber-50 p-6 md:p-8 rounded-[32px] border border-amber-100 flex items-start gap-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-500 shadow-sm shrink-0">
                <Monitor size={20} />
              </div>
              <p className="text-[9px] md:text-xs text-amber-700 font-medium leading-relaxed">
                 <b>PRO TIP:</b> Use <code>&lt;h1&gt;</code> for big headlines, <code>&lt;h3&gt;</code> for sub-sections, and <code>&lt;p&gt;</code> for standard text. These are styled automatically by the public viewer node.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CMSEditor;
