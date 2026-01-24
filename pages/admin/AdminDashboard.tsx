
import React, { useState, useEffect, useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, CartesianGrid
} from 'recharts';
import { motion } from 'framer-motion';
import { 
  Users, Wallet, CheckCircle2, Clock, 
  ArrowUpRight, ArrowDownRight, RefreshCw, 
  MoreVertical, Calendar, Search, Filter,
  Layers, Package, ShieldCheck, Activity,
  TrendingUp, CreditCard
} from 'lucide-react';
import { adminController } from '../../backend_core/controllers/adminController';
import { financeController } from '../../backend_core/controllers/financeController';
import { clsx } from 'clsx';

const COLORS = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b'];

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

  useEffect(() => {
    fetchData();
  }, []);

  // Mock data for trends based on real stats
  const analyticsData = useMemo(() => [
    { name: 'Jan', revenue: 4000, users: 2400 },
    { name: 'Feb', revenue: 3000, users: 1398 },
    { name: 'Mar', revenue: 2000, users: 9800 },
    { name: 'Apr', revenue: 2780, users: 3908 },
    { name: 'May', revenue: 1890, users: 4800 },
    { name: 'Jun', revenue: 2390, users: 3800 },
  ], []);

  const segmentData = [
    { name: 'Active', value: stats?.totalActivePartners || 10 },
    { name: 'New', value: 15 },
    { name: 'Idle', value: 5 }
  ];

  return (
    <div className="space-y-6 md:space-y-8 pb-24 animate-fade-in max-w-[1600px] mx-auto px-1 md:px-0">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 px-2">
         <div>
            <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              Analytics <span className="text-[10px] font-black text-slate-400 border border-slate-200 px-2.5 py-1 rounded-xl uppercase tracking-widest bg-white shadow-sm">v3.25 Core</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 ml-0.5">Platform Performance & Revenue Hub</p>
         </div>
         <div className="flex items-center gap-2 bg-white p-1.5 rounded-[22px] border border-slate-100 shadow-sm w-full lg:w-auto">
            <div className="flex items-center gap-2 px-4 py-2 text-[10px] font-black text-slate-500 uppercase tracking-widest border-r border-slate-50">
               <Calendar size={14} className="text-indigo-500" /> 01.05.2024 - 31.05.2024
            </div>
            <button onClick={fetchData} className={clsx("p-2.5 text-slate-400 hover:text-indigo-600 transition-all", loading && "animate-spin")}>
               <RefreshCw size={16}/>
            </button>
         </div>
      </div>

      {/* TOP MINI STATS (Inspired by image) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 px-1">
         <AnalyticsCard label="Requests" value={stats ? stats.pendingWithdrawals + stats.pendingDeposits : '...'} change="+8.2%" up icon={Package} />
         <AnalyticsCard label="Approved" value={stats?.totalPayoutsProcessed || '0'} change="+3.4%" up icon={CheckCircle2} />
         <AnalyticsCard label="Revenue" value={`Rs.${((stats?.totalCapitalPool || 0) / 1000).toFixed(1)}k`} change="-0.2%" down icon={Wallet} />
         <AnalyticsCard label="Members" value={stats?.totalActivePartners || '0'} change="+1.2%" up icon={Users} />
      </div>

      {/* MAIN ANALYTICS ROW */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 px-1">
         {/* Sales Dynamics (Bar Chart) */}
         <div className="xl:col-span-8 bg-white p-6 md:p-10 rounded-[44px] border border-slate-100 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-10">
               <div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight italic">Sales Dynamics</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Platform Liquidity Flow</p>
               </div>
               <select className="bg-slate-50 border border-slate-100 text-[9px] font-black uppercase rounded-xl px-4 py-2 outline-none appearance-none cursor-pointer hover:bg-slate-100 transition-colors">
                  <option>Year 2024</option>
                  <option>Year 2023</option>
               </select>
            </div>
            <div className="h-[320px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData} barGap={10}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800, fill: '#94a3b8'}} dy={12} />
                     <YAxis hide />
                     <Tooltip 
                        cursor={{fill: 'rgba(99, 102, 241, 0.05)'}}
                        contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', padding: '16px' }}
                        itemStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }}
                     />
                     <Bar dataKey="revenue" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={14} />
                     <Bar dataKey="users" fill="#e2e8f0" radius={[8, 8, 0, 0]} barSize={14} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Segmentation & Summary (Inspired by Image Right Side) */}
         <div className="xl:col-span-4 flex flex-col gap-6">
            <div className="bg-white p-8 rounded-[44px] border border-slate-100 shadow-sm flex-grow">
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight mb-8 text-center">User Segmentation</h3>
               <div className="h-[220px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                        <Pie data={segmentData} innerRadius={65} outerRadius={85} paddingAngle={8} dataKey="value" stroke="none">
                           {segmentData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                     </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                     <span className="text-3xl font-black text-slate-900 tracking-tighter italic">76%</span>
                     <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Efficiency</span>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-y-4 gap-x-6 mt-8">
                  {segmentData.map((d, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                       <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                       <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest truncate">{d.name}</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>

      {/* BOTTOM SECTION: TABLE & GROWTH */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 px-1">
         {/* Customer Order Table (Image inspired) */}
         <div className="xl:col-span-8 bg-white rounded-[44px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 flex justify-between items-center border-b border-slate-50">
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight italic">Recent Member Activity</h3>
               <button className="p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-300"><MoreVertical size={18}/></button>
            </div>
            <div className="overflow-x-auto no-scrollbar">
               <table className="w-full text-left">
                  <thead>
                     <tr className="bg-slate-50/30">
                        <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Partner</th>
                        <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Protocol</th>
                        <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
                        <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                        <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Value</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {recentTrx.map((trx, i) => (
                       <tr key={i} className="group hover:bg-slate-50/50 transition-all duration-300">
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-[14px] bg-slate-900 text-white flex items-center justify-center font-black italic text-sm shadow-xl shrink-0 border border-white/10 group-hover:rotate-6 transition-transform">{trx.userName?.charAt(0)}</div>
                                <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight truncate">{trx.userName}</span>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-2 text-sky-600">
                                <Activity size={12} />
                                <span className="text-[10px] font-bold uppercase">{trx.gateway || 'Network'}</span>
                             </div>
                          </td>
                          <td className="px-8 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{trx.date}</td>
                          <td className="px-8 py-6">
                             <span className={clsx(
                               "px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-sm",
                               trx.status === 'approved' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-amber-50 text-amber-600 border border-amber-100"
                             )}>{trx.status}</span>
                          </td>
                          <td className="px-8 py-6 text-right font-black text-slate-900 text-xs italic">Rs {trx.amount}</td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Overall User Activity (Area Chart inspired by image) */}
         <div className="xl:col-span-4 bg-white p-8 rounded-[44px] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight italic">Activity Pulse</h3>
               <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 hover:text-indigo-600 cursor-pointer"><TrendingUp size={14}/></div>
            </div>
            <div className="flex-grow h-[260px] -mx-4">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData}>
                     <defs>
                        <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15}/>
                           <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={5} fill="url(#colorFlow)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
            <div className="pt-8 border-t border-slate-50 flex justify-between items-center">
               <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5">Network Load</p>
                  <p className="text-2xl font-black text-slate-900 italic tracking-tighter leading-none">99.8% <span className="text-[10px] text-emerald-500 not-italic ml-1">Live</span></p>
               </div>
               <button className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-100 active:scale-90 transition-transform">
                  <ArrowUpRight size={24} />
               </button>
            </div>
         </div>
      </div>

    </div>
  );
};

const AnalyticsCard = ({ label, value, change, up, icon: Icon }: any) => (
  <div className="bg-white p-6 rounded-[36px] border border-slate-100 shadow-sm flex flex-col justify-between group hover:border-indigo-100 transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
     <div className="flex justify-between items-start mb-10">
        <div className="w-12 h-12 rounded-[20px] bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
           <Icon size={22} />
        </div>
        <div className={clsx(
           "flex items-center gap-1 text-[9px] font-black px-3 py-1 rounded-xl shadow-sm border",
           up ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-rose-500 bg-rose-50 border-rose-100"
        )}>
           {up ? <ArrowUpRight size={10}/> : <ArrowDownRight size={10}/>}
           {change}
        </div>
     </div>
     <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 italic">{label}</p>
        <p className="text-3xl font-black text-slate-900 tracking-tighter italic leading-none">{value}</p>
     </div>
  </div>
);

export default AdminDashboard;
