
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, AlertCircle, TrendingDown, Users, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';
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
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-black text-slate-900 uppercase italic">Financial Constraints</h2>
        <button 
          onClick={handleSave} 
          disabled={loading}
          className="h-12 px-8 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 active:scale-95 transition-all shadow-xl"
        >
          {loading ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />} Save System
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <section className="space-y-4">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2">
               <TrendingDown size={14}/> Withdrawal Limits
             </label>
             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1.5">
                  <span className="text-[8px] font-black text-slate-400 uppercase ml-2">Min (PKR)</span>
                  <input type="number" value={form.minWithdraw} onChange={e => setForm({...form, minWithdraw: Number(e.target.value)})} className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none" />
               </div>
               <div className="space-y-1.5">
                  <span className="text-[8px] font-black text-slate-400 uppercase ml-2">Max (PKR)</span>
                  <input type="number" value={form.maxWithdraw} onChange={e => setForm({...form, maxWithdraw: Number(e.target.value)})} className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none" />
               </div>
             </div>
             <div className="space-y-1.5">
                <span className="text-[8px] font-black text-slate-400 uppercase ml-2">Withdrawal Fee (%)</span>
                <input type="number" value={form.withdrawFee} onChange={e => setForm({...form, withdrawFee: Number(e.target.value)})} className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none" />
             </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-indigo-50/50 p-6 rounded-[32px] border border-indigo-100 space-y-6">
             <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-indigo-900 uppercase tracking-widest flex items-center gap-2">
                   <Users size={14}/> Referral Requirement
                </label>
                <button 
                  onClick={() => setForm({...form, referralReqActive: !form.referralReqActive})}
                  className={clsx("w-12 h-6 rounded-full relative transition-all flex items-center px-1", form.referralReqActive ? "bg-indigo-600" : "bg-slate-300")}
                >
                   <motion.div animate={{ x: form.referralReqActive ? 24 : 0 }} className="w-4 h-4 bg-white rounded-full" />
                </button>
             </div>
             <p className="text-[9px] text-indigo-700 leading-relaxed font-bold uppercase">Enable this to require users to invite friends before they can withdraw earnings.</p>
             <div className="space-y-2">
                <span className="text-[8px] font-black text-indigo-400 uppercase ml-2">Required Members</span>
                <input 
                  type="number" 
                  disabled={!form.referralReqActive}
                  value={form.referralCount} 
                  onChange={e => setForm({...form, referralCount: Number(e.target.value)})} 
                  className="w-full h-12 px-4 bg-white border border-indigo-100 rounded-xl font-black text-lg text-indigo-600 outline-none disabled:opacity-40" 
                />
             </div>
          </section>
        </div>
      </div>

      {success && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-emerald-500 text-white p-4 rounded-2xl flex items-center gap-3 font-black text-[10px] uppercase tracking-widest">
          <CheckCircle2 size={16} /> Financial Logic Updated Successfully
        </motion.div>
      )}
    </div>
  );
};

export default CoreSettings;
