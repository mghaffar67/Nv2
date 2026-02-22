import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, Zap, History, CreditCard,
  Plus, TrendingUp, ChevronLeft, ArrowRight,
  CheckCircle2, XCircle, RefreshCw, Loader2, Info,
  ArrowUpRight, ArrowDownLeft, BarChart3
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';

const Wallet = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await api.get('/finance/history');
      setTransactions(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Ledger offline.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-24 animate-fade-in px-1">
      <header className="flex items-center justify-between pt-2 px-1">
        <Link to="/user/dashboard" className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 active:scale-90 transition-all">
          <ChevronLeft size={18} />
        </Link>
        <h1 className="text-lg font-black text-slate-800 uppercase italic tracking-tighter leading-none">Wallet <span className="text-indigo-600">Sync.</span></h1>
        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-sky-400 shadow-md">
          <CreditCard size={16} />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
         <div className="lg:col-span-5 space-y-4">
            {/* Balance Card - Refined */}
            <div className="bg-slate-950 p-6 md:p-8 rounded-[32px] text-white shadow-xl relative overflow-hidden h-fit border border-white/5">
              <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12 scale-125 text-indigo-400 pointer-events-none">
                <Zap size={100} fill="currentColor" />
              </div>
              <div className="relative z-10">
                 <div className="flex justify-between items-center mb-8">
                    <div className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-[7px] font-black uppercase tracking-widest text-indigo-300 border border-white/5 backdrop-blur-md">
                       <ShieldCheck size={10} /> Secure Node
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-400">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                       <span className="text-[7px] font-black uppercase tracking-widest italic">Encrypted</span>
                    </div>
                 </div>
                 
                 <div className="space-y-1 mb-10">
                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.2em] italic">LIQUID LIQUIDITY</p>
                    <h1 className="text-4xl font-black tracking-tighter leading-none italic flex items-baseline">
                      <span className="text-lg text-emerald-400 mr-1 not-italic font-black">Rs.</span>
                      {(user?.balance || 0).toLocaleString()}
                    </h1>
                 </div>

                 <div className="grid grid-cols-2 gap-2">
                    <Link to="/user/wallet/withdraw" className="h-10 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-black text-[9px] uppercase tracking-widest shadow-lg flex items-center justify-center gap-1.5 active:scale-95 transition-all">
                       <ArrowUpRight size={14} /> Payout
                    </Link>
                    <Link to="/user/wallet/deposit" className="h-10 bg-white/10 text-white border border-white/10 rounded-lg font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-1.5 active:scale-95 transition-all hover:bg-white/20">
                       <Plus size={14} /> Funding
                    </Link>
                 </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex gap-3 items-start">
               <Info size={16} className="text-indigo-600 shrink-0 mt-0.5" />
               <div>
                 <h4 className="text-[9px] font-black text-slate-800 uppercase italic leading-none mb-1.5">Disbursement Protocol</h4>
                 <p className="text-[7px] text-slate-400 font-bold uppercase leading-relaxed tracking-wider">
                   Funds arrive within 24 hours. Minimum PKR 500 required for manual authorization.
                 </p>
               </div>
            </div>
         </div>

         <div className="lg:col-span-7 h-full">
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-5 md:p-6 flex flex-col h-full min-h-[450px]">
               <div className="flex items-center justify-between mb-6 border-b border-slate-50 pb-5">
                  <div>
                    <h3 className="text-base font-black text-slate-800 uppercase italic tracking-tighter leading-none">Ledger.</h3>
                    <p className="text-[7px] font-bold text-slate-400 uppercase mt-1 italic tracking-widest">Transaction History Stream</p>
                  </div>
                  <button onClick={fetchHistory} className="p-2 bg-slate-50 text-slate-400 rounded-lg transition-all hover:bg-indigo-50 hover:text-indigo-600">
                    <RefreshCw size={16} className={clsx(loading && "animate-spin text-indigo-500")} />
                  </button>
               </div>

               <div className="space-y-1.5 flex-grow">
                  {loading ? (
                    <div className="py-24 text-center">
                       <Loader2 size={24} className="animate-spin text-indigo-500 mx-auto opacity-30" />
                       <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-3 italic">Syncing Protocol...</p>
                    </div>
                  ) : transactions.length > 0 ? (
                    transactions.map((trx) => (
                      <div 
                        key={trx.id}
                        className="p-3.5 bg-slate-50/50 rounded-2xl flex items-center justify-between border border-transparent hover:border-slate-100 hover:bg-white transition-all group"
                      >
                         <div className="flex items-center gap-3">
                            <div className={clsx(
                              "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-inner transition-transform group-hover:scale-105",
                              trx.type === 'withdraw' ? "bg-rose-50 text-rose-500" : "bg-emerald-50 text-emerald-600"
                            )}>
                               {trx.type === 'withdraw' ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                            </div>
                            <div className="overflow-hidden">
                               <h4 className="font-black text-slate-800 text-[9px] uppercase leading-none mb-1 italic truncate">{trx.gateway || trx.type}</h4>
                               <div className="flex items-center gap-2">
                                  <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">{trx.date}</span>
                                  <span className={clsx("text-[6px] font-black uppercase px-1 py-0.2 rounded border", 
                                    trx.status === 'approved' ? "text-emerald-500 border-emerald-100 bg-emerald-50/50" : 
                                    trx.status === 'pending' ? "text-amber-500 border-amber-100 bg-amber-50/50" : 
                                    "text-rose-500 border-rose-100 bg-rose-50/50")}>
                                     {trx.status}
                                  </span>
                               </div>
                            </div>
                         </div>
                         <div className="text-right">
                            <p className={clsx("font-black text-[13px] italic tracking-tight", trx.type === 'withdraw' ? "text-slate-900" : "text-emerald-600")}>
                               {trx.type === 'withdraw' ? '-' : '+'} {trx.amount?.toLocaleString()}
                            </p>
                            <p className="text-[6px] font-bold text-slate-300 uppercase mt-0.5">#{trx.id?.slice(-6)}</p>
                         </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-24 text-center opacity-30 flex flex-col items-center gap-3">
                       <BarChart3 size={32} className="text-slate-200" />
                       <p className="text-[9px] font-black uppercase tracking-[0.4em] italic leading-none">No Transaction Node Logged</p>
                    </div>
                  )}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Wallet;