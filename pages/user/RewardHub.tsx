import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Zap, Users, TrendingUp, Lock, 
  CheckCircle2, Loader2, Sparkles, History,
  ChevronRight, ArrowRight, RefreshCw, Star,
  Award, ShieldCheck, Gift
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { clsx } from 'clsx';
import { api } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const RewardHub = () => {
  const { user } = useAuth();
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState<string | null>(null);

  const fetchUserMissions = async () => {
    setLoading(true);
    try {
      // Logic simulated via controller helper for local consistency
      const res = await api.get('/system/user/missions');
      setMissions(res || []);
    } catch (e) {
      console.error("Mission audit failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUserMissions(); }, []);

  const handleClaim = async (mission: any) => {
    if (claimingId || mission.isClaimed || !mission.canClaim) return;
    setClaimingId(mission.id);
    try {
      await api.post('/system/user/missions/claim', { missionId: mission.id });
      confetti({ 
        particleCount: 200, spread: 80, origin: { y: 0.6 },
        colors: ['#4A6CF7', '#00D1FF', '#FFD700', '#FFFFFF']
      });
      await fetchUserMissions();
      // Simple force refresh of user context balance
      window.dispatchEvent(new Event('noor_db_update'));
    } catch (err: any) {
      alert(err.message || "Claim Node Rejected.");
    } finally {
      setClaimingId(null);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto pb-32 space-y-10 animate-fade-in px-4">
      
      {/* 1. HERO ACHIEVEMENTS HEADER */}
      <section className="relative bg-slate-950 p-10 md:p-16 rounded-[60px] md:rounded-[80px] text-center overflow-hidden shadow-2xl border-b-[10px] border-indigo-600">
         <div className="absolute inset-0 opacity-20">
            <img src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=2070" className="w-full h-full object-cover grayscale" alt="HUD" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
         </div>
         
         <div className="relative z-10 space-y-6">
            <motion.div 
               initial={{ scale: 0 }} animate={{ scale: 1 }}
               className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-[40px] border border-white/20 flex items-center justify-center mx-auto mb-8 shadow-2xl"
            >
               <Trophy size={48} className="text-amber-400 animate-pulse" />
            </motion.div>
            <h1 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-[0.8]">
              Achievement <br/><span className="text-indigo-500">Node.</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-[10px] md:text-sm italic">Synchronize goals & unlock premium PKR yield</p>
         </div>
      </section>

      {/* 2. REWARD PROGRESS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {loading ? (
           <div className="col-span-full py-40 text-center flex flex-col items-center">
              <RefreshCw className="animate-spin text-indigo-500 mb-6" size={56} />
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest italic">Querying Global Progress Registry...</p>
           </div>
        ) : missions.map((m, idx) => (
          <motion.div 
            key={m.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
            className={clsx(
              "bg-white p-8 rounded-[56px] border flex flex-col relative transition-all group overflow-hidden",
              m.isClaimed ? "border-emerald-100 bg-emerald-50/20" : 
              m.canClaim ? "border-indigo-100 shadow-[0_40px_80px_-20px_rgba(99,102,241,0.15)]" : "border-slate-100 shadow-sm"
            )}
          >
             {m.isClaimed && (
                <div className="absolute top-0 right-0 p-8">
                   <div className="bg-emerald-500 text-white p-2 rounded-full shadow-lg"><CheckCircle2 size={24} /></div>
                </div>
             )}

             <div className="flex items-center gap-6 mb-10">
                <div className={clsx(
                   "w-20 h-20 rounded-[30px] flex items-center justify-center shadow-xl transition-all duration-500 group-hover:scale-110",
                   m.isClaimed ? "bg-emerald-500 text-white" : 
                   m.canClaim ? "bg-indigo-600 text-white animate-pulse" : "bg-slate-900 text-sky-400"
                )}>
                   {m.type === 'TASK_COUNT' ? <Zap size={36} fill="currentColor" /> : 
                    m.type === 'REFERRAL_COUNT' ? <Users size={36} /> :
                    m.type === 'STREAK_DAYS' ? <Star size={36} /> : <TrendingUp size={36} />}
                </div>
                <div className="overflow-hidden">
                   <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter leading-none mb-2">{m.title}</h3>
                   <div className="flex items-center gap-2">
                      <p className="text-[10px] font-black text-emerald-600 uppercase italic">GET RS {m.rewardAmount}</p>
                      <div className="w-1 h-1 rounded-full bg-slate-200" />
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest truncate">{m.description}</p>
                   </div>
                </div>
             </div>

             <div className="space-y-4 mb-10">
                <div className="flex justify-between items-end">
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Sync Progress</span>
                   <span className="text-[11px] font-black text-slate-900 italic">{m.currentProgress} / {m.targetValue} Units</span>
                </div>
                <div className="h-4 bg-slate-100 rounded-full p-1 border border-slate-200 shadow-inner overflow-hidden">
                   <motion.div 
                      initial={{ width: 0 }} animate={{ width: `${m.percentage}%` }}
                      className={clsx(
                        "h-full rounded-full transition-all duration-1000",
                        m.isClaimed ? "bg-emerald-500" : "bg-gradient-to-r from-indigo-500 to-sky-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                      )}
                   />
                </div>
             </div>

             <div className="mt-auto">
                {m.isClaimed ? (
                  <div className="w-full h-16 bg-white border border-emerald-200 rounded-[28px] flex items-center justify-center gap-3 text-emerald-600 font-black text-[10px] uppercase tracking-widest italic">
                     <CheckCircle2 size={18} /> Milestone Archived
                  </div>
                ) : m.canClaim ? (
                  <button 
                     onClick={() => handleClaim(m)}
                     disabled={!!claimingId}
                     className="w-full h-16 bg-indigo-600 hover:bg-slate-950 text-white rounded-[28px] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4 relative overflow-hidden group/btn"
                  >
                     <AnimatePresence mode="wait">
                       {claimingId === m.id ? (
                          <motion.div key="loader" initial={{ scale: 0.5 }} animate={{ scale: 1 }}><Loader2 className="animate-spin" size={24} /></motion.div>
                       ) : (
                          <motion.div key="text" initial={{ y: 20 }} animate={{ y: 0 }} className="flex items-center gap-3">
                             <Sparkles size={20} className="text-amber-400 animate-pulse" /> 
                             CLAIM RS {m.rewardAmount}
                          </motion.div>
                       )}
                     </AnimatePresence>
                     <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-700" />
                  </button>
                ) : (
                  <div className="w-full h-16 bg-slate-50 border border-slate-100 rounded-[28px] flex items-center justify-center gap-3 text-slate-300 font-black text-[10px] uppercase tracking-widest italic shadow-inner">
                     <Lock size={16} /> Connection Pending
                  </div>
                )}
             </div>
          </motion.div>
        ))}
      </div>

      <div className="p-10 bg-indigo-50/50 rounded-[60px] border border-indigo-100 flex flex-col md:flex-row items-center justify-between gap-8 mx-1">
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white rounded-[24px] shadow-sm border border-indigo-100 flex items-center justify-center text-indigo-600"><History size={32}/></div>
            <div>
               <h4 className="text-xl font-black text-indigo-900 uppercase italic tracking-tighter leading-none mb-1">Rewards Archival Node.</h4>
               <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest">Claimed rewards are verified by root admin before final disbursement.</p>
            </div>
         </div>
         <button className="h-14 px-10 bg-white text-indigo-600 rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-xl border border-indigo-100 flex items-center gap-2 active:scale-95 transition-all">
            Audit Statements <ChevronRight size={16}/>
         </button>
      </div>
    </div>
  );
};

export default RewardHub;