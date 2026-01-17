
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
  Zap
} from 'lucide-react';
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
    <div className="max-w-2xl mx-auto px-4 pb-24 space-y-8">
      {/* Active Plan Hero Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 rounded-[44px] p-8 text-white relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 right-0 p-10 opacity-10 scale-[2.5] rotate-12 text-sky-400">
           {user?.currentPlan ? <Award size={64} fill="currentColor" /> : <Zap size={64} fill="currentColor" />}
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest text-sky-400">
              Subscription Status
            </span>
            {user?.currentPlan && (
              <span className="px-3 py-1 bg-green-500/20 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest text-green-400 flex items-center gap-1">
                <CheckCircle2 size={10} /> Active
              </span>
            )}
          </div>

          <h2 className="text-3xl font-black tracking-tight mb-2 uppercase">
            {user?.currentPlan ? `${user.currentPlan} Station` : 'No Active Plan'}
          </h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
            {user?.currentPlan ? 'Your earnings engine is online' : 'Upgrade to start earning'}
          </p>

          {user?.currentPlan && (
            <div className="space-y-4">
              <div className="flex justify-between items-end mb-1">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-sky-400" />
                  <span className="text-[11px] font-black uppercase tracking-widest text-slate-300">
                    {daysLeft} Days Remaining
                  </span>
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase">{progress}% Consumed</span>
              </div>
              <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full"
                />
              </div>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest pt-2 flex items-center gap-2">
                <Calendar size={12} /> Valid Until: {new Date(user.planExpiry as any).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Purchase History List */}
      <div className="space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center gap-2">
          <History size={14} /> Subscription History
        </h3>

        <div className="space-y-3">
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
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                  item.status === 'active' ? "bg-green-50 text-green-600" :
                  item.status === 'pending' ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-500"
                )}>
                  <Gem size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">{item.planId} Plan</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.method}</p>
                    <span className="text-slate-200 text-[10px]">•</span>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{new Date(item.date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className="text-sm font-black text-slate-900 mb-1.5 leading-none">Rs. {item.amount}</p>
                <div className={clsx(
                  "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                  item.status === 'active' ? "bg-green-100 text-green-600 border border-green-100" :
                  item.status === 'pending' ? "bg-amber-100 text-amber-600 border border-amber-100 animate-pulse" : "bg-rose-100 text-rose-600 border border-rose-100"
                )}>
                  {item.status === 'active' ? <CheckCircle2 size={10} /> : 
                   item.status === 'pending' ? <Clock size={10} /> : <XCircle size={10} />}
                  {item.status}
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="bg-white p-12 rounded-[44px] border border-slate-100 text-center flex flex-col items-center gap-4">
               <AlertCircle size={32} className="text-slate-200" />
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">No Purchase Records</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanHistory;

const History = ({ size }: { size: number }) => <ShieldCheck size={size} />;
