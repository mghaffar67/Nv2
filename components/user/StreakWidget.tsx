
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
// Add ChevronRight to lucide-react imports
import { Check, Zap, Sparkles, Loader2, Lock, History, X, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { clsx } from 'clsx';
import { useConfig } from '../../context/ConfigContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const StreakWidget = () => {
  const { config } = useConfig();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ h: '00', m: '00', s: '00' });

  const streak = user?.streak || 0;
  const lastClaimDate = user?.lastCheckIn ? new Date(user.lastCheckIn) : null;
  const today = new Date();
  const claimedToday = lastClaimDate?.toDateString() === today.toDateString();

  // Lifetime Streak Earnings logic
  const lifetimeClaimed = useMemo(() => {
    if (!user?.transactions) return 0;
    return user.transactions
      .filter((t: any) => t.id.startsWith('STRK-'))
      .reduce((acc: number, curr: any) => acc + Number(curr.amount), 0);
  }, [user]);

  // Generate 7-day display nodes with dates
  const daysDisplay = useMemo(() => {
    const nodes = [];
    const baseDate = new Date();
    // Logic: If user has 3 day streak, show past 3 days and next 4 days
    for (let i = 1; i <= 7; i++) {
      const diff = i - (streak + (claimedToday ? 0 : 1));
      const targetDate = new Date();
      targetDate.setDate(today.getDate() + diff);
      
      let status: 'done' | 'missed' | 'next' | 'locked' = 'locked';
      if (i <= streak) status = 'done';
      else if (!claimedToday && i === streak + 1) status = 'next';
      else status = 'locked';

      nodes.push({ day: i, date: targetDate, status });
    }
    return nodes;
  }, [streak, claimedToday]);

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
      const res = await api.post('/work/claim-streak', { userId: user?.id });
      confetti({ particleCount: 150, spread: 60, origin: { y: 0.8 } });
      window.location.reload();
    } catch (err: any) {
      alert(err.message || "Failed to claim.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[40px] border border-slate-100 p-6 md:p-8 shadow-sm relative overflow-hidden group mx-1">
      
      {/* 1. TIMER */}
      <div className="flex justify-between items-center mb-8">
         <div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Next Reward In</h3>
            <div className="flex items-baseline gap-1 mt-1">
               <span className="text-2xl font-black text-lime-500 italic">{timeLeft.h}</span>
               <span className="text-[10px] font-bold text-slate-300">:</span>
               <span className="text-2xl font-black text-lime-500 italic">{timeLeft.m}</span>
               <span className="text-[10px] font-bold text-slate-300">:</span>
               <span className="text-2xl font-black text-lime-500 italic">{timeLeft.s}</span>
            </div>
         </div>
         <div className="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
            <p className="text-[8px] font-black text-slate-400 uppercase">Current Streak</p>
            <p className="text-sm font-black text-slate-900">{streak} Days</p>
         </div>
      </div>

      {/* 2. PROGRESS LINE */}
      <div className="grid grid-cols-7 gap-1 mb-10 overflow-x-auto no-scrollbar pb-2">
         {daysDisplay.map((d) => (
           <div key={d.day} className="flex flex-col items-center gap-2 shrink-0 min-w-[50px]">
              <div className={clsx(
                "w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all",
                d.status === 'done' ? "bg-emerald-500 border-emerald-500 text-white" :
                d.status === 'next' ? "bg-white border-indigo-600 border-dashed animate-pulse text-indigo-600" :
                "bg-slate-50 border-slate-100 text-slate-300"
              )}>
                 {d.status === 'done' ? <Check size={18} strokeWidth={4} /> : 
                  d.status === 'next' ? <Zap size={18} fill="currentColor" /> : <Lock size={16} />}
              </div>
              <div className="text-center">
                 <p className="text-[7px] font-black text-slate-900 uppercase">Day {d.day}</p>
                 <p className="text-[6px] font-bold text-slate-400 uppercase">{d.date.toLocaleDateString('en-GB', { day:'numeric', month:'short' })}</p>
              </div>
           </div>
         ))}
      </div>

      {/* 3. LIFETIME CARD (PINK STYLE) */}
      <div className="bg-pink-50 rounded-[30px] p-6 mb-8 flex items-center justify-between border border-pink-100/50">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-rose-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-rose-200">
               <History size={20} />
            </div>
            <div>
               <h4 className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1.5">Lifetime Claim Bonus</h4>
               <h5 className="text-2xl font-black text-rose-500 italic leading-none">Rs. {lifetimeClaimed} /-</h5>
            </div>
         </div>
         {/* ChevronRight is now correctly imported */}
         <button onClick={() => navigate('/user/history?filter=reward')} className="text-rose-400 hover:text-rose-600"><ChevronRight size={20}/></button>
      </div>

      {/* 4. BUTTONS */}
      <div className="flex gap-3">
         <button 
           disabled={claimedToday || loading}
           onClick={handleClaim}
           className={clsx(
             "flex-[2] h-14 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2",
             claimedToday ? "bg-slate-100 text-slate-300" : "bg-lime-500 text-white shadow-lime-100"
           )}
         >
            {loading ? <Loader2 size={18} className="animate-spin" /> : claimedToday ? 'Already Claimed' : 'Claim Daily Reward'}
         </button>
         <button 
            onClick={() => navigate('/user/plans')}
            className="flex-1 h-14 bg-slate-950 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl active:scale-95"
         >
            Upgrade
         </button>
      </div>
    </div>
  );
};

export default StreakWidget;
