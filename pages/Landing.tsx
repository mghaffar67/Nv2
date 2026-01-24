
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Zap, Award, Star, Users, 
  TrendingUp, Coins, Diamond, ShieldCheck, 
  Activity, CheckCircle2, ChevronRight,
  UserPlus, Cpu, Wallet, Quote, MessageCircle, PlayCircle
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
      
      {/* HERO SECTION */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0 opacity-40">
           <img src={heroImage} className="w-full h-full object-cover" alt="Background" />
           <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        </div>
        
        <div className="max-w-7xl mx-auto w-full px-6 py-12 relative z-10">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="max-w-2xl text-white space-y-6">
              <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest text-indigo-400 backdrop-blur-md">
                <ShieldCheck size={10} /> NOOR OFFICIAL V3
              </div>
              <h1 className="text-5xl md:text-8xl font-black leading-[0.85] tracking-tighter uppercase italic">
                Earn <span className="text-indigo-500">Fast.</span><br/>Get Paid <span className="text-sky-400 font-light text-2xl md:text-7xl">Daily.</span>
              </h1>
              <p className="text-slate-400 text-xs md:text-sm font-bold max-w-md leading-relaxed uppercase tracking-widest opacity-80 urdu-text">
                پاکستان کا سب سے معتبر آن لائن ارننگ پلیٹ فارم۔ ابھی جوائن کریں اور روزانہ پیسے کمائیں۔
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Link to="/register" className="bg-indigo-600 text-white h-14 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center justify-center gap-2 active:scale-95 transition-all">
                  Join Now <ArrowRight size={16} />
                </Link>
                <Link to="/payouts" className="bg-white/10 backdrop-blur-md text-white border border-white/10 h-14 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all">
                  Payment Proofs <CheckCircle2 size={16} />
                </Link>
              </div>
          </motion.div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-12 px-4 max-w-7xl mx-auto -mt-10 relative z-20">
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Members" val="15k+" icon={Users} color="text-indigo-600" />
            <StatCard label="Total Paid" val="Rs. 8.5M" icon={Wallet} color="text-emerald-600" />
            <StatCard label="Daily Active" val="3200+" icon={Activity} color="text-sky-600" />
            <StatCard label="Trust Score" val="99%" icon={Star} color="text-amber-500" />
         </div>
      </section>

      {/* WORK FLOW SECTION */}
      <section className="py-16 px-4">
         <div className="max-w-7xl mx-auto text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase italic">How it works.</h2>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
            <ProcessStep n="01" icon={UserPlus} t="Register" d="Apna account banayein" />
            <ProcessStep n="02" icon={Cpu} t="Plan Select" d="Earning plan select karein" />
            <ProcessStep n="03" icon={Zap} t="Daily Tasks" d="Rozana asaan kaam karein" />
            <ProcessStep n="04" icon={Wallet} t="Cashout" d="Directly JazzCash/EasyPaisa" />
         </div>
      </section>

      {/* PLANS PREVIEW SECTION */}
      <section className="py-16 bg-slate-950 text-white px-4">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter mb-4">Earning Plans.</h2>
               <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Select your path to profit</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
               <PlanMini name="BASIC" price="500" daily="50" tasks="5" />
               <PlanMini name="STANDARD" price="1000" daily="100" tasks="10" featured />
               <PlanMini name="GOLD ELITE" price="1500" daily="150" tasks="15" />
            </div>
         </div>
      </section>

      {/* REVIEWS SECTION */}
      <section className="py-20 px-4">
         <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase italic text-center mb-12">User Reviews.</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {config.appearance.reviews.slice(0, 3).map((r, i) => (
                 <div key={i} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative group">
                    <Quote className="absolute top-6 right-8 text-indigo-50/50 size-12" />
                    <div className="flex gap-1 mb-4">
                       {[...Array(5)].map((_, j) => <Star key={j} size={10} className="fill-amber-400 text-amber-400" />)}
                    </div>
                    <p className="text-slate-600 font-medium italic mb-6 urdu-text leading-loose">"{r.comment}"</p>
                    <div className="flex items-center gap-3 border-t border-slate-50 pt-4">
                       <div className="w-10 h-10 bg-slate-950 text-sky-400 rounded-xl flex items-center justify-center font-black italic">{r.name.charAt(0)}</div>
                       <div>
                          <h4 className="text-xs font-black text-slate-900 uppercase">{r.name}</h4>
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Verified Earner</p>
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
  <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-4 group hover:border-indigo-200 transition-all">
     <div className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner", color, "bg-slate-50")}>
        <Icon size={24} />
     </div>
     <div>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-xl font-black text-slate-900 italic tracking-tight">{val}</p>
     </div>
  </div>
);

const ProcessStep = ({ n, icon: Icon, t, d }: any) => (
  <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm flex flex-col items-center text-center group hover:bg-slate-900 transition-all duration-500">
     <div className="text-[10px] font-black text-indigo-200 mb-6 group-hover:text-indigo-600 transition-colors">{n}</div>
     <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-indigo-600 mb-6 shadow-inner group-hover:bg-white group-hover:rotate-12 transition-all"><Icon size={32}/></div>
     <h4 className="text-sm font-black text-slate-900 uppercase mb-2 italic tracking-tight group-hover:text-white">{t}</h4>
     <p className="text-[10px] font-bold text-slate-400 uppercase group-hover:text-slate-500">{d}</p>
  </div>
);

const PlanMini = ({ name, price, daily, tasks, featured }: any) => (
  <div className={clsx(
    "p-8 rounded-[44px] border transition-all flex flex-col items-center text-center",
    featured ? "bg-indigo-600 border-indigo-500 shadow-2xl scale-105 z-10" : "bg-white/5 border-white/10 hover:border-white/20"
  )}>
     <h3 className="text-lg font-black uppercase italic mb-6">{name}</h3>
     <div className="mb-8">
        <span className="text-4xl font-black">Rs {price}</span>
        <p className="text-[9px] font-bold text-slate-500 uppercase mt-1">Validity: 30 Days</p>
     </div>
     <div className="space-y-3 mb-10 w-full">
        <div className="flex justify-between text-[10px] font-black uppercase border-b border-white/5 pb-2"><span>Daily Profit</span> <span>Rs {daily}</span></div>
        <div className="flex justify-between text-[10px] font-black uppercase border-b border-white/5 pb-2"><span>Tasks</span> <span>{tasks} Daily</span></div>
     </div>
     <Link to="/register" className={clsx(
       "w-full h-12 rounded-2xl font-black text-[10px] uppercase flex items-center justify-center gap-2",
       featured ? "bg-white text-indigo-600" : "bg-white/10 text-white hover:bg-white/20"
     )}>Select Plan <ChevronRight size={14}/></Link>
  </div>
);

export default Landing;
