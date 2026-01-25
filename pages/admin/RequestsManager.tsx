
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Eye, RefreshCw, Briefcase, Wallet, 
  Check, X, Smartphone, Copy, ShieldCheck, 
  Clock, Zap, ArrowRight, AlertCircle
} from 'lucide-react';
import { clsx } from 'clsx';
import { api } from '../../utils/api';
import { useConfig } from '../../context/ConfigContext';
import { ProofModal } from '../../components/admin/ProofModal';

const RequestCard = ({ item, type, onApprove, onReject, onViewProof }: any) => {
  const isDeposit = type === 'deposit';
  
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        "bg-white rounded-[24px] border border-slate-100 shadow-sm flex flex-col overflow-hidden",
        isDeposit ? "border-l-4 border-l-emerald-500" : "border-l-4 border-l-rose-500"
      )}
    >
      <div className="p-4 flex items-center justify-between border-b border-slate-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white text-[10px] font-black italic">
            {item.userName?.charAt(0)}
          </div>
          <div>
            <h4 className="font-black text-slate-800 text-[10px] uppercase truncate tracking-tight">{item.userName}</h4>
            <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">{item.userPhone}</p>
          </div>
        </div>
        <p className={clsx("font-black text-xs italic", isDeposit ? "text-emerald-600" : "text-rose-600")}>
          Rs {item.amount?.toLocaleString()}
        </p>
      </div>

      <div className="p-4 space-y-3">
        <div className="bg-slate-50 p-3 rounded-xl space-y-2">
           <div className="flex justify-between items-center">
              <span className="text-[7px] font-black text-slate-400 uppercase">{isDeposit ? 'TRX ID' : 'BANK/ACCOUNT'}</span>
              <span className="text-[8px] font-mono font-black text-slate-700">{isDeposit ? (item.trxId || 'N/A') : item.accountNumber}</span>
           </div>
           <div className="flex justify-between items-center">
              <span className="text-[7px] font-black text-slate-400 uppercase">METHOD</span>
              <span className="text-[8px] font-black text-indigo-600 uppercase italic">{item.gateway}</span>
           </div>
        </div>

        <div className="flex gap-2">
          {item.status === 'pending' ? (
            <>
               {isDeposit && item.proofImage && (
                 <button onClick={() => onViewProof(item.proofImage)} className="h-9 w-9 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all">
                    <Eye size={14}/>
                 </button>
               )}
               <button onClick={() => onApprove(item)} className="flex-grow h-9 bg-slate-950 text-white rounded-lg font-black text-[8px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                 Approve
               </button>
               <button onClick={() => onReject(item)} className="h-9 w-9 border border-rose-100 text-rose-500 rounded-lg flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all">
                 <X size={14}/>
               </button>
            </>
          ) : (
            <div className={clsx(
              "h-9 w-full rounded-lg flex items-center justify-center gap-2 font-black text-[7px] uppercase tracking-widest border",
              item.status === 'approved' ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-rose-50 border-rose-100 text-rose-600"
            )}>
              {item.status === 'approved' ? 'Success' : 'Rejected'}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const RequestsManager = () => {
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [statusFilter, setStatusFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProof, setSelectedProof] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === 'deposit' ? '/admin/finance/deposits' : '/admin/finance/withdrawals';
      const res = await api.get(endpoint);
      setData(Array.isArray(res) ? res : []);
    } catch (e) {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [activeTab]);

  const handleAction = async (item: any, action: 'approve' | 'reject') => {
    let reason = action === 'reject' ? (prompt("Reason for rejection?") || "Data Error") : "";
    if (action === 'reject' && !reason) return;

    if (!window.confirm(`Confirm PKR ${item.amount}?`)) return;

    try {
      await api.post(`/admin/finance/${activeTab}/${action}`, { transactionId: item.id, userId: item.userId, reason });
      fetchData();
    } catch (e: any) { alert(e.message); }
  };

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesStatus = item.status === statusFilter;
      const term = searchTerm.toLowerCase();
      return matchesStatus && (item.userName?.toLowerCase().includes(term) || item.userPhone?.includes(term));
    });
  }, [data, statusFilter, searchTerm]);

  return (
    <div className="space-y-4 pb-32 animate-fade-in max-w-7xl mx-auto px-2">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pt-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Pending <span className="text-indigo-600">Requests.</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase text-[7px] tracking-[0.4em] mt-2">Manage User Payments</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm flex items-center gap-2">
            <span className="text-[9px] font-black text-slate-600 uppercase">{data.filter(i => i.status === 'pending').length} In Queue</span>
          </div>
          <button onClick={fetchData} className="w-10 h-10 bg-slate-950 text-white rounded-xl flex items-center justify-center">
             <RefreshCw size={18} />
          </button>
        </div>
      </header>

      <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
         <button onClick={() => setActiveTab('deposit')} className={clsx("flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all", activeTab === 'deposit' ? "bg-slate-950 text-white" : "text-slate-400")}>Deposits</button>
         <button onClick={() => setActiveTab('withdraw')} className={clsx("flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all", activeTab === 'withdraw' ? "bg-slate-950 text-white" : "text-slate-400")}>Payouts</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        <AnimatePresence mode="popLayout">
          {filteredData.map((item) => (
            <RequestCard 
              key={item.id} 
              item={item} 
              type={activeTab}
              onApprove={(i: any) => handleAction(i, 'approve')}
              onReject={(i: any) => handleAction(i, 'reject')}
              onViewProof={setSelectedProof}
            />
          ))}
        </AnimatePresence>
      </div>

      {filteredData.length === 0 && !loading && (
        <div className="py-20 text-center opacity-30">
           <p className="text-[10px] font-black uppercase tracking-widest">No Requests Found</p>
        </div>
      )}

      <ProofModal isOpen={!!selectedProof} onClose={() => setSelectedProof(null)} imageUrl={selectedProof || ''} />
    </div>
  );
};

export default RequestsManager;
