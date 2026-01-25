
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, Wallet, Users, 
  Activity, ShieldCheck, RefreshCw, AlertTriangle,
  ArrowUpRight, PieChart, BarChart3, Zap, Clock
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, CartesianGrid, Legend,
  BarChart, Bar
} from 'recharts';
import { api } from '../../utils/api';
import { useConfig } from '../../context/ConfigContext';
import { clsx } from 'clsx';

const HealthCard = ({ title, value, icon: Icon, color, sub, glow }: any) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className={clsx(
      "relative p-6 rounded-[36px] border border-white/5 overflow-hidden shadow-2xl transition-all",
      glow ? "bg-slate-900" : "bg-white border-slate-100"
    )}
  >
    {glow && <div className={clsx("absolute -top-10 -right-10 w-32 h-32 blur-[60px] opacity-20", color.bg)} />}
    <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
      <div className="flex justify-between items-center">
        <div className={clsx("w-10 h-10 rounded-2xl flex items-center justify-center", color.bg, color.text)}>
          <Icon size={20} />
        </div>
        <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg">
          <div className={clsx("w-1 h-1 rounded-full animate-pulse", color.dot)} />
          <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">{sub}</span>
        </div>
      </div>
      <div>
        <p className={clsx("text-[9px] font-black uppercase tracking-widest mb-1", glow ? "text-slate-400" : "text-slate-300")}>{title}</p>
        <h3 className={clsx("text-2xl font-black italic tracking-tighter leading-none", glow ? "text-white" : "text-slate-900")}>
          {typeof value === 'number' ? `Rs. ${value.toLocaleString()}` : value}
        </h3>
      </div>
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const { config } = useConfig();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/reports');
      setReport(res);
    } catch (e) {
      console.error("Aggregation node offline.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  if (loading && !report) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
       <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
       <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] italic">Synthesizing Network Logs...</p>
    </div>
  );

  return (
    <div className="space-y-6 pb-24 animate-fade-in max-w-7xl mx-auto px-2">
      <header className="flex justify-between items-center pt-6">
         <div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
              System <span className="text-indigo-600">Health.</span>
            </h1>
            <p className="text-slate-400 font-bold uppercase text-[9px] tracking-[0.4em] mt-3">Advanced Liquidity Audit Hub</p>
         </div>
         <button onClick={fetchStats} className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 shadow-sm active:rotate-180 transition-all duration-700">
            <RefreshCw size={24}/>
         </button>
      </header>

      {/* 1. TOP ANALYTICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         <HealthCard 
           title="Total Revenue" 
           value={report.finance.totalDeposits} 
           icon={TrendingUp} 
           color={{ bg: 'bg-emerald-500/10', text: 'text-emerald-500', dot: 'bg-emerald-500' }}
           sub="Deposits"
         />
         <HealthCard 
           title="Total Payouts" 
           value={report.finance.totalWithdrawals} 
           icon={TrendingDown} 
           color={{ bg: 'bg-rose-500/10', text: 'text-rose-500', dot: 'bg-rose-500' }}
           sub="Withdrawals"
         />
         <HealthCard 
           title="Platform Profit" 
           value={report.finance.netProfit} 
           icon={Zap} 
           color={{ bg: 'bg-indigo-600', text: 'text-white', dot: 'bg-white' }}
           sub="Net Income"
           glow
         />
         <HealthCard 
           title="Pending Liability" 
           value={report.finance.totalLiability} 
           icon={Wallet} 
           color={{ bg: 'bg-amber-500/10', text: 'text-amber-500', dot: 'bg-amber-500' }}
           sub="User Balances"
         />
      </div>

      {/* 2. TREND VISUALIZATION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
         <div className="lg:col-span-8 bg-slate-950 p-8 rounded-[48px] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 scale-150 text-white"><Activity size={64}/></div>
            <div className="flex justify-between items-center mb-10 relative z-10">
               <div>
                  <h3 className="text-xl font-black text-white italic uppercase tracking-tight">Finance Flux Matrix</h3>
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">7-Day Inflow vs Outflow Comparison</p>
               </div>
               <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-emerald-500" />
                     <span className="text-[8px] font-black text-slate-400 uppercase">Deposits</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-rose-500" />
                     <span className="text-[8px] font-black text-slate-400 uppercase">Withdraws</span>
                  </div>
               </div>
            </div>
            
            <div className="h-[300px] w-full relative z-10">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={report.trends}>
                     <defs>
                        <linearGradient id="colorDep" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorWit" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/><stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                     <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 900, fill: '#64748b'}} />
                     <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 900, fill: '#64748b'}} />
                     <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', background: '#0f172a', color: '#fff', fontSize: '10px', fontWeight: 900 }} />
                     <Area type="monotone" dataKey="deposit" stroke="#10b981" strokeWidth={4} fill="url(#colorDep)" />
                     <Area type="monotone" dataKey="withdraw" stroke="#f43f5e" strokeWidth={4} fill="url(#colorWit)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="lg:col-span-4 bg-white p-8 rounded-[48px] border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="space-y-8">
               <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase italic tracking-tight flex items-center gap-2">
                    <PieChart size={18} className="text-indigo-600" /> Station Saturation
                  </h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Premium Member Ratio</p>
               </div>

               <div className="space-y-6">
                  <StatRow label="Active Premium Nodes" val={report.users.activePremium} max={report.users.totalUsers} color="bg-indigo-500" />
                  <StatRow label="In-Flux (Today)" val={report.users.joinedToday} max={100} color="bg-sky-500" />
                  <StatRow label="Support Queue" val={report.users.totalUsers - report.users.activePremium} max={report.users.totalUsers} color="bg-slate-400" />
               </div>
            </div>

            <div className={clsx(
              "mt-8 p-6 rounded-[32px] flex items-center gap-4 transition-all",
              report.finance.systemHealth === 'HEALTHY' ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
            )}>
               {report.finance.systemHealth === 'HEALTHY' ? <ShieldCheck size={28}/> : <AlertTriangle size={28}/>}
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest">Protocol Status</p>
                  <h4 className="text-lg font-black tracking-tight">{report.finance.systemHealth}</h4>
               </div>
            </div>
         </div>
      </div>

      {/* 3. RECENT ACTIVITY SNIPPET */}
      <div className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-sm">
         <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black text-slate-900 uppercase italic tracking-widest flex items-center gap-2">
               <Activity size={18} className="text-indigo-600" /> System Integrity Log
            </h3>
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Latest 5 Node Events</span>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-3">Liquidity Inbound</p>
               <div className="p-4 bg-slate-50 rounded-3xl flex justify-between items-center opacity-60">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center"><TrendingUp size={14}/></div>
                     <span className="text-[10px] font-black uppercase">Manual Ledger Sync</span>
                  </div>
                  <span className="text-[8px] font-bold uppercase text-slate-400">Synchronized</span>
               </div>
            </div>
            <div className="space-y-2">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-3">Identity Deployments</p>
               <div className="p-4 bg-slate-50 rounded-3xl flex justify-between items-center opacity-60">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-xl bg-indigo-500 text-white flex items-center justify-center"><Users size={14}/></div>
                     <span className="text-[10px] font-black uppercase">Identity Verification Hub</span>
                  </div>
                  <span className="text-[8px] font-bold uppercase text-slate-400">Operational</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

const StatRow = ({ label, val, max, color }: any) => {
  const pct = Math.round((val / max) * 100) || 0;
  return (
    <div className="space-y-2">
       <div className="flex justify-between items-end">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
          <p className="text-xs font-black text-slate-900">{val}</p>
       </div>
       <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} className={clsx("h-full rounded-full transition-all", color)} />
       </div>
    </div>
  );
};

export default AdminDashboard;
