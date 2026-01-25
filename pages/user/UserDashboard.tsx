
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Wallet, Zap, ArrowUpRight, Plus, RefreshCw, 
  History as HistoryIcon, Network, ClipboardList, 
  ShieldCheck, CheckCircle2, ChevronRight, UserPlus,
  /* Add missing Award icon */
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import StreakWidget from '../../components/user/StreakWidget';
import { api } from '../../utils/api';

const AnimatedBalance = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const prevValue = useRef(0);

  useEffect(() => {
    let start = prevValue.current;
    const end = value;
    const duration = 1000;
    const startTime = performance.now();

    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(start + progress * (end - start));
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        prevValue.current = value;
      }
    };

    requestAnimationFrame(update);
  }, [value]);

  return <span>{displayValue.toLocaleString()}</span>;
};

const UserDashboard = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    <div className="w-full px-1 pb-32 space-y-4 max-w-2xl mx-auto animate-fade-in">
      
      {/* 1. Main Wallet Card */}
      <div className="bg-white p-5 md:p-8 rounded-[28px] md:rounded-[40px] border border-slate-100 shadow-sm mx-1 relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-6 opacity-[0.03] rotate-12 scale-[2] text-indigo-600 pointer-events-none"><ShieldCheck size={100}/></div>
         <div className="flex justify-between items-center mb-4 relative z-10">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shadow-inner">
                  <Wallet size={16} />
               </div>
               <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Total Available Liquidity</span>
            </div>
            <button onClick={syncData} className={clsx("p-2 bg-slate-50 rounded-xl text-slate-300 hover:text-indigo-600 transition-colors", loading && "animate-spin")}><RefreshCw size={12}/></button>
         </div>
         
         <div className="text-center py-4 relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter italic">
               <span className="text-sm md:text-xl text-indigo-500 mr-1 not-italic font-bold">Rs.</span>
               <AnimatedBalance value={user?.balance || 0} />
            </h2>
         </div>

         <div className="grid grid-cols-2 gap-2 mt-6 relative z-10">
            <Link to="/user/wallet/withdraw" className="h-11 md:h-14 bg-slate-950 text-white rounded-xl md:rounded-2xl text-[9px] md:text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all">
               <ArrowUpRight size={14}/> Withdraw
            </Link>
            <Link to="/user/plans" className="h-11 md:h-14 bg-indigo-600 text-white rounded-xl md:rounded-2xl text-[9px] md:text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all">
               <Plus size={14}/> Upgrade Hub
            </Link>
         </div>
      </div>

      {/* 2. Grid of Small Attractive Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 px-1">
         <Link to="/user/work" className="bg-white p-4 rounded-3xl border border-slate-100 flex flex-col items-center gap-2 active:scale-95 transition-all shadow-sm">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shadow-inner"><ClipboardList size={20}/></div>
            <span className="text-[8px] font-black uppercase text-slate-400">Tasks</span>
         </Link>
         <Link to="/user/team" className="bg-white p-4 rounded-3xl border border-slate-100 flex flex-col items-center gap-2 active:scale-95 transition-all shadow-sm">
            <div className="w-10 h-10 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center shadow-inner"><Network size={20}/></div>
            <span className="text-[8px] font-black uppercase text-slate-400">Network</span>
         </Link>
         <Link to="/user/history" className="bg-white p-4 rounded-3xl border border-slate-100 flex flex-col items-center gap-2 active:scale-95 transition-all shadow-sm">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shadow-inner"><HistoryIcon size={20}/></div>
            <span className="text-[8px] font-black uppercase text-slate-400">Ledger</span>
         </Link>
         <Link to="/user/settings" className="bg-white p-4 rounded-3xl border border-slate-100 flex flex-col items-center gap-2 active:scale-95 transition-all shadow-sm">
            <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center shadow-inner"><Zap size={20}/></div>
            <span className="text-[8px] font-black uppercase text-slate-400">Profile</span>
         </Link>
      </div>

      <StreakWidget />

      {/* 3. Workflow Guidance Cards */}
      <div className="mx-1 pt-4 space-y-3">
         <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2">Growth Protocol</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <WorkflowItem 
              icon={Award} title="Upgrade Station" 
              desc="Select a plan to unlock higher daily yield." 
              to="/user/plans" color="bg-indigo-600" 
            />
            <WorkflowItem 
              icon={UserPlus} title="Invite Friends" 
              desc="Get up to 15% instant commission from direct team." 
              to="/user/team" color="bg-emerald-500" 
            />
         </div>
      </div>

      {/* 4. Transaction Feed */}
      <div className="mx-1 space-y-3 pt-4">
         <div className="flex items-center justify-between px-2">
            <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><HistoryIcon size={12}/> Activity Feed</h3>
            <Link to="/user/history" className="text-[8px] font-black text-indigo-600 uppercase">View All Logs</Link>
         </div>
         <div className="space-y-2">
            {transactions.slice(0, 3).map(trx => (
               <div key={trx.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm group hover:border-indigo-100 transition-colors">
                  <div className="flex items-center gap-3">
                     <div className={clsx("w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-inner", trx.type === 'withdraw' ? "bg-rose-50 text-rose-500" : "bg-emerald-50 text-emerald-600")}>
                        {trx.type === 'withdraw' ? <ArrowUpRight size={16}/> : <Zap size={16} fill="currentColor"/>}
                     </div>
                     <div>
                        <h4 className="text-[10px] font-black text-slate-800 uppercase leading-none mb-1">{trx.gateway || trx.type}</h4>
                        <p className="text-[7px] text-slate-400 font-bold uppercase tracking-widest">{trx.status}</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className={clsx("font-black text-xs italic leading-none mb-1", trx.type === 'withdraw' ? "text-slate-900" : "text-emerald-600")}>
                        {trx.type === 'withdraw' ? '-' : '+'}Rs {trx.amount}
                     </p>
                  </div>
               </div>
            ))}
            {transactions.length === 0 && !loading && (
               <div className="py-12 text-center bg-slate-50/50 rounded-[28px] border border-dashed border-slate-200">
                  <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">No packet records found</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

const WorkflowItem = ({ icon: Icon, title, desc, to, color }: any) => (
  <Link to={to} className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm flex items-start gap-4 active:scale-[0.98] transition-all group hover:border-indigo-100">
     <div className={clsx("w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg group-hover:scale-110 transition-transform", color)}>
        <Icon size={18} />
     </div>
     <div className="overflow-hidden">
        <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-tight flex items-center gap-1">
           {title} <ChevronRight size={10} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
        </h4>
        <p className="text-[8px] font-medium text-slate-400 leading-relaxed mt-1">{desc}</p>
     </div>
  </Link>
);

export default UserDashboard;
