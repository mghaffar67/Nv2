import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { 
  ShieldCheck, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Gem,
  Award,
  Zap,
  ChevronLeft,
  Layout
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';

const PlanHistory = () => {
  const { user } = useAuth();
  const history = (user as any)?.purchaseHistory || [];

  const getDaysRemaining = (expiry: string) => {
    if (!expiry) return 0;
    const diff = new Date(expiry).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const daysLeft = getDaysRemaining(user?.planExpiry as any);
  const progress = Math.min(100, Math.round(((30 - daysLeft) / 30) * 100));

  return (
    <div className="max-w-[480px] mx-auto px-2 pb-24 space-y-6 animate-fade-in">
      
      <header className="flex items-center justify-between pt-2 px-2">
        <Link to="/user/plans" className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 active:scale-90 transition-all">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Registry <span className="text-indigo-600">History</span></h1>
        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-sky-400 shadow-lg border border-white/5">
          <Layout size={18} />
        </div>
      </header>

      {/* Active Plan Hero Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-950 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl mx-1"
      >
        <div className="absolute top-0 right-0 p-10 opacity-10 scale-[2.5] rotate-12 text-sky-400">
           {user?.currentPlan ? <Award size={64} fill="currentColor" /> : <Zap size={64} fill="currentColor" />}
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest text-sky-400 border border-white/5">
              Protocol Status
            </span>
            {user?.currentPlan && (
              <span className="px-3 py-1 bg-green-500/20 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest text-green-400 flex items-center gap-1 border border-green-500/30">
                <CheckCircle2 size={10} /> STATION ACTIVE
              </span>
            )}
          </div>

          <h2 className="text-3xl font-black tracking-tighter mb-2 uppercase italic">
            {user?.currentPlan ? `${user.currentPlan}` : 'No Active Station'}
          </h2>
          <p className="text-slate-500 text-[9px] font-bold uppercase tracking-[0.2em] mb-8 italic">
            {user?.currentPlan ? 'Your earning logic is operational' : 'Initialize a node to start audit'}
          </p>

          {user?.currentPlan && (
            <div className="space-y-4">
              <div className="flex justify-between items-end mb-1">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-sky-400" />
                  <span className="text-[11px] font-black uppercase tracking-widest text-slate-300 italic">
                    {daysLeft} Days Remaining
                  </span>
                </div>
                <span className="text-[9px] font-black text-slate-600 uppercase">{progress}% Sync</span>
              </div>
              <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-sky-500 to-indigo-600 rounded-full"
                />
              </div>
              <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest pt-2 flex items-center gap-2 italic">
                <Calendar size={12} /> Valid Until: {new Date(user.planExpiry as any).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Subscription Ledger */}
      <div className="space-y-4 px-1">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3 flex items-center gap-2 italic">
          <HistoryIcon size={14} className="text-indigo-600" /> Subscription Ledger
        </h3>

        <div className="space-y-2.5">
          {history.length > 0 ? history.map((item: any, idx: number) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className={clsx(
                  "w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-inner shrink-0",
                  item.status === 'active' ? "bg-green-50 text-green-600" :
                  item.status === 'pending' ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-500"
                )}>
                  <Gem size={20} />
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-tight truncate leading-none mb-1.5">{item.planId} Hub</h4>
                  <div className="flex items-center gap-2">
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{item.method}</p>
                    <span className="text-slate-200 text-[8px]">•</span>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{new Date(item.date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className="text-xs font-black text-slate-900 mb-1.5 leading-none tracking-tight">Rs. {item.amount}</p>
                <div className={clsx(
                  "inline-flex items-center gap-1 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border",
                  item.status === 'active' ? "bg-green-50 text-green-600 border-green-100" :
                  item.status === 'pending' ? "bg-amber-50 text-amber-600 border-amber-100 animate-pulse" : "bg-rose-50 text-rose-600 border-rose-100"
                )}>
                  {item.status === 'active' ? <CheckCircle2 size={10} /> : 
                   item.status === 'pending' ? <Clock size={10} /> : <XCircle size={10} />}
                  {item.status}
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="bg-white p-16 rounded-[44px] border border-slate-100 text-center flex flex-col items-center gap-4 opacity-50 shadow-inner">
               <AlertCircle size={32} className="text-slate-200" />
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] italic">Registry Log Clear</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanHistory;

const HistoryIcon = ({ size, className }: any) => <ShieldCheck size={size} className={className} />;
