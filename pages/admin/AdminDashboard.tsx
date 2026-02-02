
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Wallet, Users, Zap, Clock, 
  ShieldCheck, CheckSquare, Filter, RefreshCw, 
  BadgeCheck, CreditCard, Trophy, Sparkles, Briefcase,
  Activity, ArrowUpRight, BarChart3
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, CartesianGrid, 
  PieChart as RePieChart, Pie, Cell, Legend
} from 'recharts';
import { api } from '../../utils/api';
import { clsx } from 'clsx';

const StatCard = ({ title, value, icon: Icon, gradient, delay, trend }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className={clsx(
      "p-6 rounded-[32px] border border-white/10 shadow-xl flex flex-col justify-between h-40 relative overflow-hidden group transition-all hover:scale-[1.02]",
      gradient
    )}
  >
    <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
    <div className="flex justify-between items-start relative z-10">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-black/20 backdrop-blur-md border border-white/10 text-white">
        <Icon size={24} />
      </div>
      {trend && (
        <div className="bg-white/10 backdrop-blur-md border border-white/10 px-2 py-1 rounded-lg text-[7px] font-black text-white uppercase tracking-widest flex items-center gap-1">
          <ArrowUpRight size={10} className="text-emerald-400" /> {trend}
        </div>
      )}
    </div>
    <div className="relative z-10">
        <p className="text-[8px] font-black text-white/60 uppercase tracking-[0.2em] mb-1 italic">{title}</p>
        <h4 className="text-3xl font-black text-white italic tracking-tighter leading-none">{value}</h4>
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/reports?days=${days}`);
      setData(res);
    } catch (e) {
      console.error("Ledger synchronization failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, [days]);

  const COLORS = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#0ea5e9'];

  if (loading && !data) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
      <RefreshCw className="animate-spin text-indigo-600" size={44} />
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Booting Intelligence Hub...</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-24 animate-fade-in max-w-7xl mx-auto px-2">
      
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 p-2">
        <div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Executive <span className="text-indigo-600">Terminal.</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] mt-4 italic flex items-center gap-2">
            <BadgeCheck size={16} className="text-indigo-500" /> Operational Oversight & Financial Logic Audit
          </p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-grow md:flex-none">
            <Filter size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <select 
              value={days} 
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full md:w-48 h-12 pl-10 pr-4 bg-white border border-slate-100 rounded-2xl font-black text-[10px] uppercase outline-none shadow-sm appearance-none cursor-pointer"
            >
              <option value={7}>Last 7 Days</option>
              <option value={30}>Last 30 Days</option>
              <option value={90}>Last 3 Months</option>
            </select>
          </div>
          <button onClick={fetchStats} className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 shadow-sm active:rotate-180 transition-transform duration-500 hover:text-indigo-600">
            <RefreshCw size={20} className={clsx(loading && "animate-spin")} />
          </button>
        </div>
      </header>

      {/* CORE FINANCIAL NODES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={`Rs. ${data?.summary?.revenue?.toLocaleString()}`} icon={TrendingUp} gradient="bg-slate-950" delay={0.1} trend="+12.5%" />
        <StatCard title="Approved Payouts" value={`Rs. ${data?.summary?.payouts?.toLocaleString()}`} icon={CreditCard} gradient="bg-rose-600" delay={0.2} trend="Stable" />
        <StatCard title="Net Asset Value" value={`Rs. ${data?.summary?.profit?.toLocaleString()}`} icon={ShieldCheck} gradient="bg-emerald-600" delay={0.3} trend="+8.2%" />
        <StatCard title="Identity Nodes" value={data?.summary?.totalMembers} icon={Users} gradient="bg-indigo-600" delay={0.4} trend="Growing" />
      </div>

      {/* TASK ANALYTICS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Lifetime Yield" value={`Rs. ${data?.summary?.totalUserEarnings?.toLocaleString()}`} icon={Trophy} gradient="bg-amber-500" delay={0.5} />
        <StatCard title="Today's Harvest" value={`Rs. ${data?.summary?.todayUserEarnings?.toLocaleString()}`} icon={Sparkles} gradient="bg-sky-600" delay={0.6} />
        <StatCard title="Auth Pipeline" value={data?.summary?.pendingTasksCount} icon={Clock} gradient="bg-slate-800" delay={0.7} />
        <StatCard title="Processed Tasks" value={data?.summary?.totalTasksCompleted} icon={CheckSquare} gradient="bg-indigo-900" delay={0.8} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Financial Area Chart */}
        <div className="lg:col-span-8 bg-white p-8 rounded-[48px] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-12">
            <div>
              <h3 className="text-xl font-black text-slate-900 uppercase italic">Ecosystem Performance</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest italic">Capital Inflow vs Distribution Audit</p>
            </div>
            <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600"><BarChart3 size={20} /></div>
          </div>

          <div className="h-[400px] w-full">
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
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', background: '#0f172a', color: '#fff', padding: '20px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase' }}
                />
                <Area type="monotone" dataKey="deposits" name="Revenue" stroke="#10b981" strokeWidth={5} fill="url(#colorDep)" animationDuration={2000} />
                <Area type="monotone" dataKey="withdrawals" name="Payouts" stroke="#f43f5e" strokeWidth={5} fill="url(#colorWith)" animationDuration={2000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subscription Mix */}
        <div className="lg:col-span-4 bg-white p-8 rounded-[48px] border border-slate-100 shadow-sm flex flex-col h-full">
          <div className="mb-10">
            <h3 className="text-lg font-black text-slate-900 uppercase italic">Station Mix</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 italic tracking-widest">Membership Tier Analytics</p>
          </div>
          <div className="h-[350px] w-full flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie data={data?.charts?.plans} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value">
                  {data?.charts?.plans?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', background: '#0f172a', color: '#fff', fontSize: '11px', fontWeight: 900 }}
                />
                <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }} />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
