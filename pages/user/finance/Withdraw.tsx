
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, ArrowRight, ShieldCheck, Info, 
  Smartphone, Loader2, User, Zap, 
  AlertTriangle, History, Zap as ZapIcon, ChevronLeft, Banknote,
  CheckCircle2, X, Filter, ArrowUpRight, ArrowDownLeft, AlertCircle
} from 'lucide-react';
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
  const [history, setHistory] = useState<any[]>([]);
  const [success, setSuccess] = useState(false);
  const [gateway, setGateway] = useState('EasyPaisa');
  const [error, setError] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    amount: '',
    accountNumber: user?.withdrawalInfo?.accountNumber || '',
    accountTitle: user?.withdrawalInfo?.accountTitle || ''
  });

  const minLimit = config.financeSettings.minWithdraw || 500;
  const maxLimit = config.financeSettings.maxWithdraw || 50000;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/finance/history');
        setHistory(Array.isArray(res) ? res : []);
      } catch (e) {}
    };
    fetchHistory();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const amt = Number(form.amount);
    if (amt < minLimit) return setError(`Kam az kam Rs. ${minLimit} nikalwayein.`);
    if (amt > maxLimit) return setError(`Aik waqt mein Rs. ${maxLimit} se zyada nahi nikalwa sakte.`);
    if (amt > (user?.balance || 0)) return setError("Aap ke account mein balance kam hai.");
    
    setLoading(true);
    try {
      await api.post('/finance/withdraw', { userId: user?.id, ...form, gateway, amount: amt });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Withdraw error node failure.");
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
          <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tighter uppercase italic">Done!</h2>
          <p className="text-slate-500 font-bold uppercase text-[9px] tracking-widest leading-relaxed mb-10 urdu-text">آپ کی درخواست موصول ہوگئی ہے۔ پیسے 24 گھنٹے میں مل جائیں گے۔</p>
          <button onClick={() => navigate('/user/dashboard')} className="w-full bg-slate-900 text-white h-14 rounded-[22px] font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">Go Home</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-4 pb-32 px-1 animate-fade-in">
      <header className="flex items-center justify-between px-2 pt-2">
        <Link to="/user/wallet" className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 active:scale-90 transition-all">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-lg font-black text-slate-900 tracking-tighter uppercase italic">Withdraw <span className="text-indigo-600">Paisa.</span></h1>
        <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-sky-400 shadow-lg">
          <Banknote size={16} />
        </div>
      </header>
      
      {/* BALANCE & LIMITS OVERVIEW */}
      <div className="bg-slate-950 p-6 rounded-[36px] text-white shadow-xl relative overflow-hidden mx-1">
         <div className="relative z-10 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                 <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest italic mb-1">Available Paisay</p>
                 <h2 className="text-3xl font-black italic">Rs. {(user?.balance || 0).toLocaleString()}</h2>
              </div>
              <span className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[7px] font-black uppercase text-sky-400">Ledger Verified</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
               <div>
                  <p className="text-[7px] font-black text-slate-500 uppercase">Min Limit</p>
                  <p className="text-xs font-black text-emerald-400">Rs. {minLimit}</p>
               </div>
               <div className="text-right">
                  <p className="text-[7px] font-black text-slate-500 uppercase">Max Limit</p>
                  <p className="text-xs font-black text-rose-400">Rs. {maxLimit}</p>
               </div>
            </div>
         </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mx-1 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600">
             <AlertCircle size={16} />
             <p className="text-[10px] font-black uppercase tracking-widest">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-[36px] border border-slate-100 shadow-sm space-y-5 mx-1">
        <div className="space-y-4">
           <div className="grid grid-cols-2 gap-2">
              {['EasyPaisa', 'JazzCash'].map(m => (
                <button key={m} type="button" onClick={() => setGateway(m)} className={clsx("py-3 rounded-xl border-2 text-[10px] font-black uppercase transition-all", gateway === m ? "bg-slate-950 border-slate-950 text-white" : "bg-white border-slate-50 text-slate-300")}>{m}</button>
              ))}
           </div>
           <div className="space-y-3">
              <div className="relative">
                 <input type="number" placeholder="Enter Amount" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl font-black text-xs outline-none focus:bg-white" required />
                 <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[8px] font-black text-slate-300 uppercase tracking-widest">PKR</span>
              </div>
              <input type="tel" placeholder="Account Number" value={form.accountNumber} onChange={e => setForm({...form, accountNumber: e.target.value})} className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl font-black text-xs outline-none" required />
              <input type="text" placeholder="Account Holder Name" value={form.accountTitle} onChange={e => setForm({...form, accountTitle: e.target.value})} className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl font-black text-xs outline-none" required />
           </div>
        </div>
        <button type="submit" disabled={loading} className="w-full h-14 bg-indigo-600 text-white rounded-[22px] font-black text-[10px] uppercase flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all">
          {loading ? <Loader2 size={20} className="animate-spin" /> : <>Withdraw Paisa Now</>}
        </button>
      </form>

      {/* MINI HISTORY */}
      <div className="mx-1 space-y-3 pt-2">
         <div className="flex items-center justify-between px-3">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><History size={14}/> Recent Logs</h3>
         </div>
         <div className="space-y-2">
            {history.slice(0, 2).map(trx => (
              <div key={trx.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
                 <div className="flex items-center gap-3">
                    <div className={clsx("w-8 h-8 rounded-lg flex items-center justify-center", trx.type === 'withdraw' ? "bg-rose-50 text-rose-500" : "bg-emerald-50 text-emerald-600")}>
                       {trx.type === 'withdraw' ? <ArrowUpRight size={14}/> : <ArrowDownLeft size={14}/>}
                    </div>
                    <div>
                       <p className="text-[9px] font-black text-slate-800 uppercase">{trx.gateway || trx.type}</p>
                       <p className="text-[7px] text-slate-400 font-bold uppercase">{trx.status}</p>
                    </div>
                 </div>
                 <p className={clsx("font-black text-xs italic", trx.type === 'withdraw' ? "text-slate-900" : "text-emerald-600")}>Rs {trx.amount}</p>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default Withdraw;
