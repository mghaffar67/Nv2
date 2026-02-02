import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  ShieldCheck, 
  Headphones, 
  ArrowRight, 
  CheckCircle2, 
  Star, 
  Zap, 
  BarChart3, 
  LayoutDashboard,
  Menu,
  X,
  TrendingUp,
  Wallet,
  ChevronRight,
  Shield,
  Smartphone,
  Trophy,
  Award,
  Sparkles,
  CreditCard
} from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { useConfig } from '../context/ConfigContext';
import LivePayoutTicker from '../components/marketing/LivePayoutTicker';

const Landing = () => {
  const { config } = useConfig();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats = [
    { label: "Total Paid Out", value: "Rs. 12.8M+", icon: <BarChart3 className="w-5 h-5 text-emerald-500" /> },
    { label: "Members", value: "24.8k+", icon: <Users className="w-5 h-5 text-indigo-500" /> },
    { label: "Security", value: "OPERATIONAL", icon: <Shield className="w-5 h-5 text-sky-500" /> },
    { label: "Support", value: "24/7 LIVE", icon: <Headphones className="w-5 h-5 text-purple-500" /> },
  ];

  const plans = [
    { id: 1, name: "BASIC", price: 1000, daily: 240, color: "bg-indigo-600", badge: "ENTRY LEVEL", features: ["1 Daily Task", "EasyPaisa Support", "Level 1 Team Bonus"] },
    { id: 2, name: "STANDARD", price: 2000, daily: 480, color: "bg-emerald-600", badge: "POPULAR", features: ["2 Daily Tasks", "Fast Payout", "Level 2 Team Bonus"] },
    { id: 3, name: "GOLD ELITE", price: 3500, daily: 720, isPopular: true, color: "bg-purple-600", badge: "BEST VALUE", features: ["3 Daily Tasks", "Priority Support", "Level 3 Team Bonus"] },
    { id: 4, name: "DIAMOND", price: 6000, daily: 960, color: "bg-slate-900", badge: "PREMIUM", features: ["4 Daily Tasks", "Dedicated Manager", "Maximum Earning"] },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-100 overflow-x-hidden">
      <LivePayoutTicker />

      {/* --- NAVIGATION --- */}
      <nav className={clsx(
        "fixed top-8 left-0 w-full z-50 transition-all duration-500 px-6",
        isScrolled ? "top-4" : "top-8"
      )}>
        <div className={clsx(
          "max-w-6xl mx-auto flex justify-between items-center px-8 h-18 rounded-[28px] border transition-all duration-500",
          isScrolled ? "bg-white/80 backdrop-blur-xl border-slate-200 shadow-xl" : "bg-transparent border-transparent"
        )}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg text-white">
              <Zap size={18} fill="currentColor" />
            </div>
            <span className="text-lg font-black italic tracking-tighter uppercase">Noor<span className="text-indigo-600">HQ</span></span>
          </div>

          <div className="hidden md:flex items-center gap-10">
            <Link to="/payouts" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors">Payout History</Link>
            <Link to="/login" className="px-8 h-11 bg-slate-900 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
              Login Portal
            </Link>
          </div>

          <button className="md:hidden p-2 text-slate-500" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* --- HERO --- */}
      <section className="relative pt-48 pb-20 px-6 min-h-[90vh] flex items-center">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest">
              <Sparkles size={12} className="animate-pulse" /> Verified Earning Network Pakistan
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.9] text-slate-900">
              Earning <br /> Made <span className="text-indigo-600">Simple.</span>
            </h1>
            <p className="text-lg text-slate-500 max-w-lg leading-relaxed font-medium italic">
              Join thousands of students and professionals earning daily from their homes with secure EasyPaisa and JazzCash withdrawals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register" className="h-16 px-10 bg-indigo-600 text-white rounded-[22px] font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-2xl flex items-center justify-center gap-3">
                Join Today <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="h-16 px-10 bg-white border border-slate-200 text-slate-600 rounded-[22px] font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                Member Login
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative hidden lg:block">
            <div className="w-[320px] mx-auto bg-white border-[10px] border-slate-900 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden h-[600px] relative">
               <div className="h-full w-full bg-slate-50 p-6 pt-12 space-y-6">
                  <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[24px] p-6 text-white shadow-xl">
                    <p className="text-[8px] font-black uppercase tracking-widest opacity-60 mb-1">Total Reward</p>
                    <h3 className="text-2xl font-black italic tracking-tighter mb-4">Rs. 1,550</h3>
                    <div className="flex gap-2">
                       <div className="h-8 w-8 bg-white/10 rounded-lg flex items-center justify-center"><TrendingUp size={14}/></div>
                       <div className="h-8 w-8 bg-white/10 rounded-lg flex items-center justify-center"><Wallet size={14}/></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                     {[1,2,3].map(i => (
                       <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><CheckCircle2 size={16}/></div>
                             <div className="w-20 h-2 bg-slate-100 rounded-full" />
                          </div>
                          <span className="text-[10px] font-black text-emerald-600">+Rs 240</span>
                       </div>
                     ))}
                  </div>
               </div>
               {/* Floating Success Pill */}
               <div className="absolute bottom-10 -right-4 bg-white p-4 rounded-2xl shadow-2xl border border-slate-50 flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white"><ShieldCheck size={18}/></div>
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase">Withdrawal</p>
                    <p className="text-[10px] font-black">Paid Successfully</p>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- STATS GRID --- */}
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5 italic">{stat.label}</p>
                  <h4 className="text-lg font-black text-slate-900 tracking-tight">{stat.value}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- EARNING STATIONS --- */}
      <section id="plans" className="py-24 px-6 bg-slate-50/50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-2">
            <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase text-slate-900">Choose Your <span className="text-indigo-600">Station.</span></h2>
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Select an earning capacity that fits you</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div key={plan.id} className={clsx(
                "bg-white rounded-[40px] p-8 border transition-all flex flex-col relative group",
                plan.isPopular ? "border-indigo-600 shadow-2xl scale-[1.02] z-10" : "border-slate-100 shadow-sm hover:border-slate-200"
              )}>
                {plan.isPopular && (
                  <div className="absolute top-0 right-10 bg-indigo-600 text-[7px] font-black text-white px-4 py-1.5 rounded-b-xl uppercase tracking-widest">Recommended</div>
                )}
                <div className="mb-8">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">{plan.badge}</p>
                  <h4 className="text-xl font-black italic mb-4">{plan.name}</h4>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs font-black text-slate-300">Rs.</span>
                    <span className="text-4xl font-black tracking-tighter text-slate-900">{plan.price.toLocaleString()}</span>
                  </div>
                </div>

                <div className={clsx("p-4 rounded-2xl text-center mb-8", plan.isPopular ? "bg-indigo-50" : "bg-slate-50")}>
                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Daily Yield</p>
                   <p className="text-xl font-black text-indigo-600">Rs {plan.daily}</p>
                </div>

                <ul className="space-y-4 mb-10 flex-grow">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                       <CheckCircle2 size={14} className="text-indigo-600 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>

                <Link to="/register" className={clsx(
                  "h-14 w-full rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95",
                  plan.isPopular ? "bg-indigo-600 text-white shadow-xl shadow-indigo-200" : "bg-slate-900 text-white"
                )}>
                  Activate Station <ChevronRight size={14}/>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-slate-100 py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
           <div className="space-y-4 max-w-xs">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg text-white"><Zap size={20} fill="currentColor"/></div>
                 <span className="text-2xl font-black tracking-tighter uppercase italic">Noor<span className="text-indigo-600">HQ</span></span>
              </div>
              <p className="text-[11px] font-bold text-slate-400 uppercase leading-relaxed tracking-widest italic">Pakistan's Trusted Micro-Work Gateway. Built for community growth and financial independence.</p>
           </div>
           
           <div className="grid grid-cols-2 gap-20">
              <div className="space-y-4">
                 <h5 className="text-[11px] font-black uppercase text-slate-900 italic tracking-widest">Protocol</h5>
                 <ul className="space-y-2">
                    <li><Link to="/payouts" className="text-[10px] font-bold text-slate-500 hover:text-indigo-600 uppercase">Live Registry</Link></li>
                    <li><Link to="/support" className="text-[10px] font-bold text-slate-500 hover:text-indigo-600 uppercase">Help Node</Link></li>
                 </ul>
              </div>
              <div className="space-y-4">
                 <h5 className="text-[11px] font-black uppercase text-slate-900 italic tracking-widest">Security</h5>
                 <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                    <ShieldCheck size={20} className="text-indigo-600" />
                    <p className="text-[8px] font-black text-slate-500 uppercase leading-none">256-Bit <br/> Encrypted</p>
                 </div>
              </div>
           </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-50 text-center">
           <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">© 2024 Noor Official Hub. Build v3.30.0-PRO</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;