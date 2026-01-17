
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Zap, CheckCircle2, DollarSign } from 'lucide-react';
import { useConfig } from '../../context/ConfigContext';

const LivePayoutTicker = () => {
  const { config } = useConfig();

  const fakePayouts = useMemo(() => {
    const prefixes = ['0300', '0345', '0312', '0321', '0301', '0344'];
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      user: `${prefixes[Math.floor(Math.random() * prefixes.length)]}***${Math.floor(10 + Math.random() * 90)}`,
      amount: Math.floor(500 + Math.random() * 5000),
      gateway: Math.random() > 0.5 ? 'EasyPaisa' : 'JazzCash'
    }));
  }, []);

  if (!config.appearance.showFakePayouts) return null;

  return (
    <div className="h-10 bg-slate-900 overflow-hidden flex items-center relative z-[60] border-b border-white/5">
      <div className="absolute left-0 top-0 h-full bg-indigo-600 flex items-center px-4 z-20 shadow-lg">
         <span className="text-[9px] font-black text-white uppercase tracking-widest whitespace-nowrap flex items-center gap-1.5">
           <Zap size={10} fill="currentColor" /> Live Payouts
         </span>
      </div>

      <div className="flex whitespace-nowrap animate-marquee items-center gap-12 pl-32">
        {[...fakePayouts, ...fakePayouts].map((p, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              User <span className="text-white">{p.user}</span> just received 
              <span className="text-green-400 ml-1.5 font-black">Rs {p.amount.toLocaleString()}</span> 
              <span className="text-slate-500 italic ml-1">via {p.gateway}</span>
            </span>
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
      `}} />
    </div>
  );
};

export default LivePayoutTicker;
