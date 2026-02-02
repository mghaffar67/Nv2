import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Star, Zap, Award, Diamond, ChevronLeft, History, TrendingUp, Check, Clock, Rocket, Sparkles, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import PlanPurchaseModal from '../../components/plans/PlanPurchaseModal';
import { clsx } from 'clsx';

const PLAN_DATA = [
  { id: 'basic', name: 'BASIC', price: 1000, daily: 240, tasks: 1, bonus: 300, color: 'bg-[#4A6CF7]', icon: Star },
  { id: 'standard', name: 'STANDARD', price: 2000, daily: 480, tasks: 2, bonus: 500, color: 'bg-[#2EC4B6]', icon: Zap },
  { id: 'gold', name: 'GOLD', price: 3500, daily: 720, tasks: 3, bonus: 800, color: 'bg-[#F4C430]', icon: Award },
  { id: 'diamond', name: 'DIAMOND', price: 6000, daily: 960, tasks: 4, bonus: 1200, color: 'bg-[#7B61FF]', icon: Diamond }
];

const Plans = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState<any>(null);

  const handleActivationSuccess = (plan: any) => {
    confetti({
      particleCount: 200, spread: 80, origin: { y: 0.7 },
      colors: ['#4A6CF7', '#2EC4B6', '#F4C430']
    });
    setShowSuccess(plan);
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-[300] bg-[#F7F9FC] flex flex-col items-center justify-center p-6 text-center animate-fade-in w-full overflow-hidden font-sans">
         <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
         <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-10 max-w-sm w-full relative z-10">
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-28 h-28 bg-[#4A6CF7] rounded-[40px] flex items-center justify-center mx-auto shadow-2xl border-4 border-white">
               <ShieldCheck size={52} className="text-white" />
            </motion.div>
            <div className="space-y-3">
               <h2 className="text-4xl font-black text-[#1F2937] uppercase italic tracking-tighter leading-none">STATION ACTIVE!</h2>
               <p className="text-[#4B5563] font-bold uppercase tracking-widest text-[10px]">Aap ka {showSuccess.name} station activate ho chuka hai.</p>
            </div>
            <div className="bg-white border border-slate-100 p-6 rounded-[32px] shadow-sm space-y-4">
               <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <span>Rozana Kamai</span>
                  <span className="text-[#2EC4B6]">Rs. {showSuccess.daily}</span>
               </div>
               <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <span>Assignment Slots</span>
                  <span className="text-[#4A6CF7]">{showSuccess.tasks} Pages</span>
               </div>
            </div>
            <button onClick={() => navigate('/user/work')} className="w-full h-16 bg-[#1F2937] text-white rounded-[28px] font-black text-xs uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all">
               Start Work
            </button>
         </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto pb-28 space-y-8 animate-fade-in px-2 overflow-x-hidden bg-[#F7F9FC]">
      <header className="flex items-center justify-between pt-4 px-2">
        <Link to="/user/dashboard" className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 active:scale-90 transition-all"><ChevronLeft size={22} /></Link>
        <h1 className="text-2xl font-black text-[#1F2937] tracking-tight italic uppercase">Earning <span className="text-[#4A6CF7]">Stations.</span></h1>
        <Link to="/user/plans/history" className="w-11 h-11 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 shadow-sm"><History size={20} /></Link>
      </header>

      {user?.currentPlan && user.currentPlan !== 'None' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#4A6CF7] p-8 rounded-[44px] text-white shadow-xl relative overflow-hidden mx-1 border-4 border-white">
           <div className="absolute top-0 right-0 p-8 opacity-20 rotate-12 scale-150"><ShieldCheck size={100} /></div>
           <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 opacity-80">Operational Plan</p>
              <h2 className="text-4xl font-black italic tracking-tighter leading-none mb-4">{user.currentPlan} HUB</h2>
              <div className="flex items-center gap-3">
                 <div className="px-3 py-1 bg-white/20 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/20">STATION ONLINE</div>
                 <div className="text-[9px] font-bold uppercase opacity-80 flex items-center gap-1.5"><Clock size={10} /> Mon-Fri Schedule</div>
              </div>
           </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-1">
        {PLAN_DATA.map((plan) => {
          const isActive = user?.currentPlan === plan.name;
          const Icon = plan.icon;
          
          return (
            <motion.div 
              key={plan.id}
              whileHover={{ y: -5 }}
              className={clsx(
                "bg-white rounded-[40px] p-8 border transition-all relative overflow-hidden flex flex-col min-h-[340px]",
                isActive ? "border-[#4A6CF7] bg-blue-50/10 shadow-2xl" : "border-slate-100 shadow-sm"
              )}
            >
              <div className="flex items-center justify-between mb-8">
                  <div className={clsx("w-16 h-16 rounded-[28px] flex items-center justify-center text-white shadow-lg", plan.color)}>
                    <Icon size={32} />
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Activation Price</p>
                    <p className="text-3xl font-black text-[#1F2937] italic tracking-tighter">Rs {plan.price.toLocaleString()}</p>
                  </div>
              </div>

              <div className="flex-grow space-y-6">
                <h3 className="font-black text-[#1F2937] text-xl uppercase italic leading-none">{plan.name} STATION</h3>
                <div className="grid grid-cols-2 gap-3 pt-2">
                   <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100">
                      <p className="text-[7px] font-black text-slate-400 uppercase mb-1">Daily Earning</p>
                      <p className="text-sm font-black text-[#2EC4B6]">Rs {plan.daily}</p>
                   </div>
                   <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100">
                      <p className="text-[7px] font-black text-slate-400 uppercase mb-1">Ref Bonus</p>
                      <p className="text-sm font-black text-[#4A6CF7]">Rs {plan.bonus}</p>
                   </div>
                </div>
                <div className="flex items-center gap-2 text-[9px] font-bold text-[#4B5563] uppercase tracking-widest px-2">
                   <Check size={14} className="text-[#2EC4B6]" /> {plan.tasks} Assignments Daily (Rs 240/Page)
                </div>
              </div>

              <button
                disabled={isActive}
                onClick={() => setSelectedPlan(plan)}
                className={clsx(
                  "w-full h-16 rounded-[28px] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl mt-8",
                  isActive ? "bg-[#2EC4B6] text-white" : "bg-[#1F2937] text-white hover:bg-[#4A6CF7]"
                )}
              >
                {isActive ? <><ShieldCheck size={18}/> ACTIVE</> : 'ACTIVATE STATION'}
              </button>
            </motion.div>
          );
        })}
      </div>
      <PlanPurchaseModal isOpen={!!selectedPlan} onClose={() => setSelectedPlan(null)} plan={selectedPlan} onSuccess={handleActivationSuccess} />
    </div>
  );
};

export default Plans;