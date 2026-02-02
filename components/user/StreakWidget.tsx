import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, Zap, Loader2, Lock, Gift, ChevronRight, 
  Flame, Sparkles, ShieldCheck, CalendarCheck,
  // Added missing CheckCircle2 icon import to fix error on line 110
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { clsx } from 'clsx';
import { useConfig } from '../../context/ConfigContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';

const StreakWidget = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ h: '00', m: '00', s: '00' });

  // STRICT LOGIC: Check server-synced timestamp
  const lastClaimDate = user?.lastCheckIn ? new Date(user.lastCheckIn) : null;
  const today = new Date();
  const claimedToday = lastClaimDate?.toDateString() === today.toDateString();
  const streak = user?.streak || 0;

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const nextDay = new Date();
      nextDay.setHours(24, 0, 0, 0);
      const diff = nextDay.getTime() - now.getTime();
      if (diff <= 0) return;
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ 
        h: h.toString().padStart(2, '0'), 
        m: m.toString().padStart(2, '0'), 
        s: s.toString().padStart(2, '0') 
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClaim = async () => {
    if (claimedToday || loading) return;
    setLoading(true);
    try {
      await api.post('/work/claim-streak', { userId: user?.id });
      confetti({ 
        particleCount: 150, 
        spread: 100, 
        origin: { y: 0.8 }, 
        colors: ['#4A6CF7', '#2EC4B6', '#F4C430'] 
      });
      // Soft refresh to update local state
      setTimeout(() => window.location.reload(), 1500);
    } catch (err: any) {
      alert(err.message || "Claim failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm relative overflow-hidden mx-1">
      <div className="flex items-center justify-between mb-10">
         <div className="flex items-center gap-4">
            <div className={clsx(
              "w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-inner",
              claimedToday ? "bg-emerald-50 text-emerald-500" : "bg-indigo-50 text-indigo-600 ring-4 ring-indigo-50/50"
            )}>
               {claimedToday ? <ShieldCheck size={28} /> : <Flame size={28} className="animate-bounce" />}
            </div>
            <div>
               <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest italic">Hazari Inam Hub</h3>
               <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Consistency Streak: Day {streak}</p>
            </div>
         </div>
         <div className="text-right">
            <p className="text-[7px] font-black text-slate-300 uppercase tracking-[0.3em] mb-1 italic">Cycle Reset In</p>
            <p className="text-xs font-black text-indigo-600 font-mono tracking-tighter">{timeLeft.h}:{timeLeft.m}:{timeLeft.s}</p>
         </div>
      </div>

      <div className="flex items-center justify-between gap-2 mb-10 px-1">
         {[1, 2, 3, 4, 5, 6, 7].map((day) => {
           const isCompleted = day <= streak;
           const isCurrent = !claimedToday && day === (streak % 7) + 1;
           return (
             <div key={day} className="flex-1 flex flex-col items-center gap-3">
                <div className={clsx("w-full h-1.5 rounded-full transition-all duration-1000", isCompleted ? "bg-indigo-600 shadow-[0_0_10px_rgba(74,108,247,0.4)]" : isCurrent ? "bg-indigo-200 animate-pulse" : "bg-slate-100")} />
                <div className={clsx(
                  "w-10 h-10 rounded-[15px] flex items-center justify-center transition-all border shadow-sm",
                  isCompleted ? "bg-indigo-600 text-white border-indigo-600" :
                  isCurrent ? "bg-white border-indigo-500 text-indigo-600 ring-4 ring-indigo-50 shadow-lg" :
                  "bg-slate-50 border-slate-100 text-slate-300"
                )}>
                   {isCompleted ? <Check size={16} strokeWidth={4} /> : isCurrent ? <Zap size={20} fill="currentColor" /> : <Lock size={14} />}
                </div>
             </div>
           );
         })}
      </div>

      <AnimatePresence mode="wait">
        {claimedToday ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="w-full h-16 bg-emerald-50 border border-emerald-100 rounded-[28px] flex items-center justify-center gap-4 text-emerald-600 shadow-inner"
          >
             <CheckCircle2 size={24} />
             <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] leading-none">Today's Claim Done</p>
                <p className="text-[7px] font-bold uppercase tracking-widest mt-1 opacity-70 italic">Come back tomorrow for Day {streak + 1}</p>
             </div>
          </motion.div>
        ) : (
          <motion.button 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            disabled={loading}
            onClick={handleClaim}
            className="w-full h-18 bg-slate-950 text-white rounded-[32px] font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 shadow-2xl relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-indigo-600 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
            <span className="relative z-10 flex items-center gap-3">
              {loading ? <Loader2 size={24} className="animate-spin" /> : <><Sparkles size={24} className="text-amber-400" /> Claim Now</>}
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StreakWidget;