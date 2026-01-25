
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Zap, Star, Users, 
  Activity, CheckCircle2, ChevronRight,
  UserPlus, Cpu, Wallet, ShieldCheck, Award, Diamond,
  Clock, BadgeCheck, BarChart3, TrendingUp
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
      icon: Zap, color: 'text-emerald-500', bg: 'bg-emerald-50/30', popular: true
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
    <div className="overflow-hidden bg-[#fcfdfe] pb-24 font-sans">
      <LivePayoutTicker />
      
      {/* MODERN COMPACT HERO */}
      <section className="relative h-[440px] lg:h-[65vh] flex items-center overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0 opacity-40">
           <img src={heroImage} className="w-full h-full object-cover scale-110" alt="Background" />
           <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </div>
        
        <div className="max-w-7xl mx-auto w-full px-6 relative z-10">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.4em] text-sky-400 backdrop-blur-xl">
                <ShieldCheck size={12} /> PROTOCOL NODE v5.0
              </div>
              <h1 className="text-4xl md:text-8xl font-black leading-[0.85] tracking-tighter uppercase italic text-white">
                Earn <span className="text-indigo-500">Daily.</span><br/>
                <span className="text-sky-400 font-light text-2xl md:text-6xl">Secure Home Income.</span>
              </h1>
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Link to="/register" className="bg-indigo-600 text-white h-14 px-10 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                  Join Network <ArrowRight size={18} />
                </Link>
                <Link to="/payouts" className="bg-white/5 backdrop-blur-md text-white border border-white/10 h-14 px-10 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all">
                  Live Proofs
                </Link>
              </div>
          </motion.div>
        </div>
      </section>

      {/* HORIZONTAL NODE STATS */}
      <section className="max-w-7xl mx-auto px-4 -mt-10 relative z-20">
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatPill label="Trust Partners" val="24k+" icon={Users} color="text-indigo-500" />
            <StatPill label="Paid Out (PKR)" val="12.8M" icon={TrendingUp} color="text-emerald-500" />
            <StatPill label="Node Support" val="24/7" icon={ShieldCheck} color="text-sky-500" />
            <StatPill label="Verification" val="Instant" icon={Zap} color="text-amber-500" />
         </div>
      </section>

      {/* ADVANCED SLAB PLAN SECTION */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
         <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic">Earning Stations.</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em]">Select Your High-Yield Registry Node</p>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {premiumPlans.map((plan, i) => (
               <motion.div 
                 key={plan.name}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.05 }}
                 className="bg-white rounded-[40px] p-6 md:p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 group hover:border-indigo-100 hover:shadow-2xl transition-all duration-500"
               >
                  <div className="flex items-center gap-6 w-full md:w-1/3">
                    <div className={clsx("w-16 h-16 rounded-[24px] flex items-center justify-center shadow-xl shrink-0 group-hover:rotate-6 transition-transform", plan.bg, plan.color)}>
                       <plan.icon size={32} />
                    </div>
                    <div>
                       <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{plan.name} Node</h4>
                       <p className="text-3xl font-black text-slate-900 italic tracking-tighter">Rs {plan.price}</p>
                    </div>
                  </div>

                  <div className="flex-grow grid grid-cols-3 gap-4 w-full border-y md:border-y-0 md:border-x border-slate-50 py-6 md:py-0 md:px-8">
                     <div className="text-center md:text-left">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Daily Income</p>
                        <p className="text-xs font-black text-emerald-600">Rs {plan.daily}</p>
                     </div>
                     <div className="text-center md:text-left">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Task Limit</p>
                        <p className="text-xs font-black text-slate-700">{plan.tasks}</p>
                     </div>
                     <div className="text-center md:text-left">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Cycle</p>
                        <p className="text-xs font-black text-slate-700">{plan.validity}</p>
                     </div>
                  </div>

                  <div className="w-full md:w-fit">
                    <Link to="/register" className="h-14 px-10 bg-slate-900 group-hover:bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95">
                      Activate <ChevronRight size={14} />
                    </Link>
                  </div>
               </motion.div>
            ))}
         </div>
      </section>

      {/* PROVEN WORKFLOW */}
      <section className="py-24 px-6 mx-4 bg-slate-950 rounded-[64px] relative overflow-hidden">
         <div className="absolute top-0 right-0 p-24 opacity-5 scale-[2] rotate-12 text-white"><Cpu size={100} /></div>
         <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">The <span className="text-indigo-500">Flow.</span></h2>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.4em] mt-4">Automated Income Verification Pipeline</p>
         </div>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <WorkflowStep n="01" t="Create ID" icon={UserPlus} />
            <WorkflowStep n="02" t="Setup Node" icon={Cpu} />
            <WorkflowStep n="03" t="Work Daily" icon={Activity} />
            <WorkflowStep n="04" t="Withdraw" icon={Wallet} />
         </div>
      </section>
    </div>
  );
};

const StatPill = ({ label, val, icon: Icon, color }: any) => (
  <div className="bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-4 group hover:border-indigo-100 transition-all">
     <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-slate-50 shadow-inner", color)}>
        <Icon size={20} />
     </div>
     <div className="overflow-hidden">
        <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1 truncate">{label}</p>
        <p className="text-base font-black text-slate-900 italic tracking-tight">{val}</p>
     </div>
  </div>
);

const WorkflowStep = ({ n, t, icon: Icon }: any) => (
  <div className="flex flex-col items-center group">
     <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-[22px] flex items-center justify-center text-white mb-6 shadow-2xl group-hover:bg-indigo-600 group-hover:-rotate-6 transition-all duration-500">
        <Icon size={24}/>
     </div>
     <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-1">{n}</span>
     <h4 className="text-[10px] font-black text-white uppercase italic">{t}</h4>
  </div>
);

export default Landing;
