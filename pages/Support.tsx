
import React from 'react';
import { motion } from 'framer-motion';
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
  Globe
} from 'lucide-react';

const Support = () => {
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
            <h1 className="text-3xl md:text-5xl font-black mb-4 md:mb-8 leading-tight tracking-tighter">
              Noor Care. <span className="text-sky-400">We're on standby.</span>
            </h1>
            <p className="text-slate-400 text-sm md:text-lg font-medium mb-8 md:mb-14 leading-relaxed max-w-md">
              Whether it's account recovery, payment status, or guidance—our dedicated team ensures your journey is seamless.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 md:gap-8">
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/5 flex items-center justify-center text-sky-400 group-hover:bg-sky-500 group-hover:text-white transition-all">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-0.5">Average Response</p>
                  <p className="font-black text-sm md:text-xl">Within 10 Minutes</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/5 flex items-center justify-center text-sky-400 group-hover:bg-sky-500 group-hover:text-white transition-all">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-0.5">Verification Status</p>
                  <p className="font-black text-sm md:text-xl text-green-400">Secure & Verified</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 lg:mt-16">
            <Link to="/login" className="inline-flex items-center gap-2 text-sky-400 font-black uppercase text-[10px] tracking-[0.3em] hover:text-white transition-all">
              <ArrowLeft size={16} /> Exit Support Portal
            </Link>
          </div>
        </div>

        {/* Right Side: Contact Infrastructure */}
        <div className="flex flex-col gap-4 md:gap-6 justify-center">
          <motion.a 
            whileHover={{ y: -5, scale: 1.01 }}
            href="https://wa.me/923000000000"
            className="group block bg-white p-6 md:p-10 rounded-[32px] md:rounded-[44px] shadow-sm border border-slate-100 hover:border-green-500 hover:shadow-2xl hover:shadow-green-100/50 transition-all"
          >
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-green-50 text-green-500 rounded-[20px] md:rounded-3xl flex items-center justify-center transition-all group-hover:bg-green-500 group-hover:text-white transform group-hover:rotate-6">
                <MessageCircle size={24} md:size-30 />
              </div>
              <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                <Zap size={10} fill="currentColor" /> Instant Help
              </div>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-1.5 tracking-tight">WhatsApp Official</h3>
            <p className="text-slate-500 text-xs md:text-sm font-medium mb-6 leading-relaxed">Direct chat for rapid recovery, account unlocks, and payment verification.</p>
            <div className="flex items-center gap-2 text-green-600 font-black uppercase text-[10px] tracking-[0.2em]">
              Start Chat Now <ChevronRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
            </div>
          </motion.a>

          <motion.a 
            whileHover={{ y: -5, scale: 1.01 }}
            href="mailto:help@noorofficial.com"
            className="group block bg-white p-6 md:p-10 rounded-[32px] md:rounded-[44px] shadow-sm border border-slate-100 hover:border-sky-500 hover:shadow-2xl hover:shadow-sky-100/50 transition-all"
          >
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-sky-50 text-sky-500 rounded-[20px] md:rounded-3xl flex items-center justify-center transition-all group-hover:bg-sky-500 group-hover:text-white transform group-hover:-rotate-6">
                <Mail size={24} md:size-30 />
              </div>
              <div className="bg-sky-100 text-sky-700 px-3 py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                <Globe size={10} /> Tech Queries
              </div>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-1.5 tracking-tight">Email Support</h3>
            <p className="text-slate-500 text-xs md:text-sm font-medium mb-6 leading-relaxed">For formal inquiries, partnership requests, or technical reporting.</p>
            <div className="flex items-center gap-2 text-sky-600 font-black uppercase text-[10px] tracking-[0.2em]">
              Compose Message <ChevronRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
            </div>
          </motion.a>
          
          <div className="text-center pt-2 opacity-40">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">Official Noor Core V3 Support</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Support;
