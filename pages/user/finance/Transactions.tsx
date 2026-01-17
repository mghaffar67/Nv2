
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  CheckCircle2, 
  XCircle,
  History as HistoryIcon,
  Info,
  ChevronRight,
  Zap,
  Filter,
  TrendingUp,
  Search,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { userFinanceController } from '../../../backend_core/controllers/userFinanceController';
import { clsx } from 'clsx';
import { InvoiceModal } from '../../../components/finance/InvoiceModal';
import { useAuth } from '../../../context/AuthContext';

const Transactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'deposit' | 'withdraw' | 'reward'>('all');
  const [selectedTrx, setSelectedTrx] = useState<any | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const res = await new Promise<any>((resolve) => {
          userFinanceController.getMyTransactions({ query: { userId: user.id } }, { 
            status: () => ({ json: (data: any) => resolve(data) }) 
          });
        });
        setTransactions(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error("Failed to fetch history", err);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user?.id]);

  const filteredTransactions = useMemo(() => {
    if (!Array.isArray(transactions)) return [];
    if (filter === 'all') return transactions;
    return transactions.filter(t => t.type === filter);
  }, [transactions, filter]);

  const stats = useMemo(() => {
    if (!Array.isArray(transactions)) return { totalIn: 0, totalOut: 0 };
    return {
      totalIn: transactions.filter(t => t.type !== 'withdraw' && t.status === 'approved').reduce((a, b) => a + (Number(b.amount) || 0), 0),
      totalOut: transactions.filter(t => t.type === 'withdraw' && t.status === 'approved').reduce((a, b) => a + (Number(b.amount) || 0), 0),
    };
  }, [transactions]);

  return (
    <div className="max-w-4xl mx-auto space-y-4 md:space-y-8 pb-20 px-1 md:px-4">
      {/* Header Info - Mobile Optimized */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 px-2">
        <div>
          <h1 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <div className="p-2 bg-slate-900 text-white rounded-xl md:rounded-2xl shrink-0"><HistoryIcon size={18} className="md:size-24" /></div>
            History
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px] md:text-sm mt-1">Unified ledger of all financial events.</p>
        </div>
        
        <div className="flex bg-white p-1 rounded-xl md:rounded-2xl border border-slate-100 shadow-sm overflow-x-auto no-scrollbar scroll-smooth">
           {(['all', 'deposit', 'withdraw', 'reward'] as const).map((f) => (
             <button 
               key={f}
               onClick={() => setFilter(f)}
               className={clsx(
                 "px-3 md:px-5 py-1.5 md:py-2.5 rounded-lg md:rounded-xl text-[7px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                 filter === f ? "bg-slate-900 text-white shadow-md" : "text-slate-400 hover:text-slate-600"
               )}
             >
               {f}
             </button>
           ))}
        </div>
      </div>

      {/* Mini Stats Row - Compact for Mobile */}
      <div className="grid grid-cols-2 gap-2.5 md:gap-4 px-1">
         <div className="bg-white p-3.5 md:p-6 rounded-[24px] md:rounded-[32px] border border-slate-100 flex items-center gap-3 md:gap-4 shadow-sm">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-green-50 text-green-600 rounded-lg md:rounded-xl flex items-center justify-center shrink-0"><TrendingUp size={16} className="md:size-20" /></div>
            <div className="overflow-hidden">
              <p className="text-[7px] md:text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Cash In</p>
              <p className="text-xs md:text-lg font-black text-slate-800 truncate leading-none">Rs. {stats.totalIn.toLocaleString()}</p>
            </div>
         </div>
         <div className="bg-white p-3.5 md:p-6 rounded-[24px] md:rounded-[32px] border border-slate-100 flex items-center gap-3 md:gap-4 shadow-sm">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-rose-50 text-rose-600 rounded-lg md:rounded-xl flex items-center justify-center shrink-0"><ArrowUpRight size={16} className="md:size-20" /></div>
            <div className="overflow-hidden">
              <p className="text-[7px] md:text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Cash Out</p>
              <p className="text-xs md:text-lg font-black text-slate-800 truncate leading-none">Rs. {stats.totalOut.toLocaleString()}</p>
            </div>
         </div>
      </div>

      {/* List Area */}
      <div className="space-y-2.5 md:space-y-4 px-1">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center text-slate-300">
             <Clock className="w-8 h-8 md:w-12 md:h-12 mb-4 animate-spin opacity-20" />
             <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em]">Syncing Records...</p>
          </div>
        ) : filteredTransactions.length > 0 ? (
          filteredTransactions.map((trx, idx) => (
            <motion.div 
              key={trx.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setSelectedTrx(trx)}
              className="bg-white p-3.5 md:p-6 rounded-[20px] md:rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-sky-300 transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="flex items-center gap-3 md:gap-4 flex-grow overflow-hidden">
                 <div className={clsx(
                   "w-11 h-11 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                   trx.type === 'withdraw' ? "bg-rose-50 text-rose-500" : 
                   trx.type === 'reward' ? "bg-indigo-50 text-indigo-500" : "bg-green-50 text-green-500"
                 )}>
                   {trx.type === 'withdraw' ? <ArrowUpRight size={18} className="md:size-24" /> : 
                    trx.type === 'reward' ? <Zap size={18} className="md:size-24" fill="currentColor" /> : <ArrowDownLeft size={18} className="md:size-24" />}
                 </div>
                 <div className="overflow-hidden">
                    <div className="flex items-center gap-1.5">
                       <h3 className="font-black text-slate-800 text-[10px] md:text-base capitalize leading-none truncate">{trx.type}</h3>
                       {trx.note && <Info size={10} className="text-rose-400 shrink-0" />}
                    </div>
                    <p className="text-[7px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-1.5 leading-none">
                      {trx.date} <span className="w-1 h-1 rounded-full bg-slate-200" /> <span className="text-slate-900 truncate max-w-[60px] md:max-w-none">{trx.gateway}</span>
                    </p>
                 </div>
              </div>
              <div className="text-right shrink-0 ml-2">
                 <p className={clsx("text-xs md:text-xl font-black mb-1 md:mb-1.5 tracking-tight", trx.type === 'withdraw' ? "text-slate-900" : "text-green-600")}>
                   {trx.type === 'withdraw' ? '-' : '+'}Rs {Number(trx.amount || 0).toLocaleString()}
                 </p>
                 <div className={clsx(
                   "inline-flex items-center gap-1 md:gap-2 px-1.5 md:px-4 py-0.5 md:py-1.5 rounded-full text-[6px] md:text-[9px] font-black uppercase tracking-widest border",
                   trx.status === 'approved' ? "bg-green-50 text-green-600 border-green-100" :
                   trx.status === 'pending' ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-rose-50 text-rose-600 border-rose-100"
                 )}>
                   <div className={clsx("w-1 h-1 md:w-1.5 md:h-1.5 rounded-full", trx.status === 'approved' ? "bg-green-500" : trx.status === 'pending' ? "bg-amber-500 animate-pulse" : "bg-rose-500")} />
                   {trx.status}
                 </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="bg-white p-12 md:p-20 rounded-[32px] md:rounded-[44px] border border-slate-100 text-center flex flex-col items-center">
             <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-50 rounded-full flex items-center justify-center text-xl md:text-2xl mb-4">📭</div>
             <p className="text-slate-300 font-black uppercase tracking-[0.2em] text-[8px] md:text-[10px]">No ledger entries match your filter</p>
          </div>
        )}
      </div>

      {/* Record Information Section */}
      <div className="p-6 md:p-8 bg-slate-900 text-white rounded-[32px] md:rounded-[40px] relative overflow-hidden px-1 mx-1">
         <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 scale-125"><ShieldCheck size={64} /></div>
         <div className="relative z-10 p-2 md:p-0">
            <h4 className="font-black text-[10px] md:text-sm uppercase tracking-widest mb-3 md:mb-4 flex items-center gap-2 text-sky-400">
               <Info size={14} className="md:size-16" /> Record Transparency
            </h4>
            <p className="text-[8px] md:text-[11px] font-medium text-slate-400 leading-relaxed max-w-lg">
               Financial records are synchronized with our core nodes every 60 seconds. 
               Withdrawal processing windows: 10:00 AM - 12:00 PM and 06:00 PM - 08:00 PM PST. 
               Rejected transactions result in instant refund to your system wallet.
            </p>
         </div>
      </div>

      {/* Invoice Modal Integration */}
      <InvoiceModal 
        isOpen={!!selectedTrx}
        onClose={() => setSelectedTrx(null)}
        transaction={selectedTrx}
      />
    </div>
  );
};

export default Transactions;
