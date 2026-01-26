
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, Wallet, Users, 
  Activity, RefreshCw, Zap, Clock, ArrowUpRight,
  BarChart3, ShieldCheck, Trophy, CheckSquare, 
  ArrowRight, Search, ArrowDownLeft, Filter,
  Calendar, Inbox, ExternalLink
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, CartesianGrid
} from 'recharts';
import { api } from '../../utils/api';
import { clsx } from 'clsx';

const GradientStatCard = ({ title, value, icon: Icon, gradient, trend }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    className={clsx(
      "relative p-5 rounded-[28px] overflow-hidden shadow-lg border border-white/10 group h-32 flex flex-col justify-between transition-all hover:shadow-2xl",
      gradient
    )}
  >
    <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
    <div className="relative z-10 flex justify-between items-start">
      <div className="w-10 h-10 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center text-white border border-white/10 shadow-inner">
        <Icon size={20} />
      </div>
      {trend && (
        <div className="px-2 py-0.5 bg-emerald-400/20 backdrop-blur-md rounded-lg text-[8px] font-black text-emerald-400 flex items-center gap-1 border border-emerald-400/20">
          <ArrowUpRight size={10} /> {trend}%
        </div>
      )}
    </div>
    <div className="relative z-10">
      <p className="text-[9px] font-black text-white/60 uppercase tracking-widest">{title}</p>
      <h3 className="text-xl font-black text-white tracking-tighter italic leading-none mt-1">{value}</h3>
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('7D');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/reports');
      setReport(res);
    } catch (e) {
      console.error("Dashboard failed to sync.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  const recentTransactions = useMemo(() => {
    if (!report) return [];
    // Mocking latest records based on summary data
    return [
      { id: '101', user: 'Zaid Ahmed', amount: 5000, type: 'deposit', status: 'pending', time: '5m ago' },
      { id: '102', user: 'Sana Khan', amount: 1200, type: 'withdraw', status: 'approved', time: '12m ago' },
      { id: '103', user: 'Ali Raza', amount: 3500, type: 'deposit', status: 'approved', time: '1h ago' },
      { id: '104', user: 'Hammad Ali', amount: 800, type: 'withdraw', status: 'pending', time: '2h ago' },
    ].filter(t => t.user.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [report, searchQuery]);

  if (loading && !report) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
      <RefreshCw className="animate-spin text-indigo-600" size={40} />
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Dashboard...</p>
    </div>
  );

  return (
    <div className="space-y-6 pb-24 animate-fade-in max-w-7xl mx-auto px-1">
      {/* Professional Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2 pt-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Admin <span className="text-indigo-600">Console.</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px] mt-1 italic flex items-center gap-2">
            <Activity size={12} className="text-indigo-500" /> Real-time Revenue & Member Activity
          </p>
        </div>
        
        <div className="flex bg-white p-1 rounded-xl border border-slate-100 shadow-sm w-full md:w-auto">
          {['24H', '7D', '30D', 'ALL'].map(f => (
            <button 
              key={f} onClick={() => setTimeFilter(f)}
              className={clsx(
                "flex-1 md:px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                timeFilter === f ? "bg-slate-950 text-white shadow-lg" : "text-slate-400 hover:text-slate-900"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      {/* 2-Column Grid for Mobile, 4 for Desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-1">
        <GradientStatCard title="Total Revenue" value={`Rs. ${report?.summary?.revenue.toLocaleString()}`} icon={TrendingUp} gradient="bg-gradient-to-br from-indigo-600 to-blue-500" trend={14} />
        <GradientStatCard title="Total Payouts" value={`Rs. ${report?.summary?.payouts.toLocaleString()}`} icon={Wallet} gradient="bg-gradient-to-br from-rose-600 to-pink-500" trend={-2} />
        <GradientStatCard title="Active Members" value={report?.summary?.totalMembers} icon={Users} gradient="bg-gradient-to-br from-emerald-600 to-teal-500" trend={8} />
        <GradientStatCard title="Net Profit" value={`Rs. ${report?.summary?.profit.toLocaleString()}`} icon={Trophy} gradient="bg-gradient-to-br from-slate-900 to-slate-800" trend={5} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-1">
        {/* Compact Optimized Chart */}
        <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden h-fit">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase italic">Financial Flow</h3>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Deposits vs Withdrawals</p>
            </div>
            <button onClick={fetchStats} className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-indigo-600 transition-all"><RefreshCw size={18} /></button>
          </div>

          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={report?.charts?.finance}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 8, fontWeight: 900, fill: '#cbd5e1'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', background: '#0f172a', padding: '12px' }}
                  itemStyle={{ fontSize: '10px', fontWeight: 900, color: '#fff' }}
                  labelStyle={{ display: 'none' }}
                />
                <Area type="monotone" dataKey="deposits" stroke="#6366f1" strokeWidth={3} fill="url(#colorRev)" animationDuration={1500} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Hub: Recent Activity */}
        <div className="lg:col-span-4 bg-white p-6 md:p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col h-[385px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic flex items-center gap-2">
              <Clock size={14} className="text-indigo-600" /> Recent Activity
            </h3>
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-300" />
              <input 
                type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-28 h-8 pl-8 pr-2 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-bold outline-none focus:border-indigo-200"
              />
            </div>
          </div>

          <div className="space-y-3 overflow-y-auto no-scrollbar flex-grow pr-1">
            {recentTransactions.map((trx: any) => (
              <div key={trx.id} className="p-3.5 bg-slate-50/50 rounded-2xl border border-transparent hover:border-slate-200 transition-all group flex items-center justify-between">
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
             View Requests Hub <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Quick Access Footer Bar */}
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
         <div className="bg-slate-900 p-6 rounded-[32px] text-white flex items-center gap-4 shadow-xl group cursor-pointer" onClick={() => window.location.href='#/admin/analytics'}>
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-sky-400 border border-white/5 shadow-inner group-hover:scale-110 transition-transform"><BarChart3 size={20}/></div>
            <div>
               <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Market Insights</p>
               <p className="text-sm font-black italic text-white group-hover:text-sky-400 transition-colors">Advanced Analytics</p>
            </div>
            <ArrowRight size={16} className="ml-auto opacity-30" />
         </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
