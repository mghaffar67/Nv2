
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

const DashboardCard = ({ title, value, sub, icon: Icon, delay }: any) => {
  const { config } = useConfig();
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-[32px] p-5 border border-slate-100 shadow-sm flex flex-col justify-between h-44 group hover:border-indigo-100 transition-all"
    >
      <div className="flex justify-between items-start">
        <div 
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0"
          style={{ backgroundColor: config.theme.primaryColor }}
        >
          <Icon size={22} />
        </div>
        <div className="text-right overflow-hidden ml-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">{title}</p>
          <h3 className="text-xl font-black text-slate-900 mt-1 tracking-tight truncate">{value}</h3>
        </div>
      </div>
      <div className="bg-slate-50 px-3 py-2.5 rounded-xl border border-slate-100">
        <p className="text-[9px] font-black text-slate-500 truncate uppercase tracking-widest">{sub}</p>
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
      console.error("Dashboard refresh error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, [user?.id]);

  return (
    <div className="w-full px-1 pb-32 space-y-6 max-w-2xl mx-auto animate-fade-in">
      {/* 4 Standardized Cards */}
      <div className="grid grid-cols-2 gap-3 px-1">
         <DashboardCard 
           title="Total Balance" 
           value={`Rs. ${(user?.balance || 0).toLocaleString()}`} 
           sub="Available Earnings"
           icon={Wallet}
           delay={0.1}
         />
         <DashboardCard 
           title="Today Profit" 
           value={`Rs. ${stats.todayIncome.toLocaleString()}`} 
           sub="Earned Today"
           icon={TrendingUp}
           delay={0.2}
         />
         <DashboardCard 
           title="Pending Work" 
           value={`${stats.pendingTasks} Items`} 
           sub="Tasks Available"
           icon={Clock}
           delay={0.3}
         />
         <DashboardCard 
           title="Work Done" 
           value={`${stats.totalTasks} Completed`} 
           sub="Total Approved"
           icon={CheckSquare}
           delay={0.4}
         />
      </div>

      <StreakWidget />

      {/* Grid Menu */}
      <div className="grid grid-cols-4 gap-2 px-1">
         <Link to="/user/work" className="bg-white p-4 rounded-[28px] border border-slate-100 flex flex-col items-center gap-2 active:scale-95 shadow-sm">
            <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center"><ClipboardList size={20}/></div>
            <span className="text-[7px] font-black uppercase text-slate-400">Work</span>
         </Link>
         <Link to="/user/team" className="bg-white p-4 rounded-[28px] border border-slate-100 flex flex-col items-center gap-2 active:scale-95 shadow-sm">
            <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center"><Network size={20}/></div>
            <span className="text-[7px] font-black uppercase text-slate-400">Team</span>
         </Link>
         <Link to="/user/history" className="bg-white p-4 rounded-[28px] border border-slate-100 flex flex-col items-center gap-2 active:scale-95 shadow-sm">
            <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center"><HistoryIcon size={20}/></div>
            <span className="text-[7px] font-black uppercase text-slate-400">History</span>
         </Link>
         <Link to="/user/wallet" className="bg-white p-4 rounded-[28px] border border-slate-100 flex flex-col items-center gap-2 active:scale-95 shadow-sm">
            <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center"><Wallet size={20}/></div>
            <span className="text-[7px] font-black uppercase text-slate-400">Wallet</span>
         </Link>
      </div>

      {/* Floating Action for Quick Work */}
      <div className="px-1">
         <Link 
           to="/user/work" 
           className="w-full h-16 rounded-[24px] flex items-center justify-between px-8 text-white shadow-xl active:scale-[0.98] transition-all"
           style={{ backgroundColor: config.theme.primaryColor }}
         >
            <div className="flex items-center gap-4">
               <Zap size={22} fill="currentColor" />
               <span className="font-black text-xs uppercase tracking-[0.2em]">Start Daily Tasks</span>
            </div>
            <ArrowRight size={20} />
         </Link>
      </div>
    </div>
  );
};

export default UserDashboard;
