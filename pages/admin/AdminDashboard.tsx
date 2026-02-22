import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, Users, Zap, Clock, 
  ShieldCheck, CheckSquare, Filter, RefreshCw, 
  CreditCard, Trophy, Sparkles, Activity, ArrowUpRight, BarChart3,
  Target, ShieldAlert, Database, Globe
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, CartesianGrid, 
  PieChart as RePieChart, Pie, Cell, Legend
} from 'recharts';
import { api } from '../../utils/api';
import { clsx } from 'clsx';
import { useAuth } from '../../context/AuthContext';

const StatCard = ({ title, value, icon: Icon, gradient, delay, path }: any) => {
  const navigate = useNavigate();
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onClick={() => path && navigate(path)}
      className={clsx(
        "p-4 rounded-[24px] border border-white/10 shadow-lg flex flex-col justify-between h-28 relative overflow-hidden group transition-all hover:translate-y-[-2px] cursor-pointer active:scale-95",
        gradient
      )}
    >
      <div className="flex justify-between items-start relative z-10">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-black/20 backdrop-blur-md border border-white/10 text-white shadow-sm">
          <Icon className="size-4" />
        </div>
        <div className="bg-white/10 backdrop-blur-md border border-white/10 px-2 py-0.5 rounded-full text-[6px] font-black text-white uppercase tracking-widest flex items-center gap-1">
          <Activity size={8} className="text-emerald-400 animate-pulse" /> LIVE
        </div>
      </div>
      <div className="relative z-10">
          <p className="text-[7px] font-black text-white/60 uppercase tracking-[0.2em] mb-0.5 italic truncate">{title}</p>
          <h4 className="text-lg font-black text-white italic tracking-tighter leading-none">{value}</h4>
      </div>
    </motion.div>
  );
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/reports?days=${days}`);
      setData(res);
    } catch (e) {
      console.error("Dashboard failed to sync.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, [days]);

  const COLORS = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b', '#0ea5e9'];

  if (loading && !data) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
      <RefreshCw className="animate-spin text-indigo-600" size={32} />
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">Loading Admin Data...</p>
    </div>
  );

  return (
    <div className="space-y-4 md:space-y-6 pb-32 animate-fade-in max-w-7xl mx-auto px-1">
      
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 px-2 pt-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <Database size={12} className="text-indigo-600" />
             <span className="text-[7px] font-black uppercase tracking-[0.3em] text-slate-400 italic">System Overview</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Admin <span className="text-indigo-600">Dashboard.</span>
          </h1>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative">
             <Filter size={10} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
             <select 
               value={days} 
               onChange={(e) => setDays(Number(e.target.value))}
               className="w-full md:w-32 h-9 pl-8 pr-3 bg-white border border-slate-100 rounded-xl font-black text-[8px] uppercase outline-none shadow-sm cursor-pointer appearance-none"
             >
               <option value={7}>Last 7 Days</option>
               <option value={30}>Last 30 Days</option>
               <option value={90}>Last 90 Days</option>
             </select>
          </div>
          <button onClick={fetchStats} className="w-9 h-9 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 shadow-sm active:rotate-180 transition-all hover:text-indigo-600">
            <RefreshCw size={16} className={clsx(loading && "animate-spin")} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 px-1 md:px-0">
        <StatCard title="Total Deposits" value={`Rs. ${data?.summary?.revenue?.toLocaleString() || 0}`} icon={TrendingUp} gradient="bg-slate-950" delay={0.1} path="/admin/finance" />
        <StatCard title="Total Withdrawals" value={`Rs. ${data?.summary?.payouts?.toLocaleString() || 0}`} icon={CreditCard} gradient="bg-rose-600" delay={0.2} path="/admin/requests" />
        <StatCard title="Total Members" value={data?.summary?.totalMembers || 0} icon={Users} gradient="bg-indigo-600" delay={0.3} path="/admin/users" />
        <StatCard title="Platform Profit" value={`Rs. ${data?.summary?.profit?.toLocaleString() || 0}`} icon={ShieldCheck} gradient="bg-emerald-600" delay={0.4} path="/admin/finance" />
        
        <StatCard title="Total Paid to Users" value={`Rs. ${data?.summary?.totalUserEarnings?.toLocaleString() || 0}`} icon={Trophy} gradient="bg-amber-500" delay={0.5} path="/admin/users" />
        <StatCard title="Pending Tasks" value={data?.summary?.pendingTasksCount || 0} icon={Clock} gradient="bg-slate-800" delay={0.6} path="/admin/requests" />
        <StatCard title="Pending Payouts" value={data?.summary?.totalPendingRequests || 0} icon={Activity} gradient="bg-sky-600" delay={0.7} path="/admin/requests" />
        <StatCard title="Tasks Completed" value={data?.summary?.totalTasksCompleted || 0} icon={CheckSquare} gradient="bg-indigo-900" delay={0.8} path="/admin/tasks" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 px-1 md:px-0">
        <div className="lg:col-span-8 bg-white p-5 md:p-8 rounded-[28px] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase italic">Financial Trend</h3>
              <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest italic">Daily Inflow & Outflow Chart</p>
            </div>
          </div>

          <div className="h-[200px] md:h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.charts?.finance}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 7, fontWeight: 900, fill: '#94a3b8'}} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', background: '#0f172a', color: '#fff', padding: '10px' }}
                />
                <Area type="monotone" dataKey="deposits" name="Deposits" stroke="#10b981" strokeWidth={3} fill="#10b981" fillOpacity={0.05} />
                <Area type="monotone" dataKey="withdrawals" name="Withdrawals" stroke="#f43f5e" strokeWidth={3} fill="#f43f5e" fillOpacity={0.05} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white p-5 md:p-8 rounded-[28px] border border-slate-100 shadow-sm flex flex-col h-full">
          <div className="mb-6">
            <h3 className="text-sm font-black text-slate-900 uppercase italic">User Membership Mix</h3>
            <p className="text-[7px] font-bold text-slate-400 uppercase italic tracking-widest">Active Plan Distribution</p>
          </div>
          <div className="h-[200px] w-full flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie data={data?.charts?.plans} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={5} dataKey="value">
                  {data?.charts?.plans?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '10px', border: 'none', background: '#0f172a', color: '#fff', fontSize: '8px', fontWeight: 900 }}
                />
                <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ paddingTop: '10px', fontSize: '7px', fontWeight: 900, textTransform: 'uppercase' }} />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;