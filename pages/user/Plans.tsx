
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Zap, ArrowRight, Check, Star, TrendingUp, Diamond, ChevronLeft, CheckCircle2, Rocket, Info, Clock, Briefcase, History, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import PlanPurchaseModal from '../../components/plans/PlanPurchaseModal';
import { clsx } from 'clsx';

const PLAN_DATA = [
  { id: 'basic', name: 'BASIC', price: 500, daily: 50, tasks: 5, validity: 30, color: 'bg-slate-400', icon: Star },
  { id: 'standard', name: 'STANDARD', price: 1000, daily: 100, tasks: 10, validity: 30, color: 'bg-emerald-500', icon: Zap },
  { id: 'gold', name: 'GOLD ELITE', price: 1500, daily: 150, tasks: 15, validity: 30, color: 'bg-indigo-500', icon: Award },
  { id: 'diamond', name: 'DIAMOND', price: 5000, daily: 650, tasks: 20, validity: 30, color: 'bg-sky-500', icon: Diamond }
];

const Plans = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState<any>(null);

  const pendingRequest = useMemo(() => {
    const history = (user as any)?.purchaseHistory || [];
    return history.find((h: any) => h.status === 'pending');
  }, [user]);

  const handleActivationSuccess = (plan: any) => {
    confetti({
      particleCount: 200,
      spread: 80,
      origin: { y: 0.7 },
      colors: ['#6366f1', '#10b981', '#f59e0b']
    });
    setShowSuccess(plan);
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-[300] bg-slate-950 flex flex-col items-center justify-center p-6 text-center animate-fade-in w-full overflow-hidden">
         {/* Background Effects */}
         <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/20 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

         <motion.div initial={{ scale: 0.5, opacity: 0, rotate: -10 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} className="space-y-10 max-w-sm w-full relative z-10">
            <div className="relative">
               <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-28 h-28 bg-gradient-to-br from-indigo-600 to-sky-500 rounded-[40px] flex items-center justify-center mx-auto shadow-[0_20px_50px_rgba(99,102,241,0.5)] border-4 border-white/20">
                  <Rocket size={52} className="text-white" />
               </motion.div>
               <div className="absolute -top-4 -right-4"><Sparkles className="text-amber-400" size={32} /></div>
            </div>

            <div className="space-y-3">
               <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">STATION ONLINE!</h2>
               <p className="text-indigo-300 font-bold uppercase tracking-[0.3em] text-[10px]">Membership Synchronized: {showSuccess.name}</p>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] backdrop-blur-xl space-y-4">
               <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-400">Daily Revenue</span>
                  <span className="text-emerald-400">Rs. {showSuccess.daily}</span>
               </div>
               <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-400">Assignment Slots</span>
                  <span className="text-sky-400">{showSuccess.tasks} Daily</span>
               </div>
               <div className="h-[1px] bg-white/10" />
               <p className="text-[8px] text-slate-500 font-bold uppercase italic">Your earning station is now processing live assignments.</p>
            </div>

            <div className="space-y-3 pt-4">
               <button onClick={() => navigate('/user/work')} className="w-full h-16 bg-white text-slate-950 rounded-[28px] font-black text-xs uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3">
                  Start Daily Work <ArrowRight size={18} />
               </button>
               <button onClick={() => navigate('/user/dashboard')} className="w-full h-12 bg-transparent text-slate-500 rounded-[28px] font-black text-[9px] uppercase tracking-widest hover:text-white transition-colors">Return to Dashboard</button>
            </div>
         </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto pb-28 space-y-5 animate-fade-in px-2 overflow-x-hidden">
      <header className="flex items-center justify-between pt-2 px-1">
        <Link to="/user/dashboard" className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 active:scale-90 transition-all">
          <ChevronLeft size={22} />
        </Link>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight italic">Earning <span className="text-indigo-600">Center.</span></h1>
        <div className="flex gap-2">
           <Link to="/user/plans/history" className="w-11 h-11 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 shadow-sm active:scale-90 transition-all">
              <History size={20} />
           </Link>
           <div className="w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center text-amber-400 shadow-lg">
              <Award size={20} />
           </div>
        </div>
      </header>

      {pendingRequest && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-5 bg-amber-50 rounded-[32px] border border-amber-100 flex items-start gap-4 mx-1">
          <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-amber-500 shadow-sm shrink-0"><Clock size={18} className="animate-pulse" /></div>
          <div>
             <p className="text-[10px] font-black uppercase text-amber-800 tracking-widest mb-1 italic">Protocol Pending</p>
             <p className="text-[9px] font-bold text-amber-700 leading-relaxed uppercase">Your {pendingRequest.planId} activation request is being audited. Access will be granted shortly.</p>
          </div>
        </motion.div>
      )}

      <div className="bg-slate-950 p-7 rounded-[40px] shadow-2xl relative overflow-hidden mx-1">
         <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12 scale-150 text-sky-400"><TrendingUp size={100}/></div>
         <div className="relative z-10 flex justify-between items-center">
            <div>
               <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 italic">ACCOUNT LIQUIDITY</p>
               <h2 className="text-4xl font-black text-white italic tracking-tighter leading-none">
                 <span className="text-sm text-sky-400 mr-2 not-italic">Rs.</span>
                 {(user?.balance || 0).toLocaleString()}
               </h2>
            </div>
            <Link to="/user/wallet" className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-sky-400 border border-white/10 active:scale-90 transition-all"><TrendingUp size={24} /></Link>
         </div>
      </div>

      <div className="grid grid-cols-2 gap-3 px-1">
        {PLAN_DATA.map((plan) => {
          const isActive = user?.currentPlan === plan.name;
          const Icon = plan.icon;
          
          return (
            <motion.div 
              key={plan.id}
              className={clsx(
                "bg-white rounded-[40px] p-6 border transition-all relative overflow-hidden group flex flex-col h-[280px]",
                isActive ? "border-emerald-500 bg-emerald-50/10 shadow-xl" : "border-slate-100 shadow-sm hover:border-indigo-100"
              )}
            >
              <div className="flex items-center gap-3 mb-5">
                  <div className={clsx("w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0", plan.color)}>
                    <Icon size={22} />
                  </div>
                  <h3 className="font-black text-slate-900 text-[10px] md:text-xs uppercase italic leading-none truncate tracking-tight">{plan.name} PACK</h3>
              </div>

              <div className="flex-grow space-y-3 mb-8">
                <p className="text-2xl font-black text-slate-900 tracking-tighter italic">Rs {plan.price?.toLocaleString()}</p>
                <div className="space-y-2 pt-2">
                   <div className="flex items-center gap-1.5 text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                      <div className="w-1 h-1 rounded-full bg-emerald-500" /> {plan.tasks} Work Slots
                   </div>
                   <div className="flex items-center gap-1.5 text-[8px] font-black text-emerald-600 uppercase tracking-widest">
                      <TrendingUp size={10} /> Rs {plan.daily} Daily Yield
                   </div>
                </div>
              </div>

              <button
                disabled={isActive || !!pendingRequest}
                onClick={() => setSelectedPlan(plan)}
                className={clsx(
                  "w-full h-12 rounded-[22px] font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg",
                  isActive ? "bg-emerald-500 text-white" : 
                  pendingRequest ? "bg-slate-100 text-slate-300" : "bg-slate-950 text-white"
                )}
              >
                {isActive ? <><Check size={14}/> LIVE STATION</> : pendingRequest ? <><Clock size={12}/> AUDIT</> : 'ACTIVATE'}
              </button>
            </motion.div>
          );
        })}
      </div>

      <div className="bg-indigo-50/50 p-6 rounded-[36px] border border-indigo-100 flex gap-4 mx-1">
         <Info size={22} className="text-indigo-500 shrink-0 mt-1" />
         <p className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest leading-relaxed">
           Identity Node Agreement: New stations automatically replace current ones. Validity is fixed at 30 production cycles.
         </p>
      </div>

      <PlanPurchaseModal 
        isOpen={!!selectedPlan} 
        onClose={() => setSelectedPlan(null)} 
        plan={selectedPlan} 
        onSuccess={handleActivationSuccess}
      />
    </div>
  );
};

export default Plans;
