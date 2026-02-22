import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Image as ImageIcon, Phone, MessageSquare, Mail, MapPin, Camera, Loader2, CheckCircle2, Zap, ShieldCheck, Smartphone } from 'lucide-react';
import { useConfig } from '../../../context/ConfigContext';
import { api } from '../../../utils/api';
import { clsx } from 'clsx';

const BrandingSettings = () => {
  const { config, updateConfig } = useConfig();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState<string | null>(config.branding?.logo || null);

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
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreview(base64);
        // Direct sync for preview feel
        updateConfig({ branding: { ...config.branding, logo: base64 } } as any);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      // In Noor V3, config is global via Context + LocalStorage for this mock version
      updateConfig({
        appName: formData.appName,
        branding: {
          ...config.branding,
          contactPhone: formData.supportPhone,
          supportPhone: formData.whatsappNumber,
          supportEmail: formData.supportEmail,
          officeAddress: formData.address
        }
      } as any);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      alert("Sync Node Failure.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-50 pb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Brand <span className="text-indigo-600">Identity.</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-3 italic flex items-center gap-2">
            <ShieldCheck size={14} className="text-indigo-500" /> Digital Assets & Contact Protocols
          </p>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={loading}
          className="h-14 px-10 bg-slate-950 text-white rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl flex items-center gap-3 active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} className="text-sky-400" />} Deploy Hub
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
           <section className="bg-white p-8 rounded-[44px] border border-slate-100 shadow-sm space-y-8">
              <div className="text-center">
                 <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-300 mb-8 flex items-center justify-center gap-2">
                    <ImageIcon size={18} /> Official Mark
                 </h2>
                 
                 <div className="relative inline-block group mb-8">
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-40 h-40 rounded-[48px] bg-slate-50 border-4 border-white shadow-2xl flex items-center justify-center overflow-hidden cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
                    >
                       {preview ? (
                         <img src={preview} className="w-full h-full object-contain p-4" alt="Logo" />
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
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Business Name Node</label>
                    <div className="relative">
                       <Zap size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-500" />
                       <input 
                         type="text" 
                         value={formData.appName}
                         onChange={e => setFormData({...formData, appName: e.target.value})}
                         className="w-full h-14 pl-14 pr-6 bg-slate-50 border border-slate-100 rounded-[22px] font-black text-slate-900 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all shadow-inner"
                       />
                    </div>
                 </div>
              </div>
           </section>
        </div>

        <div className="lg:col-span-7 space-y-6">
           <section className="bg-white p-8 rounded-[44px] border border-slate-100 shadow-sm space-y-8 h-full">
              <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-300 flex items-center gap-2">
                 <Smartphone size={18} /> Support Gateway Registry
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">WhatsApp Link</label>
                    <input type="text" value={formData.whatsappNumber} onChange={e => setFormData({...formData, whatsappNumber: e.target.value})} className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-[22px] font-black text-xs text-slate-800 outline-none focus:bg-white" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Support Phone</label>
                    <input type="text" value={formData.supportPhone} onChange={e => setFormData({...formData, supportPhone: e.target.value})} className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-[22px] font-black text-xs text-slate-800 outline-none focus:bg-white" />
                 </div>
                 <div className="md:col-span-2 space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Registry Email Address</label>
                    <input type="email" value={formData.supportEmail} onChange={e => setFormData({...formData, supportEmail: e.target.value})} className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-[22px] font-black text-xs text-slate-800 outline-none focus:bg-white" />
                 </div>
                 <div className="md:col-span-2 space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Official Headquarters</label>
                    <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-[22px] font-black text-xs text-slate-800 outline-none focus:bg-white" />
                 </div>
              </div>
           </section>
        </div>
      </div>

      <AnimatePresence>
        {success && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl z-[100] flex items-center gap-3 border-2 border-white/20">
             <CheckCircle2 size={18} /> Brand Identity Synchronized
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BrandingSettings;