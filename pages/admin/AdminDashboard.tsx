
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, Wallet, CheckCircle2, Clock, 
  RefreshCw, TrendingUp, CreditCard, Activity, BarChart3
} from 'lucide-react';
import { adminController } from '../../backend_core/controllers/adminController';
import { financeController } from '../../backend_core/controllers/financeController';
import { clsx } from 'clsx';

const GradientCard = ({ title, value, sub, icon: Icon, gradient, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className={clsx(
      "relative overflow-hidden rounded-[32px] p-6 text-white shadow-xl h-44 flex flex-col justify-between group border border-white/10",
      gradient
    )}
  >
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
      <Icon size={80} strokeWidth={1} />
    </div>
    <div className="relative z-10">
       <p className="text-[11px] font-black uppercase tracking-widest opacity-70 mb-1">{title}</p>
       <h3 className="text-3xl font-black tracking-tight">{value}</h3>
    </div>
    <div className="relative z-10 flex items-center gap-1.5 bg-black/10 w-fit px-4 py-1.5 rounded-full border border-white/5">
       <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
       <p className="text-[9px] font-black uppercase tracking-wider">{sub}</p>
    </div>
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-30 animate-pulse pointer-events-none" />
  </motion.div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [recentTrx, setRecentTrx] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const statsRes = await new Promise<any>((resolve) => {
        adminController.getDashboardStats({}, { status: () => ({ json: resolve }) });
      });
      const trxRes = await new Promise<any>((resolve) => {
        financeController.getAllDeposits({}, { status: () => ({ json: resolve }) });
      });
      setStats(statsRes);
      setRecentTrx(trxRes.slice(0, 4));
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div className="space-y-6 md:space-y-8 pb-24 animate-fade-in max-w-[1600px] mx-auto px-1">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 px-2">
         <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 italic">Admin <span className="text-indigo-600">Console.</span></h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Platform Performance Overview</p>
         </div>
         <button onClick={fetchData} className={clsx("p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-indigo-600 shadow-sm transition-all", loading && "animate-spin")}>
            <RefreshCw size={18}/>
         </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 px-1">
         <GradientCard title="Total Members" value={stats?.totalActivePartners || '0'} sub="Active Users" icon={Users} gradient="bg-gradient-to-br from-indigo-500 to-indigo-900" delay={0.1} />
         <GradientCard title="Total Capital" value={`Rs.${((stats?.totalCapitalPool || 0) / 1000).toFixed(1)}k`} sub="Live Liquidity" icon={Wallet} gradient="bg-gradient-to-br from-emerald-400 to-teal-800" delay={0.2} />
         <GradientCard title="Pending Items" value={stats ? stats.pendingWithdrawals + stats.pendingDeposits : '0'} sub="Needs Action" icon={Clock} gradient="bg-gradient-to-br from-amber-400 to-orange-800" delay={0.3} />
         <GradientCard title="Total Payouts" value={`Rs.${((stats?.totalPayoutsProcessed || 0) / 1000).toFixed(1)}k`} sub="Verified Outflow" icon={CheckCircle2} gradient="bg-gradient-to-br from-rose-400 to-purple-800" delay={0.4} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 px-1">
         <div className="xl:col-span-8 bg-white p-6 md:p-8 rounded-[44px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight italic mb-8">Recent Activity</h3>
            <div className="overflow-x-auto no-scrollbar">
               <table className="w-full text-left">
                  <tbody className="divide-y divide-slate-50">
                     {recentTrx.map((trx, i) => (
                       <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-5"><span className="text-[11px] font-black text-slate-700 uppercase">{trx.userName}</span></td>
                          <td className="px-6 py-5"><span className="text-[10px] font-bold uppercase text-slate-400">{trx.gateway}</span></td>
                          <td className="px-6 py-5"><span className={clsx("px-3 py-1 rounded-full text-[8px] font-black uppercase", trx.status === 'approved' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600")}>{trx.status}</span></td>
                          <td className="px-6 py-5 text-right font-black text-slate-900 text-xs">Rs {trx.amount}</td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
         <div className="xl:col-span-4 bg-slate-900 p-8 rounded-[44px] text-white flex flex-col justify-between h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12 scale-[2]"><Activity size={64}/></div>
            <div><h4 className="text-xl font-black italic tracking-tighter uppercase mb-4">System Status</h4><p className="text-xs text-slate-400 leading-relaxed font-medium">All earning stations are synchronized and running on high-speed cloud nodes.</p></div>
            <div className="flex items-center gap-3"><div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /><span className="text-[9px] font-black uppercase text-slate-400">Hub: Operational</span></div>
         </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
