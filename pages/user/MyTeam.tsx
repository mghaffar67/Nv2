
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Copy, Award, Zap, CheckCircle2, UserPlus, 
  TrendingUp, Wallet, ShieldCheck, ChevronRight, Layers,
  Calendar, DollarSign, Info, Search
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../../context/AuthContext';

const MyTeam = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [activeTier, setActiveTier] = useState<1 | 2 | 3>(1);
  const [teamData, setTeamData] = useState<{ t1: any[], t2: any[], t3: any[] }>({ t1: [], t2: [], t3: [] });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchFullNetwork = () => {
      setLoading(true);
      const db = JSON.parse(localStorage.getItem('noor_mock_db') || '[]');
      const level1 = db.filter((u: any) => u.referredBy === user?.referralCode);
      const level1Codes = level1.map((u: any) => u.referralCode);
      const level2 = db.filter((u: any) => level1Codes.includes(u.referredBy));
      const level2Codes = level2.map((u: any) => u.referralCode);
      const level3 = db.filter((u: any) => level2Codes.includes(u.referredBy));
      setTeamData({ t1: level1, t2: level2, t3: level3 });
      setLoading(false);
    };
    if (user?.referralCode) fetchFullNetwork();
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

  const totalTeamSize = teamData.t1.length + teamData.t2.length + teamData.t3.length;
  // Mock commission calculation based on active plans
  const totalCommission = teamData.t1.length * 150 + teamData.t2.length * 50 + teamData.t3.length * 20;

  return (
    <div className="max-w-2xl mx-auto px-1 pb-24 space-y-4 animate-fade-in">
      
      {/* 1. COMPACT STATS GRID */}
      <div className="grid grid-cols-2 gap-3 px-1">
         <div className="bg-slate-950 p-5 rounded-[32px] text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10"><Users size={40} /></div>
            <p className="text-[8px] font-black text-sky-400 uppercase tracking-widest mb-1">Fleet Size</p>
            <h3 className="text-2xl font-black tracking-tighter">{totalTeamSize} <span className="text-[10px] text-slate-500 uppercase italic">Nodes</span></h3>
         </div>
         <div className="bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-5"><TrendingUp size={40} className="text-emerald-500" /></div>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Yield</p>
            <h3 className="text-2xl font-black tracking-tighter text-emerald-600">Rs {totalCommission}</h3>
         </div>
      </div>

      {/* 2. RESPONSIVE REFERRAL BOX */}
      <div className="bg-white p-6 rounded-[36px] border border-slate-100 shadow-sm mx-1 space-y-4">
         <div className="flex items-center gap-2 px-1">
            <ShieldCheck size={14} className="text-indigo-600" />
            <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest italic">Referral Logic Entry</h4>
         </div>
         <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-grow bg-slate-50 border border-slate-100 rounded-2xl px-4 flex items-center h-12 overflow-hidden">
               <span className="text-[10px] font-bold text-slate-400 truncate">{referralLink}</span>
            </div>
            <button 
              onClick={handleCopy}
              className={clsx(
                "h-12 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 shrink-0",
                copied ? "bg-emerald-500 text-white" : "bg-slate-900 text-white active:scale-95"
              )}
            >
              {copied ? <><CheckCircle2 size={16} /> Copied</> : <><Copy size={16} /> Copy Node</>}
            </button>
         </div>
      </div>

      {/* 3. TIER NAVIGATION (Full Width Segmented Control) */}
      <div className="flex bg-white p-1 rounded-[24px] border border-slate-100 shadow-sm mx-1">
         {[1, 2, 3].map((t) => (
           <button 
            key={t} 
            onClick={() => setActiveTier(t as any)} 
            className={clsx(
              "flex-1 py-3.5 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all",
              activeTier === t ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:bg-slate-50"
            )}
           >
             Tier {t}
           </button>
         ))}
      </div>

      {/* 4. ADAPTIVE LIST AREA */}
      <div className="space-y-2 px-1 min-h-[400px]">
        {loading ? (
           <div className="py-20 text-center text-slate-300 font-black uppercase text-[10px] tracking-[0.3em] animate-pulse">Syncing Fleet Nodes...</div>
        ) : currentList.length > 0 ? (
          <div className="space-y-3">
             {/* Desktop Header */}
             <div className="hidden md:grid grid-cols-4 px-6 text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">
                <span>Partner</span>
                <span>Enrolled</span>
                <span>Active Tier</span>
                <span className="text-right">Yield</span>
             </div>

             {/* Member Items */}
             {currentList.map((member, idx) => (
               <motion.div 
                 key={member.id} 
                 initial={{ opacity: 0, y: 10 }} 
                 animate={{ opacity: 1, y: 0 }} 
                 transition={{ delay: idx * 0.05 }}
                 className="bg-white p-4 md:p-6 rounded-[28px] md:rounded-[32px] border border-slate-100 flex items-center justify-between md:grid md:grid-cols-4 shadow-sm group hover:border-indigo-200 transition-all"
               >
                  <div className="flex items-center gap-3 overflow-hidden">
                     <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-sky-400 font-black italic text-xs shrink-0 shadow-lg border border-slate-800">
                        {member.name?.charAt(0)}
                     </div>
                     <div className="overflow-hidden">
                        <h4 className="font-black text-slate-900 text-[12px] md:text-sm leading-tight uppercase truncate">{member.name}</h4>
                        <p className="text-[7px] md:text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1 truncate">ID: {member.id?.slice(-6)}</p>
                     </div>
                  </div>

                  <div className="hidden md:flex flex-col justify-center">
                     <p className="text-[10px] font-black text-slate-600">{new Date(member.createdAt).toLocaleDateString()}</p>
                  </div>

                  <div className="hidden md:flex flex-col justify-center">
                     <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[8px] font-black uppercase w-fit">{member.currentPlan || 'BASIC'}</span>
                  </div>

                  <div className="text-right">
                     <p className="text-xs md:text-base font-black text-emerald-600 leading-none">
                        + Rs.{activeTier === 1 ? '150' : activeTier === 2 ? '50' : '20'}
                     </p>
                     <p className="text-[7px] font-bold text-slate-300 uppercase tracking-widest mt-1.5 hidden md:block">Commission Node</p>
                  </div>
               </motion.div>
             ))}
          </div>
        ) : (
          <div className="bg-white p-16 rounded-[44px] border-2 border-dashed border-slate-100 text-center flex flex-col items-center">
             <div className="w-16 h-16 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mb-6 shadow-inner"><UserPlus size={32} /></div>
             <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest mb-2">Registry Empty</p>
             <p className="text-[8px] text-slate-300 uppercase tracking-widest max-w-[180px] leading-relaxed">No members detected at Tier {activeTier}. Scale your fleet to unlock passive yield.</p>
          </div>
        )}
      </div>

      <div className="bg-indigo-50 p-6 rounded-[32px] border border-indigo-100 flex items-start gap-4 mx-1">
         <Info size={18} className="text-indigo-500 shrink-0 mt-0.5" />
         <div>
            <h4 className="text-[10px] font-black text-indigo-900 uppercase tracking-tight mb-1 italic">Network Commission Node</h4>
            <p className="text-[8px] text-indigo-700 font-bold leading-relaxed uppercase tracking-wider">
               Tier 1: 15% (Direct) | Tier 2: 5% | Tier 3: 2%
               <br />Rewards are automatically synced when a partner activates an Earning Station.
            </p>
         </div>
      </div>
    </div>
  );
};

export default MyTeam;
