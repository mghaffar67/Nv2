
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, Wallet, Users, 
  Activity, RefreshCw, Zap, Clock, ArrowUpRight,
  PieChart, BarChart3, FileText, LayoutDashboard,
  ShieldCheck,
  // Added Loader2 import to fix "Cannot find name 'Loader2'" error on line 62
  Loader2
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, CartesianGrid
} from 'recharts';
import { api } from '../../utils/api';
import { clsx } from 'clsx';

const StatCard = ({ title, value, icon: Icon, gradClass, sub }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={clsx(
      "relative p-4 rounded-2xl overflow-hidden shadow-sm transition-all h-28 flex flex-col justify-between text-white border border-white/5",
      gradClass
    )}
  >
    <div className="absolute -top-3 -right-3 w-16 h-16 bg-white/5 rounded-full blur-xl" />
    <div className="relative z-10 flex justify-between items-start">
      <div className="w-8 h-8 rounded-lg bg-black/20 backdrop-blur-md flex items-center justify-center border border-white/10">
        <Icon size={16} />
      </div>
      <span className="text-[6px] font-black uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded-md">{sub}</span>
    </div>
    <div className="relative z-10">
      <p className="text-[7px] font-bold uppercase tracking-widest opacity-60 mb-0.5">{title}</p>
      <h3 className="text-base font-black italic tracking-tighter leading-none">
        {typeof value === 'number' ? `Rs. ${value.toLocaleString()}` : value}
      </h3>
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/reports');
      setReport(res);
    } catch (e) {
      console.error("Data refresh failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  if (loading && !report) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
       <Loader2 size={32} className="animate-spin text-indigo-500" />
       <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Decrypting Registry...</p>
    </div>
  );

  return (
    <div className="space-y-4 pb-20 animate-fade-in max-w-7xl mx-auto px-1.5">
      <header className="flex justify-between items-end pt-4 px-2">
         <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
              Command <span className="text-indigo-600">Hub.</span>
            </h1>
            <p className="text-slate-400 font-bold uppercase text-[7px] tracking-[0.3em] mt-2 flex items-center gap-2">
               <ShieldCheck size={10} className="text-emerald-500" /> System Integrity Secured
            </p>
         </div>
         <button onClick={fetchStats} className="w-9 h-9 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 shadow-sm active:scale-90 transition-all">
            <RefreshCw size={16} className={clsx(loading && "animate-spin")} />
         </button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 px-1">
         <StatCard title="Liquidity In" value={report?.finance?.totalDeposits || 0} icon={TrendingUp} gradClass="bg-indigo-600" sub="Deposits" />
         <StatCard title="Net Profit" value={report?.finance?.netProfit || 0} icon={Zap} gradClass="bg-emerald-600" sub="Earnings" />
         <StatCard title="Liquidity Out" value={report?.finance?.totalWithdrawals || 0} icon={TrendingDown} gradClass="bg-rose-600" sub="Payouts" />
         <StatCard title="User Pool" value={report?.finance?.totalLiability || 0} icon={Wallet} gradClass="bg-slate-900" sub="Liabilities" />
      </div>

      {/* Modern Financial Graph */}
      <div className="bg-slate-950 p-6 rounded-[32px] shadow-2xl relative overflow-hidden mx-1">
         <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12 scale-150 pointer-events-none"><Activity size={80} className="text-indigo-500" /></div>
         
         <div className="flex justify-between items-start mb-10 relative z-10">
            <div>
               <h3 className="text-sm font-black text-white italic uppercase tracking-tight flex items-center gap-2">
                  <BarChart3 size={16} className="text-sky-400" /> Financial Traffic Node
               </h3>
               <p className="text-[7px] font-bold text-slate-500 uppercase tracking-widest mt-1">7 Days Delta Visualizer</p>
            </div>
            <div className="flex gap-4">
               <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[7px] font-black text-slate-400 uppercase">Cash In</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span className="text-[7px] font-black text-slate-400 uppercase">Cash Out</span>
               </div>
            </div>
         </div>
         
         <div className="h-[220px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={report?.trends || []}>
                  <defs>
                     <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                     </linearGradient>
                     <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/><stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                     </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 7, fontWeight: 900, fill: '#475569'}} tickFormatter={(str) => str.split('-')[2]} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', background: '#0f172a', color: '#fff', fontSize: '8px', fontWeight: 900, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                    itemStyle={{ padding: '0px' }}
                  />
                  <Area type="monotone" dataKey="deposit" stroke="#10b981" strokeWidth={3} fill="url(#colorIn)" animationDuration={1500} />
                  <Area type="monotone" dataKey="withdraw" stroke="#f43f5e" strokeWidth={3} fill="url(#colorOut)" animationDuration={1500} />
               </AreaChart>
            </ResponsiveContainer>
         </div>
      </div>

      {/* User Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 px-1">
         <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                  <Users size={18} />
               </div>
               <div>
                  <h4 className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Total Registry</h4>
                  <p className="text-sm font-black text-slate-900 tracking-tight">{report?.users?.totalUsers || 0} Members</p>
               </div>
            </div>
            <div className="bg-emerald-50 px-2 py-1 rounded-lg text-[7px] font-black text-emerald-600 uppercase">+{report?.users?.joinedToday || 0} Today</div>
         </div>

         <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-9 h-9 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center">
                  <PieChart size={18} />
               </div>
               <div>
                  <h4 className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Premium Nodes</h4>
                  <p className="text-sm font-black text-slate-900 tracking-tight">{report?.users?.activePremium || 0} Active</p>
               </div>
            </div>
            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
               <div className="h-full bg-sky-500" style={{ width: `${Math.min(100, (report?.users?.activePremium / report?.users?.totalUsers || 0) * 100)}%` }} />
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
