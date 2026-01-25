
import React, { useState } from 'react';
import { useConfig } from '../../../context/ConfigContext';
import { 
  Palette, Zap, Save, RefreshCw, Type, 
  ShieldCheck, Monitor, Users, TrendingUp, 
  Image as ImageIcon, Globe, Lock, Upload, Smartphone, MessageCircle, HelpCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const GeneralSettings = () => {
  const { config, updateConfig } = useConfig();
  const [logoPreview, setLogoPreview] = useState(config.branding?.logo || '');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (type === 'logo') {
          setLogoPreview(base64);
          updateConfig({ branding: { ...config.branding, logo: base64 } } as any);
        } else {
          updateConfig({ appearance: { ...config.appearance, companyBanner: base64 } } as any);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    alert('Global Settings Synchronized! 🚀');
    window.dispatchEvent(new Event('noor_db_update'));
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-20 relative px-1 md:px-0 animate-fade-in">
      
      <div className="flex justify-between items-end px-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none italic">Global Hub.</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px] mt-2">Core Branding & Appearance Control</p>
        </div>
        <button onClick={handleSave} className="bg-slate-950 text-white h-12 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-2xl active:scale-95 transition-all">
          <Save size={14} /> Save Settings
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 items-start">
        
        {/* 1. BRANDING & MEDIA */}
        <div className="space-y-6">
           <section className="bg-white p-6 md:p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 flex items-center gap-2">
                <ImageIcon size={16} /> Assets & Media
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="relative group text-center">
                    <div className="w-full h-32 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden transition-all group-hover:border-indigo-400">
                       {logoPreview ? <img src={logoPreview} className="w-full h-full object-contain p-4" /> : <ImageIcon size={32} className="text-slate-200" />}
                       <input type="file" onChange={e => handleFileUpload(e, 'logo')} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    </div>
                    <p className="text-[8px] font-black text-slate-400 uppercase mt-2">Company Logo</p>
                 </div>
                 
                 <div className="relative group text-center">
                    <div className="w-full h-32 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden transition-all group-hover:border-sky-400">
                       {config.appearance.companyBanner ? <img src={config.appearance.companyBanner} className="w-full h-full object-cover" /> : <ImageIcon size={32} className="text-slate-200" />}
                       <input type="file" onChange={e => handleFileUpload(e, 'banner')} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    </div>
                    <p className="text-[8px] font-black text-slate-400 uppercase mt-2">App Banner</p>
                 </div>
              </div>
           </section>

           <section className="bg-white p-6 md:p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 flex items-center gap-2">
                <MessageCircle size={16} /> Contact & Support
              </h2>
              <div className="space-y-4">
                 <div className="space-y-1">
                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-3">WhatsApp Official Link</label>
                    <input type="text" value={config.contactInfo?.whatsapp} onChange={e => updateConfig({ contactInfo: { ...config.contactInfo, whatsapp: e.target.value } } as any)} className="w-full h-11 px-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs" />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-3">Support Phone Number</label>
                    <input type="text" value={config.contactInfo?.supportPhone} onChange={e => updateConfig({ contactInfo: { ...config.contactInfo, supportPhone: e.target.value } } as any)} className="w-full h-11 px-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs" />
                 </div>
                 <div className="flex items-center justify-between p-4 bg-sky-50 rounded-2xl border border-sky-100 mt-2">
                    <div className="flex items-center gap-3">
                       <HelpCircle size={18} className="text-sky-600" />
                       <span className="text-[10px] font-black uppercase text-sky-900 tracking-wider">Show Help Section</span>
                    </div>
                    <button onClick={() => updateConfig({ modules: { ...config.modules, showHelpSection: !config.modules.showHelpSection } } as any)} className={clsx("w-12 h-6 rounded-full relative flex items-center px-1", config.modules.showHelpSection ? "bg-sky-600" : "bg-slate-200")}>
                       <motion.div animate={{ x: config.modules.showHelpSection ? 24 : 0 }} className="w-4 h-4 bg-white rounded-full" />
                    </button>
                 </div>
              </div>
           </section>
        </div>

        {/* 2. THEME & TYPOGRAPHY */}
        <div className="space-y-6">
           <section className="bg-white p-6 md:p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 flex items-center gap-2">
                <Palette size={16} /> Appearance & Font
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-1.5">
                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-2">App Theme Color</label>
                    <input type="color" value={config.theme.primaryColor} onChange={e => updateConfig({ theme: { ...config.theme, primaryColor: e.target.value } } as any)} className="w-full h-12 p-1 bg-white border border-slate-100 rounded-2xl cursor-pointer shadow-sm" />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-2">Global Font</label>
                    <select value={config.theme.fontFamily} onChange={e => updateConfig({ theme: { ...config.theme, fontFamily: e.target.value } } as any)} className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-[10px] appearance-none">
                       <option value="'Inter', sans-serif">Inter (Standard)</option>
                       <option value="'Poppins', sans-serif">Poppins (Modern)</option>
                       <option value="'Montserrat', sans-serif">Montserrat (Premium)</option>
                       <option value="system-ui">System Default</option>
                    </select>
                 </div>
              </div>

              <div className="p-6 bg-slate-950 rounded-[32px] text-white overflow-hidden relative">
                 <div className="absolute top-0 right-0 p-6 opacity-10 rotate-12 scale-150"><Zap size={48} fill="currentColor"/></div>
                 <h4 className="text-lg font-black italic tracking-tighter uppercase mb-4" style={{ color: config.theme.primaryColor }}>Preview Node.</h4>
                 <p className="text-[11px] text-slate-400 font-bold uppercase leading-relaxed mb-6">Changing these settings will update the visual identity for all users instantly.</p>
                 <button className="h-10 px-6 rounded-xl font-black text-[9px] uppercase tracking-widest" style={{ backgroundColor: config.theme.primaryColor }}>Sample Button</button>
              </div>
           </section>

           <section className="bg-slate-50 p-8 rounded-[44px] border border-slate-200">
              <div className="flex items-center gap-4 mb-4">
                 <ShieldCheck size={24} className="text-indigo-600" />
                 <h4 className="text-sm font-black text-indigo-900 uppercase">Branding Security</h4>
              </div>
              <p className="text-[10px] text-indigo-700 font-bold uppercase tracking-widest leading-relaxed">Ensure high resolution assets for best display quality. Banners should be 1200x400 for optimal layout sync.</p>
           </section>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
