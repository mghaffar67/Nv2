
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Eye, RefreshCw, Smartphone, Copy, Check, X, 
  ShieldCheck, Clock, AlertCircle, Image as ImageIcon,
  Wallet, CheckSquare, Activity, ShieldAlert,
  History, BadgeCheck, FileCheck, CheckCircle2,
  TrendingUp, TrendingDown, ChevronRight, User as UserIcon
} from 'lucide-react';
import { clsx } from 'clsx';
import { api } from '../../utils/api';
import { ProofModal } from '../../components/admin/ProofModal';

const RequestsManager = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [filterType, setFilterType] = useState<'all' | 'deposit' | 'withdraw'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedProof, setSelectedProof] = useState<string | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const [deps, withs] = await Promise.all([
        api.get('/admin/finance/deposits'),
        api.get('/admin/finance/withdrawals')
      ]);
      
      const combined = [...(deps || []), ...(withs || [])].sort((a, b) => 
        new Date(b.timestamp || b.date).getTime() - new Date(a.timestamp || a.date).getTime()
      );
      setData(combined);
    } catch (e) {
      console.error("Requests Hub: Backend Sync Failed.");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleAction = async (item: any, action: 'approve' | 'reject') => {
    let reason = "";
    if (action === 'reject') {
      reason = prompt("Rejection ki wajah likhein (e.g. Invalid Screenshot or TRX ID):") || "";
      if (!reason) return;
    }
    setProcessingId(item.id);
    try {
      await api.post('/admin/finance/requests/manage', { 
        transactionId: item.id, 
        userId: item.userId, 
        action,
        type: item.type,
        reason 
      });
      await fetchRequests();
      alert("Request status updated successfully.");
    } catch (e: any) { 
      alert(e.message); 
    } finally {
      setProcessingId(null);
    }
  };

  const filteredData = useMemo(() => {
    return data.filter(i => {
      const matchesTab = activeTab === 'pending' ? i.status === 'pending' : i.status !== 'pending';
      const matchesType = filterType === 'all' || i.type === filterType;
      const matchesSearch = i.userName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          i.trxId?.includes(searchTerm) || 
                          i.userPhone?.includes(searchTerm);
      return matchesTab && matchesType && matchesSearch;
    });
  }, [data, activeTab, filterType, searchTerm]);

  const stats = useMemo(() => {
    const pending = data.filter(i => i.status === 'pending');
    return {
      pendingDeposits: pending.filter(i => i.type === 'deposit').length,
      pendingWithdrawals: pending.filter(i => i.type === 'withdraw').length,
      totalPending: pending.length
    };
  }, [data]);

  return (
    <div className="space-y-6 pb-24 animate-fade-in max-w-7xl mx-auto px-2">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 p-2 pt-4">
        <div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Payments <span className="text-indigo-600">Hub.</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase text-[9px] tracking-[0.3em] mt-4 flex items-center gap-2 italic">
            <ShieldAlert size={14} className="text-indigo-500" /> Verify Deposits & Authorize Payouts
          </p>
        </div>
        <button onClick={fetchRequests} className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 active:rotate-180 transition-all duration-500 shadow-sm hover:text-indigo-600"><RefreshCw size={24}/></button>
      </header>

      {/* TOP ANALYTICS STRIP */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-1">
         <div className="bg-emerald-500 p-6 rounded-[32px] text-white shadow-lg relative overflow-hidden">
            <div className="absolute -top-4 -right-4 opacity-10"><TrendingUp size={80} /></div>
            <p className="text-[8px] font-black uppercase tracking-widest mb-1 italic opacity-80">Pending Deposits</p>
            <h4 className="text-3xl font-black italic">{stats.pendingDeposits} <span className="text-xs not-italic">Items</span></h4>
         </div>
         <div className="bg-rose-500 p-6 rounded-[32px] text-white shadow-lg relative overflow-hidden">
            <div className="absolute -top-4 -right-4 opacity-10"><TrendingDown size={80} /></div>
            <p className="text-[8px] font-black uppercase tracking-widest mb-1 italic opacity-80">Pending Payouts</p>
            <h4 className="text-3xl font-black italic">{stats.pendingWithdrawals} <span className="text-xs not-italic">Items</span></h4>
         </div>
         <div className="bg-slate-900 p-6 rounded-[32px] text-white shadow-lg relative overflow-hidden">
            <div className="absolute -top-4 -right-4 opacity-10"><Activity size={80} /></div>
            <p className="text-[8px] font-black uppercase tracking-widest mb-1 italic opacity-80">Live Queue</p>
            <h4 className="text-3xl font-black italic">{stats.totalPending} <span className="text-xs not-italic">Total</span></h4>
         </div>
      </div>

      {/* TOOLBAR */}
      <div className="bg-white p-3 rounded-[32px] border border-slate-100 shadow-sm space-y-4 mx-1">
         <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex bg-slate-50 p-1.5 rounded-2xl gap-1">
               <button onClick={() => setActiveTab('pending')} className={clsx("px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", activeTab === 'pending' ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:text-slate-900")}>Active Stream</button>
               <button onClick={() => setActiveTab('history')} className={clsx("px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", activeTab === 'history' ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:text-slate-900")}>Old Records</button>
            </div>
            <div className="flex bg-slate-50 p-1.5 rounded-2xl gap-1">
               {['all', 'deposit', 'withdraw'].map((t) => (
                 <button key={t} onClick={() => setFilterType(t as any)} className={clsx("px-5 py-2.5 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all", filterType === t ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400")}>{t.toUpperCase()}</button>
               ))}
            </div>
            <div className="relative flex-grow max-w-md">
               <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
               <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-[11px] outline-none focus:bg-white transition-all shadow-inner" placeholder="Probe identity, mobile or TRX reference..." />
            </div>
         </div>
      </div>

      {/* DATA GRID */}
      <div className="min-h-[400px] px-1">
        {loading ? (
          <div className="py-32 text-center flex flex-col items-center gap-4">
             <RefreshCw className="animate-spin text-indigo-500" size={44}/>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Synchronizing with Registry...</p>
          </div>
        ) : filteredData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
             <AnimatePresence mode="popLayout">
                {filteredData.map(item => (
                  <motion.div layout key={item.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white p-6 rounded-[44px] border border-slate-100 shadow-sm flex flex-col group hover:shadow-2xl hover:border-indigo-100 transition-all">
                     <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                           <div className="w-14 h-14 rounded-2xl bg-slate-950 text-sky-400 flex items-center justify-center font-black italic shadow-xl group-hover:rotate-6 transition-transform">
                              {item.userName?.charAt(0)}
                           </div>
                           <div>
                              <h4 className="text-[12px] font-black text-slate-900 uppercase tracking-tight">{item.userName}</h4>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mt-1"><Smartphone size={10} /> {item.userPhone}</p>
                           </div>
                        </div>
                        <div className={clsx("px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border shadow-inner", item.type === 'deposit' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100")}>{item.type}</div>
                     </div>

                     <div className="space-y-4 mb-8 flex-grow">
                        <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 shadow-inner">
                           <div className="flex justify-between items-center mb-1">
                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic">Voucher Amount</p>
                              <span className="text-[8px] font-black text-indigo-500 uppercase italic">{item.gateway} Node</span>
                           </div>
                           <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic leading-none">Rs {item.amount?.toLocaleString()}</h3>
                        </div>
                        
                        {/* Advanced Info Node */}
                        <div className="grid grid-cols-2 gap-2 px-1">
                           <div className="space-y-1">
                              <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Reference ID</p>
                              <p className="text-[9px] font-bold text-slate-600 truncate">{item.trxId || item.id?.slice(0, 12)}</p>
                           </div>
                           <div className="space-y-1 text-right">
                              <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Wallet Status</p>
                              <p className="text-[9px] font-bold text-emerald-600 uppercase italic">Verified Node</p>
                           </div>
                        </div>
                     </div>

                     {activeTab === 'pending' ? (
                       <div className="flex gap-2 pt-6 border-t border-slate-50">
                          {item.proofImage && (
                             <button onClick={() => setSelectedProof(item.proofImage)} className="h-14 w-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-sm shrink-0 active:scale-95"><ImageIcon size={22}/></button>
                          )}
                          <button onClick={() => handleAction(item, 'approve')} disabled={!!processingId} className="flex-grow h-14 bg-slate-950 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                             <BadgeCheck size={18} className="text-sky-400" /> Authorize
                          </button>
                          <button onClick={() => handleAction(item, 'reject')} disabled={!!processingId} className="h-14 w-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all shadow-sm active:scale-95"><X size={22}/></button>
                       </div>
                     ) : (
                       <div className="pt-6 border-t border-slate-50 flex justify-between items-center px-1">
                          <span className={clsx("text-[10px] font-black uppercase flex items-center gap-2", item.status === 'approved' ? "text-emerald-500" : "text-rose-500")}>
                             {item.status === 'approved' ? <CheckCircle2 size={14}/> : <X size={14}/>} {item.status.toUpperCase()}
                          </span>
                          <p className="text-[9px] font-bold text-slate-300 uppercase italic tracking-widest">{item.date}</p>
                       </div>
                     )}
                  </motion.div>
                ))}
             </AnimatePresence>
          </div>
        ) : (
          <div className="py-40 text-center flex flex-col items-center">
             <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center mb-8 shadow-inner"><CheckCircle2 size={48} className="text-slate-200" /></div>
             <h4 className="text-slate-900 font-black uppercase text-[14px] tracking-widest italic leading-none">Stream Synchronized.</h4>
             <p className="text-slate-400 font-bold uppercase text-[9px] mt-3 tracking-[0.2em] italic">No active requests found in the current buffer.</p>
          </div>
        )}
      </div>
      <ProofModal isOpen={!!selectedProof} onClose={() => setSelectedProof(null)} imageUrl={selectedProof || ''} />
    </div>
  );
};

export default RequestsManager;
