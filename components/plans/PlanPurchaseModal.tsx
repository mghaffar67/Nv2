import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Wallet, Upload, CheckCircle2, Zap, ArrowRight, 
  Smartphone, Camera, Loader2, Copy, ShieldCheck,
  ChevronRight, ArrowLeft, Info, Landmark
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { clsx } from 'clsx';

interface PlanPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: any;
  onSuccess: (plan: any) => void;
}

const PlanPurchaseModal = ({ isOpen, onClose, plan, onSuccess }: PlanPurchaseModalProps) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState<'wallet' | 'direct'>('wallet');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ trxId: '', senderNumber: '', proof: '' });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setForm(prev => ({ ...prev, proof: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Official account copied! 📋");
  };

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const res = await api.post('/finance/activate-plan', { 
        planId: plan.name, 
        method,
        trxId: form.trxId,
        senderNumber: form.senderNumber,
        proofImage: form.proof
      });

      if (res.success) {
        // Manually update the session cache with the populated user data
        if (res.user) {
          localStorage.setItem('noor_user', JSON.stringify(res.user));
        }
        onSuccess(plan);
        onClose();
      }
    } catch (err: any) {
      alert(err.message || "Activation node rejected the packet.");
    } finally {
      setLoading(false);
    }
  };

  if (!plan) return null;

  const steps = [
    { n: 1, label: 'PROTOCOL' },
    { n: 2, label: 'PAYMENT' },
    { n: 3, label: 'VERIFY' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-3">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
          
          <motion.div 
            initial={{ scale: 0.95, y: 30, opacity: 0 }} 
            animate={{ scale: 1, y: 0, opacity: 1 }} 
            exit={{ scale: 0.95, y: 30, opacity: 0 }} 
            className="relative w-full max-w-sm bg-white rounded-[44px] shadow-2xl overflow-hidden border border-white flex flex-col"
          >
            {/* Header / Progress */}
            <div className="p-6 bg-slate-50 border-b border-slate-100">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Station Activation Hub</h3>
                  <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-white rounded-full text-slate-300 hover:text-rose-500 shadow-sm border border-slate-100 transition-all"><X size={14} /></button>
               </div>
               
               <div className="flex items-center justify-between px-4">
                  {steps.map((s, i) => (
                    <React.Fragment key={s.n}>
                      <div className="flex flex-col items-center gap-1.5">
                         <div className={clsx(
                           "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black transition-all",
                           step >= s.n ? "bg-slate-900 text-white shadow-lg" : "bg-white text-slate-300 border border-slate-200"
                         )}>
                           {step > s.n ? <CheckCircle2 size={12} className="text-sky-400" /> : s.n}
                         </div>
                         <span className={clsx("text-[6px] font-black tracking-widest", step >= s.n ? "text-slate-900" : "text-slate-300")}>{s.label}</span>
                      </div>
                      {i < steps.length - 1 && <div className={clsx("h-[1px] flex-1 mb-3 mx-2", step > s.n ? "bg-slate-900" : "bg-slate-200")} />}
                    </React.Fragment>
                  ))}
               </div>
            </div>

            {/* Content Area */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                     <div className="text-center">
                        <h4 className="text-xl font-black text-slate-900 uppercase italic mb-1 tracking-tight">{plan.name} PACK</h4>
                        <p className="text-indigo-600 font-black text-2xl italic tracking-tighter">Rs. {plan.price?.toLocaleString()}</p>
                     </div>
                     
                     <div className="grid grid-cols-1 gap-3">
                        <button 
                          onClick={() => setMethod('wallet')}
                          className={clsx(
                            "p-5 rounded-3xl border-2 transition-all text-left flex items-center gap-4 group",
                            method === 'wallet' ? "border-slate-950 bg-slate-50" : "border-slate-100 hover:border-indigo-200"
                          )}
                        >
                           <div className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center transition-all", method === 'wallet' ? "bg-slate-900 text-white shadow-lg" : "bg-slate-50 text-slate-400")}>
                              <Wallet size={20} />
                           </div>
                           <div className="flex-grow">
                              <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Internal Wallet</p>
                              <p className="text-[8px] font-bold text-slate-400 uppercase mt-0.5">Balance: Rs. {user?.balance?.toLocaleString()}</p>
                           </div>
                           {method === 'wallet' && <CheckCircle2 size={18} className="text-emerald-500" />}
                        </button>

                        <button 
                          onClick={() => setMethod('direct')}
                          className={clsx(
                            "p-5 rounded-3xl border-2 transition-all text-left flex items-center gap-4 group",
                            method === 'direct' ? "border-slate-950 bg-slate-50" : "border-slate-100 hover:border-indigo-200"
                          )}
                        >
                           <div className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center transition-all", method === 'direct' ? "bg-slate-900 text-white shadow-lg" : "bg-slate-50 text-slate-400")}>
                              <Landmark size={20} />
                           </div>
                           <div className="flex-grow">
                              <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Direct Deposit</p>
                              <p className="text-[8px] font-bold text-slate-400 uppercase mt-0.5">EasyPaisa / JazzCash</p>
                           </div>
                           {method === 'direct' && <CheckCircle2 size={18} className="text-emerald-500" />}
                        </button>
                     </div>

                     <button 
                        onClick={() => method === 'wallet' ? handlePurchase() : setStep(2)}
                        disabled={method === 'wallet' && Number(user?.balance || 0) < plan.price}
                        className="w-full h-16 bg-slate-950 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-40"
                     >
                        {method === 'wallet' ? (loading ? <Loader2 className="animate-spin" size={20}/> : 'Pay from Wallet') : 'Proceed to Payment'}
                        <ChevronRight size={18} />
                     </button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                     <div className="bg-indigo-600 p-6 rounded-[32px] text-white relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 scale-150"><Zap size={100} fill="currentColor" /></div>
                        <div className="relative z-10">
                           <p className="text-[8px] font-black text-indigo-200 uppercase tracking-widest mb-1">Official Receiver</p>
                           <h4 className="text-xl font-black italic tracking-tight">Noor Admin Node</h4>
                           <div className="mt-5 p-4 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-md flex items-center justify-between">
                              <span className="font-mono font-black text-lg">0300-1234567</span>
                              <button onClick={() => handleCopy('03001234567')} className="h-9 px-4 bg-white text-indigo-600 rounded-xl font-black text-[8px] uppercase tracking-widest active:scale-90 transition-all">Copy</button>
                           </div>
                        </div>
                     </div>

                     <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-indigo-500 shadow-sm shrink-0 mt-0.5"><Info size={14}/></div>
                        <p className="text-[9px] font-bold text-slate-500 uppercase leading-relaxed tracking-wider">
                          Pay exactly <b>Rs. {plan.price}</b> to the above number using EasyPaisa or JazzCash, then take a screenshot of the confirmation page.
                        </p>
                     </div>

                     <div className="flex gap-3">
                        <button onClick={() => setStep(1)} className="h-14 px-6 bg-slate-50 text-slate-400 rounded-2xl font-black text-[9px] uppercase"><ArrowLeft size={16}/></button>
                        <button onClick={() => setStep(3)} className="flex-grow h-14 bg-slate-950 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-2">I have Paid <ChevronRight size={16}/></button>
                     </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="step3" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
                     <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Audit Evidence (Screenshot)</label>
                        <div className="relative group h-32">
                           <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                           <div className={clsx(
                             "w-full h-full rounded-[24px] border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all",
                             form.proof ? "border-emerald-500 bg-emerald-50/20" : "border-slate-200 bg-slate-50 hover:border-indigo-400"
                           )}>
                              {form.proof ? <img src={form.proof} className="h-full w-full object-cover rounded-[22px] p-1" /> : (
                                <>
                                  <Camera size={24} className="text-slate-300" />
                                  <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Select Image</span>
                                </>
                              )}
                           </div>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <div className="space-y-1">
                           <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">TRX ID Reference</label>
                           <input 
                             type="text" placeholder="Transaction ID" value={form.trxId} 
                             onChange={e => setForm({...form, trxId: e.target.value})} 
                             className="h-12 w-full px-5 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs uppercase outline-none focus:bg-white"
                           />
                        </div>
                        <div className="space-y-1">
                           <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Sender Number</label>
                           <input 
                             type="tel" placeholder="Your Mobile No." value={form.senderNumber} 
                             onChange={e => setForm({...form, senderNumber: e.target.value})} 
                             className="h-12 w-full px-5 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs outline-none focus:bg-white"
                           />
                        </div>
                     </div>

                     <div className="flex gap-3 pt-2">
                        <button onClick={() => setStep(2)} className="h-14 px-6 bg-slate-50 text-slate-400 rounded-2xl font-black text-[9px] uppercase"><ArrowLeft size={16}/></button>
                        <button 
                           onClick={handlePurchase}
                           disabled={loading || !form.trxId || !form.proof}
                           className="flex-grow h-14 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-40"
                        >
                           {loading ? <Loader2 className="animate-spin" size={18}/> : <><ShieldCheck size={18} /> Sync Node</>}
                        </button>
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Disclaimer */}
            <div className="px-6 py-4 bg-slate-900 flex items-center gap-3">
               <ShieldCheck size={14} className="text-sky-400" />
               <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Authorized Transaction Tunnel</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PlanPurchaseModal;