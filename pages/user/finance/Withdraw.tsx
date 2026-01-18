
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, ArrowRight, ShieldCheck, Info, 
  CheckCircle2, Smartphone, Banknote, Loader2,
  User, CreditCard, Zap, AlertTriangle, ChevronLeft
} from 'lucide-react';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../utils/api';

const Withdraw = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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
    if (Number(form.amount) > (user?.balance || 0)) return alert("Liquidity Violation: Insufficient Ledger Balance.");
    if (Number(form.amount) < 500) return alert("System Constraint: Minimum payout is PKR 500.");

    setLoading(true);
    try {
      await api.post('/finance/withdraw', { 
        userId: user?.id, 
        ...form,
        amount: Number(form.amount) 
      });
      setSuccess(true);
    } catch (err: any) {
      alert(err.message || "Withdrawal rejection from core.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 text-center animate-fade-in">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-12 rounded-[50px] shadow-2xl border border-indigo-50">
          <div className="w-24 h-24 bg-indigo-600 text-white rounded-[35px] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-indigo-200">
            <Zap size={52} fill="currentColor" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter uppercase italic leading-none">Payout Locked</h2>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest leading-relaxed mb-10">Liquidity deducted from node. Automated transfer completes within 24 hours.</p>
          <button onClick={() => navigate('/user/history')} className="w-full bg-slate-900 text-white h-16 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all">Audit History</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-8 pb-32 px-1 animate-fade-in">
      
      {/* 1. BALANCE HEADER */}
      <div className="text-center pt-4">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4 italic">Available Portfolio Balance</p>
        <h2 className="text-6xl font-black tracking-tighter text-slate-900 leading-none">
          <span className="text-2xl mr-2 italic text-indigo-500 font-black">Rs</span>
          {(user?.balance || 0).toLocaleString()}
        </h2>
      </div>

      {/* 2. HUGE CENTERED AMOUNT INPUT - REDESIGN FOCUS */}
      <div className="px-4">
         <div className="bg-white p-12 rounded-[44px] border border-slate-100 shadow-sm text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 italic">Enter Disbursal Amount</p>
            <div className="relative inline-block w-full">
               <input 
                 type="number" 
                 placeholder="000" 
                 required
                 value={form.amount} 
                 onChange={e => setForm({...form, amount: e.target.value})}
                 className="w-full text-center font-black text-7xl md:text-8xl text-slate-900 bg-transparent outline-none placeholder:text-slate-100 tracking-tighter border-b-4 border-slate-50 focus:border-indigo-600 transition-all pb-6"
               />
            </div>
            {Number(form.amount) >= 500 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 flex items-center justify-center gap-2">
                <span className="px-5 py-2.5 bg-indigo-50 text-indigo-600 rounded-full text-[11px] font-black uppercase tracking-widest border border-indigo-100 shadow-sm">
                  Settlement: Rs. {netAmount.toLocaleString()}
                </span>
              </motion.div>
            )}
         </div>
      </div>

      {/* 3. ACCOUNT DETAILS */}
      <form onSubmit={handleSubmit} className="space-y-4 px-2">
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
           <div className="flex gap-2 p-1.5 bg-slate-100 rounded-[24px]">
              {['EasyPaisa', 'JazzCash'].map(opt => (
                <button 
                  key={opt} type="button"
                  onClick={() => setForm({...form, gateway: opt})}
                  className={clsx(
                    "flex-1 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all",
                    form.gateway === opt ? "bg-white text-slate-900 shadow-md" : "text-slate-400"
                  )}
                >
                  {opt}
                </button>
              ))}
           </div>

           <div className="space-y-4">
              <div className="relative group">
                 <User size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                 <input 
                   type="text" placeholder="Account Holder Title" required
                   value={form.accountTitle} onChange={e => setForm({...form, accountTitle: e.target.value})}
                   className="w-full h-16 pl-16 pr-6 bg-slate-50 border border-slate-100 rounded-[28px] font-bold text-sm outline-none focus:bg-white transition-all"
                 />
              </div>
              <div className="relative group">
                 <CreditCard size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                 <input 
                   type="text" placeholder="Wallet Identity Number" required
                   value={form.accountNumber} onChange={e => setForm({...form, accountNumber: e.target.value})}
                   className="w-full h-16 pl-16 pr-6 bg-slate-50 border border-slate-100 rounded-[28px] font-mono text-sm font-black outline-none focus:bg-white transition-all"
                 />
              </div>
           </div>
        </div>

        {/* 4. WARNING ALERT */}
        <div className="bg-amber-50 p-7 rounded-[40px] border border-amber-100 flex items-start gap-4 mx-1">
           <AlertTriangle size={24} className="text-amber-500 shrink-0 mt-1" />
           <div>
              <h4 className="text-[11px] font-black text-amber-900 uppercase tracking-tight italic">Financial Protocol</h4>
              <p className="text-[10px] font-bold text-amber-700 leading-relaxed uppercase tracking-wider mt-1.5">
                Withdrawals are manually verified by risk nodes. Standard cycle completes within 24 hours. A 10% network service fee applies.
              </p>
           </div>
        </div>

        <div className="pt-6">
           <button 
             type="submit" 
             disabled={loading || (user?.balance || 0) < 500 || !form.amount}
             className="w-full h-20 bg-slate-900 text-white rounded-[32px] font-black text-sm uppercase tracking-[0.4em] shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-all disabled:opacity-50"
           >
             {loading ? <Loader2 className="animate-spin" /> : <>Process Payout <ArrowRight size={24} /></>}
           </button>
        </div>
      </form>
    </div>
  );
};

export default Withdraw;
