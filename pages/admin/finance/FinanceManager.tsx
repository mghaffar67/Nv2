
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowDownCircle, ArrowUpCircle, Clock, CheckCircle2, 
  XCircle, Eye, Wallet, Smartphone, ShieldCheck, 
  RefreshCw, ClipboardCheck, LayoutDashboard,
  Calendar, FileText, Download, Filter, Search, User as UserIcon,
  TrendingUp, TrendingDown
} from 'lucide-react';
import { clsx } from 'clsx';
import { financeController } from '../../../backend_core/controllers/financeController';
import { ProofModal } from '../../../components/admin/ProofModal';

const FinanceManager = () => {
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProof, setSelectedProof] = useState<string | null>(null);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const method = activeTab === 'deposit' ? financeController.getAllDeposits : financeController.getAllWithdrawals;
      const res = await new Promise<any>(r => method({}, { status: () => ({ json: r }) }));
      setData(res || []);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchRecords(); }, [activeTab]);

  const filteredData = useMemo(() => {
    return data.filter(item => 
      item.userName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.userPhone?.includes(searchTerm)
    );
  }, [data, searchTerm]);

  const stats = useMemo(() => ({
    total: filteredData.length,
    volume: filteredData.reduce((a, b) => a + Number(b.amount), 0),
    pending: filteredData.filter(i => i.status === 'pending').length
  }), [filteredData]);

  return (
    <div className="space-y-6 md:space-y-8 pb-24 animate-fade-in max-w-7xl mx-auto px-1.5">
      
      {/* 1. AUDIT HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 px-2 pt-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Capital <span className="text-indigo-600">Registry.</span></h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[8px] md:text-xs mt-3">Verified Financial Ledger Audit</p>
        </div>
        <div className="flex gap-2">
           <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center text-sky-400 shadow-inner">
                {activeTab === 'deposit' ? <TrendingUp size={24}/> : <TrendingDown size={24}/>}
              </div>
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Audit Volume</p>
                <p className="text-lg font-black text-slate-900 leading-none">Rs {stats.volume.toLocaleString()}</p>
              </div>
           </div>
           <button onClick={fetchRecords} className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400 active:rotate-180 transition-all duration-500 shadow-sm"><RefreshCw size={22}/></button>
        </div>
      </div>

      {/* 2. TABS & SEARCH HUB */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mx-1">
         <div className="md:col-span-4 flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
            {['deposit', 'withdraw'].map(t => (
              <button key={t} onClick={() => setActiveTab(t as any)} className={clsx("flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", activeTab === t ? "bg-slate-950 text-white shadow-xl" : "text-slate-400 hover:text-slate-900")}>
                {t === 'deposit' ? 'Inbound Flow' : 'Outbound Flow'}
              </button>
            ))}
         </div>
         <div className="md:col-span-8 relative group">
            <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
            <input type="text" placeholder="Search registry by partner identity or mobile..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full h-14 pl-14 pr-6 bg-white border border-slate-100 rounded-[24px] font-bold text-sm outline-none shadow-sm focus:ring-4 focus:ring-indigo-50 transition-all" />
         </div>
      </div>

      {/* 3. REPORT DATASET */}
      <div className="bg-white rounded-[44px] border border-slate-100 shadow-sm overflow-hidden p-2">
         <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                     <th className="px-8 py-7">Partner Identity</th>
                     <th className="px-8 py-7">Voucher ID</th>
                     <th className="px-8 py-7">Audit Value</th>
                     <th className="px-8 py-7">Logic Gate</th>
                     <th className="px-8 py-7">Status</th>
                     <th className="px-8 py-7 text-right">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr><td colSpan={6} className="py-32 text-center"><RefreshCw className="animate-spin mx-auto text-indigo-400 mb-4" size={40}/><p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Querying Database Nodes...</p></td></tr>
                  ) : filteredData.length === 0 ? (
                    <tr><td colSpan={6} className="py-32 text-center text-slate-300 font-black uppercase text-xs italic">Registry Hub Empty for this query</td></tr>
                  ) : (
                    filteredData.map(trx => (
                      <tr key={trx.id} className="hover:bg-slate-50/50 transition-all group">
                         <td className="px-8 py-7">
                            <div className="flex items-center gap-4">
                               <div className="w-11 h-11 rounded-[18px] bg-slate-900 text-sky-400 flex items-center justify-center font-black italic shadow-lg shrink-0 text-lg border border-white/10">{trx.userName?.charAt(0)}</div>
                               <div>
                                  <p className="font-black text-slate-800 text-xs uppercase leading-none">{trx.userName}</p>
                                  <p className="text-[9px] font-bold text-slate-400 uppercase mt-2 tracking-widest">{trx.userPhone}</p>
                               </div>
                            </div>
                         </td>
                         <td className="px-8 py-7 font-mono text-[11px] font-black text-slate-400 uppercase tracking-tighter">{trx.id || 'SYS-V3'}</td>
                         <td className="px-8 py-7">
                            <p className={clsx("font-black text-base italic", activeTab === 'deposit' ? "text-emerald-600" : "text-rose-600")}>
                               {activeTab === 'deposit' ? '+' : '-'} {trx.amount?.toLocaleString()}
                            </p>
                         </td>
                         <td className="px-8 py-7">
                            <div className="flex items-center gap-2.5 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl w-fit">
                               <Smartphone size={14} className="text-slate-400" />
                               <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{trx.gateway || trx.method}</span>
                            </div>
                         </td>
                         <td className="px-8 py-7">
                            <span className={clsx(
                              "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm flex items-center gap-2 w-fit",
                              trx.status === 'pending' ? "bg-amber-50 text-amber-600 border-amber-100" : 
                              trx.status === 'approved' ? "bg-green-50 text-green-600 border-green-100" : "bg-rose-50 text-rose-600 border-rose-100"
                            )}>
                               <div className={clsx("w-1.5 h-1.5 rounded-full", trx.status === 'pending' ? "bg-amber-500 animate-pulse" : trx.status === 'approved' ? "bg-green-500" : "bg-rose-500")} />
                               {trx.status}
                            </span>
                         </td>
                         <td className="px-8 py-7 text-right">
                            <div className="flex justify-end gap-2.5 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                               {trx.proofImage && <button onClick={() => setSelectedProof(trx.proofImage)} className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"><Eye size={16}/></button>}
                               <button className="p-2.5 bg-slate-100 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm"><Download size={16}/></button>
                            </div>
                         </td>
                      </tr>
                    ))
                  )}
               </tbody>
            </table>
         </div>
      </div>

      {/* 4. SECURITY AUDIT DISCLOSURE */}
      <div className="p-10 bg-slate-950 rounded-[48px] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-10 text-white shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12 scale-[3]"><ShieldCheck size={64}/></div>
         <div className="flex items-center gap-8 relative z-10">
            <div className="w-20 h-20 bg-white/10 rounded-[28px] flex items-center justify-center text-sky-400 border border-white/10 shadow-2xl backdrop-blur-xl"><FileText size={36}/></div>
            <div>
               <h4 className="text-2xl font-black italic tracking-tighter uppercase mb-2">Immutable Ledger Node</h4>
               <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed max-w-md">Every entry is cryptographically linked to the partner hub and timestamped for 100% accountability.</p>
            </div>
         </div>
         <button className="relative z-10 h-16 px-12 bg-white text-slate-950 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all">Export Full Registry</button>
      </div>

      <ProofModal isOpen={!!selectedProof} onClose={() => setSelectedProof(null)} imageUrl={selectedProof || ''} />
    </div>
  );
};

export default FinanceManager;
