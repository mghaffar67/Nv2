import React, { useState, useEffect, useMemo } from 'react';
import { 
  Copy, Users, ChevronRight, CheckCircle2, 
  ArrowRight, TrendingUp, Activity, Network, 
  ShieldCheck, RefreshCw, Target, Award, Sparkles, Layers,
  Calendar, Zap, UserCheck, ShieldAlert, BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useConfig } from '../../context/ConfigContext';
import { api } from '../../utils/api';
import { clsx } from 'clsx';

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
      console.error("Registry failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTeam(); }, [user?.referralCode]);

  const referralLink = `${window.location.origin}/#/register?ref=${user?.referralCode || 'NODE'}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentList = useMemo(() => {
    if (activeTier === 1) return teamData.t1;
    if (activeTier === 2) return teamData.t2;
    return teamData.t3;
  }, [activeTier, teamData]);

  return (
    <div className="w-full max-w-4xl mx-auto pb-32 space-y-5 animate-fade-in px-1">
      
      {/* Executive Referral Link */}
      <div className="bg-slate-950 p-5 md:p-6 rounded-[32px] relative overflow-hidden shadow-xl border border-white/5">
         <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 scale-125 text-indigo-400 pointer-events-none"><Network size={100} /></div>
         <div className="relative z-10 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
               <div>
                  <h1 className="text-xl md:text-2xl font-black italic tracking-tighter uppercase text-white leading-none">Network <span className="text-indigo-500">Node.</span></h1>
                  <p className="text-slate-500 text-[8px] uppercase tracking-widest mt-1.5 font-bold italic">Identity: {user?.referralCode}</p>
               </div>
               <div className="flex items-center gap-3 bg-white/5 p-2 px-4 rounded-xl border border-white/5 backdrop-blur-md">
                  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md"><Network size={16} /></div>
                  <div>
                     <p className="text-[6px] font-black text-slate-500 uppercase tracking-widest">Global Reach</p>
                     <p className="text-lg font-black text-white italic">{teamData.t1.length + teamData.t2.length + teamData.t3.length}</p>
                  </div>
               </div>
            </div>

            <div className="bg-white/5 border border-white/5 rounded-2xl p-3 space-y-2">
               <p className="text-[6px] font-black text-indigo-400 uppercase tracking-[0.2em] ml-2 italic">Invitation Gateway</p>
               <div className="flex items-center gap-2 bg-slate-900 border border-white/5 rounded-xl p-1 pl-3">
                  <span className="flex-1 text-[8px] font-mono font-bold text-slate-500 truncate">{referralLink}</span>
                  <button 
                    onClick={copyToClipboard}
                    className={clsx(
                      "h-9 px-6 rounded-lg font-black text-[8px] uppercase tracking-widest transition-all flex items-center gap-2 active:scale-95 shrink-0 shadow-lg",
                      copied ? "bg-emerald-600 text-white" : "bg-indigo-600 text-white hover:bg-indigo-500"
                    )}
                  >
                     {copied ? <CheckCircle2 size={12}/> : <Copy size={12} />}
                     {copied ? 'Linked' : 'Copy'}
                  </button>
               </div>
            </div>
         </div>
      </div>

      {/* Network Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
         <SmallStat label="Tier 1 Yield" val={`Rs ${(teamData.t1.length * 150).toLocaleString()}`} icon={TrendingUp} color="text-emerald-500" />
         <SmallStat label="Total Indirects" val={teamData.t2.length + teamData.t3.length} icon={Layers} color="text-indigo-500" />
         <SmallStat label="Active nodes" val={teamData.t1.filter(u => u.currentPlan !== 'None').length} icon={Zap} color="text-sky-500" />
         <SmallStat label="Pulse Status" val="Healthy" icon={Activity} color="text-amber-500" />
      </div>

      {/* Tier Selection */}
      <div className="bg-white p-1 rounded-2xl border border-slate-100 shadow-sm flex gap-1">
         {[1, 2, 3].map(t => (
           <button 
            key={t} onClick={() => setActiveTier(t as any)}
            className={clsx(
              "flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
              activeTier === t ? "bg-slate-950 text-white shadow-md" : "text-slate-400 hover:text-slate-600"
            )}
           >
             Tier {t} <span className="ml-1 opacity-40">({t === 1 ? teamData.t1.length : t === 2 ? teamData.t2.length : teamData.t3.length})</span>
           </button>
         ))}
      </div>

      {/* Member Ledger */}
      <div className="min-h-[300px]">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center gap-3">
             <RefreshCw className="animate-spin text-indigo-500" size={24}/>
             <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Syncing Nodes...</p>
          </div>
        ) : currentList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
             {currentList.map((member, i) => (
               <motion.div 
                 key={member.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.02 }}
                 className="bg-white p-4 rounded-[24px] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-indigo-200 transition-all"
               >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-indigo-600 italic text-base shrink-0 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                        {member.name.charAt(0)}
                    </div>
                    <div className="overflow-hidden">
                        <h4 className="font-black text-slate-900 text-[10px] uppercase truncate leading-none mb-1">{member.name}</h4>
                        <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest italic truncate flex items-center gap-1">
                            <Calendar size={8} /> Joined {new Date(member.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={clsx(
                        "px-2 py-0.5 rounded-md text-[6px] font-black uppercase tracking-widest border",
                        member.currentPlan !== 'None' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-100"
                    )}>
                        {member.currentPlan || 'Inactive'} Station
                    </span>
                    <p className="text-[6px] font-black text-slate-300 uppercase mt-1">ID: #{member.id?.slice(-4)}</p>
                  </div>
               </motion.div>
             ))}
          </div>
        ) : (
          <div className="py-24 text-center opacity-30 flex flex-col items-center bg-white rounded-[32px] border-2 border-dashed border-slate-100">
             <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-4 shadow-inner"><Users size={24} /></div>
             <p className="text-[8px] font-black uppercase tracking-[0.3em]">No Associates in Tier {activeTier}</p>
          </div>
        )}
      </div>

      {/* Bonus Banner */}
      <div className="bg-indigo-600 p-6 rounded-[32px] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 scale-125 pointer-events-none text-white"><Award size={80} /></div>
         <div className="relative z-10 space-y-1 text-center md:text-left">
            <h3 className="text-lg font-black italic uppercase tracking-tighter leading-none">Master Networker.</h3>
            <p className="text-[8px] font-bold text-indigo-100 uppercase tracking-widest max-w-xs opacity-90 leading-relaxed">Refer 10 Diamond nodes for an instant Rs. 2000 cash bonus.</p>
         </div>
         <button className="relative z-10 h-11 px-8 bg-white text-indigo-600 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">
            View Bonus Path
         </button>
      </div>
    </div>
  );
};

const SmallStat = ({ label, val, icon: Icon, color }: any) => (
  <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
    <div className={clsx("w-8 h-8 rounded-lg flex items-center justify-center bg-slate-50 shrink-0 shadow-inner", color)}>
       <Icon size={14} />
    </div>
    <div className="overflow-hidden">
       <p className="text-[6px] font-black text-slate-400 uppercase leading-none mb-1 truncate">{label}</p>
       <p className="text-xs font-black text-slate-900 italic tracking-tight truncate">{val}</p>
    </div>
  </div>
);

export default MyTeam;