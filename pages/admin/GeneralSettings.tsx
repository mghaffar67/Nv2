
import React from 'react';
import { useConfig } from '../../context/ConfigContext';
import { Palette, Zap, Save, RefreshCw, Type } from 'lucide-react';
import { motion } from 'framer-motion';

const GeneralSettings = () => {
  const { config, updateConfig } = useConfig();

  const handleRewardChange = (index: number, value: string) => {
    const newRewards = [...config.streakRewards];
    newRewards[index] = Number(value);
    updateConfig({ streakRewards: newRewards });
  };

  const fontOptions = [
    { label: 'Open Sans (Modern)', value: "'Open Sans', sans-serif" },
    { label: 'Roboto (Clean)', value: "'Roboto', sans-serif" },
    { label: 'Montserrat (Premium)', value: "'Montserrat', sans-serif" },
    { label: 'Poppins (Soft)', value: "'Poppins', sans-serif" }
  ];

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Configuration</h1>
          <p className="text-slate-400 font-medium">Global platform control, branding, and rewards.</p>
        </div>
        <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-slate-200">
          <Save size={16} /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Branding & Theme */}
        <div className="lg:col-span-7 space-y-8">
          <section className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-300 mb-8 flex items-center gap-2">
              <Palette size={16} /> Identity & Aesthetics
            </h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Platform Title</label>
                <input 
                  type="text" 
                  value={config.appName}
                  onChange={(e) => updateConfig({ appName: e.target.value })}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-black focus:ring-4 focus:ring-sky-50 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Primary Color (Hex)</label>
                  <div className="flex gap-3">
                    <input 
                      type="color" 
                      value={config.theme.primaryColor}
                      onChange={(e) => updateConfig({ theme: { ...config.theme, primaryColor: e.target.value } })}
                      className="w-14 h-14 p-1 bg-white border border-slate-100 rounded-2xl cursor-pointer"
                    />
                    <input 
                      type="text" 
                      value={config.theme.primaryColor}
                      onChange={(e) => updateConfig({ theme: { ...config.theme, primaryColor: e.target.value } })}
                      className="flex-grow p-4 bg-slate-50 border border-slate-100 rounded-2xl font-mono text-sm uppercase font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Secondary Color</label>
                  <div className="flex gap-3">
                    <input 
                      type="color" 
                      value={config.theme.secondaryColor}
                      onChange={(e) => updateConfig({ theme: { ...config.theme, secondaryColor: e.target.value } })}
                      className="w-14 h-14 p-1 bg-white border border-slate-100 rounded-2xl cursor-pointer"
                    />
                    <input 
                      type="text" 
                      value={config.theme.secondaryColor}
                      onChange={(e) => updateConfig({ theme: { ...config.theme, secondaryColor: e.target.value } })}
                      className="flex-grow p-4 bg-slate-50 border border-slate-100 rounded-2xl font-mono text-sm uppercase font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">System Typography</label>
                <div className="relative">
                  <select 
                    value={config.theme.fontFamily}
                    onChange={(e) => updateConfig({ theme: { ...config.theme, fontFamily: e.target.value } })}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-black outline-none appearance-none"
                  >
                    {fontOptions.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                  </select>
                  <Type size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
                </div>
              </div>
            </div>
          </section>

          {/* Real-time Component Preview */}
          <div className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 p-10 opacity-5 scale-[2]"><Palette size={64} /></div>
             <h3 className="text-xl font-black mb-1">Live Theme Preview</h3>
             <p className="text-slate-400 text-xs mb-8">This is how your selected colors will look on User Portal.</p>
             
             <div className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md">
                   <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Earning Station</p>
                   <h4 className="font-bold text-sm mb-4">Daily Assignments</h4>
                   <button className="px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest" style={{ backgroundColor: config.theme.primaryColor }}>
                     Activate
                   </button>
                </div>
                <div className="p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md">
                   <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Team Growth</p>
                   <h4 className="font-bold text-sm mb-4">Referral Bonus</h4>
                   <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black" style={{ backgroundColor: config.theme.secondaryColor }}>
                     50
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Right: Gamification & Logic */}
        <div className="lg:col-span-5 space-y-8">
           <section className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-300 mb-8 flex items-center gap-2">
                <Zap size={16} /> Daily Streak Rewards
              </h2>
              <p className="text-[11px] text-slate-500 mb-8 leading-relaxed">
                Configure exactly how much PKR users receive for checking in daily. Day 7 is traditionally the "Bumper" day.
              </p>

              <div className="space-y-4">
                 {config.streakRewards.map((reward, i) => (
                   <div key={i} className="flex items-center gap-4 group">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-slate-400 text-xs border border-slate-100 group-focus-within:bg-slate-900 group-focus-within:text-white transition-all">
                        {i + 1}
                      </div>
                      <div className="flex-grow relative">
                         <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-xs">Rs</span>
                         <input 
                           type="number" 
                           value={reward}
                           onChange={(e) => handleRewardChange(i, e.target.value)}
                           className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl font-black text-slate-800 outline-none focus:border-slate-900 transition-all"
                         />
                      </div>
                      <div className="text-[9px] font-black uppercase text-slate-300 tracking-widest">Day Reward</div>
                   </div>
                 ))}
              </div>
           </section>

           <div className="bg-amber-50 p-8 rounded-[40px] border border-amber-100">
              <h4 className="font-black text-amber-900 mb-4 flex items-center gap-2">
                <RefreshCw size={16} /> 48h Logic Status
              </h4>
              <p className="text-amber-700 text-xs font-medium leading-relaxed">
                The current system automatically resets streaks to <b>Day 1</b> if a user fails to check in for more than 48 hours. This encourages high daily retention.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
