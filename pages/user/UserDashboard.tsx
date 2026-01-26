
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useConfig } from '../../context/ConfigContext';
import { 
  Wallet, Zap, History as HistoryIcon, Network, 
  ClipboardList, CheckSquare, TrendingUp, Clock,
  ArrowRight, ShieldCheck, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import StreakWidget from '../../components/user/StreakWidget';
import { api } from '../../utils/api';

const DashboardCard = ({ title, value, icon: Icon, delay, gradient }: any) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className={clsx(
        "rounded-2xl p-3.5 shadow-lg flex flex-col justify-between h-24 group transition-all border border-white/10 relative overflow-hidden",
        gradient
      )}
    >
      <div className="absolute -top-4 -right-4 w-12 h-12 bg-white/5 rounded-full blur-xl" />
      <div className="relative z-10 flex justify-between items-start">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white bg-black/20 backdrop-blur-md border border-white/10">
          <Icon size={14} />
        </div>
        <div className="text-right">
          <p className="text-[6px] font-black text-white/50 uppercase tracking-[0.2em]">{title}</p>
          <h3 className="text-sm font-black text-white tracking-tighter leading-none mt-1">{value}</h3>
        </div>
      </div>
      <div className="relative z-10 flex items-center gap-1">
        <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[6px] font-bold text-white/60 uppercase tracking-widest truncate">Live Node Status</span>
      </div>
    </motion.div>
  );
};

const UserDashboard = () => {
  const { user } = useAuth();
  const { config } = useConfig();
  const [stats, setStats] = useState({ totalTasks: 0, pendingTasks: 0, todayIncome: 0 });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const history = await api.get('/finance/history');
      const tasks = await api.get('/work/tasks');
      const today = new Date().toISOString().split('T')[0];
      
      const todayReward = (history || [])
        .filter((t: any) => t.type === 'reward' && t.date === today)
        .reduce((a: number, b: any) => a + Number(b.amount), 0);
      
      const completedCount = user?.workSubmissions?.filter((s: any) => s.status === 'approved').length || 0;

      setStats({
        todayIncome: todayReward,
        pendingTasks: Array.isArray(tasks) ? tasks.length : 0,
        totalTasks: completedCount
      });
    } catch (e) {
      console.error("Refresh failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, [user?.id]);

  return (
    <div className="w-full px-1 pb-24 space-y-3.5 max-w-lg mx-auto animate-fade-in">
      {/* 2-Column Compact Stats */}
      <div className="grid grid-cols-2 gap-2.5">
         <DashboardCard 
           title="Account Balance" 
           value={`Rs. ${(user?.balance || 0).toLocaleString()}`} 
           icon={Wallet}
           delay={0.1}
           gradient="bg-slate-900"
         />
         <DashboardCard 
           title="Today Yield" 
           value={`Rs. ${stats.todayIncome}`} 
           icon={TrendingUp}
           delay={0.2}
           gradient="bg-indigo-600"
         />
         <DashboardCard 
           title="Nodes Online" 
           value={`${stats.pendingTasks} Tasks`} 
           icon={Zap}
           delay={0.3}
           gradient="bg-emerald-600"
         />
         <DashboardCard 
           title="Total Success" 
           value={`${stats.totalTasks} Done`} 
           icon={CheckSquare}
           delay={0.4}
           gradient="bg-sky-600"
         />
      </div>

      {/* Modern Compact Streak */}
      <StreakWidget />

      {/* Menu Actions */}
      <div className="grid grid-cols-4 gap-2">
         <ActionTile to="/user/work" icon={ClipboardList} label="Work" color="text-indigo-500" />
         <ActionTile to="/user/team" icon={Network} label="Team" color="text-emerald-500" />
         <ActionTile to="/user/wallet/withdraw" icon={Wallet} label="Payout" color="text-rose-500" />
         <ActionTile to="/user/history" icon={HistoryIcon} label="Log" color="text-slate-500" />
      </div>

      <div className="pt-1">
         <Link 
           to="/user/work" 
           className="w-full h-12 rounded-xl flex items-center justify-between px-5 text-white shadow-lg active:scale-[0.98] transition-all bg-slate-950 border border-white/5"
         >
            <div className="flex items-center gap-3">
               <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                  <Zap size={14} fill="currentColor" className="text-sky-400" />
               </div>
               <span className="font-black text-[8px] uppercase tracking-[0.2em] italic">Access Work Protocol</span>
            </div>
            <ChevronRight size={14} />
         </Link>
      </div>
    </div>
  );
};

const ActionTile = ({ to, icon: Icon, label, color }: any) => (
  <Link to={to} className="bg-white p-2.5 rounded-xl border border-slate-100 flex flex-col items-center gap-1.5 active:scale-95 shadow-sm transition-all group">
    <div className={clsx("w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center group-hover:bg-indigo-50 transition-colors", color)}><Icon size={14}/></div>
    <span className="text-[6.5px] font-black uppercase text-slate-400 tracking-widest">{label}</span>
  </Link>
);

export default UserDashboard;
