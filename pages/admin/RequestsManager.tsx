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
      console.error("Requests Hub: Sync Failed.");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleAction = async (item: any, action: 'approve' | 'reject') => {
    let reason = "";
    if (action === 'reject') {
      reason = prompt("Rejection ki wajah (Mandatory):") || "";
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
      deposits: pending.filter(i => i.type === 'deposit').length,
      payouts: pending.filter(i => i.type === 'withdraw').length,
      total: pending.length
    };
  }, [data]);

  return (
    <div className="space-y-8 pb-24 animate-fade-in max-w-7xl mx-auto px-4 bg-[#F7F9FC] min-h-screen pt-4">
      <header className="flex justify-between items-center mb-6 px-2">
        <div>
          <h1 className="text-3xl font-black text-[#1F2937] tracking-tight uppercase italic leading-none">REQUESTS HUB</h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] mt-2 tracking-widest italic">Verify Deposits & Authorize Payouts</p>
        </div>
        <button onClick={fetchRequests} className="p-3 bg-white border border-slate-200 rounded-2xl shadow-sm active:rotate-180 transition-all text-indigo-600">
           <RefreshCw size={20} className={clsx(loading && "animate-spin")} />
        </button>
      </header>

      {/* 1. STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <StatCard label="Pending Deposits" count={stats.deposits} color="bg-[#2EC4B6]" icon={TrendingUp} />
         <StatCard label="Pending Payouts" count={stats.payouts} color="bg-[#EF4444]" icon={TrendingDown} />
         <StatCard label="Total in Queue" count={stats.total} color="bg-[#1F2937]" icon={Activity} />
      </div>

      {/* 2. FILTER CONSOLE */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="flex bg-[#F7F9FC] p-1.5 rounded-2xl gap-1">
            <button onClick={() => setActiveTab('pending')} className={clsx("px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", activeTab === 'pending' ? "bg-slate-900 text-white shadow-lg" : "text-slate-400")}>Pending</button>
            <button onClick={() => setActiveTab('history')} className={clsx("px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", activeTab === 'history' ? "bg-slate-900 text-white shadow-lg" : "text-slate-400")}>History</button>
         </div>
         
         <div className="flex bg-[#F7F9FC] p-1.5 rounded-2xl gap-1">
            {['all', 'deposit', 'withdraw'].map(t => (
               <button key={t} onClick={() => setFilterType(t as any)} className={clsx("px-6 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all", filterType === t ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400")}>{t}</button>
            ))}
         </div>

         <div className="relative flex-grow max-w-md">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
            <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full h-12 pl-12 pr-4 bg-[#F7F9FC] border border-slate-100 rounded-2xl font-bold text-[11px] outline-none" placeholder="Search by name, mobile, or TRX ID..." />
         </div>
      </div>

      {/* 3. REQUESTS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredData.map(item => (
            <motion.div layout key={item.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
               <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-slate-950 text-sky-400 rounded-2xl flex items-center justify-center font-black italic shadow-lg text-lg">{item.userName?.charAt(0)}</div>
                     <div>
                        <h4 className="text-[11px] font-black text-slate-900 uppercase truncate">{item.userName}</h4>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">{item.userPhone}</p>
                     </div>
                  </div>
                  <div className={clsx("px-3 py-1 rounded-full text-[7px] font-black uppercase tracking-widest border", item.type === 'deposit' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100")}>{item.type}</div>
               </div>

               <div className="bg-[#F7F9FC] p-5 rounded-3xl border border-slate-100 mb-6">
                  <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Transaction Value</p>
                  <h3 className="text-2xl font-black text-slate-900 italic leading-none">Rs {item.amount?.toLocaleString()}</h3>
                  <p className="text-[9px] font-black text-indigo-500 uppercase mt-4 italic">via {item.gateway}</p>
               </div>

               <div className="space-y-2 mb-6">
                  <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest ml-1">Reference Code</p>
                  <p className="text-[10px] font-mono font-bold text-slate-600 truncate bg-slate-50 p-2 rounded-xl border border-slate-100">{item.trxId || item.id}</p>
               </div>

               {activeTab === 'pending' ? (
                 <div className="flex gap-2 pt-4 border-t border-slate-50">
                    {item.proofImage && (
                      <button onClick={() => setSelectedProof(item.proofImage)} className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-sm shrink-0"><ImageIcon size={20}/></button>
                    )}
                    <button 
                      onClick={() => handleAction(item, 'approve')} 
                      disabled={!!processingId} 
                      className="flex-grow h-12 bg-[#1F2937] text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
                    >
                       {processingId === item.id ? <RefreshCw className="animate-spin" size={14}/> : <BadgeCheck size={16} className="text-emerald-400" />} Authorize
                    </button>
                    <button onClick={() => handleAction(item, 'reject')} className="w-12 h-12 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm"><X size={20}/></button>
                 </div>
               ) : (
                 <div className="pt-4 border-t border-slate-50 flex justify-between items-center px-1">
                    <span className={clsx("text-[9px] font-black uppercase tracking-widest", item.status === 'approved' ? "text-emerald-500" : "text-rose-500")}>{item.status}</span>
                    <p className="text-[8px] font-bold text-slate-300 uppercase italic">{item.date}</p>
                 </div>
               )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <ProofModal isOpen={!!selectedProof} onClose={() => setSelectedProof(null)} imageUrl={selectedProof || ''} />
    </div>
  );
};

const StatCard = ({ label, count, color, icon: Icon }: any) => (
  <div className={clsx("p-8 rounded-[40px] text-white shadow-xl relative overflow-hidden", color)}>
    <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 scale-150"><Icon size={64} /></div>
    <div className="relative z-10">
       <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-4 italic opacity-80">{label}</p>
       <h4 className="text-5xl font-black italic tracking-tighter leading-none">{count} <span className="text-sm not-italic uppercase opacity-60">Items</span></h4>
    </div>
  </div>
);

export default RequestsManager;