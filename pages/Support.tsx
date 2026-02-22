import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MessageCircle, 
  Mail, 
  Clock, 
  ShieldCheck, 
  ChevronRight,
  Headphones,
  Zap,
  Globe,
  Activity,
  Heart,
  // Added Users icon to fix the error
  Users
} from 'lucide-react';

const DynamicResponseTimer = () => {
  const [secs, setSecs] = useState(480); // Starts at 8 mins

  useEffect(() => {
    const int = setInterval(() => {
      setSecs(s => {
        const change = Math.floor(Math.random() * 5) - 2; // fluctuate
        return Math.max(120, s + change); // cap at 2 min minimum
      });
    }, 3000);
    return () => clearInterval(int);
  }, []);

  const mins = Math.floor(secs / 60);
  const displaySecs = secs % 60;

  return (
    <div className="flex flex-col">
       <div className="flex items-center gap-2 text-emerald-400">
          <motion.div 
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-2 h-2 bg-emerald-500 rounded-full"
          />
          <p className="text-[10px] font-black uppercase tracking-widest italic">Live Heartbeat Sync</p>
       </div>
       <p className="font-black text-xl md:text-3xl tracking-tighter leading-none mt-1">
         {mins}:{displaySecs.toString().padStart(2, '0')} <span className="text-sm text-slate-500 font-bold uppercase ml-1">Mins</span>
       </p>
    </div>
  );
};

const Support = () => {
  const [onlineStaff, setOnlineStaff] = useState(12);

  useEffect(() => {
    const int = setInterval(() => {
      setOnlineStaff(s => Math.max(8, s + (Math.random() > 0.5 ? 1 : -1)));
    }, 10000);
    return () => clearInterval(int);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-sky-400/5 blur-[120px] rounded-full pointer-events-none translate-x-1/4 -translate-y-1/4"></div>
      <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none -translate-x-1/4 translate-y-1/4"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 items-stretch relative z-10"
      >
        {/* Left Side: Brand & Value Prop */}
        <div className="bg-slate-900 rounded-[40px] md:rounded-[56px] p-8 md:p-14 text-white flex flex-col justify-between overflow-hidden relative shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          
          <div>
            <div className="w-14 h-14 md:w-20 md:h-20 bg-sky-500 rounded-[24px] md:rounded-[28px] flex items-center justify-center mb-6 md:mb-10 shadow-2xl shadow-sky-500/40 transform -rotate-6">
              <Headphones size={28} className="md:size-36 text-white" />
            </div>
            <h1 className="text-3xl md:text-5xl font-black mb-4 md:mb-8 leading-tight tracking-tighter uppercase italic leading-[0.9]">
              Noor Care. <br/><span className="text-sky-400">On Standby.</span>
            </h1>
            <p className="text-slate-400 text-sm md:text-base font-medium mb-8 md:mb-14 leading-relaxed max-w-md uppercase tracking-tight opacity-70 italic">
              Whether it's account recovery, payment status, or platform guidance—our manual audit team is ready to synchronize with your node.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 md:gap-8">
              <div className="flex items-center gap-5 group">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-sky-400 group-hover:bg-sky-500 group-hover:text-white transition-all shadow-xl">
                  <Activity size={24} />
                </div>
                <DynamicResponseTimer />
              </div>

              <div className="flex items-center gap-5 group">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-sky-400 group-hover:bg-sky-500 group-hover:text-white transition-all shadow-xl">
                  {/* Users icon is used here */}
                  <Users size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-0.5 italic">Authorized Staff Nodes</p>
                  </div>
                  <p className="font-black text-xl md:text-3xl tracking-tighter leading-none">{onlineStaff} <span className="text-sm text-slate-500 font-bold uppercase ml-1">Live Agents</span></p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 lg:mt-16 border-t border-white/5 pt-8">
            <Link to="/login" className="inline-flex items-center gap-2 text-sky-400 font-black uppercase text-[10px] tracking-[0.3em] hover:text-white transition-all group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Exit Support Portal
            </Link>
          </div>
        </div>

        {/* Right Side: Contact Infrastructure */}
        <div className="flex flex-col gap-4 md:gap-6 justify-center">
          <motion.a 
            whileHover={{ y: -5, scale: 1.01 }}
            href="https://wa.me/923068665907"
            target="_blank"
            className="group block bg-white p-6 md:p-10 rounded-[32px] md:rounded-[44px] shadow-sm border border-slate-100 hover:border-green-500 hover:shadow-2xl hover:shadow-green-100/30 transition-all"
          >
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-green-50 text-green-500 rounded-[20px] md:rounded-3xl flex items-center justify-center transition-all group-hover:bg-green-500 group-hover:text-white transform group-hover:rotate-6 shadow-inner">
                <MessageCircle size={24} />
              </div>
              <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-green-200">
                <Zap size={10} fill="currentColor" /> Instant Link
              </div>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-1.5 tracking-tight uppercase italic">WhatsApp Official.</h3>
            <p className="text-slate-500 text-xs md:text-sm font-medium mb-6 leading-relaxed uppercase tracking-tight opacity-70">Direct chat for rapid account recovery, payout verification, and node synchronization.</p>
            <div className="flex items-center gap-2 text-green-600 font-black uppercase text-[10px] tracking-[0.2em]">
              Start Secure Chat <ChevronRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
            </div>
          </motion.a>

          <motion.a 
            whileHover={{ y: -5, scale: 1.01 }}
            href="mailto:help@noorofficial.com"
            className="group block bg-white p-6 md:p-10 rounded-[32px] md:rounded-[44px] shadow-sm border border-slate-100 hover:border-sky-500 hover:shadow-2xl hover:shadow-sky-100/30 transition-all"
          >
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-sky-50 text-sky-500 rounded-[20px] md:rounded-3xl flex items-center justify-center transition-all group-hover:bg-sky-500 group-hover:text-white transform group-hover:-rotate-6 shadow-inner">
                <Mail size={24} />
              </div>
              <div className="bg-sky-100 text-sky-700 px-3 py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-sky-200">
                <Globe size={10} /> Formal Query
              </div>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-1.5 tracking-tight uppercase italic">Registry Support.</h3>
            <p className="text-slate-500 text-xs md:text-sm font-medium mb-6 leading-relaxed uppercase tracking-tight opacity-70">For formal inquiries, staff partnerships, or detailed technical bug reports.</p>
            <div className="flex items-center gap-2 text-sky-600 font-black uppercase text-[10px] tracking-[0.2em]">
              Compose Data Packet <ChevronRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
            </div>
          </motion.a>
          
          <div className="text-center pt-2 opacity-30">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] italic">Authorized Noor Core V3 Global Hub</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Support;