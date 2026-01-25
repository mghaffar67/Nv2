
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, Wallet, Users, 
  Activity, RefreshCw, Zap, Clock, ArrowUpRight,
  PieChart, BarChart3, FileText
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, CartesianGrid
} from 'recharts';
import { api } from '../../utils/api';
import { clsx } from 'clsx';

const StatCard = ({ title, value, icon: Icon, gradClass, sub }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    className={clsx(
      "relative p-5 rounded-[30px] overflow-hidden shadow-xl transition-all h-36 flex flex-col justify-between text-white border border-white/10",
      gradClass
    )}
  >
    <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-2xl" />
    <div className="relative z-10 flex justify-between items-start">
      <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
        <Icon size={18} />
      </div>
      <span className="text-[7px] font-black uppercase tracking-widest bg-black/20 px-2 py-1 rounded-lg">{sub}</span>
    </div>
    <div className="relative z-10">
      <p className="text-[8px] font-bold uppercase tracking-widest opacity-80 mb-1">{title}</p>
      <h3 className="text-xl font-black italic tracking-tighter leading-none">
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
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#fbfcfe]">
       <div className="w-10 h-10 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
       <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Loading Dashboard...</p>
    </div>
  );

  return (
    <div className="space-y-6 pb-24 animate-fade-in max-w-7xl mx-auto px-2">
      <header className="flex justify-between items-center pt-6 px-1">
         <div>
            <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
              Admin <span className="text-indigo-600">Portal.</span>
            </h1>
            <p className="text-slate-400 font-bold uppercase text-[8px] tracking-[0.3em] mt-2">Daily Progress & System Stats</p>
         </div>
         <button onClick={fetchStats} className="w-10 h-10 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 shadow-sm active:rotate-180 transition-all duration-700">
            <RefreshCw size={18}/>
         </button>
      </header>

      {/* 2-COLUMN GRADIENT STATS GRID */}
      <div className="grid grid-cols-2 gap-4 px-1">
         <StatCard 
           title="Total Deposits" 
           value={report?.finance?.totalDeposits || 0} 
           icon={TrendingUp} 
           gradClass="bg-gradient-to-br from-indigo-600 to-violet-700"
           sub="Cash In"
         />
         <StatCard 
           title="Total Profit" 
           value={report?.finance?.netProfit || 0} 
           icon={Zap} 
           gradClass="bg-gradient-to-br from-emerald-500 to-teal-700"
           sub="Net Earning"
         />
         <StatCard 
           title="Total Payouts" 
           value={report?.finance?.totalWithdrawals || 0} 
           icon={TrendingDown} 
           gradClass="bg-gradient-to-br from-rose-500 to-pink-700"
           sub="Cash Out"
         />
         <StatCard 
           title="User Balances" 
           value={report?.finance?.totalLiability || 0} 
           icon={Wallet} 
           gradClass="bg-gradient-to-br from-amber-500 to-orange-700"
           sub="In Wallets"
         />
      </div>

      {/* IMPROVED CHART WITHOUT HEALTH SECTION */}
      <div className="bg-slate-950 p-6 rounded-[40px] shadow-2xl relative overflow-hidden mx-1">
         <div className="flex justify-between items-center mb-8 relative z-10">
            <div>
               <h3 className="text-lg font-black text-white italic uppercase tracking-tight">Financial Traffic</h3>
               <p className="text-[7px] font-bold text-slate-500 uppercase tracking-widest mt-1">7 Days Performance View</p>
            </div>
         </div>
         
         <div className="h-[280px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={report?.trends || []}>
                  <defs>
                     <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                     </linearGradient>
                     <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/><stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                     </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 8, fontWeight: 900, fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 8, fontWeight: 900, fill: '#64748b'}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '15px', border: 'none', background: '#0f172a', color: '#fff', fontSize: '9px', fontWeight: 900 }}
                  />
                  <Area type="monotone" dataKey="deposit" stroke="#10b981" strokeWidth={4} fill="url(#colorIn)" />
                  <Area type="monotone" dataKey="withdraw" stroke="#f43f5e" strokeWidth={4} fill="url(#colorOut)" />
               </AreaChart>
            </ResponsiveContainer>
         </div>
      </div>

      {/* USER LIST SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-1">
         <div className="bg-white p-5 rounded-[30px] border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-11 h-11 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                  <Users size={22} />
               </div>
               <div>
                  <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Members</h4>
                  <p className="text-lg font-black text-slate-900 tracking-tight">{report?.users?.totalUsers || 0} Registered</p>
               </div>
            </div>
            <p className="text-[8px] font-black text-emerald-500 uppercase">+{report?.users?.joinedToday || 0} Today</p>
         </div>

         <div className="bg-white p-5 rounded-[30px] border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-11 h-11 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center">
                  <PieChart size={22} />
               </div>
               <div>
                  <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Premium Members</h4>
                  <p className="text-lg font-black text-slate-900 tracking-tight">{report?.users?.activePremium || 0} Active Plans</p>
               </div>
            </div>
            <div className="h-2 w-16 bg-slate-100 rounded-full overflow-hidden">
               <div className="h-full bg-sky-500" style={{ width: `${(report?.users?.activePremium / report?.users?.totalUsers || 1) * 100}%` }} />
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
