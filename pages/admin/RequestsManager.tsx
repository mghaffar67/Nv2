
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Eye, RefreshCw, Briefcase, Wallet, 
  Check, X, Smartphone, Hash, ShieldCheck, 
  Clock, Zap, ArrowRight, FileText, CreditCard,
  User as UserIcon, Calendar, ArrowDownLeft, ArrowUpRight,
  Filter, AlertCircle, Copy, CheckCircle2, MoreHorizontal
} from 'lucide-react';
import { clsx } from 'clsx';
import { api } from '../../utils/api';
import { useConfig } from '../../context/ConfigContext';
import { ProofModal } from '../../components/admin/ProofModal';

const RequestCard = ({ item, type, onApprove, onReject, onViewProof, themeColor }: any) => {
  const isDeposit = type === 'deposit';
  
  const handleCopy = (val: string) => {
    navigator.clipboard.writeText(val);
    // Silent notification or toast could go here
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-[32px] border border-slate-100 shadow-sm flex flex-col group hover:border-indigo-100 hover:shadow-xl transition-all duration-300"
    >
      {/* 1. Card Header: Identity */}
      <div className="p-5 flex items-center justify-between border-b border-slate-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-sky-400 font-black italic shadow-lg shrink-0">
            {item.userName?.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <h4 className="font-black text-slate-800 text-[11px] uppercase truncate tracking-tight">{item.userName || 'Member'}</h4>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Calendar size={8} /> {new Date(item.timestamp || item.date).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className={clsx(
          "w-8 h-8 rounded-xl flex items-center justify-center shadow-inner",
          isDeposit ? "bg-emerald-50 text-emerald-500" : "bg-rose-50 text-rose-500"
        )}>
          {isDeposit ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
        </div>
      </div>

      {/* 2. Middle Body: Value & Method */}
      <div className="p-6 space-y-5">
        <div className="text-center space-y-1">
          <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.3em]">Transaction Value</p>
          <h3 className={clsx(
            "text-3xl font-black italic tracking-tighter",
            isDeposit ? "text-emerald-600" : "text-rose-600"
          )}>
            Rs {item.amount?.toLocaleString()}
          </h3>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Smartphone size={12} className="text-indigo-400" />
              <span className="text-[9px] font-black text-slate-700 uppercase">{item.gateway || 'EasyPaisa'}</span>
            </div>
            <div className="px-2 py-0.5 bg-white border border-slate-200 rounded-md text-[7px] font-black text-slate-400 uppercase">
              {isDeposit ? 'Deposit' : 'Payout'}
            </div>
          </div>

          {/* Key Identifier (TRX ID or Account Number) */}
          <div className="bg-white p-2.5 rounded-xl border border-slate-200/60 flex items-center justify-between group/id">
            <div className="overflow-hidden">
               <p className="text-[7px] font-black text-slate-400 uppercase mb-0.5">{isDeposit ? 'TRX Hash' : 'Target Account'}</p>
               <p className="text-[10px] font-mono font-black text-slate-700 truncate">
                 {isDeposit ? (item.trxId || item.id) : item.accountNumber}
               </p>
            </div>
            <button 
              onClick={() => handleCopy(isDeposit ? (item.trxId || item.id) : item.accountNumber)}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-300 hover:text-indigo-600 transition-colors"
            >
              <Copy size={12} />
            </button>
          </div>
          
          {!isDeposit && (
             <div className="px-1 pt-1">
                <p className="text-[7px] font-black text-slate-400 uppercase mb-0.5">Account Title</p>
                <p className="text-[10px] font-black text-slate-800 uppercase truncate">{item.accountTitle || 'N/A'}</p>
             </div>
          )}
        </div>

        {/* 3. Deposit Evidence Section */}
        {isDeposit && item.proofImage && (
          <button 
            onClick={() => onViewProof(item.proofImage)}
            className="w-full h-32 rounded-2xl overflow-hidden border-2 border-dashed border-slate-200 group/img relative hover:border-indigo-400 transition-colors"
          >
            <img src={item.proofImage} className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110" alt="Receipt" />
            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
              <div className="bg-white p-2 rounded-xl shadow-2xl flex items-center gap-2">
                <Eye size={14} className="text-indigo-600" />
                <span className="text-[9px] font-black uppercase text-slate-900">Verify Receipt</span>
              </div>
            </div>
          </button>
        )}
      </div>

      {/* 4. Action Footer (Pending Only) */}
      <div className="mt-auto p-4 pt-0">
        {item.status === 'pending' ? (
          <div className="flex gap-2">
            <button 
              onClick={() => onApprove(item)}
              className="flex-grow h-12 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-100 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={16} /> Authorize
            </button>
            <button 
              onClick={() => onReject(item)}
              className="w-12 h-12 bg-white border-2 border-rose-100 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl active:scale-95 transition-all flex items-center justify-center"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <div className={clsx(
            "h-12 w-full rounded-xl flex items-center justify-center gap-2 font-black text-[9px] uppercase tracking-widest border",
            item.status === 'approved' ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-rose-50 border-rose-100 text-rose-600"
          )}>
            {item.status === 'approved' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
            {item.status === 'approved' ? 'Sync Completed' : 'Audit Rejected'}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const RequestsManager = () => {
  const { config } = useConfig();
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
    let reason = "";
    if (action === 'reject') {
      reason = prompt("Provide Rejection Reason for Ledger:") || "Policy Violation";
      if (!reason) return;
    }

    const confirmed = window.confirm(`Identity Check: ${item.userName}\nAction: ${action.toUpperCase()} PKR ${item.amount}?`);
    if (!confirmed) return;

    try {
      const endpoint = `/admin/finance/${activeTab}/${action}`;
      await api.post(endpoint, { transactionId: item.id, userId: item.userId, reason });
      fetchData();
    } catch (e: any) {
      alert(e.message || "Logic Synchronization Error.");
    }
  };

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesStatus = item.status === statusFilter;
      const term = searchTerm.toLowerCase();
      const matchesSearch = 
        item.userName?.toLowerCase().includes(term) || 
        item.userPhone?.includes(term) ||
        item.trxId?.includes(term) ||
        item.accountNumber?.includes(term);
      return matchesStatus && matchesSearch;
    });
  }, [data, statusFilter, searchTerm]);

  const stats = useMemo(() => ({
    pending: data.filter(i => i.status === 'pending').length,
    approved: data.filter(i => i.status === 'approved').length
  }), [data]);

  return (
    <div className="space-y-6 pb-32 animate-fade-in max-w-7xl mx-auto px-4">
      {/* 1. Header Section */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pt-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Protocol <span style={{ color: config.theme.primaryColor }}>Hub.</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase text-[9px] tracking-[0.4em] mt-3">Advanced Financial Audit Terminal</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-white px-6 py-4 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center animate-pulse"><Clock size={20}/></div>
            <div>
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Queue</p>
              <p className="text-xl font-black text-slate-800 leading-none">{stats.pending}</p>
            </div>
          </div>
          <button onClick={fetchData} className="w-16 h-16 bg-slate-950 text-white rounded-[24px] hover:bg-indigo-600 transition-all flex items-center justify-center shadow-xl group">
             <RefreshCw size={24} className="group-active:rotate-180 transition-transform duration-500" />
          </button>
        </div>
      </header>

      {/* 2. Primary Control Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-5 flex bg-white p-1.5 rounded-[32px] border border-slate-100 shadow-sm">
           <button 
            onClick={() => setActiveTab('deposit')} 
            className={clsx(
              "flex-1 flex items-center justify-center gap-3 py-4 rounded-[26px] transition-all duration-300 font-black uppercase text-[10px] tracking-widest",
              activeTab === 'deposit' ? "bg-slate-950 text-white shadow-xl" : "text-slate-400 hover:bg-slate-50"
            )}
           >
             <ArrowDownLeft size={18} /> Inbound Flow
           </button>
           <button 
            onClick={() => setActiveTab('withdraw')} 
            className={clsx(
              "flex-1 flex items-center justify-center gap-3 py-4 rounded-[26px] transition-all duration-300 font-black uppercase text-[10px] tracking-widest",
              activeTab === 'withdraw' ? "bg-slate-950 text-white shadow-xl" : "text-slate-400 hover:bg-slate-50"
            )}
           >
             <ArrowUpRight size={18} /> Outbound Flow
           </button>
        </div>

        <div className="lg:col-span-7 relative group">
          <Search size={22} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search by Member ID, Mobile, or Hash..." 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)} 
            className="w-full h-16 pl-16 pr-8 bg-white border border-slate-100 rounded-[32px] font-bold text-xs uppercase outline-none shadow-sm focus:ring-4 focus:ring-indigo-50/30 transition-all placeholder:text-slate-200" 
          />
        </div>
      </div>

      {/* 3. Status Filters */}
      <div className="flex gap-2 px-1 overflow-x-auto no-scrollbar">
         {['pending', 'approved', 'rejected'].map((s) => (
           <button 
            key={s} 
            onClick={() => setStatusFilter(s as any)}
            className={clsx(
              "px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border",
              statusFilter === s ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100" : "bg-white border-slate-100 text-slate-400"
            )}
           >
             {s}
           </button>
         ))}
      </div>

      {/* 4. Request Grid */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="py-32 text-center flex flex-col items-center gap-6">
             <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
             <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.4em] italic">Scanning Registry...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-24 rounded-[48px] text-center border-2 border-dashed border-slate-100 opacity-60">
             <ShieldCheck size={48} className="mx-auto text-slate-100 mb-6" />
             <p className="text-slate-900 font-black uppercase text-sm tracking-widest italic">Ledger Clean: 0 Matches</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredData.map((item) => (
                <RequestCard 
                  key={item.id} 
                  item={item} 
                  type={activeTab}
                  onApprove={(i: any) => handleAction(i, 'approve')}
                  onReject={(i: any) => handleAction(i, 'reject')}
                  onViewProof={setSelectedProof}
                  themeColor={config.theme.primaryColor}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <ProofModal isOpen={!!selectedProof} onClose={() => setSelectedProof(null)} imageUrl={selectedProof || ''} />
    </div>
  );
};

export default RequestsManager;
