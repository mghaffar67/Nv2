
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  FileText, 
  Clock, 
  ShieldCheck,
  ChevronRight,
  Info,
  // Added missing Zap icon import
  Zap
} from 'lucide-react';
import { pageController } from '../../backend_core/controllers/pageController';

const DynamicPage = () => {
  const { slug } = useParams();
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      try {
        const res = await new Promise<any>((resolve) => {
          pageController.getPage({ params: { slug } }, {
            status: () => ({ json: (data: any) => resolve(data) })
          });
        });
        setPage(res);
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fb]">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-sky-500 rounded-full animate-spin mb-4" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Retrieving Metadata</p>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 bg-[#f8f9fb]">
        <div className="w-20 h-20 bg-slate-100 rounded-[28px] flex items-center justify-center text-slate-300 mb-6">
          <Info size={40} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">404 - Page Missing</h2>
        <p className="text-slate-400 text-sm font-medium mb-8">The requested document does not exist in the current core.</p>
        <Link to="/" className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9fb] min-h-screen pt-12 pb-24 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Navigation */}
        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 font-black text-[10px] uppercase tracking-widest mb-10 transition-all">
          <ArrowLeft size={16} /> Home
        </Link>

        {/* Page Header */}
        <header className="mb-12 md:mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-sky-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-sky-500/20">
              <FileText size={24} />
            </div>
            <div className="h-0.5 flex-grow bg-slate-100" />
            <div className="flex items-center gap-2 text-slate-400 text-[9px] font-black uppercase tracking-widest">
              <Clock size={12} /> Last Sync: Today
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none mb-6">
            {page.title}
          </h1>
          <div className="flex flex-wrap gap-3">
             <div className="px-3 py-1 bg-white border border-slate-100 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-500 shadow-sm flex items-center gap-1.5">
                <ShieldCheck size={12} className="text-green-500" /> Verified Document
             </div>
             <div className="px-3 py-1 bg-white border border-slate-100 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-500 shadow-sm flex items-center gap-1.5">
                Official Noor V3 CMS
             </div>
          </div>
        </header>

        {/* Dynamic Content Rendering */}
        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-slate max-w-none bg-white p-8 md:p-14 rounded-[44px] shadow-sm border border-slate-100 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none rotate-12 scale-150">
             <Zap size={200} fill="currentColor" />
          </div>

          <div 
            className="cms-render text-slate-600 leading-relaxed font-medium relative z-10"
            dangerouslySetInnerHTML={{ __html: page.content }} 
          />

          <style dangerouslySetInnerHTML={{ __html: `
            .cms-render h1 { font-size: 2rem; font-weight: 900; color: #0f172a; margin-bottom: 1.5rem; letter-spacing: -0.05em; text-transform: uppercase; }
            .cms-render h2 { font-size: 1.5rem; font-weight: 800; color: #1e293b; margin-top: 2.5rem; margin-bottom: 1rem; }
            .cms-render h3 { font-size: 1.125rem; font-weight: 800; color: #334155; margin-top: 2rem; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
            .cms-render p { margin-bottom: 1.25rem; }
            .cms-render ul { list-style: disc; padding-left: 1.5rem; margin-bottom: 1.5rem; }
            .cms-render li { margin-bottom: 0.5rem; }
          `}} />
        </motion.article>

        {/* Payout Disclaimer */}
        <div className="mt-12 p-8 bg-indigo-50 rounded-[32px] border border-indigo-100 flex items-start gap-4">
           <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-500 shadow-sm shrink-0">
             <ShieldCheck size={20} />
           </div>
           <div>
              <h4 className="text-xs font-black text-indigo-900 uppercase tracking-widest mb-1">Authenticity Guaranteed</h4>
              <p className="text-[10px] text-indigo-700 font-medium leading-relaxed">
                 All platform policies are governed by the Noor Core Risk Management team. Updates to these terms are logged and timestamped for transparency.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicPage;
