
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, Zap, History, Banknote, 
  ArrowUpRight, Clock, CheckCircle2, 
  User, Award, Star, TrendingUp, BadgeCheck,
  ChevronLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { financeController } from '../../backend_core/controllers/financeController';

const LivePayouts = () => {
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayouts = async () => {
      setLoading(true);
      try {
        const res = await new Promise<any>(r => financeController.getAllWithdrawals({}, { status: () => ({ json: r }) }));
        // Only show approved payouts for public trust
        setPayouts((res || []).filter((p: any) => p.status === 'approved'));
      } finally {
        setLoading(false);
      }
    };
    fetchPayouts();
    window.scrollTo(0, 0);
  }, []);

  const stats = useMemo(() => ({
    totalPaid: payouts.reduce((a, b) => a + Number(b.amount), 0),
    count: payouts.length
  }), [payouts]);

  return (
    <div className="min-h-screen bg-[#f8f9fb] pb-24">
      {/* 1. HERO HEADER */}
      <section className="bg-slate-950 text-white pt-16 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none -translate-x-1/4 translate-y-1/4"></div>
        
        <div className="max-w-4xl mx-auto relative z-10 text-center space-y-6">
           <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-all font-black uppercase text-[10px] tracking-widest mb-4">
              <ChevronLeft size={16} /> Platform Home
           </Link>
           <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border border-emerald-500/30">
              <ShieldCheck size={12} className="animate-pulse" /> VERIFIED PAYOUT LOGS
           </div>
           <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.9]">
             Real Proof. <br/><span className="text-emerald-400">Real Earnings.</span>
           </h1>
           <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] md:text-sm max-w-xl mx-auto leading-relaxed">
             Transparency is our core protocol. View live successful withdrawals processed by our financial automation nodes.
           </p>

           <div className="grid grid-cols-2 gap-4 pt-8">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-[32px] text-center">
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Success Ratio</p>
                 <p className="text-3xl font-black text-emerald-400">100%</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-[32px] text-center">
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">System Load</p>
                 <p className="text-3xl font-black text-indigo-400">Stable</p>
              </div>
           </div>
        </div>
      </section>

      {/* 2. LIVE FEED SECTION */}
      <section className="max-w-3xl mx-auto -mt-12 px-4 space-y-4">
        {loading ? (
          <div className="py-24 text-center">
             <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Auditing Live Node Feed...</p>
          </div>
        ) : payouts.length === 0 ? (
          <div className="bg-white p-20 rounded-[44px] border border-slate-100 shadow-sm text-center flex flex-col items-center">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6 shadow-inner"><History size={40} /></div>
             <p className="text-slate-300 font-black text-xs uppercase tracking-[0.2em]">Live Feed Idle. Check back shortly.</p>
          </div>
        ) : (
          payouts.map((p, idx) => (
            <motion.div 
              key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
              className="bg-white p-6 rounded-[40px] border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-xl hover:scale-[1.02] transition-all"
            >
               <div className="flex items-center gap-4 overflow-hidden">
                  <div className="w-14 h-14 rounded-[22px] bg-slate-900 text-white flex items-center justify-center font-black italic text-xl shadow-lg shrink-0 border border-white/10 group-hover:rotate-6 transition-transform">
                     {p.userName?.charAt(0)}
                  </div>
                  <div className="overflow-hidden">
                     <div className="flex items-center gap-2 mb-1.5">
                        <h4 className="font-black text-slate-900 text-sm truncate uppercase">{p.userName}</h4>
                        <div className="flex items-center gap-1 bg-green-50 text-green-600 px-2 py-0.5 rounded-full text-[6px] font-black uppercase border border-green-100">
                           <BadgeCheck size={8} /> Verified
                        </div>
                     </div>
                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-2">
                        <Zap size={10} className="text-indigo-400" /> PKR {p.amount?.toLocaleString()}
                        <span className="text-slate-200">•</span>
                        <span>{p.gateway} Node</span>
                     </p>
                  </div>
               </div>

               <div className="text-right shrink-0">
                  <div className="flex items-center gap-1.5 justify-end mb-1 text-emerald-500">
                     <CheckCircle2 size={14} />
                     <span className="text-[10px] font-black uppercase tracking-widest">Processed</span>
                  </div>
                  <p className="text-[8px] font-black text-slate-300 uppercase italic">{new Date(p.timestamp || p.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • {p.date}</p>
               </div>
            </motion.div>
          ))
        )}
        
        <div className="text-center pt-8">
           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.4em] italic mb-8">End of Public Log Node</p>
           <Link to="/register" className="h-16 px-12 bg-indigo-600 text-white rounded-[28px] font-black text-xs uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all inline-flex items-center gap-3">
              Start Your Journey <ArrowUpRight size={18} />
           </Link>
        </div>
      </section>

      {/* 3. TRUST BANNER */}
      <section className="max-w-4xl mx-auto px-6 pt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
         <TrustPill icon={Award} title="Verified Payments" desc="Manual and automated verification by core team." />
         <TrustPill icon={Star} title="Transparency" desc="Open logs of all successful system outflows." />
         <TrustPill icon={ShieldCheck} title="Security" desc="Encrypted financial tunnels for all associates." />
      </section>
    </div>
  );
};

const TrustPill = ({ icon: Icon, title, desc }: any) => (
  <div className="text-center space-y-3">
     <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center mx-auto text-indigo-600">
        <Icon size={24} />
     </div>
     <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{title}</h4>
     <p className="text-[9px] font-bold text-slate-400 leading-relaxed px-4">{desc}</p>
  </div>
);

export default LivePayouts;
