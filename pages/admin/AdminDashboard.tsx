import React, { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';
import { Users, Wallet, Briefcase, TrendingUp, AlertCircle, ArrowDownCircle, Zap, ShieldCheck, ChevronRight, BellRing, ClipboardCheck, Activity, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { adminController } from '../../backend_core/controllers/adminController';

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await new Promise<any>((resolve) => {
          adminController.getDashboardStats({}, { status: () => ({ json: (data: any) => resolve(data) }) });
        });
        setStats(res);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const chartData = useMemo(() => [
    { n: 'Mon', inflow: 4000, payouts: 2400 },
    { n: 'Tue', inflow: 3000, payouts: 1398 },
    { n: 'Wed', inflow: 2000, payouts: 9800 },
    { n: 'Thu', inflow: 2780, payouts: 3908 },
    { n: 'Fri', inflow: 1890, payouts: 4800 },
    { n: 'Sat', inflow: 2390, payouts: 3800 },
    { n: 'Sun', inflow: 3490, payouts: 4300 },
  ], []);

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"/></div>;

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in max-w-7xl mx-auto px-1.5 pb-24">
      {/* RAPID COMMAND PROTOCOLS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <button onClick={() => navigate('/admin/requests')} className="bg-slate-900 text-white p-6 rounded-[36px] flex items-center justify-between group shadow-2xl active:scale-[0.98] transition-all border border-white/5">
            <div className="flex items-center gap-5">
               <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform shadow-inner"><ClipboardCheck size={28}/></div>
               <div className="text-left">
                  <p className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-1">Voucher Registry</p>
                  <p className="text-lg font-black italic">Manage {stats?.pendingWithdrawals + stats?.pendingDeposits} Live Requests</p>
               </div>
            </div>
            <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-sky-500 transition-colors">
               <ChevronRight size={20} className="text-slate-600 group-hover:text-white" />
            </div>
         </button>
         <button className="bg-indigo-600 text-white p-6 rounded-[36px] flex items-center justify-between group shadow-2xl active:scale-[0.98] transition-all border border-indigo-400/20">
            <div className="flex items-center gap-5">
               <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-inner"><BellRing size={28}/></div>
               <div className="text-left">
                  <p className="text-[11px] font-black uppercase tracking-widest text-indigo-200 mb-1">Reminder Protocol</p>
                  <p className="text-lg font-black italic">Broadcast Network Alerts</p>
               </div>
            </div>
            <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-indigo-600 transition-colors">
               <ChevronRight size={20} className="text-indigo-300 group-hover:text-indigo-600" />
            </div>
         </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
         <AdminStatCard label="FLEET NODES" value={stats?.totalActivePartners} icon={Users} color="bg-indigo-50 text-indigo-600" />
         <AdminStatCard label="CAPITAL POOL" value={`Rs.${(stats?.totalCapitalPool / 1000).toFixed(1)}k`} icon={Wallet} color="bg-green-50 text-green-600" />
         <AdminStatCard label="PAYOUT QUEUE" value={stats?.pendingWithdrawals} icon={AlertCircle} color="bg-rose-50 text-rose-600" />
         <AdminStatCard label="INFLOW QUEUE" value={stats?.pendingDeposits} icon={ArrowDownCircle} color="bg-sky-50 text-sky-600" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
         {/* Financial Velocity Chart */}
         <div className="xl:col-span-8 bg-white p-6 md:p-8 rounded-[44px] border border-slate-100 shadow-sm">
            <div className="mb-8 flex justify-between items-center px-2">
               <div>
                  <h2 className="text-sm md:text-xl font-black text-slate-800 uppercase tracking-tighter italic flex items-center gap-2">
                     <Activity size={18} className="text-indigo-600" /> System Liquidity Velocity
                  </h2>
                  <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Inflow vs Payout Metrics (Last 7 Days)</p>
               </div>
               <div className="flex gap-4">
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-indigo-500"/><span className="text-[8px] font-black uppercase text-slate-400">Inbound</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-500"/><span className="text-[8px] font-black uppercase text-slate-400">Outbound</span></div>
               </div>
            </div>
            <div className="h-[200px] md:h-[320px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                     <defs>
                        <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                           <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                           <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="n" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} dy={10} />
                     <YAxis hide />
                     <Tooltip 
                        contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '10px', fontWeight: 'bold' }} 
                     />
                     <Area type="monotone" dataKey="inflow" stroke="#6366f1" strokeWidth={4} fill="url(#colorIn)" />
                     <Area type="monotone" dataKey="payouts" stroke="#f43f5e" strokeWidth={3} strokeDasharray="5 5" fill="url(#colorOut)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Side Activity Node */}
         <div className="xl:col-span-4 bg-slate-900 rounded-[44px] p-8 text-white relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-8 opacity-5 scale-150 rotate-12"><BarChart3 size={100}/></div>
            <div>
               <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-sky-400 mb-8">
                  <ShieldCheck size={10} /> Operations Status
               </div>
               <h3 className="text-2xl font-black tracking-tight mb-2">Fleet Performance</h3>
               <p className="text-slate-400 text-xs font-medium leading-relaxed">The partner network is currently expanding at a rate of <span className="text-emerald-400">+12.4%</span> weekly.</p>
            </div>

            <div className="space-y-4 mt-12">
               <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-emerald-400"><TrendingUp size={20}/></div>
                     <span className="text-[10px] font-black uppercase tracking-widest">Growth Node</span>
                  </div>
                  <span className="text-sm font-black italic">PROFITABLE</span>
               </div>
               <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-sky-400"><Zap size={20}/></div>
                     <span className="text-[10px] font-black uppercase tracking-widest">Active Links</span>
                     </div>
                  <span className="text-sm font-black italic">SYNCED</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

const AdminStatCard = ({ label, value, icon: Icon, color }: any) => (
  <div className="bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-4 active:scale-95 transition-all overflow-hidden group">
     <div className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 group-hover:rotate-12 transition-transform", color)}>
        <Icon size={24} />
     </div>
     <div className="overflow-hidden">
        <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2 truncate">{label}</p>
        <p className="text-sm md:text-xl font-black text-slate-900 truncate leading-none italic">{value}</p>
     </div>
  </div>
);

export default AdminDashboard;
