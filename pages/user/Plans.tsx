
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Zap, ArrowRight, Check, Star, History, TrendingUp, Diamond, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import confetti from 'canvas-confetti';
import { api } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const PLAN_DATA = [
  { id: 'basic', name: 'BASIC PLAN', price: 500, daily: 50, validity: 30, features: ['2 Tasks/Day', 'Standard Support'], color: 'bg-slate-400', icon: Star },
  { id: 'standard', name: 'STANDARD PLAN', price: 1000, daily: 100, validity: 30, features: ['3 Tasks/Day', 'Fast Support'], color: 'bg-emerald-500', icon: Zap },
  { id: 'gold', name: 'GOLD ELITE PLAN', price: 1500, daily: 150, validity: 30, features: ['5 Tasks/Day', 'Priority Support'], color: 'bg-indigo-500', icon: Award, recommended: true },
  { id: 'diamond', name: 'DIAMOND PLAN', price: 5000, daily: 650, validity: 30, features: ['Unlimited Tasks', 'No Withdrawal Fee'], color: 'bg-sky-500', icon: Diamond }
];

const PlanCard = ({ plan, onActivate, loading }: any) => {
  const { user } = useAuth();
  const Icon = plan.icon;
  const normalizedUserPlan = user?.currentPlan?.toUpperCase() || 'NONE';
  const isCurrentPlan = normalizedUserPlan.includes(plan.name.replace(' PLAN', '').toUpperCase());

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={clsx(
        "w-full bg-white rounded-[24px] p-4 flex flex-col border relative transition-all active:scale-[0.98]",
        plan.recommended ? "border-indigo-500 ring-4 ring-indigo-50" : "border-slate-100 shadow-sm"
      )}>
      {plan.recommended && <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[7px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">Most Popular</div>}
      
      <div className="flex items-center gap-3 mb-4">
        <div className={clsx("w-9 h-9 rounded-xl flex items-center justify-center text-white", plan.color)}><Icon size={16} /></div>
        <div className="overflow-hidden">
          <h3 className="font-bold text-slate-900 text-xs tracking-tight leading-none mb-0.5">{plan.name}</h3>
          <p className="text-[7px] text-slate-400 font-bold uppercase tracking-widest">{plan.validity} DAYS VALID</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Plan Price</p>
        <h4 className="text-xl font-black text-slate-900 tracking-tighter">Rs {plan.price.toLocaleString()}</h4>
      </div>

      <div className="bg-green-50 p-2 rounded-xl border border-green-100 flex justify-between items-center mb-4">
        <span className="text-[7px] font-bold text-green-700 uppercase">Daily Earning:</span>
        <span className="text-xs font-black text-green-600">Rs. {plan.daily}/Day</span>
      </div>

      <div className="space-y-1.5 mb-5 flex-grow">
        {plan.features.map((f: string, i: number) => (
          <div key={i} className="flex items-center gap-1.5">
            <Check size={8} className="text-indigo-600 shrink-0" />
            <span className="text-[9px] font-bold text-slate-500">{f}</span>
          </div>
        ))}
      </div>

      <button 
        disabled={loading || isCurrentPlan}
        onClick={() => onActivate(plan)} 
        className={clsx(
          "w-full h-10 rounded-xl font-bold text-[9px] uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95",
          isCurrentPlan ? "bg-emerald-50 text-emerald-600 border border-emerald-100 cursor-default shadow-none" : "bg-slate-900 text-white"
        )}
      >
        {isCurrentPlan ? (
          <>Station Active <Check size={12} /></>
        ) : loading ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <>Activate Now <ArrowRight size={12} /></>
        )}
      </button>
    </motion.div>
  );
};

const Plans = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);

  const handleActivate = async (plan: any) => {
    setLoading(plan.id);
    try {
      const res = await api.post('/finance/activate-plan', { planId: plan.id });
      
      confetti({
        particleCount: 200,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#10b981', '#f59e0b']
      });

      alert("Plan Activated Successfully! 🚀");
      navigate('/user/dashboard');
      // Trigger soft refresh of user data context
      window.location.reload();
    } catch (err: any) {
      const msg = err.message || "";
      if (msg.toLowerCase().includes('insufficient')) {
        if (confirm("Low Ledger Balance. Would you like to go to the Deposit Portal?")) {
          navigate('/user/wallet');
        }
      } else {
        alert(msg || "Internal system node failure.");
      }
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 pb-24 space-y-6 animate-fade-in">
      <div className="flex flex-col items-center pt-6">
        <div className="inline-flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full text-indigo-600 text-[8px] font-bold uppercase tracking-widest mb-2 border border-indigo-100 shadow-sm">
          <TrendingUp size={10} /> Yield Management
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none text-center">Operational <span className="text-indigo-600 italic">Stations</span></h1>
        <div className="flex gap-4 mt-4">
          <Link to="/user/plans/history" className="text-slate-400 font-bold uppercase text-[8px] tracking-widest flex items-center gap-1.5 hover:text-slate-600 transition-colors">
            <History size={10} /> Audit Log
          </Link>
          <Link to="/user/wallet" className="text-sky-500 font-black uppercase text-[8px] tracking-widest flex items-center gap-1.5 hover:text-sky-600 transition-colors">
            <Zap size={10} fill="currentColor" /> Add Liquidity
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {PLAN_DATA.map((plan) => (
          <PlanCard 
            key={plan.id} 
            plan={plan} 
            onActivate={handleActivate} 
            loading={loading === plan.id}
          />
        ))}
      </div>
      
      <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100">
         <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 italic text-center">Risk Protocol</h4>
         <p className="text-[8px] text-slate-500 leading-relaxed text-center uppercase tracking-wider">
           All stations remain synchronized for 30 cycles. Reward yield is credited instantly upon task node verification.
         </p>
      </div>
    </div>
  );
};

export default Plans;
