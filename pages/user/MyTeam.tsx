
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
  
  useEffect(() => {
    const fetchTeam = async () => {
      setLoading(true);
      try {
        const res = await api.get('/auth/team');
        setTeamData(res && typeof res === 'object' ? {
          t1: Array.isArray(res.t1) ? res.t1 : [],
          t2: Array.isArray(res.t2) ? res.t2 : [],
          t3: Array.isArray(res.t3) ? res.t3 : []
        } : { t1: [], t2: [], t3: [] });
      } catch (err) {
        setTeamData({ t1: [], t2: [], t3: [] });
      } finally {
        setLoading(false);
      }
    };
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
    <div className="max-w-[480px] mx-auto pb-32 space-y-5 animate-fade-in px-1">
      
      {/* COMPACT TEAM HEADER */}
      <div className="bg-slate-900 p-6 rounded-[36px] text-white relative overflow-hidden shadow-xl mx-1">
        <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 scale-150 text-sky-400"><Users size={80} /></div>
        <div className="relative z-10 flex items-center justify-between">
           <div>
              <p className="text-[10px] font-black text-sky-400 uppercase tracking-widest mb-1 italic">TEAM SUMMARY</p>
              <h2 className="text-4xl font-black italic tracking-tighter leading-none">{totalTeam} <span className="text-xs not-italic text-slate-500 ml-1">Members</span></h2>
           </div>
           <div className="flex gap-2">
              {[1, 2, 3].map(t => (
                <div key={t} className="bg-white/5 px-3 py-1.5 rounded-xl border border-white/5 text-center min-w-[50px]">
                   <p className="text-[7px] font-bold text-slate-500 uppercase">L{t}</p>
                   <p className="text-xs font-black text-white">{(teamData as any)[`t${t}`].length}</p>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* INVITE FRIENDS SECTION */}
      <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-5 mx-1">
         <div className="flex items-center justify-between px-1">
            <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <Share2 size={14} className="text-indigo-600" /> Share & Earn
            </h4>
         </div>
         <div className="bg-slate-50 border border-slate-100 rounded-3xl p-4 space-y-4 shadow-inner">
            <div className="bg-white px-4 py-3 rounded-xl border border-slate-100 overflow-hidden">
               <span className="text-[9px] font-mono font-bold text-slate-400 truncate block">
                 {referralLink}
               </span>
            </div>
            <button 
              onClick={handleCopy}
              className={clsx(
                "w-full h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2",
                copied ? "bg-emerald-600 text-white" : "bg-slate-900 text-white active:scale-95"
              )}
            >
              {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />} {copied ? 'Link Copied' : 'Invite Friends'}
            </button>
         </div>
      </div>

      {/* TIER SELECTOR */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm mx-1">
         {[1, 2, 3].map((t) => (
           <button 
            key={t} onClick={() => setActiveTier(t as any)} 
            className={clsx(
              "flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
              activeTier === t ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-900"
            )}
           >
             Level {t}
           </button>
         ))}
      </div>

      {/* TEAM MEMBER LIST */}
      <div className="space-y-2.5 min-h-[300px] px-1">
        <AnimatePresence mode="wait">
        {loading ? (
           <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center flex flex-col items-center gap-3">
             <RefreshCw size={32} className="text-indigo-500 animate-spin" />
             <p className="text-slate-300 font-black uppercase text-[10px] tracking-widest italic">Syncing Team Network...</p>
           </motion.div>
        ) : currentList.length > 0 ? (
          <motion.div key="list" className="space-y-2.5">
            {currentList.map((member, idx) => (
              <motion.div 
                key={member.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}
                className="bg-white p-4 rounded-[28px] border border-slate-100 flex items-center justify-between group shadow-sm hover:border-indigo-200 transition-all"
              >
                 <div className="flex items-center gap-4 overflow-hidden">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 font-black italic text-lg shadow-inner shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                       {member.name?.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                       <h4 className="font-black text-slate-800 text-[11px] uppercase truncate leading-none mb-1.5">{member.name}</h4>
                       <div className="flex items-center gap-1.5">
                          <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Active Member</span>
                       </div>
                    </div>
                 </div>
                 <div className="text-right shrink-0">
                    <p className="text-[9px] font-black text-indigo-600 uppercase italic tracking-tighter leading-none">{member.currentPlan || 'BASIC'}</p>
                    <p className="text-[7px] font-bold text-slate-300 uppercase mt-1.5">ID: {member.id.slice(-6)}</p>
                 </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div key="empty" className="bg-white p-20 rounded-[44px] border border-dashed border-slate-100 text-center flex flex-col items-center opacity-40 shadow-inner">
             <div className="w-16 h-16 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mb-6"><UserPlus size={32} /></div>
             <p className="text-slate-900 font-black uppercase text-[10px] tracking-widest leading-relaxed">No members at Level {activeTier}</p>
             <p className="text-slate-400 font-bold uppercase text-[8px] mt-2">Start inviting to grow your network</p>
          </motion.div>
        )}
        </AnimatePresence>
      </div>

      <div className="bg-indigo-50/50 p-6 rounded-[36px] border border-indigo-100 text-center mx-1">
         <p className="text-[10px] text-indigo-700 font-bold leading-relaxed uppercase tracking-widest">
            You earn commission automatically when your team members upgrade their plans.
         </p>
      </div>
    </div>
  );
};

export default MyTeam;
