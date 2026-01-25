
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Image as ImageIcon, Phone, MessageSquare, Globe, HelpCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { useConfig } from '../../../context/ConfigContext';
import { clsx } from 'clsx';

const BrandingSettings = () => {
  const { config, updateConfig } = useConfig();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({ ...config.branding });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, key: 'logo' | 'banner') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, [key]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setLoading(true);
    updateConfig({ branding: form });
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 800);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-black text-slate-900 uppercase italic">Company Identity</h2>
        <button onClick={handleSave} className="h-12 px-8 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 active:scale-95 shadow-xl">
          {loading ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />} Save Identity
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Company Name</label>
              <input type="text" value={form.companyName} onChange={e => setForm({...form, companyName: e.target.value})} className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-2xl font-black text-slate-800 outline-none" />
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Logo</label>
                 <div className="h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group">
                    {form.logo ? <img src={form.logo} className="h-full w-full object-contain p-2" /> : <ImageIcon size={24} className="text-slate-300" />}
                    <input type="file" onChange={e => handleFileUpload(e, 'logo')} className="absolute inset-0 opacity-0 cursor-pointer" />
                 </div>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">App Banner</label>
                 <div className="h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group">
                    {form.banner ? <img src={form.banner} className="h-full w-full object-cover" /> : <ImageIcon size={24} className="text-slate-300" />}
                    <input type="file" onChange={e => handleFileUpload(e, 'banner')} className="absolute inset-0 opacity-0 cursor-pointer" />
                 </div>
              </div>
           </div>
        </div>

        <div className="space-y-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2"><Phone size={14}/> Contact Number</label>
              <input type="text" value={form.contactPhone} onChange={e => setForm({...form, contactPhone: e.target.value})} className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm" />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2"><MessageSquare size={14}/> Support WhatsApp</label>
              <input type="text" value={form.supportPhone} onChange={e => setForm({...form, supportPhone: e.target.value})} className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm" />
           </div>
           
           <div className="p-6 bg-sky-50 rounded-[32px] border border-sky-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <HelpCircle className="text-sky-600" size={20} />
                 <span className="text-[10px] font-black uppercase text-sky-900">Show Help Section</span>
              </div>
              <button 
                onClick={() => setForm({...form, showHelpSection: !form.showHelpSection})}
                className={clsx("w-12 h-6 rounded-full relative transition-all flex items-center px-1", form.showHelpSection ? "bg-sky-600" : "bg-slate-300")}
              >
                 <motion.div animate={{ x: form.showHelpSection ? 24 : 0 }} className="w-4 h-4 bg-white rounded-full" />
              </button>
           </div>
        </div>
      </div>

      {success && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-green-500 text-white p-4 rounded-2xl flex items-center gap-3 font-black text-[10px] uppercase tracking-widest">
          <CheckCircle2 size={16} /> Identity Synchronized
        </motion.div>
      )}
    </div>
  );
};

export default BrandingSettings;
