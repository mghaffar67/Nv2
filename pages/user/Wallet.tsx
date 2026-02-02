
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, Zap, History, Banknote, 
  ArrowUpRight, ArrowDownLeft,
  Clock, Loader2, Info, CreditCard,
  Plus, TrendingUp, ChevronLeft, ArrowRight,
  // Added missing RefreshCw icon import
  CheckCircle2, XCircle, RefreshCw
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
      console.error("Statement sync failure.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 animate-fade-in px-1">
      
      <header className="flex items-center justify-between px-2 pt-2 lg:hidden">
        <Link to="/user/dashboard" className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 active:scale-90 transition-all"><ChevronLeft size={20} /></Link>
        <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">Mera <span className="text-indigo-600">Wallet</span></h1>
        <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-sky-400 shadow-lg"><CreditCard size={16} /></div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
         {/* Balance Section */}
         <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-950 p-8 rounded-[44px] text-white shadow-2xl relative overflow-hidden border border-white/5 h-fit">
              <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 scale-110 text-sky-400 pointer-events-none">
                <CreditCard size={120} />
              </div>
              <div className="relative z-10">
                 <div className="flex justify-between items-center mb-8">
                    <div className="inline-flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest text-indigo-400 border border-white/5 backdrop-blur-sm">
                       <ShieldCheck size={12} /> SECURE ACCOUNT
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400">
                       <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                       <span className="text-[9px] font-black uppercase tracking-widest">Active</span>
                    </div>
                 </div>
                 
                 <div className="space-y-2 mb-10">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] italic">Available Balance</p>
                    <h1 className="text-5xl font-black tracking-tighter leading-none italic">
                      <span className="text-2xl text-emerald-400 mr-2 italic font-black">Rs.</span>
                      {(user?.balance || 0).toLocaleString()}
                    </h1>
                 </div>

                 <div className="grid grid-cols-1 gap-3">
                    <Link to="/user/wallet/withdraw" className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3">
                       Withdraw Funds <ArrowRight size={18} />
                    </Link>
                    <Link to="/user/plans" className="w-full h-12 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                       Upgrade Station <Plus size={16} />
                    </Link>
                 </div>
              </div>
            </div>

            <div className="bg-indigo-50/50 p-6 rounded-[36px] border border-indigo-100 space-y-4">
               <h4 className="text-[10px] font-black text-indigo-900 uppercase tracking-widest flex items-center gap-2">
                  <Info size={16} /> Important Info
               </h4>
               <p className="text-[9px] text-indigo-700 font-bold uppercase leading-relaxed tracking-wider italic">
                 Withdrawals are processed within 24 hours. Minimal withdrawal amount is Rs. 500. Verification occurs daily between 10 AM to 10 PM.
               </p>
            </div>
         </div>

         {/* History Section */}
         <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-[44px] border border-slate-100 shadow-sm p-6 md:p-8">
               <div className="flex items-center justify-between mb-8 border-b border-slate-50 pb-6">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-slate-900 text-sky-400 rounded-2xl flex items-center justify-center shadow-lg"><History size={24} /></div>
                     <div>
                        <h3 className="text-lg font-black text-slate-800 uppercase italic">Kamai ka Hisab</h3>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Transaction History & Statements</p>
                     </div>
                  </div>
                  <button onClick={fetchHistory} className="p-2.5 hover:bg-slate-50 rounded-xl transition-all"><RefreshCw size={20} className={clsx(loading && "animate-spin text-indigo-500")} /></button>
               </div>

               <div className="space-y-3 min-h-[400px]">
                  {loading ? (
                    <div className="py-24 text-center flex flex-col items-center gap-4">
                       <Loader2 size={32} className="animate-spin text-indigo-500 opacity-20" />
                       <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Retrieving Statements...</p>
                    </div>
                  ) : transactions.length > 0 ? (
                    transactions.map((trx, idx) => (
                      <motion.div 
                        key={trx.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}
                        className="p-4 bg-slate-50/50 rounded-3xl flex items-center justify-between border border-transparent hover:border-slate-100 hover:bg-white hover:shadow-lg transition-all group"
                      >
                         <div className="flex items-center gap-4">
                            <div className={clsx(
                              "w-12 h-12 rounded-[20px] flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110",
                              trx.type === 'withdraw' ? "bg-rose-50 text-rose-500" : "bg-emerald-50 text-emerald-600"
                            )}>
                               {trx.status === 'rejected' ? <XCircle size={22} /> : trx.type === 'withdraw' ? <ArrowUpRight size={22} /> : <CheckCircle2 size={22} />}
                            </div>
                            <div>
                               <h4 className="font-black text-slate-800 text-[11px] uppercase leading-none mb-2">{trx.gateway || trx.type}</h4>
                               <div className="flex items-center gap-2">
                                  <span className="text-[7px] font-bold text-slate-400 uppercase">{trx.date}</span>
                                  <span className="w-1 h-1 rounded-full bg-slate-200" />
                                  <span className={clsx("text-[7px] font-black uppercase px-1.5 py-0.5 rounded border", trx.status === 'approved' ? "text-emerald-600 border-emerald-100 bg-emerald-50" : trx.status === 'pending' ? "text-amber-600 border-amber-100 bg-amber-50" : "text-rose-600 border-rose-100 bg-rose-50")}>{trx.status}</span>
                               </div>
                            </div>
                         </div>
                         <div className="text-right">
                            <p className={clsx("font-black text-sm italic mb-1", trx.type === 'withdraw' ? "text-slate-900" : "text-emerald-600")}>
                               {trx.type === 'withdraw' ? '-' : '+'} Rs {trx.amount?.toLocaleString()}
                            </p>
                            <p className="text-[7px] font-bold text-slate-300 uppercase tracking-widest">Ref: {trx.id?.slice(-8)}</p>
                         </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="py-32 text-center flex flex-col items-center gap-4 opacity-40">
                       <History size={64} className="text-slate-200" />
                       <p className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Your Statement is empty.</p>
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
