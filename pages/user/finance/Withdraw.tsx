
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, ArrowRight, ShieldCheck, Info, Loader2, Banknote, CheckCircle2, ChevronLeft, AlertCircle, Users, Zap } from 'lucide-react';
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

  const minLimit = config.financeSettings.minWithdraw;
  const maxLimit = config.financeSettings.maxWithdraw;
  const reqActive = config.financeSettings.referralRequirementActive;
  const reqCount = config.financeSettings.requiredReferralCount;

  const meetsRequirement = !reqActive || teamCount >= reqCount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetsRequirement) return;
    setError(null);
    
    const amt = Number(form.amount);
    if (amt < minLimit) return setError(`Minimum Rs. ${minLimit} withdrawal is allowed.`);
    if (amt > (user?.balance || 0)) return setError("Insufficient account balance.");
    
    setLoading(true);
    try {
      await api.post('/finance/withdraw', { userId: user?.id, ...form, gateway, amount: amt });
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
          <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tighter uppercase italic">SUCCESS!</h2>
          <p className="text-slate-500 font-bold uppercase text-[9px] tracking-widest leading-relaxed mb-10">Your request has been sent for review. Payouts arrive within 24 hours.</p>
          <button onClick={() => navigate('/user/dashboard')} className="w-full bg-slate-900 text-white h-16 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all">Go Home</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-5 pb-32 px-1 animate-fade-in">
      <header className="flex items-center justify-between px-2 pt-2">
        <Link to="/user/wallet" className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 active:scale-90 transition-all"><ChevronLeft size={20} /></Link>
        <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">Withdraw <span className="text-indigo-600">Earnings</span></h1>
        <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-sky-400 shadow-lg"><Banknote size={16} /></div>
      </header>

      {!meetsRequirement && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-rose-50 border border-rose-100 p-6 rounded-[32px] mx-1 space-y-4">
           <div className="flex items-center gap-3 text-rose-600">
              <ShieldCheck size={24} className="shrink-0" />
              <h3 className="font-black text-[11px] uppercase tracking-widest">Withdrawal Blocked</h3>
           </div>
           <p className="text-[10px] text-rose-700 font-bold uppercase leading-relaxed">System policy requires you to invite at least <span className="text-sm font-black underline">{reqCount} active members</span> to your team before your first withdrawal.</p>
           <div className="flex justify-between items-center bg-white/60 p-4 rounded-2xl border border-rose-100">
              <div className="text-[9px] font-black text-slate-400 uppercase">Your Progress</div>
              <div className="text-sm font-black text-rose-600">{teamCount} / {reqCount} Members</div>
           </div>
           <Link to="/user/team" className="w-full h-12 bg-rose-600 text-white rounded-xl font-black text-[9px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-lg">Grow Your Team <ArrowRight size={14}/></Link>
        </motion.div>
      )}

      <div className="bg-slate-950 p-6 rounded-[36px] text-white shadow-xl relative overflow-hidden mx-1">
         <div className="relative z-10 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                 <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">Current Balance</p>
                 <h2 className="text-3xl font-black italic">Rs. {(user?.balance || 0).toLocaleString()}</h2>
              </div>
              <span className="px-2 py-1 bg-white/10 border border-white/10 rounded-lg text-[7px] font-black uppercase text-sky-400">Ledger Verified</span>
            </div>
         </div>
      </div>

      <form onSubmit={handleSubmit} className={clsx("bg-white p-6 rounded-[36px] border border-slate-100 shadow-sm space-y-5 mx-1 transition-opacity", !meetsRequirement && "opacity-40 pointer-events-none")}>
        <div className="grid grid-cols-2 gap-2">
           {['EasyPaisa', 'JazzCash'].map(m => (
             <button key={m} type="button" onClick={() => setGateway(m)} className={clsx("py-3 rounded-xl border-2 text-[10px] font-black uppercase transition-all", gateway === m ? "bg-slate-900 border-slate-900 text-white" : "bg-white border-slate-50 text-slate-300")}>{m}</button>
           ))}
        </div>
        <div className="space-y-4">
           <div className="space-y-1.5">
              <label className="text-[8px] font-black text-slate-400 uppercase ml-3">Amount to withdraw</label>
              <input type="number" placeholder="Enter Amount" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-xl font-black text-sm outline-none focus:bg-white" required />
           </div>
           <input type="tel" placeholder="Account Number" value={form.accountNumber} onChange={e => setForm({...form, accountNumber: e.target.value})} className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs" required />
           <input type="text" placeholder="Account Holder Name" value={form.accountTitle} onChange={e => setForm({...form, accountTitle: e.target.value})} className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs" required />
        </div>
        <button type="submit" disabled={loading || !meetsRequirement} className="w-full h-16 bg-indigo-600 text-white rounded-[28px] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all">
          {loading ? <Loader2 size={20} className="animate-spin" /> : <>Request Payout Now</>}
        </button>
      </form>
    </div>
  );
};

export default Withdraw;
