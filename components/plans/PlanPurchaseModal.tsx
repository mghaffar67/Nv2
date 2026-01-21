import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet, Smartphone, Upload, CheckCircle2, ShieldAlert, Zap, ArrowRight, Image as ImageIcon } from 'lucide-react';
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
        alert("Activation request filed! Audit pending.");
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
          <motion.div initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 20, opacity: 0 }} className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl overflow-hidden border border-white">
            <div className="p-6 pb-0 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Activate Station</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{plan.name} Membership</p>
              </div>
              <button onClick={onClose} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-all"><X size={18} className="text-slate-500" /></button>
            </div>

            <div className="mx-6 mt-6 p-5 bg-slate-900 rounded-[32px] text-white flex justify-between items-center shadow-xl">
               <div>
                 <p className="text-[9px] font-black text-sky-400 uppercase tracking-widest">Upgrade Fee</p>
                 <h4 className="text-2xl font-black">Rs. {plan.price?.toLocaleString()}</h4>
               </div>
               <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center"><Zap size={24} className="text-sky-400" fill="currentColor" /></div>
            </div>

            <div className="flex bg-slate-50 m-6 p-1 rounded-2xl border border-slate-100">
              <button onClick={() => setTab('wallet')} className={clsx("flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", tab === 'wallet' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400")}>Wallet Pay</button>
              <button onClick={() => setTab('direct')} className={clsx("flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", tab === 'direct' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400")}>Direct Transfer</button>
            </div>

            <div className="px-6 pb-8 min-h-[220px]">
              {tab === 'wallet' ? (
                <div className="space-y-6">
                  <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 flex items-center justify-between">
                    <div className="flex items-center gap-3"><Wallet size={18} className="text-sky-500" /><span className="text-[11px] font-black text-slate-600 uppercase">Available</span></div>
                    <span className="text-sm font-black text-sky-600">Rs. {user?.balance?.toLocaleString()}</span>
                  </div>
                  <button disabled={user?.balance! < plan.price || loading} onClick={handlePurchase} className="w-full h-14 bg-slate-900 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-xl disabled:opacity-30 flex items-center justify-center gap-2">
                    {loading ? 'Processing...' : 'Unlock Instantly'} <CheckCircle2 size={16} />
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase">Send to EasyPaisa (Noor Admin)</p>
                    <p className="text-lg font-black text-slate-800">0300-1234567</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="tel" placeholder="Sender No" value={form.senderNumber} onChange={e => setForm({...form, senderNumber: e.target.value})} className="h-12 px-4 bg-slate-50 rounded-xl font-bold text-xs border border-slate-100 outline-none" />
                    <input type="text" placeholder="TRX ID" value={form.trxId} onChange={e => setForm({...form, trxId: e.target.value})} className="h-12 px-4 bg-slate-50 rounded-xl font-bold text-xs border border-slate-100 outline-none" />
                  </div>
                  <div className="relative group">
                    <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    <div className={clsx("h-14 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center justify-center gap-2 transition-all", form.proof ? "border-green-400 bg-green-50" : "")}>
                      {form.proof ? <CheckCircle2 size={16} className="text-green-500" /> : <Upload size={14} className="text-slate-400" />}
                      <span className="text-[9px] font-black text-slate-400 uppercase">{form.proof ? "Screenshot Attached" : "Upload Proof Screenshot"}</span>
                    </div>
                  </div>
                  <button disabled={loading || !form.trxId || !form.proof} onClick={handlePurchase} className="w-full h-14 bg-sky-500 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-2">
                    {loading ? 'Submitting...' : 'Submit Report'} <ArrowRight size={16} />
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