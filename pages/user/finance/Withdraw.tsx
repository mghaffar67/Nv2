import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, ArrowRight, ShieldCheck, Info, 
  Smartphone, Loader2, User, Zap, 
  AlertTriangle, History, Zap as ZapIcon, ChevronLeft, Banknote,
  CheckCircle2, X
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
  const [showConfirm, setShowConfirm] = useState(false);
  const [gateway, setGateway] = useState('EasyPaisa');
  
  const [form, setForm] = useState({
    amount: '',
    accountNumber: user?.withdrawalInfo?.accountNumber || '',
    accountTitle: user?.withdrawalInfo?.accountTitle || ''
  });

  const validateAndPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (Number(form.amount) < 500) return alert("System Constraint: Minimum payout is PKR 500.");
    if (Number(form.amount) > (user?.balance || 0)) return alert("Liquidity Violation: Insufficient Ledger Balance.");
    if (!form.accountNumber || !form.accountTitle) return alert("Missing Destination Hubs: Complete account details.");
    setShowConfirm(true);
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    setShowConfirm(false);
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
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-10 rounded-[50px] shadow-2xl border border-indigo-50">
          <div className="w-20 h-20 bg-emerald-500 text-white rounded-[30px] flex items-center justify-center mx-auto mb-8 shadow-xl">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tighter uppercase italic">Request Filed</h2>
          <p className="text-slate-500 font-bold uppercase text-[9px] tracking-widest leading-relaxed mb-10">Your payout is locked in the queue. Sync completes within 12-24 hours.</p>
          <button onClick={() => navigate('/user/wallet')} className="w-full bg-slate-900 text-white h-14 rounded-[22px] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all">Back to Wallet</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-4 pb-32 px-1 animate-fade-in">
      <header className="flex items-center justify-between px-2 pt-2 shrink-0">
        <Link to="/user/wallet" className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 active:scale-90 transition-all">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-lg font-black text-slate-900 tracking-tighter uppercase italic leading-none">Payout <span className="text-indigo-600">Terminal</span></h1>
        <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-sky-400 shadow-lg">
          <Banknote size={16} />
        </div>
      </header>
      
      <div className="bg-slate-950 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden text-center mx-1">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10">
           <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[7px] font-black uppercase tracking-[0.2em] mb-4 text-emerald-400">
              <ShieldCheck size={10} className="animate-pulse" /> SECURE REGISTRY
           </div>
           <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 italic">Available Liquid</p>
           <h1 className="text-5xl font-black tracking-tighter leading-none mb-6">
             <span className="text-xl text-emerald-400 mr-2 italic font-black">Rs.</span>
             {(user?.balance || 0).toLocaleString()}
           </h1>
           <div className="flex justify-center gap-2">
              <Link to="/user/history" className="px-4 py-2 bg-white/5 rounded-xl text-[8px] font-black uppercase tracking-widest text-slate-400 border border-white/5">Verification History</Link>
           </div>
        </div>
      </div>

      <form onSubmit={validateAndPrompt} className="bg-white p-6 rounded-[36px] border border-slate-100 shadow-sm space-y-6 mx-1">
        <div className="text-center space-y-2">
           <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic">Withdrawal Value</p>
           <div className="relative inline-flex items-center justify-center w-full">
              <span className="absolute left-4 text-xl font-black text-slate-300 italic">Rs</span>
              <input 
                type="number" placeholder="0000" required
                value={form.amount} onChange={e => setForm({...form, amount: e.target.value})}
                className="w-full bg-slate-50 border-b-2 border-slate-100 focus:border-indigo-600 text-4xl font-black text-slate-900 text-center outline-none transition-all py-4 rounded-2xl"
              />
           </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {['EasyPaisa', 'JazzCash', 'Bank'].map(m => (
              <button 
                key={m} type="button" onClick={() => setGateway(m)}
                className={clsx(
                  "py-3 rounded-xl border-2 text-[8px] font-black uppercase transition-all",
                  gateway === m ? "bg-slate-950 border-slate-950 text-white shadow-lg" : "bg-white border-slate-50 text-slate-300"
                )}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="space-y-3">
             <div className="space-y-1">
                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-3">Receiver Account</label>
                <input 
                  type="tel" placeholder="03XX XXXXXXX" required
                  value={form.accountNumber} onChange={e => setForm({...form, accountNumber: e.target.value})}
                  className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl font-black text-xs text-slate-800 outline-none focus:bg-white"
                />
             </div>
             <div className="space-y-1">
                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-3">Account Title</label>
                <input 
                  type="text" placeholder="Owner Full Name" required
                  value={form.accountTitle} onChange={e => setForm({...form, accountTitle: e.target.value})}
                  className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl font-black text-xs text-slate-800 outline-none focus:bg-white"
                />
             </div>
          </div>
        </div>

        <button 
          type="submit" disabled={loading || !form.amount}
          className="w-full h-14 bg-indigo-600 text-white rounded-[22px] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          {loading ? <Loader2 size={20} className="animate-spin" /> : <>Initialize Payout <ArrowRight size={16} /></>}
        </button>
      </form>

      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowConfirm(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
             <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-sm bg-white rounded-[40px] p-8 shadow-2xl border border-white">
                <div className="text-center mb-8">
                   <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4"><AlertTriangle size={32} /></div>
                   <h3 className="text-xl font-black text-slate-900 uppercase italic">Confirm Verification</h3>
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Verify destination hubs</p>
                </div>

                <div className="space-y-3 mb-8">
                   <div className="flex justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[8px] font-black text-slate-400 uppercase">Payout Value</span>
                      <span className="text-xs font-black text-indigo-600">Rs {form.amount}</span>
                   </div>
                   <div className="flex justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[8px] font-black text-slate-400 uppercase">Provider</span>
                      <span className="text-xs font-black text-slate-800">{gateway}</span>
                   </div>
                   <div className="flex flex-col p-3 bg-slate-50 rounded-xl border border-slate-100 gap-1 text-left">
                      <span className="text-[8px] font-black text-slate-400 uppercase">Account Details</span>
                      <span className="text-[10px] font-black text-slate-800 uppercase tracking-tight">{form.accountTitle}</span>
                      <span className="text-[10px] font-mono font-black text-indigo-500">{form.accountNumber}</span>
                   </div>
                </div>

                <div className="flex gap-2">
                   <button onClick={handleFinalSubmit} className="flex-1 h-12 bg-slate-900 text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">Submit Protocol</button>
                   <button onClick={() => setShowConfirm(false)} className="px-6 h-12 bg-slate-50 text-slate-400 rounded-xl font-black text-[9px] uppercase active:scale-95 transition-all">Abort</button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Withdraw;