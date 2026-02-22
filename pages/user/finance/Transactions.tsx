import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, Loader2, Zap, BarChart3, Activity, 
  ArrowRight, CheckCircle2, FileText, MinusCircle, 
  PlusCircle, TrendingUp, Clock, Search, ChevronLeft,
  CalendarDays, Target, XCircle, AlertCircle, Briefcase,
  History as HistoryIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../utils/api';

const TaskLedger = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    if (user?.workHistory) {
      setHistory(user.workHistory);
    }
    setLoading(false);
  }, [user?.workHistory]);

  const stats = useMemo(() => {
    const total = history.length;
    const claimed = history.filter(s => s.status === 'approved').length;
    const pending = history.filter(s => s.status === 'pending').length;
    const totalYield = history
      .filter(s => s.status === 'approved')
      .reduce((sum, s) => sum + Number(s.rewardAmount || 0), 0);

    return { total, claimed, pending, totalYield };
  }, [history]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 md:space-y-8 pb-32 animate-fade-in px-1">
      
      <header className="flex items-center justify-between pt-4 px-2">
        <Link to="/user/dashboard" className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 active:scale-90 transition-all">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Work <span className="text-indigo-600">History.</span></h1>
        <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-sky-400 shadow-xl border border-white/5 shrink-0">
          <HistoryIcon size={20} />
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-2">
         <StatBlock label="Assignments" val={stats.total} icon={Briefcase} color="text-indigo-500" bg="bg-indigo-50" />
         <StatBlock label="Audited" val={stats.claimed} icon={CheckCircle2} color="text-emerald-500" bg="bg-emerald-50" />
         <StatBlock label="In Queue" val={stats.pending} icon={Clock} color="text-amber-500" bg="bg-amber-50" />
         <StatBlock label="Yield Value" val={`Rs ${stats.totalYield}`} icon={TrendingUp} color="text-sky-500" bg="bg-sky-50" />
      </div>

      <div className="space-y-4 px-2 min-h-[500px]">
        <div className="flex justify-between items-center px-3 mb-4">
           <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] italic flex items-center gap-2">
              <Activity size={12} className="text-indigo-500" /> Dispatch Registry
           </h3>
           <p className="text-[7px] font-bold text-slate-300 uppercase tracking-widest">Identity ID: {user?.id?.slice(-8)}</p>
        </div>

        {loading ? (
          <div className="py-24 text-center flex flex-col items-center gap-3">
             <Loader2 size={32} className="animate-spin text-indigo-500" />
             <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">Syncing Protocol...</p>
          </div>
        ) : history.length > 0 ? (
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden p-2">
            {history.map((entry, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 8 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: idx * 0.03 }} 
                className="p-5 flex items-center justify-between group hover:bg-slate-50 transition-all rounded-[28px]"
              >
                 <div className="flex items-center gap-4">
                    <div className={clsx(
                      "w-11 h-11 md:w-12 md:h-12 rounded-[16px] flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110",
                      entry.status === 'approved' ? "bg-emerald-50 text-emerald-600" : 
                      entry.status === 'pending' ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"
                    )}>
                       {entry.status === 'approved' ? <CheckCircle2 size={24} /> : 
                        entry.status === 'pending' ? <Clock size={24} /> : <XCircle size={24} />}
                    </div>
                    <div className="overflow-hidden">
                       <h4 className="font-black text-slate-900 text-[11px] md:text-[12px] uppercase leading-none mb-1.5 truncate max-w-[150px] md:max-w-[250px] italic">{entry.taskTitle}</h4>
                       <div className="flex items-center gap-2">
                          <span className="text-[7px] md:text-[8px] font-bold text-slate-400 uppercase tracking-widest">{new Date(entry.submissionTime).toLocaleDateString()}</span>
                          <span className="text-slate-200 text-[7px]">•</span>
                          <span className="text-[7px] md:text-[8px] font-black text-indigo-400 uppercase italic">Node: {entry.nodeId?.slice(-8)}</span>
                       </div>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className={clsx("font-black text-sm md:text-base italic mb-1 leading-none", entry.status === 'approved' ? "text-emerald-600" : "text-slate-400")}>
                      Rs {entry.rewardAmount}
                    </p>
                    <span className={clsx(
                      "text-[7px] font-black uppercase px-2 py-0.5 rounded-md border",
                      entry.status === 'approved' ? "bg-green-50 text-green-600 border-green-100" :
                      entry.status === 'pending' ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-rose-50 text-rose-600 border-rose-100"
                    )}>
                      {entry.status}
                    </span>
                 </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-32 text-center flex flex-col items-center opacity-30 bg-white rounded-[40px] border-2 border-dashed border-slate-100">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-5">
                <FileText size={32} className="text-slate-200" />
             </div>
             <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.4em]">Registry Buffer Empty</p>
          </div>
        )}
      </div>

      <div className="p-8 bg-indigo-50/50 rounded-[44px] border border-indigo-100 flex flex-col md:flex-row items-center gap-6 mx-1">
         <ShieldCheck size={32} className="text-indigo-600 shrink-0" />
         <div>
            <h4 className="text-base font-black text-indigo-900 uppercase italic mb-1">Audit Protocol</h4>
            <p className="text-[9px] text-indigo-700 font-bold uppercase tracking-widest leading-relaxed">
               All work packets are verified by our manual compliance hub within 24 hours. Once authorized, the yield is instantly synchronized with your primary wallet.
            </p>
         </div>
      </div>
    </div>
  );
};

const StatBlock = ({ label, val, icon: Icon, color, bg }: any) => (
  <div className="bg-white p-4 md:p-5 rounded-[28px] md:rounded-[32px] border border-slate-100 shadow-sm flex flex-col gap-3 group hover:border-indigo-100 transition-all">
     <div className={clsx("w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 shadow-inner", bg, color)}>
        <Icon size={18} />
     </div>
     <div>
        <p className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 italic leading-none">{label}</p>
        <h4 className="text-lg md:text-xl font-black text-slate-900 italic tracking-tighter leading-none">{val}</h4>
     </div>
  </div>
);

export default TaskLedger;