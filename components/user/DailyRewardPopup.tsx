import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Gift, Check, Clock, Zap, 
  Trophy, ShieldCheck, Sparkles, 
  ChevronRight, Timer, Gem, Lock,
  Loader2, BadgeCheck, Coins, Database,
  History
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { clsx } from 'clsx';
import { api } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { useConfig } from '../../context/ConfigContext';

interface DailyRewardPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const URDU_DAYS = [
  "Pehla Din", "Dosra Din", "Teesra Din", 
  "Chotha Din", "Panchwa Din", "Chata Din", "Bumper Inaam"
];

export const DailyRewardPopup = ({ isOpen, onClose }: DailyRewardPopupProps) => {
  const { user, syncUser } = useAuth();
  const { config } = useConfig();
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  const streak = user?.streak || 0;
  const lastClaimDate = user?.lastCheckIn ? new Date(user.lastCheckIn) : null;
  const todayStr = new Date().toDateString();
  const alreadyClaimed = lastClaimDate?.toDateString() === todayStr;
  const rewardHistory = (user as any)?.rewardHistory || [];

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const reset = new Date();
      reset.setHours(24, 0, 0, 0);
      const diff = reset.getTime() - now.getTime();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClaim = async () => {
    if (alreadyClaimed || loading) return;
    setLoading(true);
    try {
      const res = await api.post('/work/claim-streak', { userId: user?.id });
      if (res.success) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#10b981', '#f59e0b']
        });
        syncUser();
        setTimeout(onClose, 2000);
      }
    } catch (err: any) {
      alert(err.message || "Registry synchronization failure.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 md:p-6 overflow-y-auto no-scrollbar">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl"
          />

          <motion.div 
            initial={{ scale: 0.85, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.85, y: 40, opacity: 0 }}
            className="relative w-full max-w-[420px] bg-white rounded-[48px] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.6)] overflow-hidden border-4 border-white flex flex-col my-8"
          >
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 text-center text-white relative overflow-hidden shrink-0">
               <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 scale-150"><Zap size={100} fill="currentColor" /></div>
               <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all z-20"><X size={18}/></button>
               
               <h2 className="text-2xl md:text-3xl font-black italic tracking-tighter uppercase mb-2 leading-none">Daily Reward.</h2>
               <div className="inline-flex items-center gap-3 bg-white/10 px-5 py-2 rounded-full border border-white/10 backdrop-blur-md">
                  <Clock size={14} className="text-indigo-200" />
                  <p className="text-[9px] font-black uppercase tracking-widest text-indigo-100">Next Cycle:</p>
                  <span className="text-xs font-black font-mono text-amber-400">{timeLeft}</span>
               </div>
            </div>

            <div className="p-6 md:p-8 bg-slate-50/50 flex-grow space-y-8">
               {/* 7 Day Grid */}
               <div className="grid grid-cols-3 gap-3 md:gap-4">
                  {[1, 2, 3, 4, 5, 6].map((day) => {
                    const isCompleted = day <= streak;
                    const isCurrent = !alreadyClaimed && day === streak + 1;
                    const rewardAmt = config.streakRewards[day - 1] || 10;

                    return (
                      <div key={day} className={clsx(
                        "relative aspect-square rounded-[32px] border-4 flex flex-col items-center justify-center gap-1.5 transition-all duration-500 shadow-sm",
                        isCompleted ? "bg-emerald-500 border-emerald-100 shadow-xl" : 
                        isCurrent ? "bg-white border-indigo-600 animate-pulse shadow-[0_0_30px_rgba(99,102,241,0.2)]" : "bg-white border-slate-100 opacity-60"
                      )}>
                         <span className={clsx(
                           "text-[8px] font-black uppercase tracking-tighter mb-1",
                           isCompleted ? "text-emerald-100" : isCurrent ? "text-indigo-600" : "text-slate-400"
                         )}>{URDU_DAYS[day-1]}</span>
                         
                         {isCompleted ? (
                           <div className="bg-white rounded-full p-2 text-emerald-500 shadow-lg">
                              <Check size={20} strokeWidth={4} />
                           </div>
                         ) : (
                           <>
                             <div className={clsx(
                               "w-10 h-10 rounded-2xl flex items-center justify-center mb-1",
                               isCurrent ? "bg-indigo-50 text-indigo-600" : "bg-slate-100 text-slate-300"
                             )}>
                                <Coins size={24} />
                             </div>
                             <p className={clsx("text-[8px] font-black uppercase italic", isCurrent ? "text-slate-900" : "text-slate-300")}>Rs {rewardAmt}</p>
                           </>
                         )}
                      </div>
                    );
                  })}
               </div>

               {/* Bumper Day */}
               <div className={clsx(
                 "relative h-28 rounded-[40px] border-4 flex items-center justify-between px-8 transition-all duration-700 overflow-hidden",
                 streak >= 7 ? "bg-emerald-500 border-emerald-100 shadow-2xl" :
                 (streak === 6 && !alreadyClaimed) ? "bg-gradient-to-r from-amber-400 to-amber-500 border-amber-200 animate-pulse shadow-2xl" : "bg-white border-slate-100"
               )}>
                  <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-aurora pointer-events-none" />
                  <div className="relative z-10">
                     <span className={clsx("text-[9px] font-black uppercase tracking-[0.2em] block mb-1", streak >= 7 || (streak === 6 && !alreadyClaimed) ? "text-white/60" : "text-slate-300")}>{URDU_DAYS[6]}</span>
                     <h4 className={clsx("text-xl md:text-2xl font-black italic tracking-tighter uppercase", streak >= 7 || (streak === 6 && !alreadyClaimed) ? "text-white" : "text-slate-400")}>TREASURE.</h4>
                     <p className={clsx("text-[9px] font-bold mt-1", streak >= 7 || (streak === 6 && !alreadyClaimed) ? "text-white/80" : "text-slate-400")}>Rs {config.streakRewards[6] || 200} Bumper Yield</p>
                  </div>
                  <div className="relative z-10">
                    <motion.div 
                       animate={streak === 6 && !alreadyClaimed ? { y: [0, -8, 0], rotate: [0, 5, -5, 0] } : {}}
                       transition={{ repeat: Infinity, duration: 2 }}
                       className={clsx(
                         "w-16 h-16 rounded-[28px] flex items-center justify-center shadow-2xl border-2 transition-all duration-500",
                         streak >= 7 || (streak === 6 && !alreadyClaimed) ? "bg-white/20 backdrop-blur-md text-amber-300 border-white/20" : "bg-slate-50 text-slate-200 border-slate-100"
                       )}
                    >
                       <Gem size={32} fill="currentColor" />
                    </motion.div>
                  </div>
               </div>

               {/* REWARD HISTORY - LAST 5 */}
               {rewardHistory.length > 0 && (
                 <div className="space-y-4">
                    <div className="flex items-center gap-2 px-2">
                       <History size={14} className="text-slate-400" />
                       <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Recent Yield History</h4>
                    </div>
                    <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden divide-y divide-slate-50">
                       {rewardHistory.map((h: any) => (
                         <div key={h.id} className="p-4 flex items-center justify-between group hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
                                  <Sparkles size={14} />
                               </div>
                               <div>
                                  <p className="text-[9px] font-black text-slate-800 uppercase leading-none">Day {h.day} Claim</p>
                                  <p className="text-[7px] font-bold text-slate-400 uppercase mt-1">{new Date(h.timestamp).toLocaleDateString()} • {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                               </div>
                            </div>
                            <div className="text-right">
                               <p className="text-sm font-black text-emerald-600 italic">Rs {h.amount}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
               )}
            </div>

            <div className="p-8 bg-white border-t border-slate-50 shrink-0">
               <button 
                 onClick={handleClaim}
                 disabled={alreadyClaimed || loading}
                 className={clsx(
                   "w-full h-16 rounded-[28px] font-black text-[11px] md:text-xs uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-4",
                   alreadyClaimed 
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200" 
                    : "bg-indigo-600 text-white hover:bg-slate-900 border-4 border-indigo-100"
                 )}
               >
                 {loading ? (
                   <Loader2 size={24} className="animate-spin" />
                 ) : alreadyClaimed ? (
                   <><ShieldCheck size={24} className="text-emerald-500" /> Session Claimed</>
                 ) : (
                   <><Zap size={24} fill="currentColor" className="text-amber-400" /> Collect Din {streak + 1} Yield</>
                 )}
               </button>
               <p className="text-center text-[9px] font-black text-slate-400 uppercase tracking-widest mt-6 italic flex items-center justify-center gap-2">
                  <ShieldCheck size={12} className="text-indigo-400" /> Secure Protocol Audit Node
               </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};