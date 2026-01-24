
import React, { useMemo, useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Wallet, Zap, ArrowUpRight, Plus, RefreshCw, 
  History as HistoryIcon, Network, ClipboardList, 
  Megaphone, X, ArrowDownCircle, ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import StreakWidget from '../../components/user/StreakWidget';
import { api } from '../../utils/api';
import { useConfig } from '../../context/ConfigContext';

const UserDashboard = () => {
  const { user } = useAuth();
  const { config } = useConfig();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBroadcast, setShowBroadcast] = useState(true);

  const syncData = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const historyRes = await api.get('/finance/history');
      setTransactions(Array.isArray(historyRes) ? historyRes : []);
    } catch (e) { 
      setTransactions([]);
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { 
    syncData();
    window.addEventListener('noor_db_update', syncData);
    return () => window.removeEventListener('noor_db_update', syncData);
  }, [user?.id]);

  return (
    <div className="w-full px-1 pb-32 space-y-4 max-w-md mx-auto animate-fade-in">
      
      <div className="bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm mx-1 relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12 scale-150 text-indigo-600"><ShieldCheck size={70}/></div>
         <div className="flex justify-between items-center mb-3 relative z-10">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shadow-inner">
                  <Wallet size={16} />
               </div>
               <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Total Balance</span>
            </div>
            <button onClick={syncData} className={clsx("p-2 bg-slate-50 rounded-xl text-slate-300", loading && "animate-spin")}><RefreshCw size={12}/></button>
         </div>
         
         <div className="text-center py-2 relative z-10">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic">
               <span className="text-sm text-indigo-500 mr-1 not-italic font-bold">Rs.</span>
               {(user?.balance || 0).toLocaleString()}
            </h2>
         </div>

         <div className="grid grid-cols-2 gap-2 mt-6 relative z-10">
            <Link to="/user/wallet/withdraw" className="h-11 bg-slate-950 text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all">
               <ArrowUpRight size={14}/> Withdraw
            </Link>
            <Link to="/user/plans" className="h-11 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all">
               <Plus size={14}/> Buy Plan
            </Link>
         </div>
      </div>

      <div className="grid grid-cols-4 gap-2 px-1">
         <QuickItem label="Task" icon={ClipboardList} to="/user/work" bg="bg-white text-indigo-600" />
         <QuickItem label="Team" icon={Network} to="/user/team" bg="bg-white text-sky-600" />
         <QuickItem label="History" icon={HistoryIcon} to="/user/history" bg="bg-white text-slate-600" />
         <QuickItem label="Profile" icon={ArrowDownCircle} to="/user/settings" bg="bg-white text-emerald-600" />
      </div>

      <StreakWidget />

      <div className="mx-1 space-y-2.5 pt-2">
         <div className="flex items-center justify-between px-2">
            <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><HistoryIcon size={12}/> Recent Transactions</h3>
            <Link to="/user/history" className="text-[8px] font-black text-indigo-600 uppercase">View All</Link>
         </div>
         <div className="space-y-2">
            {transactions.slice(0, 3).map(trx => (
               <div key={trx.id} className="bg-white p-3.5 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3 overflow-hidden">
                     <div className={clsx("w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-inner", trx.type === 'withdraw' ? "bg-rose-50 text-rose-500" : "bg-emerald-50 text-emerald-600")}>
                        {trx.type === 'withdraw' ? <ArrowUpRight size={14}/> : <Zap size={14} fill="currentColor"/>}
                     </div>
                     <div className="overflow-hidden">
                        <h4 className="text-[9px] font-black text-slate-800 uppercase truncate">{trx.gateway || trx.type}</h4>
                        <p className="text-[7px] text-slate-400 font-bold uppercase tracking-tighter">{trx.status}</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className={clsx("font-black text-[10px] italic leading-none mb-1", trx.type === 'withdraw' ? "text-slate-900" : "text-emerald-600")}>
                        {trx.type === 'withdraw' ? '-' : '+'}Rs {trx.amount}
                     </p>
                  </div>
               </div>
            ))}
            {transactions.length === 0 && !loading && (
               <div className="py-10 text-center bg-slate-50/50 rounded-[24px] border border-dashed border-slate-200">
                  <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">No transactions yet</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

const QuickItem = ({ label, icon: Icon, to, bg }: any) => (
  <Link to={to} className="flex flex-col items-center gap-1.5 group">
     <div className={clsx("w-14 h-14 rounded-2xl flex items-center justify-center transition-all active:scale-90 shadow-sm border border-slate-50", bg)}>
        <Icon size={20} />
     </div>
     <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
  </Link>
);

export default UserDashboard;
