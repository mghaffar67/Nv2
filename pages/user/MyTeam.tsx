
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Copy, CheckCircle2, UserPlus, 
  ShieldCheck, Loader2, Zap, Network,
  Smartphone, TrendingUp, ChevronRight, Award, Share2, Globe, Heart,
  RefreshCw, User, BarChart3, Target, Activity
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
    <div className="max-w-5xl mx-auto pb-32 space-y-6 animate-fade-in px-2">
      
      {/* 1. NETWORK POWER HEADER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
         <div className="lg:col-span-8 bg-slate-950 p-8 md:p-10 rounded-[44px] text-white relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center gap-10">
            <div className="absolute top-0 right-0 p-6 opacity-10 rotate-12 scale-150 text-indigo-400 pointer-events-none"><Network size={140} /></div>
            
            <div className="relative shrink-0 text-center md:text-left">
               <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-3 italic">Network Power</p>
               <h2 className="text-7xl font-black italic tracking-tighter leading-none mb-4">{totalTeam}</h2>
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-indigo-300">
                  <Activity size={12} className="animate-pulse" /> Live Structure
               </div>
            </div>

            <div className="flex-grow grid grid-cols-3 gap-3 w-full">
               {[
                 { label: 'Level 1', count: teamData.t1.length, rate: '15%' },
                 { label: 'Level 2', count: teamData.t2.length, rate: '5%' },
                 { label: 'Level 3', count: teamData.t3.length, rate: '2%' }
               ].map(t => (
                 <div key={t.label} className="bg-white/5 p-4 rounded-3xl border border-white/5 flex flex-col items-center justify-center gap-1">
                    <p className="text-[8px] font-bold text-slate-500 uppercase">{t.label}</p>
                    <p className="text-xl font-black text-white">{t.count}</p>
                    <span className="text-[7px] font-black text-emerald-400 uppercase">{t.rate} Yield</span>
                 </div>
               ))}
            </div>
         </div>

         <div className="lg:col-span-4 bg-white p-8 rounded-[44px] border border-slate-100 shadow-sm space-y-6 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full" />
            <div className="flex items-center gap-4 relative z-10">
               <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner"><Share2 size={28}/></div>
               <div>
                  <h4 className="text-lg font-black text-slate-800 uppercase italic tracking-tighter">Growth Node</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Invite for passive yield</p>
               </div>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-4 space-y-4 shadow-inner relative z-10">
               <div className="bg-white px-4 py-3 rounded-xl border border-slate-100 overflow-hidden shadow-sm">
                  <span className="text-[9px] font-mono font-bold text-slate-500 truncate block">
                    {referralLink}
                  </span>
               </div>
               <button 
                 onClick={handleCopy}
                 className={clsx(
                   "w-full h-14 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95",
                   copied ? "bg-emerald-600 text-white" : "bg-slate-900 text-white hover:bg-indigo-600"
                 )}
               >
                 {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />} 
                 {copied ? 'Copied' : 'Copy Link'}
               </button>
            </div>
         </div>
      </div>

      {/* 2. TIER LIST INTERFACE */}
      <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm p-3">
         <div className="flex p-2 bg-slate-50 rounded-[40px] gap-2 mb-6 overflow-x-auto no-scrollbar">
            {[1, 2, 3].map((t) => (
              <button 
               key={t} onClick={() => setActiveTier(t as any)} 
               className={clsx(
                 "flex-1 py-4 px-6 rounded-[32px] text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                 activeTier === t ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:text-slate-900"
               )}
              >
                Level {t} Registry
              </button>
            ))}
         </div>

         <div className="px-4 pb-8 min-h-[400px]">
            <AnimatePresence mode="wait">
               {loading ? (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-32 text-center flex flex-col items-center gap-4">
                    <RefreshCw size={44} className="text-indigo-500 animate-spin opacity-20" />
                    <p className="text-slate-300 font-black uppercase text-[10px] tracking-widest italic">Auditing Structure Nodes...</p>
                  </motion.div>
               ) : currentList.length > 0 ? (
                 <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                   {currentList.map((member, idx) => (
                     <motion.div 
                       key={member.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}
                       className="bg-slate-50/50 p-6 rounded-[36px] border border-transparent hover:border-indigo-100 hover:bg-white hover:shadow-xl transition-all flex flex-col group h-[160px] justify-between"
                     >
                        <div className="flex items-center justify-between mb-4">
                           <div className="w-12 h-12 rounded-2xl bg-white text-slate-400 flex items-center justify-center text-xl font-black italic shadow-sm group-hover:bg-slate-900 group-hover:text-sky-400 transition-all">
                              {member.name?.charAt(0)}
                           </div>
                           <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase border border-emerald-100 italic">Active Station</span>
                        </div>
                        <div>
                           <h4 className="font-black text-slate-800 text-[13px] uppercase truncate mb-1">{member.name}</h4>
                           <div className="flex items-center justify-between">
                              <p className="text-[10px] font-black text-indigo-600 uppercase italic leading-none">{member.currentPlan || 'BASIC'}</p>
                              <p className="text-[8px] font-bold text-slate-300 uppercase">ID: {member.id.slice(-8)}</p>
                           </div>
                        </div>
                     </motion.div>
                   ))}
                 </motion.div>
               ) : (
                 <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-32 text-center flex flex-col items-center opacity-30">
                    <div className="w-20 h-20 bg-slate-100 rounded-[35px] flex items-center justify-center mb-6">
                      <Users size={40} className="text-slate-300" />
                    </div>
                    <p className="text-slate-900 font-black uppercase text-[12px] tracking-widest leading-relaxed italic">No Nodes Detected in Level {activeTier}.</p>
                    <p className="text-slate-400 font-bold uppercase text-[9px] mt-2">Deploy your link to expand network hierarchy</p>
                 </motion.div>
               )}
            </AnimatePresence>
         </div>
      </div>

      {/* 3. POLICY FOOTER */}
      <div className="p-8 bg-indigo-50/50 rounded-[44px] border border-indigo-100 mx-1 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm"><ShieldCheck size={28}/></div>
            <div>
               <h4 className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">Yield Protocol</h4>
               <p className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest mt-1">Multi-Tier Automation</p>
            </div>
         </div>
         <p className="text-[10px] text-indigo-700 font-bold leading-relaxed uppercase tracking-widest md:text-right">
            Hierarchy distribution is automated. Commissions are instantly calculated and disbursed to your primary liquidity node upon downline upgrades.
         </p>
      </div>
    </div>
  );
};

export default MyTeam;
