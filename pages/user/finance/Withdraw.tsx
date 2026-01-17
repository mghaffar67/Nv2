
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, 
  ArrowRight, 
  ShieldCheck, 
  Info, 
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Banknote,
  Loader2,
  TrendingDown
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../utils/api';

const Withdraw = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [form, setForm] = useState({
    amount: '',
    accountNumber: user?.withdrawalInfo?.accountNumber || '',
    accountTitle: user?.withdrawalInfo?.accountTitle || '',
    gateway: user?.withdrawalInfo?.provider || 'EasyPaisa'
  });

  const feePercent = 10;
  const netAmount = Number(form.amount) ? Number(form.amount) - (Number(form.amount) * (feePercent / 100)) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Number(form.amount) > (user?.balance || 0)) return alert("Insufficient balance!");
    if (Number(form.amount) < 500) return alert("Minimum withdrawal is PKR 500.");

    setLoading(true);
    try {
      // Fixed: Now calling modular backend route
      const res = await api.post('/finance/withdraw', { 
        userId: user?.id, 
        ...form,
        amount: Number(form.amount) 
      });
      
      // Sync local user session with new balance
      const updatedUser = { ...user, balance: (user?.balance || 0) - Number(form.amount) };
      localStorage.setItem('noor_user', JSON.stringify(updatedUser));
      
      setSuccess(true);
    } catch (err: any) {
      alert(err.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-10 rounded-[44px] shadow-2xl border border-slate-50">
          <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner"><CheckCircle2 size={44} /></div>
          <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tighter italic">Queue Locked</h2>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest leading-relaxed mb-10">Your payout request of Rs. {form.amount} is registered. Funds will arrive in your {form.gateway} node within 24 hours.</p>
          <button onClick={() => window.location.reload()} className="w-full bg-slate-900 text-white h-16 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl">Audit Ledger</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-4 pb-24 px-1 animate-fade-in">
      {/* 1. BALANCE OVERVIEW */}
      <div className="bg-slate-900 p-8 rounded-[36px] text-white relative overflow-hidden shadow-2xl mx-1">
        <div className="absolute top-0 right-0 p-8 opacity-5 scale-150 rotate-12"><Wallet size={100} /></div>
        <div className="relative z-10">
           <p className="text-sky-400 text-[9px] font-black uppercase tracking-[0.2em] mb-2 italic">Available Liquidity</p>
           <h2 className="text-5xl font-black tracking-tighter leading-none mb-1">Rs. {(user?.balance || 0).toLocaleString()}</h2>
           <div className="flex items-center gap-2 text-slate-500 text-[8px] font-bold uppercase tracking-widest mt-4">
              <ShieldCheck size={12} className="text-green-500" /> Secure Protocol v3.2
           </div>
        </div>
      </div>

      {/* 2. GATEWAY SELECT */}
      <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm mx-1">
         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-2 italic">Method Selection</p>
         <div className="grid grid-cols-3 gap-2">
            {['EasyPaisa', 'JazzCash', 'Bank Transfer'].map(opt => (
              <button 
                key={opt}
                onClick={() => setForm({...form, gateway: opt})}
                className={clsx(
                  "py-3.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all",
                  form.gateway === opt ? "bg-slate-900 border-slate-900 text-white shadow-lg" : "bg-slate-50 border-slate-50 text-slate-400 hover:border-slate-200"
                )}
              >
                {opt === 'Bank Transfer' ? <Banknote size={14}/> : <Smartphone size={14}/>}
                <span className="text-[7px] font-black uppercase whitespace-nowrap">{opt}</span>
              </button>
            ))}
         </div>
      </div>

      {/* 3. INPUT FORM */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-[36px] border border-slate-100 shadow-sm space-y-5 mx-1">
         <div className="space-y-4">
            <div className="space-y-2">
               <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Account Title (Receiver)</label>
               <input type="text" placeholder="Ali Ahmed" required value={form.accountTitle} onChange={e => setForm({...form, accountTitle: e.target.value})} className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs outline-none" />
            </div>
            <div className="space-y-2">
               <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">{form.gateway === 'Bank Transfer' ? 'IBAN / Account Number' : 'Mobile Number'}</label>
               <input type="text" placeholder={form.gateway === 'Bank Transfer' ? 'PK00...' : '03xx-xxxxxxx'} required value={form.accountNumber} onChange={e => setForm({...form, accountNumber: e.target.value})} className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs outline-none" />
            </div>
            <div className="space-y-2 pt-2">
               <div className="flex justify-between items-center mb-1 px-3">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Withdrawal Amount</label>
                  <span className="text-[8px] font-black text-rose-500 uppercase">Min Rs. 500</span>
               </div>
               <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 font-black text-xl italic">Rs</span>
                  <input type="number" placeholder="500" required value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className="w-full h-20 pl-16 pr-6 bg-slate-900 border border-slate-800 rounded-[28px] font-black text-3xl text-white outline-none focus:ring-8 focus:ring-indigo-50/10 transition-all placeholder:text-slate-800" />
               </div>
            </div>
         </div>

         {/* 4. FEE CALCULATOR */}
         {Number(form.amount) >= 500 && (
           <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 space-y-2">
              <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-indigo-400">
                 <span>Maintenance Fee ({feePercent}%)</span>
                 <span className="text-rose-500">- Rs. {(Number(form.amount) * 0.1).toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-indigo-900 pt-1 border-t border-indigo-200">
                 <span>Settlement Value</span>
                 <span className="text-green-600">Rs. {netAmount.toLocaleString()}</span>
              </div>
           </motion.div>
         )}

         <button 
           type="submit" 
           disabled={loading || (user?.balance || 0) < 500 || !form.amount}
           className="w-full h-16 bg-indigo-600 text-white rounded-[24px] font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 transition-all"
         >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <>Request Payout <ArrowRight size={18} /></>}
         </button>
      </form>
    </div>
  );
};

export default Withdraw;
