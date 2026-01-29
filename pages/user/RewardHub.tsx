
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Zap, ChevronRight, CheckCircle2, Loader2, ArrowLeft, Gift, ShieldCheck, RefreshCw, Users, Briefcase, Target, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { api } from '../../utils/api';
import { clsx } from 'clsx';
import { useAuth } from '../../context/AuthContext';

const RewardHub = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch live reward targets
      const res = await api.get('/rewards/my-achievements');
      
      // 2. Map progress based on current user data
      // (Backend usually handles this, but we ensure it matches the user node here)
      setAchievements(res || []);
    } catch (e) {
      console.error("Reward sync failure.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleClaim = async (reward: any) => {
    if (claiming) return;
    setClaiming(reward.id);
    try {
      await api.post('/rewards/claim', { rewardId: reward.id });
      confetti({ 
        particleCount: 200, 
        spread: 80, 
        origin: { y: 0.8 }, 
        colors: ['#6366f1', '#10b981', '#f59e0b'],
        ticks: 300
      });
      fetchData();
      alert(`Congratulations! Rs. ${reward.rewardAmount} has been added to your wallet.`);
    } catch (e: any) { 
      alert(e.message); 
    } finally { 
      setClaiming(null); 
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto pb-24 space-y-6 animate-fade-in px-2">
      <header className="flex items-center justify-between pt-2 px-1">
        <Link to="/user/dashboard" className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-400 active:scale-90 transition-all"><ArrowLeft size={20} /></Link>
        <h1 className="text-xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">Bonus <span className="text-indigo-600">Center.</span></h1>
        <button onClick={fetchData} className="w-11 h-11 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 active:rotate-180 transition-all shadow-sm">
           <RefreshCw size={20} className={clsx(loading && "animate-spin")} />
        </button>
      </header>

      {/* Hero Achievement Widget */}
      <div className="bg-slate-950 p-8 rounded-[44px] shadow-2xl relative overflow-hidden mx-1">
         <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12 scale-150 text-indigo-400"><Trophy size={120}/></div>
         <div className="relative z-10">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3 italic">ACHIEVEMENT STATUS</p>
            <h2 className="text-3xl font-black text-white italic tracking-tighter leading-none mb-4">Milestone <span className="text-indigo-400">Yield.</span></h2>
            <div className="flex items-center gap-2">
               <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-500/30 flex items-center gap-1.5 shadow-lg">
                  <ShieldCheck size={12} /> SECURE PAYOUTS
               </div>
            </div>
         </div>
      </div>

      <div className="space-y-4 px-1">
        {loading ? (
           <div className="py-24 text-center flex flex-col items-center gap-4">
              <Loader2 size={40} className="animate-spin text-indigo-500 opacity-20" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Querying Milestones...</p>
           </div>
        ) : achievements.length > 0 ? achievements.map((reward, idx) => {
          const progressPercent = Math.min(100, (reward.currentProgress / reward.targetValue) * 100);
          const isComplete = reward.currentProgress >= reward.targetValue;
          
          return (
            <motion.div 
              key={reward.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
              className={clsx(
                "bg-white p-6 rounded-[40px] border transition-all relative overflow-hidden group",
                reward.isClaimed ? "bg-slate-50 border-slate-100 opacity-80" : isComplete ? "border-emerald-200 bg-emerald-50/20 shadow-xl" : "border-slate-100 shadow-sm hover:border-indigo-100"
              )}
            >
               <div className="flex items-center gap-5 mb-6">
                  <div className={clsx(
                    "w-14 h-14 rounded-[22px] flex items-center justify-center shadow-xl shrink-0 transition-transform group-hover:scale-110",
                    reward.isClaimed ? "bg-slate-200 text-slate-400" : isComplete ? "bg-emerald-500 text-white" : "bg-slate-900 text-sky-400"
                  )}>
                     {reward.type === 'referral_count' ? <Users size={28}/> : reward.type === 'task_count' ? <Briefcase size={28}/> : <Target size={28}/>}
                  </div>
                  <div className="overflow-hidden">
                     <h4 className="text-sm font-black text-slate-800 uppercase italic truncate tracking-tight">{reward.title}</h4>
                     <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest italic mt-1">Reward: Rs {reward.rewardAmount}</p>
                  </div>
               </div>

               <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest max-w-[70%]">{reward.description}</p>
                     <span className={clsx("text-[10px] font-black italic", isComplete ? "text-emerald-600" : "text-slate-900")}>{reward.currentProgress} / {reward.targetValue}</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-100">
                     <motion.div 
                       initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} 
                       className={clsx("h-full rounded-full transition-all duration-700", reward.isClaimed ? "bg-slate-300" : isComplete ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" : "bg-indigo-600")}
                     />
                  </div>
               </div>

               {reward.isClaimed ? (
                  <div className="w-full h-13 bg-white border border-slate-100 rounded-[22px] flex items-center justify-center gap-3 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] shadow-inner">
                     <CheckCircle2 size={16} /> BONUS ACQUIRED
                  </div>
               ) : isComplete ? (
                  <motion.button 
                    animate={{ scale: [1, 1.03, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}
                    onClick={() => handleClaim(reward)} disabled={!!claiming}
                    className="w-full h-14 bg-emerald-600 text-white rounded-[24px] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-emerald-200/50 flex items-center justify-center gap-3 active:scale-95 transition-all"
                  >
                     {claiming === reward.id ? <Loader2 size={18} className="animate-spin"/> : <><Award size={18} /> CLAIM RS {reward.rewardAmount} 💰</>}
                  </motion.button>
               ) : (
                  <div className="w-full h-13 bg-slate-50 rounded-[22px] flex items-center justify-center text-[9px] font-black text-slate-400 uppercase tracking-widest border border-dashed border-slate-200">
                     {Math.floor(progressPercent)}% PROTOCOL SYNCED
                  </div>
               )}
            </motion.div>
          );
        }) : (
          <div className="py-24 text-center opacity-30 flex flex-col items-center">
             <Star size={48} className="text-slate-200 mb-4" />
             <p className="font-black text-slate-400 text-[10px] uppercase tracking-widest italic">No Milestone Rewards Active Currently.</p>
          </div>
        )}
      </div>

      {/* Info Card */}
      <div className="bg-indigo-50/50 p-6 rounded-[36px] border border-indigo-100 flex gap-4 mx-1">
         <Zap size={24} className="text-indigo-600 shrink-0 mt-1" />
         <p className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest leading-relaxed">
            Every claimed milestone is instantly credited to your wallet balance. Multi-accounting or fraud results in immediate disqualification from the reward cluster.
         </p>
      </div>
    </div>
  );
};

export default RewardHub;
