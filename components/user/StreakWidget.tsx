import React from 'react';
import { motion } from 'framer-motion';
import { Zap, CheckCircle2, Trophy, ShieldCheck, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../../context/AuthContext';
import { useConfig } from '../../context/ConfigContext';

const StreakWidget = () => {
  const { user } = useAuth();
  const { config } = useConfig();
  
  const streak = user?.streak || 0;
  const lastClaim = user?.lastCheckIn ? new Date(user.lastCheckIn).toDateString() : null;
  const claimedToday = lastClaim === new Date().toDateString();

  return (
    <div className="bg-white rounded-[28px] border border-slate-100 p-5 shadow-sm relative overflow-hidden h-full flex flex-col justify-between group transition-all">
      <div className="absolute top-0 right-0 p-6 opacity-[0.03] rotate-12 scale-110 group-hover:rotate-45 transition-transform duration-[3s]"><Zap size={80} fill="currentColor" /></div>
      
      <div>
        <div className="flex items-center justify-between mb-6">
           <div className="w-10 h-10 rounded-xl bg-slate-950 text-sky-400 flex items-center justify-center shadow-md"><Zap size={20} fill="currentColor" /></div>
           <div className="text-right">
              <p className="text-[6px] font-black text-slate-300 uppercase tracking-[0.2em] mb-0.5">CURRENT STREAK</p>
              <h3 className="text-lg font-black text-slate-900 italic tracking-tighter">{streak} Days</h3>
           </div>
        </div>

        <div className="space-y-3 mb-6">
           <div className="flex justify-between items-end">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Progress to Day 7</p>
              <span className="text-[9px] font-black text-indigo-600">{Math.round((streak / 7) * 100)}%</span>
           </div>
           <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(streak / 7) * 100}%` }}
                className="h-full bg-indigo-600 rounded-full shadow-lg"
              />
           </div>
        </div>

        <div className="flex gap-1.5 mb-6">
           {[1, 2, 3, 4, 5, 6, 7].map(day => (
             <div key={day} className={clsx(
               "flex-1 h-1 rounded-full",
               day <= streak ? "bg-emerald-500" : "bg-slate-100"
             )} />
           ))}
        </div>
      </div>

      <div className="bg-slate-50/50 rounded-xl p-3 flex items-center justify-between border border-slate-100">
         <div className="flex items-center gap-2.5">
            <div className={clsx(
              "w-7 h-7 rounded-lg flex items-center justify-center text-white",
              claimedToday ? "bg-emerald-500" : "bg-indigo-600"
            )}>
               {claimedToday ? <CheckCircle2 size={14} /> : <Zap size={14} fill="currentColor" />}
            </div>
            <div>
               <p className="text-[6px] font-black text-slate-400 uppercase">Status</p>
               <p className="text-[8px] font-black text-slate-800 uppercase italic">{claimedToday ? 'Synced Today' : 'Pending'}</p>
            </div>
         </div>
         {!claimedToday && (
           <div className="text-[7.5px] font-black text-indigo-600 uppercase flex items-center gap-1">
              Log <ChevronRight size={10} />
           </div>
         )}
      </div>
    </div>
  );
};

export default StreakWidget;