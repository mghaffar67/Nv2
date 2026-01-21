
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Copy, CheckCircle2, UserPlus, 
  ShieldCheck, Loader2, Zap, Network,
  Smartphone, TrendingUp, ChevronRight, Award, Share2
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';

const MyTeam = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [activeTier, setActiveTier] = useState<1 | 2 | 3>(1);
  const [teamData, setTeamData] = useState<{ t1: any[], t2: any[], t3: any[] }>({ t1: [], t2: [], t3: [] });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchTeam = async () => {
      setLoading(true);
      try {
        const res = await api.get('/auth/team');
        // Harden response: Ensure we always have an object with tiers
        setTeamData(res && typeof res === 'object' ? {
          t1: Array.isArray(res.t1) ? res.t1 : [],
          t2: Array.isArray(res.t2) ? res.t2 : [],
          t3: Array.isArray(res.t3) ? res.t3 : []
        } : { t1: [], t2: [], t3: [] });
      } catch (err) {
        console.warn("Network Hub sync failed. Using offline state.");
        setTeamData({ t1: [], t2: [], t3: [] });
      } finally {
        setLoading(false);
      }
    };
    if (user?.referralCode) fetchTeam();
  }, [user?.referralCode]);

  const referralLink = `${window.location.origin}/#/register?ref=${user?.referralCode || 'NODE'}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentList = useMemo(() => {
    if (activeTier === 1) return teamData.t1;
    if (activeTier === 2) return teamData.t2;
    return teamData.t3;
  }, [activeTier, teamData]);

  const totalNetwork = teamData.t1.length + teamData.t2.length + teamData.t3.length;

  return (
    <div className="w-full max-w-full overflow-x-hidden px-2 pb-24 space-y-5 animate-fade-in">
      
      {/* NETWORK STATUS OVERVIEW */}
      <div className="bg-slate-950 p-6 rounded-[32px] text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 scale-150 text-sky-400 pointer-events-none">
          <Network size={100} />
        </div>
        <div className="relative z-10 text-center">
           <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[7px] font-black uppercase tracking-widest text-sky-400 mb-4">
              <Zap size={10} className="animate-pulse" /> NETWORK PROTOCOL ACTIVE
           </div>
           <h2 className="text-4xl font-black tracking-tighter leading-none mb-1 italic">{totalNetwork}</h2>
           <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em] italic mb-6">Total Network Associates</p>
           
           <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map(t => (
                <div key={t} className="bg-white/5 p-2 rounded-xl border border-white/5 backdrop-blur-md">
                   <p className="text-[7px] font-black text-slate-500 uppercase">Tier {t}</p>
                   <p className="text-xs font-black text-white">{(teamData as any)[`t${t}`].length}</p>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* REFERRAL HUB */}
      <div className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm space-y-4 mx-1">
         <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest italic flex items-center gap-2">
              <Share2 size={14} className="text-indigo-600" /> Invitation Node
            </h4>
         </div>
         <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3">
            <div className="overflow-hidden">
               <span className="text-[9px] font-bold text-slate-400 truncate block font-mono bg-white px-2 py-2 rounded-lg border border-slate-100">
                 {referralLink}
               </span>
            </div>
            <button 
              onClick={handleCopy}
              className={clsx(
                "w-full h-11 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2",
                copied ? "bg-emerald-500 text-white" : "bg-slate-950 text-white active:scale-95"
              )}
            >
              {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />} {copied ? 'ID Copied' : 'Copy Network Link'}
            </button>
         </div>
      </div>

      {/* TIER NAVIGATOR */}
      <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm sticky top-16 z-40 backdrop-blur-md mx-1">
         {[1, 2, 3].map((t) => (
           <button 
            key={t} onClick={() => setActiveTier(t as any)} 
            className={clsx(
              "flex-1 py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
              activeTier === t ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:text-slate-900"
            )}
           >
             Level {t}
           </button>
         ))}
      </div>

      {/* ASSOCIATES LIST */}
      <div className="space-y-2.5 min-h-[200px] px-1">
        <AnimatePresence mode="wait">
        {loading ? (
           <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 text-center flex flex-col items-center gap-3">
             <Loader2 size={24} className="text-indigo-500 animate-spin" />
             <p className="text-slate-300 font-black uppercase text-[8px] tracking-[0.3em]">Scanning Network...</p>
           </motion.div>
        ) : currentList.length > 0 ? (
          <motion.div key="list" className="space-y-2.5">
            {currentList.map((member, idx) => (
              <motion.div 
                key={member.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}
                className="bg-white p-4 rounded-3xl border border-slate-100 flex items-center justify-between group active:bg-slate-50 transition-colors shadow-sm"
              >
                 <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-12 h-12 rounded-[18px] bg-slate-900 flex items-center justify-center text-sky-400 font-black italic text-lg shrink-0 shadow-lg border border-white/10">
                       {member.name?.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                       <h4 className="font-black text-slate-800 text-[11px] uppercase truncate leading-none mb-1.5">{member.name}</h4>
                       <p className="text-[8px] font-bold text-slate-400 uppercase flex items-center gap-1.5 truncate">
                          <Smartphone size={10} className="text-indigo-600" /> Active Hub
                       </p>
                    </div>
                 </div>
                 <div className="text-right shrink-0">
                    <p className="text-[10px] font-black text-indigo-600 uppercase italic tracking-tighter">{member.currentPlan || 'BASIC'}</p>
                    <div className="mt-1 flex items-center gap-1 justify-end">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                       <span className="text-[6px] font-black text-emerald-600 uppercase tracking-widest">Online</span>
                    </div>
                 </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div key="empty" className="bg-white p-12 rounded-[40px] border border-slate-100 text-center flex flex-col items-center opacity-60">
             <div className="w-12 h-12 bg-slate-50 text-slate-200 rounded-2xl flex items-center justify-center mb-4 shadow-inner"><UserPlus size={24} /></div>
             <p className="text-slate-400 font-black uppercase text-[9px] tracking-widest leading-relaxed px-6">Tier {activeTier} Hub Currently Inactive</p>
          </motion.div>
        )}
        </AnimatePresence>
      </div>

      {/* REWARD INFO */}
      <div className="bg-indigo-50 p-6 rounded-[32px] border border-indigo-100 flex items-start gap-4 mx-1">
         <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-500 shadow-sm shrink-0 border border-indigo-50">
            <Award size={20} />
         </div>
         <div>
            <h4 className="text-[10px] font-black text-indigo-900 uppercase tracking-widest mb-1 italic">Growth Incentives</h4>
            <p className="text-[8px] text-indigo-700/80 font-bold leading-relaxed uppercase tracking-wider">
               Commissions are distributed across your 3-level network structure instantly. Ensure your associates remain active to maximize your override yield.
            </p>
         </div>
      </div>
    </div>
  );
};

export default MyTeam;
