
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Added Users and Briefcase icons to the import list
import { Trophy, Star, Zap, ChevronRight, CheckCircle2, Loader2, ArrowLeft, Gift, ShieldCheck, RefreshCw, Users, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { api } from '../../utils/api';
import { clsx } from 'clsx';

const RewardHub = () => {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/rewards/my-achievements');
      setAchievements(res || []);
    } catch (e) { } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleClaim = async (reward: any) => {
    if (claiming) return;
    setClaiming(reward.id);
    try {
      await api.post('/rewards/claim', { rewardId: reward.id });
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.8 }, colors: ['#6366f1', '#10b981', '#f59e0b'] });
      fetchData();
    } catch (e: any) { 
      alert(e.message); 
    } finally { 
      setClaiming(null); 
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto pb-24 space-y-5 animate-fade-in px-2">
      <header className="flex items-center justify-between pt-2 px-1">
        <Link to="/user/dashboard" className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 active:scale-90 transition-all"><ArrowLeft size={22} /></Link>
        <h1 className="text-xl font-black text-slate-900 tracking-tight italic uppercase leading-none">Bonus <span className="text-indigo-600">Hub.</span></h1>
        <button onClick={fetchData} className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 active:rotate-180 transition-all shadow-sm">
           <RefreshCw size={18} className={clsx(loading && "animate-spin")} />
        </button>
      </header>

      {/* Hero Stats */}
      <div className="bg-slate-950 p-7 rounded-[40px] shadow-2xl relative overflow-hidden mx-1">
         <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12 scale-150 text-indigo-400"><Trophy size={100}/></div>
         <div className="relative z-10">
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 italic">ACHIEVEMENT STATUS</p>
            <h2 className="text-3xl font-black text-white italic tracking-tighter leading-none">Unlock Extra <span className="text-indigo-400">Yield.</span></h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-3 italic tracking-widest flex items-center gap-2">
               <ShieldCheck size={12} className="text-emerald-500" /> All bonuses credited instantly
            </p>
         </div>
      </div>

      <div className="space-y-3 px-1">
        {loading ? (
           <div className="py-20 text-center"><Loader2 size={32} className="animate-spin mx-auto text-slate-200" /></div>
        ) : achievements.length > 0 ? achievements.map((reward, idx) => {
          const progressPercent = Math.min(100, (reward.currentProgress / reward.targetValue) * 100);
          
          return (
            <motion.div 
              key={reward.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
              className={clsx(
                "bg-white p-5 rounded-[32px] border transition-all relative overflow-hidden group",
                reward.isClaimed ? "bg-slate-50 border-slate-100" : "border-slate-100 shadow-sm hover:border-indigo-100"
              )}
            >
               <div className="flex items-center gap-4 mb-5">
                  <div className={clsx(
                    "w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg shrink-0",
                    reward.isClaimed ? "bg-slate-200 text-slate-400" : "bg-indigo-600 text-white"
                  )}>
                     {reward.type === 'referral_count' ? <Users size={20}/> : reward.type === 'task_count' ? <Briefcase size={20}/> : <Star size={20}/>}
                  </div>
                  <div className="overflow-hidden">
                     <h4 className="text-[11px] font-black text-slate-800 uppercase italic truncate tracking-tight">{reward.title}</h4>
                     <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Bonus: Rs {reward.rewardAmount}</p>
                  </div>
               </div>

               {/* Progress Logic */}
               <div className="space-y-2 mb-6">
                  <div className="flex justify-between items-center text-[7px] font-black uppercase tracking-widest">
                     <span className="text-slate-400">{reward.description}</span>
                     <span className={clsx(reward.canClaim ? "text-indigo-600" : "text-slate-400")}>{reward.currentProgress} / {reward.targetValue}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                     <motion.div 
                       initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} 
                       className={clsx("h-full rounded-full transition-all", reward.isClaimed ? "bg-slate-300" : "bg-indigo-500")}
                     />
                  </div>
               </div>

               {reward.isClaimed ? (
                  <div className="w-full h-11 bg-slate-100 rounded-xl flex items-center justify-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                     <CheckCircle2 size={14} /> CLAIMED SUCCESSFULLY
                  </div>
               ) : reward.canClaim ? (
                  <motion.button 
                    animate={{ scale: [1, 1.02, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}
                    onClick={() => handleClaim(reward)} disabled={!!claiming}
                    className="w-full h-12 bg-emerald-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-200/50 flex items-center justify-center gap-2 active:scale-95"
                  >
                     {claiming === reward.id ? <Loader2 size={16} className="animate-spin"/> : <>CLAIM RS {reward.rewardAmount} 💰</>}
                  </motion.button>
               ) : (
                  <div className="w-full h-11 bg-slate-50 rounded-xl flex items-center justify-center text-[8px] font-black text-slate-300 uppercase tracking-widest border border-dashed border-slate-200">
                     {Math.floor(progressPercent)}% PROTOCOL COMPLETED
                  </div>
               )}
            </motion.div>
          );
        }) : (
          <div className="py-20 text-center opacity-30 italic font-black text-slate-400 text-xs">No bonus nodes active currently.</div>
        )}
      </div>

      <div className="bg-indigo-50/50 p-6 rounded-[36px] border border-indigo-100 flex gap-4 mx-1">
         <Zap size={22} className="text-indigo-500 shrink-0 mt-1" />
         <p className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest leading-relaxed">
            Achievements update in real-time. Once claimed, funds are added to your primary balance node immediately.
         </p>
      </div>
    </div>
  );
};

export default RewardHub;
