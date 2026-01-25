
import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Type, Check, Zap } from 'lucide-react';
import { useConfig } from '../../../context/ConfigContext';
import { clsx } from 'clsx';

const COLOR_PRESETS = [
  { id: 'indigo', color: '#6366f1', label: 'Indigo Night' },
  { id: 'emerald', color: '#10b981', label: 'Emerald Forest' },
  { id: 'rose', color: '#f43f5e', label: 'Rose Gold' },
  { id: 'amber', color: '#f59e0b', label: 'Amber Sun' },
  { id: 'sky', color: '#0ea5e9', label: 'Sky Blue' }
];

const FONT_PRESETS = [
  { id: 'inter', family: "'Inter', sans-serif", label: 'Inter (Modern)' },
  { id: 'poppins', family: "'Poppins', sans-serif", label: 'Poppins (Round)' },
  { id: 'montserrat', family: "'Montserrat', sans-serif", label: 'Montserrat (Premium)' },
  { id: 'roboto', family: "'Roboto', sans-serif", label: 'Roboto (Clean)' }
];

const AppearanceSettings = () => {
  const { config, updateConfig } = useConfig();

  const handleColorSelect = (color: string, preset: any) => {
    updateConfig({ theme: { ...config.theme, primaryColor: color, themePreset: preset.id } });
  };

  const handleFontSelect = (font: string) => {
    updateConfig({ theme: { ...config.theme, fontFamily: font } });
  };

  return (
    <div className="space-y-10 animate-fade-in">
      <h2 className="text-xl font-black text-slate-900 uppercase italic">Visual Appearance</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* COLOR SYSTEM */}
        <section className="space-y-6">
           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2">
             <Palette size={16}/> Brand Colors
           </label>
           <div className="grid grid-cols-1 gap-3">
             {COLOR_PRESETS.map((p) => (
               <button 
                 key={p.id}
                 onClick={() => handleColorSelect(p.color, p)}
                 className={clsx(
                   "p-4 rounded-2xl border-2 flex items-center justify-between transition-all group active:scale-95",
                   config.theme.themePreset === p.id ? "border-slate-900 bg-slate-50" : "border-slate-100 hover:border-slate-200"
                 )}
               >
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-lg shadow-lg" style={{ backgroundColor: p.color }} />
                     <span className="font-black text-[11px] uppercase text-slate-700">{p.label}</span>
                  </div>
                  {config.theme.themePreset === p.id && <div className="w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center"><Check size={14}/></div>}
               </button>
             ))}
           </div>
        </section>

        {/* TYPOGRAPHY SYSTEM */}
        <section className="space-y-6">
           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2">
             <Type size={16}/> Typography System
           </label>
           <div className="grid grid-cols-1 gap-3">
             {FONT_PRESETS.map((f) => (
               <button 
                 key={f.id}
                 onClick={() => handleFontSelect(f.family)}
                 className={clsx(
                   "p-5 rounded-2xl border-2 text-left transition-all group active:scale-95",
                   config.theme.fontFamily === f.family ? "border-slate-900 bg-slate-50" : "border-slate-100"
                 )}
                 style={{ fontFamily: f.family }}
               >
                  <div className="flex justify-between items-center mb-1">
                     <span className="text-sm font-bold text-slate-800">{f.label}</span>
                     {config.theme.fontFamily === f.family && <Check size={16} className="text-slate-900" />}
                  </div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest">ABCDEFGHIJK 123456789</p>
               </button>
             ))}
           </div>
        </section>
      </div>

      {/* PREVIEW BLOCK */}
      <div className="p-8 rounded-[40px] bg-slate-900 text-white relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12 scale-150"><Zap size={64}/></div>
         <h3 className="text-xl font-black mb-1 uppercase italic tracking-tighter" style={{ color: config.theme.primaryColor }}>Live UI Preview</h3>
         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-8">This is how your theme looks in real-time</p>
         
         <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
               <div className="w-10 h-10 rounded-xl mb-4 flex items-center justify-center shadow-lg" style={{ backgroundColor: config.theme.primaryColor }}>
                  <Zap size={20} className="text-white"/>
               </div>
               <h4 className="font-black text-sm uppercase italic">Sample Card</h4>
               <p className="text-[10px] text-slate-400 mt-2">Responsive interface design.</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl flex flex-col justify-center gap-4">
               <button className="h-10 w-full rounded-xl font-black text-[9px] uppercase tracking-widest" style={{ backgroundColor: config.theme.primaryColor }}>Primary Action</button>
               <button className="h-10 w-full rounded-xl border border-white/20 font-black text-[9px] uppercase tracking-widest">Secondary</button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AppearanceSettings;
