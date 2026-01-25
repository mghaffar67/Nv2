
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useConfig } from '../../context/ConfigContext';
import { 
  Wallet, Zap, History as HistoryIcon, Network, 
  ClipboardList, CheckSquare, TrendingUp, Clock,
  ArrowRight
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
        "rounded-[28px] p-4 shadow-sm flex flex-col justify-between h-36 group hover:shadow-md transition-all border border-slate-100",
        gradient
      )}
    >
      <div className="flex justify-between items-start">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg bg-slate-900/10 backdrop-blur-sm">
          <Icon size={18} />
        </div>
        <div className="text-right">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{title}</p>
          <h3 className="text-lg font-black text-slate-900 mt-1 tracking-tight">{value}</h3>
        </div>
      </div>
      <div className="bg-white/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20">
        <p className="text-[8px] font-black text-slate-600 truncate uppercase tracking-tighter">{sub}</p>
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
      console.error("Sync Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, [user?.id]);

  return (
    <div className="w-full px-1 pb-24 space-y-5 max-w-xl mx-auto animate-fade-in">
      {/* 4 Refined Gradient Cards */}
      <div className="grid grid-cols-2 gap-3 px-1">
         <DashboardCard 
           title="Balance" 
           value={`Rs. ${(user?.balance || 0).toLocaleString()}`} 
           sub="Available for Payout"
           icon={Wallet}
           delay={0.1}
           gradient="bg-gradient-to-br from-indigo-50 to-white"
         />
         <DashboardCard 
           title="Daily Profit" 
           value={`Rs. ${stats.todayIncome}`} 
           sub="Net Earned Today"
           icon={TrendingUp}
           delay={0.2}
           gradient="bg-gradient-to-br from-emerald-50 to-white"
         />
         <DashboardCard 
           title="Pending" 
           value={`${stats.pendingTasks}`} 
           sub="In Queue"
           icon={Clock}
           delay={0.3}
           gradient="bg-gradient-to-br from-sky-50 to-white"
         />
         <DashboardCard 
           title="Completed" 
           value={`${stats.totalTasks}`} 
           sub="Lifetime Records"
           icon={CheckSquare}
           delay={0.4}
           gradient="bg-gradient-to-br from-amber-50 to-white"
         />
      </div>

      <StreakWidget />

      {/* Tighter Grid Menu */}
      <div className="grid grid-cols-4 gap-2 px-1">
         <Link to="/user/work" className="bg-white p-3 rounded-[24px] border border-slate-100 flex flex-col items-center gap-1.5 active:scale-95 shadow-sm">
            <div className="w-9 h-9 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center"><ClipboardList size={18}/></div>
            <span className="text-[7px] font-black uppercase text-slate-400">Work</span>
         </Link>
         <Link to="/user/team" className="bg-white p-3 rounded-[24px] border border-slate-100 flex flex-col items-center gap-1.5 active:scale-95 shadow-sm">
            <div className="w-9 h-9 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center"><Network size={18}/></div>
            <span className="text-[7px] font-black uppercase text-slate-400">Team</span>
         </Link>
         <Link to="/user/history" className="bg-white p-3 rounded-[24px] border border-slate-100 flex flex-col items-center gap-1.5 active:scale-95 shadow-sm">
            <div className="w-9 h-9 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center"><HistoryIcon size={18}/></div>
            <span className="text-[7px] font-black uppercase text-slate-400">Log</span>
         </Link>
         <Link to="/user/wallet" className="bg-white p-3 rounded-[24px] border border-slate-100 flex flex-col items-center gap-1.5 active:scale-95 shadow-sm">
            <div className="w-9 h-9 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center"><Wallet size={18}/></div>
            <span className="text-[7px] font-black uppercase text-slate-400">Wallet</span>
         </Link>
      </div>

      {/* Floating Action for Quick Work */}
      <div className="px-1">
         <Link 
           to="/user/work" 
           className="w-full h-14 rounded-2xl flex items-center justify-between px-6 text-white shadow-xl active:scale-[0.98] transition-all"
           style={{ backgroundColor: config.theme.primaryColor }}
         >
            <div className="flex items-center gap-3">
               <Zap size={18} fill="currentColor" />
               <span className="font-black text-[10px] uppercase tracking-widest">Execute Daily Tasks</span>
            </div>
            <ArrowRight size={18} />
         </Link>
      </div>
    </div>
  );
};

export default UserDashboard;
