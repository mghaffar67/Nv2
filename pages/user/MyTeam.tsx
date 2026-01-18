
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Copy, CheckCircle2, UserPlus, 
  TrendingUp, ShieldCheck, ChevronRight,
  Info, Loader2, Award
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
        setTeamData(res);
      } catch (err) {
        console.error("Team sync failed.");
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
    return activeTier === 1 ? teamData.t1 : activeTier === 2 ? teamData.t2 : teamData.t3;
  }, [activeTier, teamData]);

  const totalSize = teamData.t1.length + teamData.t2.length + teamData.t3.length;

  return (
    <div className="max-w-2xl mx-auto px-1 pb-24 space-y-4 animate-fade-in">
      
      {/* 1. NETWORK OVERVIEW */}
      <div className="grid grid-cols-2 gap-3 px-1">
         <div className="bg-slate-950 p-6 rounded-[32px] text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10"><Users size={40} /></div>
            <p className="text-[9px] font-black text-sky-400 uppercase tracking-widest mb-1">Fleet Size</p>
            <h3 className="text-3xl font-black tracking-tighter">{totalSize} <span className="text-[10px] text-slate-500 uppercase italic">Active</span></h3>
         </div>
         <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-5"><TrendingUp size={40} className="text-emerald-500" /></div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Reward Node</p>
            <h3 className="text-3xl font-black tracking-tighter text-emerald-600">3-Tiers</h3>
         </div>
      </div>

      {/* 2. REFERRAL LINK */}
      <div className="bg-white p-6 rounded-[36px] border border-slate-100 shadow-sm mx-1 space-y-4">
         <div className="flex items-center gap-2 px-1">
            <ShieldCheck size={16} className="text-indigo-600" />
            <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest italic">Growth Link</h4>
         </div>
         <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-grow bg-slate-50 border border-slate-100 rounded-2xl px-5 flex items-center h-14 overflow-hidden">
               <span className="text-[10px] font-bold text-slate-400 truncate">{referralLink}</span>
            </div>
            <button 
              onClick={handleCopy}
              className={clsx(
                "h-14 px-8 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 shrink-0",
                copied ? "bg-emerald-500 text-white" : "bg-slate-900 text-white active:scale-95"
              )}
            >
              {copied ? <><CheckCircle2 size={18} /> Copied</> : <><Copy size={18} /> Copy</>}
            </button>
         </div>
      </div>

      {/* 3. TIER NAVIGATION */}
      <div className="flex bg-white p-1.5 rounded-[24px] border border-slate-100 shadow-sm mx-1">
         {[1, 2, 3].map((t) => (
           <button 
            key={t} 
            onClick={() => setActiveTier(t as any)} 
            className={clsx(
              "flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
              activeTier === t ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:bg-slate-50"
            )}
           >
             Tier {t}
           </button>
         ))}
      </div>

      {/* 4. ADAPTIVE VERTICAL LIST */}
      <div className="space-y-2.5 px-1 min-h-[300px]">
        {loading ? (
           <div className="py-20 text-center flex flex-col items-center gap-4">
             <Loader2 size={36} className="text-indigo-500 animate-spin" />
             <p className="text-slate-300 font-black uppercase text-[11px] tracking-[0.3em]">Syncing Fleet Data...</p>
           </div>
        ) : currentList.length > 0 ? (
          <div className="space-y-3">
             {currentList.map((member, idx) => (
               <motion.div 
                 key={member.id} 
                 initial={{ opacity: 0, x: -10 }} 
                 animate={{ opacity: 1, x: 0 }} 
                 transition={{ delay: idx * 0.05 }}
                 className="bg-white p-5 rounded-[28px] border border-slate-100 flex items-center justify-between shadow-sm group hover:border-indigo-200"
               >
                  <div className="flex items-center gap-4 overflow-hidden">
                     <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center text-sky-400 font-black italic text-sm shrink-0 shadow-lg border border-slate-800">
                        {member.name?.charAt(0)}
                     </div>
                     <div className="overflow-hidden">
                        <h4 className="font-black text-slate-900 text-sm leading-tight uppercase truncate">{member.name}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Tier {activeTier} Partner</p>
                     </div>
                  </div>

                  <div className="text-right">
                     <p className="text-xs font-black text-slate-800 uppercase leading-none">{member.currentPlan || 'BASIC'}</p>
                     <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-2 flex items-center gap-1 justify-end">
                       <Award size={10} /> Active
                     </p>
                  </div>
               </motion.div>
             ))}
          </div>
        ) : (
          <div className="bg-white p-14 rounded-[44px] border-2 border-dashed border-slate-100 text-center flex flex-col items-center">
             <div className="w-18 h-18 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mb-6 shadow-inner"><UserPlus size={40} /></div>
             <p className="text-slate-400 font-black uppercase text-[11px] tracking-widest mb-2">No Active Nodes</p>
             <p className="text-[9px] text-slate-300 uppercase tracking-widest max-w-[200px] leading-relaxed">Refer others to grow your Tier {activeTier} earning channel.</p>
          </div>
        )}
      </div>

      <div className="bg-indigo-50 p-6 rounded-[32px] border border-indigo-100 flex items-start gap-4 mx-1">
         <Info size={20} className="text-indigo-500 shrink-0 mt-0.5" />
         <div>
            <h4 className="text-[11px] font-black text-indigo-900 uppercase tracking-tight mb-1 italic">Protocol Logic</h4>
            <p className="text-[10px] text-indigo-700 font-bold leading-relaxed uppercase tracking-wider">
               Earnings are synced automatically when your downline activates a station. 15% for T1, 5% for T2, and 2% for T3.
            </p>
         </div>
      </div>
    </div>
  );
};

export default MyTeam;
