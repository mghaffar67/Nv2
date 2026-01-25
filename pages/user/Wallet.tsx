
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, Zap, History, Banknote, 
  ArrowUpRight, ArrowDownLeft,
  Clock, Loader2, Info, CreditCard,
  Plus, TrendingUp
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';

const Wallet = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await api.get('/finance/history');
        setTransactions(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error("Ledger sync failure.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="max-w-md mx-auto space-y-4 pb-24 animate-fade-in px-1">
      
      <div className="bg-slate-950 p-6 rounded-[32px] text-white shadow-xl relative overflow-hidden mx-1 border border-white/5">
        <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 scale-110 text-sky-400 pointer-events-none">
          <CreditCard size={100} />
        </div>
        <div className="relative z-10">
           <div className="flex justify-between items-center mb-4">
              <div className="inline-flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-full text-[7px] font-black uppercase tracking-widest text-indigo-400 border border-white/5 backdrop-blur-sm">
                 <ShieldCheck size={10} /> SECURE ACCOUNT
              </div>
              <div className="flex items-center gap-1">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                 <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Live Ledger</span>
              </div>
           </div>
           
           <div className="flex items-center justify-between">
              <div>
                 <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1 italic">Available Balance</p>
                 <h1 className="text-4xl font-black tracking-tighter leading-none italic">
                   <span className="text-xl text-emerald-400 mr-1 italic font-black">Rs.</span>
                   {(user?.balance || 0).toLocaleString()}
                 </h1>
              </div>
              <div className="flex flex-col items-end gap-1">
                 <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest">{user?.currentPlan || 'None'}</p>
                 <Link to="/user/plans" className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-all border border-indigo-400/20">
                    <Plus size={20} className="text-white" />
                 </Link>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mx-1">
         <Link to="/user/wallet/withdraw" className="group bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm flex flex-col gap-3 active:scale-95 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
               <Banknote size={20} />
            </div>
            <div>
               <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Payout Request</h4>
               <p className="text-[7px] font-bold text-slate-400 uppercase mt-0.5">Withdraw Earnings</p>
            </div>
         </Link>
         <Link to="/user/history" className="group bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm flex flex-col gap-3 active:scale-95 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors">
               <History size={20} />
            </div>
            <div>
               <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Full Ledger</h4>
               <p className="text-[7px] font-bold text-slate-400 uppercase mt-0.5">History Audit</p>
            </div>
         </Link>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm mx-1 p-5">
         <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-3">
            <h3 className="text-[9px] font-black text-slate-800 uppercase tracking-widest italic flex items-center gap-1.5">
              <TrendingUp size={12} className="text-indigo-500" /> Recent Transactions
            </h3>
            <Link to="/user/history" className="text-[8px] font-black text-indigo-600 uppercase tracking-widest">View All</Link>
         </div>

         <div className="space-y-1">
            {loading ? (
              <div className="py-12 text-center flex flex-col items-center gap-2">
                 <Loader2 size={20} className="animate-spin text-indigo-500" />
                 <p className="text-[7px] font-black text-slate-300 uppercase tracking-widest">Syncing...</p>
              </div>
            ) : transactions.length > 0 ? (
              transactions.slice(0, 4).map((trx) => (
                <div key={trx.id} className="p-3 bg-slate-50/50 rounded-2xl flex items-center justify-between border border-transparent hover:border-slate-100 transition-all">
                   <div className="flex items-center gap-3">
                      <div className={clsx(
                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                        trx.type === 'withdraw' ? "bg-rose-50 text-rose-500" : "bg-emerald-50 text-emerald-600"
                      )}>
                         {trx.type === 'withdraw' ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                      </div>
                      <div>
                         <h4 className="font-black text-slate-800 text-[9px] uppercase leading-none mb-1">{trx.gateway || trx.type}</h4>
                         <p className="text-[6px] font-bold text-slate-400 uppercase">{trx.date}</p>
                      </div>
                   </div>
                   <p className={clsx("font-black text-[10px] italic", trx.type === 'withdraw' ? "text-slate-900" : "text-emerald-600")}>
                     {trx.type === 'withdraw' ? '-' : '+'}Rs {trx.amount}
                   </p>
                </div>
              ))
            ) : (
              <div className="py-12 text-center flex flex-col items-center gap-2 border-2 border-dashed border-slate-50 rounded-2xl">
                 <Info size={16} className="text-slate-200" />
                 <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">No Records Found</p>
              </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default Wallet;
