
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Eye, RefreshCw, Smartphone, Copy, Check, X, 
  ArrowRight, ShieldCheck, Clock, AlertCircle, Image as ImageIcon,
  User as UserIcon, Send, Wallet,
  // Added missing CheckSquare icon from lucide-react
  CheckSquare
} from 'lucide-react';
import { clsx } from 'clsx';
import { api } from '../../utils/api';
import { ProofModal } from '../../components/admin/ProofModal';

const RequestCard = ({ item, type, onApprove, onReject, onViewProof }: any) => {
  const isDeposit = type === 'deposit';
  
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-[32px] border border-slate-100 shadow-sm flex flex-col overflow-hidden group hover:border-indigo-200 transition-all"
    >
      <div className="p-5 flex items-center justify-between border-b border-slate-50">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-[14px] bg-slate-950 text-sky-400 flex items-center justify-center font-black italic shadow-lg shrink-0">
            {item.userName?.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <h4 className="font-black text-slate-900 text-[11px] uppercase truncate tracking-tight">{item.userName}</h4>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest truncate">{item.userPhone}</p>
          </div>
        </div>
        <div className="bg-amber-50 px-2.5 py-1 rounded-full text-[7px] font-black uppercase text-amber-600 border border-amber-100 flex items-center gap-1 shrink-0">
          <Clock size={8} /> Pending
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="flex justify-between items-end">
           <div>
              <p className="text-[7px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 italic">Voucher Value</p>
              <h3 className={clsx("text-xl font-black italic tracking-tighter leading-none", isDeposit ? "text-emerald-600" : "text-rose-600")}>
                Rs {item.amount?.toLocaleString()}
              </h3>
           </div>
           <div className="text-right">
              <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded-lg text-[8px] font-black uppercase tracking-widest italic">{item.gateway}</span>
           </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl space-y-2 border border-slate-100">
           <div className="flex justify-between items-center">
              <span className="text-[7px] font-black text-slate-400 uppercase">{isDeposit ? 'TRX ID' : 'ACCOUNT'}</span>
              <span className="text-[9px] font-mono font-black text-slate-700">{isDeposit ? (item.trxId || '---') : item.accountNumber}</span>
           </div>
           {!isDeposit && (
             <div className="flex justify-between items-center">
                <span className="text-[7px] font-black text-slate-400 uppercase">TITLE</span>
                <span className="text-[9px] font-black text-slate-600 truncate max-w-[100px] uppercase">{item.accountTitle}</span>
             </div>
           )}
        </div>

        <div className="flex gap-2.5">
           {isDeposit && item.proofImage && (
             <button 
               onClick={() => onViewProof(item.proofImage)} 
               className="h-11 w-11 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
               title="View Verification"
             >
                <ImageIcon size={18}/>
             </button>
           )}
           <button 
             onClick={() => onApprove(item)} 
             className="flex-grow h-11 bg-slate-950 text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
           >
             <Check size={14} className="text-emerald-400" /> Approve
           </button>
           <button 
             onClick={() => onReject(item)} 
             className="h-11 w-11 border border-rose-100 text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-95"
           >
             <X size={18}/>
           </button>
        </div>
      </div>
    </motion.div>
  );
};

const RequestHub = () => {
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProof, setSelectedProof] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === 'deposit' ? '/admin/finance/deposits' : '/admin/finance/withdrawals';
      const res = await api.get(endpoint);
      // Filter only pending for the Hub
      const pendingOnly = (res || []).filter((i: any) => i.status === 'pending');
      setData(pendingOnly);
    } catch (e) {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [activeTab]);

  const handleAction = async (item: any, action: 'approve' | 'reject') => {
    let reason = "";
    if (action === 'reject') {
      reason = prompt("Reason for rejection?") || "";
      if (!reason) return;
    }

    if (!window.confirm(`Action PKR ${item.amount} for ${item.userName}?`)) return;

    try {
      const endpoint = `/admin/finance/${activeTab}/${action}`;
      await api.post(endpoint, { transactionId: item.id, userId: item.userId, reason });
      fetchData();
      // Notify parent app of badge update
      window.dispatchEvent(new Event('noor_badge_update'));
    } catch (e: any) { alert(e.message); }
  };

  const filteredData = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return data.filter(i => i.userName?.toLowerCase().includes(term) || i.userPhone?.includes(term));
  }, [data, searchTerm]);

  return (
    <div className="space-y-6 pb-32 animate-fade-in max-w-[1400px] mx-auto px-2">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pt-6 px-1">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Request <span className="text-indigo-600">Hub.</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase text-[9px] tracking-[0.4em] mt-3">Active Pending Queue Management</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{data.length} IN WAITING</span>
          </div>
          <button onClick={fetchData} className="w-12 h-12 bg-slate-950 text-white rounded-2xl flex items-center justify-center shadow-xl active:rotate-180 transition-all duration-700">
             <RefreshCw size={20} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 px-1">
         <div className="md:col-span-4 flex bg-white p-1.5 rounded-[22px] border border-slate-100 shadow-sm">
            <button onClick={() => setActiveTab('deposit')} className={clsx("flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", activeTab === 'deposit' ? "bg-slate-950 text-white shadow-lg" : "text-slate-400")}>Deposits</button>
            <button onClick={() => setActiveTab('withdraw')} className={clsx("flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", activeTab === 'withdraw' ? "bg-slate-950 text-white shadow-lg" : "text-slate-400")}>Payouts</button>
         </div>
         <div className="md:col-span-8 relative">
            <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
            <input 
              type="text" placeholder="Search by name or number..." 
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="w-full h-16 pl-14 pr-6 bg-white border border-slate-100 rounded-[22px] font-bold text-sm outline-none shadow-sm focus:ring-4 focus:ring-indigo-50/50 transition-all" 
            />
         </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-1">
        <AnimatePresence mode="popLayout">
          {filteredData.map((item) => (
            <RequestCard 
              key={item.id} 
              item={item} 
              type={activeTab}
              onApprove={handleAction}
              onReject={handleAction}
              onViewProof={setSelectedProof}
            />
          ))}
        </AnimatePresence>
      </div>

      {!loading && filteredData.length === 0 && (
        <div className="py-24 text-center">
           <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              {/* Fixed: Re-added missing CheckSquare icon here after importing it above */}
              <CheckSquare size={40} className="text-slate-200" />
           </div>
           <p className="text-[11px] font-black uppercase text-slate-300 tracking-[0.3em] italic">Queue is fully cleared</p>
        </div>
      )}

      <ProofModal isOpen={!!selectedProof} onClose={() => setSelectedProof(null)} imageUrl={selectedProof || ''} />
    </div>
  );
};

export default RequestHub;
