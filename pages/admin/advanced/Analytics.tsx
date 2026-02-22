import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, TrendingUp, Users, Wallet, 
  RefreshCw, Activity, ShieldCheck, Download,
  Zap, PieChart, Target, ArrowUpRight
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, PieChart as RePieChart, Pie, Cell, Legend
} from 'recharts';
import { api } from '../../../utils/api';
import { clsx } from 'clsx';

const Analytics = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/reports?days=30');
      setData(res);
    } catch (e) {
      console.error("Analytics extraction failure.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  const COLORS = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#0ea5e9'];

  if (loading) return (
    <div className="h-[500px] flex flex-col items-center justify-center gap-5">
       <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
       <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Audit Logs Syncing...</p>
    </div>
  );

  return (
    <div className="space-y-12 animate-fade-in">
       <div className="flex justify-between items-end px-2">
          <div>
             <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">System <span className="text-indigo-600">Intelligence.</span></h2>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Executive data audit & performance node</p>
          </div>
          <button onClick={fetchStats} className="p-3 bg-white border border-slate-100 text-slate-400 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
             <RefreshCw size={22} className={clsx(loading && "animate-spin")} />
          </button>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-50 p-8 rounded-[44px] border border-slate-100 space-y-8">
             <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 uppercase italic flex items-center gap-3">
                   <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg shadow-sm"><Zap size={16}/></div>
                   Liquidity Flow
                </h3>
                <span className="text-[8px] font-black text-slate-400 uppercase">30-Day Period</span>
             </div>
             <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={data?.charts?.finance}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#94a3b8'}} />
                      <YAxis hide />
                      <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', background: '#0f172a', color: '#fff', fontSize: '10px', fontWeight: 900 }} />
                      <Area type="monotone" dataKey="deposits" name="System Inflow" stroke="#10b981" strokeWidth={4} fill="#10b981" fillOpacity={0.08} />
                      <Area type="monotone" dataKey="withdrawals" name="Payout Volume" stroke="#f43f5e" strokeWidth={4} fill="#f43f5e" fillOpacity={0.08} />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="bg-slate-50 p-8 rounded-[44px] border border-slate-100 space-y-8">
             <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 uppercase italic flex items-center gap-3">
                   <div className="p-2 bg-amber-100 text-amber-600 rounded-lg shadow-sm"><PieChart size={16}/></div>
                   Active Station Distribution
                </h3>
                <span className="text-[8px] font-black text-slate-400 uppercase">Registry Status</span>
             </div>
             <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                   <RePieChart>
                      <Pie data={data?.charts?.plans} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value">
                         {data?.charts?.plans?.map((_: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                         ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', background: '#0f172a', color: '#fff', fontSize: '10px', fontWeight: 900 }} />
                      <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', paddingTop: '20px', color: '#64748b' }} />
                   </RePieChart>
                </ResponsiveContainer>
             </div>
          </div>
       </div>

       <div className="bg-slate-900 p-10 rounded-[56px] text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 scale-150"><Activity size={120} /></div>
          <div className="relative z-10 flex items-center gap-8">
             <div className="w-20 h-20 bg-indigo-600 rounded-[30px] flex items-center justify-center text-white shadow-2xl shadow-indigo-500/20"><ShieldCheck size={36}/></div>
             <div>
                <h4 className="text-2xl font-black italic tracking-tighter uppercase mb-2 leading-none text-sky-400">Platform <br/> Optimization.</h4>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest max-w-sm leading-relaxed">System station efficiency is at 94%. Gross revenue node has expanded by 12% in the current monthly cycle.</p>
             </div>
          </div>
          <button className="relative z-10 h-16 px-12 bg-white text-slate-900 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all flex items-center gap-3 hover:bg-sky-400">
             <Download size={20} /> Generate PDF Audit
          </button>
       </div>
    </div>
  );
};

export default Analytics;