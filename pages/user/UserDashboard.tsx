
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useConfig } from '../../context/ConfigContext';
import { 
  Wallet, Zap, History as HistoryIcon, Network, 
  ClipboardList, CheckSquare, TrendingUp, Clock,
  ArrowRight, ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import StreakWidget from '../../components/user/StreakWidget';
import { api } from '../../utils/api';

const DashboardCard = ({ title, value, sub, icon: Icon, delay, gradient }: any) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={clsx(
        "rounded-[32px] p-5 shadow-2xl flex flex-col justify-between h-36 group transition-all border border-white/20 relative overflow-hidden animate-aurora",
        gradient
      )}
    >
      <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full blur-xl" />
      <div className="relative z-10 flex justify-between items-start">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white bg-black/20 backdrop-blur-md border border-white/10 shadow-lg">
          <Icon size={16} />
        </div>
        <div className="text-right">
          <p className="text-[7px] font-black text-white/50 uppercase tracking-[0.2em]">{title}</p>
          <h3 className="text-lg font-black text-white tracking-tighter leading-none mt-1">{value}</h3>
        </div>
      </div>
      <div className="relative z-10 bg-black/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/5 inline-flex items-center gap-1.5 w-fit">
        <ShieldCheck size={8} className="text-white/60" />
        <p className="text-[7px] font-bold text-white/90 truncate uppercase tracking-widest leading-none">{sub}</p>
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
    <div className="w-full px-1 pb-24 space-y-5 max-w-xl mx-auto animate-fade-in">
      {/* 2-COLUMN PREMIUM GRID */}
      <div className="grid grid-cols-2 gap-3 px-1">
         <DashboardCard 
           title="My Balance" 
           value={`Rs. ${(user?.balance || 0).toLocaleString()}`} 
           sub="Total Cash"
           icon={Wallet}
           delay={0.1}
           gradient="bg-gradient-to-br from-indigo-700 via-indigo-600 to-indigo-900"
         />
         <DashboardCard 
           title="Today's Profit" 
           value={`Rs. ${stats.todayIncome}`} 
           sub="24h Earning"
           icon={TrendingUp}
           delay={0.2}
           gradient="bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-900"
         />
         <DashboardCard 
           title="Tasks Status" 
           value={`${stats.pendingTasks} Left`} 
           sub="Remaining Work"
           icon={Clock}
           delay={0.3}
           gradient="bg-gradient-to-br from-sky-700 via-sky-600 to-sky-900"
         />
         <DashboardCard 
           title="Completed" 
           value={`${stats.totalTasks} Jobs`} 
           sub="Work History"
           icon={CheckSquare}
           delay={0.4}
           gradient="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950"
         />
      </div>

      <StreakWidget />

      <div className="grid grid-cols-4 gap-2 px-1">
         <ActionTile to="/user/work" icon={ClipboardList} label="Work" color="text-indigo-500" />
         <ActionTile to="/user/team" icon={Network} label="Team" color="text-emerald-500" />
         <ActionTile to="/user/history" icon={HistoryIcon} label="Records" color="text-sky-500" />
         <ActionTile to="/user/wallet" icon={Wallet} label="Funds" color="text-amber-500" />
      </div>

      <div className="px-1 pt-2">
         <Link 
           to="/user/work" 
           className="w-full h-16 rounded-[24px] flex items-center justify-between px-8 text-white shadow-2xl active:scale-[0.98] transition-all bg-slate-950 border border-white/5 relative overflow-hidden"
         >
            <div className="absolute inset-0 bg-indigo-600/10 opacity-40 blur-3xl" />
            <div className="flex items-center gap-4 relative z-10">
               <div className="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center border border-indigo-500/30">
                  <Zap size={20} fill="currentColor" className="text-indigo-400" />
               </div>
               <span className="font-black text-[10px] uppercase tracking-[0.3em] italic">Start Daily Work</span>
            </div>
            <ArrowRight size={20} className="relative z-10" />
         </Link>
      </div>
    </div>
  );
};

const ActionTile = ({ to, icon: Icon, label, color }: any) => (
  <Link to={to} className="bg-white p-4 rounded-3xl border border-slate-100 flex flex-col items-center gap-2 active:scale-95 shadow-sm hover:border-indigo-100 transition-all group">
    <div className={clsx("w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform", color)}><Icon size={20}/></div>
    <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">{label}</span>
  </Link>
);

export default UserDashboard;
