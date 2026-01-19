import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Zap, ArrowRight, Check, Star, TrendingUp, Diamond, Loader2, ChevronLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import confetti from 'canvas-confetti';
import { api } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const PLAN_DATA = [
  { id: 'basic', name: 'BASIC', price: 500, daily: 50, validity: 30, features: ['5 Tasks/Day', 'Email Support'], color: 'bg-slate-400', icon: Star },
  { id: 'standard', name: 'STANDARD', price: 1000, daily: 100, validity: 30, features: ['10 Tasks/Day', 'Priority Support'], color: 'bg-emerald-500', icon: Zap },
  { id: 'gold', name: 'GOLD ELITE', price: 1500, daily: 150, validity: 30, features: ['15 Tasks/Day', 'WhatsApp Group'], color: 'bg-indigo-500', icon: Award, recommended: true },
  { id: 'diamond', name: 'DIAMOND', price: 5000, daily: 650, validity: 30, features: ['20 Tasks/Day', '24/7 Priority'], color: 'bg-sky-500', icon: Diamond }
];

const Plans = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const handleActivate = async (plan: any) => {
    if ((user?.balance || 0) < plan.price) {
      alert("Insufficient Ledger Balance. Redirecting to Deposit Hub...");
      return navigate('/user/wallet');
    }

    setLoading(plan.id);
    try {
      await api.post('/finance/activate-plan', { planId: plan.id });
      
      confetti({
        particleCount: 200,
        spread: 80,
        origin: { y: 0.7 },
        colors: ['#6366f1', '#10b981', '#f59e0b']
      });

      alert(`Station Synchronized! ${plan.name} is now active.`);
      window.location.reload();
    } catch (err: any) {
      alert(err.message || "Failed to activate node.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-md mx-auto pb-24 space-y-4 animate-fade-in px-1">
      <header className="flex items-center justify-between px-2 pt-2">
        <Link to="/user/dashboard" className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 active:scale-90 transition-all">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Upgrade <span className="text-indigo-600">Hub</span></h1>
        <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-amber-400 shadow-lg">
          <Award size={16} />
        </div>
      </header>

      <div className="bg-slate-50 p-5 rounded-[28px] border border-slate-100 mx-1 flex justify-between items-center shadow-inner">
         <div>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic mb-0.5">Wallet Funds</p>
            <p className="text-xl font-black text-slate-900 tracking-tight">Rs. {(user?.balance || 0).toLocaleString()}</p>
         </div>
         <Link to="/user/wallet" className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100 active:scale-90 transition-all">
            <TrendingUp size={18} />
         </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 px-1">
        {PLAN_DATA.map((plan) => {
          const isActive = user?.currentPlan === plan.name;
          const Icon = plan.icon;
          
          return (
            <motion.div 
              key={plan.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className={clsx(
                "bg-white rounded-[32px] p-6 border transition-all relative overflow-hidden",
                isActive ? "border-emerald-500 bg-emerald-50/20" : "border-slate-100"
              )}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg", plan.color)}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-sm">{plan.name}</h3>
                    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">{plan.validity} DAYS</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[8px] font-black text-indigo-500 uppercase tracking-widest">Entry Fee</p>
                  <p className="text-lg font-black text-slate-900">Rs {plan.price}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-6">
                {plan.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <Check size={10} className="text-emerald-500" />
                    <span className="text-[9px] font-bold text-slate-500 uppercase">{f}</span>
                  </div>
                ))}
              </div>

              <button
                disabled={isActive || !!loading}
                onClick={() => handleActivate(plan)}
                className={clsx(
                  "w-full h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95",
                  isActive ? "bg-emerald-500 text-white shadow-xl shadow-emerald-200" : "bg-slate-900 text-white shadow-xl shadow-slate-200"
                )}
              >
                {isActive ? (
                  <>ACTIVE STATION <Check size={14} /></>
                ) : loading === plan.id ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>ACTIVATE NODE <ArrowRight size={14} /></>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Plans;