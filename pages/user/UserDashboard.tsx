
import React, { useMemo, useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Wallet, TrendingUp, Zap, ArrowUpRight, Plus, 
  History as HistoryIcon, ArrowRight, Users, 
  MessageCircle, Info, ArrowDownCircle, ArrowUpCircle, 
  RefreshCw, Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import StreakWidget from '../../components/user/StreakWidget';
import { api } from '../../utils/api';

const QuickAction = ({ label, icon: Icon, to, color }: any) => (
  <Link to={to} className="flex flex-col items-center gap-2 group shrink-0">
    <div className={clsx("w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-md active:scale-90 group-hover:scale-105", color)}>
      <Icon size={22} className="text-white" />
    </div>
    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
  </Link>
);

const UserDashboard = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const syncData = async () => {
    if (!user?.id) return;
    setRefreshing(true);
    try {
      // Sync fresh user state to detect bans or balance changes
      const meData = await api.get('/auth/me');
      if (meData?.user) {
        localStorage.setItem('noor_user', JSON.stringify(meData.user));
      }
      
      const res = await api.get(`/finance/history`);
      setTransactions(Array.isArray(res) ? res : []);
    } catch (e: any) {
      console.error("Dashboard sync failure context:", e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    syncData();
  }, [user?.id]);

  const stats = useMemo(() => {
    const approved = transactions.filter(t => t.status === 'approved');
    const lifetime = approved.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    const pending = transactions.filter(t => t.status === 'pending').length;
    return { lifetime, pending };
  }, [transactions]);

  const isPlanActive = user?.currentPlan && user.currentPlan !== 'None';

  return (
    <div className="space-y-4 pb-24 animate-fade-in relative">
      
      {/* 1. ELITE BALANCE CARD - DYNAMIC BINDING */}
      <div className="bg-slate-900 p-6 md:p-10 rounded-[40px] text-white relative overflow-hidden shadow-2xl border border-white/5">
         <div className="absolute top-0 right-0 p-4 opacity-[0.03] scale-[1.5] pointer-events-none text-sky-400"><Wallet size={120} /></div>
         
         <div className="relative z-10 flex flex-col items-center text-center">
            <button 
              onClick={syncData}
              className={clsx("absolute top-0 right-0 p-4 text-white/20 hover:text-white transition-all", refreshing && "animate-spin")}
            >
              <RefreshCw size={18} />
            </button>

            <div className={clsx(
              "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 mb-6 border",
              isPlanActive ? "bg-indigo-500/20 text-indigo-400 border-indigo-500/30" : "bg-rose-500/20 text-rose-400 border-rose-500/30"
            )}>
               <div className={clsx("w-2 h-2 rounded-full", isPlanActive ? "bg-green-500 animate-pulse" : "bg-rose-50")} />
               {user?.currentPlan || 'NO ACTIVE PLAN'}
            </div>
            
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-3">Total Balance (PKR)</p>
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-none mb-10">
              <span className="text-xl text-sky-500 mr-2 italic font-black">Rs.</span>
              {(user?.balance || 0).toLocaleString()}
            </h2>

            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
               <Link to="/user/wallet" className="h-14 bg-sky-500 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 shadow-xl shadow-sky-500/20">
                 <Plus size={16} /> Add Funds
               </Link>
               <Link to="/user/wallet" className="h-14 bg-white/10 backdrop-blur-md rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 border border-white/5">
                 Withdraw <ArrowUpRight size={16} />
               </Link>
            </div>
         </div>
      </div>

      {/* 2. QUICK ACTIONS */}
      <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm overflow-x-auto no-scrollbar">
         <div className="flex justify-around items-center min-w-[300px] gap-4">
            <QuickAction label="Deposit" icon={ArrowDownCircle} to="/user/wallet" color="bg-emerald-500" />
            <QuickAction label="Withdraw" icon={ArrowUpCircle} to="/user/wallet" color="bg-indigo-600" />
            <QuickAction label="Daily Work" icon={Zap} to="/user/work" color="bg-amber-500" />
            <QuickAction label="Help" icon={MessageCircle} to="/support" color="bg-sky-500" />
         </div>
      </div>

      {/* 3. DYNAMIC STATS GRID - AUDITED GRID COLS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
         <StatCard label="EARNED" value={`Rs ${stats.lifetime}`} icon={TrendingUp} color="bg-emerald-50" text="text-emerald-600" />
         <StatCard label="PENDING" value={stats.pending} icon={Clock} color="bg-amber-50" text="text-amber-600" />
         <StatCard label="STREAK" value={`${user?.streak || 0} Days`} icon={Zap} color="bg-indigo-50" text="text-indigo-600" />
         <StatCard label="NETWORK" value="Real-time" icon={Users} color="bg-sky-50" text="text-sky-600" />
      </div>

      {/* 4. CHECK-IN */}
      <StreakWidget />

      {/* 5. RECENT ACTIVITY */}
      <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
         <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
               <div className="p-2 bg-slate-900 rounded-xl text-sky-400"><HistoryIcon size={14}/></div>
               <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest italic">Ledger Sync</h3>
            </div>
            <Link to="/user/history" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1">Full History <ArrowRight size={12}/></Link>
         </div>

         <div className="space-y-2.5">
            {transactions.slice(0, 4).map((trx) => (
              <div key={trx.id} className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between active:scale-98 transition-all border border-transparent hover:border-slate-100">
                 <div className="flex items-center gap-4">
                    <div className={clsx(
                      "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                      trx.type === 'withdraw' ? "bg-white text-rose-500" : "bg-white text-emerald-500"
                    )}>
                      {trx.type === 'withdraw' ? <ArrowUpRight size={18}/> : <Zap size={18} fill="currentColor" />}
                    </div>
                    <div>
                       <p className="font-black text-slate-800 text-[11px] uppercase leading-none">{trx.type}</p>
                       <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">{trx.date}</p>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className={clsx("font-black text-sm", trx.type === 'withdraw' ? "text-slate-900" : "text-emerald-600")}>Rs {trx.amount}</p>
                    <span className={clsx("text-[8px] font-black uppercase tracking-tighter", trx.status === 'approved' ? "text-emerald-500" : "text-amber-500")}>{trx.status}</span>
                 </div>
              </div>
            ))}
            {!loading && transactions.length === 0 && (
              <div className="py-14 text-center text-slate-300 font-bold uppercase text-[10px] tracking-widest flex flex-col items-center gap-4">
                 <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 shadow-inner"><Info size={28}/></div>
                 No Ledger Events Found
              </div>
            )}
         </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, color, text }: any) => (
  <div className="bg-white p-4 md:p-6 rounded-[28px] border border-slate-100 shadow-sm flex flex-col gap-4 active:scale-95 transition-all">
     <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", color, text)}>
        <Icon size={20} />
     </div>
     <div className="overflow-hidden">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{label}</p>
        <p className="text-sm font-black text-slate-900 leading-none truncate">{value}</p>
     </div>
  </div>
);

export default UserDashboard;
