
import React, { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { Users, Wallet, Briefcase, TrendingUp, AlertCircle, ArrowDownCircle, Zap, ShieldCheck, ChevronRight } from 'lucide-react';
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

  if (loading) return <div className="h-[60vh] flex items-center justify-center"><div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"/></div>;

  return (
    <div className="space-y-4 animate-fade-in max-w-7xl mx-auto px-1.5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
         <AdminStatCard label="ACTIVE MEMBERS" value={stats?.totalActivePartners} icon={Users} color="bg-indigo-50 text-indigo-600" />
         <AdminStatCard label="TOTAL POOL" value={`Rs.${(stats?.totalCapitalPool / 1000).toFixed(0)}k`} icon={Wallet} color="bg-green-50 text-green-600" />
         <AdminStatCard label="PAYOUTS" value={stats?.pendingWithdrawals} icon={AlertCircle} color="bg-rose-50 text-rose-600" />
         <AdminStatCard label="CAPITAL IN" value={stats?.pendingDeposits} icon={ArrowDownCircle} color="bg-sky-50 text-sky-600" />
      </div>

      <div className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm">
         <div className="mb-4 flex justify-between items-center">
            <h2 className="text-[11px] font-black text-slate-800 uppercase tracking-tight">Financial Pulse</h2>
            <div className="bg-slate-50 px-2.5 py-1 rounded-md text-[8px] font-black uppercase text-slate-400">Live Sync</div>
         </div>
         <div className="h-[140px] md:h-[260px] w-full">
            <ResponsiveContainer>
              <AreaChart data={[{ n: 'M', v: 4000 }, { n: 'T', v: 3000 }, { n: 'W', v: 5000 }, { n: 'T', v: 2780 }, { n: 'F', v: 4890 }, { n: 'S', v: 2390 }, { n: 'S', v: 3490 }]}>
                <XAxis dataKey="n" hide />
                <YAxis hide />
                <Area type="monotone" dataKey="v" stroke="#6366f1" strokeWidth={3} fill="#6366f120" />
              </AreaChart>
            </ResponsiveContainer>
         </div>
      </div>

      <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm overflow-hidden">
         <div className="p-4 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-tight">Audit Trail</h3>
            <button onClick={() => navigate('/admin/finance')} className="text-[8px] font-black text-sky-500 uppercase tracking-widest">See All</button>
         </div>
         <div className="divide-y divide-slate-50">
            {stats?.recentLogs?.slice(0, 5).map((ev: any) => (
              <div key={ev.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                 <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-[10px] text-white italic font-black shrink-0">{ev.userName?.charAt(0)}</div>
                    <div className="overflow-hidden">
                       <p className="text-[10px] font-black text-slate-800 leading-none truncate">{ev.userName}</p>
                       <p className="text-[7px] font-bold text-slate-400 uppercase mt-1 leading-none">{ev.type}</p>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-black text-slate-900 leading-none mb-1">Rs {ev.amount}</p>
                    <p className={clsx("text-[6px] font-black uppercase tracking-widest", ev.status === 'approved' ? "text-green-500" : "text-amber-500")}>{ev.status}</p>
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

const AdminStatCard = ({ label, value, icon: Icon, color }: any) => (
  <div className="bg-white p-3.5 rounded-[22px] border border-slate-100 shadow-sm flex items-center gap-2.5 active:scale-95 transition-all overflow-hidden">
     <div className={clsx("w-8 h-8 rounded-xl flex items-center justify-center shrink-0", color)}>
        <Icon size={16} />
     </div>
     <div className="overflow-hidden">
        <p className="text-[6px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1 truncate">{label}</p>
        <p className="text-[11px] font-black text-slate-900 truncate leading-none">{value}</p>
     </div>
  </div>
);

export default AdminDashboard;
