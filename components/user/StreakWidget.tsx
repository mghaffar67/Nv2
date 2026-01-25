
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Sparkles, Loader2, Lock, History, X, ChevronRight, Wallet, Award, History as HistoryIcon, BarChart } from 'lucide-react';
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
      
      {/* TIMER & STREAK INFO */}
      <div className="flex justify-between items-center mb-8">
         <div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic flex items-center gap-1.5">
               <History size={12} className="text-indigo-500" /> Logic Cycle Reset
            </h3>
            <div className="flex items-baseline gap-1 mt-1.5">
               <span className="text-3xl font-black text-slate-900 tracking-tighter italic">{timeLeft.h}</span>
               <span className="text-xs font-bold text-slate-300">:</span>
               <span className="text-3xl font-black text-slate-900 tracking-tighter italic">{timeLeft.m}</span>
               <span className="text-xs font-bold text-slate-300">:</span>
               <span className="text-3xl font-black text-slate-900 tracking-tighter italic">{timeLeft.s}</span>
            </div>
         </div>
         <div className="bg-slate-950 px-5 py-2.5 rounded-2xl shadow-xl">
            <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Active Sequence</p>
            <p className="text-base font-black text-sky-400 italic leading-none mt-1">{streak} Nodes</p>
         </div>
      </div>

      {/* PROGRESS NODES */}
      <div className="flex items-center justify-between mb-8 px-2">
         {[1, 2, 3, 4, 5, 6, 7].map((day) => {
           const isCompleted = day <= streak;
           const isCurrent = !claimedToday && day === streak + 1;
           return (
             <div key={day} className="flex flex-col items-center gap-2">
                <div className={clsx(
                  "w-10 h-10 rounded-2xl flex items-center justify-center transition-all border-2",
                  isCompleted ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-100" :
                  isCurrent ? "bg-white border-indigo-600 border-dashed animate-pulse text-indigo-600" :
                  "bg-slate-50 border-slate-100 text-slate-200"
                )}>
                   {isCompleted ? <Check size={18} strokeWidth={4} /> : 
                    isCurrent ? <Zap size={18} fill="currentColor" /> : <Lock size={14} />}
                </div>
                <span className="text-[7px] font-black text-slate-400 uppercase">D{day}</span>
             </div>
           );
         })}
      </div>

      {/* DYNAMIC ACTION BUTTONS */}
      <div className="grid grid-cols-2 gap-3">
         <button 
           disabled={claimedToday || loading}
           onClick={handleClaim}
           className={clsx(
             "h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 shadow-xl",
             claimedToday ? "bg-slate-50 text-slate-300 border border-slate-100" : "bg-emerald-600 text-white shadow-emerald-100"
           )}
         >
            {loading ? <Loader2 size={16} className="animate-spin" /> : claimedToday ? 'Cycle Synced' : 'Sync Daily Yield'}
         </button>
         
         <button 
            onClick={() => navigate('/user/history')}
            className="h-14 bg-slate-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
         >
            <BarChart size={14} className="text-sky-400" /> Open Audit Hub
         </button>
      </div>
    </div>
  );
};

export default StreakWidget;
