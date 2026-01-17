
import React from 'react';
import { useConfig } from '../../../context/ConfigContext';
import { Palette, Zap, Save, RefreshCw, Type, ShieldCheck, Monitor, Users, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const GeneralSettings = () => {
  const { config, updateConfig } = useConfig();

  const handleRewardChange = (index: number, value: string) => {
    const newRewards = [...config.streakRewards];
    newRewards[index] = Number(value);
    updateConfig({ streakRewards: newRewards });
  };

  const handleReferralChange = (key: string, value: string) => {
    updateConfig({
      referralSettings: { ...config.referralSettings, [key]: Number(value) }
    });
  };

  const fonts = [
    { name: 'Modern Sans', value: "'Inter', sans-serif" },
    { name: 'Premium Serif', value: "'Poppins', sans-serif" },
    { name: 'Corporate Bold', value: "'Montserrat', sans-serif" }
  ];

  return (
    <div className="space-y-6 md:space-y-8 pb-20 relative px-1 md:px-0">
      
      <div className="flex justify-between items-end px-2">
        <div>
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">System Core</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] mt-2">Manage infrastructure and aesthetics.</p>
        </div>
        <button onClick={() => alert('Global Config Synchronized!')} className="bg-slate-950 text-white px-6 md:px-10 py-3.5 md:py-4 rounded-xl md:rounded-[24px] font-black text-[9px] md:text-[11px] uppercase tracking-widest flex items-center gap-2 shadow-2xl active:scale-95 transition-all">
          <Save size={14} /> Commit Changes
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8 items-start">
        
        {/* REFERRAL ENGINE CONFIG */}
        <div className="space-y-6 md:space-y-8">
           <section className="bg-white p-6 md:p-10 rounded-[44px] border border-slate-100 shadow-sm">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-8 flex items-center gap-2">
                <Users size={18} /> Network Economics
              </h2>
              <div className="space-y-6">
                 {[
                   { label: 'Direct Referral (Level 1)', key: 'level1Percent', color: 'text-indigo-500' },
                   { label: 'Secondary (Level 2)', key: 'level2Percent', color: 'text-sky-500' },
                   { label: 'Tertiary (Level 3)', key: 'level3Percent', color: 'text-emerald-500' }
                 ].map((tier) => (
                   <div key={tier.key} className="space-y-2">
                      <div className="flex justify-between items-center px-3">
                         <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{tier.label}</label>
                         <span className={clsx("text-xs font-black", tier.color)}>{(config.referralSettings as any)[tier.key]}%</span>
                      </div>
                      <div className="relative">
                         <input 
                           type="range" min="0" max="50" 
                           value={(config.referralSettings as any)[tier.key]} 
                           onChange={(e) => handleReferralChange(tier.key, e.target.value)}
                           className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-900"
                         />
                      </div>
                   </div>
                 ))}
                 <div className="pt-4 border-t border-slate-50">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Signup Reward (PKR)</label>
                    <input 
                      type="number" 
                      value={config.referralSettings.signupBonus} 
                      onChange={(e) => handleReferralChange('signupBonus', e.target.value)}
                      className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl font-black text-sm text-slate-800 outline-none mt-2" 
                    />
                 </div>
              </div>
           </section>

           <section className="bg-white p-6 md:p-10 rounded-[44px] border border-slate-100 shadow-sm">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-8 flex items-center gap-2">
              <Palette size={18} /> Branding & Aesthetics
            </h2>
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">App Public Title</label>
                <input type="text" value={config.appName} onChange={(e) => updateConfig({ appName: e.target.value })} className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-[22px] font-black text-sm text-slate-800 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Primary Accent</label>
                  <input type="color" value={config.theme.primaryColor} onChange={(e) => updateConfig({ theme: { ...config.theme, primaryColor: e.target.value } })} className="w-full h-12 p-1 bg-white border border-slate-100 rounded-xl cursor-pointer" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Secondary Shade</label>
                  <input type="color" value={config.theme.secondaryColor} onChange={(e) => updateConfig({ theme: { ...config.theme, secondaryColor: e.target.value } })} className="w-full h-12 p-1 bg-white border border-slate-100 rounded-xl cursor-pointer" />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* REWARD & RETENTION LOGIC */}
        <div className="space-y-6 md:space-y-8">
           <section className="bg-white p-6 md:p-10 rounded-[44px] border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-300 flex items-center gap-2"><Zap size={18} /> Consistency Rewards</h2>
                <div className="bg-sky-50 px-4 py-1 rounded-full text-[9px] font-black text-sky-600 uppercase border border-sky-100">7-Day Tier</div>
              </div>
              <div className="space-y-3">
                 {config.streakRewards.map((reward, i) => (
                   <div key={i} className="flex items-center gap-4 group">
                      <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center font-black text-white text-xs shrink-0">{i + 1}</div>
                      <div className="flex-grow relative">
                         <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 font-black text-sm italic">Rs</div>
                         <input type="number" value={reward} onChange={(e) => handleRewardChange(i, e.target.value)} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-slate-800 text-sm outline-none focus:ring-4 focus:ring-sky-50 transition-all" />
                      </div>
                   </div>
                 ))}
              </div>
           </section>

           <div className="bg-[#fffbeb] p-8 rounded-[40px] border border-amber-100 flex gap-6 items-start shadow-sm">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-amber-500 shadow-sm shrink-0"><RefreshCw size={24} /></div>
              <div>
                <h4 className="font-black text-amber-900 text-sm mb-1.5 uppercase tracking-tighter">Automatic System Flush</h4>
                <p className="text-amber-700 text-[10px] font-medium leading-relaxed">Streaks reset to <b>Day 1</b> if partners miss a 48-hour check-in session. This ensures consistent platform participation.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
