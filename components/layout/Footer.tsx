
import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-white py-6 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-sky-500 rounded-lg flex items-center justify-center text-white shadow-lg">
            <Zap size={12} fill="currentColor" />
          </div>
          <span className="text-xs font-black tracking-tighter italic">Noor<span className="text-sky-500">Official.</span></span>
          <span className="h-3 w-[1px] bg-white/10 mx-2" />
          <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">v3.25.0 Build</p>
        </div>

        <div className="flex items-center gap-6">
          <Link to="/pages/privacy" className="text-[8px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-all">Privacy</Link>
          <Link to="/pages/terms" className="text-[8px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-all">Terms</Link>
          <Link to="/support" className="text-[8px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-all">Support</Link>
        </div>

        <div className="flex items-center gap-2 text-slate-500 text-[8px] font-bold uppercase tracking-widest">
          <ShieldCheck size={10} className="text-green-500" /> Secure Protocol © 2026
        </div>
      </div>
    </footer>
  );
};

export default Footer;
