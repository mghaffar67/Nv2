import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Plus, Trash2, Edit3, Save, X, 
  ShieldCheck, Loader2, RefreshCw, Layers,
  Gem, Star, Award, Diamond, Clock, TrendingUp
} from 'lucide-react';
import { clsx } from 'clsx';

const PlanController = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [saveLoading, setSaveLoading] = useState(false);

  const fetchPlans = () => {
    setLoading(true);
    const data = JSON.parse(localStorage.getItem('noor_plans_registry') || '[]');
    setPlans(data);
    setLoading(false);
  };

  useEffect(() => { fetchPlans(); }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    
    let updated;
    if (editing.id) {
      updated = plans.map(p => p.id === editing.id ? editing : p);
    } else {
      updated = [...plans, { ...editing, id: `PLAN-${Date.now()}` }];
    }

    localStorage.setItem('noor_plans_registry', JSON.stringify(updated));
    setTimeout(() => {
      setSaveLoading(false);
      setEditing(null);
      fetchPlans();
      alert("Plan Hub Synchronized.");
    }, 800);
  };

  const deletePlan = (id: string) => {
    if (!window.confirm("Remove this earning station? This will disconnect current members.")) return;
    const updated = plans.filter(p => p.id !== id);
    localStorage.setItem('noor_plans_registry', JSON.stringify(updated));
    fetchPlans();
  };

  return (
    <div className="space-y-8 pb-24 animate-fade-in font-sans">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2 pt-4">
        <div>
           <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
             Plan <span className="text-indigo-600">Architect.</span>
           </h1>
           <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px] mt-3 italic flex items-center gap-2">
             <Layers size={14} className="text-indigo-500" /> Station Node & Yield Management
           </p>
        </div>
        <button 
          onClick={() => setEditing({ name: '', price: 0, dailyLimit: 1, dailyEarning: 240, referralBonus: 300, validityDays: 365, color: '#4A6CF7' })}
          className="h-14 px-10 bg-slate-950 text-white rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl flex items-center gap-3 active:scale-95 transition-all"
        >
          <Plus size={20} className="text-sky-400" /> New Station
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 px-1">
        {loading ? (
          <div className="col-span-full py-24 text-center"><RefreshCw className="animate-spin mx-auto text-slate-200" size={48}/></div>
        ) : plans.map(plan => (
          <motion.div 
            key={plan.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-sm group hover:border-indigo-200 hover:shadow-xl transition-all relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 p-8 opacity-5 scale-150 rotate-12 group-hover:rotate-45 transition-transform"><Gem size={64}/></div>
             <div className="flex justify-between items-start mb-10">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl" style={{ backgroundColor: plan.color || '#6366f1' }}>
                   <Zap size={28} fill="currentColor" />
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Cost</p>
                   <p className="text-2xl font-black text-slate-900 italic tracking-tighter leading-none">Rs {plan.price}</p>
                </div>
             </div>

             <h4 className="text-xl font-black text-slate-900 uppercase italic mb-8">{plan.name} HUB</h4>

             <div className="space-y-4 mb-10">
                <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-400">
                   <span>Daily Yield</span>
                   <span className="text-emerald-600">Rs {plan.dailyEarning}</span>
                </div>
                <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-400">
                   <span>Daily Pages</span>
                   <span className="text-indigo-600">{plan.dailyLimit} Node</span>
                </div>
                <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-400">
                   <span>Validity</span>
                   <span className="text-slate-900">{plan.validityDays} Days</span>
                </div>
             </div>

             <div className="flex gap-2">
                <button onClick={() => setEditing(plan)} className="flex-1 h-12 bg-slate-900 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all shadow-md active:scale-95"><Edit3 size={16}/> Modify</button>
                <button onClick={() => deletePlan(plan.id)} className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-90"><Trash2 size={18}/></button>
             </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {editing && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditing(null)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
             <motion.form 
                initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
                onSubmit={handleSave} className="relative w-full max-w-lg bg-white rounded-[56px] p-12 shadow-2xl space-y-8 border border-white max-h-[90vh] overflow-y-auto no-scrollbar"
             >
                <div className="flex justify-between items-center border-b border-slate-50 pb-8">
                   <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Station Node.</h3>
                   <button type="button" onClick={() => setEditing(null)} className="p-3 bg-slate-50 rounded-full hover:bg-rose-50 hover:text-rose-500 transition-all"><X size={28}/></button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                   <div className="md:col-span-2 space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6 italic">Hub Identity</label>
                      <input required value={editing.name} onChange={e => setEditing({...editing, name: e.target.value.toUpperCase()})} className="w-full h-14 px-7 bg-slate-50 border border-slate-100 rounded-[28px] font-black text-sm text-slate-900 outline-none focus:bg-white transition-all shadow-inner" placeholder="e.g. ELITE" />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6">Price (PKR)</label>
                      <input required type="number" value={editing.price} onChange={e => setEditing({...editing, price: Number(e.target.value)})} className="w-full h-14 px-7 bg-slate-50 border border-slate-100 rounded-[28px] font-bold text-sm outline-none" />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6">Daily Pages</label>
                      <input required type="number" value={editing.dailyLimit} onChange={e => setEditing({...editing, dailyLimit: Number(e.target.value)})} className="w-full h-14 px-7 bg-slate-50 border border-slate-100 rounded-[28px] font-bold text-sm outline-none" />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6">Daily Yield</label>
                      <input required type="number" value={editing.dailyEarning} onChange={e => setEditing({...editing, dailyEarning: Number(e.target.value)})} className="w-full h-14 px-7 bg-slate-50 border border-slate-100 rounded-[28px] font-bold text-sm outline-none" />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6">Validity (Days)</label>
                      <input required type="number" value={editing.validityDays} onChange={e => setEditing({...editing, validityDays: Number(e.target.value)})} className="w-full h-14 px-7 bg-slate-50 border border-slate-100 rounded-[28px] font-bold text-sm outline-none" />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6">Referral Bonus</label>
                      <input required type="number" value={editing.referralBonus} onChange={e => setEditing({...editing, referralBonus: Number(e.target.value)})} className="w-full h-14 px-7 bg-slate-50 border border-slate-100 rounded-[28px] font-bold text-sm outline-none" />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6">Theme Color</label>
                      <input type="color" value={editing.color || '#4A6CF7'} onChange={e => setEditing({...editing, color: e.target.value})} className="w-full h-14 px-1 bg-white border border-slate-100 rounded-[28px] cursor-pointer" />
                   </div>
                </div>

                <div className="pt-6">
                   <button type="submit" disabled={saveLoading} className="w-full h-18 bg-slate-950 text-white rounded-[32px] font-black text-[12px] uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50">
                      {saveLoading ? <Loader2 className="animate-spin" size={24}/> : <><ShieldCheck size={24} className="text-sky-400" /> Synchronize Node</>}
                   </button>
                </div>
             </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlanController;