
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

const DashboardCard = ({ title, value, icon: Icon, delay, gradient, path }: any) => {
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
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
           <span className="text-[7px] md:text-[8px] font-black text-white/60 uppercase tracking-widest truncate">Live Connected</span>
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
  const [tasks, setTasks] = useState<any[]>([]); // Initialized as array
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
        .filter((t: any) => t.type === 'reward' && t.date === today)
        .reduce((a: number, b: any) => a + Number(b.amount), 0);
      
      const completedCount = user?.workSubmissions?.filter((s: any) => s.status === 'approved').length || 0;
      const teamTotal = (teamData.t1?.length || 0) + (teamData.t2?.length || 0) + (teamData.t3?.length || 0);

      // FIX: taskList is an object { tasks: [], streak: X, ... }, not a raw array
      const actualTasks = taskList?.tasks || [];
      setTasks(actualTasks);
      
      setStats({
        todayIncome: todayReward,
        pendingTasksCount: actualTasks.length,
        totalTasks: completedCount,
        teamCount: teamTotal
      });
    } catch (e) {
      console.error("Dashboard Sync Failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    if (user?.id) fetchDashboardData(); 
  }, [user?.id]);

  // Safe filter check
  const amazingRewards = Array.isArray(tasks) ? tasks.filter(t => t.reward >= 100) : [];

  return (
    <div className="w-full pb-24 space-y-6 animate-fade-in max-w-7xl mx-auto px-2">
      
      {/* 1. TOP CARDS GRID - Responsive for PC */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
         <DashboardCard 
           title="Mera Balance" 
           value={`Rs. ${(user?.balance || 0).toLocaleString()}`} 
           icon={Wallet} delay={0.1} gradient="bg-slate-950" path="/user/wallet"
         />
         <DashboardCard 
           title="Aaj ki Kamai" 
           value={`Rs. ${stats.todayIncome}`} 
           icon={TrendingUp} delay={0.2} gradient="bg-indigo-600" path="/user/wallet"
         />
         <DashboardCard 
           title="Available Tasks" 
           value={`${stats.pendingTasksCount}`} 
           icon={Zap} delay={0.3} gradient="bg-emerald-600" path="/user/work"
         />
         <DashboardCard 
           title="Mera Team" 
           value={`${stats.teamCount} Members`} 
           icon={Users} delay={0.4} gradient="bg-sky-600" path="/user/team"
         />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
         
         {/* LEFT COLUMN: Check-in and Main Actions */}
         <div className="lg:col-span-4 space-y-6">
            <StreakWidget />
            
            <div className="bg-white p-6 rounded-[36px] border border-slate-100 shadow-sm space-y-6">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-2">Quick Actions</h3>
               <div className="grid grid-cols-2 gap-3">
                  <ActionTile to="/user/work" icon={Briefcase} label="Daily Work" color="bg-indigo-50 text-indigo-600" />
                  <ActionTile to="/user/achievements" icon={Trophy} label="Bonus Hub" color="bg-amber-50 text-amber-600" />
                  <ActionTile to="/user/wallet/withdraw" icon={Wallet} label="Withdraw" color="bg-rose-50 text-rose-600" />
                  <ActionTile to="/user/team" icon={Users} label="Invite Friends" color="bg-sky-50 text-sky-600" />
               </div>
            </div>
         </div>

         {/* RIGHT COLUMN: Earning Feeds */}
         <div className="lg:col-span-8 space-y-6">
            
            {/* SPECIAL OFFERS / TASKS */}
            <section className="space-y-4">
               <div className="flex justify-between items-center px-4">
                  <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] italic flex items-center gap-2">
                     <Star size={14} className="text-amber-500 fill-amber-500" /> High Earning Tasks
                  </h3>
                  <Link to="/user/work" className="text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:underline">View All</Link>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {amazingRewards.slice(0, 4).map((task, i) => (
                    <motion.div 
                      key={task.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                      className="bg-slate-900 p-6 rounded-[32px] border border-white/5 shadow-xl relative overflow-hidden group"
                    >
                       <div className="absolute top-0 right-0 p-4 opacity-[0.03] scale-150 group-hover:rotate-12 transition-transform"><Sparkles size={100} /></div>
                       <p className="text-[8px] font-black text-amber-500 uppercase tracking-widest mb-2 italic">Official Partner Task</p>
                       <h4 className="text-sm font-black text-white uppercase truncate mb-6 italic tracking-tight">{task.title}</h4>
                       <div className="flex justify-between items-center relative z-10">
                          <p className="text-lg font-black text-emerald-400 italic">Rs {task.reward}</p>
                          <Link to="/user/work" className="h-10 px-6 bg-white/10 hover:bg-white text-white hover:text-slate-900 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all flex items-center gap-2">
                             Start <ArrowRight size={12} />
                          </Link>
                       </div>
                    </motion.div>
                  ))}
                  {amazingRewards.length === 0 && (
                    <div className="col-span-full p-12 bg-white rounded-[40px] border border-dashed border-slate-200 text-center flex flex-col items-center opacity-40">
                       <Target size={40} className="text-slate-300 mb-4" />
                       <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">No high earning tasks available today.</p>
                    </div>
                  )}
               </div>
            </section>

            {/* PREVIEW WORK PARTNER SECTION */}
            <section className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 md:p-10 rounded-[44px] text-white relative overflow-hidden shadow-2xl">
               <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12 scale-[2] pointer-events-none"><Gem size={100} /></div>
               <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-4">
                     <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg border border-white/10">
                        <Rocket size={32} />
                     </div>
                     <div>
                        <h4 className="text-xl font-black italic uppercase tracking-tighter">Premium Work Partner</h4>
                        <p className="text-[9px] font-bold text-indigo-200 uppercase tracking-widest">Earn 3x more by verifying digital content</p>
                     </div>
                  </div>
                  <p className="text-xs font-medium text-indigo-100 max-w-lg leading-relaxed italic">
                    Upgrade to Diamond membership to unlock high-yield assignments. As a Premium Partner, your work is processed instantly with zero verification delays.
                  </p>
                  <Link to="/user/plans" className="inline-flex h-14 px-10 bg-white text-slate-900 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl items-center gap-3 active:scale-95 transition-all">
                     Upgrade Station Now <ChevronRight size={18} />
                  </Link>
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
