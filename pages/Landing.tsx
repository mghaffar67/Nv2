
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Zap, Star, Users, 
  Activity, CheckCircle2, ChevronRight,
  UserPlus, Cpu, Wallet, ShieldCheck
} from 'lucide-react';
import { clsx } from 'clsx';
import { useConfig } from '../context/ConfigContext';
import LivePayoutTicker from '../components/marketing/LivePayoutTicker';

const Landing = () => {
  const { config } = useConfig();
  const heroImage = config.appearance.heroSlides?.[0]?.image || "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1920";

  return (
    <div className="overflow-hidden bg-[#f8f9fb] pb-12 font-sans">
      <LivePayoutTicker />
      
      {/* HERO SECTION - Tighter PC/Mobile */}
      <section className="relative min-h-[450px] lg:h-[70vh] lg:max-h-[600px] flex items-center overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0 opacity-40">
           <img src={heroImage} className="w-full h-full object-cover" alt="Background" />
           <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        </div>
        
        <div className="max-w-6xl mx-auto w-full px-6 py-8 relative z-10">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="max-w-2xl text-white space-y-5">
              <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest text-indigo-400 backdrop-blur-md">
                <ShieldCheck size={10} /> PLATFORM NODE v3.0
              </div>
              <h1 className="text-3xl md:text-6xl font-black leading-[1] tracking-tighter uppercase italic">
                Secure <span className="text-indigo-500">Earnings.</span><br/>
                <span className="text-sky-400 font-light text-xl md:text-5xl">Daily Payout Guaranteed.</span>
              </h1>
              <p className="text-slate-400 text-[10px] md:text-xs font-bold max-w-sm leading-relaxed uppercase tracking-widest opacity-80">
                Pakistan's premium digital earning network. Join thousands of partners earning verified daily rewards.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link to="/register" className="bg-indigo-600 text-white h-12 md:h-13 px-8 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all">
                  Get Started <ArrowRight size={16} />
                </Link>
                <Link to="/payouts" className="bg-white/10 backdrop-blur-md text-white border border-white/10 h-12 md:h-13 px-8 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all">
                  Payment Proofs <CheckCircle2 size={16} />
                </Link>
              </div>
          </motion.div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-6 px-4 max-w-6xl mx-auto -mt-6 md:-mt-10 relative z-20">
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard label="Total Members" val="18k+" icon={Users} color="text-indigo-600" />
            <StatCard label="Total Paid" val="Rs. 9.2M" icon={Wallet} color="text-emerald-600" />
            <StatCard label="Daily Active" val="4500+" icon={Activity} color="text-sky-600" />
            <StatCard label="Trust Score" val="100%" icon={Star} color="text-amber-500" />
         </div>
      </section>

      {/* WORK FLOW SECTION */}
      <section className="py-12 px-4">
         <div className="max-w-7xl mx-auto text-center mb-8">
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Protocol Flow.</h2>
         </div>
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-5xl mx-auto">
            <ProcessStep n="01" icon={UserPlus} t="Registration" d="Create Member ID" />
            <ProcessStep n="02" icon={Cpu} t="Plan Activation" d="Initialize Station" />
            <ProcessStep n="03" icon={Zap} t="Work Cycle" d="Daily Assignments" />
            <ProcessStep n="04" icon={Wallet} t="Liquidation" d="Instant Withdraw" />
         </div>
      </section>

      {/* REVIEWS SECTION */}
      <section className="py-16 px-4">
         <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic text-center mb-10">Member Testimonials.</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               {config.appearance.reviews.slice(0, 3).map((r, i) => (
                 <div key={i} className="bg-white p-6 rounded-[30px] border border-slate-100 shadow-sm relative group">
                    <div className="flex gap-1 mb-3">
                       {[...Array(5)].map((_, j) => <Star key={j} size={8} className="fill-amber-400 text-amber-400" />)}
                    </div>
                    <p className="text-slate-600 text-xs font-medium italic mb-5 leading-relaxed">"{r.comment}"</p>
                    <div className="flex items-center gap-3 border-t border-slate-50 pt-4">
                       <div className="w-8 h-8 bg-slate-950 text-sky-400 rounded-lg flex items-center justify-center font-black italic text-xs">{r.name.charAt(0)}</div>
                       <div>
                          <h4 className="text-[9px] font-black text-slate-900 uppercase">{r.name}</h4>
                          <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">Verified Associate</p>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>
    </div>
  );
};

const StatCard = ({ label, val, icon: Icon, color }: any) => (
  <div className="bg-white p-4 rounded-[22px] border border-slate-100 shadow-sm flex items-center gap-3 group hover:border-indigo-200 transition-all">
     <div className={clsx("w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-slate-50 shadow-inner", color)}>
        <Icon size={18} />
     </div>
     <div className="overflow-hidden">
        <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-0.5 truncate">{label}</p>
        <p className="text-sm font-black text-slate-900 italic tracking-tight">{val}</p>
     </div>
  </div>
);

const ProcessStep = ({ n, icon: Icon, t, d }: any) => (
  <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center text-center group hover:bg-slate-900 transition-all duration-300">
     <div className="text-[8px] font-black text-indigo-200 mb-4 group-hover:text-indigo-600">{n}</div>
     <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-4 shadow-inner group-hover:bg-white group-hover:rotate-6 transition-all"><Icon size={24}/></div>
     <h4 className="text-[10px] font-black text-slate-900 uppercase mb-1 italic group-hover:text-white">{t}</h4>
     <p className="text-[8px] font-bold text-slate-400 uppercase group-hover:text-slate-500">{d}</p>
  </div>
);

export default Landing;
