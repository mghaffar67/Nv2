import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Award, Zap, Star, TrendingUp, Diamond, ChevronLeft, CheckCircle2, History, Info } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import PlanPurchaseModal from '../../components/plans/PlanPurchaseModal';
import { clsx } from 'clsx';

const PLAN_DATA = [
  { id: 'basic', name: 'BASIC', price: 500, daily: 50, tasks: 5, color: 'bg-slate-400', icon: Star },
  { id: 'standard', name: 'STANDARD', price: 1000, daily: 100, tasks: 10, color: 'bg-emerald-500', icon: Zap },
  { id: 'gold', name: 'GOLD ELITE', price: 1500, daily: 150, tasks: 15, color: 'bg-indigo-500', icon: Award },
  { id: 'diamond', name: 'DIAMOND', price: 5000, daily: 650, tasks: 20, color: 'bg-sky-500', icon: Diamond }
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
      particleCount: 150,
      spread: 70,
      origin: { y: 0.7 }
    });
    setShowSuccess(plan);
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-[300] bg-white flex flex-col items-center justify-center p-6 text-center animate-fade-in">
         <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-6 max-w-sm">
            <div className="w-24 h-24 bg-emerald-500 rounded-[35px] flex items-center justify-center mx-auto shadow-2xl">
               <CheckCircle2 size={48} className="text-white" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 uppercase italic">SUCCESS!</h2>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest leading-relaxed">
              Your {showSuccess.name} Membership is active. Proceed to daily work to start earning.
            </p>
            <button onClick={() => navigate('/user/work')} className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all">Start Daily Work</button>
         </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto pb-28 space-y-6 animate-fade-in px-2">
      {/* Header */}
      <header className="flex items-center justify-between pt-4 px-1">
        <Link to="/user/dashboard" className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 active:scale-90 transition-all">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-lg font-black text-slate-800 uppercase italic tracking-tight">System <span className="text-indigo-600">Membership.</span></h1>
        <Link to="/user/plans/history" className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 active:scale-90 transition-all">
          <History size={20} />
        </Link>
      </header>

      {/* Account Balance Card */}
      <div className="bg-[#0b0e14] p-8 rounded-[40px] shadow-2xl relative overflow-hidden mx-1">
         <div className="relative z-10">
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 italic">ACCOUNT BALANCE</p>
            <div className="flex items-baseline">
              <span className="text-sky-400 font-black text-lg mr-2 italic">Rs.</span>
              <h2 className="text-4xl font-black text-white italic tracking-tighter leading-none">
                {(user?.balance || 0).toLocaleString()}
              </h2>
              <div className="ml-auto w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-sky-400">
                <TrendingUp size={20} />
              </div>
            </div>
         </div>
      </div>

      {/* Plan Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-1">
        {PLAN_DATA.map((plan, idx) => {
          const isActive = user?.currentPlan === plan.name;
          const Icon = plan.icon;
          
          return (
            <motion.div 
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className={clsx(
                "bg-white rounded-[32px] p-6 border transition-all flex flex-col group",
                isActive ? "border-emerald-400 shadow-emerald-100/50 shadow-xl" : "border-slate-100 shadow-sm hover:border-indigo-100 hover:shadow-lg"
              )}
            >
              <div className="flex items-center gap-3 mb-4">
                  <div className={clsx(
                    "w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg shrink-0",
                    isActive ? "bg-emerald-500" : plan.color
                  )}>
                    <Icon size={20} />
                  </div>
                  <h3 className="font-black text-slate-900 text-[10px] uppercase italic tracking-widest">{plan.name}</h3>
              </div>

              <div className="flex-grow space-y-3 mb-6">
                <h4 className="text-2xl font-black text-slate-900 tracking-tighter italic">Rs {plan.price?.toLocaleString()}</h4>
                <div className="space-y-1">
                   <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-slate-300" /> {plan.tasks} Work Slots
                   </div>
                   <div className="text-[8px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                      <TrendingUp size={10} /> Rs {plan.daily} Daily Yield
                   </div>
                </div>
              </div>

              <button
                disabled={isActive || !!pendingRequest}
                onClick={() => setSelectedPlan(plan)}
                className={clsx(
                  "w-full h-11 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] transition-all active:scale-95 shadow-md flex items-center justify-center gap-2",
                  isActive ? "bg-emerald-500 text-white" : 
                  pendingRequest ? "bg-slate-100 text-slate-300" : "bg-[#0b0e14] text-white hover:bg-slate-800"
                )}
              >
                {isActive ? 'LIVE STATION' : pendingRequest ? 'AUDIT' : 'ACTIVATE'}
              </button>
            </motion.div>
          );
        })}
      </div>

      <div className="bg-indigo-50/50 p-6 rounded-[32px] border border-indigo-100 flex gap-4 mx-1 items-center">
         <Info size={20} className="text-indigo-500 shrink-0" />
         <p className="text-[9px] font-bold text-indigo-700 uppercase tracking-widest leading-relaxed">
           Agreement: New stations replace current ones. Validity is fixed at 30 production cycles.
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