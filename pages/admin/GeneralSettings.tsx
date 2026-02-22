
import React, { useState } from 'react';
import { useConfig } from '../../context/ConfigContext';
import { Palette, Zap, Save, RefreshCw, Type, Coins, Star, Trophy, Target, ShieldCheck, Gem, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

// Fix: Define URDU_DAYS constant used for streak labels in the settings view
const URDU_DAYS = [
  "Pehla Din", "Dosra Din", "Teesra Din", 
  "Chotha Din", "Panchwa Din", "Chata Din", "Bumper Inaam"
];

const GeneralSettings = () => {
  const { config, updateConfig } = useConfig();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRewardChange = (index: number, value: string) => {
    const newRewards = [...config.streakRewards];
    newRewards[index] = Number(value);
    updateConfig({ streakRewards: newRewards });
  };

  const handleSave = () => {
    setLoading(true);
    // Registry sync simulation
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 800);
  };

  const fontOptions = [
    { label: 'Inter (Modern)', value: "'Inter', sans-serif" },
    { label: 'Plus Jakarta (Elite)', value: "'Plus Jakarta Sans', sans-serif" },
    { label: 'Montserrat (Premium)', value: "'Montserrat', sans-serif" }
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto px-1 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2 pt-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">System <span className="text-indigo-600">Config.</span></h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px] mt-2 flex items-center gap-2 italic">
             <ShieldCheck size={14} className="text-indigo-600" /> Executive Platform Control Node
          </p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-slate-950 text-white h-12 md:h-14 px-8 md:px-10 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-2xl active:scale-95 transition-all"
        >
          {loading ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />} 
          Push Protocol Changes
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Visual Identity Hub */}
        <div className="xl:col-span-7 space-y-6">
          <section className="bg-white p-7 md:p-10 rounded-[44px] border border-slate-100 shadow-sm space-y-8">
            <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 flex items-center gap-3">
              <Palette size={16} className="text-indigo-500" /> Identity Architecture
            </h2>
            
            <div className="space-y-6">
              <div className="space-y-1.5 px-1">
                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Platform Name Node</label>
                <input 
                  type="text" 
                  value={config.appName}
                  onChange={(e) => updateConfig({ appName: e.target.value })}
                  className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl font-black text-base md:text-lg outline-none focus:ring-8 focus:ring-indigo-50/50 transition-all shadow-inner focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5 px-1">
                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Primary Brand Node (Hex)</label>
                  <div className="flex gap-3">
                    <input 
                      type="color" 
                      value={config.theme.primaryColor}
                      onChange={(e) => updateConfig({ theme: { ...config.theme, primaryColor: e.target.value } })}
                      className="w-12 h-12 p-1 bg-white border border-slate-100 rounded-xl cursor-pointer shadow-sm"
                    />
                    <input 
                      type="text" 
                      value={config.theme.primaryColor}
                      onChange={(e) => updateConfig({ theme: { ...config.theme, primaryColor: e.target.value } })}
                      className="flex-grow h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl font-mono text-[10px] uppercase font-black text-slate-700 outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1.5 px-1">
                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Global Typography</label>
                  <div className="relative">
                    <select 
                      value={config.theme.fontFamily}
                      onChange={(e) => updateConfig({ theme: { ...config.theme, fontFamily: e.target.value } })}
                      className="w-full h-12 px-6 bg-slate-50 border border-slate-100 rounded-xl font-black text-[9px] uppercase tracking-widest outline-none appearance-none cursor-pointer focus:bg-white transition-all shadow-inner"
                    >
                      {fontOptions.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                    </select>
                    <Type size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-indigo-500 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="bg-slate-900 rounded-[44px] p-10 text-white relative overflow-hidden shadow-2xl border border-white/5 group">
             <div className="absolute top-0 right-0 p-10 opacity-5 scale-[2] rotate-12"><Zap size={100} /></div>
             <h3 className="text-xl font-black mb-1 uppercase italic tracking-tighter text-sky-400 leading-none">UI Probe Terminal.</h3>
             <p className="text-slate-400 text-[8px] font-bold uppercase tracking-widest mb-8 leading-relaxed max-w-xs">Audit branding nodes before production deployment.</p>
             
             <div className="grid grid-cols-2 gap-4 relative z-10">
                <div className="p-6 rounded-[32px] border border-white/5 bg-white/5 backdrop-blur-2xl shadow-2xl">
                   <div className="w-10 h-10 rounded-[14px] mb-5 flex items-center justify-center shadow-xl" style={{ backgroundColor: config.theme.primaryColor }}>
                      <Zap size={20} className="text-white" fill="currentColor"/>
                   </div>
                   <h4 className="font-black text-[10px] uppercase italic tracking-tight text-white mb-2 leading-none">Cluster Card</h4>
                   <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden mb-3"><div className="h-full bg-emerald-500" style={{ width: '75%' }} /></div>
                   <p className="text-[7px] font-bold text-slate-500 uppercase tracking-widest leading-none">Sync Verified</p>
                </div>
                <div className="p-6 rounded-[32px] border border-white/5 bg-white/5 backdrop-blur-2xl shadow-2xl flex flex-col justify-center gap-3">
                   <button className="h-10 w-full rounded-xl font-black text-[8px] uppercase tracking-[0.2em] shadow-xl" style={{ backgroundColor: config.theme.primaryColor }}>Protocol On</button>
                   <button className="h-10 w-full rounded-xl border border-white/10 bg-white/5 font-black text-[8px] uppercase tracking-[0.2em] text-slate-400">Abort</button>
                </div>
             </div>
          </div>
        </div>

        {/* Gamification Hub */}
        <div className="xl:col-span-5 space-y-6">
           <section className="bg-white p-7 md:p-10 rounded-[44px] border border-slate-100 shadow-sm space-y-8">
              <div className="flex items-center justify-between">
                 <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 flex items-center gap-3">
                   <Trophy size={16} className="text-amber-500" /> Yield Loop Matrix
                 </h2>
                 <span className="text-[7px] font-black uppercase tracking-[0.3em] bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md border border-indigo-100">7 Nodes</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium px-1 leading-relaxed">
                Configure the PKR disbursement values for the 7-day synchronized claim cycle. Node 7 is the Bumper Hub.
              </p>

              <div className="grid grid-cols-1 gap-3">
                 {config.streakRewards.map((reward, i) => (
                   <motion.div 
                     key={i} 
                     className="flex items-center gap-4 p-3.5 bg-slate-50 rounded-[24px] border border-slate-100 group transition-all hover:bg-white hover:shadow-lg focus-within:bg-white focus-within:shadow-xl focus-within:border-indigo-100"
                   >
                      <div className={clsx(
                        "w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs italic shadow-inner transition-colors",
                        i === 6 ? "bg-amber-100 text-amber-600" : "bg-white text-slate-300 group-focus-within:bg-indigo-600 group-focus-within:text-white"
                      )}>
                        {i === 6 ? <Gem size={18} /> : i + 1}
                      </div>
                      <div className="flex-grow space-y-1">
                         <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 font-black text-[10px]">Rs</span>
                            <input 
                              type="number" 
                              value={reward}
                              onChange={(e) => handleRewardChange(i, e.target.value)}
                              className="w-full h-10 pl-9 pr-4 bg-white border border-slate-200 rounded-xl font-black text-sm text-slate-800 outline-none focus:border-indigo-500 transition-all shadow-inner"
                            />
                         </div>
                      </div>
                      {/* Fix: Access constant URDU_DAYS defined at file scope */}
                      <div className="text-[7px] font-black uppercase text-slate-300 tracking-[0.2em] pr-2 shrink-0 italic">{URDU_DAYS[i]}</div>
                   </motion.div>
                 ))}
              </div>
           </section>

           <div className="bg-amber-50 p-8 rounded-[40px] border border-amber-100 shadow-inner relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 scale-150 text-amber-500"><Target size={32} /></div>
              <h4 className="font-black text-amber-900 text-[11px] mb-3 flex items-center gap-3 uppercase italic leading-none">
                <RefreshCw size={14} className="text-amber-600" /> Persistence Sync
              </h4>
              <p className="text-amber-800 text-[9px] font-bold leading-relaxed uppercase tracking-widest italic opacity-80">
                Protocols reset Associate Streaks to <span className="underline decoration-amber-500">Node 1</span> if 48 hours pass without a manual claim signature.
              </p>
           </div>
        </div>
      </div>

      <AnimatePresence>
        {success && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl z-[100] flex items-center gap-3 border-2 border-white/20">
             <CheckCircle2 size={18} /> Ecosystem Hub Synchronized
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GeneralSettings;
