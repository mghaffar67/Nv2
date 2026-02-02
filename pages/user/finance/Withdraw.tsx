import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, ArrowRight, ShieldCheck, Info, Loader2, Banknote, CheckCircle2, ChevronLeft, AlertCircle, Users, Zap, ShieldAlert } from 'lucide-react';
import { clsx } from 'clsx';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useConfig } from '../../../context/ConfigContext';
import { api } from '../../../utils/api';

const Withdraw = () => {
  const { user } = useAuth();
  const { config } = useConfig();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [gateway, setGateway] = useState('EasyPaisa');
  const [error, setError] = useState<string | null>(null);
  const [teamCount, setTeamCount] = useState(0);
  
  const [form, setForm] = useState({
    amount: '',
    accountNumber: user?.withdrawalInfo?.accountNumber || '',
    accountTitle: user?.withdrawalInfo?.accountTitle || ''
  });

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await api.get('/auth/team');
        const count = (res.t1?.length || 0) + (res.t2?.length || 0) + (res.t3?.length || 0);
        setTeamCount(count);
      } catch (e) {}
    };
    fetchTeam();
  }, []);

  const minLimit = config.financeSettings.minWithdraw || 500;
  const reqActive = config.financeSettings.referralRequirementActive;
  const reqCount = config.financeSettings.requiredReferralCount;

  const meetsRequirement = !reqActive || teamCount >= reqCount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetsRequirement) return;
    setError(null);
    
    const amt = Number(form.amount);
    if (amt < minLimit) return setError(`Minimum Rs. ${minLimit} withdrawal is allowed.`);
    if (amt > (user?.balance || 0)) return setError("Wallet mein itni raqam nahi hai.");
    
    setLoading(true);
    try {
      const res = await api.post('/finance/withdraw', { 
        userId: user?.id, 
        ...form, 
        gateway, 
        amount: amt 
      });
      
      // Update local storage balance immediately to match server-side atomic deduction
      if (res.newBalance !== undefined) {
        const currentUser = JSON.parse(localStorage.getItem('noor_user') || '{}');
        currentUser.balance = res.newBalance;
        localStorage.setItem('noor_user', JSON.stringify(currentUser));
      }
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Withdrawal node rejected the request.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 text-center animate-fade-in">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-12 rounded-[50px] shadow-2xl border border-emerald-50">
          <div className="w-20 h-20 bg-emerald-500 text-white rounded-[30px] flex items-center justify-center mx-auto mb-8 shadow-xl"><CheckCircle2 size={40} /></div>
          <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tighter uppercase italic leading-none">REQUEST FILED</h2>
          <p className="text-slate-500 font-bold uppercase text-[9px] tracking-widest leading-relaxed mb-10">Your funds are now locked in the audit queue. Payouts arrive in 24h.</p>
          <button onClick={() => navigate('/user/dashboard')} className="w-full bg-slate-950 text-white h-16 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all">Back to Home</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-5 pb-32 px-1 animate-fade-in">
      <header className="flex items-center justify-between px-2 pt-2">
        <Link to="/user/wallet" className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 active:scale-90 transition-all"><ChevronLeft size={20} /></Link>
        <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">Cashout <span className="text-indigo-600">Hub</span></h1>
        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-sky-400 shadow-lg"><Banknote size={18} /></div>
      </header>

      {!meetsRequirement && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-rose-50 border border-rose-100 p-6 rounded-[32px] mx-1 space-y-4 shadow-sm">
           <div className="flex items-center gap-3 text-rose-600">
              <ShieldAlert size={24} className="shrink-0" />
              <h3 className="font-black text-[11px] uppercase tracking-widest leading-none">Withdrawal Blocked</h3>
           </div>
           <p className="text-[10px] text-rose-700 font-bold uppercase leading-relaxed">System policy requires <span className="text-sm font-black underline">{reqCount} active members</span> in your team to authorize payouts.</p>
           <div className="flex justify-between items-center bg-white/60 p-4 rounded-2xl border border-rose-100 shadow-inner">
              <div className="text-[9px] font-black text-slate-400 uppercase">Progress Node</div>
              <div className="text-sm font-black text-rose-600">{teamCount} / {reqCount} Members</div>
           </div>
           <Link to="/user/team" className="w-full h-12 bg-rose-600 text-white rounded-xl font-black text-[9px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all">Invite Now <ArrowRight size={14}/></Link>
        </motion.div>
      )}

      <div className="bg-slate-950 p-8 rounded-[44px] text-white shadow-2xl relative overflow-hidden mx-1 border-b-4 border-indigo-500">
         <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12 scale-150"><Zap size={100} fill="currentColor" /></div>
         <div className="relative z-10 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">Available Liquidity</p>
                 <h2 className="text-4xl font-black italic tracking-tighter">Rs. {(user?.balance || 0).toLocaleString()}</h2>
              </div>
              <div className="w-11 h-11 bg-white/10 rounded-2xl flex items-center justify-center text-sky-400 border border-white/5 shadow-inner"><Wallet size={20} /></div>
            </div>
         </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 mx-1 text-[10px] font-black uppercase shadow-sm">
             <AlertCircle size={18} /> {error}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className={clsx("bg-white p-8 rounded-[44px] border border-slate-100 shadow-sm space-y-6 mx-1 transition-all", !meetsRequirement && "opacity-40 pointer-events-none grayscale")}>
        <div className="grid grid-cols-2 gap-3">
           {['EasyPaisa', 'JazzCash'].map(m => (
             <button key={m} type="button" onClick={() => setGateway(m)} className={clsx("py-4 rounded-2xl border-2 text-[10px] font-black uppercase tracking-widest transition-all shadow-sm", gateway === m ? "bg-slate-950 border-slate-950 text-white" : "bg-white border-slate-50 text-slate-300 hover:border-indigo-100")}>{m}</button>
           ))}
        </div>
        
        <div className="space-y-5 pt-2">
           <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Withdrawal Amount (PKR)</label>
              <div className="relative">
                 <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-300 text-lg">Rs</span>
                 <input 
                   type="number" placeholder="Min. 500" value={form.amount} 
                   onChange={e => setForm({...form, amount: e.target.value})} 
                   className="w-full h-16 pl-14 pr-6 bg-slate-50 border border-slate-100 rounded-3xl font-black text-xl outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50/50 transition-all shadow-inner" required 
                 />
              </div>
           </div>
           
           <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Wallet Destination</label>
              <input type="tel" placeholder="Mobile Number (03xxxxxxxxx)" value={form.accountNumber} onChange={e => setForm({...form, accountNumber: e.target.value})} className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none shadow-inner" required />
           </div>

           <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Account Title</label>
              <input type="text" placeholder="Owner Name" value={form.accountTitle} onChange={e => setForm({...form, accountTitle: e.target.value})} className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none shadow-inner" required />
           </div>
        </div>

        <button 
          type="submit" 
          disabled={loading || !meetsRequirement} 
          className="w-full h-18 bg-indigo-600 text-white rounded-[32px] font-black text-[12px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 size={24} className="animate-spin" /> : <><ShieldCheck size={24} className="text-sky-400" /> Confirm Payout</>}
        </button>

        <div className="bg-amber-50 p-5 rounded-[28px] border border-amber-100 flex items-start gap-4">
           <ShieldCheck size={20} className="text-amber-600 shrink-0 mt-0.5" />
           <p className="text-[9px] font-bold text-amber-800 uppercase leading-relaxed tracking-wider">
             Atomic Logic: Requested amount is deducted immediately to prevent ledger fragmentation. Rejected requests are refunded automatically.
           </p>
        </div>
      </form>
    </div>
  );
};

export default Withdraw;