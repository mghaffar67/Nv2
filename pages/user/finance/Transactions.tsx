
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowUpRight, ArrowDownLeft, Clock, History as HistoryIcon,
  Filter, TrendingUp, ShieldCheck, ChevronRight,
  Loader2, Zap, LayoutGrid, BarChart3, Activity, Info
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, CartesianGrid
} from 'recharts';
import { clsx } from 'clsx';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../utils/api';
import { InvoiceModal } from '../../../components/finance/InvoiceModal';

const History = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'deposit' | 'withdraw' | 'reward'>('all');
  const [selectedTrx, setSelectedTrx] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<'line' | 'bar'>('line');

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await api.get('/finance/history');
        setTransactions(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error("Records sync failure.");
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredData = useMemo(() => {
    return transactions.filter(t => filterType === 'all' || t.type === filterType);
  }, [transactions, filterType]);

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
        income: dayTrx.filter(t => t.type !== 'withdraw').reduce((a, b) => a + Number(b.amount), 0),
        payouts: dayTrx.filter(t => t.type === 'withdraw').reduce((a, b) => a + Number(b.amount), 0)
      };
    });
  }, [transactions]);

  const stats = useMemo(() => {
    const approved = transactions.filter(t => t.status === 'approved');
    return {
      totalIn: approved.filter(t => t.type !== 'withdraw').reduce((a, b) => a + Number(b.amount), 0),
      totalOut: approved.filter(t => t.type === 'withdraw').reduce((a, b) => a + Number(b.amount), 0),
    };
  }, [transactions]);

  return (
    <div className="w-full max-w-full space-y-4 pb-24 animate-fade-in px-1 overflow-x-hidden">
      
      {/* 1. VISUALIZATION NODE */}
      <div className="mx-1 bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm">
         <div className="flex items-center justify-between mb-6">
            <div>
               <h2 className="text-[10px] font-black text-slate-800 uppercase tracking-widest italic flex items-center gap-1.5">
                  <Activity size={14} className="text-indigo-600" /> Cash Performance
               </h2>
               <p className="text-[7px] font-bold text-slate-400 uppercase mt-1">Growth Hub Stats</p>
            </div>
            <div className="flex bg-slate-50 p-1 rounded-xl shrink-0">
               <button onClick={() => setViewMode('line')} className={clsx("p-1.5 rounded-lg transition-all", viewMode === 'line' ? "bg-white shadow-sm text-indigo-600" : "text-slate-300")}><TrendingUp size={14}/></button>
               <button onClick={() => setViewMode('bar')} className={clsx("p-1.5 rounded-lg transition-all", viewMode === 'bar' ? "bg-white shadow-sm text-indigo-600" : "text-slate-300")}><BarChart3 size={14}/></button>
            </div>
         </div>

         <div className="h-[120px] w-full">
            <ResponsiveContainer width="100%" height="100%">
               {viewMode === 'line' ? (
                 <AreaChart data={chartData}>
                    <defs>
                       <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '8px', fontWeight: 'bold' }} />
                    <Area type="monotone" dataKey="income" stroke="#6366f1" strokeWidth={3} fill="url(#colorIn)" />
                    <Area type="monotone" dataKey="payouts" stroke="#f43f5e" strokeWidth={2} strokeDasharray="4 4" fill="none" />
                 </AreaChart>
               ) : (
                 <BarChart data={chartData}>
                    <Bar dataKey="income" radius={[4, 4, 0, 0]}>
                       {chartData.map((_, i) => <Cell key={i} fill="#6366f1" />)}
                    </Bar>
                    <Bar dataKey="payouts" radius={[4, 4, 0, 0]}>
                       {chartData.map((_, i) => <Cell key={i} fill="#f43f5e" />)}
                    </Bar>
                 </BarChart>
               )}
            </ResponsiveContainer>
         </div>

         <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-slate-50 w-full">
            <div className="text-center overflow-hidden">
               <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1 truncate">Total Inflow</p>
               <p className="text-xs font-black text-emerald-600 truncate">Rs {stats.totalIn.toLocaleString()}</p>
            </div>
            <div className="text-center border-l border-slate-50 overflow-hidden">
               <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1 truncate">Total Payouts</p>
               <p className="text-xs font-black text-slate-900 truncate">Rs {stats.totalOut.toLocaleString()}</p>
            </div>
         </div>
      </div>

      {/* 2. FILTER PROTOCOL */}
      <div className="mx-1 bg-white p-3 rounded-[20px] border border-slate-100 shadow-sm sticky top-16 z-30 backdrop-blur-md">
         <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
            <Filter size={12} className="text-slate-300 shrink-0 ml-1" />
            {(['all', 'deposit', 'withdraw', 'reward'] as const).map(t => (
               <button 
                key={t} onClick={() => setFilterType(t)}
                className={clsx(
                  "px-4 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest border transition-all whitespace-nowrap",
                  filterType === t ? "bg-slate-900 text-white border-slate-900 shadow-lg" : "bg-white text-slate-400 border-slate-50"
                )}
               >
                 {t === 'reward' ? 'Rewards' : t}
               </button>
            ))}
         </div>
      </div>

      {/* 3. RECORDS FEED */}
      <div className="space-y-2 px-1 min-h-[300px] w-full">
        {loading ? (
          <div className="py-24 text-center flex flex-col items-center gap-3">
            <Loader2 size={32} className="animate-spin text-indigo-500" />
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Syncing Records Hub...</p>
          </div>
        ) : filteredData.length > 0 ? (
          filteredData.map((trx, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}
              key={trx.id} onClick={() => setSelectedTrx(trx)}
              className="bg-white p-4 rounded-[22px] border border-slate-100 shadow-sm flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer group w-full overflow-hidden"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className={clsx(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                  trx.type === 'withdraw' ? "bg-rose-50 text-rose-500" : 
                  trx.type === 'reward' ? "bg-indigo-50 text-indigo-500" : "bg-green-50 text-green-500"
                )}>
                  {trx.type === 'withdraw' ? <ArrowUpRight size={16} /> : 
                   trx.type === 'reward' ? <Zap size={16} fill="currentColor" /> : <ArrowDownLeft size={16} />}
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-black text-slate-800 text-[10px] uppercase leading-none mb-1.5 truncate">
                    {trx.gateway || trx.type}
                  </h4>
                  <div className="flex items-center gap-2">
                    <p className="text-[6px] font-bold text-slate-400 uppercase">{trx.date}</p>
                    <span className={clsx(
                      "px-1.5 py-0.5 rounded-md text-[5px] font-black uppercase tracking-widest",
                      trx.status === 'approved' ? "bg-green-100 text-green-600" : 
                      trx.status === 'pending' ? "bg-amber-100 text-amber-600" : "bg-rose-100 text-rose-600"
                    )}>
                      {trx.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className={clsx("font-black text-xs italic leading-none mb-1", trx.type === 'withdraw' ? "text-slate-900" : "text-emerald-600")}>
                  {trx.type === 'withdraw' ? '-' : '+'}Rs {trx.amount}
                </p>
                <p className="text-[5px] font-black text-slate-300 uppercase tracking-tighter">ID: {trx.id.slice(-5)}</p>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="py-20 text-center flex flex-col items-center gap-3 w-full">
             <div className="w-14 h-14 bg-slate-50 text-slate-200 rounded-2xl flex items-center justify-center shadow-inner"><HistoryIcon size={28}/></div>
             <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">No matching records</p>
          </div>
        )}
      </div>

      <InvoiceModal isOpen={!!selectedTrx} onClose={() => setSelectedTrx(null)} transaction={selectedTrx} />
    </div>
  );
};

export default History;
