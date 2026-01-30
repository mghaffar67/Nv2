
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Copy, CheckCircle2, UserPlus, 
  ShieldCheck, Loader2, Zap, Network,
  Smartphone, TrendingUp, ChevronRight, Award, Share2, Globe, Heart,
  RefreshCw, User
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
  
  const fetchTeam = async () => {
    setLoading(true);
    try {
      // In Noor V3, the getTeam API must return L1, L2, L3 members based on referral codes
      const res = await api.get('/auth/team');
      setTeamData({
        t1: res.t1 || [],
        t2: res.t2 || [],
        t3: res.t3 || []
      });
    } catch (err) {
      setTeamData({ t1: [], t2: [], t3: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.referralCode) fetchTeam();
  }, [user?.referralCode]);

  const referralLink = `${window.location.origin}/#/register?ref=${user?.referralCode || 'USER'}`;

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

  const totalTeam = teamData.t1.length + teamData.t2.length + teamData.t3.length;

  return (
    <div className="max-w-4xl mx-auto pb-32 space-y-6 animate-fade-in px-2">
      
      {/* PC READY HEADER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
         <div className="bg-slate-950 p-8 rounded-[44px] text-white relative overflow-hidden shadow-2xl flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-6 opacity-10 rotate-12 scale-150 text-indigo-400"><Users size={120} /></div>
            <div className="relative z-10">
               <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-3 italic">Mera Team Summary</p>
               <h2 className="text-6xl font-black italic tracking-tighter leading-none mb-8">{totalTeam}</h2>
               <div className="flex gap-4">
                  {[
                    { label: 'Level 1', count: teamData.t1.length },
                    { label: 'Level 2', count: teamData.t2.length },
                    { label: 'Level 3', count: teamData.t3.length }
                  ].map(t => (
                    <div key={t.label} className="bg-white/5 px-4 py-2 rounded-2xl border border-white/5 text-center flex-grow">
                       <p className="text-[8px] font-bold text-slate-500 uppercase">{t.label}</p>
                       <p className="text-base font-black text-white">{t.count}</p>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         <div className="bg-white p-8 rounded-[44px] border border-slate-100 shadow-sm space-y-6 flex flex-col justify-center">
            <div className="flex items-center gap-4">
               <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner"><Share2 size={28}/></div>
               <div>
                  <h4 className="text-xl font-black text-slate-800 uppercase italic tracking-tighter">Invite Friends</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Apna referral link doston ke sath share karein</p>
               </div>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 space-y-4 shadow-inner">
               <div className="bg-white px-5 py-4 rounded-xl border border-slate-100 overflow-hidden shadow-sm">
                  <span className="text-[10px] font-mono font-bold text-slate-500 truncate block">
                    {referralLink}
                  </span>
               </div>
               <button 
                 onClick={handleCopy}
                 className={clsx(
                   "w-full h-14 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95",
                   copied ? "bg-emerald-600 text-white" : "bg-slate-900 text-white hover:bg-indigo-600"
                 )}
               >
                 {copied ? <CheckCircle2 size={20} /> : <Copy size={20} />} {copied ? 'Link Copy Ho Gaya' : 'Copy referral link'}
               </button>
            </div>
         </div>
      </div>

      {/* TIER SELECTOR & LIST */}
      <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm p-2">
         <div className="flex p-2 bg-slate-50 rounded-[40px] gap-2 mb-6">
            {[1, 2, 3].map((t) => (
              <button 
               key={t} onClick={() => setActiveTier(t as any)} 
               className={clsx(
                 "flex-1 py-4 rounded-[32px] text-[11px] font-black uppercase tracking-widest transition-all",
                 activeTier === t ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:text-slate-900"
               )}
              >
                Level {t} Members
              </button>
            ))}
         </div>

         <div className="px-4 pb-8 min-h-[400px]">
            <AnimatePresence mode="wait">
               {loading ? (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-32 text-center flex flex-col items-center gap-4">
                    <RefreshCw size={44} className="text-indigo-500 animate-spin opacity-20" />
                    <p className="text-slate-300 font-black uppercase text-[10px] tracking-widest italic">Syncing Team Registry...</p>
                  </motion.div>
               ) : currentList.length > 0 ? (
                 <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                   {currentList.map((member, idx) => (
                     <motion.div 
                       key={member.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}
                       className="bg-slate-50/50 p-5 rounded-[32px] border border-transparent hover:border-indigo-100 hover:bg-white hover:shadow-xl transition-all flex items-center justify-between group"
                     >
                        <div className="flex items-center gap-5 overflow-hidden">
                           <div className="w-14 h-14 rounded-2xl bg-white text-slate-400 flex items-center justify-center text-2xl font-black italic shadow-sm shrink-0 group-hover:bg-slate-900 group-hover:text-sky-400 transition-all">
                              {member.name?.charAt(0)}
                           </div>
                           <div className="overflow-hidden">
                              <h4 className="font-black text-slate-800 text-[13px] uppercase truncate mb-1">{member.name}</h4>
                              <span className="px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[7px] font-black uppercase border border-emerald-100">Active Member</span>
                           </div>
                        </div>
                        <div className="text-right shrink-0">
                           <p className="text-[10px] font-black text-indigo-600 uppercase italic leading-none">{member.currentPlan || 'BASIC'}</p>
                           <p className="text-[8px] font-bold text-slate-300 uppercase mt-2">ID: {member.id.slice(-8)}</p>
                        </div>
                     </motion.div>
                   ))}
                 </motion.div>
               ) : (
                 <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-32 text-center flex flex-col items-center opacity-30">
                    <UserPlus size={64} className="text-slate-200 mb-6" />
                    <p className="text-slate-900 font-black uppercase text-[12px] tracking-widest leading-relaxed">Level {activeTier} par abhi koi member nahi hai.</p>
                    <p className="text-slate-400 font-bold uppercase text-[9px] mt-2">Team barhanay ke liye apna link share karein</p>
                 </motion.div>
               )}
            </AnimatePresence>
         </div>
      </div>

      <div className="p-8 bg-indigo-50/50 rounded-[44px] border border-indigo-100 text-center mx-1 flex flex-col md:flex-row items-center justify-center gap-4">
         <ShieldCheck size={28} className="text-indigo-600" />
         <p className="text-[10px] md:text-xs text-indigo-700 font-bold leading-relaxed uppercase tracking-widest">
            Level 1 se 15%, Level 2 se 5%, aur Level 3 se 2% commission aapke wallet mein automatic add hota hai.
         </p>
      </div>
    </div>
  );
};

export default MyTeam;
