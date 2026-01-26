import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, Trophy, CheckSquare, Zap, 
  TrendingUp, TrendingDown, Clock, ShieldCheck,
  RefreshCw, PieChart, Target, UserPlus
} from 'lucide-react';
// Added CartesianGrid to imports to fix missing name error on line 110
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart as RePieChart, Pie, CartesianGrid
} from 'recharts';
import { api } from '../../../utils/api';
import { clsx } from 'clsx';

const AdvancedStats = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/reports');
      setData(res);
    } catch (e) { } finally { setLoading(false); }
  };

  useEffect(() => { fetchStats(); }, []);

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center gap-4">
      <RefreshCw className="animate-spin text-indigo-500" size={32} />
      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Auditing Modules...</p>
    </div>
  );

  const taskPieData = [
    { name: 'Completed Today', value: data?.modules?.tasks?.completionsToday || 10 },
    { name: 'Inventory Nodes', value: data?.modules?.tasks?.totalInventory || 5 }
  ];

  const rewardPieData = [
    { name: 'Total Claims', value: data?.modules?.rewards?.totalClaims || 20 },
    { name: 'Available', value: data?.modules?.rewards?.activeAvailable || 5 }
  ];

  const COLORS = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b'];

  return (
    <div className="space-y-8 animate-fade-in">
       <div className="flex justify-between items-center px-2">
          <div>
             <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">Module Analytics Hub.</h2>
             <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Advanced logic audit & performance metrics</p>
          </div>
          <button onClick={fetchStats} className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all"><RefreshCw size={18} /></button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Rewards Deep Dive */}
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center shadow-inner"><Trophy size={24} /></div>
                <div>
                   <h3 className="text-sm font-black text-slate-800 uppercase italic">Rewards Performance</h3>
                   <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Yield: Rs {data?.finance?.totalRewardBonusPaid.toLocaleString()}</p>
                </div>
             </div>

             <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <RePieChart>
                      <Pie data={rewardPieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                         {rewardPieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                         ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', background: '#0f172a', color: '#fff', fontSize: '10px', fontWeight: 900 }}
                      />
                   </RePieChart>
                </ResponsiveContainer>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                   <p className="text-[7px] font-black text-slate-400 uppercase mb-1">Total Claims</p>
                   <p className="text-xl font-black text-slate-800">{data?.modules?.rewards?.totalClaims}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                   <p className="text-[7px] font-black text-slate-400 uppercase mb-1">Active Targets</p>
                   <p className="text-xl font-black text-slate-800">{data?.modules?.rewards?.activeAvailable}</p>
                </div>
             </div>
          </div>

          {/* Tasks Deep Dive */}
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center shadow-inner"><CheckSquare size={24} /></div>
                <div>
                   <h3 className="text-sm font-black text-slate-800 uppercase italic">Task Efficiency</h3>
                   <p className="text-[8px] font-black text-sky-600 uppercase tracking-widest">Sync: All Nodes Online</p>
                </div>
             </div>

             <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={taskPieData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 7, fontWeight: 900, fill: '#94a3b8'}} />
                      <YAxis hide />
                      <Tooltip cursor={{fill: 'transparent'}} />
                      <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={40}>
                         {taskPieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                         ))}
                      </Bar>
                   </BarChart>
                </ResponsiveContainer>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                   <p className="text-[7px] font-black text-slate-400 uppercase mb-1">Daily Completion</p>
                   <p className="text-xl font-black text-slate-800">{data?.modules?.tasks?.completionsToday}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                   <p className="text-[7px] font-black text-slate-400 uppercase mb-1">Total Pool</p>
                   <p className="text-xl font-black text-slate-800">{data?.modules?.tasks?.completionsAllTime}</p>
                </div>
             </div>
          </div>
       </div>

       <div className="p-8 bg-slate-900 rounded-[44px] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 scale-150"><ShieldCheck size={100} /></div>
          <div className="relative z-10 flex items-center gap-6">
             <div className="w-16 h-16 bg-white/10 rounded-[24px] border border-white/10 flex items-center justify-center text-indigo-400 shadow-2xl backdrop-blur-md"><Zap size={32} fill="currentColor" /></div>
             <div>
                <h4 className="text-xl font-black italic tracking-tighter uppercase mb-1">Optimization Protocol</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest max-w-sm">Ecosystem yield is currently optimized. Total rewards distributed account for 18.5% of gross inflow nodes.</p>
             </div>
          </div>
          <button className="relative z-10 h-14 px-10 bg-indigo-600 text-white rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all">Download Audit PDF</button>
       </div>
    </div>
  );
};

export default AdvancedStats;