import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Zap, ChevronRight, CheckCircle2, Loader2, ArrowLeft, Gift, ShieldCheck, RefreshCw, Users, Briefcase, Target, Award, Sparkles, MapPin } from 'lucide-react';
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
      const res = await api.get('/rewards/my-achievements');
      setAchievements(res || []);
    } catch (e) {
      console.error("Audit failure.");
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
        particleCount: 150, 
        spread: 70, 
        origin: { y: 0.8 }, 
        colors: ['#6366f1', '#10b981', '#f59e0b']
      });
      fetchData();
    } catch (e: any) { 
      alert(e.message); 
    } finally { 
      setClaiming(null); 
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto pb-24 space-y-6 animate-fade-in px-1">
      <header className="flex items-center justify-between pt-2 px-1">
        <Link to="/user/dashboard" className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 active:scale-90 transition-all"><ArrowLeft size={18} /></Link>
        <h1 className="text-lg font-black text-slate-900 tracking-tighter italic uppercase leading-none">Bonus <span className="text-indigo-600">Hub.</span></h1>
        <button onClick={fetchData} className="w-9 h-9 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
           <RefreshCw size={16} className={clsx(loading && "animate-spin")} />
        </button>
      </header>

      {/* Hero Achievement Node */}
      <div className="bg-slate-950 p-6 md:p-8 rounded-[32px] shadow-xl relative overflow-hidden mx-1">
         <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12 scale-110 text-indigo-400"><Trophy size={100}/></div>
         <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 text-center md:text-left">
              <p className="text-[7px] font-black text-indigo-400 uppercase tracking-[0.3em] italic leading-none">SYSTEM MILESTONES</p>
              <h2 className="text-3xl font-black text-white italic tracking-tighter leading-none">Progress <span className="text-sky-400">Yield.</span></h2>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-2">
                 <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-[7px] font-black uppercase tracking-widest border border-emerald-500/20">
                    SECURE NODE
                 </div>
                 <div className="px-3 py-1 bg-white/5 text-slate-400 rounded-lg text-[7px] font-black uppercase tracking-widest border border-white/5">
                    LIFETIME YIELD: Rs. 0
                 </div>
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
               <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg"><Star size={20} fill="currentColor" /></div>
               <div>
                  <p className="text-[7px] font-black text-slate-500 uppercase">Associate Rank</p>
                  <p className="text-base font-black text-white italic tracking-tight uppercase">Elite Tier</p>
               </div>
            </div>
         </div>
      </div>

      {/* Achievement Track */}
      <section className="bg-white p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-sm relative mx-1">
         <div className="flex items-center justify-between mb-8 px-2">
            <h3 className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 italic"><Target size={12} className="text-indigo-500" /> Milestone Audit</h3>
            <p className="text-[7px] font-black text-indigo-600 uppercase italic">Interactive Feed</p>
         </div>

         <div className="overflow-x-auto no-scrollbar pb-6">
            <div className="flex items-center min-w-[800px] relative px-6">
               <div className="absolute left-6 right-6 h-1 bg-slate-100 rounded-full top-[32px] -translate-y-1/2" />
               
               {achievements.map((reward, i) => {
                 const isComplete = reward.currentProgress >= reward.targetValue;
                 const isLast = i === achievements.length - 1;

                 return (
                   <div key={reward.id} className="relative flex flex-col items-center flex-1">
                      <div className={clsx(
                        "absolute left-0 h-1 top-[32px] -translate-y-1/2 transition-all duration-700",
                        isComplete ? "bg-indigo-600 w-full" : "bg-transparent w-0"
                      )} style={{ right: isLast ? '50%' : '0' }} />

                      <div className="relative z-10 mb-6">
                        <div className={clsx(
                          "w-16 h-16 rounded-[22px] flex items-center justify-center border-4 border-white shadow-lg transition-all duration-300 transform hover:scale-105",
                          reward.isClaimed ? "bg-emerald-500 text-white" : isComplete ? "bg-indigo-600 text-white animate-pulse shadow-indigo-100" : "bg-slate-50 text-slate-300"
                        )}>
                          {reward.isClaimed ? <CheckCircle2 size={24} /> : reward.type === 'referral_count' ? <Users size={24} /> : <Briefcase size={24} />}
                        </div>
                      </div>

                      <div className="text-center space-y-1">
                         <h4 className="text-[9px] font-black text-slate-800 uppercase tracking-tight leading-none mb-1.5">{reward.title}</h4>
                         <p className="text-[8px] font-black text-indigo-600 italic">Rs. {reward.rewardAmount}</p>
                         <div className="mt-3">
                           {reward.isClaimed ? (
                             <span className="text-[6px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2.5 py-0.5 rounded-md">Synced</span>
                           ) : isComplete ? (
                             <button 
                               onClick={() => handleClaim(reward)}
                               disabled={!!claiming}
                               className="h-8 px-4 bg-slate-950 text-white rounded-lg font-black text-[8px] uppercase tracking-widest shadow-md active:scale-95 transition-all"
                             >
                               {claiming === reward.id ? <Loader2 className="animate-spin" size={12}/> : 'Claim'}
                             </button>
                           ) : (
                             <div className="space-y-1.5">
                               <p className="text-[7px] font-bold text-slate-400 uppercase">{reward.currentProgress} / {reward.targetValue}</p>
                               <div className="w-16 h-1 bg-slate-100 rounded-full mx-auto overflow-hidden">
                                  <motion.div initial={{ width: 0 }} animate={{ width: `${(reward.currentProgress/reward.targetValue)*100}%` }} className="h-full bg-slate-300" />
                               </div>
                             </div>
                           )}
                         </div>
                      </div>
                   </div>
                 );
               })}
            </div>
         </div>
      </section>

      <div className="p-6 bg-indigo-50/50 rounded-[32px] border border-indigo-100 flex items-center gap-5 mx-1">
         <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm shrink-0"><Zap size={18} fill="currentColor" /></div>
         <div>
           <h4 className="text-[10px] font-black text-indigo-900 uppercase italic mb-1">Incentive Architecture</h4>
           <p className="text-[8px] text-indigo-700 font-bold uppercase leading-relaxed tracking-wider opacity-80">
              Bonuses are instantly credited to your primary wallet node. Fake activity results in permanent disqualification from all yield cycles.
           </p>
         </div>
      </div>
    </div>
  );
};

export default RewardHub;