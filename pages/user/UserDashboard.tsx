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
  <Link to={to} className="flex flex-col items-center gap-1.5 group shrink-0">
    <div className={clsx("w-11 h-11 rounded-xl flex items-center justify-center transition-all shadow-md active:scale-90 group-hover:scale-105", color)}>
      <Icon size={16} className="text-white" />
    </div>
    <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
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
      const meData = await api.get('/auth/me');
      if (meData?.user) {
        localStorage.setItem('noor_user', JSON.stringify(meData.user));
      }
      const res = await api.get(`/finance/history`);
      setTransactions(Array.isArray(res) ? res : []);
    } catch (e: any) {
      console.error("Dashboard sync failure:", e.message);
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
    <div className="space-y-3 pb-24 animate-fade-in relative px-1 max-w-md mx-auto">
      
      {/* 1. BALANCE CARD - OPTIMIZED */}
      <div className="bg-slate-950 p-6 rounded-[36px] text-white relative overflow-hidden shadow-2xl border border-white/5 mx-0.5">
         <div className="absolute top-0 right-0 p-3 opacity-[0.03] scale-[1.2] pointer-events-none text-sky-400"><Wallet size={100} /></div>
         
         <div className="relative z-10 flex flex-col items-center text-center">
            <button 
              onClick={syncData}
              className={clsx("absolute top-0 right-0 p-1 text-white/20 hover:text-white transition-all", refreshing && "animate-spin")}
            >
              <RefreshCw size={14} />
            </button>

            <div className={clsx(
              "px-3 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest flex items-center gap-1.5 mb-4 border",
              isPlanActive ? "bg-indigo-500/20 text-indigo-400 border-indigo-500/30" : "bg-rose-500/20 text-rose-400 border-rose-500/30"
            )}>
               <div className={clsx("w-1.5 h-1.5 rounded-full", isPlanActive ? "bg-green-500 animate-pulse" : "bg-rose-500")} />
               {user?.currentPlan || 'NO ACTIVE PLAN'}
            </div>
            
            <p className="text-[7px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-1 italic">Ledger Balance</p>
            <h2 className="text-2xl md:text-3xl font-black tracking-tighter leading-none mb-6">
              <span className="text-sm text-emerald-400 mr-1 italic font-black">Rs.</span>
              {(user?.balance || 0).toLocaleString()}
            </h2>

            <div className="grid grid-cols-2 gap-2 w-full max-w-[280px]">
               <Link to="/user/wallet" className="h-10 bg-indigo-600 rounded-xl font-black text-[8px] uppercase tracking-widest flex items-center justify-center gap-1.5 active:scale-95 shadow-xl transition-all">
                 <Plus size={14} /> Deposit
               </Link>
               <Link to="/user/wallet" className="h-10 bg-white/10 backdrop-blur-md rounded-xl font-black text-[8px] uppercase tracking-widest flex items-center justify-center gap-1.5 active:scale-95 border border-white/5 transition-all">
                 Withdraw <ArrowUpRight size={14} />
               </Link>
            </div>
         </div>
      </div>

      {/* 2. COMPACT QUICK ACTIONS */}
      <div className="bg-white p-4 rounded-[24px] border border-slate-100 shadow-sm mx-0.5">
         <div className="flex justify-around items-center gap-1">
            <QuickAction label="Deposit" icon={ArrowDownCircle} to="/user/wallet" color="bg-emerald-500" />
            <QuickAction label="Withdraw" icon={ArrowUpCircle} to="/user/wallet" color="bg-indigo-600" />
            <QuickAction label="Earning" icon={Zap} to="/user/work" color="bg-amber-500" />
            <QuickAction label="Support" icon={MessageCircle} to="/support" color="bg-sky-500" />
         </div>
      </div>

      {/* 3. DYNAMIC STATS - 2 COLUMNS */}
      <div className="grid grid-cols-2 gap-2 mx-0.5">
         <StatCard label="LIFETIME" value={`Rs ${stats.lifetime}`} icon={TrendingUp} color="bg-emerald-50" text="text-emerald-600" />
         <StatCard label="IN-REVIEW" value={stats.pending} icon={Clock} color="bg-amber-50" text="text-amber-600" />
         <StatCard label="STREAK" value={`${user?.streak || 0} Days`} icon={Zap} color="bg-indigo-50" text="text-indigo-600" />
         <StatCard label="FLEET" value="Active" icon={Users} color="bg-sky-50" text="text-sky-600" />
      </div>

      {/* 4. CHECK-IN */}
      <StreakWidget />

      {/* 5. RECENT ACTIVITY */}
      <div className="bg-white p-4 rounded-[24px] border border-slate-100 shadow-sm mx-0.5">
         <div className="flex items-center justify-between mb-3.5">
            <h3 className="text-[9px] font-black text-slate-800 uppercase tracking-widest italic leading-none">Ledger Sync</h3>
            <Link to="/user/history" className="text-[8px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-0.5">Logs <ArrowRight size={10}/></Link>
         </div>

         <div className="space-y-1.5">
            {transactions.slice(0, 3).map((trx) => (
              <div key={trx.id} className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between active:scale-[0.99] transition-all border border-transparent hover:border-slate-100">
                 <div className="flex items-center gap-3 overflow-hidden">
                    <div className={clsx(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm",
                      trx.type === 'withdraw' ? "bg-white text-rose-500" : "bg-white text-emerald-500"
                    )}>
                      {trx.type === 'withdraw' ? <ArrowUpRight size={14}/> : <Zap size={14} fill="currentColor" />}
                    </div>
                    <div className="overflow-hidden">
                       <p className="font-black text-slate-800 text-[9px] uppercase leading-none truncate">{trx.type}</p>
                       <p className="text-[7px] font-bold text-slate-400 uppercase mt-0.5 leading-none">{trx.date}</p>
                    </div>
                 </div>
                 <div className="text-right shrink-0">
                    <p className={clsx("font-black text-[10px]", trx.type === 'withdraw' ? "text-slate-900" : "text-emerald-600")}>Rs {trx.amount}</p>
                 </div>
              </div>
            ))}
            {!loading && transactions.length === 0 && (
              <div className="py-8 text-center text-slate-300 font-bold uppercase text-[8px] tracking-widest">Sector Clear</div>
            )}
         </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, color, text }: any) => (
  <div className="bg-white p-3 rounded-[20px] border border-slate-100 shadow-sm flex flex-col gap-1.5 active:scale-95 transition-all overflow-hidden">
     <div className={clsx("w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-sm", color, text)}>
        <Icon size={14} />
     </div>
     <div className="overflow-hidden">
        <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
        <p className="text-[10px] font-black text-slate-900 leading-none truncate">{value}</p>
     </div>
  </div>
);

export default UserDashboard;