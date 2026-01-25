
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, 
  Image as ImageIcon, 
  Phone, 
  MessageSquare, 
  Mail, 
  MapPin, 
  Camera, 
  Loader2, 
  CheckCircle2, 
  Zap,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { useConfig } from '../../../context/ConfigContext';
import { api } from '../../../utils/api';
import { clsx } from 'clsx';

const BrandingSettings = () => {
  const { config, updateConfig } = useConfig();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState<string | null>(config.branding?.logo || null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    appName: config.appName || "Noor V3",
    supportPhone: config.branding?.contactPhone || "",
    whatsappNumber: config.branding?.supportPhone || "",
    supportEmail: (config.branding as any)?.supportEmail || "help@noorofficial.com",
    address: (config.branding as any)?.officeAddress || "Main Boulevard, Lahore, Pakistan"
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const data = new FormData();
      data.append('appName', formData.appName);
      data.append('supportPhone', formData.supportPhone);
      data.append('whatsappNumber', formData.whatsappNumber);
      data.append('supportEmail', formData.supportEmail);
      data.append('address', formData.address);
      
      if (logoFile) {
        data.append('logo', logoFile);
      }

      // API Protocol: Multipart Update
      const res = await api.upload('/system/company-profile', data, 'PUT');
      
      if (res.success) {
        updateConfig(res.config);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err: any) {
      alert(err.message || "Registry Sync Failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-50 pb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Brand <span className="text-indigo-600">Configuration.</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-3 italic flex items-center gap-2">
            <ShieldCheck size={14} className="text-indigo-500" /> Identity Hub & Asset Management
          </p>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={loading}
          className="h-14 px-10 bg-slate-950 text-white rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl flex items-center gap-3 active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Save size={18} className="text-sky-400" />
          )}
          {loading ? 'Syncing...' : 'Save All Changes'}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: BRANDING ASSETS */}
        <div className="lg:col-span-5 space-y-6">
           <section className="bg-white p-8 rounded-[44px] border border-slate-100 shadow-sm space-y-8">
              <div className="text-center">
                 <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-300 mb-8 flex items-center justify-center gap-2">
                    <ImageIcon size={18} /> Official Identity
                 </h2>
                 
                 <div className="relative inline-block group mb-8">
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-40 h-40 rounded-[48px] bg-slate-50 border-4 border-white shadow-2xl flex items-center justify-center overflow-hidden cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
                    >
                       {preview ? (
                         <img src={preview} className="w-full h-full object-contain p-4" alt="Logo Preview" />
                       ) : (
                         <ImageIcon size={48} className="text-slate-200" />
                       )}
                       
                       <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2 backdrop-blur-sm">
                          <Camera size={24} />
                          <span className="text-[8px] font-black uppercase tracking-widest">Update Logo</span>
                       </div>
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                 </div>

                 <div className="space-y-2 text-left">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Platform Display Name</label>
                    <div className="relative">
                       <Zap size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-500" />
                       <input 
                         type="text" 
                         value={formData.appName}
                         onChange={e => setFormData({...formData, appName: e.target.value})}
                         className="w-full h-14 pl-14 pr-6 bg-slate-50 border border-slate-100 rounded-[22px] font-black text-slate-900 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50/50 transition-all"
                         placeholder="Noor Official"
                       />
                    </div>
                 </div>
              </div>
           </section>

           <div className="p-8 bg-indigo-50 rounded-[40px] border border-indigo-100 flex items-start gap-4">
              <ShieldCheck size={28} className="text-indigo-600 shrink-0" />
              <p className="text-[10px] text-indigo-700 font-bold uppercase leading-relaxed tracking-wider">
                Asset Integrity Node: Logo and brand name will be synchronized across all user dashboards and landing pages immediately.
              </p>
           </div>
        </div>

        {/* RIGHT COLUMN: CONTACT HUB */}
        <div className="lg:col-span-7 space-y-6">
           <section className="bg-white p-8 rounded-[44px] border border-slate-100 shadow-sm space-y-8">
              <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-300 flex items-center gap-2">
                 <Smartphone size={18} /> Contact Protocols
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">WhatsApp (Earning Support)</label>
                    <div className="relative">
                       <div className="absolute left-5 top-1/2 -translate-y-1/2 text-green-500"><MessageSquare size={18} fill="currentColor" /></div>
                       <input 
                         type="text" 
                         value={formData.whatsappNumber}
                         onChange={e => setFormData({...formData, whatsappNumber: e.target.value})}
                         className="w-full h-14 pl-14 pr-6 bg-slate-50 border border-slate-100 rounded-[22px] font-black text-xs text-slate-800 outline-none focus:bg-white"
                         placeholder="03XXXXXXXXX"
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Hotline Number</label>
                    <div className="relative">
                       <Phone size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-sky-500" />
                       <input 
                         type="text" 
                         value={formData.supportPhone}
                         onChange={e => setFormData({...formData, supportPhone: e.target.value})}
                         className="w-full h-14 pl-14 pr-6 bg-slate-50 border border-slate-100 rounded-[22px] font-black text-xs text-slate-800 outline-none focus:bg-white"
                         placeholder="03XXXXXXXXX"
                       />
                    </div>
                 </div>

                 <div className="md:col-span-2 space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Official Support Email</label>
                    <div className="relative">
                       <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-amber-500" />
                       <input 
                         type="email" 
                         value={formData.supportEmail}
                         onChange={e => setFormData({...formData, supportEmail: e.target.value})}
                         className="w-full h-14 pl-14 pr-6 bg-slate-50 border border-slate-100 rounded-[22px] font-black text-xs text-slate-800 outline-none focus:bg-white"
                         placeholder="help@noorofficial.com"
                       />
                    </div>
                 </div>

                 <div className="md:col-span-2 space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Office Headquarters Address</label>
                    <div className="relative">
                       <MapPin size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-rose-500" />
                       <input 
                         type="text" 
                         value={formData.address}
                         onChange={e => setFormData({...formData, address: e.target.value})}
                         className="w-full h-14 pl-14 pr-6 bg-slate-50 border border-slate-100 rounded-[22px] font-black text-xs text-slate-800 outline-none focus:bg-white"
                         placeholder="Legal Business Address"
                       />
                    </div>
                 </div>
              </div>
           </section>

           <AnimatePresence>
             {success && (
               <motion.div 
                 initial={{ opacity: 0, y: 20 }} 
                 animate={{ opacity: 1, y: 0 }} 
                 exit={{ opacity: 0, scale: 0.95 }}
                 className="p-5 bg-emerald-500 text-white rounded-[28px] flex items-center justify-between shadow-2xl"
               >
                  <div className="flex items-center gap-3">
                     <CheckCircle2 size={24} />
                     <p className="text-[11px] font-black uppercase tracking-[0.2em]">Deployment Complete. Brand Updated.</p>
                  </div>
                  <Zap size={20} className="animate-pulse" />
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default BrandingSettings;
