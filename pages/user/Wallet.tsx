
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, animate } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  TrendingUp, History, Zap, ArrowUpRight, Banknote, Smartphone, 
  Coins, CreditCard, ChevronLeft, Loader2, Sparkles
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../../context/AuthContext';
import { useConfig } from '../../context/ConfigContext';
import { userFinanceController } from '../../backend_core/controllers/userFinanceController';

const CountUp = ({ value }: { value: number }) => {
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    const controls = animate(display, value, {
      duration: 1.5,
      onUpdate: (latest) => setDisplay(Math.floor(latest)),
    });
    return () => controls.stop();
  }, [value]);
  return <>{display.toLocaleString()}</>;
};

const ShimmerBalance = ({ value }: { value: number }) => (
  <div className="relative inline-block">
    <motion.div 
      initial={{ x: '-100%' }}
      animate={{ x: '200%' }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg] z-10 pointer-events-none"
    />
    <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none flex items-baseline justify-center relative z-0">
      <span className="text-xl md:text-2xl text-emerald-400 mr-2 italic font-black">PKR</span>
      <CountUp value={value} />
    </h1>
  </div>
);

const Wallet = () => {
  const { user } = useAuth();
  const { config } = useConfig();
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [form, setForm] = useState({
    amount: '', senderNumber: '', trxId: '', gateway: '',
    accountNumber: user?.withdrawalInfo?.accountNumber || '',
    accountTitle: user?.withdrawalInfo?.accountTitle || ''
  });

  useEffect(() => {
    if (config.paymentGateways.length > 0) {
      setForm(prev => ({ ...prev, gateway: config.paymentGateways[0].name }));
    }
  }, [config.paymentGateways]);

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    setLoading(true);
    try {
      if (activeTab === 'deposit') {
        if (!form.trxId || !form.amount) throw new Error("Please fill all fields");
        await userFinanceController.requestDeposit({ 
          body: { userId: user.id, ...form, proofImage: 'MOCK_IMAGE_DATA' } 
        }, { 
          status: (c: number) => ({ json: (d: any) => { if (c >= 400) throw new Error(d.message); return d; } }) 
        });
      } else {
        await userFinanceController.requestWithdraw({ 
          body: { userId: user.id, ...form } 
        }, { 
          status: (c: number) => ({ 
            json: (d: any) => {
              if (c >= 400) throw new Error(d.message || "Failed");
              return d;
            } 
          }) 
        });
      }
      setSuccess(true);
      setTimeout(() => { 
        setSuccess(false); 
        window.location.reload(); 
      }, 2000);
    } catch (err: any) { 
      alert(err.message || "Request failed. Please try again."); 
    } finally { 
      setLoading(false); 
    }
  };

  const selectedGateway = config.paymentGateways.find(g => g.name === form.gateway);

  return (
    <div className="max-w-md mx-auto px-1 pb-24 space-y-3 animate-fade-in">
      
      {/* BALANCE CARD */}
      <div className="bg-slate-950 p-8 md:p-10 rounded-[44px] text-white shadow-2xl relative overflow-hidden text-center mx-1">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-500/10 via-transparent to-sky-500/10" />
        <div className="relative z-10">
           <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] mb-6 backdrop-blur-md text-emerald-400">
              <Sparkles size={10} className="animate-pulse" /> SECURE LEDGER
           </div>
           <div className="flex flex-col items-center mb-8">
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-3">Net Liquidity</p>
              <ShimmerBalance value={user?.balance || 0} />
           </div>
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

      {/* ACTION TABS */}
      <div className="bg-white p-1 rounded-2xl border border-slate-100 shadow-sm flex gap-1 mx-1">
         <button onClick={() => setActiveTab('deposit')} className={clsx("flex-1 h-11 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all flex items-center justify-center gap-2", activeTab === 'deposit' ? "bg-slate-900 text-white shadow-lg" : "text-slate-400")}>
            <TrendingUp size={16} /> Deposit
         </button>
         <button onClick={() => setActiveTab('withdraw')} className={clsx("flex-1 h-11 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all flex items-center justify-center gap-2", activeTab === 'withdraw' ? "bg-slate-900 text-white shadow-lg" : "text-slate-400")}>
            <ArrowUpRight size={16} /> Withdraw
         </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mx-1">
          {activeTab === 'deposit' ? (
            <div className="space-y-3">
               {selectedGateway && (
                 <div className="bg-emerald-50 p-5 rounded-[32px] border border-emerald-100 text-center">
                    <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest mb-1">Destination Node:</p>
                    <h4 className="text-2xl font-black text-slate-900 tracking-widest">{selectedGateway.accountNumber}</h4>
                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-1 italic">{selectedGateway.name} ({selectedGateway.accountTitle})</p>
                 </div>
               )}
               
               <div className="bg-white p-6 rounded-[36px] border border-slate-100 shadow-sm space-y-4">
                  <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest ml-2">Configuration</p>
                  <div className="grid grid-cols-2 gap-2">
                    {config.paymentGateways.map(g => (
                      <button key={g.name} onClick={() => setForm({...form, gateway: g.name})} className={clsx("h-11 rounded-xl border-2 font-black text-[8px] uppercase transition-all", form.gateway === g.name ? "border-slate-900 bg-slate-50 text-slate-900" : "border-slate-50 text-slate-300")}>{g.name}</button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <InputGroup label="PKR AMOUNT" type="number" value={form.amount} onChange={(e: any) => setForm({...form, amount: e.target.value})} placeholder="Min 100" />
                    <InputGroup label="SENDER NO" type="tel" value={form.senderNumber} onChange={(e: any) => setForm({...form, senderNumber: e.target.value})} placeholder="03xx" />
                  </div>
                  <InputGroup label="TRANSACTION ID (TRX)" value={form.trxId} onChange={(e: any) => setForm({...form, trxId: e.target.value})} placeholder="TRX123456" />
                  <button onClick={handleAction} disabled={loading} className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 transition-all mt-2">
                    {loading ? 'SYNCHRONIZING...' : 'SUBMIT PACKET'}
                  </button>
               </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-[36px] border border-slate-100 shadow-sm space-y-5">
               <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest ml-2">Destination Node</p>
               <div className="grid grid-cols-2 gap-2">
                  {config.paymentGateways.map(g => (
                    <button key={g.name} onClick={() => setForm({...form, gateway: g.name})} className={clsx("h-11 rounded-xl border-2 font-black text-[8px] uppercase transition-all", form.gateway === g.name ? "border-slate-900 bg-slate-50 text-slate-900" : "border-slate-50 text-slate-300")}>{g.name}</button>
                  ))}
               </div>
               <div className="space-y-4">
                 <InputGroup label="ACCOUNT NUMBER" value={form.accountNumber} onChange={(e: any) => setForm({...form, accountNumber: e.target.value})} placeholder="03xx" />
                 <InputGroup label="ACCOUNT TITLE" value={form.accountTitle} onChange={(e: any) => setForm({...form, accountTitle: e.target.value})} placeholder="Owner Name" />
                 <div className="pt-2">
                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-3">Payout Value</label>
                    <div className="relative mt-2">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-300 text-xl">Rs</span>
                      <input type="number" value={form.amount} onChange={(e: any) => setForm({...form, amount: e.target.value})} className="w-full h-16 bg-slate-50 border border-slate-100 rounded-3xl pl-14 pr-6 font-black text-2xl text-slate-900 outline-none" placeholder="Min 500" />
                    </div>
                 </div>
               </div>
               <button onClick={handleAction} disabled={loading || (user?.balance || 0) < 500} className="w-full h-14 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all">
                  {loading ? 'PROCESSING...' : 'REQUEST PAYOUT'}
               </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const InputGroup = ({ label, ...props }: any) => (
  <div className="space-y-1.5">
    <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest ml-3">{label}</label>
    <input {...props} className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none focus:ring-4 focus:ring-sky-50 transition-all" />
  </div>
);

export default Wallet;
