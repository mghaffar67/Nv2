
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Wallet, Zap, ArrowUpRight, Plus, RefreshCw, 
  History as HistoryIcon, Network, ClipboardList, 
  ShieldCheck, CheckCircle2, ChevronRight, UserPlus,
  Award, BarChart3, Clock, CheckSquare, AlertCircle, TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import StreakWidget from '../../components/user/StreakWidget';
import { api } from '../../utils/api';

const GradientCard = ({ title, value, sub, icon: Icon, gradient, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className={clsx(
      "relative overflow-hidden rounded-[32px] p-5 text-white shadow-xl h-40 flex flex-col justify-between group border border-white/10",
      gradient
    )}
  >
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
      <Icon size={72} strokeWidth={1} />
    </div>
    <div className="relative z-10">
       <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">{title}</p>
       <h3 className="text-2xl font-black tracking-tight">{value}</h3>
    </div>
    <div className="relative z-10 flex items-center gap-1.5 bg-black/10 w-fit px-3 py-1 rounded-full border border-white/5">
       <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
       <p className="text-[8px] font-bold uppercase tracking-wider">{sub}</p>
    </div>
    {/* Animated Mesh Overlay */}
    <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-30 animate-pulse pointer-events-none" />
  </motion.div>
);

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
      const todayReward = history
        .filter((t: any) => t.type === 'reward' && t.date === today)
        .reduce((a: number, b: any) => a + Number(b.amount), 0);
      
      const completedCount = user?.workSubmissions?.filter((s: any) => s.status === 'approved').length || 0;

      setStats({
        todayIncome: todayReward,
        pendingTasks: Array.isArray(tasks) ? tasks.length : 0,
        totalTasks: completedCount
      });
    } catch (e) {
      console.error("Sync error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, [user?.id]);

  return (
    <div className="w-full px-1 pb-32 space-y-6 max-w-2xl mx-auto animate-fade-in">
      
      <div className="grid grid-cols-2 gap-3 px-1">
         <GradientCard 
           title="Total Balance" 
           value={`Rs. ${(user?.balance || 0).toLocaleString()}`} 
           sub="Net Earnings"
           icon={Wallet}
           gradient="bg-gradient-to-br from-indigo-500 to-indigo-900"
           delay={0.1}
         />
         <GradientCard 
           title="Today's Earnings" 
           value={`Rs. ${stats.todayIncome}`} 
           sub="Last 24 Hours"
           icon={TrendingUp}
           gradient="bg-gradient-to-br from-emerald-400 to-teal-800"
           delay={0.2}
         />
         <GradientCard 
           title="Available Work" 
           value={`${stats.pendingTasks} Tasks`} 
           sub="New Assignments"
           icon={Clock}
           gradient="bg-gradient-to-br from-amber-400 to-orange-800"
           delay={0.3}
         />
         <GradientCard 
           title="Completed" 
           value={`${stats.totalTasks} Done`} 
           sub="Lifetime Record"
           icon={CheckSquare}
           gradient="bg-gradient-to-br from-rose-400 to-purple-800"
           delay={0.4}
         />
      </div>

      <StreakWidget />

      <div className="grid grid-cols-4 gap-2 px-1">
         <Link to="/user/work" className="bg-white p-4 rounded-[28px] border border-slate-100 flex flex-col items-center gap-2 active:scale-95 shadow-sm">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><ClipboardList size={20}/></div>
            <span className="text-[7px] font-black uppercase text-slate-400">Daily Task</span>
         </Link>
         <Link to="/user/team" className="bg-white p-4 rounded-[28px] border border-slate-100 flex flex-col items-center gap-2 active:scale-95 shadow-sm">
            <div className="w-10 h-10 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center"><Network size={20}/></div>
            <span className="text-[7px] font-black uppercase text-slate-400">My Team</span>
         </Link>
         <Link to="/user/history" className="bg-white p-4 rounded-[28px] border border-slate-100 flex flex-col items-center gap-2 active:scale-95 shadow-sm">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><HistoryIcon size={20}/></div>
            <span className="text-[7px] font-black uppercase text-slate-400">Report</span>
         </Link>
         <Link to="/user/wallet" className="bg-white p-4 rounded-[28px] border border-slate-100 flex flex-col items-center gap-2 active:scale-95 shadow-sm">
            <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center"><Wallet size={20}/></div>
            <span className="text-[7px] font-black uppercase text-slate-400">Wallet</span>
         </Link>
      </div>

      <div className="mx-1 pt-2">
         <div className="bg-slate-900 p-6 rounded-[40px] text-white flex justify-between items-center relative overflow-hidden group shadow-2xl">
            <div className="relative z-10">
               <h4 className="text-xl font-black tracking-tight">Refer & Earn</h4>
               <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Invite friends to grow your daily income.</p>
            </div>
            <Link to="/user/team" className="relative z-10 w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:rotate-12 transition-transform">
               <ArrowUpRight size={20} />
            </Link>
            <div className="absolute top-0 right-0 p-8 opacity-5 scale-150 rotate-45"><UserPlus size={100}/></div>
         </div>
      </div>
    </div>
  );
};

export default UserDashboard;
