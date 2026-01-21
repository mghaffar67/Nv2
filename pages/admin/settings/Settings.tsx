
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, 
  Smartphone, 
  MessageCircle, 
  ShieldAlert, 
  Zap, 
  Info,
  Loader2,
  CheckCircle2,
  Globe,
  Settings as SettingsIcon,
  Banknote,
  X,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { clsx } from 'clsx';
import { useConfig } from '../../../context/ConfigContext';
import { api } from '../../../utils/api';

const Settings = () => {
  const { config, updateConfig } = useConfig();
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    epTitle: '',
    epNumber: '',
    jcTitle: '',
    jcNumber: '',
    waLink: '',
    supportPhone: '',
    maintenanceMode: false
  });

  useEffect(() => {
    const ep = config.paymentGateways.find(g => g.name === 'EasyPaisa');
    const jc = config.paymentGateways.find(g => g.name === 'JazzCash');
    
    setFormData({
      epTitle: ep?.accountTitle || '',
      epNumber: ep?.accountNumber || '',
      jcTitle: jc?.accountTitle || '',
      jcNumber: jc?.accountNumber || '',
      waLink: 'https://wa.me/923000000000',
      supportPhone: '03000000000',
      maintenanceMode: config.maintenanceMode || false
    });
  }, [config]);

  const handleInitiateSave = () => {
    setShowConfirm(true);
  };

  const handleSave = async () => {
    setLoading(true);
    setShowConfirm(false);
    try {
      const updatedGateways = [
        { name: 'EasyPaisa', accountNumber: formData.epNumber, accountTitle: formData.epTitle },
        { name: 'JazzCash', accountNumber: formData.jcNumber, accountTitle: formData.jcTitle },
        config.paymentGateways.find(g => g.name === 'Bank Transfer') || { name: 'Bank Transfer', accountNumber: '', accountTitle: '' }
      ];

      const payload = {
        paymentGateways: updatedGateways,
        maintenanceMode: formData.maintenanceMode
      };

      await api.post('/system/settings', payload); 
      updateConfig(payload);
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || "Failed to update protocol.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 animate-fade-in pb-24 relative">
      
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 px-2">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">System Nodes.</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Configure Global Platform Parameters</p>
        </div>
        <button 
          onClick={handleInitiateSave}
          disabled={loading}
          className="bg-slate-950 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-2xl active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Save size={16} />}
          Deploy Changes
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        
        {/* SECTION 1: PAYMENT GATEWAYS */}
        <section className="bg-white p-6 md:p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
          <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-300 flex items-center gap-2 mb-2">
            <Banknote size={18} /> Liquidity Destinations
          </h2>

          <div className="space-y-4">
            <div className="p-5 bg-indigo-50/50 rounded-3xl border border-indigo-50 space-y-4">
               <p className="text-[9px] font-black uppercase text-indigo-400 tracking-widest flex items-center gap-2">
                 <Smartphone size={12}/> EasyPaisa Configuration
               </p>
               <div className="grid grid-cols-1 gap-3">
                  <input 
                    placeholder="Account Title" 
                    value={formData.epTitle}
                    onChange={e => setFormData({...formData, epTitle: e.target.value})}
                    className="w-full h-12 px-5 bg-white border border-slate-100 rounded-xl font-bold text-xs outline-none focus:ring-4 focus:ring-indigo-100 transition-all" 
                  />
                  <input 
                    placeholder="Mobile Number" 
                    value={formData.epNumber}
                    onChange={e => setFormData({...formData, epNumber: e.target.value})}
                    className="w-full h-12 px-5 bg-white border border-slate-100 rounded-xl font-mono text-sm font-black outline-none focus:ring-4 focus:ring-indigo-100 transition-all" 
                  />
               </div>
            </div>

            <div className="p-5 bg-sky-50/50 rounded-3xl border border-sky-50 space-y-4">
               <p className="text-[9px] font-black uppercase text-sky-400 tracking-widest flex items-center gap-2">
                 <Smartphone size={12}/> JazzCash Configuration
               </p>
               <div className="grid grid-cols-1 gap-3">
                  <input 
                    placeholder="Account Title" 
                    value={formData.jcTitle}
                    onChange={e => setFormData({...formData, jcTitle: e.target.value})}
                    className="w-full h-12 px-5 bg-white border border-slate-100 rounded-xl font-bold text-xs outline-none focus:ring-4 focus:ring-sky-100 transition-all" 
                  />
                  <input 
                    placeholder="Mobile Number" 
                    value={formData.jcNumber}
                    onChange={e => setFormData({...formData, jcNumber: e.target.value})}
                    className="w-full h-12 px-5 bg-white border border-slate-100 rounded-xl font-mono text-sm font-black outline-none focus:ring-4 focus:ring-sky-100 transition-all" 
                  />
               </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: SUPPORT & STATUS */}
        <div className="space-y-6 md:space-y-8">
           <section className="bg-white p-6 md:p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
              <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-300 flex items-center gap-2 mb-2">
                <MessageCircle size={18} /> Support Channels
              </h2>
              <div className="space-y-4">
                 <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">WhatsApp Group Link</label>
                    <input 
                      type="url" 
                      value={formData.waLink}
                      onChange={e => setFormData({...formData, waLink: e.target.value})}
                      className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs outline-none focus:bg-white transition-all" 
                    />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Support Phone</label>
                    <input 
                      type="tel" 
                      value={formData.supportPhone}
                      onChange={e => setFormData({...formData, supportPhone: e.target.value})}
                      className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs outline-none focus:bg-white transition-all" 
                    />
                 </div>
              </div>
           </section>

           <section className="bg-rose-50 p-6 md:p-8 rounded-[40px] border border-rose-100 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                 <h2 className="text-[11px] font-black uppercase tracking-widest text-rose-500 flex items-center gap-2">
                    <ShieldAlert size={18} /> Danger Zone
                 </h2>
                 <div className="flex items-center gap-3">
                    <span className={clsx("text-[9px] font-black uppercase tracking-widest", formData.maintenanceMode ? "text-rose-600" : "text-slate-400")}>Maintenance</span>
                    <button 
                      onClick={() => setFormData({...formData, maintenanceMode: !formData.maintenanceMode})}
                      className={clsx("w-12 h-6 rounded-full transition-all relative flex items-center px-1", formData.maintenanceMode ? "bg-rose-500" : "bg-slate-300")}
                    >
                      <motion.div animate={{ x: formData.maintenanceMode ? 24 : 0 }} className="w-4 h-4 bg-white rounded-full shadow-lg" />
                    </button>
                 </div>
              </div>
              <p className="text-[10px] font-medium text-rose-700 leading-relaxed italic">
                <b>PROTOCOL ALERT:</b> Enabling Maintenance Mode will immediately lock out all standard users.
              </p>
           </section>
        </div>
      </div>

      {/* CONFIRMATION MODAL */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowConfirm(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-md bg-white rounded-[44px] p-8 md:p-10 shadow-2xl border border-white">
               <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-[30px] flex items-center justify-center mx-auto mb-6 shadow-xl">
                     <AlertTriangle size={36} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight">Sync New Protocol?</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 leading-relaxed px-4">
                    Aap global payment details change kar rahe hain. Kya aap ne numbers sahi check kar liye hain?
                  </p>
               </div>

               <div className="space-y-3 mb-10">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                     <p className="text-[8px] font-black text-slate-400 uppercase mb-1">EasyPaisa Hub</p>
                     <p className="text-xs font-black text-slate-800">{formData.epNumber} ({formData.epTitle})</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                     <p className="text-[8px] font-black text-slate-400 uppercase mb-1">JazzCash Hub</p>
                     <p className="text-xs font-black text-slate-800">{formData.jcNumber} ({formData.jcTitle})</p>
                  </div>
               </div>

               <div className="flex gap-3">
                  <button onClick={handleSave} className="flex-1 h-14 bg-slate-950 text-white rounded-[22px] font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2">
                     Commence Deployment <ArrowRight size={16} />
                  </button>
                  <button onClick={() => setShowConfirm(false)} className="px-6 h-14 bg-slate-50 text-slate-400 rounded-[22px] font-black text-[10px] uppercase active:scale-95 transition-all">
                     Abort
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {saveSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-green-500 text-white px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl flex items-center gap-3 z-[200]"
          >
             <CheckCircle2 size={16} /> Nodes Updated Successfully
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Settings;
