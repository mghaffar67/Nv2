import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Add missing 'Network' icon to lucide-react imports
import { Save, AlertCircle, TrendingDown, Users, CheckCircle2, Loader2, ShieldCheck, CreditCard, Coins, Landmark, Network } from 'lucide-react';
import { useConfig } from '../../../context/ConfigContext';
import { clsx } from 'clsx';

const CoreSettings = () => {
  const { config, updateConfig } = useConfig();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    minWithdraw: config.financeSettings.minWithdraw,
    maxWithdraw: config.financeSettings.maxWithdraw,
    withdrawFee: config.financeSettings.withdrawFeePercent,
    referralReqActive: config.financeSettings.referralRequirementActive,
    referralCount: config.financeSettings.requiredReferralCount
  });

  const handleSave = () => {
    setLoading(true);
    // Sync to Global Config Context
    updateConfig({
      financeSettings: {
        ...config.financeSettings,
        minWithdraw: Number(form.minWithdraw),
        maxWithdraw: Number(form.maxWithdraw),
        withdrawFeePercent: Number(form.withdrawFee),
        referralRequirementActive: form.referralReqActive,
        requiredReferralCount: Number(form.referralCount)
      }
    });
    
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 800);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-slate-50">
        <div>
           <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter leading-none mb-2">Financial <span className="text-indigo-600">Constraints.</span></h2>
           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">Core Liquidity & Disbursement Protocol Settings</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={loading}
          className="h-12 px-8 bg-slate-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 active:scale-95 transition-all shadow-xl disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} className="text-sky-400" />} Deploy Logic
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <section className="bg-slate-50/50 p-7 rounded-[40px] border border-slate-100 space-y-6">
             <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-indigo-600 shadow-sm"><CreditCard size={20}/></div>
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Withdrawal Node</h4>
             </div>
             
             <div className="grid grid-cols-1 gap-5">
               <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Minimum Inflow/Outflow (PKR)</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-slate-300 text-[10px]">Rs.</span>
                    <input type="number" value={form.minWithdraw} onChange={e => setForm({...form, minWithdraw: Number(e.target.value)})} className="w-full h-12 pl-12 pr-6 bg-white border border-slate-200 rounded-xl font-black text-sm outline-none focus:ring-4 focus:ring-indigo-50" />
                  </div>
               </div>
               <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Maximum Payout Cap (PKR)</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-slate-300 text-[10px]">Rs.</span>
                    <input type="number" value={form.maxWithdraw} onChange={e => setForm({...form, maxWithdraw: Number(e.target.value)})} className="w-full h-12 pl-12 pr-6 bg-white border border-slate-200 rounded-xl font-black text-sm outline-none focus:ring-4 focus:ring-indigo-50" />
                  </div>
               </div>
               <div className="space-y-1.5">
                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">System Tax/Service Fee (%)</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-slate-300 text-[10px]">%</span>
                    <input type="number" value={form.withdrawFee} onChange={e => setForm({...form, withdrawFee: Number(e.target.value)})} className="w-full h-12 pl-12 pr-6 bg-white border border-slate-200 rounded-xl font-black text-sm outline-none focus:ring-4 focus:ring-indigo-50" />
                  </div>
               </div>
             </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-indigo-50/50 p-8 rounded-[44px] border border-indigo-100 space-y-6 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12 scale-150 group-hover:rotate-45 transition-transform duration-[3s]"><Users size={80} /></div>
             <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-white border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm"><Network size={20}/></div>
                   <h4 className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">Network Gate</h4>
                </div>
                <button 
                  onClick={() => setForm({...form, referralReqActive: !form.referralReqActive})}
                  className={clsx("w-12 h-6 rounded-full relative transition-all flex items-center px-1 shadow-inner", form.referralReqActive ? "bg-indigo-600" : "bg-slate-300")}
                >
                   <motion.div animate={{ x: form.referralReqActive ? 24 : 0 }} className="w-4 h-4 bg-white rounded-full shadow-md" />
                </button>
             </div>
             
             <div className="relative z-10">
                <p className="text-[10px] text-indigo-700 leading-relaxed font-bold uppercase italic opacity-80 mb-6">If enabled, members must invite a specific number of verified associates before their first withdrawal is authorized.</p>
                <div className="space-y-2">
                   <label className="text-[8px] font-black text-indigo-400 uppercase tracking-widest ml-4">Required Direct Invites</label>
                   <div className="relative">
                      <Users size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-300" />
                      <input 
                        type="number" 
                        disabled={!form.referralReqActive}
                        value={form.referralCount} 
                        onChange={e => setForm({...form, referralCount: Number(e.target.value)})} 
                        className="w-full h-14 pl-14 pr-6 bg-white border border-indigo-100 rounded-[22px] font-black text-xl text-indigo-600 outline-none disabled:opacity-40 shadow-inner" 
                      />
                   </div>
                </div>
             </div>
          </section>

          <div className="p-6 bg-amber-50 rounded-[32px] border border-amber-100 flex gap-4 items-start mx-1 shadow-inner">
             <AlertCircle size={20} className="text-amber-500 shrink-0 mt-0.5" />
             <p className="text-[9px] font-bold text-amber-800 uppercase tracking-widest leading-relaxed">
               Logic Warning: Modifications to withdrawal fees apply instantly to all pending and future requests.
             </p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {success && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl z-[100] flex items-center gap-3 border-2 border-white/20">
             <CheckCircle2 size={18} /> Ecosystem Hub Synchronized
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CoreSettings;