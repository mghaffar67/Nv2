
import React, { useState, useEffect } from 'react';
// Added AnimatePresence to the import to fix reference errors
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
  Banknote
} from 'lucide-react';
import { clsx } from 'clsx';
import { useConfig } from '../../../context/ConfigContext';
import { api } from '../../../utils/api';

const Settings = () => {
  const { config, updateConfig } = useConfig();
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Local state for the complex objects to prevent excessive context renders while typing
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
    // Populate from global config
    const ep = config.paymentGateways.find(g => g.name === 'EasyPaisa');
    const jc = config.paymentGateways.find(g => g.name === 'JazzCash');
    
    setFormData({
      epTitle: ep?.accountTitle || '',
      epNumber: ep?.accountNumber || '',
      jcTitle: jc?.accountTitle || '',
      jcNumber: jc?.accountNumber || '',
      waLink: 'https://chat.whatsapp.com/example', // Mock link since not in default config
      supportPhone: '03000000000',
      maintenanceMode: config.maintenanceMode || false
    });
  }, [config]);

  const handleSave = async () => {
    setLoading(true);
    try {
      // 1. Prepare Payload
      const updatedGateways = [
        { name: 'EasyPaisa', accountNumber: formData.epNumber, accountTitle: formData.epTitle },
        { name: 'JazzCash', accountNumber: formData.jcNumber, accountTitle: formData.jcTitle },
        config.paymentGateways.find(g => g.name === 'Bank Transfer') || { name: 'Bank Transfer', accountNumber: '', accountTitle: '' }
      ];

      const payload = {
        paymentGateways: updatedGateways,
        maintenanceMode: formData.maintenanceMode
      };

      // 2. API Call
      await api.post('/system/settings', payload); // Simulating PUT with POST helper for simplicity

      // 3. Update local Context
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
    <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 animate-fade-in pb-24">
      
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 px-2">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">System Nodes.</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Configure Global Platform Parameters</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="bg-slate-950 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-2xl active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {loading ? 'Syncing...' : 'Deploy Changes'}
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
                    className="w-full h-12 px-5 bg-white border border-slate-100 rounded-xl font-bold text-xs outline-none" 
                  />
                  <input 
                    placeholder="Mobile Number" 
                    value={formData.epNumber}
                    onChange={e => setFormData({...formData, epNumber: e.target.value})}
                    className="w-full h-12 px-5 bg-white border border-slate-100 rounded-xl font-mono text-sm font-black outline-none" 
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
                    className="w-full h-12 px-5 bg-white border border-slate-100 rounded-xl font-bold text-xs outline-none" 
                  />
                  <input 
                    placeholder="Mobile Number" 
                    value={formData.jcNumber}
                    onChange={e => setFormData({...formData, jcNumber: e.target.value})}
                    className="w-full h-12 px-5 bg-white border border-slate-100 rounded-xl font-mono text-sm font-black outline-none" 
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
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">WhatsApp Group Invite</label>
                    <input 
                      type="url" 
                      value={formData.waLink}
                      onChange={e => setFormData({...formData, waLink: e.target.value})}
                      className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs outline-none" 
                    />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Official Support Phone</label>
                    <input 
                      type="tel" 
                      value={formData.supportPhone}
                      onChange={e => setFormData({...formData, supportPhone: e.target.value})}
                      className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs outline-none" 
                    />
                 </div>
              </div>
           </section>

           {/* SECTION 3: MAINTENANCE (DANGER ZONE) */}
           <section className="bg-rose-50 p-6 md:p-8 rounded-[40px] border border-rose-100 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                 <h2 className="text-[11px] font-black uppercase tracking-widest text-rose-500 flex items-center gap-2">
                    <ShieldAlert size={18} /> Danger Zone
                 </h2>
                 <div className="flex items-center gap-3">
                    <span className={clsx(
                      "text-[9px] font-black uppercase tracking-widest",
                      formData.maintenanceMode ? "text-rose-600" : "text-slate-400"
                    )}>
                      Maintenance
                    </span>
                    <button 
                      onClick={() => setFormData({...formData, maintenanceMode: !formData.maintenanceMode})}
                      className={clsx(
                        "w-12 h-6 rounded-full transition-all relative flex items-center px-1",
                        formData.maintenanceMode ? "bg-rose-500" : "bg-slate-300"
                      )}
                    >
                      <motion.div 
                        animate={{ x: formData.maintenanceMode ? 24 : 0 }}
                        className="w-4 h-4 bg-white rounded-full shadow-lg" 
                      />
                    </button>
                 </div>
              </div>
              <p className="text-[10px] font-medium text-rose-700 leading-relaxed italic">
                <b>PROTOCOL ALERT:</b> Enabling Maintenance Mode will immediately lock out all standard users from the dashboard. Only Admin nodes can remain logged in.
              </p>
           </section>
        </div>
      </div>

      {/* Added AnimatePresence from framer-motion to fix 'Cannot find name' errors */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-green-500 text-white px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl flex items-center gap-3 z-[200]"
          >
             <CheckCircle2 size={16} /> Configuration Deployed Successfully
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Settings;
