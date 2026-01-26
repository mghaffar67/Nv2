
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, Wallet, Users, 
  Activity, RefreshCw, Zap, Clock, ArrowUpRight,
  PieChart, BarChart3, FileText, LayoutDashboard,
  ShieldCheck, Loader2, Trophy, CheckSquare, 
  ArrowRight, Sparkles, Filter, Calendar, 
  Search, ArrowDownLeft, Trash2, Eye
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, CartesianGrid, BarChart, Bar, Cell
} from 'recharts';
import { api } from '../../utils/api';
import { clsx } from 'clsx';

const MiniStatCard = ({ title, value, icon: Icon, gradient, trend }: any) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className={clsx(
      "relative p-5 rounded-[32px] overflow-hidden shadow-lg border border-white/10 group h-32 flex flex-col justify-between transition-all hover:-translate-y-1",
      gradient
    )}
  >
    <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
    <div className="relative z-10 flex justify-between items-start">
      <div className="w-9 h-9 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/10">
        <Icon size={18} />
      </div>
      {trend && (
        <div className="px-2 py-0.5 bg-white/20 backdrop-blur-md rounded-lg text-[8px] font-black text-white flex items-center gap-1 border border-white/10">
          <ArrowUpRight size={10} /> {trend}%
        </div>
      )}
    </div>
    <div className="relative z-10">
      <p className="text-[8px] font-black text-white/60 uppercase tracking-[0.2em]">{title}</p>
      <h3 className="text-xl font-black text-white tracking-tighter italic">{value}</h3>
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filterRange, setFilterRange] = useState('7D');
  const [trxSearch, setTrxSearch] = useState('');

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/reports');
      setReport(res);
    } catch (e) {
      console.error("Sync failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  // Mock Recent Transactions derived from report data
  const recentTransactions = useMemo(() => {
    if (!report) return [];
    // Combine and sort latest data (Prototype logic)
    return [
      { id: 'TX-9901', user: 'Zaid Khan', amount: 5000, type: 'deposit', status: 'pending', time: '2m ago' },
      { id: 'TX-8822', user: 'Sana Ahmed', amount: 1200, type: 'withdraw', status: 'approved', time: '15m ago' },
      { id: 'TX-7731', user: 'Ali Raza', amount: 450, type: 'reward', status: 'approved', time: '1h ago' },
      { id: 'TX-6610', user: 'Bilal Butt', amount: 15000, type: 'deposit', status: 'rejected', time: '3h ago' },
    ].filter(t => t.user.toLowerCase().includes(trxSearch.toLowerCase()));
  }, [report, trxSearch]);

  if (loading && !report) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <RefreshCw className="animate-spin text-indigo-600" size={40} />
      </div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Synchronizing Node...</p>
    </div>
  );

  return (
    <div className="space-y-6 pb-24 animate-fade-in max-w-7xl mx-auto px-1">
      {/* Header with Global Filters */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2 pt-2">
         <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
              Control <span className="text-indigo-600">Hub.</span>
            </h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px] mt-1 italic">Real-time Financial Audit</p>
         </div>
         <div className="flex bg-white p-1 rounded-xl border border-slate-100 shadow-sm w-full md:w-auto">
            {['24H', '7D', '30D', 'ALL'].map(r => (
              <button 
                key={r} onClick={() => setFilterRange(r)}
                className={clsx(
                  "flex-1 md:px-6 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all",
                  filterRange === r ? "bg-slate-950 text-white shadow-lg" : "text-slate-400 hover:text-slate-900"
                )}
              >
                {r}
              </button>
            ))}
         </div>
      </header>

      {/* 2-Column Grid for Compact Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 px-1">
         <MiniStatCard title="Liquidity In" value={`Rs. ${report?.finance?.totalDeposits.toLocaleString()}`} icon={ArrowUpRight} gradient="bg-gradient-to-br from-indigo-600 to-blue-500" trend={12} />
         <MiniStatCard title="Yield Out" value={`Rs. ${report?.finance?.totalWithdrawals.toLocaleString()}`} icon={ArrowDownLeft} gradient="bg-gradient-to-br from-rose-600 to-pink-500" trend={-4} />
         <MiniStatCard title="Bonus Hub" value={`Rs. ${report?.finance?.totalRewardBonusPaid.toLocaleString()}`} icon={Trophy} gradient="bg-gradient-to-br from-amber-500 to-orange-400" trend={8} />
         <MiniStatCard title="Active Nodes" value={report?.users?.totalUsers} icon={Users} gradient="bg-gradient-to-br from-slate-900 to-slate-800" trend={5} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-1">
         {/* Smaller Optimized Graph */}
         <div className="lg:col-span-7 bg-white p-6 rounded-[36px] border border-slate-100 shadow-sm relative overflow-hidden h-fit">
            <div className="flex justify-between items-center mb-8">
               <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Network Flow</h4>
                  <p className="text-sm font-black text-slate-900 italic">Financial Trends</p>
               </div>
               <Activity size={18} className="text-indigo-500" />
            </div>

            <div className="h-[220px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={report?.trends || []}>
                     <defs>
                        <linearGradient id="gIn" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 7, fontWeight: 900, fill: '#cbd5e1'}} tickFormatter={(s) => s.split('-')[2]} />
                     <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', background: '#0f172a', padding: '10px' }}
                        itemStyle={{ fontSize: '9px', fontWeight: 900, color: '#fff' }}
                        labelStyle={{ display: 'none' }}
                     />
                     <Area type="monotone" dataKey="deposit" stroke="#6366f1" strokeWidth={3} fill="url(#gIn)" animationDuration={1500} />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Compact Recent Activity List */}
         <div className="lg:col-span-5 bg-white p-6 rounded-[36px] border border-slate-100 shadow-sm flex flex-col h-[320px]">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic flex items-center gap-2">
                 <Clock size={14} className="text-indigo-600" /> Recent Vouchers
               </h3>
               <div className="relative w-32">
                 <Search size={10} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-300" />
                 <input 
                   type="text" placeholder="Quick Find..." value={trxSearch} onChange={e => setTrxSearch(e.target.value)}
                   className="w-full h-7 pl-6 pr-2 bg-slate-50 rounded-lg text-[8px] font-bold outline-none border border-slate-100 focus:border-indigo-200"
                 />
               </div>
            </div>

            <div className="space-y-2 overflow-y-auto no-scrollbar flex-grow pr-1">
               {recentTransactions.length > 0 ? recentTransactions.map((trx) => (
                 <div key={trx.id} className="p-3 bg-slate-50/50 rounded-2xl border border-transparent hover:border-slate-100 flex items-center justify-between group transition-all">
                    <div className="flex items-center gap-3">
                       <div className={clsx(
                         "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm",
                         trx.type === 'deposit' ? "bg-indigo-50 text-indigo-600" : trx.type === 'withdraw' ? "bg-rose-50 text-rose-500" : "bg-emerald-50 text-emerald-600"
                       )}>
                          <Sparkles size={14} />
                       </div>
                       <div className="overflow-hidden">
                          <h4 className="text-[9px] font-black text-slate-800 uppercase truncate leading-none mb-1">{trx.user}</h4>
                          <p className="text-[7px] font-bold text-slate-400 uppercase">{trx.time}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className={clsx("font-black text-[10px] mb-1", trx.type === 'withdraw' ? "text-rose-500" : "text-indigo-600")}>
                         {trx.type === 'withdraw' ? '-' : '+'}Rs {trx.amount}
                       </p>
                       <span className={clsx(
                         "text-[6px] font-black uppercase px-1.5 py-0.5 rounded-md border",
                         trx.status === 'pending' ? "bg-amber-50 text-amber-500 border-amber-100" : "bg-green-50 text-green-600 border-green-100"
                       )}>{trx.status}</span>
                    </div>
                 </div>
               )) : (
                 <div className="h-full flex flex-col items-center justify-center opacity-30 italic py-10">
                   <Zap size={32} className="text-slate-300 mb-2" />
                   <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Buffer Empty</p>
                 </div>
               )}
            </div>
         </div>
      </div>

      {/* Analytics Insight Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-1">
         <div className="bg-slate-900 p-6 rounded-[32px] text-white flex items-center gap-4 shadow-xl">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-emerald-400 border border-white/5"><TrendingUp size={20}/></div>
            <div>
               <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Growth Node</p>
               <p className="text-sm font-black italic">+24.5% This Week</p>
            </div>
         </div>
         <div className="bg-indigo-600 p-6 rounded-[32px] text-white flex items-center gap-4 shadow-xl">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white border border-white/5"><CheckSquare size={20}/></div>
            <div>
               <p className="text-[8px] font-black text-indigo-200 uppercase tracking-widest">Tasks Synced</p>
               <p className="text-sm font-black italic">98.2% Accuracy</p>
            </div>
         </div>
         <div className="bg-emerald-600 p-6 rounded-[32px] text-white flex items-center gap-4 shadow-xl group cursor-pointer active:scale-95 transition-transform" onClick={() => window.location.href='#/admin/requests'}>
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white border border-white/5"><RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-700"/></div>
            <div>
               <p className="text-[8px] font-black text-emerald-200 uppercase tracking-widest">Requests Hub</p>
               <p className="text-sm font-black italic">{report?.pendingRequests} Active Vouchers</p>
            </div>
            <ArrowRight size={16} className="ml-auto opacity-50" />
         </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
