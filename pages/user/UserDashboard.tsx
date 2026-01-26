
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useConfig } from '../../context/ConfigContext';
import { 
  Wallet, Zap, History as HistoryIcon, 
  ClipboardList, CheckSquare, TrendingUp, Clock,
  ArrowRight, ShieldCheck, ChevronRight, Trophy,
  Loader2, Briefcase, CheckCircle2, Star, Sparkles,
  Smartphone, Rocket, Gem
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import StreakWidget from '../../components/user/StreakWidget';
import { api } from '../../utils/api';

const DashboardCard = ({ title, value, icon: Icon, delay, gradient }: any) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className={clsx(
        "rounded-2xl p-3.5 shadow-lg flex flex-col justify-between h-24 group transition-all border border-white/10 relative overflow-hidden",
        gradient
      )}
    >
      <div className="absolute -top-4 -right-4 w-12 h-12 bg-white/5 rounded-full blur-xl" />
      <div className="relative z-10 flex justify-between items-start">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white bg-black/20 backdrop-blur-md border border-white/10">
          <Icon size={14} />
        </div>
        <div className="text-right">
          <p className="text-[6px] font-black text-white/50 uppercase tracking-[0.2em]">{title}</p>
          <h3 className="text-sm font-black text-white tracking-tighter leading-none mt-1">{value}</h3>
        </div>
      </div>
      <div className="relative z-10 flex items-center gap-1">
        <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[6px] font-bold text-white/60 uppercase tracking-widest truncate">Secure Node Active</span>
      </div>
    </motion.div>
  );
};

const UserDashboard = () => {
  const { user } = useAuth();
  const { config } = useConfig();
  const [stats, setStats] = useState({ totalTasks: 0, pendingTasksCount: 0, todayIncome: 0 });
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [history, taskList] = await Promise.all([
        api.get('/finance/history'),
        api.get('/work/tasks')
      ]);
      
      const today = new Date().toISOString().split('T')[0];
      const todayReward = (history || [])
        .filter((t: any) => t.type === 'reward' && t.date === today)
        .reduce((a: number, b: any) => a + Number(b.amount), 0);
      
      const completedCount = user?.workSubmissions?.filter((s: any) => s.status === 'approved').length || 0;
      const validTasks = Array.isArray(taskList) ? taskList : [];

      setTasks(validTasks);
      setStats({
        todayIncome: todayReward,
        pendingTasksCount: validTasks.length,
        totalTasks: completedCount
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

  const amazingRewards = tasks.filter(t => t.reward >= 100);
  const testerTasks = tasks.filter(t => t.category === 'verification' || t.title.toLowerCase().includes('test'));

  return (
    <div className="w-full px-1 pb-24 space-y-4 max-w-lg mx-auto animate-fade-in">
      {/* Primary Stats Grid */}
      <div className="grid grid-cols-2 gap-2.5">
         <DashboardCard 
           title="Available Funds" 
           value={`Rs. ${(user?.balance || 0).toLocaleString()}`} 
           icon={Wallet} delay={0.1} gradient="bg-slate-950"
         />
         <DashboardCard 
           title="Today's Yield" 
           value={`Rs. ${stats.todayIncome}`} 
           icon={TrendingUp} delay={0.2} gradient="bg-indigo-600"
         />
         <DashboardCard 
           title="Tasks Available" 
           value={`${stats.pendingTasksCount} Slots`} 
           icon={Zap} delay={0.3} gradient="bg-emerald-600"
         />
         <DashboardCard 
           title="Work Processed" 
           value={`${stats.totalTasks} Done`} 
           icon={CheckSquare} delay={0.4} gradient="bg-sky-600"
         />
      </div>

      <StreakWidget />

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-4 gap-2">
         <ActionTile to="/user/work" icon={ClipboardList} label="Tasks" color="text-indigo-500" />
         <ActionTile to="/user/achievements" icon={Trophy} label="Bonus" color="text-amber-500" />
         <ActionTile to="/user/wallet/withdraw" icon={Wallet} label="Payout" color="text-rose-500" />
         <ActionTile to="/user/history" icon={HistoryIcon} label="Audits" color="text-slate-500" />
      </div>

      {/* AMAZING REWARDS SECTION */}
      <section className="space-y-3">
         <div className="flex justify-between items-center px-2">
            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic flex items-center gap-2">
               <Star size={12} className="text-amber-500 fill-amber-500" /> Amazing Rewards
            </h3>
            <span className="text-[7px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full uppercase">High Yield</span>
         </div>
         
         <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 px-1">
            {amazingRewards.length > 0 ? amazingRewards.map((reward, i) => (
              <motion.div 
                key={reward.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="min-w-[160px] bg-slate-900 p-4 rounded-[32px] border border-white/5 shadow-xl relative overflow-hidden"
              >
                 <div className="absolute top-0 right-0 p-2 opacity-10"><Sparkles size={40} className="text-amber-400" /></div>
                 <p className="text-[7px] font-black text-amber-500 uppercase tracking-widest mb-1 italic">Exclusive Node</p>
                 <h4 className="text-[10px] font-black text-white uppercase truncate mb-4 italic">{reward.title}</h4>
                 <div className="flex justify-between items-end">
                    <p className="text-sm font-black text-emerald-400 italic">Rs {reward.reward}</p>
                    <Link to="/user/work" className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-amber-500 transition-colors">
                       <ChevronRight size={14} />
                    </Link>
                 </div>
              </motion.div>
            )) : (
              <div className="w-full p-6 bg-slate-50 rounded-[32px] border border-dashed border-slate-200 text-center">
                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Scanning for high-yield rewards...</p>
              </div>
            )}
         </div>
      </section>

      {/* TASK AS TESTER SECTION */}
      <section className="space-y-3">
         <div className="flex justify-between items-center px-2">
            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic flex items-center gap-2">
               <Smartphone size={12} className="text-indigo-600" /> Beta Tester Program
            </h3>
            <Link to="/user/work" className="text-[8px] font-black text-indigo-600 uppercase tracking-widest">Upgrade Hub</Link>
         </div>

         <div className="bg-white p-5 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12 scale-150 text-indigo-600 pointer-events-none"><Rocket size={100} /></div>
            
            <div className="space-y-4 relative z-10">
               <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:scale-105 transition-transform">
                     <Gem size={24} />
                  </div>
                  <div>
                     <h4 className="text-sm font-black text-slate-900 uppercase italic leading-none mb-1">Associate Tester</h4>
                     <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest italic">Earn more by reviewing digital nodes</p>
                  </div>
               </div>

               <div className="space-y-2 pt-2">
                  {testerTasks.slice(0, 2).map((task) => (
                    <div key={task.id} className="p-3 bg-slate-50/50 rounded-2xl flex items-center justify-between border border-transparent hover:border-slate-100 transition-all">
                       <div className="flex items-center gap-2 overflow-hidden">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                          <p className="text-[9px] font-black text-slate-700 uppercase truncate">{task.title}</p>
                       </div>
                       <span className="text-[10px] font-black text-indigo-600 italic shrink-0 ml-2">Rs {task.reward}</span>
                    </div>
                  ))}
               </div>

               <button className="w-full h-12 bg-slate-950 text-white rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] shadow-lg flex items-center justify-center gap-2 group-hover:bg-indigo-600 transition-all">
                  Join Tester Program <ArrowRight size={14} />
               </button>
            </div>
         </div>
      </section>

      {/* CORE ASSIGNMENTS GRID */}
      <div className="space-y-3 pt-2">
         <div className="flex justify-between items-center px-2">
            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest italic flex items-center gap-2">
               <Briefcase size={12} className="text-indigo-600" /> Active Assignments
            </h3>
            <Link to="/user/history" className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Audit Ledger</Link>
         </div>

         <div className="space-y-2.5">
            {loading ? (
               <div className="p-10 bg-white rounded-3xl border border-slate-100 flex flex-col items-center gap-2">
                  <Loader2 className="animate-spin text-slate-200" size={24} />
                  <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Querying Registry...</p>
               </div>
            ) : tasks.length > 0 ? (
               tasks.slice(0, 5).map((task, idx) => (
                  <motion.div 
                    key={task.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white p-3.5 rounded-[22px] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-indigo-100 transition-all"
                  >
                     <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 bg-slate-900 text-sky-400 rounded-xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                           <Zap size={18} fill="currentColor" />
                        </div>
                        <div className="overflow-hidden">
                           <h4 className="text-[10px] font-black text-slate-800 uppercase truncate leading-none mb-1.5">{task.title}</h4>
                           <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest italic">Reward Node: Rs {task.reward}</p>
                        </div>
                     </div>
                     <Link to="/user/work" className="h-8 px-4 bg-slate-100 text-slate-900 rounded-lg font-black text-[7px] uppercase tracking-widest flex items-center gap-1 hover:bg-slate-950 hover:text-white transition-all">
                        Process <ArrowRight size={10} />
                     </Link>
                  </motion.div>
               ))
            ) : (
               <div className="p-10 bg-white rounded-3xl border border-dashed border-slate-100 text-center opacity-40">
                  <CheckCircle2 size={32} className="mx-auto mb-3 text-slate-200" />
                  <p className="text-[8px] font-black uppercase tracking-widest">Registry synchronized: No tasks</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

const ActionTile = ({ to, icon: Icon, label, color }: any) => (
  <Link to={to} className="bg-white p-2.5 rounded-xl border border-slate-100 flex flex-col items-center gap-1.5 active:scale-95 shadow-sm transition-all group">
    <div className={clsx("w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center group-hover:bg-indigo-50 transition-colors", color)}><Icon size={14}/></div>
    <span className="text-[6.5px] font-black uppercase text-slate-400 tracking-widest">{label}</span>
  </Link>
);

export default UserDashboard;
