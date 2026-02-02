import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useConfig } from '../../context/ConfigContext';
import { 
  Wallet, Zap, History as HistoryIcon, 
  ClipboardList, CheckSquare, TrendingUp, Clock,
  ArrowRight, ShieldCheck, ChevronRight, Trophy,
  Loader2, Briefcase, CheckCircle2, Star, Sparkles,
  Smartphone, Rocket, Gem, Users, Target, LayoutGrid,
  RefreshCw, BadgeCheck, Award, Gift
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import StreakWidget from '../../components/user/StreakWidget';
import { api } from '../../utils/api';

const DashboardCard = ({ title, value, icon: Icon, delay, gradient, path }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    className={clsx("rounded-[28px] md:rounded-[36px] p-5 md:p-6 shadow-xl flex flex-col justify-between h-32 md:h-40 group transition-all border border-white/10 relative overflow-hidden", gradient)}
  >
    <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/5 rounded-full blur-xl" />
    <div className="relative z-10 flex justify-between items-start">
      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-white bg-black/20 backdrop-blur-md border border-white/10"><Icon size={20} className="md:size-24" /></div>
      <div className="text-right">
        <p className="text-[7px] md:text-[9px] font-black text-white/50 uppercase tracking-[0.2em]">{title}</p>
        <h3 className="text-lg md:text-2xl font-black text-white tracking-tighter leading-none mt-1">{value}</h3>
      </div>
    </div>
    <div className="relative z-10 flex items-center justify-between">
      <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /><span className="text-[7px] md:text-[8px] font-black text-white/60 uppercase tracking-widest truncate">Live Sync</span></div>
      {path && <Link to={path} className="p-1.5 bg-white/10 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-all"><ChevronRight size={14} /></Link>}
    </div>
  </motion.div>
);

const UserDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ todayIncome: 0, teamCount: 0, pendingTasksCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [history, tasks, team] = await Promise.all([api.get('/finance/history'), api.get('/work/tasks'), api.get('/auth/team')]);
        const today = new Date().toISOString().split('T')[0];
        setStats({
          todayIncome: (history || []).filter((t: any) => t.type === 'reward' && t.date === today).reduce((a: number, b: any) => a + Number(b.amount), 0),
          pendingTasksCount: (tasks?.tasks || []).length,
          teamCount: (team.t1?.length || 0) + (team.t2?.length || 0) + (team.t3?.length || 0)
        });
      } catch (e) { } finally { setLoading(false); }
    };
    if (user?.id) fetchData();
  }, [user?.id]);

  return (
    <div className="w-full pb-24 space-y-8 animate-fade-in max-w-7xl mx-auto px-4">
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
         <DashboardCard title="Wallet Balance" value={`Rs. ${(user?.balance || 0).toLocaleString()}`} icon={Wallet} gradient="bg-slate-950" path="/user/wallet" />
         <DashboardCard title="Today's Yield" value={`Rs. ${stats.todayIncome}`} icon={TrendingUp} gradient="bg-indigo-600" path="/user/wallet" />
         <DashboardCard title="Active Station" value={user?.currentPlan || 'NONE'} icon={Zap} gradient="bg-[#2EC4B6]" path="/user/work" />
         <DashboardCard title="My Network" value={`${stats.teamCount}`} icon={Users} gradient="bg-sky-600" path="/user/team" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
         <div className="lg:col-span-4 space-y-6">
            <StreakWidget />
            
            {/* BOUNCE PREVIEW SECTION (UPGRADED) */}
            <section className="bg-slate-900 rounded-[44px] p-8 text-white relative overflow-hidden border-b-8 border-[#4A6CF7] shadow-2xl">
               <div className="absolute top-0 right-0 p-6 opacity-10 rotate-12 scale-150"><Award size={100} /></div>
               <div className="relative z-10 space-y-6">
                  <div>
                     <h4 className="text-2xl font-black italic tracking-tighter uppercase leading-none mb-1">BUMPER <span className="text-[#4A6CF7]">BONUS.</span></h4>
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">New Achievement Nodes Active</p>
                  </div>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#2EC4B6] rounded-xl flex items-center justify-center shadow-lg"><Gift size={20}/></div>
                        <span className="text-[10px] font-black uppercase italic">Invite 10 Friends</span>
                     </div>
                     <p className="text-sm font-black text-[#2EC4B6] italic">Rs 500</p>
                  </div>
                  <Link to="/user/achievements" className="flex items-center justify-center gap-3 w-full h-14 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                     View All Rewards <ArrowRight size={16}/>
                  </Link>
               </div>
            </section>
         </div>

         <div className="lg:col-span-8 space-y-6">
            <section className="bg-white p-8 md:p-12 rounded-[56px] border border-slate-100 shadow-sm relative overflow-hidden group">
               <div className="flex flex-col md:flex-row items-center gap-10">
                  <div className="shrink-0 relative">
                     <motion.div animate={{ rotateY: 360 }} transition={{ repeat: Infinity, duration: 8, ease: "linear" }} className="w-28 h-28 bg-gradient-to-br from-indigo-500 to-indigo-900 rounded-[35px] flex items-center justify-center border-4 border-white shadow-2xl">
                        <Gem size={52} className="text-white" />
                     </motion.div>
                     <div className="absolute -top-3 -right-3"><Sparkles className="text-amber-400" size={32} /></div>
                  </div>
                  <div className="flex-grow text-center md:text-left space-y-4">
                     <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-indigo-100">
                        <BadgeCheck size={12} /> PREMIUM STATION UPGRADE
                     </div>
                     <h3 className="text-3xl font-black italic tracking-tighter uppercase leading-none">Maximize Your <span className="text-indigo-600">Daily Earning.</span></h3>
                     <p className="text-slate-400 text-xs font-medium leading-relaxed italic max-w-md mx-auto md:mx-0">Upgrade your station to Diamond and unlock high-reward assignments instantly.</p>
                     <Link to="/user/plans" className="inline-flex h-16 px-12 bg-slate-950 text-white rounded-[28px] font-black text-xs uppercase tracking-[0.3em] shadow-2xl items-center gap-4 active:scale-95 transition-all">
                        Upgrade Station <ArrowRight size={18}/>
                     </Link>
                  </div>
               </div>
            </section>

            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-between h-44 hover:border-indigo-200 transition-all cursor-pointer" onClick={() => window.location.href='/#/user/work'}>
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner"><Briefcase size={24}/></div>
                  <div>
                     <h4 className="text-sm font-black text-slate-800 uppercase italic">Start Work</h4>
                     <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Available Assignments: {stats.pendingTasksCount}</p>
                  </div>
               </div>
               <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-between h-44 hover:border-[#2EC4B6] transition-all cursor-pointer" onClick={() => window.location.href='/#/user/team'}>
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner"><Users size={24}/></div>
                  <div>
                     <h4 className="text-sm font-black text-slate-800 uppercase italic">Grow Team</h4>
                     <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Direct Nodes: {stats.teamCount}</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default UserDashboard;