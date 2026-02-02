
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileCheck, Clock, X, Check, Eye, Search, 
  Filter, RefreshCw, FileText, ShieldCheck
} from 'lucide-react';
import { api } from '../../../utils/api';
import { clsx } from 'clsx';
import { ProofModal } from '../../../components/admin/ProofModal';

const AssignmentManager = () => {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProof, setSelectedProof] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/work/all-submissions');
      setSubmissions(res || []);
    } catch (e) { } finally { setLoading(false); }
  };

  useEffect(() => { fetchSubmissions(); }, []);

  const handleReview = async (sub: any, status: 'approved' | 'rejected') => {
    let reason = "";
    if (status === 'rejected') {
      reason = prompt("Rejection ki wajah likhein (e.g. 'Low Quality screenshot'):") || "";
      if (!reason) return;
    }

    setActionLoading(sub.id);
    try {
      await api.post('/work/review-submission', {
        userId: sub.userId,
        submissionId: sub.id,
        status,
        reward: sub.reward,
        reason
      });
      fetchSubmissions();
    } catch (err: any) {
      alert("Verification Node failure.");
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = useMemo(() => {
    return submissions.filter(s => {
      const matchesFilter = s.status === filter;
      const matchesSearch = s.userName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.taskTitle?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [submissions, filter, searchTerm]);

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Audit <span className="text-[#4A6CF7]">Logs.</span></h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
            <FileCheck size={14} className="text-[#4A6CF7]" /> Verify Submission Packets & Authenticate Yields
          </p>
        </div>
        <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
            <input 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-white border border-slate-100 rounded-3xl font-bold text-[11px] outline-none shadow-sm" 
              placeholder="Search by associate..." 
            />
         </div>
      </header>

      <div className="flex bg-slate-50 p-1.5 rounded-[28px] gap-1.5 w-fit">
        {(['pending', 'approved', 'rejected'] as const).map(f => (
          <button 
            key={f} onClick={() => setFilter(f)}
            className={clsx(
              "px-8 py-3 rounded-[22px] text-[9px] font-black uppercase tracking-widest transition-all",
              filter === f ? "bg-white text-slate-900 shadow-md border border-slate-200" : "text-slate-400"
            )}
          >
            {f} Hub
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="py-24 text-center"><RefreshCw className="animate-spin mx-auto text-slate-200" size={40}/></div>
        ) : filtered.length > 0 ? filtered.map(sub => (
          <motion.div layout key={sub.id} className="bg-white p-6 rounded-[44px] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-indigo-100 transition-all">
             <div className="flex items-center gap-6 overflow-hidden">
                <div className="w-16 h-16 rounded-[24px] bg-slate-950 text-sky-400 flex items-center justify-center font-black italic shadow-lg text-2xl shrink-0">{sub.userName?.charAt(0)}</div>
                <div className="overflow-hidden">
                   <h4 className="font-black text-slate-900 text-base uppercase truncate mb-1.5">{sub.userName}</h4>
                   <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">{sub.taskTitle}</span>
                      <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{sub.timestamp}</span>
                   </div>
                </div>
             </div>

             <div className="flex items-center gap-10 md:border-l md:pl-10 border-slate-100 shrink-0">
                <div className="text-center">
                   <p className="text-[8px] font-black text-slate-300 uppercase mb-1">Packet Yield</p>
                   <p className="text-xl font-black text-emerald-600 italic">Rs {sub.reward}</p>
                </div>
                <button 
                  onClick={() => setSelectedProof(sub.userAnswer)}
                  className="h-14 px-8 bg-slate-50 border border-slate-100 rounded-3xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center gap-3 font-black text-[10px] uppercase tracking-widest shadow-sm"
                >
                   <Eye size={18}/> View Proof
                </button>
             </div>

             {sub.status === 'pending' && (
                <div className="flex gap-2.5 shrink-0">
                   <button 
                     disabled={!!actionLoading}
                     onClick={() => handleReview(sub, 'approved')}
                     className="h-14 px-10 bg-[#4A6CF7] text-white rounded-[24px] font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-3 active:scale-95 transition-all disabled:opacity-50"
                   >
                      <Check size={20} /> Authorize
                   </button>
                   <button 
                     disabled={!!actionLoading}
                     onClick={() => handleReview(sub, 'rejected')}
                     className="h-14 w-14 bg-rose-50 text-rose-500 border border-rose-100 rounded-[24px] flex items-center justify-center active:scale-95 transition-all shadow-sm"
                   >
                      <X size={24} />
                   </button>
                </div>
             )}
          </motion.div>
        )) : (
          <div className="py-40 text-center bg-white rounded-[64px] border-4 border-dashed border-slate-50 flex flex-col items-center gap-6 opacity-30">
             <FileText size={80} className="text-slate-100" />
             <p className="text-xs font-black uppercase tracking-[0.4em] italic">Registry Empty: No {filter} Packets</p>
          </div>
        )}
      </div>

      <ProofModal isOpen={!!selectedProof} onClose={() => setSelectedProof(null)} imageUrl={selectedProof || ''} />
    </div>
  );
};

export default AssignmentManager;
