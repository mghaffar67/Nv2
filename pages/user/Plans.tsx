
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Zap, ArrowRight, Check, Star, TrendingUp, Diamond, ChevronLeft, CheckCircle2, Rocket, Info, Clock, Briefcase } from 'lucide-react';
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
               <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">SUCCESS!</h2>
               <p className="text-indigo-400 font-bold uppercase tracking-widest text-[10px]">Your {showSuccess.name} plan is now active.</p>
            </div>
            <button onClick={() => navigate('/user/dashboard')} className="w-full h-16 bg-white text-slate-950 rounded-[24px] font-black text-xs uppercase tracking-[0.3em] active:scale-95 transition-all">Go to Home</button>
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
        <h1 className="text-2xl font-black text-slate-900 tracking-tight italic">Earning <span className="text-indigo-600">Plans.</span></h1>
        <div className="w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center text-amber-400 shadow-lg"><Award size={20} /></div>
      </header>

      {pendingRequest && (
        <div className="p-4 bg-amber-50 rounded-[28px] border border-amber-100 flex items-center gap-3 mx-1">
          <Clock size={18} className="text-amber-500 animate-pulse" />
          <p className="text-[10px] font-black uppercase text-amber-800 tracking-widest">Plan upgrade request is being reviewed.</p>
        </div>
      )}

      <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 flex justify-between items-center shadow-inner mx-1">
         <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5 italic">WALLET BALANCE</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight leading-none italic">Rs. {(user?.balance || 0).toLocaleString()}</p>
         </div>
         <Link to="/user/wallet" className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100 active:scale-90 transition-all"><TrendingUp size={18} /></Link>
      </div>

      <div className="grid grid-cols-2 gap-3 px-1">
        {PLAN_DATA.map((plan) => {
          const isActive = user?.currentPlan === plan.name;
          const Icon = plan.icon;
          
          return (
            <motion.div 
              key={plan.id}
              className={clsx(
                "bg-white rounded-[32px] p-5 md:p-6 border transition-all relative overflow-hidden group flex flex-col",
                isActive ? "border-emerald-500 bg-emerald-50/10 shadow-lg" : "border-slate-100 shadow-sm hover:border-indigo-100"
              )}
            >
              <div className="flex items-center gap-3 mb-4">
                  <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg shrink-0", plan.color)}>
                    <Icon size={20} />
                  </div>
                  <h3 className="font-black text-slate-900 text-xs md:text-sm uppercase italic leading-none truncate">{plan.name}</h3>
              </div>

              <div className="flex-grow space-y-2 mb-6">
                <p className="text-2xl font-black text-slate-900 tracking-tighter italic">Rs {plan.price}</p>
                <div className="space-y-1">
                   <div className="flex items-center gap-1.5 text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                      <CheckCircle2 size={10} className="text-emerald-500" /> {plan.tasks} Work/Day
                   </div>
                   <div className="flex items-center gap-1.5 text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                      <CheckCircle2 size={10} className="text-emerald-500" /> Rs {plan.daily} Profit
                   </div>
                </div>
              </div>

              <button
                disabled={isActive || !!pendingRequest}
                onClick={() => setSelectedPlan(plan)}
                className={clsx(
                  "w-full h-12 rounded-2xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-lg",
                  isActive ? "bg-emerald-500 text-white" : 
                  pendingRequest ? "bg-slate-100 text-slate-300" : "bg-slate-900 text-white"
                )}
              >
                {isActive ? 'ACTIVE' : pendingRequest ? 'PENDING' : 'SELECT'}
              </button>
            </motion.div>
          );
        })}
      </div>

      <div className="p-5 bg-indigo-50/50 rounded-[32px] border border-indigo-100 flex gap-4 mx-1">
         <Info size={18} className="text-indigo-500 shrink-0 mt-1" />
         <p className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest leading-relaxed">
           Important: Selecting a new plan will replace your current one. All plans stay active for 30 days.
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
