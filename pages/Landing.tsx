import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Zap, Award, Star, Users, 
  TrendingUp, Coins, Image as ImageIcon, CheckCircle2, Diamond,
  Quote
} from 'lucide-react';
import { clsx } from 'clsx';
import { useConfig } from '../context/ConfigContext';
import LivePayoutTicker from '../components/marketing/LivePayoutTicker';
import { api } from '../utils/api';

const Landing = () => {
  const { config } = useConfig();
  const [activeSlide, setActiveSlide] = useState(0);
  const [seo, setSeo] = useState<any>(null);
  const slides = config.appearance.heroSlides;

  useEffect(() => {
    const fetchSEO = async () => {
      try {
        const data = await api.get('/system/public/seo');
        setSeo(data);
        
        if (data.siteTitle) document.title = data.siteTitle;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && data.metaDescription) {
          metaDesc.setAttribute('content', data.metaDescription);
        }
      } catch (err) {
        console.warn("Public SEO node offline.");
      }
    };
    fetchSEO();

    const timer = setInterval(() => {
      if (slides.length > 0) {
        setActiveSlide((prev) => (prev + 1) % slides.length);
      }
    }, 8000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const heroTitle = seo?.heroTitle || slides[activeSlide]?.title || config.appearance.heroTitle;
  const heroSubtitle = seo?.heroSubtitle || slides[activeSlide]?.subtitle || config.appearance.heroSubtitle;
  const heroImage = seo?.heroImage || slides[activeSlide]?.image;

  return (
    <div className="overflow-hidden bg-[#f8f9fb]">
      <LivePayoutTicker />
      
      {/* HERO SECTION - RESPONSIVE & DYNAMIC */}
      <section className="relative min-h-[70vh] md:min-h-[85vh] flex items-center overflow-hidden bg-slate-950 z-10">
        <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-indigo-600/10 blur-[80px] md:blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-sky-500/10 blur-[80px] md:blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-7xl mx-auto w-full px-4 md:px-6 py-8 md:py-24">
          <div className="flex flex-col-reverse md:flex-row items-center gap-8 md:gap-20">
            
            {/* TEXT CONTENT */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }} 
              animate={{ opacity: 1, x: 0 }} 
              className="flex-1 text-center md:text-left text-white z-20"
            >
              <div className="inline-flex items-center gap-1 bg-indigo-600 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest mb-4 md:mb-6 shadow-2xl border border-white/10">
                <CheckCircle2 size={10} fill="currentColor" /> {config.appName.toUpperCase()} OFFICIAL
              </div>
              
              <h1 className="text-3xl md:text-7xl font-black mb-4 md:mb-6 leading-[1.1] tracking-tighter uppercase italic">
                {heroTitle}
              </h1>
              
              <p className="text-slate-400 text-[10px] md:text-lg font-medium mb-8 md:mb-10 max-w-xl leading-relaxed mx-auto md:mx-0 uppercase tracking-widest opacity-80">
                {heroSubtitle}
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-3 md:gap-4">
                <Link to="/register" className="bg-white text-slate-950 h-12 md:h-16 px-8 md:px-10 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest shadow-2xl flex items-center justify-center gap-2 group active:scale-95 transition-all">
                  Get Started <ArrowRight size={14} className="group-hover:translate-x-1" />
                </Link>
                <Link to="/login" className="bg-white/5 backdrop-blur-xl border border-white/10 text-white h-12 md:h-16 px-6 md:px-8 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 hover:bg-white/10">
                  Portal Access <Zap size={14} fill="currentColor" className="text-sky-400" />
                </Link>
              </div>
            </motion.div>

            {/* DYNAMIC IMAGE - MOBILE COMPACT */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 relative w-full max-w-[320px] md:max-w-none"
            >
              <div className="relative aspect-square md:aspect-[4/3] lg:aspect-square w-full rounded-[30px] md:rounded-[60px] overflow-hidden border-2 md:border-4 border-white/10 shadow-2xl bg-slate-900 group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-sky-500/20 z-10 pointer-events-none" />
                {heroImage ? (
                  <img 
                    src={heroImage} 
                    alt="Earning Experience" 
                    className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-700">
                    <ImageIcon size={48} />
                  </div>
                )}
                
                {/* Floating Stats */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute bottom-4 right-4 md:bottom-6 md:right-6 bg-white/10 backdrop-blur-md p-3 md:p-4 rounded-2xl md:rounded-3xl border border-white/10 z-20 hidden sm:block"
                >
                  <p className="text-[7px] md:text-[8px] font-black text-sky-400 uppercase tracking-widest mb-0.5 md:mb-1">Live Disbursed</p>
                  <p className="text-base md:text-xl font-black text-white italic">Rs. {config.appearance.siteStats.totalPaid}</p>
                </motion.div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-10 md:py-16 bg-white">
         <div className="max-w-5xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
               <LandingStat icon={Users} value={config.appearance.siteStats.totalMembers} label="Fleet Size" color="bg-slate-900" />
               <LandingStat icon={Coins} value={`Rs ${config.appearance.siteStats.totalPaid}`} label="Total Yield" color="bg-green-600" />
               <LandingStat icon={Award} value="24/7" label="Support Node" color="bg-indigo-600" />
               <LandingStat icon={TrendingUp} value={config.appearance.siteStats.activeUsers} label="Tracking" color="bg-sky-500" />
            </div>
         </div>
      </section>
      
      {/* PLANS PREVIEW - MOBILE SCALED CARDS */}
      <section className="py-12 md:py-24 px-4 md:px-6 bg-slate-50 border-y border-slate-100">
         <div className="max-w-7xl mx-auto text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic">Earning Nodes.</h2>
            <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-3 md:mt-4">Select your operational tier</p>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            <PlanNode name="BASIC TIER" price="500" daily="50" icon={Star} color="text-slate-400" />
            <PlanNode name="GOLD ELITE" price="1500" daily="150" icon={Award} color="text-amber-500" popular />
            <PlanNode name="DIAMOND CORE" price="5000" daily="650" icon={Diamond} color="text-sky-500" />
         </div>
      </section>

      {/* REVIEWS SECTION */}
      <section className="py-12 md:py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic">Member Intel.</h2>
            <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-3">Verified network feedback</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {config.appearance.reviews.map((review, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="bg-slate-50 p-6 md:p-10 rounded-[32px] md:rounded-[48px] border border-slate-100 relative group"
              >
                <Quote size={32} className="absolute top-6 right-6 text-slate-200 group-hover:text-indigo-100 transition-colors" />
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <Star key={j} size={10} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 text-xs md:text-base font-medium mb-6 italic leading-relaxed">
                  "{review.comment}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-black text-slate-500 text-[10px]">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-[10px] md:text-xs uppercase">{review.name}</p>
                    <p className="text-[7px] md:text-[8px] font-bold text-slate-400 uppercase tracking-widest">Verified Member</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto bg-slate-900 rounded-[40px] md:rounded-[60px] p-8 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-600/20 to-transparent pointer-events-none" />
          <h2 className="text-3xl md:text-5xl font-black mb-6 md:mb-8 tracking-tighter uppercase italic relative z-10">Start Your Earning <span className="text-sky-400">Node</span> Today.</h2>
          <p className="text-slate-400 text-[10px] md:text-sm font-bold uppercase tracking-widest mb-10 max-w-lg mx-auto leading-relaxed relative z-10">Join thousands of Pakistanis earning daily through simple, verified digital tasks.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            <Link to="/register" className="h-14 md:h-16 px-12 bg-white text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xl">
              Register Now <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

const LandingStat = ({ icon: Icon, value, label, color }: any) => (
  <div className="flex flex-col items-center text-center group">
     <div className={clsx("w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center text-white mb-3 md:mb-4 shadow-xl transition-transform group-hover:scale-110", color)}>
        <Icon size={18} className="md:size-24" />
     </div>
     <p className="text-base md:text-2xl font-black text-slate-900 tracking-tight">{value}</p>
     <p className="text-[7px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 md:mt-1">{label}</p>
  </div>
);

const PlanNode = ({ name, price, daily, icon: Icon, color, popular }: any) => (
  <Link to="/register" className={clsx(
    "bg-white p-6 md:p-10 rounded-[32px] md:rounded-[50px] border transition-all hover:scale-[1.02] active:scale-95 relative overflow-hidden",
    popular ? "border-indigo-500 shadow-2xl ring-4 md:ring-8 ring-indigo-50" : "border-slate-100 shadow-sm"
  )}>
     {popular && <div className="absolute -top-3 md:-top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 md:px-6 py-1 md:py-1.5 rounded-full text-[7px] md:text-[9px] font-black uppercase tracking-widest shadow-xl">Recommended</div>}
     <div className={clsx("w-10 h-10 md:w-16 md:h-16 rounded-2xl md:rounded-3xl bg-slate-50 flex items-center justify-center mb-6 md:mb-8", color)}><Icon size={20} className="md:size-32" /></div>
     <h4 className="text-lg md:text-2xl font-black text-slate-900 uppercase tracking-tight italic leading-tight">{name}</h4>
     <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-slate-50 space-y-3 md:space-y-4">
        <div className="flex justify-between items-end"><span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase">Entry</span><span className="text-sm md:text-lg font-black text-slate-900">Rs {price}</span></div>
        <div className="flex justify-between items-end"><span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase">Daily</span><span className="text-sm md:text-lg font-black text-green-600">Rs {daily}</span></div>
     </div>
  </Link>
);

export default Landing;