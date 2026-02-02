
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit3, Trash2, Save, X, 
  ShieldCheck, Loader2, RefreshCw, Package,
  Zap, Award, Diamond, Star, TrendingUp,
  Eye, EyeOff, LayoutGrid, CheckCircle2
} from 'lucide-react';
import { clsx } from 'clsx';
import { api } from '../../utils/api';

const PlanManager = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [saveLoading, setSaveLoading] = useState(false);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const data = JSON.parse(localStorage.getItem('noor_plans_registry') || '[]');
      setPlans(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPlans(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      const data = JSON.parse(localStorage.getItem('noor_plans_registry') || '[]');
      let updated;
      const finalObj = { ...editing, id: editing.id || `PLAN-${Date.now()}` };
      
      if (editing.id) {
        updated = data.map((p: any) => p.id === editing.id ? finalObj : p);
      } else {
        updated = [...data, finalObj];
      }
      
      localStorage.setItem('noor_plans_registry', JSON.stringify(updated));
      window.dispatchEvent(new Event('noor_db_update'));
      
      setTimeout(() => {
        setSaveLoading(false);
        setEditing(null);
        fetchPlans();
      }, 600);
    } catch (err) {
      alert("Deployment failure.");
      setSaveLoading(false);
    }
  };

  const toggleStatus = (id: string) => {
    const updated = plans.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p);
    localStorage.setItem('noor_plans_registry', JSON.stringify(updated));
    fetchPlans();
  };

  const deletePlan = (id: string) => {
    if (!window.confirm("Remove this earning station? This will affect all future purchases.")) return;
    const updated = plans.filter(p => p.id !== id);
    localStorage.setItem('noor_plans_registry', JSON.stringify(updated));
    fetchPlans();
  };

  return (
    <div className="space-y-8 pb-24 animate-fade-in font-sans max-w-7xl mx-auto px-2">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-4">
        <div>
           <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
             Plan <span className="text-[#4A6CF7]">Config.</span>
           </h1>
           <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-4 italic flex items-center gap-2">
             <Package size={14} className="text-[#4A6CF7]" /> Manage Subscription Hub & Pricing Nodes
           </p>
        </div>
        <button 
          onClick={() => setEditing({ name: '', price: '', dailyLimit: 1, dailyEarning: 240, referralBonus: 300, isActive: true, colorTheme: '#4A6CF7', validityDays: 365 })}
          className="h-14 px-10 bg-slate-950 text-white rounded-[24px] font-black text-[12px] uppercase tracking-[0.2em] shadow-xl flex items-center gap-3 active:scale-95 transition-all"
        >
          <Plus size={20} className="text-sky-400" /> New Station
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full py-24 text-center"><RefreshCw className="animate-spin mx-auto text-slate-200" size={48}/></div>
        ) : plans.map(plan => (
          <motion.div 
            key={plan.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className={clsx(
              "bg-white p-8 rounded-[44px] border border-slate-100 shadow-sm transition-all relative overflow-hidden group",
              !plan.isActive && "opacity-60 grayscale"
            )}
            style={{ borderTop: `10px solid ${plan.colorTheme || '#4A6CF7'}` }}
          >
             <div className="mb-10">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{plan.name} STATION</h4>
                <div className="flex items-baseline gap-1">
                   <span className="text-sm font-black text-slate-300 italic">Rs.</span>
                   <span className="text-4xl font-black text-slate-900 italic tracking-tighter">{(Number(plan.price) || 0).toLocaleString()}</span>
                </div>
             </div>

             <div className="space-y-4 mb-10">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#4A6CF7] shadow-inner"><Zap size={18}/></div>
                   <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Daily Limit</p>
                      <p className="text-sm font-black text-slate-700 uppercase">{plan.dailyLimit} Tasks</p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-emerald-500 shadow-inner"><TrendingUp size={18}/></div>
                   <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Daily Yield</p>
                      <p className="text-sm font-black text-emerald-600 uppercase">Rs {plan.dailyEarning}</p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-amber-500 shadow-inner"><Award size={18}/></div>
                   <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Ref Bonus</p>
                      <p className="text-sm font-black text-amber-600 uppercase">Rs {plan.referralBonus}</p>
                   </div>
                </div>
             </div>

             <div className="flex gap-2 pt-6 border-t border-slate-50">
                <button onClick={() => toggleStatus(plan.id)} className={clsx("flex-1 h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm flex items-center justify-center gap-2", plan.isActive ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-slate-100 text-slate-400")}>
                   {plan.isActive ? <Eye size={18}/> : <EyeOff size={18}/>}
                </button>
                <button onClick={() => setEditing(plan)} className="w-12 h-12 bg-white border border-slate-100 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-slate-950 hover:text-white transition-all active:scale-90 shadow-sm"><Edit3 size={18}/></button>
                <button onClick={() => deletePlan(plan.id)} className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all active:scale-90 shadow-sm"><Trash2 size={18}/></button>
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
                   <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Station <span className="text-[#4A6CF7]">Node.</span></h3>
                   <button type="button" onClick={() => setEditing(null)} className="p-3 bg-slate-50 rounded-full hover:bg-rose-50 hover:text-rose-500 transition-all"><X size={28}/></button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="md:col-span-2 space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6 italic">Pack Name</label>
                      <input required value={editing.name} onChange={e => setEditing({...editing, name: e.target.value.toUpperCase()})} className="w-full h-14 px-7 bg-slate-50 border border-slate-100 rounded-[28px] font-black text-sm text-slate-900 outline-none focus:bg-white transition-all shadow-inner" placeholder="e.g. GOLD" />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6">Price (PKR)</label>
                      <input required type="number" value={editing.price} onChange={e => setEditing({...editing, price: Number(e.target.value)})} className="w-full h-14 px-7 bg-slate-50 border border-slate-100 rounded-[28px] font-bold text-sm outline-none shadow-inner" />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6">Daily Tasks</label>
                      <input required type="number" value={editing.dailyLimit} onChange={e => setEditing({...editing, dailyLimit: Number(e.target.value)})} className="w-full h-14 px-7 bg-slate-50 border border-slate-100 rounded-[28px] font-bold text-sm outline-none shadow-inner" />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6">Daily Yield</label>
                      <input required type="number" value={editing.dailyEarning} onChange={e => setEditing({...editing, dailyEarning: Number(e.target.value)})} className="w-full h-14 px-7 bg-slate-50 border border-slate-100 rounded-[28px] font-bold text-sm outline-none shadow-inner" />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6">Ref Bonus</label>
                      <input required type="number" value={editing.referralBonus} onChange={e => setEditing({...editing, referralBonus: Number(e.target.value)})} className="w-full h-14 px-7 bg-slate-50 border border-slate-100 rounded-[28px] font-bold text-sm outline-none shadow-inner" />
                   </div>
                </div>

                <div className="pt-6">
                   <button type="submit" disabled={saveLoading} className="w-full h-18 bg-slate-950 text-white rounded-[32px] font-black text-[12px] uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50">
                      {saveLoading ? <Loader2 className="animate-spin" size={24}/> : <><ShieldCheck size={24} className="text-sky-400" /> Commit Station</>}
                   </button>
                </div>
             </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlanManager;
