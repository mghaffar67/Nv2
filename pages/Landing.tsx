
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Zap, Award, Star, Users, 
  TrendingUp, Coins, Diamond, ShieldCheck, 
  Activity, MessageCircle, LogIn, ChevronRight,
  UserPlus, Cpu, Wallet, Quote
} from 'lucide-react';
import { clsx } from 'clsx';
import { useConfig } from '../context/ConfigContext';
import LivePayoutTicker from '../components/marketing/LivePayoutTicker';

const AutoCounter = ({ start, increment, prefix = "", suffix = "" }: any) => {
  const [count, setCount] = useState(start);
  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev: number) => prev + Math.floor(Math.random() * increment));
    }, 4000);
    return () => clearInterval(timer);
  }, [increment]);
  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
};

const Landing = () => {
  const { config } = useConfig();
  const slides = config.appearance.heroSlides;
  const heroImage = slides[0]?.image || "https://images.unsplash.com/photo-1611974714603-3555366b3b5e?q=80&w=800";

  return (
    <div className="overflow-hidden bg-[#f8f9fb] font-sans pb-12">
      <LivePayoutTicker />
      
      {/* 1. HERO */}
      <section className="relative min-h-[45vh] md:min-h-[55vh] flex items-center overflow-hidden bg-slate-950">
        <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-indigo-500/10 blur-[80px] rounded-full" />
        <div className="max-w-7xl mx-auto w-full px-6 py-8 md:py-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex-1 text-center md:text-left text-white space-y-4">
              <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 px-3 py-1 rounded-full text-[7px] font-black uppercase tracking-widest text-indigo-400">
                <ShieldCheck size={9} /> NOOR OFFICIAL V3
              </div>
              <h1 className="text-4xl md:text-7xl font-black leading-[0.9] tracking-tighter uppercase italic">
                Earn <span className="text-indigo-500">More.</span><br/>Work <span className="text-sky-400 font-light text-2xl md:text-6xl">Simple.</span>
              </h1>
              <p className="text-slate-400 text-[10px] md:text-xs font-bold max-w-sm leading-relaxed uppercase tracking-widest opacity-60">
                Pakistan's #1 Digital Earning Platform. Get paid daily to your EasyPaisa or JazzCash.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <Link to="/register" className="bg-indigo-600 text-white h-11 px-6 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2 active:scale-95 transition-all">
                  Join Now <ArrowRight size={12} />
                </Link>
                <Link to="/login" className="bg-white/5 border border-white/10 text-white h-11 px-6 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                  Member Login
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. STATS */}
      <section className="py-4 bg-white border-b border-slate-100">
         <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
            <StatPill label="Total Members" icon={Users} color="text-indigo-600 bg-indigo-50">
               <AutoCounter start={12450} increment={2} suffix="+" />
            </StatPill>
            <StatPill label="Total Profit" icon={TrendingUp} color="text-emerald-600 bg-emerald-50">
               <AutoCounter start={85200} increment={110} prefix="Rs " />
            </StatPill>
            <StatPill label="Active Users" icon={Activity} color="text-sky-600 bg-sky-50">
               <AutoCounter start={3120} increment={1} />
            </StatPill>
            <StatPill label="Total Paid" icon={Coins} color="text-amber-600 bg-amber-50">
               <AutoCounter start={15420500} increment={540} prefix="Rs " />
            </StatPill>
         </div>
      </section>

      {/* 3. WORK PROCESS */}
      <section className="py-12 px-4 bg-[#fcfdfe]">
         <div className="max-w-7xl mx-auto text-center mb-8">
            <h2 className="text-xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase italic">How it Works.</h2>
            <div className="h-0.5 w-10 bg-indigo-600 mx-auto rounded-full mt-2" />
         </div>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
            <WorkStep number="01" title="Register" icon={UserPlus} desc="Create your ID" delay={0.1} />
            <WorkStep number="02" title="Plan" icon={Cpu} desc="Choose Station" delay={0.2} />
            <WorkStep number="03" title="Work" icon={Zap} desc="Do Daily Tasks" delay={0.3} />
            <WorkStep number="04" title="Withdraw" icon={Wallet} desc="Get Cash Daily" delay={0.4} />
         </div>
      </section>

      {/* 4. PLANS */}
      <section className="py-12 px-4">
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 max-w-5xl mx-auto">
            <PlanCard name="BASIC" price="500" daily="50" icon={Star} color="text-slate-400" />
            <PlanCard name="STANDARD" price="1000" daily="100" icon={Zap} color="text-indigo-500" />
            <PlanCard name="GOLD ELITE" price="1500" daily="150" icon={Award} color="text-emerald-500" popular />
            <PlanCard name="DIAMOND" price="5000" daily="650" icon={Diamond} color="text-sky-500" />
         </div>
      </section>

      {/* 5. REVIEWS */}
      <section className="py-16 px-4 bg-slate-50 border-y border-slate-100 overflow-hidden">
         <div className="max-w-7xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-600 rounded-full text-[8px] font-black uppercase tracking-widest mb-4">
               <Star size={10} fill="currentColor" /> TESTIMONIALS
            </div>
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Trusted by Thousands.</h2>
         </div>

         <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 px-4">
            {(config.appearance.reviews || []).map((review, i) => (
               <motion.div 
                 key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                 className="min-w-[280px] md:min-w-[320px] bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm relative"
               >
                  <div className="absolute top-4 right-6 text-slate-50 opacity-10"><Quote size={48} fill="currentColor" /></div>
                  <div className="flex gap-1 mb-4">
                     {[...Array(review.rating)].map((_, j) => <Star key={j} size={10} className="fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium italic leading-relaxed mb-6 h-12 line-clamp-3">"{review.comment}"</p>
                  <div className="flex items-center gap-3 border-t border-slate-50 pt-4">
                     <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-sky-400 font-black italic">{review.name.charAt(0)}</div>
                     <div>
                        <h4 className="text-[10px] font-black text-slate-900 uppercase">{review.name}</h4>
                        <p className="text-[7px] font-bold text-emerald-500 uppercase">Verified User</p>
                     </div>
                  </div>
               </motion.div>
            ))}
         </div>
      </section>
    </div>
  );
};

const WorkStep = ({ number, title, icon: Icon, desc, delay }: any) => (
  <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay }} viewport={{ once: true }} className="bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center text-center group">
     <div className="text-[8px] font-black text-indigo-300 mb-2">{number}</div>
     <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center text-indigo-600 mb-3"><Icon size={18} /></div>
     <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-tight mb-1">{title}</h4>
     <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">{desc}</p>
  </motion.div>
);

const StatPill = ({ label, icon: Icon, color, children }: any) => (
  <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
     <div className={clsx("w-8 h-8 rounded-lg flex items-center justify-center shadow-inner shrink-0", color)}><Icon size={16} /></div>
     <div className="overflow-hidden">
        <p className="text-[6px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1 truncate">{label}</p>
        <p className="text-xs font-black text-slate-900 italic leading-none">{children}</p>
     </div>
  </div>
);

const PlanCard = ({ name, price, daily, icon: Icon, color, popular }: any) => (
  <div className={clsx("bg-white p-5 rounded-[28px] border transition-all relative overflow-hidden flex flex-col group", popular ? "border-indigo-500 ring-4 ring-indigo-50/50" : "border-slate-100 shadow-sm")}>
     {popular && <div className="absolute top-3 right-3 bg-indigo-600 text-white px-2 py-0.5 rounded-full text-[5px] font-black uppercase tracking-widest">Hot</div>}
     <div className={clsx("w-8 h-8 rounded-lg bg-slate-50 shadow-inner flex items-center justify-center mb-4", color)}><Icon size={16} /></div>
     <h4 className="text-[9px] font-black text-slate-900 uppercase tracking-tighter italic mb-4 leading-none">{name} HUB</h4>
     <div className="space-y-1.5 mb-4">
        <div className="flex justify-between items-end border-b border-slate-50 pb-1">
           <span className="text-[6px] font-black text-slate-400 uppercase tracking-widest">Entry</span>
           <span className="text-[9px] font-black text-slate-900 italic">Rs {price}</span>
        </div>
        <div className="flex justify-between items-end">
           <span className="text-[6px] font-black text-slate-400 uppercase tracking-widest">Profit</span>
           <span className="text-[9px] font-black text-emerald-600 italic">Rs {daily}/Day</span>
        </div>
     </div>
     <Link to="/register" className={clsx("w-full h-9 rounded-lg font-black text-[7px] uppercase tracking-widest flex items-center justify-center gap-1 mt-auto", popular ? "bg-indigo-600 text-white" : "bg-slate-900 text-white")}>
       ACTIVATE <ChevronRight size={10} />
     </Link>
  </div>
);

export default Landing;
