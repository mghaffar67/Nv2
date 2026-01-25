
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  History as HistoryIcon, ShieldCheck, 
  Loader2, Zap, BarChart3, Activity, Info, 
  ShieldAlert, ArrowRight, CheckCircle2, XCircle,
  FileText, MinusCircle, PlusCircle, TrendingUp,
  Clock, AlertCircle
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid
} from 'recharts';
import { clsx } from 'clsx';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../utils/api';
import { useNavigate } from 'react-router-dom';

const History = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await api.get(`/finance/history?userId=${user?.id}`);
      setTransactions(Array.isArray(res) ? res : []);
    } catch (err) {
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, [user?.id]);

  const taskStats = useMemo(() => {
    const rewards = transactions.filter(t => t.type === 'reward');
    const totalProfit = rewards.reduce((a, b) => a + Number(b.amount), 0);
    const submissions = user?.workSubmissions || [];
    
    const claimed = submissions.filter((s: any) => s.status === 'approved').length;
    const unclaimed = submissions.filter((s: any) => s.status === 'pending').length;
    
    // Logic: Total Received based on plan quota and registration time
    const planQuota = user?.currentPlan === 'DIAMOND' ? 20 : user?.currentPlan === 'GOLD ELITE' ? 15 : 5;
    const regDate = new Date(user?.createdAt || Date.now());
    const daysActive = Math.max(1, Math.ceil((Date.now() - regDate.getTime()) / (1000 * 60 * 60 * 24)));
    const totalReceived = daysActive * planQuota;
    
    // Skipped tasks are those received but never submitted
    const skipped = Math.max(0, totalReceived - (submissions.length));

    return { totalReceived, claimed, unclaimed, skipped, totalProfit };
  }, [transactions, user]);

  const chartData = useMemo(() => {
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const dayTrx = transactions.filter(t => t.date === date && t.status === 'approved');
      return {
        name: date.split('-')[2],
        income: dayTrx.filter(t => t.type === 'reward').reduce((a, b) => a + Number(b.amount), 0)
      };
    });
  }, [transactions]);

  return (
    <div className="w-full max-w-full space-y-4 pb-24 animate-fade-in px-1">
      
      <div className="mx-1 bg-slate-950 p-6 rounded-[32px] text-white relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 scale-150 text-indigo-400 pointer-events-none"><BarChart3 size={100} /></div>
         <div className="relative z-10">
            <p className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-1">PERFORMANCE HUB</p>
            <h2 className="text-3xl font-black italic tracking-tighter uppercase">My History.</h2>
         </div>
      </div>

      {/* DETAILED TASK METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mx-1">
         <StatBox label="Total Received" value={taskStats.totalReceived} icon={FileText} color="text-indigo-500" />
         <StatBox label="Claimed" value={taskStats.claimed} icon={CheckCircle2} color="text-emerald-500" />
         <StatBox label="Unclaimed" value={taskStats.unclaimed} icon={Clock} color="text-amber-500" />
         <StatBox label="Skipped/Lost" value={taskStats.skipped} icon={MinusCircle} color="text-rose-500" />
         <StatBox label="Total Profit" value={`Rs. ${taskStats.totalProfit}`} icon={TrendingUp} color="text-sky-500" className="col-span-2 md:col-span-1" />
      </div>

      <div className="mx-1 bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
         <div className="flex items-center justify-between mb-8">
            <h2 className="text-[11px] font-black text-slate-800 uppercase tracking-widest italic flex items-center gap-1.5"><Activity size={14} className="text-indigo-600" /> Weekly Income</h2>
         </div>
         <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={chartData}>
                  <defs>
                     <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                     </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 800, fill: '#94a3b8'}} dy={10} />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', fontSize: '10px', fontWeight: 900 }} />
                  <Area type="monotone" dataKey="income" stroke="#6366f1" strokeWidth={4} fill="url(#colorIncome)" />
               </AreaChart>
            </ResponsiveContainer>
         </div>
      </div>

      <div className="space-y-2 px-1">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 flex items-center gap-2 mt-4"><HistoryIcon size={12}/> Transaction History</h3>
        <div className="space-y-2 min-h-[300px]">
          {loading ? (
            <div className="py-24 text-center flex flex-col items-center gap-3"><Loader2 size={32} className="animate-spin text-indigo-500" /><p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Loading records...</p></div>
          ) : transactions.length > 0 ? (
            transactions.map((trx, idx) => (
              <motion.div key={trx.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.03 }} className="bg-white p-4 rounded-[24px] border border-slate-100 shadow-sm flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", trx.type === 'withdraw' ? "bg-rose-50 text-rose-500" : "bg-emerald-50 text-emerald-600")}><Zap size={18} /></div>
                    <div>
                       <h4 className="font-black text-slate-800 text-[10px] uppercase leading-none mb-1">{trx.gateway || 'System'}</h4>
                       <p className="text-[7px] font-bold text-slate-400 uppercase">{trx.date}</p>
                    </div>
                 </div>
                 <p className={clsx("font-black text-xs italic", trx.type === 'withdraw' ? "text-slate-900" : "text-emerald-600")}>{trx.type === 'withdraw' ? '-' : '+'}Rs {trx.amount}</p>
              </motion.div>
            ))
          ) : (
            <div className="py-20 text-center opacity-40"><FileText size={40} className="mx-auto mb-4 text-slate-200"/><p className="text-[10px] font-black uppercase text-slate-400">No records found</p></div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatBox = ({ label, value, icon: Icon, color, className }: any) => (
  <div className={clsx("bg-white p-4 rounded-[28px] border border-slate-100 shadow-sm flex flex-col items-center text-center", className)}>
     <div className={clsx("w-8 h-8 rounded-lg flex items-center justify-center mb-3 bg-slate-50", color)}>
        <Icon size={16} />
     </div>
     <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
     <p className="text-sm font-black text-slate-900 tracking-tight">{value}</p>
  </div>
);

export default History;
