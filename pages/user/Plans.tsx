import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Award, Zap, Star, TrendingUp, Diamond, ChevronLeft, CheckCircle2, History, Info, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import PlanPurchaseModal from '../../components/plans/PlanPurchaseModal';
import { clsx } from 'clsx';

const PLAN_DATA = [
  { id: 'basic', name: 'Bronze Plan', price: 500, daily: 50, tasks: 5, color: 'bg-slate-400', icon: Star },
  { id: 'standard', name: 'Silver Plan', price: 1000, daily: 100, tasks: 10, color: 'bg-emerald-500', icon: Zap },
  { id: 'gold', name: 'Gold Plan', price: 1500, daily: 150, tasks: 15, color: 'bg-indigo-500', icon: Award },
  { id: 'diamond', name: 'Diamond Plan', price: 5000, daily: 650, tasks: 20, color: 'bg-sky-500', icon: Diamond }
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
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.7 } });
    setShowSuccess(plan);
    window.dispatchEvent(new Event('noor_db_update'));
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-[300] bg-white flex flex-col items-center justify-center p-6 text-center animate-fade-in">
         <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-6 max-w-sm">
            <div className="w-24 h-24 bg-emerald-500 rounded-[35px] flex items-center justify-center mx-auto shadow-2xl border-4 border-emerald-50">
               <CheckCircle2 size={48} className="text-white" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Membership Active!</h2>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest leading-relaxed px-4">
              Your {showSuccess.name} is now operational. You can start your daily tasks and earn profit immediately.
            </p>
            <button onClick={() => navigate('/user/work')} className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all">Start Earning Now</button>
         </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-28 space-y-8 animate-fade-in px-2">
      <header className="flex items-center justify-between pt-4 px-1">
        <Link to="/user/dashboard" className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-400 active:scale-90 transition-all">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter leading-none">Earning <span className="text-indigo-600">Plans.</span></h1>
        <Link to="/user/plans/history" className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-400 active:scale-90 transition-all">
          <History size={24} />
        </Link>
      </header>

      {/* Wallet Balance Strip */}
      <div className="bg-slate-950 p-6 rounded-[32px] shadow-2xl relative overflow-hidden mx-1 border border-white/5">
         <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 scale-150 text-indigo-400"><TrendingUp size={100}/></div>
         <div className="relative z-10 flex justify-between items-center">
            <div>
               <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1.5 italic">TOTAL BALANCE</p>
               <h2 className="text-3xl font-black text-white italic tracking-tighter leading-none">
                 <span className="text-xs text-sky-400 mr-1 not-italic">Rs.</span>
                 {(user?.balance || 0).toLocaleString()}
               </h2>
            </div>
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-sky-400 border border-white/10">
               <Zap size={24} fill="currentColor" />
            </div>
         </div>
      </div>

      {/* Plan Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 px-1">
        {PLAN_DATA.map((plan, idx) => {
          const isActive = user?.currentPlan === plan.name || user?.currentPlan === plan.name.replace(' Plan', '');
          return (
            <motion.div 
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className={clsx(
                "bg-white rounded-[40px] p-7 border-2 transition-all flex flex-col group relative overflow-hidden",
                isActive ? "border-emerald-400 shadow-2xl" : "border-slate-50 shadow-sm hover:border-indigo-100"
              )}
            >
              <div className="flex items-center justify-between mb-6">
                  <div className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform", isActive ? "bg-emerald-500" : plan.color)}>
                    <plan.icon size={24} />
                  </div>
                  {isActive && <div className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-[8px] font-black uppercase border border-emerald-100">Current Node</div>}
              </div>

              <div className="flex-grow space-y-4 mb-8">
                <div>
                   <h3 className="font-black text-slate-900 text-lg uppercase tracking-tight italic">{plan.name}</h3>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Assignments: {plan.tasks} Daily</p>
                </div>
                <h4 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">Rs {plan.price.toLocaleString()}</h4>
                
                <div className="space-y-2 pt-2">
                   <div className="flex items-center gap-3 text-slate-500">
                      <div className="w-1 h-1 rounded-full bg-emerald-500" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Yield: Rs {plan.daily} / Day</span>
                   </div>
                   <div className="flex items-center gap-3 text-slate-500">
                      <div className="w-1 h-1 rounded-full bg-slate-300" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Validity: 30 Nodes</span>
                   </div>
                </div>
              </div>

              <button
                disabled={isActive || !!pendingRequest}
                onClick={() => setSelectedPlan(plan)}
                className={clsx(
                  "w-full h-12 rounded-[18px] font-black text-[9px] uppercase tracking-[0.2em] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2",
                  isActive ? "bg-emerald-500 text-white" : 
                  pendingRequest ? "bg-slate-100 text-slate-300" : "bg-slate-950 text-white hover:bg-indigo-600"
                )}
              >
                {isActive ? 'Active Protocol' : pendingRequest ? 'Review Pending' : 'Initialize Plan'}
                <ChevronRight size={14} />
              </button>
            </motion.div>
          );
        })}
      </div>

      <div className="bg-indigo-50/50 p-6 rounded-[32px] border border-indigo-100 flex items-start gap-4 mx-1">
         <Info size={20} className="text-indigo-600 shrink-0 mt-0.5" />
         <div>
            <h4 className="text-[10px] font-black text-indigo-900 uppercase italic mb-1">Architecture Warning</h4>
            <p className="text-[9px] font-bold text-indigo-700 uppercase tracking-widest leading-relaxed">
              Buying a new station replaces your previous membership. Earnings are preserved in your wallet node.
            </p>
         </div>
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