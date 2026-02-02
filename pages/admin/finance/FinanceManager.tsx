import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, Wallet, RefreshCw, Briefcase, ChevronRight,
  TrendingUp, CreditCard, Award, Gem, Search, Filter,
  History, Activity, BarChart3, Zap
} from 'lucide-react';
import { clsx } from 'clsx';
import { api } from '../../../utils/api';

const GlobalLedgerCard = ({ label, value, icon: Icon, gradient, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className={clsx(
      "p-6 rounded-[36px] border border-white/10 shadow-xl flex flex-col justify-between h-36 relative overflow-hidden group",
      gradient
    )}
  >
    <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 scale-150"><Icon size={64} /></div>
    <div className="relative z-10">
       <p className="text-[7px] font-black text-white/60 uppercase tracking-[0.2em] mb-1 italic">{label}</p>
       <h4 className="text-2xl font-black text-white italic tracking-tighter leading-none">{value}</h4>
    </div>
    <div className="flex items-center gap-1 relative z-10">
       <div className="w-1 h-1 rounded-full bg-white/40" />
       <span className="text-[6px] font-black text-white/50 uppercase tracking-widest">Ledger Sync: OK</span>
    </div>
  </motion.div>
);

const FinanceManager = () => {
  const [activeReport, setActiveReport] = useState<'all' | 'task' | 'withdraw' | 'plan'>('all');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchGlobalLedger = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/finance/ledger');
      setData(res || []);
    } catch (e) {
      console.error("Ledger sync failure.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGlobalLedger(); }, []);

  const stats = useMemo(() => {
    const approved = data.filter(i => i.status === 'approved' || i.status === 'active');
    return {
      totalYield: approved.filter(i => i.type === 'reward').reduce((a, b) => a + Number(b.amount), 0),
      totalPayouts: approved.filter(i => i.type === 'withdraw').reduce((a, b) => a + Number(b.amount), 0),
      totalPlanSales: approved.filter(i => i.source === 'plan').reduce((a, b) => a + Number(b.amount), 0)
    };
  }, [data]);

  const filteredEntries = useMemo(() => {
    return data.filter(entry => {
      const typeMap: Record<string, string> = { task: 'reward', withdraw: 'withdraw', plan: 'purchase' };
      const matchesType = activeReport === 'all' || entry.type === typeMap[activeReport] || (activeReport === 'plan' && entry.source === 'plan');
      const matchesSearch = entry.userName?.toLowerCase().includes(searchTerm.toLowerCase()) || entry.id?.includes(searchTerm);
      return matchesType && matchesSearch;
    });
  }, [data, activeReport, searchTerm]);

  return (
    <div className="space-y-8 pb-24 animate-fade-in max-w-7xl mx-auto px-2">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 p-2">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Global <span className="text-indigo-600">Ledger.</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase text-[9px] tracking-[0.3em] mt-3 flex items-center gap-2 italic">
            <BarChart3 size={16} className="text-indigo-500" /> Unified Platform Financial Reporting
          </p>
        </div>
        <button onClick={fetchGlobalLedger} className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 active:rotate-180 transition-all duration-500 shadow-sm"><RefreshCw size={22}/></button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlobalLedgerCard label="Total Task Yield" value={`Rs. ${stats.totalYield.toLocaleString()}`} icon={Zap} gradient="bg-emerald-600" delay={0.1} />
        <GlobalLedgerCard label="Total Disbursed" value={`Rs. ${stats.totalPayouts.toLocaleString()}`} icon={Wallet} gradient="bg-rose-600" delay={0.2} />
        <GlobalLedgerCard label="Activation Revenue" value={`Rs. ${stats.totalPlanSales.toLocaleString()}`} icon={Award} gradient="bg-indigo-600" delay={0.3} />
      </div>

      <div className="bg-white p-3 rounded-[32px] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
         <div className="flex bg-slate-50 p-1.5 rounded-2xl gap-1 overflow-x-auto no-scrollbar w-full md:w-auto">
            {['all', 'task', 'withdraw', 'plan'].map((r) => (
              <button key={r} onClick={() => setActiveReport(r as any)} className={clsx("px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shrink-0", activeReport === r ? "bg-slate-900 text-white shadow-lg" : "text-slate-400")}>{r === 'all' ? 'All History' : r === 'task' ? 'Work Yields' : r === 'withdraw' ? 'Payouts' : 'Plan Sales'}</button>
            ))}
         </div>
         <div className="relative w-full md:w-96">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
            <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full h-11 pl-11 pr-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-[10px] outline-none" placeholder="Filter by name or reference..." />
         </div>
      </div>

      <div className="bg-white rounded-[44px] border border-slate-100 shadow-sm overflow-hidden p-2">
         <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left">
               <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                     <th className="px-8 py-6">Partner Identity</th>
                     <th className="px-8 py-6">Report Node</th>
                     <th className="px-8 py-6">Ledger Value</th>
                     <th className="px-8 py-6">Timestamp</th>
                     <th className="px-8 py-6 text-right">Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr><td colSpan={5} className="py-24 text-center"><RefreshCw className="animate-spin mx-auto text-slate-200" size={32}/></td></tr>
                  ) : filteredEntries.map((item, idx) => (
                    <tr key={idx} className="group hover:bg-slate-50/50 transition-all">
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                             <div className="w-11 h-11 rounded-[18px] bg-slate-900 text-sky-400 flex items-center justify-center font-black italic shadow-lg shrink-0 border border-white/5">{item.userName?.charAt(0)}</div>
                             <div>
                                <p className="font-black text-slate-900 text-[11px] uppercase leading-none">{item.userName}</p>
                                <p className="text-[8px] font-bold text-slate-400 uppercase mt-2 tracking-widest">UID: {item.userId?.slice(-6)}</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <span className={clsx("px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border", item.type === 'reward' ? "bg-indigo-50 text-indigo-600 border-indigo-100" : item.type === 'withdraw' ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-emerald-50 text-emerald-600 border-emerald-100")}>{item.planId || item.gateway || item.type}</span>
                       </td>
                       <td className="px-8 py-6">
                          <p className={clsx("font-black text-sm italic", item.type === 'withdraw' ? "text-slate-900" : "text-emerald-600")}>{item.type === 'withdraw' ? '-' : '+'} Rs {item.amount?.toLocaleString()}</p>
                       </td>
                       <td className="px-8 py-6">
                          <p className="text-[10px] font-black text-slate-800 uppercase italic">{new Date(item.timestamp || item.date).toLocaleDateString()}</p>
                       </td>
                       <td className="px-8 py-6 text-right">
                          <span className={clsx("px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-sm", (item.status === 'approved' || item.status === 'active') ? "bg-green-500 text-white" : "bg-amber-500 text-white")}>{item.status}</span>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default FinanceManager;