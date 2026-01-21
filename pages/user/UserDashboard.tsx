
import React, { useMemo, useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Wallet, TrendingUp, Zap, ArrowUpRight, Plus, 
  History as HistoryIcon, Network, 
  RefreshCw, ShieldCheck, Activity,
  BarChart3, Target, ClipboardList,
  BellRing, Info, Star, Quote, PlayCircle, BookOpen, ExternalLink,
  Users, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { clsx } from 'clsx';
import StreakWidget from '../../components/user/StreakWidget';
import { api } from '../../utils/api';
import { useConfig } from '../../context/ConfigContext';

const UserDashboard = () => {
  const { user } = useAuth();
  const { config } = useConfig();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const syncData = async () => {
    if (!user?.id) return;
    try {
      const [historyRes, taskRes] = await Promise.all([
        api.get('/finance/history'),
        api.get('/work/tasks')
      ]);
      setTransactions(Array.isArray(historyRes) ? historyRes : []);
      setTasks(Array.isArray(taskRes) ? taskRes : []);
    } catch (e) { console.warn("Sync warning"); } finally { setLoading(false); }
  };

  useEffect(() => { syncData(); }, [user?.id]);

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const earningsToday = transactions
      .filter(t => t.type === 'reward' && t.date === today && t.status === 'approved')
      .reduce((a, b) => a + (Number(b.amount) || 0), 0);

    const chartData = [6,5,4,3,2,1,0].map(daysAgo => {
      const d = new Date(); d.setDate(d.getDate() - daysAgo);
      const dateStr = d.toISOString().split('T')[0];
      const val = transactions.filter(t => t.date === dateStr && t.type === 'reward').reduce((a, b) => a + Number(b.amount), 0);
      return { day: dateStr.split('-')[2], val: val || 0 };
    });
    return { earningsToday, queueSize: tasks.length, chartData };
  }, [transactions, tasks]);

  return (
    <div className="w-full px-1 pb-32 space-y-6 animate-fade-in">
      <header className="flex items-center justify-between pt-4 px-2">
        <div className="overflow-hidden">
          <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">
            Hi, <span className="text-indigo-600 italic">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">Member ID: {user?.id?.slice(-6)}</p>
        </div>
        <button onClick={syncData} className="w-11 h-11 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 active:scale-90"><RefreshCw size={18} /></button>
      </header>

      <div className="bg-slate-950 p-7 rounded-[40px] text-white relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 scale-150 text-sky-400 pointer-events-none"><Wallet size={120} /></div>
         <div className="relative z-10 flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest text-sky-400 mb-6">
               <Zap size={10} className="animate-pulse" /> STATION: {user?.currentPlan || 'INACTIVE'}
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 italic">Total Balance</p>
            <h2 className="text-5xl font-black tracking-tighter leading-none mb-10 italic">
              <span className="text-2xl text-emerald-400 mr-2 font-black">Rs.</span>
              {(user?.balance || 0).toLocaleString()}
            </h2>
            <div className="grid grid-cols-2 gap-4 w-full">
               <Link to="/user/plans" className="h-12 bg-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl">Upgrade Plan</Link>
               <Link to="/user/wallet/withdraw" className="h-12 bg-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">Withdraw Cash</Link>
            </div>
         </div>
      </div>

      <div className="bg-white p-6 rounded-[36px] border border-slate-100 shadow-sm">
         <div className="flex justify-between items-center mb-6">
            <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-2 italic"><BarChart3 size={14} className="text-indigo-600" /> Earnings Graph</h3>
            <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Live Updates</span>
         </div>
         <div className="h-24 w-full">
            <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={stats.chartData}>
                  <defs><linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient></defs>
                  <Area type="monotone" dataKey="val" stroke="#6366f1" strokeWidth={3} fill="url(#colorVal)" />
               </AreaChart>
            </ResponsiveContainer>
         </div>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full px-1">
         <div className="bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm flex flex-col gap-1">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Earnings Today</p>
            <h4 className="text-2xl font-black text-emerald-600 leading-none mt-2">Rs {stats.earningsToday}</h4>
         </div>
         <div className="bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm flex flex-col gap-1">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Available Tasks</p>
            <h4 className="text-2xl font-black text-slate-900 leading-none mt-2">{stats.queueSize}</h4>
         </div>
      </div>

      <div className="mx-1 bg-white p-5 rounded-[36px] border border-slate-100 shadow-sm w-full flex justify-between">
         <QuickPoint label="Work" icon={Zap} to="/user/work" color="bg-slate-900" />
         <QuickPoint label="Team" icon={Network} to="/user/team" color="bg-indigo-600" />
         <QuickPoint label="Records" icon={Activity} to="/user/history" color="bg-sky-500" />
         <QuickPoint label="Plans" icon={Target} to="/user/plans" color="bg-emerald-500" />
      </div>

      <StreakWidget />

      <div className="mx-1 bg-white p-6 rounded-[40px] border border-slate-100 shadow-sm mb-8">
         <div className="flex items-center justify-between mb-6 px-1">
            <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest italic flex items-center gap-2"><HistoryIcon size={14} className="text-indigo-600" /> Recent Activity</h3>
            <Link to="/user/history" className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">Full List</Link>
         </div>
         <div className="space-y-3">
            {transactions.slice(0, 3).map((trx) => (
              <div key={trx.id} className="p-4 bg-slate-50/50 rounded-[24px] flex items-center justify-between border border-transparent hover:border-slate-100">
                 <div className="flex items-center gap-3.5">
                    <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm", trx.type === 'withdraw' ? "bg-rose-100 text-rose-500" : "bg-emerald-100 text-emerald-600")}>
                      {trx.type === 'withdraw' ? <Activity size={16}/> : <Zap size={16} fill="currentColor"/>}
                    </div>
                    <div>
                       <p className="font-black text-slate-800 text-[10px] uppercase leading-none mb-1.5">{trx.gateway || trx.type}</p>
                       <span className={clsx("text-[7px] font-black uppercase px-2 py-0.5 rounded-md border", trx.status === 'approved' ? "bg-green-50 text-green-600 border-green-100" : "bg-amber-50 text-amber-600 border-amber-100")}>{trx.status}</span>
                    </div>
                 </div>
                 <p className={clsx("font-black text-xs italic", trx.type === 'withdraw' ? "text-slate-900" : "text-emerald-600")}>
                    {trx.type === 'withdraw' ? '-' : '+'}Rs {trx.amount}
                 </p>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

const QuickPoint = ({ label, icon: Icon, to, color }: any) => (
  <Link to={to} className="flex-1 flex flex-col items-center gap-2">
    <div className={clsx("w-14 h-14 rounded-[22px] flex items-center justify-center shadow-md active:scale-90", color)}><Icon size={22} className="text-white" /></div>
    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
  </Link>
);

export default UserDashboard;
