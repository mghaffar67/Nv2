import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Users, Zap, Clock, 
  ShieldCheck, CheckSquare, RefreshCw, 
  CreditCard, Trophy, Sparkles, Activity, ArrowUpRight, BarChart3,
  Target, Layout, Gem, PieChart as PieIcon
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, CartesianGrid, 
  PieChart as RePieChart, Pie, Cell, Legend,
  BarChart, Bar
} from 'recharts';
import { api } from '../../utils/api';
import { clsx } from 'clsx';

const StatCard = ({ title, value, icon: Icon, gradient, delay, path }: any) => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className={clsx("p-6 rounded-[36px] border border-white/10 shadow-xl flex flex-col justify-between h-40 relative overflow-hidden group transition-all", gradient)}
    >
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
      <div className="flex justify-between items-start relative z-10">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-black/20 backdrop-blur-md border border-white/10 text-white shadow-lg">
          <Icon size={24} />
        </div>
        <div className="bg-white/10 px-2 py-0.5 rounded-full text-[8px] font-black text-white uppercase tracking-widest flex items-center gap-1">
          <ArrowUpRight size={10} className="text-emerald-400" /> LIVE
        </div>
      </div>
      <div className="relative z-10">
          <p className="text-[9px] font-black text-white/60 uppercase tracking-[0.2em] mb-0.5 italic">{title}</p>
          <h4 className="text-2xl font-black text-white italic tracking-tighter leading-none">{value}</h4>
      </div>
    </motion.div>
);

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
      console.error("Dashboard Sync Failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, [days]);

  const COLORS = ['#4A6CF7', '#2EC4B6', '#F59E0B', '#EF4444'];

  if (loading && !data) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
      <RefreshCw className="animate-spin text-indigo-600" size={44} />
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Calibrating Command Hub...</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-24 animate-fade-in max-w-7xl mx-auto px-4">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Platform <span className="text-indigo-600">Sync.</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] mt-4 italic flex items-center gap-2">
            <Activity size={16} className="text-indigo-500" /> Integrated Logic & Module Analytics
          </p>
        </div>
        <div className="flex gap-2">
          <select value={days} onChange={(e) => setDays(Number(e.target.value))} className="h-12 px-4 bg-white border border-slate-100 rounded-2xl font-black text-[10px] uppercase shadow-sm">
            <option value={7}>Last 7 Days</option>
            <option value={30}>Monthly View</option>
            <option value={90}>Quarterly Cycle</option>
          </select>
          <button onClick={fetchStats} className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 shadow-sm hover:text-indigo-600">
            <RefreshCw size={20} className={clsx(loading && "animate-spin")} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Gross Liquidity" value={`Rs. ${data?.summary?.revenue?.toLocaleString()}`} icon={TrendingUp} gradient="bg-slate-950" delay={0.1} />
        <StatCard title="Payout Nodes" value={`Rs. ${data?.summary?.payouts?.toLocaleString()}`} icon={CreditCard} gradient="bg-rose-600" delay={0.2} />
        <StatCard title="Task Velocity" value={data?.summary?.totalTasksCompleted} icon={CheckSquare} gradient="bg-emerald-600" delay={0.3} />
        <StatCard title="Global Hubs" value={data?.summary?.totalMembers} icon={Users} gradient="bg-indigo-600" delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* FINANCIAL FLOW */}
        <div className="lg:col-span-8 bg-white p-8 rounded-[48px] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h3 className="text-lg font-black text-slate-900 uppercase italic">Ledger Trends</h3>
              <p className="text-[9px] font-bold text-slate-400 uppercase mt-1 italic">Comparison: Deposits vs Disbursals</p>
            </div>
            <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600"><BarChart3 size={20} /></div>
          </div>
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.charts?.finance}>
                <defs>
                  <linearGradient id="colorDep" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4A6CF7" stopOpacity={0.1}/><stop offset="95%" stopColor="#4A6CF7" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 900, fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 900, fill: '#94a3b8'}} />
                <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', background: '#0f172a', color: '#fff' }} />
                <Area type="monotone" dataKey="deposits" name="Inflow" stroke="#4A6CF7" strokeWidth={5} fill="url(#colorDep)" />
                <Area type="monotone" dataKey="withdrawals" name="Outflow" stroke="#EF4444" strokeWidth={5} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* MODULE DISTRIBUTION */}
        <div className="lg:col-span-4 bg-white p-8 rounded-[48px] border border-slate-100 shadow-sm flex flex-col">
          <div className="mb-8">
            <h3 className="text-lg font-black text-slate-900 uppercase italic text-center">Identity Tiering</h3>
            <p className="text-[9px] font-bold text-slate-400 uppercase mt-1 italic text-center">Active Station Hubs</p>
          </div>
          <div className="h-[350px] w-full flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie data={data?.charts?.plans} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value">
                  {data?.charts?.plans?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', background: '#0f172a', color: '#fff', fontSize: '10px' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '9px', fontWeight: 900, textTransform: 'uppercase' }} />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;