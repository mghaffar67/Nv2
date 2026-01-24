
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, Smartphone, MessageCircle, ShieldAlert, Zap, 
  Info, Loader2, CheckCircle2, Banknote, X, AlertTriangle, ArrowRight,
  TrendingDown, TrendingUp
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
    waLink: 'https://wa.me/923000000000',
    supportPhone: '03000000000',
    maintenanceMode: false,
    minWithdraw: 500,
    maxWithdraw: 50000,
    withdrawFee: 10
  });

  useEffect(() => {
    const ep = config.paymentGateways.find(g => g.name === 'EasyPaisa');
    const jc = config.paymentGateways.find(g => g.name === 'JazzCash');
    
    setFormData({
      epTitle: ep?.accountTitle || '',
      epNumber: ep?.accountNumber || '',
      jcTitle: jc?.accountTitle || '',
      jcNumber: jc?.accountNumber || '',
      waLink: (config as any).waLink || 'https://wa.me/923000000000',
      supportPhone: (config as any).supportPhone || '03000000000',
      maintenanceMode: config.maintenanceMode || false,
      minWithdraw: config.financeSettings.minWithdraw || 500,
      maxWithdraw: config.financeSettings.maxWithdraw || 50000,
      withdrawFee: config.financeSettings.withdrawFeePercent || 10
    });
  }, [config]);

  const handleSave = async () => {
    setLoading(true);
    setShowConfirm(false);
    try {
      const payload = {
        paymentGateways: [
          { name: 'EasyPaisa', accountNumber: formData.epNumber, accountTitle: formData.epTitle },
          { name: 'JazzCash', accountNumber: formData.jcNumber, accountTitle: formData.jcTitle }
        ],
        financeSettings: {
          minWithdraw: Number(formData.minWithdraw),
          maxWithdraw: Number(formData.maxWithdraw),
          withdrawFeePercent: Number(formData.withdrawFee),
          referralRequiredForWithdraw: config.financeSettings.referralRequiredForWithdraw
        },
        maintenanceMode: formData.maintenanceMode,
        waLink: formData.waLink,
        supportPhone: formData.supportPhone
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
          onClick={() => setShowConfirm(true)}
          disabled={loading}
          className="bg-slate-950 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-2xl active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Save size={16} />}
          Deploy Changes
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* WITHDRAWAL LIMITS & FEES */}
        <section className="bg-white p-6 md:p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
          <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-300 flex items-center gap-2 mb-2">
            <TrendingDown size={18} /> Payout Constraints
          </h2>
          <div className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Min Withdrawal</label>
                   <input type="number" value={formData.minWithdraw} onChange={e => setFormData({...formData, minWithdraw: Number(e.target.value)})} className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl font-black text-xs outline-none" />
                </div>
                <div className="space-y-1.5">
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Max Withdrawal</label>
                   <input type="number" value={formData.maxWithdraw} onChange={e => setFormData({...formData, maxWithdraw: Number(e.target.value)})} className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl font-black text-xs outline-none" />
                </div>
             </div>
             <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Withdrawal Fee (%)</label>
                <input type="number" value={formData.withdrawFee} onChange={e => setFormData({...formData, withdrawFee: Number(e.target.value)})} className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl font-black text-xs outline-none" />
             </div>
          </div>
        </section>

        {/* PAYMENT GATEWAYS */}
        <section className="bg-white p-6 md:p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
          <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-300 flex items-center gap-2 mb-2">
            <Banknote size={18} /> Liquidity Destinations
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-50 space-y-3">
               <p className="text-[8px] font-black uppercase text-indigo-400">EasyPaisa Hub</p>
               <input placeholder="Title" value={formData.epTitle} onChange={e => setFormData({...formData, epTitle: e.target.value})} className="w-full h-10 px-4 bg-white border border-slate-100 rounded-lg text-xs" />
               <input placeholder="Number" value={formData.epNumber} onChange={e => setFormData({...formData, epNumber: e.target.value})} className="w-full h-10 px-4 bg-white border border-slate-100 rounded-lg font-mono text-xs" />
            </div>
            <div className="p-4 bg-sky-50/50 rounded-2xl border border-sky-50 space-y-3">
               <p className="text-[8px] font-black uppercase text-sky-400">JazzCash Hub</p>
               <input placeholder="Title" value={formData.jcTitle} onChange={e => setFormData({...formData, jcTitle: e.target.value})} className="w-full h-10 px-4 bg-white border border-slate-100 rounded-lg text-xs" />
               <input placeholder="Number" value={formData.jcNumber} onChange={e => setFormData({...formData, jcNumber: e.target.value})} className="w-full h-10 px-4 bg-white border border-slate-100 rounded-lg font-mono text-xs" />
            </div>
          </div>
        </section>
      </div>

      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowConfirm(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-md bg-white rounded-[44px] p-8 md:p-10 shadow-2xl border border-white">
               <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg"><AlertTriangle size={32} /></div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase italic">Confirm Protocol Change?</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Global limits aur payment details change ho jayengi. Kya aap sure hain?</p>
               </div>
               <div className="flex gap-2">
                  <button onClick={handleSave} className="flex-1 h-14 bg-slate-950 text-white rounded-[22px] font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-2">Deploy Now <ArrowRight size={16} /></button>
                  <button onClick={() => setShowConfirm(false)} className="px-8 h-14 bg-slate-50 text-slate-400 rounded-[22px] font-black text-[10px] uppercase">Cancel</button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {saveSuccess && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-green-500 text-white px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-3 z-[200]">
             <CheckCircle2 size={16} /> Nodes Updated Successfully
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Settings;
