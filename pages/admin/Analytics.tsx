
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, TrendingUp, Users, Wallet, 
  Calendar, RefreshCw, ChevronDown, PieChart,
  ArrowUpRight, ArrowDownRight, Activity, Filter,
  ShieldCheck, Download
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, BarChart, Bar, Cell, PieChart as RePieChart, Pie, Legend
} from 'recharts';
import { api } from '../../utils/api';
import { clsx } from 'clsx';

const Analytics = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);

  const fetchAnalytics = async () => {
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

  useEffect(() => { fetchAnalytics(); }, [days]);

  const COLORS = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#0ea5e9'];

  if (loading && !data) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
      <RefreshCw className="animate-spin text-indigo-600" size={40} />
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Querying Database...</p>
    </div>
  );

  return (
    <div className="space-y-6 pb-24 animate-fade-in max-w-7xl mx-auto px-1">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 p-2">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Business <span className="text-indigo-600">Intelligence.</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px] mt-3 italic flex items-center gap-2">
            <Activity size={14} className="text-indigo-500" /> Real-time Performance Metrics & Trends
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
          <button onClick={fetchAnalytics} className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 shadow-sm active:rotate-180 transition-transform duration-500 hover:text-indigo-600">
            <RefreshCw size={20} className={clsx(loading && "animate-spin")} />
          </button>
        </div>
      </header>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 px-1">
        <StatCard title="Gross Revenue" value={`Rs. ${data?.summary?.revenue.toLocaleString()}`} icon={TrendingUp} trend={12} color="text-emerald-500" />
        <StatCard title="Total Payouts" value={`Rs. ${data?.summary?.payouts.toLocaleString()}`} icon={Wallet} trend={-5} color="text-rose-500" />
        <StatCard title="Net Ecosystem" value={`Rs. ${data?.summary?.profit.toLocaleString()}`} icon={ShieldCheck} trend={8} color="text-indigo-500" />
        <StatCard title="Member Base" value={data?.summary?.totalMembers} icon={Users} trend={24} color="text-sky-500" />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-1">
        {/* Financial Flow Chart */}
        <div className="lg:col-span-12 bg-white p-6 md:p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h3 className="text-lg font-black text-slate-900 uppercase italic">Financial Performance</h3>
              <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Comparison of Deposits vs Payouts</p>
            </div>
            <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all">
              <Download size={16} />
            </button>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.charts?.finance}>
                <defs>
                  <linearGradient id="colorDep" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorWith" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15}/><stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 800, fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 800, fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', background: '#0f172a', color: '#fff', padding: '15px' }}
                  itemStyle={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase' }}
                />
                <Area type="monotone" dataKey="deposits" stroke="#10b981" strokeWidth={4} fill="url(#colorDep)" animationDuration={2000} />
                <Area type="monotone" dataKey="withdrawals" stroke="#f43f5e" strokeWidth={4} fill="url(#colorWith)" animationDuration={2000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Growth Bar Chart */}
        <div className="lg:col-span-7 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
          <div className="mb-8">
            <h3 className="text-sm font-black text-slate-900 uppercase italic">Member Acquisition</h3>
            <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Daily registration velocity</p>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.charts?.growth}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 8, fontWeight: 800, fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 8, fontWeight: 800, fill: '#94a3b8'}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '16px', border: 'none', background: '#0f172a', color: '#fff' }} />
                <Bar dataKey="newMembers" fill="#6366f1" radius={[10, 10, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Plan Distribution Pie Chart */}
        <div className="lg:col-span-5 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
          <div className="mb-8">
            <h3 className="text-sm font-black text-slate-900 uppercase italic">Subscription Mix</h3>
            <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Market share per Membership Tier</p>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={data?.charts?.plans}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {data?.charts?.plans?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ borderRadius: '16px', border: 'none', background: '#0f172a', color: '#fff', fontSize: '10px', fontWeight: 900 }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', color: '#64748b' }} />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
  <div className="bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group">
    <div className="flex justify-between items-start mb-4">
      <div className={clsx("w-10 h-10 rounded-2xl flex items-center justify-center bg-slate-50 transition-transform group-hover:scale-110", color)}>
        <Icon size={20} />
      </div>
      <div className={clsx("px-2 py-1 rounded-lg text-[8px] font-black flex items-center gap-1", trend > 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600")}>
        {trend > 0 ? <ArrowUpRight size={10}/> : <ArrowDownRight size={10}/>} {Math.abs(trend)}%
      </div>
    </div>
    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">{title}</p>
    <h4 className="text-xl font-black text-slate-900 italic tracking-tight">{value}</h4>
  </div>
);

export default Analytics;
