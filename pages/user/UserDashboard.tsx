import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useConfig } from '../../context/ConfigContext';
import { 
  Wallet, Zap, History as HistoryIcon, 
  ClipboardList, CheckSquare, TrendingUp, Clock,
  ArrowRight, ShieldCheck, ChevronRight, Trophy,
  Loader2, Briefcase, CheckCircle2, Star, Sparkles,
  Smartphone, Rocket, Gem, Users, Target
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import StreakWidget from '../../components/user/StreakWidget';
import { api } from '../../utils/api';

const DashboardCard = ({ title, value, icon: Icon, delay, gradient, path, subtext }: any) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={clsx(
        "rounded-[28px] md:rounded-[36px] p-5 md:p-6 shadow-xl flex flex-col justify-between h-32 md:h-40 group transition-all border border-white/10 relative overflow-hidden",
        gradient
      )}
    >
      <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/5 rounded-full blur-xl" />
      <div className="relative z-10 flex justify-between items-start">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-white bg-black/20 backdrop-blur-md border border-white/10">
          <Icon size={20} className="md:size-24" />
        </div>
        <div className="text-right">
          <p className="text-[7px] md:text-[9px] font-black text-white/50 uppercase tracking-[0.2em]">{title}</p>
          <h3 className="text-lg md:text-2xl font-black text-white tracking-tighter leading-none mt-1">{value}</h3>
        </div>
      </div>
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
           <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
           <span className="text-[7px] md:text-[8px] font-black text-white/60 uppercase tracking-widest truncate">{subtext || 'Live Server'}</span>
        </div>
        {path && (
          <Link to={path} className="p-1.5 bg-white/10 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-all">
            <ChevronRight size={14} />
          </Link>
        )}
      </div>
    </motion.div>
  );
};

const UserDashboard = () => {
  const { user } = useAuth();
  const { config } = useConfig();
  const [stats, setStats] = useState({ totalTasks: 0, pendingTasksCount: 0, todayIncome: 0, teamCount: 0 });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [history, taskList, teamData] = await Promise.all([
        api.get('/finance/history'),
        api.get('/work/tasks'),
        api.get('/auth/team')
      ]);
      
      const today = new Date().toISOString().split('T')[0];
      const todayReward = (Array.isArray(history) ? history : [])
        .filter((t: any) => (t.type === 'reward' || t.type === 'admin_bonus') && t.date === today)
        .reduce((a: number, b: any) => a + Number(b.amount), 0);
      
      const actualTasks = taskList?.tasks || [];
      const pendingCount = (user?.workSubmissions || []).filter((s: any) => s.status === 'pending').length;
      
      setStats({
        todayIncome: todayReward,
        pendingTasksCount: pendingCount,
        totalTasks: user?.workSubmissions?.filter((s: any) => s.status === 'approved').length || 0,
        teamCount: (teamData.t1?.length || 0) + (teamData.t2?.length || 0) + (teamData.t3?.length || 0)
      });
    } catch (e) {
      console.error("Dashboard Sync Failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    if (user?.id) fetchDashboardData(); 
  }, [user?.id, user?.workSubmissions]);

  return (
    <div className="w-full pb-24 space-y-6 animate-fade-in max-w-7xl mx-auto px-2">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
         <DashboardCard 
           title="Wallet Balance" 
           value={`Rs. ${(user?.balance || 0).toLocaleString()}`} 
           icon={Wallet} delay={0.1} gradient="bg-slate-950" path="/user/wallet"
         />
         <DashboardCard 
           title="Pending Work" 
           value={stats.pendingTasksCount} 
           icon={Clock} delay={0.2} gradient="bg-gradient-to-br from-amber-400 to-orange-600" path="/user/history"
           subtext="Verification in Progress"
         />
         <DashboardCard 
           title="Today's Earning" 
           value={`Rs. ${stats.todayIncome}`} 
           icon={Sparkles} delay={0.3} gradient="bg-gradient-to-br from-emerald-400 to-teal-600" path="/user/wallet"
           subtext="Confirmed Rewards"
         />
         <DashboardCard 
           title="Referral Team" 
           value={`${stats.teamCount} Members`} 
           icon={Users} delay={0.4} gradient="bg-sky-600" path="/user/team"
         />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
         <div className="lg:col-span-4 space-y-6">
            <StreakWidget />
            <div className="bg-white p-6 rounded-[36px] border border-slate-100 shadow-sm space-y-6">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-2">Main Menu</h3>
               <div className="grid grid-cols-2 gap-3">
                  <ActionTile to="/user/work" icon={Briefcase} label="Start Tasks" color="bg-indigo-50 text-indigo-600" />
                  <ActionTile to="/user/achievements" icon={Trophy} label="Bonus Center" color="bg-amber-50 text-amber-600" />
                  <ActionTile to="/user/wallet/withdraw" icon={Wallet} label="Withdraw" color="bg-rose-50 text-rose-600" />
                  <ActionTile to="/user/team" icon={Users} label="Invite Friends" color="bg-sky-50 text-sky-600" />
               </div>
            </div>
         </div>

         <div className="lg:col-span-8 space-y-6">
            <section className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 md:p-10 rounded-[44px] text-white relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12 scale-[2] pointer-events-none"><Gem size={100} /></div>
               <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-4">
                     <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg border border-white/10">
                        <Rocket size={32} />
                     </div>
                     <div>
                        <h4 className="text-xl font-black italic uppercase tracking-tighter">Premium Earning Partner</h4>
                        <p className="text-[9px] font-bold text-indigo-200 uppercase tracking-widest">Earn up to 5x more with a higher plan</p>
                     </div>
                  </div>
                  <p className="text-xs font-medium text-indigo-100 max-w-lg leading-relaxed italic">
                    Upgrade to Diamond membership to unlock unlimited daily tasks. As a Premium Partner, your withdrawals are processed with top priority.
                  </p>
                  <div className="flex gap-4 pt-2">
                    <Link to="/user/plans" className="inline-flex h-14 px-10 bg-white text-slate-900 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl items-center gap-3 active:scale-95 transition-all">
                       Upgrade Now <ChevronRight size={18} />
                    </Link>
                    <Link to="/user/work" className="inline-flex h-14 px-8 bg-black/20 border border-white/10 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] items-center gap-3 active:scale-95 transition-all backdrop-blur-md">
                       Go To Work
                    </Link>
                  </div>
               </div>
            </section>
         </div>
      </div>
    </div>
  );
};

const ActionTile = ({ to, icon: Icon, label, color }: any) => (
  <Link to={to} className={clsx("p-4 rounded-2xl flex flex-col items-center gap-2 active:scale-95 shadow-sm transition-all group border border-transparent hover:border-indigo-100", color)}>
    <Icon size={20} />
    <span className="text-[8px] font-black uppercase tracking-widest text-center">{label}</span>
  </Link>
);

export default UserDashboard;