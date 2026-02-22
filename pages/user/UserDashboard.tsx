import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Wallet, Zap, History as HistoryIcon, 
  CheckSquare, TrendingUp, Clock,
  ChevronRight, Trophy, Users, Star, 
  ArrowRight, CreditCard, PlayCircle,
  MessageSquare, Layout, ShieldCheck,
  TrendingDown, Activity, Box, Sparkles, Target, Award,
  UserCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import StreakWidget from '../../components/user/StreakWidget';
import { DailyRewardPopup } from '../../components/user/DailyRewardPopup';
import { api } from '../../utils/api';

const DashboardCard = ({ title, value, icon: Icon, delay, gradient, path, subtext }: any) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={clsx(
        "rounded-[24px] p-3.5 shadow-lg flex flex-col justify-between h-24 md:h-28 relative overflow-hidden group transition-all border border-white/5 hover:translate-y-[-2px]",
        gradient
      )}
    >
      <div className="relative z-10 flex justify-between items-start">
        <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center text-white bg-white/10 backdrop-blur-md border border-white/20 shadow-sm group-hover:scale-105 transition-transform">
          <Icon className="size-3.5 md:size-4" />
        </div>
        <div className="text-right">
          <p className="text-[6px] font-black text-white/50 uppercase tracking-[0.15em] italic mb-0.5">{title}</p>
          <h3 className="text-base md:text-lg font-black text-white tracking-tight leading-none italic">{value}</h3>
        </div>
      </div>
      <div className="relative z-10 flex items-center justify-between border-t border-white/5 pt-2">
        <span className="text-[6px] font-black text-white/60 uppercase tracking-widest italic">{subtext}</span>
        {path && (
          <Link to={path} className="w-5 h-5 md:w-6 md:h-6 bg-white/10 rounded-lg flex items-center justify-center text-white group-hover:bg-white group-hover:text-slate-900 transition-all">
            <ChevronRight size={10} />
          </Link>
        )}
      </div>
    </motion.div>
  );
};

const UserDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalTasks: 0, pendingTasks: 0, todayIncome: 0, teamCount: 0 });
  const [loading, setLoading] = useState(true);
  const [isRewardOpen, setIsRewardOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [history, teamData] = await Promise.all([
        api.get('/finance/history'),
        api.get('/auth/team')
      ]);
      
      const today = new Date().toISOString().split('T')[0];
      const incomeToday = (history || [])
        .filter((t: any) => t.type === 'reward' && (t.date === today || t.timestamp?.startsWith(today)))
        .reduce((a: number, b: any) => a + Number(b.amount), 0);
      
      const pendingCount = (user?.workSubmissions || []).filter((s: any) => s.status === 'pending').length;

      setStats({
        todayIncome: incomeToday,
        pendingTasks: pendingCount,
        totalTasks: user?.workSubmissions?.filter((s: any) => s.status === 'approved').length || 0,
        teamCount: (teamData.t1?.length || 0) + (teamData.t2?.length || 0) + (teamData.t3?.length || 0)
      });

      const lastClaim = user?.lastCheckIn ? new Date(user.lastCheckIn).toDateString() : null;
      const todayStr = new Date().toDateString();
      if (lastClaim !== todayStr) {
        setTimeout(() => setIsRewardOpen(true), 1500);
      }
    } catch (e) {
      console.error("Sync failure.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    if (user?.id) fetchData(); 
  }, [user?.id]);

  return (
    <div className="w-full pb-32 space-y-4 md:space-y-6 animate-fade-in max-w-5xl mx-auto px-1">
      <DailyRewardPopup isOpen={isRewardOpen} onClose={() => setIsRewardOpen(false)} />

      {/* Identity Header - Compact */}
      <section className="flex flex-col md:flex-row justify-between items-center gap-3 p-3 md:px-5 bg-white rounded-[24px] border border-slate-100 shadow-sm relative overflow-hidden group">
        <div className="flex items-center gap-3.5 relative z-10 w-full md:w-auto">
           <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center text-lg font-black text-sky-400 italic shadow-md shrink-0">
             {user?.name?.charAt(0) || 'A'}
           </div>
           <div className="overflow-hidden">
             <h2 className="text-base font-black text-slate-900 tracking-tight uppercase italic leading-none mb-1 truncate">Salam, <span className="text-indigo-600">{user?.name}!</span></h2>
             <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md text-[6.5px] font-black uppercase tracking-widest border border-indigo-100 italic">Tier: {user?.currentPlan || 'BASIC'}</span>
                <span className="px-2 py-0.5 bg-slate-50 text-slate-400 rounded-md text-[6.5px] font-black uppercase tracking-widest border border-slate-100 flex items-center gap-1 shrink-0">
                   <UserCheck size={8} /> Verified
                </span>
             </div>
           </div>
        </div>
        <div className="flex items-center gap-2 bg-slate-50/80 p-1.5 px-3 rounded-lg border border-slate-100 relative z-10">
            <p className="text-[6.5px] font-black text-slate-400 uppercase tracking-widest">ID</p>
            <p className="text-[9px] font-black text-slate-900 italic tracking-tight">#{user?.id?.slice(-8)}</p>
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
        </div>
      </section>

      {/* Financial Matrix - Compacted */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
         <DashboardCard 
           title="Liquidity Node" 
           value={`Rs. ${(user?.balance || 0).toLocaleString()}`} 
           icon={Wallet} delay={0.1} gradient="bg-slate-950" path="/user/wallet"
           subtext="Ready for withdrawal"
         />
         <DashboardCard 
           title="Yield Cycle" 
           value={`Rs. ${stats.todayIncome.toLocaleString()}`} 
           icon={Sparkles} delay={0.2} gradient="bg-indigo-600" path="/user/history"
           subtext="Active profit sync"
         />
         <DashboardCard 
           title="Network Nodes" 
           value={`${stats.teamCount} Associates`} 
           icon={Users} delay={0.3} gradient="bg-emerald-600" path="/user/team"
           subtext="Network growth"
         />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
         <div className="lg:col-span-4 h-full">
            <StreakWidget />
         </div>

         <div className="lg:col-span-8 flex flex-col gap-3.5">
            <section className="bg-white p-4 md:p-5 rounded-[28px] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-5 overflow-hidden relative group hover:border-indigo-100 transition-all">
               <div className="absolute top-0 right-0 p-8 opacity-[0.02] rotate-12 scale-110 group-hover:rotate-45 transition-transform duration-[4s]"><CheckSquare size={70} fill="currentColor"/></div>
               <div className="flex items-center gap-4 relative z-10 w-full md:w-auto">
                  <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center shadow-inner shrink-0"><PlayCircle size={20} /></div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 uppercase italic leading-none mb-1 tracking-tight">Work Inventory.</h4>
                    <p className="text-[7.5px] font-bold text-slate-400 uppercase tracking-widest">
                       Available: <span className="text-slate-900 font-black">9+ Assignments</span>
                    </p>
                  </div>
               </div>
               <Link to="/user/work" className="relative z-10 w-full md:w-auto h-9 px-5 bg-slate-950 text-white rounded-lg font-black text-[8px] uppercase tracking-[0.2em] shadow-md flex items-center justify-center gap-2 hover:bg-indigo-600 shrink-0 transition-all active:scale-95">
                  Launch <ArrowRight size={12} />
               </Link>
            </section>

            <div className="grid grid-cols-2 gap-3">
               <QuickAction to="/user/plans" label="Plans" sub="Upgrade Node" icon={Award} color="text-amber-500" bg="bg-amber-50" />
               <QuickAction to="/user/history" label="Activity" sub="Audit Logs" icon={HistoryIcon} color="text-indigo-500" bg="bg-indigo-50" />
               <QuickAction to="/support" label="Support" sub="Help Desk" icon={MessageSquare} color="text-emerald-500" bg="bg-emerald-50" />
               <QuickAction to="/user/settings" label="Profile" sub="Registry" icon={Layout} color="text-slate-500" bg="bg-slate-50" />
            </div>
         </div>
      </div>
    </div>
  );
};

const QuickAction = ({ to, label, sub, icon: Icon, color, bg }: any) => (
  <Link to={to} className="bg-white p-3 md:p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3 hover:border-indigo-100 transition-all active:scale-95 group">
    <div className={clsx("w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform shadow-inner shrink-0", bg, color)}><Icon size={16}/></div>
    <div className="overflow-hidden">
      <h4 className="text-[8px] md:text-[9px] font-black text-slate-900 uppercase tracking-tight truncate leading-none mb-0.5">{label}</h4>
      <p className="text-[6.5px] font-bold text-slate-400 uppercase tracking-widest italic leading-none">{sub}</p>
    </div>
  </Link>
);

export default UserDashboard;