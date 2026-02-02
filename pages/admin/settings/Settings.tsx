import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, AlertCircle, TrendingDown, Users, CheckCircle2, Loader2, ShieldCheck, Clock, Zap, Target } from 'lucide-react';
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
    referralCount: config.financeSettings.requiredReferralCount,
    workStart: (config as any).workHours?.start || 9,
    workEnd: (config as any).workHours?.end || 22,
    streakRewards: [...(config.streakRewards || [5, 10, 15, 20, 25, 30, 100])]
  });

  const handleRewardChange = (idx: number, val: string) => {
    const newRewards = [...form.streakRewards];
    newRewards[idx] = Number(val);
    setForm({ ...form, streakRewards: newRewards });
  };

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
      },
      workHours: {
        start: Number(form.workStart),
        end: Number(form.workEnd)
      },
      streakRewards: form.streakRewards
    } as any);
    
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 800);
  };

  return (
    <div className="space-y-8 pb-20 animate-fade-in">
      <div className="flex justify-between items-center px-2">
        <div>
           <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">Central <span className="text-indigo-600">Logic.</span></h2>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Authorized Deployment Hub</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={loading}
          className="h-14 px-10 bg-slate-950 text-white rounded-[24px] font-black text-[11px] uppercase tracking-widest flex items-center gap-3 active:scale-95 transition-all shadow-2xl"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <ShieldCheck size={18} className="text-sky-400" />} {loading ? 'Deploying...' : 'Deploy System Config'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: FINANCE & WORK HOURS */}
        <div className="lg:col-span-7 space-y-6">
           <section className="bg-white p-8 rounded-[44px] border border-slate-100 shadow-sm space-y-10">
              <div className="space-y-6">
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2"><Clock size={16} className="text-indigo-600" /> Work Window Protocol</h3>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-slate-800 uppercase tracking-widest ml-4">Open Hour (0-23)</label>
                       <input type="number" value={form.workStart} onChange={e => setForm({...form, workStart: Number(e.target.value)})} className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-[22px] font-black text-lg outline-none focus:bg-white" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-slate-800 uppercase tracking-widest ml-4">Close Hour (0-23)</label>
                       <input type="number" value={form.workEnd} onChange={e => setForm({...form, workEnd: Number(e.target.value)})} className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-[22px] font-black text-lg outline-none focus:bg-white" />
                    </div>
                 </div>
              </div>

              <div className="space-y-6 border-t border-slate-50 pt-10">
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2"><TrendingDown size={16} className="text-rose-600" /> Withdrawal Thresholds</h3>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <span className="text-[9px] font-black text-slate-800 uppercase tracking-widest ml-4">Minimum (PKR)</span>
                      <input type="number" value={form.minWithdraw} onChange={e => setForm({...form, minWithdraw: Number(e.target.value)})} className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-[22px] font-black text-lg outline-none" />
                   </div>
                   <div className="space-y-2">
                      <span className="text-[9px] font-black text-slate-800 uppercase tracking-widest ml-4">Maximum (PKR)</span>
                      <input type="number" value={form.maxWithdraw} onChange={e => setForm({...form, maxWithdraw: Number(e.target.value)})} className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-[22px] font-black text-lg outline-none" />
                   </div>
                 </div>
              </div>
           </section>

           <section className="bg-indigo-50/50 p-8 rounded-[44px] border border-indigo-100 space-y-6">
             <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black text-indigo-900 uppercase tracking-widest flex items-center gap-2">
                   <Users size={18}/> Referral Requirement Gating
                </h3>
                <button 
                  onClick={() => setForm({...form, referralReqActive: !form.referralReqActive})}
                  className={clsx("w-14 h-7 rounded-full relative transition-all flex items-center px-1 shadow-inner", form.referralReqActive ? "bg-indigo-600" : "bg-slate-300")}
                >
                   <motion.div animate={{ x: form.referralReqActive ? 28 : 0 }} className="w-5 h-5 bg-white rounded-full shadow-md" />
                </button>
             </div>
             <p className="text-[10px] text-indigo-700 leading-relaxed font-bold uppercase tracking-wide">Block withdrawals until the member reaches the minimum team node count.</p>
             <div className="space-y-2">
                <span className="text-[8px] font-black text-indigo-400 uppercase ml-4">Required Active Members</span>
                <input 
                  type="number" 
                  disabled={!form.referralReqActive}
                  value={form.referralCount} 
                  onChange={e => setForm({...form, referralCount: Number(e.target.value)})} 
                  className="w-full h-14 px-6 bg-white border border-indigo-100 rounded-[22px] font-black text-2xl text-indigo-600 outline-none disabled:opacity-40" 
                />
             </div>
          </section>
        </div>

        {/* RIGHT COLUMN: STREAK REWARDS (INAM POOL) */}
        <div className="lg:col-span-5 space-y-6">
           <section className="bg-white p-8 rounded-[44px] border border-slate-100 shadow-sm space-y-8">
              <div>
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2"><Zap size={16} className="text-amber-500" /> Daily Inam Pool (7-Day Pool)</h3>
                 <p className="text-[8px] font-bold text-slate-400 uppercase mt-2 tracking-widest italic ml-4">Control exactly how much PKR is gifted each day.</p>
              </div>

              <div className="space-y-3">
                 {form.streakRewards.map((amt, idx) => (
                    <div key={idx} className="flex items-center gap-4 group">
                       <div className="w-12 h-12 rounded-2xl bg-slate-900 text-sky-400 flex items-center justify-center font-black italic shadow-lg shrink-0">D{idx+1}</div>
                       <div className="flex-grow relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-300 text-xs italic">PKR</span>
                          <input 
                            type="number" 
                            value={amt} 
                            onChange={(e) => handleRewardChange(idx, e.target.value)}
                            className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-xl font-black text-slate-800 outline-none focus:ring-4 focus:ring-amber-50 transition-all"
                          />
                       </div>
                       {idx === 6 && <div className="p-2 bg-amber-50 rounded-xl text-amber-600"><Target size={16} /></div>}
                    </div>
                 ))}
              </div>

              <div className="p-6 bg-slate-950 rounded-[32px] text-white relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12 scale-150"><Zap size={40} fill="currentColor" /></div>
                 <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2 italic leading-relaxed">System Audit: Current total pool value for 7 days is <b>Rs {form.streakRewards.reduce((a, b) => a + b, 0)}</b></p>
              </div>
           </section>
        </div>
      </div>

      <AnimatePresence>
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-10 py-5 rounded-[30px] flex items-center gap-4 font-black text-xs uppercase tracking-[0.2em] shadow-2xl z-[300] border-4 border-white"
          >
            <CheckCircle2 size={24} /> System Protocols Synchronized Successfully
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CoreSettings;