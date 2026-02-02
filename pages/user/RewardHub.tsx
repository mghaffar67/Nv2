import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gift, Star, Zap, ChevronRight, CheckCircle2, Loader2, 
  History, Sparkles, Trophy, BadgeCheck, ArrowRight,
  TrendingUp, Target, ShieldCheck, Award,
  RefreshCw, Users, Lock, Sparkle
} from 'lucide-react';
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
      console.error("Reward node sync failed.");
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
        origin: { y: 0.6 },
        colors: ['#4A6CF7', '#00D1FF', '#FFD700']
      });
      await fetchData();
    } catch (e: any) { 
      alert(e.message); 
    } finally { 
      setClaiming(null); 
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto pb-32 space-y-10 animate-fade-in px-4 font-sans">
      
      {/* 1. BUMPER HERO SECTION (UPGRADED) */}
      <section className="relative h-[280px] md:h-[350px] bg-slate-950 rounded-[50px] md:rounded-[70px] shadow-2xl overflow-hidden flex items-center justify-center text-center border-b-[10px] border-[#4A6CF7]">
         <div className="absolute inset-0 opacity-20">
            <img src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070" className="w-full h-full object-cover" alt="Background" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
         </div>
         
         <div className="relative z-10 space-y-4 px-6">
            <motion.div 
               initial={{ scale: 0 }} animate={{ scale: 1 }}
               className="w-20 h-20 bg-indigo-500/20 backdrop-blur-xl rounded-[30px] border border-white/20 flex items-center justify-center mx-auto mb-6 shadow-2xl"
            >
               <Gift size={40} className="text-white animate-pulse" />
            </motion.div>
            <h1 className="text-4xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-[0.8]">
              Bumper <br/><span className="text-[#4A6CF7]">Rewards.</span>
            </h1>
            <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[8px] md:text-xs">Unlock your potential yield nodes</p>
         </div>
      </section>

      {/* 2. REWARD GRID (BOUNCE LOGIC IMPROVED) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
           <div className="col-span-full py-40 text-center flex flex-col items-center">
              <RefreshCw className="animate-spin text-[#4A6CF7] mb-4" size={48} />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Querying Global Reward Pool...</p>
           </div>
        ) : achievements.length > 0 ? (
          achievements.filter(r => !r.isClaimed).map((reward, idx) => {
            const isReady = reward.currentProgress >= reward.targetValue;
            const progress = Math.min(100, (reward.currentProgress / reward.targetValue) * 100);
            
            return (
              <motion.div 
                key={reward.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02, rotateY: 5 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className={clsx(
                  "bg-white p-8 rounded-[48px] border-2 flex flex-col h-[420px] relative transition-all overflow-hidden",
                  isReady ? "border-[#2EC4B6] shadow-[0_30px_60px_-15px_rgba(46,196,182,0.2)]" : "border-slate-100 shadow-sm"
                )}
              >
                {isReady && (
                   <div className="absolute top-0 right-0 p-6">
                      <Sparkles size={24} className="text-[#2EC4B6] animate-bounce" />
                   </div>
                )}

                <div className="mb-8">
                   <div className={clsx(
                     "w-16 h-16 rounded-[24px] flex items-center justify-center text-white shadow-xl mb-6",
                     isReady ? "bg-[#2EC4B6]" : "bg-slate-900"
                   )}>
                      {reward.type === 'referral_count' ? <Users size={32}/> : <Target size={32}/>}
                   </div>
                   <h3 className="text-xl font-black text-slate-800 uppercase italic leading-none">{reward.title}</h3>
                </div>

                <div className="flex-grow space-y-4">
                   <p className="text-[11px] font-bold text-slate-400 uppercase leading-relaxed italic">"{reward.description}"</p>
                   
                   <div className="pt-6 space-y-3">
                      <div className="flex justify-between items-end">
                         <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Progress node</span>
                         <span className={clsx("text-xs font-black", isReady ? "text-[#2EC4B6]" : "text-slate-900")}>{reward.currentProgress} / {reward.targetValue}</span>
                      </div>
                      <div className="h-4 w-full bg-slate-50 rounded-full border border-slate-100 p-1 overflow-hidden">
                         <motion.div 
                           initial={{ width: 0 }} animate={{ width: `${progress}%` }} 
                           className={clsx("h-full rounded-full", isReady ? "bg-[#2EC4B6]" : "bg-[#4A6CF7]")} 
                         />
                      </div>
                   </div>
                </div>

                <div className="pt-8">
                   <AnimatePresence mode="wait">
                      {isReady ? (
                        <motion.button 
                          key="claim"
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                          onClick={() => handleClaim(reward)}
                          disabled={!!claiming}
                          className="w-full h-16 bg-[#2EC4B6] text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all group overflow-hidden"
                        >
                           {claiming === reward.id ? <Loader2 size={20} className="animate-spin" /> : (
                             <>
                                <Zap size={18} fill="currentColor" /> Claim Now Rs.{reward.rewardAmount}
                             </>
                           )}
                           <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        </motion.button>
                      ) : (
                        <div className="w-full h-16 bg-slate-50 border border-slate-100 rounded-[24px] flex items-center justify-center gap-2 grayscale shadow-inner">
                           <Lock size={16} className="text-slate-300" />
                           <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Node Locked</span>
                        </div>
                      )}
                   </AnimatePresence>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-full py-40 bg-white rounded-[60px] border-4 border-dashed border-slate-100 text-center flex flex-col items-center">
             <Trophy size={64} className="text-slate-100 mb-6" />
             <p className="text-slate-400 font-black uppercase text-sm italic tracking-tighter">No Active Bumper Targets Available.</p>
          </div>
        )}
      </div>

      {/* 3. CLAIMED HISTORY SECTION (IMPROVED) */}
      <section className="space-y-6 pt-10">
         <div className="flex items-center gap-4 px-6 mb-8">
            <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-[#4A6CF7] shadow-sm"><History size={24}/></div>
            <h3 className="text-lg font-black text-slate-800 uppercase italic">Inam History Hub</h3>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.filter(r => r.isClaimed).map((reward, idx) => (
              <motion.div 
                key={reward.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-white/80 p-6 rounded-[36px] border border-slate-100 flex items-center justify-between group hover:border-[#2EC4B6] transition-all backdrop-blur-sm shadow-sm"
              >
                 <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center shadow-inner">
                       <BadgeCheck size={28} />
                    </div>
                    <div>
                       <h4 className="text-xs font-black text-slate-800 uppercase italic mb-1">{reward.title}</h4>
                       <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Verified Sync Complete</p>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="text-lg font-black text-emerald-600 italic">Rs {reward.rewardAmount}</p>
                    <p className="text-[7px] font-bold text-slate-300 uppercase italic">Authorized Node</p>
                 </div>
              </motion.div>
            ))}
         </div>
      </section>
    </div>
  );
};

export default RewardHub;