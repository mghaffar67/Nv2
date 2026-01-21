
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Zap, ArrowRight, Check, Star, TrendingUp, Diamond, Loader2, ChevronLeft, CheckCircle2, Rocket, Info, Clock, AlertTriangle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import PlanPurchaseModal from '../../components/plans/PlanPurchaseModal';
import { clsx } from 'clsx';

const PLAN_DATA = [
  { id: 'basic', name: 'BASIC', price: 500, daily: 50, tasks: 5, validity: 30, features: ['5 Tasks/Day', 'Email Support'], color: 'bg-slate-400', icon: Star },
  { id: 'standard', name: 'STANDARD', price: 1000, daily: 100, tasks: 10, validity: 30, features: ['10 Tasks/Day', 'Priority Support'], color: 'bg-emerald-500', icon: Zap },
  { id: 'gold', name: 'GOLD ELITE', price: 1500, daily: 150, tasks: 15, validity: 30, features: ['15 Tasks/Day', 'WhatsApp Group'], color: 'bg-indigo-500', icon: Award, recommended: true },
  { id: 'diamond', name: 'DIAMOND', price: 5000, daily: 650, tasks: 20, validity: 30, features: ['20 Tasks/Day', '24/7 Priority'], color: 'bg-sky-500', icon: Diamond }
];

const Plans = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState<any>(null);

  // Check for pending plan requests
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
               <p className="text-indigo-400 font-bold uppercase tracking-widest text-[9px]">Your {showSuccess.name} station is now LIVE.</p>
               <p className="text-slate-500 text-[11px] font-medium leading-relaxed px-6">Your account is now synced with the main system. You can start daily tasks for yield.</p>
            </div>
            <button 
              onClick={() => navigate('/user/dashboard')}
              className="w-full h-16 bg-white text-slate-950 rounded-[24px] font-black text-xs uppercase tracking-[0.3em] shadow-xl active:scale-95 transition-all"
            >
               Enter Portal
            </button>
         </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full pb-28 space-y-5 animate-fade-in px-1 overflow-x-hidden">
      <header className="flex items-center justify-between pt-2 px-2 w-full">
        <Link to="/user/dashboard" className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 active:scale-90 transition-all">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Membership <span className="text-indigo-600">Hub</span></h1>
        <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-amber-400 shadow-lg">
          <Award size={18} />
        </div>
      </header>

      {/* PENDING REQUEST NOTIFICATION */}
      <AnimatePresence>
        {pendingRequest && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="mx-2 p-5 bg-amber-50 rounded-[28px] border border-amber-100 shadow-sm flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-amber-500 shadow-sm shrink-0">
               <Clock size={24} className="animate-pulse" />
            </div>
            <div className="overflow-hidden">
               <h4 className="text-[10px] font-black text-amber-900 uppercase tracking-tight">Request Processing</h4>
               <p className="text-[8px] font-bold text-amber-700 uppercase tracking-widest mt-1">Your {pendingRequest.planId} Station activation is in Review by team.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-2 bg-slate-50 p-6 rounded-[28px] border border-slate-100 flex justify-between items-center shadow-inner">
         <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic mb-0.5">Wallet Funds</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight leading-none italic">Rs. {(user?.balance || 0).toLocaleString()}</p>
         </div>
         <Link to="/user/wallet" className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100 active:scale-90 transition-all">
            <TrendingUp size={18} />
         </Link>
      </div>

      <div className="mx-2 bg-blue-50 p-4 rounded-2xl border border-blue-100 flex gap-3">
         <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
         <p className="text-[8px] font-bold text-blue-700 uppercase tracking-widest leading-relaxed">
           Upgrading to a new Station will immediately reset your daily task quota and extend your validity for 30 more days.
         </p>
      </div>

      <div className="grid grid-cols-1 gap-4 px-2 w-full">
        {PLAN_DATA.map((plan) => {
          const isActive = user?.currentPlan === plan.name;
          const Icon = plan.icon;
          
          return (
            <motion.div 
              key={plan.id}
              className={clsx(
                "bg-white rounded-[32px] p-6 border transition-all relative overflow-hidden group w-full",
                isActive ? "border-emerald-500 bg-emerald-50/10" : "border-slate-100 shadow-sm hover:border-indigo-100"
              )}
            >
              <div className="flex items-center justify-between mb-8 w-full">
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xl shrink-0", plan.color)}>
                    <Icon size={24} />
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="font-black text-slate-900 text-base uppercase italic leading-none truncate">{plan.name}</h3>
                    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2 italic">{plan.tasks} TASKS / DAY</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[8px] font-black text-indigo-500 uppercase tracking-widest">Cost</p>
                  <p className="text-lg font-black text-slate-900">Rs {plan.price}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-50">
                <div className="flex items-center gap-2 overflow-hidden">
                   <div className="w-3.5 h-3.5 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                       <Check size={8} className="text-emerald-600" strokeWidth={4} />
                    </div>
                   <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tight truncate">Rs {plan.daily}/Day</span>
                </div>
                <div className="flex items-center gap-2 overflow-hidden">
                   <div className="w-3.5 h-3.5 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                       <Check size={8} className="text-emerald-600" strokeWidth={4} />
                    </div>
                   <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tight truncate">{plan.tasks} Tasks</span>
                </div>
              </div>

              <button
                disabled={isActive || !!pendingRequest}
                onClick={() => setSelectedPlan(plan)}
                className={clsx(
                  "w-full h-14 rounded-[22px] font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl",
                  isActive ? "bg-emerald-500 text-white" : 
                  pendingRequest ? "bg-slate-100 text-slate-300 border-slate-100 cursor-not-allowed" : "bg-slate-950 text-white"
                )}
              >
                {isActive ? (
                  <><CheckCircle2 size={18} /> ACTIVE STATION</>
                ) : pendingRequest ? (
                  <><Clock size={18} /> REQUEST FILED</>
                ) : (
                  <>ACTIVATE STATION <ArrowRight size={18} /></>
                )}
              </button>
            </motion.div>
          );
        })}
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
