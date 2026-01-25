
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet, Upload, CheckCircle2, Zap, ArrowRight, Smartphone, Camera, Loader2 } from 'lucide-react';
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
      reader.onloadend = () => setForm(prev => ({ ...prev, proof: reader.result as string }));
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
        alert("Activation request submitted. Audit completes in 1-3 hours.");
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
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-2">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" />
          <motion.div initial={{ scale: 0.95, y: 10, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, y: 10, opacity: 0 }} className="relative w-full max-w-[340px] bg-white rounded-[32px] shadow-2xl overflow-hidden border border-white">
            
            <div className="p-4 flex justify-between items-center bg-slate-50 border-b border-slate-100">
              <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Station Activation</h3>
              <button onClick={onClose} className="p-1.5 bg-white rounded-lg text-slate-400 hover:text-rose-500 transition-all shadow-sm"><X size={14} /></button>
            </div>

            <div className="px-5 py-4 bg-slate-900 text-white flex justify-between items-center">
               <div>
                 <p className="text-[7px] font-black text-indigo-400 uppercase tracking-widest mb-0.5">{plan.name} PACK</p>
                 <h4 className="text-xl font-black italic">Rs. {plan.price?.toLocaleString()}</h4>
               </div>
               <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest border border-emerald-400/30 px-2 py-0.5 rounded-full">Pro Node</span>
            </div>

            <div className="flex bg-slate-100 mx-5 my-4 p-1 rounded-xl border border-slate-200">
              <button onClick={() => setTab('wallet')} className={clsx("flex-1 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all", tab === 'wallet' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500")}>Wallet</button>
              <button onClick={() => setTab('direct')} className={clsx("flex-1 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all", tab === 'direct' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500")}>Direct</button>
            </div>

            <div className="px-5 pb-6">
              {tab === 'wallet' ? (
                <div className="space-y-4">
                  <div className="p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-center justify-between">
                    <div className="flex items-center gap-2"><Wallet size={14} className="text-indigo-600" /><span className="text-[8px] font-black text-slate-600 uppercase">Available</span></div>
                    <span className="text-sm font-black text-indigo-600">Rs. {user?.balance?.toLocaleString()}</span>
                  </div>
                  <button disabled={Number(user?.balance || 0) < plan.price || loading} onClick={handlePurchase} className="w-full h-11 bg-slate-900 text-white rounded-xl font-black text-[9px] uppercase tracking-[0.2em] shadow-lg disabled:opacity-30 active:scale-95 transition-all">
                    {loading ? <Loader2 className="animate-spin" size={14}/> : (Number(user?.balance || 0) < plan.price ? 'Insufficient Funds' : 'Confirm Upgrade')}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-slate-900 p-4 rounded-xl text-white">
                    <div className="flex items-center gap-2 mb-1 opacity-60">
                       <Smartphone size={10} />
                       <p className="text-[7px] font-black uppercase">Pay EasyPaisa</p>
                    </div>
                    <p className="text-base font-black tracking-widest italic">0300-1234567</p>
                  </div>
                  
                  <div className="space-y-2">
                    <input type="tel" placeholder="Sender No." value={form.senderNumber} onChange={e => setForm({...form, senderNumber: e.target.value})} className="h-10 w-full px-3 bg-slate-50 rounded-lg font-bold text-[10px] border border-slate-200 outline-none" />
                    <input type="text" placeholder="TRX ID" value={form.trxId} onChange={e => setForm({...form, trxId: e.target.value})} className="h-10 w-full px-3 bg-slate-50 rounded-lg font-bold text-[10px] border border-slate-200 outline-none" />
                  </div>

                  <div className="relative group">
                    <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    <div className={clsx("h-11 px-4 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center gap-2 transition-all", form.proof ? "border-emerald-500 bg-emerald-50/30" : "hover:border-indigo-400")}>
                      {form.proof ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Camera size={14} className="text-slate-400" />}
                      <span className="text-[8px] font-black text-slate-500 uppercase">{form.proof ? "Evidence Ready" : "Upload Proof"}</span>
                    </div>
                  </div>
                  
                  <button disabled={loading || !form.trxId || !form.proof} onClick={handlePurchase} className="w-full h-11 bg-indigo-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                    {loading ? <Loader2 className="animate-spin" size={14}/> : 'Send Packet'}
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
