
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Gift, Star, Zap, Sparkles, Clock, Loader2, Info } from 'lucide-react';
import confetti from 'canvas-confetti';
import { clsx } from 'clsx';
import { useConfig } from '../../context/ConfigContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';

const StreakWidget = () => {
  const { config } = useConfig();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!user) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const lastClaimStr = user.lastCheckIn ? new Date(user.lastCheckIn).toISOString().split('T')[0] : null;
  const claimedToday = lastClaimStr === todayStr || isSuccess;
  const streak = user.streak || 0;

  const handleClaim = async () => {
    if (claimedToday || loading) return;
    setLoading(true);
    try {
      // Fixed: Now calling backend route instead of local mock controller
      const res = await api.post('/work/claim-streak', { userId: user.id });

      confetti({
        particleCount: res.newStreak === 7 ? 300 : 150,
        spread: 90,
        origin: { y: 0.8 },
        colors: ['#6366f1', '#10b981', '#f59e0b']
      });

      setIsSuccess(true);
      
      // Update local storage for immediate UI feedback
      const updatedUser = { 
        ...user, 
        balance: res.newBalance, 
        streak: res.newStreak, 
        lastCheckIn: new Date().toISOString() 
      };
      localStorage.setItem('noor_user', JSON.stringify(updatedUser));
      
      // Removed immediate reload which caused "Page Moved" error. 
      // Navigation or soft refresh is safer.
    } catch (err: any) {
      alert(err.message || "Ledger synchronization failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[32px] border border-slate-100 p-5 shadow-sm relative overflow-hidden group mx-1">
      <div className="absolute top-0 right-0 p-3 opacity-5 -rotate-12 scale-[2] pointer-events-none text-indigo-500 group-hover:rotate-0 transition-transform duration-700">
         <Sparkles size={50} fill="currentColor" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col">
          <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-tighter flex items-center gap-1.5 italic">
            <Star size={12} className="text-amber-500 fill-amber-500" /> SYSTEM STREAK
          </h3>
          <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Scale your yield daily</p>
        </div>
        <div className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[8px] font-black uppercase tracking-widest border border-indigo-100 shadow-sm">
           {streak}/7 SESSIONS
        </div>
      </div>

      <div className="flex justify-between items-center gap-1.5 mb-5 overflow-x-auto no-scrollbar pb-1">
        {Array.from({ length: 7 }).map((_, i) => {
          const day = i + 1;
          const isClaimed = day <= streak;
          const isCurrent = !claimedToday && day === streak + 1;
          const rewardAmount = config.streakRewards[i] || 5;

          return (
            <div key={day} className="flex flex-col items-center gap-1.5 min-w-[42px] flex-1">
              <div className={clsx(
                  "w-10 h-10 rounded-xl flex flex-col items-center justify-center transition-all border-2 relative",
                  isClaimed ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100" : 
                  isCurrent ? "bg-amber-50 border-amber-200 text-amber-600 shadow-sm animate-pulse" : 
                  "bg-slate-50 border-slate-100 text-slate-300"
                )}
              >
                {isClaimed ? <Check size={14} strokeWidth={4} /> : (
                  day === 7 ? <Gift size={16} /> : <span className="text-[10px] font-black">{day}</span>
                )}
                <div className={clsx(
                  "absolute -bottom-2 left-1/2 -translate-x-1/2 px-1.5 rounded-md text-[6px] font-black whitespace-nowrap shadow-sm border bg-white",
                  isClaimed ? "text-indigo-600 border-indigo-100" : "text-slate-400 border-slate-100"
                )}>
                  Rs.{rewardAmount}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button 
        disabled={claimedToday || loading}
        onClick={handleClaim}
        className={clsx(
          "w-full h-12 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-2 relative overflow-hidden active:scale-95",
          claimedToday ? "bg-green-500 text-white shadow-emerald-100" : "bg-slate-950 text-white hover:bg-indigo-600"
        )}
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : claimedToday ? 'DATA CACHED SUCCESS' : `CLAIM DAY ${streak + 1} PKRS`}
      </button>

      {claimedToday && (
         <div className="mt-4 flex items-center justify-center gap-2 opacity-40">
            <Clock size={10} />
            <span className="text-[7px] font-bold uppercase tracking-widest">Next session available at 12:00 AM</span>
         </div>
      )}
    </div>
  );
};

export default StreakWidget;
