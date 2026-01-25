
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Zap, Star, Users, 
  Activity, ChevronRight,
  UserPlus, Cpu, Wallet, ShieldCheck, Award, Diamond,
  TrendingUp, Globe
} from 'lucide-react';
import { clsx } from 'clsx';
import { useConfig } from '../context/ConfigContext';
import LivePayoutTicker from '../components/marketing/LivePayoutTicker';

const Landing = () => {
  const { config } = useConfig();
  const heroImage = config.appearance.heroSlides?.[0]?.image || "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1920";

  const premiumPlans = [
    { 
      name: 'Basic', price: '500', daily: '50', tasks: '5', validity: '30D',
      icon: Star, color: 'text-slate-400', bg: 'bg-slate-50'
    },
    { 
      name: 'Standard', price: '1000', daily: '100', tasks: '10', validity: '30D',
      icon: Zap, color: 'text-emerald-500', bg: 'bg-emerald-50/30'
    },
    { 
      name: 'Elite Pro', price: '1500', daily: '150', tasks: '15', validity: '30D',
      icon: Award, color: 'text-indigo-500', bg: 'bg-indigo-50/30'
    },
    { 
      name: 'Diamond', price: '5000', daily: '650', tasks: '20', validity: '30D',
      icon: Diamond, color: 'text-sky-500', bg: 'bg-sky-50/30'
    },
  ];

  return (
    <div className="overflow-hidden bg-[#fbfcfe] pb-24 font-sans">
      <LivePayoutTicker />
      
      <section className="relative h-[440px] lg:h-[70vh] flex items-center overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0 opacity-40">
           <img src={heroImage} className="w-full h-full object-cover scale-105" alt="Background" />
           <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto w-full px-6 relative z-10">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="max-w-3xl space-y-5">
              <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-500/30 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.4em] text-indigo-400 backdrop-blur-xl">
                <ShieldCheck size={12} /> SECURE SYSTEM
              </div>
              <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic text-white leading-[0.85]">
                Earn <span className="text-indigo-500">Fast.</span><br/>
                <span className="text-sky-400 font-light text-2xl md:text-6xl italic">Work From Home.</span>
              </h1>
              <div className="flex gap-4 pt-4">
                <Link to="/register" className="bg-indigo-600 text-white h-14 px-10 rounded-[22px] font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                  Get Started <ArrowRight size={18} />
                </Link>
                <Link to="/payouts" className="bg-white/5 backdrop-blur-md text-white border border-white/10 h-14 px-10 rounded-[22px] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all">
                  Payment Proof
                </Link>
              </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 -mt-14 relative z-20">
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard label="Total Paid" val="Rs. 12.8M" icon={TrendingUp} color="text-emerald-500" />
            <StatCard label="Members" val="24.8k+" icon={Users} color="text-indigo-500" />
            <StatCard label="System Status" val="Active" icon={Zap} color="text-sky-500" />
            <StatCard label="Support" val="Online" icon={Globe} color="text-amber-500" />
         </div>
      </section>

      <section className="py-24 px-4 max-w-7xl mx-auto">
         <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Earning Plans.</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.5em] mt-3">Select Your Favorite Plan</p>
         </div>

         {/* 2 COLUMN GRID FOR ALL SCREENS */}
         <div className="grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-2">
            {premiumPlans.map((plan, i) => (
               <motion.div 
                 key={plan.name}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.05 }}
                 className="bg-white rounded-[40px] p-6 md:p-8 border border-slate-100 shadow-sm flex flex-col items-center text-center gap-6 group hover:border-indigo-100 hover:shadow-2xl transition-all duration-500"
               >
                  <div className={clsx("w-14 h-14 md:w-20 md:h-20 rounded-[28px] flex items-center justify-center shadow-xl group-hover:-rotate-6 transition-all", plan.bg, plan.color)}>
                     <plan.icon size={36} />
                  </div>
                  <div>
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{plan.name} Plan</h4>
                     <p className="text-2xl md:text-4xl font-black text-slate-900 italic tracking-tighter leading-none">Rs {plan.price}</p>
                  </div>

                  <div className="w-full py-4 border-y border-slate-50 grid grid-cols-1 gap-2">
                     <div className="flex justify-between items-center px-4">
                        <p className="text-[8px] font-black text-slate-300 uppercase">Daily</p>
                        <p className="text-xs font-black text-emerald-600 uppercase">Rs {plan.daily}</p>
                     </div>
                     <div className="flex justify-between items-center px-4">
                        <p className="text-[8px] font-black text-slate-300 uppercase">Work</p>
                        <p className="text-xs font-black text-slate-700 uppercase">{plan.tasks} Tasks</p>
                     </div>
                  </div>

                  <Link to="/register" className="h-12 px-8 bg-slate-900 text-white rounded-[20px] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 group-hover:bg-indigo-600 transition-colors shadow-lg w-full">
                    Activate <ChevronRight size={14} />
                  </Link>
               </motion.div>
            ))}
         </div>
      </section>

      <section className="py-24 px-6 mx-4 bg-slate-950 rounded-[64px] relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 p-20 opacity-5 scale-[2] rotate-12 text-white"><Cpu size={100}/></div>
         <div className="max-w-4xl mx-auto text-center mb-16 space-y-4">
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">How It <span className="text-indigo-500">Works.</span></h2>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.4em]">Simple Steps To Profit</p>
         </div>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <FlowPill n="1" t="Register" icon={UserPlus} />
            <FlowPill n="2" t="Setup" icon={Cpu} />
            <FlowPill n="3" t="Work" icon={Activity} />
            <FlowPill n="4" t="Profit" icon={Wallet} />
         </div>
      </section>
    </div>
  );
};

const StatCard = ({ label, val, icon: Icon, color }: any) => (
  <div className="bg-white p-5 rounded-[32px] border border-slate-100 shadow-lg flex items-center gap-4 group hover:border-indigo-100 transition-all">
     <div className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-slate-50 shadow-inner group-hover:scale-110 transition-transform", color)}>
        <Icon size={24} />
     </div>
     <div className="overflow-hidden">
        <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1 truncate">{label}</p>
        <p className="text-lg font-black text-slate-900 italic tracking-tight leading-none">{val}</p>
     </div>
  </div>
);

const FlowPill = ({ n, t, icon: Icon }: any) => (
  <div className="bg-white/5 border border-white/10 p-8 rounded-[40px] flex flex-col items-center gap-4 group hover:bg-indigo-600 transition-all duration-500">
     <span className="text-[10px] font-black text-indigo-500 group-hover:text-white uppercase tracking-widest">Step {n}</span>
     <Icon size={32} className="text-white group-hover:scale-110 transition-transform" />
     <h4 className="text-[11px] font-black text-white uppercase italic tracking-[0.2em]">{t}</h4>
  </div>
);

export default Landing;
