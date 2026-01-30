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
    } catch (e: any) { 
      alert(e.message); 
    } finally { 
      setClaiming(null); 
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto pb-24 space-y-8 animate-fade-in px-2">
      <header className="flex items-center justify-between pt-2 px-1">
        <Link to="/user/dashboard" className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-400 active:scale-90 transition-all"><ArrowLeft size={20} /></Link>
        <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">Achievements <span className="text-indigo-600">& Rewards.</span></h1>
        <button onClick={fetchData} className="w-11 h-11 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 active:rotate-180 transition-all shadow-sm">
           <RefreshCw size={20} className={clsx(loading && "animate-spin")} />
        </button>
      </header>

      {/* Hero Achievement Widget */}
      <div className="bg-slate-950 p-8 md:p-12 rounded-[44px] shadow-2xl relative overflow-hidden mx-1">
         <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12 scale-150 text-indigo-400"><Trophy size={160}/></div>
         <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-4">
              <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-1 italic">PARTNER MILESTONE PROGRAM</p>
              <h2 className="text-4xl font-black text-white italic tracking-tighter leading-none">Your Progress <br/><span className="text-sky-400">Yield.</span></h2>
              <div className="flex items-center gap-3">
                 <div className="px-4 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-500/30 flex items-center gap-1.5">
                    <ShieldCheck size={12} /> VERIFIED ACCOUNT
                 </div>
                 <div className="px-4 py-1.5 bg-white/5 text-slate-400 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/5">
                    LIFETIME REWARDS: Rs. 0
                 </div>
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-4 bg-white/5 p-6 rounded-[32px] border border-white/5 backdrop-blur-md">
               <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg"><Star size={24} fill="currentColor" /></div>
               <div>
                  <p className="text-[8px] font-black text-slate-500 uppercase">Current Level</p>
                  <p className="text-lg font-black text-white">Associate Elite</p>
               </div>
            </div>
         </div>
      </div>

      {/* Horizontal Milestone Track */}
      <section className="bg-white p-8 md:p-12 rounded-[44px] border border-slate-100 shadow-sm relative mx-1">
         <div className="flex items-center justify-between mb-10 px-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2 italic"><Target size={14} className="text-indigo-500" /> Milestone Track</h3>
            <p className="text-[9px] font-black text-indigo-600 uppercase">Scroll to see more</p>
         </div>

         <div className="overflow-x-auto no-scrollbar pb-8">
            <div className="flex items-center min-w-[1000px] relative px-10">
               {/* Background Track Line */}
               <div className="absolute left-10 right-10 h-1.5 bg-slate-100 rounded-full top-[50px] -translate-y-1/2" />
               
               {achievements.map((reward, i) => {
                 const isComplete = reward.currentProgress >= reward.targetValue;
                 const isLast = i === achievements.length - 1;

                 return (
                   <div key={reward.id} className="relative flex flex-col items-center flex-1">
                      {/* Connector fill */}
                      <div 
                        className={clsx(
                          "absolute left-0 h-1.5 top-[50px] -translate-y-1/2 transition-all duration-1000",
                          isComplete ? "bg-indigo-600 w-full" : "bg-transparent w-0"
                        )} 
                        style={{ right: isLast ? '50%' : '0' }}
                      />

                      {/* Milestone Node */}
                      <div className="relative z-10 group mb-10">
                        <div className={clsx(
                          "w-24 h-24 rounded-3xl flex items-center justify-center border-4 border-white shadow-2xl transition-all duration-500 transform group-hover:scale-110",
                          reward.isClaimed ? "bg-emerald-500 text-white" : isComplete ? "bg-indigo-600 text-white animate-pulse" : "bg-slate-100 text-slate-300"
                        )}>
                          {reward.isClaimed ? <CheckCircle2 size={32} /> : reward.type === 'referral_count' ? <Users size={32} /> : <Briefcase size={32} />}
                        </div>
                        {isComplete && !reward.isClaimed && (
                          <div className="absolute -top-3 -right-3 bg-amber-400 text-white p-1.5 rounded-xl shadow-lg border-2 border-white"><Sparkles size={16} fill="currentColor" /></div>
                        )}
                      </div>

                      {/* Label & Details */}
                      <div className="text-center space-y-2">
                         <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-tight">{reward.title}</h4>
                         <p className="text-[10px] font-black text-indigo-600 italic">Rs. {reward.rewardAmount}</p>
                         <div className="mt-4">
                           {reward.isClaimed ? (
                             <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">Collected</span>
                           ) : isComplete ? (
                             <button 
                               onClick={() => handleClaim(reward)}
                               disabled={!!claiming}
                               className="h-10 px-6 bg-slate-900 text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                             >
                               {claiming === reward.id ? <Loader2 className="animate-spin" size={14}/> : 'Claim Now'}
                             </button>
                           ) : (
                             <div className="space-y-2">
                               <p className="text-[8px] font-bold text-slate-400 uppercase">{reward.currentProgress} / {reward.targetValue}</p>
                               <div className="w-20 h-1 bg-slate-50 rounded-full mx-auto overflow-hidden">
                                  <div className="h-full bg-slate-200" style={{ width: `${(reward.currentProgress/reward.targetValue)*100}%` }} />
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

      <div className="p-8 bg-indigo-50/50 rounded-[44px] border border-indigo-100 flex flex-col md:flex-row items-center gap-6 mx-1">
         <div className="w-14 h-14 bg-white rounded-3xl flex items-center justify-center text-indigo-600 shadow-sm shrink-0"><Zap size={24} fill="currentColor" /></div>
         <div>
           <h4 className="text-sm font-black text-indigo-900 uppercase italic">Incentive Architecture</h4>
           <p className="text-[10px] text-indigo-700 font-bold leading-relaxed uppercase tracking-widest mt-1">
              Every claimed milestone is instantly credited to your wallet balance. Multi-accounting or fraud results in immediate disqualification from the reward cluster.
           </p>
         </div>
      </div>
    </div>
  );
};

export default RewardHub;