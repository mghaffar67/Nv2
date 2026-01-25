
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, Loader2, Zap, BarChart3, Activity, 
  ArrowRight, CheckCircle2, FileText, MinusCircle, 
  PlusCircle, TrendingUp, Clock, Search, ChevronLeft,
  CalendarDays
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid
} from 'recharts';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { useAuth } from '../../../context/AuthContext';
import { useConfig } from '../../../context/ConfigContext';
import { api } from '../../../utils/api';

const History = () => {
  const { user } = useAuth();
  const { config } = useConfig();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

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

  const filteredTrx = useMemo(() => {
    if (filter === 'all') return transactions;
    if (filter === 'income') return transactions.filter(t => t.type === 'reward');
    if (filter === 'expense') return transactions.filter(t => t.type === 'withdraw');
    return transactions;
  }, [transactions, filter]);

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
    <div className="w-full max-w-full space-y-5 pb-24 animate-fade-in px-1">
      
      <header className="flex items-center justify-between pt-2 px-1">
        <Link to="/user/dashboard" className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 active:scale-90 transition-all">
          <ChevronLeft size={22} />
        </Link>
        <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase italic">Activity <span style={{ color: config.theme.primaryColor }}>Records.</span></h1>
        <div 
          className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-lg"
          style={{ backgroundColor: config.theme.primaryColor }}
        >
          <CalendarDays size={20} />
        </div>
      </header>

      {/* Performance Summary */}
      <div className="bg-slate-950 p-6 rounded-[40px] text-white relative overflow-hidden shadow-2xl mx-1">
         <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 scale-150 pointer-events-none"><TrendingUp size={100} /></div>
         <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
               <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">Income Performance</h2>
            </div>
            <div className="h-[140px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                     <defs>
                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor={config.theme.primaryColor} stopOpacity={0.2}/><stop offset="95%" stopColor={config.theme.primaryColor} stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 800, fill: '#64748b'}} />
                     <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', background: '#0f172a', fontSize: '10px', fontWeight: 900, color: '#fff' }} />
                     <Area type="monotone" dataKey="income" stroke={config.theme.primaryColor} strokeWidth={4} fill="url(#colorIncome)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm mx-1">
         {['all', 'income', 'expense'].map(f => (
           <button 
             key={f} onClick={() => setFilter(f)} 
             className={clsx(
               "flex-1 py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
               filter === f ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"
             )}
           >
             {f}
           </button>
         ))}
      </div>

      {/* Records List */}
      <div className="space-y-2.5 px-1 min-h-[400px]">
        {loading ? (
          <div className="py-24 text-center flex flex-col items-center gap-3">
             <Loader2 size={32} className="animate-spin" style={{ color: config.theme.primaryColor }} />
             <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Loading History...</p>
          </div>
        ) : filteredTrx.length > 0 ? (
          filteredTrx.map((trx, idx) => (
            <motion.div key={trx.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.03 }} className="bg-white p-5 rounded-[30px] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-indigo-100 transition-all">
               <div className="flex items-center gap-4">
                  <div 
                    className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110", trx.type === 'withdraw' ? "bg-rose-50 text-rose-500" : "bg-emerald-50 text-emerald-600")}
                  >
                     {trx.type === 'withdraw' ? <MinusCircle size={22} /> : <PlusCircle size={22} />}
                  </div>
                  <div>
                     <h4 className="font-black text-slate-800 text-xs uppercase leading-none mb-2">{trx.gateway || 'System Profit'}</h4>
                     <div className="flex items-center gap-2">
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{trx.date}</span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full" />
                        <span className="text-[8px] font-black text-indigo-400 uppercase">ID: {trx.id?.slice(0, 8)}</span>
                     </div>
                  </div>
               </div>
               <div className="text-right">
                  <p className={clsx("font-black text-sm italic mb-1", trx.type === 'withdraw' ? "text-slate-900" : "text-emerald-600")}>
                    {trx.type === 'withdraw' ? '-' : '+'}Rs {trx.amount}
                  </p>
                  <div className="flex items-center justify-end gap-1">
                    <div className={clsx("w-1 h-1 rounded-full", trx.status === 'approved' ? "bg-emerald-500" : "bg-amber-500")} />
                    <span className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter">{trx.status}</span>
                  </div>
               </div>
            </motion.div>
          ))
        ) : (
          <div className="py-20 text-center flex flex-col items-center opacity-40">
             <FileText size={48} className="text-slate-200 mb-4" />
             <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">No activity found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
