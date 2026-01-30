import React, { useState } from 'react';
import { useConfig } from '../../../context/ConfigContext';
import { 
  Palette, Zap, Save, RefreshCw, Type, 
  ShieldCheck, Image as ImageIcon, Smartphone, MessageCircle, HelpCircle,
  FileText, Layers
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
    alert('System Synchronized! 🚀');
    window.dispatchEvent(new Event('noor_db_update'));
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-20 relative px-1 md:px-0 animate-fade-in">
      <div className="flex justify-between items-end px-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none italic">Global Hub.</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px] mt-2">Manage Branding & Contacts</p>
        </div>
        <button onClick={handleSave} className="bg-slate-950 text-white h-12 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-2xl active:scale-95 transition-all"><Save size={14} /> Save All Settings</button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 items-start">
        <div className="space-y-6">
           <section className="bg-white p-6 md:p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 flex items-center gap-2"><ImageIcon size={16} /> Assets & Branding</h2>
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
                    <p className="text-[8px] font-black text-slate-400 uppercase mt-2">Home Banner</p>
                 </div>
              </div>
           </section>

           <section className="bg-white p-6 md:p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 flex items-center gap-2"><FileText size={16} /> Submission Protocol</h2>
              <div className="space-y-4">
                 <div className="space-y-1">
                    <label className="text-[8px] font-black text-slate-400 uppercase ml-3">Work Evidence Mode</label>
                    <div className="grid grid-cols-3 gap-2">
                       {['single_image', 'multi_image', 'auto_pdf'].map((mode) => (
                         <button
                           key={mode}
                           onClick={() => updateConfig({ submissionMode: mode as any })}
                           className={clsx(
                             "py-3 rounded-xl border-2 text-[8px] font-black uppercase transition-all",
                             config.submissionMode === mode ? "bg-slate-900 border-slate-900 text-white shadow-lg" : "bg-white border-slate-50 text-slate-300"
                           )}
                         >
                           {mode.replace('_', ' ')}
                         </button>
                       ))}
                    </div>
                 </div>
                 <p className="text-[8px] text-slate-400 font-bold uppercase italic px-2">
                   {config.submissionMode === 'auto_pdf' ? 'Images will be converted to PDF on client side.' : 'Users will upload raw images.'}
                 </p>
              </div>
           </section>
        </div>

        <div className="space-y-6">
           <section className="bg-white p-6 md:p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 flex items-center gap-2"><Palette size={16} /> Theme & Font</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-1.5"><label className="text-[8px] font-black text-slate-400 uppercase ml-2">Theme Color</label>
                 <input type="color" value={config.theme.primaryColor} onChange={e => updateConfig({ theme: { ...config.theme, primaryColor: e.target.value } } as any)} className="w-full h-12 p-1 bg-white border border-slate-100 rounded-2xl cursor-pointer shadow-sm" /></div>
                 <div className="space-y-1.5"><label className="text-[8px] font-black text-slate-400 uppercase ml-2">Global Font</label>
                 <select value={config.theme.fontFamily} onChange={e => updateConfig({ theme: { ...config.theme, fontFamily: e.target.value } } as any)} className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-[10px] appearance-none">
                       <option value="'Inter', sans-serif">Inter (Modern)</option>
                       <option value="'Poppins', sans-serif">Poppins (Soft)</option>
                       <option value="'Montserrat', sans-serif">Montserrat (Premium)</option>
                    </select></div>
              </div>
           </section>

           <section className="bg-white p-6 md:p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 flex items-center gap-2"><MessageCircle size={16} /> Official Contacts</h2>
              <div className="space-y-4">
                 <div className="space-y-1"><label className="text-[8px] font-black text-slate-400 uppercase ml-3">WhatsApp Official Link</label>
                 <input type="text" value={config.branding?.supportPhone} onChange={e => updateConfig({ branding: { ...config.branding, supportPhone: e.target.value } } as any)} className="w-full h-11 px-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs" /></div>
                 <div className="flex items-center justify-between p-4 bg-sky-50 rounded-2xl mt-2">
                    <div className="flex items-center gap-3"><HelpCircle size={18} className="text-sky-600" /><span className="text-[10px] font-black uppercase text-sky-900">Show Help Section</span></div>
                    <button onClick={() => updateConfig({ modules: { ...config.modules, showHelpSection: !config.modules.showHelpSection } } as any)} className={clsx("w-12 h-6 rounded-full relative flex items-center px-1", config.modules.showHelpSection ? "bg-sky-600" : "bg-slate-200")}>
                       <motion.div animate={{ x: config.modules.showHelpSection ? 24 : 0 }} className="w-4 h-4 bg-white rounded-full" />
                    </button>
                 </div>
              </div>
           </section>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;