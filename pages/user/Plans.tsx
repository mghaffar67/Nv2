
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Zap, ArrowRight, Check, Star, TrendingUp, Diamond, ChevronLeft, CheckCircle2, Rocket, Info, Clock } from 'lucide-react';
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
      <div className="fixed inset-0 z-[300] bg-slate-950 flex flex-col items-center justify-center p-6 text-center animate-fade-in w-full">
         <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-10 max-w-sm w-full">
            <div className="w-24 h-24 bg-indigo-600 rounded-[35px] flex items-center justify-center mx-auto shadow-2xl border-4 border-white/10">
               <Rocket size={48} className="text-white" />
            </div>
            <div className="space-y-4">
               <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">CONGRATULATIONS!</h2>
               <p className="text-indigo-400 font-bold uppercase tracking-widest text-[9px]">Your {showSuccess.name} hub is now live.</p>
            </div>
            <button onClick={() => navigate('/user/dashboard')} className="w-full h-16 bg-white text-slate-950 rounded-[24px] font-black text-xs uppercase tracking-[0.3em] active:scale-95 transition-all">Enter Portal</button>
         </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto pb-28 space-y-5 animate-fade-in px-2 overflow-x-hidden">
      <header className="flex items-center justify-between pt-2 px-1">
        <Link to="/user/dashboard" className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 active:scale-90 transition-all">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">Earning <span className="text-indigo-600">Hubs.</span></h1>
        <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-amber-400 shadow-lg"><Award size={18} /></div>
      </header>

      {pendingRequest && (
        <div className="p-4 bg-amber-50 rounded-[24px] border border-amber-100 flex items-center gap-3 mx-1">
          <Clock size={18} className="text-amber-500 animate-pulse" />
          <p className="text-[8px] font-black uppercase text-amber-800 tracking-widest">Station Upgrade Request in Audit Queue.</p>
        </div>
      )}

      <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 flex justify-between items-center shadow-inner mx-1">
         <div>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic mb-0.5">Wallet Balance</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight leading-none italic">Rs. {(user?.balance || 0).toLocaleString()}</p>
         </div>
         <Link to="/user/wallet" className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100 active:scale-90 transition-all"><TrendingUp size={18} /></Link>
      </div>

      {/* Grid: 2 per row for Attractive & Small look */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3 px-1">
        {PLAN_DATA.map((plan) => {
          const isActive = user?.currentPlan === plan.name;
          const Icon = plan.icon;
          
          return (
            <motion.div 
              key={plan.id}
              className={clsx(
                "bg-white rounded-[32px] p-4 md:p-6 border transition-all relative overflow-hidden group flex flex-col",
                isActive ? "border-emerald-500 bg-emerald-50/10 shadow-lg shadow-emerald-50" : "border-slate-100 shadow-sm hover:border-indigo-100"
              )}
            >
              <div className="flex items-center gap-3 mb-4">
                  <div className={clsx("w-9 h-9 md:w-11 md:h-11 rounded-xl flex items-center justify-center text-white shadow-lg shrink-0", plan.color)}>
                    <Icon size={18} className="md:size-20" />
                  </div>
                  <h3 className="font-black text-slate-900 text-[10px] md:text-sm uppercase italic leading-none truncate">{plan.name}</h3>
              </div>

              <div className="flex-grow space-y-1 mb-4">
                <p className="text-[14px] md:text-xl font-black text-slate-900">Rs {plan.price}</p>
                <div className="flex items-center gap-1 text-[7px] md:text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                   <Check size={8} className="text-emerald-500" strokeWidth={4} /> {plan.tasks} Daily Tasks
                </div>
                <div className="flex items-center gap-1 text-[7px] md:text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                   <Check size={8} className="text-emerald-500" strokeWidth={4} /> Rs {plan.daily} Profit
                </div>
              </div>

              <button
                disabled={isActive || !!pendingRequest}
                onClick={() => setSelectedPlan(plan)}
                className={clsx(
                  "w-full h-10 md:h-12 rounded-xl md:rounded-2xl font-black text-[7px] md:text-[9px] uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all active:scale-95",
                  isActive ? "bg-emerald-500 text-white shadow-lg shadow-emerald-100" : 
                  pendingRequest ? "bg-slate-100 text-slate-300" : "bg-slate-950 text-white shadow-xl shadow-slate-100"
                )}
              >
                {isActive ? 'ACTIVE' : pendingRequest ? 'PENDING' : 'ACTIVATE'}
              </button>
            </motion.div>
          );
        })}
      </div>

      <div className="p-4 bg-indigo-50/50 rounded-[24px] border border-indigo-100 flex gap-3 mx-1">
         <Info size={14} className="text-indigo-500 shrink-0 mt-0.5" />
         <p className="text-[7px] font-bold text-indigo-700 uppercase tracking-widest leading-relaxed">
           Upgrading resets your task quota. All hubs valid for 30 days of active mining.
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
