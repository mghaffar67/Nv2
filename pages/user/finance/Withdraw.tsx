import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, ArrowRight, ShieldCheck, Info, 
  Smartphone, Loader2, User, CreditCard, Zap, 
  AlertTriangle, History, Zap as ZapIcon, ChevronLeft, Banknote
} from 'lucide-react';
import { clsx } from 'clsx';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../utils/api';

const Withdraw = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [gateway, setGateway] = useState('EasyPaisa');
  
  const [form, setForm] = useState({
    amount: '',
    accountNumber: user?.withdrawalInfo?.accountNumber || '',
    accountTitle: user?.withdrawalInfo?.accountTitle || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Number(form.amount) < 500) return alert("System Constraint: Minimum payout is PKR 500.");
    if (Number(form.amount) > (user?.balance || 0)) return alert("Liquidity Violation: Insufficient Ledger Balance.");

    setLoading(true);
    try {
      await api.post('/finance/withdraw', { 
        userId: user?.id, 
        ...form,
        gateway,
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
          <div className="w-24 h-24 bg-indigo-600 text-white rounded-[35px] flex items-center justify-center mx-auto mb-8 shadow-xl">
            <ZapIcon size={52} fill="currentColor" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter uppercase italic leading-none">Payout Locked</h2>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest leading-relaxed mb-10">PKR deducted from your node. Sync completes in 24 hours.</p>
          <button onClick={() => navigate('/user/history')} className="w-full bg-slate-900 text-white h-16 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all">Go to History</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-4 pb-32 px-1 animate-fade-in">
      
      {/* 1. BRANDED BALANCE CARD (Match Image) */}
      <div className="bg-slate-950 p-8 rounded-[44px] text-white shadow-2xl relative overflow-hidden text-center mx-1">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/5 via-transparent to-sky-500/5" />
        <div className="relative z-10">
           <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] mb-4 text-emerald-400">
              <ShieldCheck size={10} className="animate-pulse" /> SECURE LEDGER
           </div>
           <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-4">Net Liquidity</p>
           <h1 className="text-6xl font-black tracking-tighter leading-none mb-8">
             <span className="text-2xl text-emerald-400 mr-1 italic font-black">PKR</span>
             {(user?.balance || 0).toLocaleString()}
           </h1>
           <div className="grid grid-cols-2 gap-2">
              <Link to="/user/history" className="h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all">
                 <History size={16} className="text-sky-400" />
                 <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Audit Log</span>
              </Link>
              <Link to="/user/plans" className="h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all">
                 <Zap size={16} className="text-amber-400" />
                 <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Upgrade Hub</span>
              </Link>
           </div>
        </div>
      </div>

      {/* 2. TAB SWITCHER */}
      <div className="bg-white p-1 rounded-2xl border border-slate-100 shadow-sm flex gap-1 mx-1">
         <Link to="/user/wallet" className="flex-1 h-11 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 text-slate-400">
            <Smartphone size={16} /> Deposit
         </Link>
         <button className="flex-1 h-11 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 bg-slate-900 text-white shadow-lg">
            <Banknote size={16} /> Withdraw
         </button>
      </div>

      {/* 3. WITHDRAWAL CONTEXT CONTAINER */}
      <div className="bg-white p-6 rounded-[40px] border border-slate-100 shadow-sm space-y-6 mx-1">
        <div className="space-y-4">
          <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest ml-2">Destination Node</p>
          <div className="grid grid-cols-3 gap-2">
            {['EasyPaisa', 'JazzCash', 'Bank Transfer'].map(m => (
              <button 
                key={m} 
                onClick={() => setGateway(m)}
                className={clsx(
                  "py-3 rounded-xl border-2 text-[8px] font-black uppercase tracking-tighter transition-all",
                  gateway === m ? "bg-white border-slate-900 text-slate-900 shadow-md" : "bg-white border-slate-50 text-slate-300"
                )}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="space-y-4">
             <div className="space-y-1">
                <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest ml-3">Account Number</label>
                <div className="relative">
                   <Smartphone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                   <input 
                     type="tel" placeholder="03xx" value={form.accountNumber}
                     onChange={e => setForm({...form, accountNumber: e.target.value})}
                     className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none focus:bg-white"
                   />
                </div>
             </div>
             <div className="space-y-1">
                <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest ml-3">Account Title</label>
                <div className="relative">
                   <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                   <input 
                     type="text" placeholder="Owner Name" value={form.accountTitle}
                     onChange={e => setForm({...form, accountTitle: e.target.value})}
                     className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none focus:bg-white"
                   />
                </div>
             </div>
          </div>

          {/* LARGE CENTERED INPUT FOR AMOUNT */}
          <div className="pt-4 text-center">
             <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic mb-2 block">Payout Value</label>
             <div className="relative inline-flex items-center justify-center w-full">
                <span className="absolute left-6 text-2xl font-black text-slate-200">Rs</span>
                <input 
                  type="number" placeholder="Min 500" value={form.amount}
                  onChange={e => setForm({...form, amount: e.target.value})}
                  className="w-full h-20 bg-slate-50 border-b-4 border-slate-100 rounded-3xl text-center font-black text-3xl text-slate-800 outline-none placeholder:text-slate-200 focus:bg-white focus:border-indigo-600 transition-all"
                />
             </div>
          </div>
        </div>

        <button 
          onClick={handleSubmit} 
          disabled={loading || !form.amount}
          className="w-full h-16 bg-indigo-600 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 size={24} className="animate-spin" /> : 'Request Payout'}
        </button>
      </div>

      <div className="p-5 bg-amber-50 rounded-[32px] border border-amber-100 flex items-start gap-4 mx-1">
         <Info size={18} className="text-amber-500 shrink-0 mt-0.5" />
         <p className="text-[8px] font-bold text-amber-800 uppercase tracking-widest leading-relaxed">
           Financial Node: Manual verification is active. Payouts are processed in 2 batches daily. Processing window is typically 12-24 hours PST.
         </p>
      </div>
    </div>
  );
};

export default Withdraw;