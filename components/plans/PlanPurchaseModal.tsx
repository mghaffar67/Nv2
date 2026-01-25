
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet, Upload, CheckCircle2, Zap, ArrowRight, Smartphone, Camera } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { planController } from '../../backend_core/controllers/planController';
import { clsx } from 'clsx';

interface PlanPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: any;
  onSuccess: (plan: any) => void;
}

const PlanPurchaseModal = ({ isOpen, onClose, plan, onSuccess }: PlanPurchaseModalProps) => {
  const { user } = useAuth();
  const [tab, setTab] = useState<'wallet' | 'direct'>('wallet');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ trxId: '', senderNumber: '', proof: '' });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, proof: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const res = await new Promise<any>((resolve) => {
        planController.requestPlanPurchase({ 
          body: { 
            userId: user?.id, 
            planId: plan.name, 
            method: tab,
            trxId: form.trxId,
            senderNumber: form.senderNumber,
            proofImage: form.proof
          } 
        }, { 
          status: (code: number) => ({ json: (data: any) => resolve({ code, data }) }) 
        });
      });

      if (res.code === 200) {
        onSuccess(plan);
        onClose();
      } else if (res.code === 201) {
        alert("Your request has been sent for review. Please wait for approval.");
        onClose();
      } else {
        alert(res.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!plan) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-950/70 backdrop-blur-md" />
          <motion.div initial={{ scale: 0.95, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, y: 20, opacity: 0 }} className="relative w-full max-w-sm bg-white rounded-[40px] shadow-2xl overflow-hidden border border-white">
            
            <div className="p-6 flex justify-between items-center bg-slate-50 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-800 uppercase tracking-tight">Purchase Plan</h3>
              <button onClick={onClose} className="p-1.5 bg-white rounded-xl text-slate-400 hover:text-rose-500 transition-all shadow-sm"><X size={18} /></button>
            </div>

            <div className="px-6 py-5 bg-slate-900 text-white flex justify-between items-center">
               <div>
                 <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-0.5">{plan.name} PACK</p>
                 <h4 className="text-2xl font-black italic">Rs. {plan.price?.toLocaleString()}</h4>
               </div>
               <div className="text-right">
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Verified Station</span>
               </div>
            </div>

            <div className="flex bg-slate-100 m-6 p-1 rounded-2xl border border-slate-200">
              <button onClick={() => setTab('wallet')} className={clsx("flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", tab === 'wallet' ? "bg-white text-slate-900 shadow-md" : "text-slate-500")}>My Wallet</button>
              <button onClick={() => setTab('direct')} className={clsx("flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", tab === 'direct' ? "bg-white text-slate-900 shadow-md" : "text-slate-500")}>Direct Pay</button>
            </div>

            <div className="px-6 pb-8">
              {tab === 'wallet' ? (
                <div className="space-y-5">
                  <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex items-center justify-between">
                    <div className="flex items-center gap-2"><Wallet size={18} className="text-indigo-600" /><span className="text-[10px] font-black text-slate-600 uppercase">Balance</span></div>
                    <span className="text-base font-black text-indigo-600">Rs. {user?.balance?.toLocaleString()}</span>
                  </div>
                  <button disabled={user?.balance! < plan.price || loading} onClick={handlePurchase} className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl disabled:opacity-30 active:scale-95 transition-all">
                    {loading ? 'Processing...' : (user?.balance! < plan.price ? 'Insufficient Balance' : 'Buy Now')}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-slate-900 p-5 rounded-[24px] text-white">
                    <div className="flex items-center gap-2 mb-1.5 opacity-60">
                       <Smartphone size={12} />
                       <p className="text-[8px] font-black uppercase tracking-widest">Pay to EasyPaisa</p>
                    </div>
                    <p className="text-xl font-black tracking-wider italic">0300-1234567</p>
                    <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase">Account: Noor Admin</p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2.5">
                    <input type="tel" placeholder="Sender Mobile No." value={form.senderNumber} onChange={e => setForm({...form, senderNumber: e.target.value})} className="h-12 px-4 bg-slate-50 rounded-xl font-bold text-xs border border-slate-200 outline-none focus:bg-white" />
                    <input type="text" placeholder="Transaction TRX ID" value={form.trxId} onChange={e => setForm({...form, trxId: e.target.value})} className="h-12 px-4 bg-slate-50 rounded-xl font-bold text-xs border border-slate-200 outline-none focus:bg-white" />
                  </div>

                  <div className="relative group">
                    <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    <div className={clsx("h-14 px-5 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center gap-3 transition-all", form.proof ? "border-emerald-500 bg-emerald-50/50" : "hover:border-indigo-400")}>
                      {form.proof ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Camera size={18} className="text-slate-400" />}
                      <span className="text-[9px] font-black text-slate-500 uppercase">{form.proof ? "Receipt Ready" : "Upload Receipt Photo"}</span>
                    </div>
                  </div>
                  
                  <button disabled={loading || !form.trxId || !form.proof} onClick={handlePurchase} className="w-full h-14 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                    {loading ? 'Submitting...' : 'Send Payment Proof'}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PlanPurchaseModal;
