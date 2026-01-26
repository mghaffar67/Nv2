
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

const DashboardCard = ({ title, value, sub, icon: Icon, delay, gradient }: any) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={clsx(
        "rounded-2xl p-4 shadow-xl flex flex-col justify-between h-28 group transition-all border border-white/10 relative overflow-hidden",
        gradient
      )}
    >
      <div className="absolute -top-3 -right-3 w-12 h-12 bg-white/10 rounded-full blur-xl" />
      <div className="relative z-10 flex justify-between items-start">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white bg-black/10 backdrop-blur-md border border-white/5 shadow-lg">
          <Icon size={14} />
        </div>
        <div className="text-right">
          <p className="text-[6px] font-black text-white/40 uppercase tracking-[0.2em]">{title}</p>
          <h3 className="text-base font-black text-white tracking-tighter leading-none mt-1">{value}</h3>
        </div>
      </div>
      <div className="relative z-10 bg-black/10 px-2 py-1 rounded-lg inline-flex items-center gap-1 w-fit">
        <ShieldCheck size={8} className="text-indigo-300" />
        <p className="text-[6px] font-bold text-white/80 uppercase tracking-widest truncate">{sub}</p>
      </div>
    </motion.div>
  );
};

const UserDashboard = () => {
  const { user } = useAuth();
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
    <div className="w-full px-1 pb-24 space-y-4 max-w-lg mx-auto animate-fade-in">
      {/* Compact Grid */}
      <div className="grid grid-cols-2 gap-2.5">
         <DashboardCard 
           title="My Funds" 
           value={`Rs. ${(user?.balance || 0).toLocaleString()}`} 
           sub="Live Balance"
           icon={Wallet}
           delay={0.1}
           gradient="bg-gradient-to-br from-indigo-600 to-indigo-900"
         />
         <DashboardCard 
           title="24h Profit" 
           value={`Rs. ${stats.todayIncome}`} 
           sub="Daily Yield"
           icon={TrendingUp}
           delay={0.2}
           gradient="bg-gradient-to-br from-emerald-600 to-emerald-900"
         />
         <DashboardCard 
           title="Workload" 
           value={`${stats.pendingTasks} Nodes`} 
           sub="Pending Work"
           icon={Clock}
           delay={0.3}
           gradient="bg-gradient-to-br from-sky-600 to-sky-900"
         />
         <DashboardCard 
           title="Success" 
           value={`${stats.totalTasks} Jobs`} 
           sub="Records"
           icon={CheckSquare}
           delay={0.4}
           gradient="bg-gradient-to-br from-slate-800 to-slate-950"
         />
      </div>

      <StreakWidget />

      <div className="grid grid-cols-4 gap-2">
         <ActionTile to="/user/work" icon={ClipboardList} label="Work" color="text-indigo-500" />
         <ActionTile to="/user/team" icon={Network} label="Team" color="text-emerald-500" />
         <ActionTile to="/user/history" icon={HistoryIcon} label="Log" color="text-sky-500" />
         <ActionTile to="/user/wallet" icon={Wallet} label="Wallet" color="text-amber-500" />
      </div>

      <div className="pt-2">
         <Link 
           to="/user/work" 
           className="w-full h-14 rounded-2xl flex items-center justify-between px-6 text-white shadow-2xl active:scale-[0.98] transition-all bg-slate-950 border border-white/5"
         >
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/10">
                  <Zap size={16} fill="currentColor" className="text-indigo-400" />
               </div>
               <span className="font-black text-[9px] uppercase tracking-[0.2em] italic">Open Work Console</span>
            </div>
            <ChevronRight size={16} />
         </Link>
      </div>
    </div>
  );
};

const ActionTile = ({ to, icon: Icon, label, color }: any) => (
  <Link to={to} className="bg-white p-3 rounded-2xl border border-slate-100 flex flex-col items-center gap-1.5 active:scale-95 shadow-sm transition-all group">
    <div className={clsx("w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform", color)}><Icon size={16}/></div>
    <span className="text-[7px] font-black uppercase text-slate-400 tracking-widest truncate w-full text-center">{label}</span>
  </Link>
);

export default UserDashboard;
