
import React, { useState } from 'react';
import { useConfig } from '../../../context/ConfigContext';
import { 
  Palette, Zap, Save, RefreshCw, Type, 
  ShieldCheck, Monitor, Users, TrendingUp, 
  Image as ImageIcon, Globe, Lock, Upload
} from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const GeneralSettings = () => {
  const { config, updateConfig } = useConfig();
  const [logoPreview, setLogoPreview] = useState(config.branding?.logo || '');

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'siteIcon') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (type === 'logo') setLogoPreview(base64);
        updateConfig({ branding: { ...config.branding, [type]: base64 } } as any);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReferralChange = (key: string, value: string) => {
    updateConfig({
      referralSettings: { ...config.referralSettings, [key]: Number(value) }
    });
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-20 relative px-1 md:px-0">
      
      <div className="flex justify-between items-end px-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none italic">System Core.</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px] mt-2">Identity & Economic Configuration</p>
        </div>
        <button onClick={() => alert('Branding Synced!')} className="bg-slate-950 text-white h-12 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-2xl active:scale-95 transition-all">
          <Save size={14} /> Commit Changes
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 items-start">
        
        {/* 1. BRANDING HUB */}
        <div className="space-y-4 md:space-y-6">
           <section className="bg-white p-6 md:p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 flex items-center gap-2">
                <Globe size={16} /> Platform Identity
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="relative group text-center">
                    <div className="w-full h-24 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden transition-all group-hover:border-indigo-400">
                       {logoPreview ? (
                         <img src={logoPreview} className="w-full h-full object-contain" />
                       ) : (
                         <ImageIcon size={24} className="text-slate-300" />
                       )}
                       <input type="file" onChange={e => handleLogoUpload(e, 'logo')} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    </div>
                    <p className="text-[7px] font-black text-slate-400 uppercase mt-2 tracking-widest">Primary Logo</p>
                 </div>
                 
                 <div className="relative group text-center">
                    <div className="w-full h-24 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden transition-all group-hover:border-sky-400">
                       {config.branding?.siteIcon ? (
                         <img src={config.branding.siteIcon} className="w-12 h-12 object-contain" />
                       ) : (
                         <ImageIcon size={24} className="text-slate-300" />
                       )}
                       <input type="file" onChange={e => handleLogoUpload(e, 'siteIcon')} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    </div>
                    <p className="text-[7px] font-black text-slate-400 uppercase mt-2 tracking-widest">Site Favicon</p>
                 </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-50">
                 <div className="space-y-1.5">
                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-3">Copyright Footer Text</label>
                    <input 
                      type="text" 
                      value={config.branding?.copyright || '© 2024 Noor Official'} 
                      onChange={e => updateConfig({ branding: { ...config.branding, copyright: e.target.value } } as any)}
                      className="w-full h-11 px-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-[10px] text-slate-600 outline-none focus:bg-white" 
                    />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-3">App Public Title</label>
                    <input 
                      type="text" value={config.appName} onChange={e => updateConfig({ appName: e.target.value })}
                      className="w-full h-11 px-4 bg-slate-50 border border-slate-100 rounded-xl font-black text-xs text-slate-800 outline-none focus:bg-white" 
                    />
                 </div>
              </div>
           </section>

           <section className="bg-white p-6 md:p-8 rounded-[40px] border border-slate-100 shadow-sm">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-6 flex items-center gap-2">
              <Palette size={16} /> Identity Node
            </h2>
            <div className="grid grid-cols-2 gap-3">
               <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-2">Primary</label>
                  <input type="color" value={config.theme.primaryColor} onChange={(e) => updateConfig({ theme: { ...config.theme, primaryColor: e.target.value } })} className="w-full h-10 p-1 bg-white border border-slate-100 rounded-lg cursor-pointer" />
               </div>
               <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-2">Secondary</label>
                  <input type="color" value={config.theme.secondaryColor} onChange={(e) => updateConfig({ theme: { ...config.theme, secondaryColor: e.target.value } })} className="w-full h-10 p-1 bg-white border border-slate-100 rounded-lg cursor-pointer" />
               </div>
            </div>
          </section>
        </div>

        {/* 2. NETWORK PARAMETERS */}
        <div className="space-y-4 md:space-y-6">
           <section className="bg-white p-6 md:p-8 rounded-[40px] border border-slate-100 shadow-sm">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-6 flex items-center gap-2">
                <Users size={16} /> Commission Economics
              </h2>
              <div className="space-y-6">
                 {[
                   { label: 'Level 1 (Direct)', key: 'level1Percent', color: 'text-indigo-500' },
                   { label: 'Level 2 (Indirect)', key: 'level2Percent', color: 'text-sky-500' },
                 ].map((tier) => (
                   <div key={tier.key} className="space-y-2">
                      <div className="flex justify-between items-center px-2">
                         <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{tier.label}</label>
                         <span className={clsx("text-[11px] font-black", tier.color)}>{(config.referralSettings as any)[tier.key]}%</span>
                      </div>
                      <input 
                        type="range" min="0" max="50" 
                        value={(config.referralSettings as any)[tier.key]} 
                        onChange={(e) => handleReferralChange(tier.key, e.target.value)}
                        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-slate-900"
                      />
                   </div>
                 ))}
              </div>
           </section>

           <section className="bg-slate-950 p-8 rounded-[44px] text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 scale-150 rotate-12"><Lock size={64}/></div>
              <h4 className="text-xl font-black italic tracking-tighter uppercase mb-4">Registry Lock.</h4>
              <p className="urdu-text text-[11px] text-slate-400 font-bold leading-relaxed mb-10">
                سیستم میں کسی بھی قسم کی تبدیلی سے پہلے ڈیٹا کا بیک اپ لے لیں۔ لوگو اور برانڈنگ تبدیلی فورا لائیو ہو جائے گی۔
              </p>
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[8px] font-black uppercase text-slate-500 tracking-[0.2em]">Node-Ex Guard Active</span>
              </div>
           </section>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
