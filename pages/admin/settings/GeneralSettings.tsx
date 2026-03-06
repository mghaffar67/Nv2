import React, { useState } from 'react';
import { useConfig } from '../../../context/ConfigContext';
import { 
  Palette, Zap, Save, RefreshCw, Type, 
  ShieldCheck, Image as ImageIcon, Smartphone, MessageCircle, HelpCircle,
  FileText, Layers, Globe
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
    <div className="space-y-8 pb-20 relative px-1 md:px-0 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200 pb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Global <span className="text-indigo-600">Hub</span></h2>
          <p className="text-sm text-slate-500 mt-2 flex items-center gap-2">
             <Globe size={16} className="text-indigo-500" /> Manage Branding & Contacts
          </p>
        </div>
        <button onClick={handleSave} className="h-11 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm flex items-center gap-2 shadow-sm transition-colors">
          <Save size={18} /> Save All Settings
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        <div className="space-y-6">
           <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8">
              <div className="flex items-center gap-2 mb-2">
                <ImageIcon size={18} className="text-indigo-500" />
                <h3 className="text-base font-bold text-slate-900">Assets & Branding</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="relative group text-center">
                    <div className="w-full h-32 rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden transition-all group-hover:border-indigo-400">
                       {logoPreview ? <img src={logoPreview} className="w-full h-full object-contain p-4" /> : <ImageIcon size={32} className="text-slate-300" />}
                       <input type="file" onChange={e => handleFileUpload(e, 'logo')} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    </div>
                    <p className="text-xs font-medium text-slate-500 mt-3">Company Logo</p>
                 </div>
                 <div className="relative group text-center">
                    <div className="w-full h-32 rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden transition-all group-hover:border-indigo-400">
                       {config.appearance.companyBanner ? <img src={config.appearance.companyBanner} className="w-full h-full object-cover" /> : <ImageIcon size={32} className="text-slate-300" />}
                       <input type="file" onChange={e => handleFileUpload(e, 'banner')} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    </div>
                    <p className="text-xs font-medium text-slate-500 mt-3">Home Banner</p>
                 </div>
              </div>
           </section>

           <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={18} className="text-indigo-500" />
                <h3 className="text-base font-bold text-slate-900">Submission Protocol</h3>
              </div>
              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 ml-1">Work Evidence Mode</label>
                    <div className="grid grid-cols-3 gap-3">
                       {['single_image', 'multi_image', 'auto_pdf'].map((mode) => (
                         <button
                           key={mode}
                           onClick={() => updateConfig({ submissionMode: mode as any })}
                           className={clsx(
                             "py-2.5 rounded-lg border text-xs font-medium transition-all",
                             config.submissionMode === mode ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                           )}
                         >
                           {mode.replace('_', ' ')}
                         </button>
                       ))}
                    </div>
                 </div>
                 <p className="text-xs text-slate-500 ml-1">
                   {config.submissionMode === 'auto_pdf' ? 'Images will be converted to PDF on client side.' : 'Users will upload raw images.'}
                 </p>
              </div>
           </section>
        </div>

        <div className="space-y-6">
           <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8">
              <div className="flex items-center gap-2 mb-2">
                <Palette size={18} className="text-indigo-500" />
                <h3 className="text-base font-bold text-slate-900">Theme & Font</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-slate-700 ml-1">Theme Color</label>
                   <div className="flex items-center gap-3">
                     <input type="color" value={config.theme.primaryColor} onChange={e => updateConfig({ theme: { ...config.theme, primaryColor: e.target.value } } as any)} className="w-12 h-12 p-1 bg-white border border-slate-200 rounded-lg cursor-pointer shadow-sm" />
                     <span className="text-sm font-mono text-slate-500">{config.theme.primaryColor}</span>
                   </div>
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-slate-700 ml-1">Global Font</label>
                   <select value={config.theme.fontFamily} onChange={e => updateConfig({ theme: { ...config.theme, fontFamily: e.target.value } } as any)} className="w-full h-11 px-4 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all appearance-none">
                       <option value="'Inter', sans-serif">Inter (Modern)</option>
                       <option value="'Poppins', sans-serif">Poppins (Soft)</option>
                       <option value="'Montserrat', sans-serif">Montserrat (Premium)</option>
                    </select>
                 </div>
              </div>
           </section>

           <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle size={18} className="text-indigo-500" />
                <h3 className="text-base font-bold text-slate-900">Official Contacts</h3>
              </div>
              <div className="space-y-6">
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-slate-700 ml-1">WhatsApp Official Link</label>
                   <input type="text" value={config.branding?.supportPhone} onChange={e => updateConfig({ branding: { ...config.branding, supportPhone: e.target.value } } as any)} className="w-full h-11 px-4 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" placeholder="e.g., https://wa.me/1234567890" />
                 </div>
                 <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <HelpCircle size={16} />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-slate-900 block">Show Help Section</span>
                        <span className="text-xs text-slate-500">Display help resources to users</span>
                      </div>
                    </div>
                    <button onClick={() => updateConfig({ modules: { ...config.modules, showHelpSection: !config.modules.showHelpSection } } as any)} className={clsx("w-11 h-6 rounded-full relative flex items-center px-1 transition-colors", config.modules.showHelpSection ? "bg-indigo-600" : "bg-slate-300")}>
                       <motion.div animate={{ x: config.modules.showHelpSection ? 20 : 0 }} className="w-4 h-4 bg-white rounded-full shadow-sm" />
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