
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Eye, RefreshCw, Smartphone, Copy, Check, X, 
  ArrowRight, ShieldCheck, Clock, AlertCircle, Image as ImageIcon,
  User as UserIcon, Wallet, CheckSquare, TrendingUp, TrendingDown,
  ChevronRight, Filter, ExternalLink, Zap
} from 'lucide-react';
import { clsx } from 'clsx';
import { api } from '../../utils/api';
import { ProofModal } from '../../components/admin/ProofModal';

const RequestCard = ({ item, type, onApprove, onReject, onViewProof, processing }: any) => {
  const isDeposit = type === 'deposit';
  
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-[28px] border border-slate-100 shadow-sm flex flex-col overflow-hidden group hover:shadow-md transition-all h-full"
    >
      <div className="p-4 flex items-center justify-between border-b border-slate-50">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-sky-400 flex items-center justify-center font-black italic shadow-lg shrink-0">
            {item.userName?.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <h4 className="font-bold text-slate-900 text-[10px] uppercase truncate tracking-tight">{item.userName}</h4>
            <p className="text-[8px] font-medium text-slate-400 truncate">{item.userPhone}</p>
          </div>
        </div>
        <div className="bg-amber-50 px-2 py-0.5 rounded-lg text-[7px] font-black uppercase text-amber-600 border border-amber-100 flex items-center gap-1">
          <Clock size={8} /> Queue
        </div>
      </div>

      <div className="p-4 flex-grow space-y-3">
        <div className="flex justify-between items-end">
           <div>
              <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-0.5 italic">Amount (PKR)</p>
              <h3 className={clsx("text-lg font-black italic tracking-tighter leading-none", isDeposit ? "text-emerald-600" : "text-rose-600")}>
                Rs {item.amount?.toLocaleString()}
              </h3>
           </div>
           <div className="text-right">
              <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md text-[7px] font-black uppercase tracking-widest">{item.gateway}</span>
           </div>
        </div>

        <div className="bg-slate-50 p-3 rounded-xl space-y-1.5 border border-slate-100">
           <div className="flex justify-between items-center">
              <span className="text-[7px] font-black text-slate-400 uppercase">{isDeposit ? 'TRX ID' : 'ACCOUNT'}</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[8px] font-mono font-black text-slate-700">{isDeposit ? (item.trxId || '---') : item.accountNumber}</span>
                <button onClick={() => { navigator.clipboard.writeText(isDeposit ? item.trxId : item.accountNumber); }} className="text-slate-300 hover:text-indigo-500 transition-colors"><Copy size={10} /></button>
              </div>
           </div>
           {!isDeposit && (
             <div className="flex justify-between items-center">
                <span className="text-[7px] font-black text-slate-400 uppercase">TITLE</span>
                <span className="text-[8px] font-black text-slate-600 truncate max-w-[80px] uppercase">{item.accountTitle}</span>
             </div>
           )}
        </div>
      </div>

      <div className="p-3 bg-slate-50/50 border-t border-slate-50 flex gap-2">
         {isDeposit && item.proofImage && (
           <button 
             onClick={() => onViewProof(item.proofImage)} 
             className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-sm shrink-0"
           >
              <ImageIcon size={16}/>
           </button>
         )}
         <button 
           onClick={() => onApprove(item)} 
           disabled={processing === item.id}
           className="flex-grow h-10 bg-slate-950 text-white rounded-xl font-black text-[8px] uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
         >
           {processing === item.id ? <RefreshCw size={12} className="animate-spin" /> : <><Check size={12} className="text-emerald-400" /> AUTHORIZE</>}
         </button>
         <button 
           onClick={() => onReject(item)} 
           disabled={processing === item.id}
           className="h-10 w-10 border border-rose-100 text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-95 disabled:opacity-50"
         >
           <X size={16}/>
         </button>
      </div>
    </motion.div>
  );
};

const RequestHub = () => {
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedProof, setSelectedProof] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === 'deposit' ? '/admin/finance/deposits' : '/admin/finance/withdrawals';
      const res = await api.get(endpoint);
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

    setProcessingId(item.id);
    try {
      // Use unified action endpoint
      await api.post('/admin/finance/requests/manage', { 
        transactionId: item.id, 
        userId: item.userId, 
        action,
        type: activeTab,
        reason 
      });
      
      // Notify badge listeners
      window.dispatchEvent(new Event('noor_badge_update'));
      await fetchData();
    } catch (e: any) { 
      alert(e.message); 
    } finally {
      setProcessingId(null);
    }
  };

  const filteredData = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return data.filter(i => 
      i.userName?.toLowerCase().includes(term) || 
      i.userPhone?.includes(term) ||
      i.trxId?.includes(term)
    );
  }, [data, searchTerm]);

  const stats = useMemo(() => ({
    count: data.length,
    volume: data.reduce((a, b) => a + Number(b.amount), 0)
  }), [data]);

  return (
    <div className="space-y-4 md:space-y-6 pb-24 animate-fade-in max-w-7xl mx-auto px-1">
      
      {/* 1. COMPACT DASHBOARD HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 p-2">
        <div>
          <h1 className="text-xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Request <span className="text-indigo-600">Hub.</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase text-[7px] md:text-[9px] tracking-[0.2em] mt-1.5 flex items-center gap-1.5">
            <Zap size={10} className="text-indigo-500" /> Pending Queue Control Center
          </p>
        </div>
        
        <div className="flex gap-2">
           <div className="bg-white px-4 py-2.5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-950 flex items-center justify-center text-sky-400 shadow-inner">
                {activeTab === 'deposit' ? <TrendingUp size={16}/> : <TrendingDown size={16}/>}
              </div>
              <div>
                <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Queue Depth</p>
                <p className="text-sm font-black text-slate-900 leading-none">PKR {stats.volume.toLocaleString()}</p>
              </div>
           </div>
           <button onClick={fetchData} className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 active:rotate-180 transition-all duration-500 shadow-sm"><RefreshCw size={18}/></button>
        </div>
      </header>

      {/* 2. TAB & SEARCH TOOLBAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mx-1">
         <div className="lg:col-span-4 flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm h-12">
            <button onClick={() => setActiveTab('deposit')} className={clsx("flex-1 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all", activeTab === 'deposit' ? "bg-slate-950 text-white shadow-lg" : "text-slate-400")}>Deposits</button>
            <button onClick={() => setActiveTab('withdraw')} className={clsx("flex-1 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all", activeTab === 'withdraw' ? "bg-slate-950 text-white shadow-lg" : "text-slate-400")}>Payouts</button>
         </div>
         <div className="lg:col-span-8 relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
            <input 
              type="text" placeholder="Filter by Name, Phone or TRX..." 
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-white border border-slate-100 rounded-2xl font-bold text-[11px] outline-none shadow-sm focus:ring-4 focus:ring-indigo-50/50 transition-all placeholder:text-slate-300" 
            />
         </div>
      </div>

      {/* 3. RESPONSIVE GRID */}
      <div className="min-h-[400px]">
        {loading ? (
           <div className="py-20 text-center flex flex-col items-center gap-3">
              <RefreshCw className="animate-spin text-slate-200" size={32} />
              <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest italic">Syncing Central Database...</p>
           </div>
        ) : filteredData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4 px-1">
            <AnimatePresence mode="popLayout">
              {filteredData.map((item) => (
                <RequestCard 
                  key={item.id} 
                  item={item} 
                  type={activeTab}
                  onApprove={handleAction}
                  onReject={handleAction}
                  onViewProof={setSelectedProof}
                  processing={processingId}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="py-20 text-center">
             <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                <CheckSquare size={32} className="text-slate-200" />
             </div>
             <h4 className="text-slate-900 font-black uppercase text-[10px] tracking-widest">Queue Clear</h4>
             <p className="text-slate-300 font-bold uppercase text-[7px] tracking-[0.3em] mt-1 italic">Waiting for new system requests</p>
          </div>
        )}
      </div>

      {/* 4. CONTEXTUAL INFORMATION */}
      <div className="p-5 bg-indigo-50 rounded-[32px] border border-indigo-100 flex items-start gap-4 mx-1">
         <ShieldCheck size={20} className="text-indigo-600 shrink-0" />
         <p className="text-[9px] text-indigo-700 font-bold uppercase leading-relaxed tracking-wider">
            Protocol: Authorized agents must verify "TRX ID" on official bank portal before confirming deposits. Payouts are non-reversible once authorized.
         </p>
      </div>

      <ProofModal isOpen={!!selectedProof} onClose={() => setSelectedProof(null)} imageUrl={selectedProof || ''} />
    </div>
  );
};

export default RequestHub;
