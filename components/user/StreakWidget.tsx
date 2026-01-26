
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Loader2, Lock, Gift, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { clsx } from 'clsx';
import { useConfig } from '../../context/ConfigContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';

const StreakWidget = () => {
  const { config } = useConfig();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ h: '00', m: '00', s: '00' });

  const streak = user?.streak || 0;
  const lastClaimDate = user?.lastCheckIn ? new Date(user.lastCheckIn) : null;
  const today = new Date();
  const claimedToday = lastClaimDate?.toDateString() === today.toDateString();

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
      setTimeLeft({ h: h.toString().padStart(2, '0'), m: m.toString().padStart(2, '0'), s: s.toString().padStart(2, '0') });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClaim = async () => {
    if (claimedToday || loading) return;
    setLoading(true);
    try {
      await api.post('/work/claim-streak', { userId: user?.id });
      confetti({ particleCount: 100, spread: 50, origin: { y: 0.8 }, colors: [config.theme.primaryColor, '#10b981'] });
      setTimeout(() => window.location.reload(), 1500);
    } catch (err: any) {
      alert(err.message || "Claim failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm relative overflow-hidden mx-1">
      <div className="flex items-center justify-between mb-4">
         <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
               <Gift size={14} />
            </div>
            <div>
               <h3 className="text-[9px] font-black text-slate-900 uppercase tracking-widest italic">Daily Check-in</h3>
               <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">Day {streak} of 7 Sequence</p>
            </div>
         </div>
         <div className="text-right">
            <p className="text-[6px] font-black text-slate-300 uppercase tracking-[0.2em] mb-0.5">Reset In</p>
            <p className="text-[10px] font-black text-indigo-600 font-mono italic">{timeLeft.h}:{timeLeft.m}:{timeLeft.s}</p>
         </div>
      </div>

      {/* Visual Sequence Node */}
      <div className="flex items-center justify-between gap-1 mb-4 px-1">
         {[1, 2, 3, 4, 5, 6, 7].map((day) => {
           const isCompleted = day <= streak;
           const isCurrent = !claimedToday && day === streak + 1;
           return (
             <div key={day} className="flex-1 flex flex-col items-center gap-1.5">
                <div 
                  className={clsx(
                    "w-full h-1.5 rounded-full transition-all duration-500",
                    isCompleted ? "bg-indigo-500" : isCurrent ? "bg-indigo-200 animate-pulse" : "bg-slate-100"
                  )}
                />
                <div 
                  className={clsx(
                    "w-6 h-6 rounded-lg flex items-center justify-center transition-all border",
                    isCompleted ? "bg-indigo-500 border-indigo-500 text-white shadow-sm" :
                    isCurrent ? "bg-white border-indigo-500 text-indigo-500 border-dashed" :
                    "bg-slate-50 border-slate-100 text-slate-300"
                  )}
                >
                   {isCompleted ? <Check size={10} strokeWidth={4} /> : isCurrent ? <Zap size={10} fill="currentColor" /> : <Lock size={8} />}
                </div>
             </div>
           );
         })}
      </div>

      <button 
        disabled={claimedToday || loading}
        onClick={handleClaim}
        className={clsx(
          "w-full h-10 rounded-xl font-black text-[8px] uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2",
          claimedToday ? "bg-slate-50 text-slate-400 border border-slate-100" : "bg-slate-900 text-white shadow-xl"
        )}
      >
        {loading ? <Loader2 size={12} className="animate-spin" /> : claimedToday ? 'Identity Verified for Today' : 'Collect Reward'}
        {!claimedToday && !loading && <ChevronRight size={10} />}
      </button>
    </div>
  );
};

export default StreakWidget;
