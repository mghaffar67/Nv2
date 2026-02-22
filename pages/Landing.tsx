
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Zap, Star, Users, 
  Activity, ChevronRight,
  UserPlus, Cpu, Wallet, ShieldCheck, Award, Diamond,
  TrendingUp, Globe, MessageSquare, Quote
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
      
      {/* Professional Hero */}
      <section className="relative h-[340px] md:h-[500px] flex items-center overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0 opacity-40">
           <img src={heroImage} className="w-full h-full object-cover" alt="Hero" />
           <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent" />
        </div>
        <div className="max-w-6xl mx-auto w-full px-6 relative z-10">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="max-w-xl space-y-4">
              <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-500/20 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-indigo-300 backdrop-blur-md">
                <ShieldCheck size={12} /> Pakistan's #1 Trusted Platform
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase italic text-white leading-[0.9]">
                Daily Earnings.<br/>Simple Work.
              </h1>
              <p className="text-slate-400 text-[10px] md:text-base font-bold tracking-tight max-w-md leading-relaxed uppercase italic">
                Join our community of thousands earning daily from simple online assignments. Fast payouts via EasyPaisa & JazzCash.
              </p>
              <div className="flex gap-3 pt-6">
                <Link to="/register" className="bg-indigo-600 text-white h-12 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center justify-center gap-2 active:scale-95 transition-all">
                  Get Started <ArrowRight size={16} />
                </Link>
                <Link to="/payouts" className="bg-white/5 backdrop-blur-md text-white border border-white/10 h-12 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all">
                  Proof Center
                </Link>
              </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="max-w-6xl mx-auto px-4 -mt-8 relative z-20">
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatSmall label="Total Payouts" val="Rs. 12.8M" icon={TrendingUp} color="text-emerald-500" />
            <StatSmall label="Global Members" val="24.8k+" icon={Users} color="text-indigo-500" />
            <StatSmall label="System Status" val="Operational" icon={Zap} color="text-sky-500" />
            <StatSmall label="Live Support" val="Online" icon={Globe} color="text-amber-500" />
         </div>
      </section>

      {/* Earning Plans Hub */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
         <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Earning Plans.</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">Choose the best plan for your daily goals</p>
         </div>

         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {premiumPlans.map((plan, i) => (
               <motion.div 
                 key={plan.name}
                 initial={{ opacity: 0, y: 10 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.05 }}
                 className="bg-white rounded-[40px] p-6 border border-slate-100 shadow-sm flex flex-col items-center text-center gap-4 hover:border-indigo-200 hover:shadow-xl transition-all group"
               >
                  <div className={clsx("w-14 h-14 rounded-2xl flex items-center justify-center bg-slate-50 transition-all group-hover:scale-110 shadow-inner", plan.color)}>
                     <plan.icon size={28} />
                  </div>
                  <div>
                     <h4 className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{plan.name}</h4>
                     <p className="text-2xl font-black text-slate-900 italic tracking-tighter leading-none">Rs {plan.price}</p>
                  </div>
                  <div className="w-full h-[1px] bg-slate-50" />
                  <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Earning: Rs {plan.daily}/Day</p>
                  <Link to="/register" className="h-10 w-full bg-slate-950 text-white rounded-xl font-black text-[8px] uppercase tracking-widest flex items-center justify-center gap-1 group-hover:bg-indigo-600 transition-colors shadow-lg active:scale-95">
                    Activate Now <ChevronRight size={12} />
                  </Link>
               </motion.div>
            ))}
         </div>
      </section>

      {/* Community Feedback (Reviews Section) */}
      <section className="py-16 bg-slate-50">
         <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
               <div>
                  <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Member Reviews.</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">Real feedback from our earning community</p>
               </div>
               <div className="flex gap-2">
                  <div className="px-4 py-2 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2">
                     <Star size={14} className="fill-amber-400 text-amber-400" />
                     <span className="font-black text-xs text-slate-800 tracking-tight">4.9/5 Rating</span>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {config.appearance.reviews.map((rev, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-white p-8 rounded-[44px] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all"
                  >
                     <Quote size={40} className="absolute -top-4 -right-4 text-indigo-50/50 group-hover:text-indigo-50 transition-colors" />
                     <div className="flex gap-1 mb-6">
                        {[...Array(rev.rating)].map((_, i) => <Star key={i} size={10} className="fill-amber-400 text-amber-400" />)}
                     </div>
                     <p className="text-xs font-bold text-slate-500 italic mb-8 leading-relaxed">"{rev.comment}"</p>
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-900 text-sky-400 rounded-2xl flex items-center justify-center font-black italic shadow-lg border border-white/10 shrink-0">
                           {rev.name.charAt(0)}
                        </div>
                        <div>
                           <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{rev.name}</h4>
                           <p className="text-[7px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5 italic">Verified Member</p>
                        </div>
                     </div>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* Simple Workflow */}
      <section className="py-16 px-6 mx-4 bg-slate-950 rounded-[44px] relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12 scale-150"><Zap size={200} fill="currentColor"/></div>
         <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none">How It <span className="text-indigo-500">Works.</span></h2>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-3">Simple 4-Step Journey to Success</p>
         </div>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <FlowPill n="1" t="Create Account" icon={UserPlus} />
            <FlowPill n="2" t="Pick a Plan" icon={Cpu} />
            <FlowPill n="3" t="Complete Tasks" icon={Activity} />
            <FlowPill n="4" t="Instant Cashout" icon={Wallet} />
         </div>
      </section>
    </div>
  );
};

const StatSmall = ({ label, val, icon: Icon, color }: any) => (
  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3.5 group hover:border-indigo-200 transition-all">
     <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-slate-50 shadow-inner group-hover:scale-110 transition-transform", color)}>
        <Icon size={20} />
     </div>
     <div className="overflow-hidden">
        <p className="text-[7px] font-black text-slate-400 uppercase tracking-[0.2em] truncate">{label}</p>
        <p className="text-sm font-black text-slate-900 italic tracking-tighter leading-none mt-0.5">{val}</p>
     </div>
  </div>
);

const FlowPill = ({ n, t, icon: Icon }: any) => (
  <div className="bg-white/5 border border-white/5 p-6 rounded-[32px] flex flex-col items-center gap-4 group hover:bg-indigo-600 transition-all duration-500 border border-white/5">
     <span className="text-[10px] font-black text-indigo-500 group-hover:text-white uppercase tracking-widest">Step {n}</span>
     <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-white/10 transition-colors">
        <Icon size={24} className="text-white group-hover:scale-110 transition-transform" />
     </div>
     <h4 className="text-[10px] font-black text-white uppercase italic tracking-[0.1em] text-center">{t}</h4>
  </div>
);

export default Landing;
