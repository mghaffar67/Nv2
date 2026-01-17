
import React, { useMemo, useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Wallet, TrendingUp, Award, Zap, ShieldCheck, 
  Clock, ArrowUpRight, Plus, History as HistoryIcon,
  ChevronRight, ArrowRight, ShieldAlert, Users, 
  Smartphone, MessageCircle, Info,
  // Added missing icons to fix "Cannot find name" errors
  ArrowDownCircle,
  ArrowUpCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { userFinanceController } from '../../backend_core/controllers/userFinanceController';
import StreakWidget from '../../components/user/StreakWidget';

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

  useEffect(() => {
    const syncData = async () => {
      if (!user?.id) return;
      try {
        const res = await new Promise<any>((resolve) => {
          userFinanceController.getMyTransactions({ query: { userId: user.id } }, { 
            status: () => ({ json: (data: any) => resolve(data) }) 
          });
        });
        setTransactions(Array.isArray(res) ? res : []);
      } catch (e) {
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };
    syncData();
  }, [user?.id, user?.balance]);

  const stats = useMemo(() => {
    const approved = transactions.filter(t => t.status === 'approved');
    const lifetime = approved.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    const pending = transactions.filter(t => t.status === 'pending').length;
    return { lifetime, pending };
  }, [transactions]);

  const isPlanActive = user?.currentPlan && user.currentPlan !== 'None';

  return (
    <div className="space-y-4 pb-24 animate-fade-in">
      
      {/* 1. ELITE BALANCE CARD */}
      <div className="bg-slate-900 p-6 md:p-8 rounded-[36px] text-white relative overflow-hidden shadow-2xl border border-white/5">
         <div className="absolute top-0 right-0 p-4 opacity-[0.03] scale-[1.5] pointer-events-none text-sky-400"><Wallet size={120} /></div>
         
         <div className="relative z-10 flex flex-col items-center text-center">
            <div className={clsx(
              "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 mb-6 border",
              isPlanActive ? "bg-indigo-500/20 text-indigo-400 border-indigo-500/30" : "bg-rose-500/20 text-rose-400 border-rose-500/30"
            )}>
               <div className={clsx("w-1.5 h-1.5 rounded-full", isPlanActive ? "bg-green-500 animate-pulse" : "bg-rose-500")} />
               {user?.currentPlan || 'Unauthorized Status'}
            </div>
            
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-3">Available Liquidity</p>
            <h2 className="text-5xl font-black tracking-tighter leading-none mb-8">
              <span className="text-xl text-sky-500 mr-2 italic">PKR</span>
              {(user?.balance || 0).toLocaleString()}
            </h2>

            <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
               <Link to="/user/wallet" className="h-12 bg-sky-500 rounded-2xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 shadow-xl shadow-sky-500/20">
                 <Plus size={14} /> Deposit
               </Link>
               <Link to="/user/wallet?tab=withdraw" className="h-12 bg-white/10 backdrop-blur-md rounded-2xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 border border-white/5">
                 Withdraw <ArrowUpRight size={14} />
               </Link>
            </div>
         </div>
      </div>

      {/* 2. QUICK ACTIONS TERMINAL */}
      <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm overflow-x-auto no-scrollbar">
         <div className="flex justify-around items-center min-w-[300px] gap-4">
            <QuickAction label="Deposit" icon={ArrowDownCircle} to="/user/wallet" color="bg-emerald-500" />
            <QuickAction label="Withdraw" icon={ArrowUpCircle} to="/user/wallet?tab=withdraw" color="bg-indigo-600" />
            <QuickAction label="Work" icon={Zap} to="/user/work" color="bg-amber-500" />
            <QuickAction label="Support" icon={MessageCircle} to="/support" color="bg-sky-500" />
         </div>
      </div>

      {/* 3. DYNAMIC STATS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
         <StatCard label="LIFETIME" value={`Rs ${stats.lifetime}`} icon={TrendingUp} color="bg-emerald-50" text="text-emerald-600" />
         <StatCard label="PENDING" value={stats.pending} icon={Clock} color="bg-indigo-50" text="text-indigo-600" />
         <StatCard label="STREAK" value={`${user?.streak || 0} D`} icon={Zap} color="bg-amber-50" text="text-amber-600" />
         <StatCard label="FLEET" value="12 Nodes" icon={Users} color="bg-sky-50" text="text-sky-600" />
      </div>

      {/* 4. DAILY CHECK-IN SYNC */}
      <StreakWidget />

      {/* 5. LIVE LEDGER ACTIVITY */}
      <div className="bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm">
         <div className="flex items-center justify-between mb-5 px-1">
            <div className="flex items-center gap-2">
               <div className="p-1.5 bg-slate-900 rounded-lg text-sky-400"><HistoryIcon size={12}/></div>
               <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest italic">Ledger Log</h3>
            </div>
            <Link to="/user/history" className="text-[9px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1">Full Sync <ArrowRight size={10}/></Link>
         </div>

         <div className="space-y-2">
            {transactions.slice(0, 3).map((trx) => (
              <div key={trx.id} className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between group active:scale-98 transition-all">
                 <div className="flex items-center gap-3">
                    <div className={clsx(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                      trx.type === 'withdraw' ? "bg-white text-rose-500" : "bg-white text-emerald-500"
                    )}>
                      {trx.type === 'withdraw' ? <ArrowUpRight size={16}/> : <Zap size={16} fill="currentColor" />}
                    </div>
                    <div>
                       <p className="font-black text-slate-800 text-[10px] uppercase leading-none">{trx.type}</p>
                       <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">{trx.date}</p>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className={clsx("font-black text-sm", trx.type === 'withdraw' ? "text-slate-900" : "text-emerald-600")}>Rs {trx.amount}</p>
                    <span className={clsx("text-[7px] font-black uppercase tracking-tighter", trx.status === 'approved' ? "text-emerald-500" : "text-amber-500")}>{trx.status}</span>
                 </div>
              </div>
            ))}
            {transactions.length === 0 && (
              <div className="py-12 text-center text-slate-300 font-bold uppercase text-[9px] tracking-widest flex flex-col items-center gap-3">
                 <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-200"><Info size={24}/></div>
                 No Ledger Data Cached
              </div>
            )}
         </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, color, text }: any) => (
  <div className="bg-white p-3.5 md:p-5 rounded-[24px] border border-slate-100 shadow-sm flex flex-col gap-3 active:scale-95 transition-all">
     <div className={clsx("w-9 h-9 rounded-xl flex items-center justify-center shrink-0", color, text)}>
        <Icon size={18} />
     </div>
     <div>
        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{label}</p>
        <p className="text-sm font-black text-slate-900 leading-none">{value}</p>
     </div>
  </div>
);

export default UserDashboard;
