
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, Zap, Loader2, Gift, ChevronRight, Sparkles, Trophy, 
  Star, CheckCircle2, ShieldCheck, Activity, Terminal
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { clsx } from 'clsx';
import { useConfig } from '../../context/ConfigContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';

const StreakWidget = () => {
  const { config } = useConfig();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [claimStatus, setClaimStatus] = useState<'idle' | 'verifying' | 'syncing' | 'success'>('idle');
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
    setClaimStatus('verifying');
    
    try {
      // Step 1: Simulate node verification for UX
      await new Promise(r => setTimeout(r, 1200));
      setClaimStatus('syncing');
      
      const res = await api.post('/work/claim-streak', { userId: user?.id });
      
      setClaimStatus('success');
      confetti({ 
        particleCount: 150, 
        spread: 70, 
        origin: { y: 0.6 }, 
        colors: [config.theme.primaryColor, '#10b981', '#fbbf24', '#ffffff'] 
      });
      
      setTimeout(() => window.location.reload(), 2500);
    } catch (err: any) {
      alert(err.message || "Verification Failed.");
      setClaimStatus('idle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm relative overflow-hidden h-full flex flex-col justify-between">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12 scale-150 pointer-events-none">
        <Zap size={120} fill="currentColor" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
           <div className="flex items-center gap-3">
              <div className={clsx(
                "w-11 h-11 rounded-2xl flex items-center justify-center transition-all",
                claimedToday ? "bg-slate-50 text-slate-300" : "bg-indigo-600 text-white shadow-xl shadow-indigo-100"
              )}>
                 {claimedToday ? <CheckCircle2 size={24} /> : <Gift size={24} className="animate-bounce" />}
              </div>
              <div>
                 <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-tight italic">Daily Yield</h3>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                   {claimedToday ? 'Packet Synced' : `Day ${streak + 1} Pending`}
                 </p>
              </div>
           </div>
           <div className="text-right">
              <p className="text-[7px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Cycle Reset</p>
              <p className="text-[11px] font-black text-indigo-600 font-mono italic bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100">{timeLeft.h}:{timeLeft.m}:{timeLeft.s}</p>
           </div>
        </div>

        {/* Dynamic Progress Track */}
        <div className="flex items-center justify-between gap-2 mb-8">
           {[1, 2, 3, 4, 5, 6, 7].map((day) => {
             const isCompleted = day <= streak;
             const isCurrent = !claimedToday && day === streak + 1;
             const isBumper = day === 7;

             return (
               <div key={day} className="flex-1 flex flex-col items-center gap-2">
                  <div className={clsx(
                    "w-full h-1.5 rounded-full transition-all duration-1000 shadow-inner",
                    isCompleted ? "bg-emerald-500" : isCurrent ? "bg-indigo-200 animate-pulse" : "bg-slate-100"
                  )} />
                  <motion.div 
                    whileHover={!isCompleted ? { scale: 1.1 } : {}}
                    className={clsx(
                      "w-8 h-8 rounded-xl flex items-center justify-center transition-all border shrink-0 text-[10px] font-black",
                      isCompleted ? "bg-emerald-500 border-emerald-500 text-white shadow-lg" :
                      isCurrent ? "bg-white border-indigo-500 text-indigo-500 border-dashed animate-pulse" :
                      "bg-slate-50 border-slate-100 text-slate-300"
                    )}
                  >
                     {isCompleted ? <Check size={14} strokeWidth={4} /> : isBumper ? <Trophy size={14} /> : day}
                  </motion.div>
               </div>
             );
           })}
        </div>
      </div>

      <div className="relative">
        <button 
          disabled={claimedToday || loading}
          onClick={handleClaim}
          className={clsx(
            "w-full h-14 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl relative overflow-hidden group",
            claimedToday ? "bg-slate-50 text-slate-400 cursor-default" : "bg-slate-950 text-white hover:bg-indigo-600"
          )}
        >
          {loading ? (
             <div className="flex items-center gap-3">
                <Loader2 size={18} className="animate-spin" />
                <span>{claimStatus.toUpperCase()}...</span>
             </div>
          ) : claimedToday ? (
            <>
              <ShieldCheck size={18} className="text-emerald-500" /> Authorized
            </>
          ) : (
            <>
              Claim Rs. {config.streakRewards[streak] || 10} <Sparkles size={16} className="text-amber-400 group-hover:rotate-12 transition-transform" />
            </>
          )}
          
          {!claimedToday && !loading && (
            <motion.div 
              initial={{ x: '-100%' }} animate={{ x: '100%' }}
              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
            />
          )}
        </button>
      </div>

      <AnimatePresence>
        {claimStatus === 'success' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white/95 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="w-20 h-20 bg-emerald-500 text-white rounded-[35px] flex items-center justify-center mb-4 shadow-2xl">
               <Star size={40} fill="currentColor" />
            </div>
            <h4 className="text-xl font-black text-slate-900 uppercase italic">Ledger Updated</h4>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2 leading-relaxed">
              Reward Node {streak + 1} Synchronized <br/> with Primary Wallet
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StreakWidget;
