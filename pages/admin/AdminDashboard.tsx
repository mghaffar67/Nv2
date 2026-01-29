
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, Users, Zap, Clock, 
  ShieldCheck, CheckSquare, Filter, RefreshCw, 
  CreditCard, Trophy, Sparkles, Activity, ArrowUpRight, BarChart3,
  Target
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, CartesianGrid, 
  PieChart as RePieChart, Pie, Cell, Legend
} from 'recharts';
import { api } from '../../utils/api';
import { clsx } from 'clsx';

const StatCard = ({ title, value, icon: Icon, gradient, delay, path }: any) => {
  const navigate = useNavigate();
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onClick={() => path && navigate(path)}
      className={clsx(
        "p-3.5 md:p-6 rounded-[24px] md:rounded-[36px] border border-white/10 shadow-xl flex flex-col justify-between h-32 md:h-44 relative overflow-hidden group transition-all hover:scale-[1.03] cursor-pointer active:scale-95",
        gradient
      )}
    >
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
      <div className="flex justify-between items-start relative z-10">
        <div className="w-8 h-8 md:w-14 md:h-14 rounded-xl flex items-center justify-center bg-black/20 backdrop-blur-md border border-white/10 text-white shadow-lg">
          <Icon size={18} className="md:size-28" />
        </div>
        <div className="bg-white/10 backdrop-blur-md border border-white/10 px-2 py-0.5 rounded-full text-[6px] md:text-[8px] font-black text-white uppercase tracking-widest flex items-center gap-1">
          <ArrowUpRight size={10} className="text-emerald-400" /> LIVE
        </div>
      </div>
      <div className="relative z-10">
          <p className="text-[7px] md:text-[9px] font-black text-white/60 uppercase tracking-[0.2em] mb-0.5 italic truncate">{title}</p>
          <h4 className="text-lg md:text-3xl font-black text-white italic tracking-tighter leading-none">{value}</h4>
      </div>
    </motion.div>
  );
};

const AdminDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/reports?days=${days}`);
      setData(res);
    } catch (e) {
      console.error("Dashboard failed to sync.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, [days]);

  const COLORS = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#0ea5e9'];

  if (loading && !data) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
      <RefreshCw className="animate-spin text-indigo-600" size={44} />
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Syncing Central Hub...</p>
    </div>
  );

  return (
    <div className="space-y-5 md:space-y-8 pb-24 animate-fade-in max-w-7xl mx-auto px-1 md:px-2">
      
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 p-2 pt-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Manager <span className="text-indigo-600">Dashboard.</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px] md:text-[10px] mt-4 italic flex items-center gap-2">
            <Activity size={16} className="text-indigo-500" /> Platform Financials & User Growth
          </p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <select 
            value={days} 
            onChange={(e) => setDays(Number(e.target.value))}
            className="flex-grow md:w-48 h-11 md:h-12 px-4 bg-white border border-slate-100 rounded-2xl font-black text-[9px] md:text-[10px] uppercase outline-none shadow-sm cursor-pointer appearance-none"
          >
            <option value={7}>Last 7 Days</option>
            <option value={30}>Monthly Overview</option>
            <option value={90}>Last 3 Months</option>
          </select>
          <button onClick={fetchStats} className="w-11 h-11 md:w-12 md:h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 shadow-sm active:rotate-180 transition-transform duration-500 hover:text-indigo-600">
            <RefreshCw size={20} className={clsx(loading && "animate-spin")} />
          </button>
        </div>
      </header>

      {/* 2-COLUMN GRID ON MOBILE */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 px-1 md:px-0">
        <StatCard title="Platform Revenue" value={`Rs. ${data?.summary?.revenue?.toLocaleString()}`} icon={TrendingUp} gradient="bg-slate-950" delay={0.1} path="/admin/finance" />
        <StatCard title="Successful Payouts" value={`Rs. ${data?.summary?.payouts?.toLocaleString()}`} icon={CreditCard} gradient="bg-rose-600" delay={0.2} path="/admin/requests" />
        <StatCard title="System Profit" value={`Rs. ${data?.summary?.profit?.toLocaleString()}`} icon={ShieldCheck} gradient="bg-emerald-600" delay={0.3} path="/admin/finance" />
        <StatCard title="Total Members" value={data?.summary?.totalMembers} icon={Users} gradient="bg-indigo-600" delay={0.4} path="/admin/users" />
        
        <StatCard title="User Balance" value={`Rs. ${data?.summary?.totalUserEarnings?.toLocaleString()}`} icon={Trophy} gradient="bg-amber-500" delay={0.5} path="/admin/users" />
        <StatCard title="Today's Work" value={`Rs. ${data?.summary?.todayUserEarnings?.toLocaleString()}`} icon={Sparkles} gradient="bg-sky-600" delay={0.6} path="/admin/tasks" />
        <StatCard title="Pending Requests" value={data?.summary?.pendingTasksCount} icon={Clock} gradient="bg-slate-800" delay={0.7} path="/admin/requests" />
        <StatCard title="Daily Tasks" value={data?.summary?.totalTasksCompleted} icon={CheckSquare} gradient="bg-indigo-900" delay={0.8} path="/admin/tasks" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 px-1 md:px-0">
        <div className="lg:col-span-8 bg-white p-5 md:p-8 rounded-[36px] md:rounded-[48px] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h3 className="text-lg font-black text-slate-900 uppercase italic">Growth Metrics</h3>
              <p className="text-[9px] font-bold text-slate-400 uppercase mt-1 tracking-widest italic">Inflow vs Payout Statement</p>
            </div>
            <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-600 shadow-inner"><BarChart3 size={20} /></div>
          </div>

          <div className="h-[280px] md:h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.charts?.finance}>
                <defs>
                  <linearGradient id="colorDep" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorWith" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/><stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 900, fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 900, fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', background: '#0f172a', color: '#fff', padding: '15px' }}
                />
                <Area type="monotone" dataKey="deposits" name="Deposits" stroke="#10b981" strokeWidth={5} fill="url(#colorDep)" animationDuration={1800} />
                <Area type="monotone" dataKey="withdrawals" name="Payouts" stroke="#f43f5e" strokeWidth={5} fill="url(#colorWith)" animationDuration={1800} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white p-5 md:p-8 rounded-[36px] md:rounded-[48px] border border-slate-100 shadow-sm flex flex-col h-full">
          <div className="mb-8">
            <h3 className="text-lg font-black text-slate-900 uppercase italic">Station Share</h3>
            <p className="text-[9px] font-bold text-slate-400 uppercase mt-1 italic tracking-widest">Active Plan Distribution</p>
          </div>
          <div className="h-[300px] md:h-[350px] w-full flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie data={data?.charts?.plans} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={8} dataKey="value">
                  {data?.charts?.plans?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', background: '#0f172a', color: '#fff', fontSize: '10px', fontWeight: 900 }}
                />
                <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ paddingTop: '15px', fontSize: '9px', fontWeight: 900, textTransform: 'uppercase' }} />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
