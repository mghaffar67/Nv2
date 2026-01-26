
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
import { useConfig } from '../../../context/ConfigContext';
import { api } from '../../../utils/api';

const TaskLedger = () => {
  const { user } = useAuth();
  const { config } = useConfig();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTaskHistory = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      // Fetching work submissions instead of generic finance history
      const tasks = await api.get('/work/tasks');
      // In a real app, we'd have a specific endpoint for history, 
      // here we use the submissions array from the user node
      setSubmissions(user.workSubmissions || []);
    } catch (err) {
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTaskHistory(); }, [user?.id]);

  const stats = useMemo(() => {
    const total = submissions.length;
    const claimed = submissions.filter(s => s.status === 'approved').length;
    const unclaimed = submissions.filter(s => s.status === 'pending').length;
    const lost = submissions.filter(s => s.status === 'rejected').length;
    const totalEarnings = submissions
      .filter(s => s.status === 'approved')
      .reduce((sum, s) => sum + Number(s.reward), 0);

    return { total, claimed, unclaimed, lost, totalEarnings };
  }, [submissions]);

  return (
    <div className="w-full max-w-full space-y-6 pb-24 animate-fade-in px-1">
      
      <header className="flex items-center justify-between pt-2 px-1">
        <Link to="/user/dashboard" className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 active:scale-90 transition-all">
          <ChevronLeft size={22} />
        </Link>
        <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase italic">Task <span className="text-indigo-600">Ledger.</span></h1>
        <div className="w-11 h-11 rounded-xl bg-slate-950 flex items-center justify-center text-sky-400 shadow-lg border border-white/5">
          <HistoryIcon size={20} />
        </div>
      </header>

      {/* ADVANCED TASK STATS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-1">
         <StatBlock label="Total Assignments" val={stats.total} icon={Briefcase} color="text-indigo-500" bg="bg-indigo-50" />
         <StatBlock label="Claims Approved" val={stats.claimed} icon={CheckCircle2} color="text-emerald-500" bg="bg-emerald-50" />
         <StatBlock label="Unclaimed Nodes" val={stats.unclaimed} icon={Clock} color="text-amber-500" bg="bg-amber-50" />
         <StatBlock label="Lost / Skipped" val={stats.lost} icon={XCircle} color="text-rose-500" bg="bg-rose-50" />
      </div>

      <div className="bg-slate-950 p-7 rounded-[40px] shadow-2xl relative overflow-hidden mx-1">
         <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12 scale-150 text-emerald-400"><TrendingUp size={100}/></div>
         <div className="relative z-10 flex justify-between items-center">
            <div>
               <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 italic">LIFETIME TASK YIELD</p>
               <h2 className="text-4xl font-black text-white italic tracking-tighter leading-none">
                 <span className="text-sm text-emerald-400 mr-2 not-italic">Rs.</span>
                 {stats.totalEarnings.toLocaleString()}
               </h2>
            </div>
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-emerald-400 border border-white/10 shadow-inner">
               <Zap size={24} fill="currentColor" />
            </div>
         </div>
      </div>

      {/* TASK AUDIT LIST */}
      <div className="space-y-3 px-1 min-h-[400px]">
        <div className="flex justify-between items-center px-4 mb-2">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic flex items-center gap-2">
              <Activity size={14} className="text-indigo-500" /> Audit Trail
           </h3>
           <button onClick={fetchTaskHistory} className="text-[9px] font-black text-indigo-600 uppercase">Refresh Node</button>
        </div>

        {loading ? (
          <div className="py-24 text-center flex flex-col items-center gap-3">
             <Loader2 size={32} className="animate-spin text-indigo-500" />
             <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Querying Ledger...</p>
          </div>
        ) : submissions.length > 0 ? (
          submissions.map((sub, idx) => (
            <motion.div 
              key={sub.id} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: idx * 0.03 }} 
              className="bg-white p-5 rounded-[30px] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-indigo-100 transition-all"
            >
               <div className="flex items-center gap-4">
                  <div className={clsx(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110",
                    sub.status === 'approved' ? "bg-emerald-50 text-emerald-600" : 
                    sub.status === 'pending' ? "bg-amber-50 text-amber-500" : "bg-rose-50 text-rose-500"
                  )}>
                     {sub.status === 'approved' ? <CheckCircle2 size={22} /> : 
                      sub.status === 'pending' ? <Clock size={22} /> : <XCircle size={22} />}
                  </div>
                  <div className="overflow-hidden">
                     <h4 className="font-black text-slate-800 text-xs uppercase leading-none mb-2 truncate max-w-[150px]">{sub.taskTitle}</h4>
                     <div className="flex items-center gap-2">
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{new Date(sub.timestamp).toLocaleDateString()}</span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full" />
                        <span className="text-[8px] font-black text-indigo-400 uppercase">AUDIT: {sub.id?.slice(-6)}</span>
                     </div>
                  </div>
               </div>
               <div className="text-right">
                  <p className={clsx("font-black text-sm italic mb-1", sub.status === 'approved' ? "text-emerald-600" : "text-slate-400")}>
                    Rs {sub.reward}
                  </p>
                  <span className={clsx(
                    "text-[7px] font-black uppercase px-2 py-0.5 rounded-md border",
                    sub.status === 'approved' ? "bg-green-50 text-green-600 border-green-100" :
                    sub.status === 'pending' ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-rose-50 text-rose-600 border-rose-100"
                  )}>
                    {sub.status}
                  </span>
               </div>
            </motion.div>
          ))
        ) : (
          <div className="py-24 text-center flex flex-col items-center opacity-40">
             <div className="w-16 h-16 bg-slate-100 rounded-[24px] flex items-center justify-center mb-4">
                <FileText size={32} className="text-slate-300" />
             </div>
             <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">No task history synchronized</p>
          </div>
        )}
      </div>

      <div className="bg-indigo-50/50 p-6 rounded-[36px] border border-indigo-100 flex items-start gap-4 mx-1">
         <ShieldCheck size={24} className="text-indigo-600 shrink-0" />
         <p className="text-[9px] font-bold text-indigo-700 uppercase tracking-widest leading-relaxed">
            Every task submission is audited by our manual review node to ensure platform integrity and payout accuracy.
         </p>
      </div>
    </div>
  );
};

const StatBlock = ({ label, val, icon: Icon, color, bg }: any) => (
  <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-3 group">
     <div className={clsx("w-8 h-8 rounded-xl flex items-center justify-center transition-all group-hover:scale-110", bg, color)}>
        <Icon size={16} />
     </div>
     <div>
        <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <h4 className="text-xl font-black text-slate-900 italic tracking-tighter leading-none">{val}</h4>
     </div>
  </div>
);

export default TaskLedger;
