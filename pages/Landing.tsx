
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Zap, Award, Star, Users, 
  TrendingUp, Coins, PlayCircle, Wallet, Diamond, CheckCircle2, UserPlus, Image as ImageIcon
} from 'lucide-react';
import { clsx } from 'clsx';
import { useConfig } from '../context/ConfigContext';
import LivePayoutTicker from '../components/marketing/LivePayoutTicker';
import { api } from '../utils/api';

const Landing = () => {
  const { config } = useConfig();
  const [activeSlide, setActiveSlide] = useState(0);
  const [publicSeo, setPublicSeo] = useState<any>(null);
  const slides = config.appearance.heroSlides;

  useEffect(() => {
    // 1. Fetch Dynamic SEO Node
    const fetchSEO = async () => {
      try {
        const data = await api.get('/system/public/seo');
        setPublicSeo(data);
        
        // Manual SEO Injection
        if (data.siteTitle) document.title = data.siteTitle;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && data.metaDescription) metaDesc.setAttribute('content', data.metaDescription);
      } catch (err) {
        console.warn("Public SEO node offline.");
      }
    };
    fetchSEO();

    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % (slides.length || 1));
    }, 8000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const displayHeroTitle = publicSeo?.heroTitle || slides[activeSlide]?.title;
  const displayHeroSubtitle = publicSeo?.heroSubtitle || slides[activeSlide]?.subtitle;
  const displayHeroImage = publicSeo?.heroImage || slides[activeSlide]?.image;

  return (
    <div className="overflow-hidden bg-[#f8f9fb]">
      <LivePayoutTicker />
      
      {/* HERO SECTION - REFACTORED FOR RESPONSIVE SEO (Dynamic) */}
      <section className="relative min-h-[80vh] md:min-h-[85vh] flex flex-col md:flex-row items-center px-6 py-12 md:py-0 overflow-hidden bg-slate-950">
        
        {/* Background Ambient Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-500/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-20">
          
          {/* TEXT CONTENT NODES */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="text-center lg:text-left text-white"
          >
            <div className="inline-flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest mb-6 shadow-2xl border border-white/10">
              <CheckCircle2 size={12} fill="currentColor" /> {config.appName.toUpperCase()} OFFICIAL PLATFORM
            </div>
            
            <h1 className="text-4xl md:text-7xl font-black mb-6 leading-[1.1] tracking-tighter uppercase italic">
              {displayHeroTitle}
            </h1>
            
            <p className="text-slate-400 text-sm md:text-lg font-medium mb-10 max-w-xl leading-relaxed mx-auto lg:mx-0 uppercase tracking-widest opacity-80">
              {displayHeroSubtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3">
              <Link to="/register" className="bg-white text-slate-950 h-14 md:h-16 px-10 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 group active:scale-95 transition-all">
                Create Account <ArrowRight size={16} className="group-hover:translate-x-1" />
              </Link>
              <Link to="/login" className="bg-white/5 backdrop-blur-xl border border-white/10 text-white h-14 md:h-16 px-8 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 hover:bg-white/10">
                Portal Access <Zap size={16} fill="currentColor" className="text-sky-400" />
              </Link>
            </div>
          </motion.div>

          {/* DYNAMIC HERO IMAGE (MOBILE FIXED) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative flex justify-center lg:justify-end"
          >
             <div className="relative w-full max-w-[500px] aspect-square group">
                {/* Decorative Frame */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-sky-500/20 rounded-[60px] blur-2xl animate-pulse" />
                
                <div className="relative h-full w-full rounded-[60px] overflow-hidden border-4 border-white/10 shadow-2xl bg-slate-900 flex items-center justify-center">
                   {displayHeroImage ? (
                     <img 
                       src={displayHeroImage} 
                       alt="Earning Experience" 
                       className="w-full h-full object-cover transition-transform duration-[20s] group-hover:scale-110"
                     />
                   ) : (
                     <div className="flex flex-col items-center gap-4 text-slate-700">
                        <ImageIcon size={64} />
                        <p className="text-[10px] font-black uppercase tracking-widest">No Media Packet</p>
                     </div>
                   )}
                </div>

                {/* Floating UI Elements for high-tech feel */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }} 
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -top-6 -right-6 bg-white p-4 rounded-3xl shadow-2xl hidden md:block"
                >
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-white">
                        <Coins size={20} />
                      </div>
                      <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Daily Payout</p>
                        <p className="text-xs font-black text-slate-900">Verified</p>
                      </div>
                   </div>
                </motion.div>
             </div>
          </motion.div>

        </div>
      </section>

      {/* REMAINDER OF LANDING CONTENT */}
      <section className="py-12 bg-white">
         <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <LandingStat icon={Users} value={config.appearance.siteStats.totalMembers} label="Fleet Size" color="bg-slate-900" />
               <LandingStat icon={Coins} value={`Rs ${config.appearance.siteStats.totalPaid}`} label="Disbursed" color="bg-green-600" />
               <LandingStat icon={Award} value="24/7" label="Support Node" color="bg-indigo-600" />
               <LandingStat icon={TrendingUp} value={config.appearance.siteStats.activeUsers} label="Yield Tracking" color="bg-sky-500" />
            </div>
         </div>
      </section>
      
      <section className="py-20 px-6 bg-slate-50 border-y border-slate-100">
         <div className="max-w-7xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic">Earning Nodes.</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-3">Select a Tier to Begin Receiving Daily Assignments</p>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <PlanNode name="BASIC TIER" price="500" daily="50" icon={Star} color="text-slate-400" />
            <PlanNode name="GOLD ELITE" price="1500" daily="150" icon={Award} color="text-amber-500" popular />
            <PlanNode name="DIAMOND CORE" price="5000" daily="650" icon={Diamond} color="text-sky-500" />
         </div>
      </section>
    </div>
  );
};

const LandingStat = ({ icon: Icon, value, label, color }: any) => (
  <div className="bg-slate-50 p-6 rounded-[36px] border border-slate-100 flex flex-col items-center text-center group active:scale-95 transition-all">
     <div className={clsx("w-12 h-12 rounded-[20px] flex items-center justify-center text-white mb-4 shadow-xl", color)}>
        <Icon size={20} />
     </div>
     <p className="text-lg md:text-2xl font-black text-slate-900 tracking-tight leading-none">{value}</p>
     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">{label}</p>
  </div>
);

const PlanNode = ({ name, price, daily, icon: Icon, color, popular }: any) => (
  <Link to="/register" className={clsx(
    "bg-white p-10 rounded-[50px] border transition-all hover:scale-105 active:scale-95 relative",
    popular ? "border-indigo-500 shadow-2xl ring-8 ring-indigo-50" : "border-slate-100 shadow-sm"
  )}>
     {popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-6 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">Elite Choice</div>}
     <div className={clsx("w-16 h-16 rounded-[28px] bg-slate-50 flex items-center justify-center mb-8", color)}><Icon size={32} /></div>
     <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic">{name}</h4>
     <div className="mt-6 pt-6 border-t border-slate-50 space-y-3">
        <div className="flex justify-between items-end"><span className="text-[10px] font-black text-slate-400 uppercase">Cost</span><span className="text-lg font-black">Rs {price}</span></div>
        <div className="flex justify-between items-end"><span className="text-[10px] font-black text-slate-400 uppercase">Yield</span><span className="text-lg font-black text-green-600">Rs {daily}/Day</span></div>
     </div>
  </Link>
);

export default Landing;
