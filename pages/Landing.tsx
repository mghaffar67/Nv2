
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
    { name: 'Basic', price: '500', daily: '50', icon: Star, color: 'text-slate-400' },
    { name: 'Standard', price: '1000', daily: '100', icon: Zap, color: 'text-emerald-500' },
    { name: 'Elite Pro', price: '1500', daily: '150', icon: Award, color: 'text-indigo-500' },
    { name: 'Diamond', price: '5000', daily: '650', icon: Diamond, color: 'text-sky-500' },
  ];

  return (
    <div className="overflow-hidden bg-[#fbfcfe] pb-20 font-sans">
      <LivePayoutTicker />
      
      {/* Compact Hero */}
      <section className="relative h-[340px] md:h-[450px] flex items-center overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0 opacity-40">
           <img src={heroImage} className="w-full h-full object-cover" alt="Hero" />
           <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent" />
        </div>
        <div className="max-w-6xl mx-auto w-full px-6 relative z-10">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="max-w-xl space-y-3">
              <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-500/20 px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] text-indigo-300 backdrop-blur-md">
                <ShieldCheck size={10} /> Official Noor V3 Protocol
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight uppercase italic text-white leading-none">
                Earn Fast.<br/>Work From Home.
              </h1>
              <p className="text-slate-400 text-[10px] md:text-sm font-bold tracking-tight max-w-md leading-relaxed uppercase italic">
                Join Pakistan's most trusted node network for daily earnings.
              </p>
              <div className="flex gap-2.5 pt-4">
                <Link to="/register" className="bg-indigo-600 text-white h-11 px-6 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all">
                  Initialize <ArrowRight size={14} />
                </Link>
                <Link to="/payouts" className="bg-white/5 backdrop-blur-md text-white border border-white/10 h-11 px-6 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all">
                  Proof Logs
                </Link>
              </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="max-w-6xl mx-auto px-4 -mt-8 relative z-20">
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
            <StatSmall label="Payouts" val="Rs. 12.8M" icon={TrendingUp} color="text-emerald-500" />
            <StatSmall label="Nodes" val="24.8k+" icon={Users} color="text-indigo-500" />
            <StatSmall label="Core" val="Active" icon={Zap} color="text-sky-500" />
            <StatSmall label="Support" val="Online" icon={Globe} color="text-amber-500" />
         </div>
      </section>

      {/* Plans Hub */}
      <section className="py-12 px-4 max-w-5xl mx-auto">
         <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Earning Hub.</h2>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1.5">Select your production station</p>
         </div>

         <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {premiumPlans.map((plan, i) => (
               <motion.div 
                 key={plan.name}
                 initial={{ opacity: 0, y: 10 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.05 }}
                 className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col items-center text-center gap-3 hover:border-indigo-200 hover:shadow-lg transition-all group"
               >
                  <div className={clsx("w-12 h-12 rounded-xl flex items-center justify-center bg-slate-50 transition-all group-hover:scale-110", plan.color)}>
                     <plan.icon size={24} />
                  </div>
                  <div>
                     <h4 className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{plan.name}</h4>
                     <p className="text-lg font-black text-slate-900 italic tracking-tighter leading-none">Rs {plan.price}</p>
                  </div>
                  <div className="w-full h-[1px] bg-slate-50" />
                  <p className="text-[8px] font-black text-emerald-600 uppercase">Rs {plan.daily}/Day</p>
                  <Link to="/register" className="h-9 w-full bg-slate-950 text-white rounded-lg font-black text-[7px] uppercase tracking-widest flex items-center justify-center gap-1 group-hover:bg-indigo-600 transition-colors shadow-md">
                    Activate <ChevronRight size={10} />
                  </Link>
               </motion.div>
            ))}
         </div>
      </section>

      {/* Protocol Workflow */}
      <section className="py-12 px-6 mx-4 bg-slate-950 rounded-[28px] relative overflow-hidden shadow-2xl">
         <div className="max-w-4xl mx-auto text-center mb-10">
            <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic leading-none">Protocol <span className="text-indigo-500">Flow.</span></h2>
            <p className="text-slate-500 text-[8px] font-bold uppercase tracking-[0.3em] mt-2">Zero Complication Journey</p>
         </div>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-5xl mx-auto">
            <FlowPill n="1" t="Identity" icon={UserPlus} />
            <FlowPill n="2" t="Setup" icon={Cpu} />
            <FlowPill n="3" t="Execute" icon={Activity} />
            <FlowPill n="4" t="Withdraw" icon={Wallet} />
         </div>
      </section>
    </div>
  );
};

const StatSmall = ({ label, val, icon: Icon, color }: any) => (
  <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-2.5 group hover:border-indigo-100 transition-all">
     <div className={clsx("w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-slate-50", color)}>
        <Icon size={18} />
     </div>
     <div className="overflow-hidden">
        <p className="text-[7px] font-black text-slate-300 uppercase tracking-widest truncate">{label}</p>
        <p className="text-xs font-black text-slate-900 italic tracking-tight leading-none">{val}</p>
     </div>
  </div>
);

const FlowPill = ({ n, t, icon: Icon }: any) => (
  <div className="bg-white/5 border border-white/5 p-5 rounded-2xl flex flex-col items-center gap-3 group hover:bg-indigo-600 transition-all duration-300">
     <span className="text-[8px] font-black text-indigo-500 group-hover:text-white uppercase tracking-widest">Step {n}</span>
     <Icon size={24} className="text-white group-hover:scale-110 transition-transform" />
     <h4 className="text-[10px] font-black text-white uppercase italic tracking-[0.1em]">{t}</h4>
  </div>
);

export default Landing;
