
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, Wallet, Users, 
  Activity, RefreshCw, Zap, Clock, ArrowUpRight,
  BarChart3, ShieldCheck, Trophy, CheckSquare, 
  ArrowRight, Search, ArrowDownLeft, Filter,
  Calendar, Inbox, ExternalLink, ArrowDownRight,
  PieChart as PieChartIcon, Download
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, CartesianGrid, BarChart, Bar,
  Cell, PieChart as RePieChart, Pie, Legend
} from 'recharts';
import { api } from '../../utils/api';
import { clsx } from 'clsx';

const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden"
  >
    <div className="absolute -top-10 -right-10 w-24 h-24 bg-slate-50 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className={clsx("w-10 h-10 rounded-2xl flex items-center justify-center bg-slate-50 transition-transform group-hover:scale-110", color)}>
        <Icon size={20} />
      </div>
      <div className={clsx("px-2 py-1 rounded-lg text-[8px] font-black flex items-center gap-1", trend > 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600")}>
        {trend > 0 ? <ArrowUpRight size={10}/> : <ArrowDownRight size={10}/>} {Math.abs(trend)}%
      </div>
    </div>
    <div className="relative z-10">
        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">{title}</p>
        <h4 className="text-xl font-black text-slate-900 italic tracking-tight">{value}</h4>
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/reports?days=${days}`);
      setData(res);
    } catch (e) {
      console.error("Dashboard sync failure.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, [days]);

  const COLORS = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#0ea5e9'];

  const recentTransactions = useMemo(() => {
    if (!data) return [];
    // Mocking active nodes for dashboard feel
    return [
      { id: '101', user: 'Zaid Ahmed', amount: 5000, type: 'deposit', status: 'pending', time: '5m ago' },
      { id: '102', user: 'Sana Khan', amount: 1200, type: 'withdraw', status: 'approved', time: '12m ago' },
      { id: '103', user: 'Ali Raza', amount: 3500, type: 'deposit', status: 'approved', time: '1h ago' },
    ].filter(t => t.user.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [data, searchQuery]);

  if (loading && !data) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
      <RefreshCw className="animate-spin text-indigo-600" size={40} />
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Initialising Command Center...</p>
    </div>
  );

  return (
    <div className="space-y-6 pb-24 animate-fade-in max-w-7xl mx-auto px-1">
      {/* 1. PROFESSIONAL BI HEADER */}
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
          <button onClick={fetchStats} className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 shadow-sm active:rotate-180 transition-transform duration-500 hover:text-indigo-600">
            <RefreshCw size={20} className={clsx(loading && "animate-spin")} />
          </button>
        </div>
      </header>

      {/* 2. PRIMARY STATS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-1">
        <StatCard title="Gross Revenue" value={`Rs. ${data?.summary?.revenue.toLocaleString()}`} icon={TrendingUp} trend={12} color="text-emerald-500" />
        <StatCard title="Total Payouts" value={`Rs. ${data?.summary?.payouts.toLocaleString()}`} icon={Wallet} trend={-5} color="text-rose-500" />
        <StatCard title="Net Ecosystem" value={`Rs. ${data?.summary?.profit.toLocaleString()}`} icon={ShieldCheck} trend={8} color="text-indigo-500" />
        <StatCard title="Member Base" value={data?.summary?.totalMembers} icon={Users} trend={24} color="text-sky-500" />
      </div>

      {/* 3. CORE ANALYTICS ENGINE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-1">
        {/* Main Financial Flow Chart */}
        <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h3 className="text-lg font-black text-slate-900 uppercase italic">Financial Performance</h3>
              <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Comparison of Deposits vs Payouts</p>
            </div>
            <div className="flex gap-2">
                <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                    <Download size={16} />
                </button>
            </div>
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
                  contentStyle={{ borderRadius: '24px', border: 'none', background: '#0f172a', color: '#fff', padding: '15px', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}
                  itemStyle={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase' }}
                />
                <Area type="monotone" dataKey="deposits" name="Inflow" stroke="#10b981" strokeWidth={4} fill="url(#colorDep)" animationDuration={2000} />
                <Area type="monotone" dataKey="withdrawals" name="Outflow" stroke="#f43f5e" strokeWidth={4} fill="url(#colorWith)" animationDuration={2000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Activity Side Panel */}
        <div className="lg:col-span-4 bg-white p-6 md:p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col h-[485px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic flex items-center gap-2">
              <Clock size={14} className="text-indigo-600" /> Recent Protocol
            </h3>
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-300" />
              <input 
                type="text" placeholder="Probe..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-24 h-8 pl-8 pr-2 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-bold outline-none focus:border-indigo-200"
              />
            </div>
          </div>

          <div className="space-y-3 overflow-y-auto no-scrollbar flex-grow pr-1">
            {recentTransactions.map((trx: any) => (
              <div key={trx.id} className="p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-slate-200 transition-all group flex items-center justify-between">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className={clsx(
                    "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                    trx.type === 'deposit' ? "bg-indigo-50 text-indigo-600" : "bg-rose-50 text-rose-500"
                  )}>
                    {trx.type === 'deposit' ? <TrendingUp size={16}/> : <TrendingDown size={16}/>}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-[10px] font-black text-slate-800 uppercase truncate leading-none mb-1">{trx.user}</h4>
                    <p className="text-[8px] font-bold text-slate-400 uppercase">{trx.time}</p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <p className={clsx("text-[10px] font-black italic mb-1", trx.type === 'deposit' ? "text-emerald-600" : "text-rose-600")}>
                    {trx.type === 'deposit' ? '+' : '-'}Rs {trx.amount}
                  </p>
                  <span className={clsx(
                    "text-[6px] font-black uppercase px-1.5 py-0.5 rounded-md border",
                    trx.status === 'pending' ? "bg-amber-50 text-amber-500 border-amber-100" : "bg-green-50 text-green-600 border-green-100"
                  )}>{trx.status}</span>
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => window.location.href='#/admin/requests'} className="w-full mt-6 h-12 bg-slate-900 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 shadow-lg">
             Open Requests Hub <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* 4. SECONDARY DATA NODES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-1">
         {/* Member Growth */}
         <div className="lg:col-span-7 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
            <div className="mb-8">
                <h3 className="text-sm font-black text-slate-900 uppercase italic">Acquisition Velocity</h3>
                <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Daily registration influx</p>
            </div>
            <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data?.charts?.growth}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 8, fontWeight: 800, fill: '#94a3b8'}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 8, fontWeight: 800, fill: '#94a3b8'}} />
                        <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '16px', border: 'none', background: '#0f172a', color: '#fff' }} />
                        <Bar dataKey="newMembers" name="New Members" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={25} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
         </div>

         {/* Plan Distribution */}
         <div className="lg:col-span-5 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
            <div className="mb-8">
                <h3 className="text-sm font-black text-slate-900 uppercase italic">Subscription Mix</h3>
                <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Market share per Membership Tier</p>
            </div>
            <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                        <Pie
                            data={data?.charts?.plans}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={85}
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
                        <Legend iconType="circle" wrapperStyle={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', color: '#64748b', paddingTop: '20px' }} />
                    </RePieChart>
                </ResponsiveContainer>
            </div>
         </div>
      </div>

      {/* 5. ECOSYSTEM HEALTH FOOTER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-1">
         <div className="bg-indigo-600 p-6 rounded-[32px] text-white flex items-center gap-4 shadow-xl">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white border border-white/5 shadow-inner"><Users size={20}/></div>
            <div>
               <p className="text-[8px] font-black text-indigo-200 uppercase tracking-widest">Growth Tracker</p>
               <p className="text-sm font-black italic">+24 New This Week</p>
            </div>
         </div>
         <div className="bg-emerald-600 p-6 rounded-[32px] text-white flex items-center gap-4 shadow-xl">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white border border-white/5 shadow-inner"><CheckSquare size={20}/></div>
            <div>
               <p className="text-[8px] font-black text-emerald-100 uppercase tracking-widest">Tasks Overview</p>
               <p className="text-sm font-black italic">98.5% Success Rate</p>
            </div>
         </div>
         <div className="bg-slate-900 p-6 rounded-[32px] text-white flex items-center gap-4 shadow-xl group cursor-pointer" onClick={fetchStats}>
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-sky-400 border border-white/5 shadow-inner group-hover:scale-110 transition-transform"><RefreshCw size={20}/></div>
            <div>
               <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">System Protocol</p>
               <p className="text-sm font-black italic text-white group-hover:text-sky-400 transition-colors">Nodes Operational</p>
            </div>
            <ArrowRight size={16} className="ml-auto opacity-30" />
         </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
