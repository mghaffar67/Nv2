
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={clsx(
        "rounded-[24px] p-4 shadow-sm flex flex-col justify-between h-32 group hover:shadow-md transition-all border border-slate-100",
        gradient
      )}
    >
      <div className="flex justify-between items-start">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-900 bg-white/50 backdrop-blur-sm shadow-sm">
          <Icon size={16} />
        </div>
        <div className="text-right">
          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{title}</p>
          <h3 className="text-base font-black text-slate-900 tracking-tight">{value}</h3>
        </div>
      </div>
      <div className="bg-white/30 backdrop-blur-md px-2 py-1 rounded-lg border border-white/20">
        <p className="text-[7px] font-black text-slate-600 truncate uppercase tracking-tighter">{sub}</p>
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
      console.error("Dashboard Sync Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, [user?.id]);

  return (
    <div className="w-full px-1 pb-24 space-y-4 max-w-xl mx-auto animate-fade-in">
      {/* 4 Premium Tile Cards */}
      <div className="grid grid-cols-2 gap-2.5 px-0.5">
         <DashboardCard 
           title="Balance" 
           value={`Rs. ${(user?.balance || 0).toLocaleString()}`} 
           sub="Net Yield Pool"
           icon={Wallet}
           delay={0.1}
           gradient="bg-gradient-to-br from-indigo-50/50 to-white"
         />
         <DashboardCard 
           title="Today" 
           value={`Rs. ${stats.todayIncome}`} 
           sub="Profit Accrued"
           icon={TrendingUp}
           delay={0.2}
           gradient="bg-gradient-to-br from-emerald-50/50 to-white"
         />
         <DashboardCard 
           title="Available" 
           value={`${stats.pendingTasks} Tasks`} 
           sub="Registry Queue"
           icon={Clock}
           delay={0.3}
           gradient="bg-gradient-to-br from-sky-50/50 to-white"
         />
         <DashboardCard 
           title="Approved" 
           value={`${stats.totalTasks} Done`} 
           sub="Verification Log"
           icon={CheckSquare}
           delay={0.4}
           gradient="bg-gradient-to-br from-amber-50/50 to-white"
         />
      </div>

      <StreakWidget />

      {/* Grid Menu - More Compact */}
      <div className="grid grid-cols-4 gap-2 px-0.5">
         <Link to="/user/work" className="bg-white p-2.5 rounded-2xl border border-slate-100 flex flex-col items-center gap-1 active:scale-95 shadow-sm">
            <div className="w-8 h-8 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center"><ClipboardList size={16}/></div>
            <span className="text-[7px] font-black uppercase text-slate-400">Work</span>
         </Link>
         <Link to="/user/team" className="bg-white p-2.5 rounded-2xl border border-slate-100 flex flex-col items-center gap-1 active:scale-95 shadow-sm">
            <div className="w-8 h-8 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center"><Network size={16}/></div>
            <span className="text-[7px] font-black uppercase text-slate-400">Team</span>
         </Link>
         <Link to="/user/history" className="bg-white p-2.5 rounded-2xl border border-slate-100 flex flex-col items-center gap-1 active:scale-95 shadow-sm">
            <div className="w-8 h-8 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center"><HistoryIcon size={16}/></div>
            <span className="text-[7px] font-black uppercase text-slate-400">Log</span>
         </Link>
         <Link to="/user/wallet" className="bg-white p-2.5 rounded-2xl border border-slate-100 flex flex-col items-center gap-1 active:scale-95 shadow-sm">
            <div className="w-8 h-8 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center"><Wallet size={16}/></div>
            <span className="text-[7px] font-black uppercase text-slate-400">Wallet</span>
         </Link>
      </div>

      {/* Primary Action */}
      <div className="px-0.5">
         <Link 
           to="/user/work" 
           className="w-full h-12 rounded-xl flex items-center justify-between px-6 text-white shadow-lg active:scale-[0.98] transition-all"
           style={{ backgroundColor: config.theme.primaryColor }}
         >
            <div className="flex items-center gap-3">
               <Zap size={16} fill="currentColor" />
               <span className="font-black text-[9px] uppercase tracking-widest">Execute Daily Cycle</span>
            </div>
            <ArrowRight size={16} />
         </Link>
      </div>
    </div>
  );
};

export default UserDashboard;
