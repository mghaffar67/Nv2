
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet, Upload, CheckCircle2, Zap, ArrowRight } from 'lucide-react';
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
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-950/70 backdrop-blur-md" />
          <motion.div initial={{ scale: 0.95, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, y: 20, opacity: 0 }} className="relative w-full max-w-sm bg-white rounded-[32px] shadow-2xl overflow-hidden border border-white">
            
            <div className="p-5 flex justify-between items-center bg-slate-50 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-sky-400"><Zap size={16} fill="currentColor"/></div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">Activate Hub</h3>
              </div>
              <button onClick={onClose} className="p-1.5 bg-white rounded-lg text-slate-400 hover:text-rose-500 transition-colors shadow-sm"><X size={16} /></button>
            </div>

            <div className="px-5 py-4 bg-slate-900 text-white flex justify-between items-center">
               <div>
                 <p className="text-[7px] font-black text-sky-400 uppercase tracking-widest mb-0.5">{plan.name} Tier</p>
                 <h4 className="text-xl font-black italic">Rs. {plan.price?.toLocaleString()}</h4>
               </div>
               <div className="text-right">
                  <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Sync Fee</p>
                  <span className="text-[10px] font-black text-emerald-400 uppercase">Audit Verified</span>
               </div>
            </div>

            <div className="flex bg-slate-50 m-5 p-1 rounded-xl border border-slate-100">
              <button onClick={() => setTab('wallet')} className={clsx("flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all", tab === 'wallet' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400")}>Wallet</button>
              <button onClick={() => setTab('direct')} className={clsx("flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all", tab === 'direct' ? "bg-white text-slate-900 shadow-sm" : "text-slate-400")}>Direct</button>
            </div>

            <div className="px-5 pb-6">
              {tab === 'wallet' ? (
                <div className="space-y-4">
                  <div className="p-4 bg-sky-50/50 rounded-2xl border border-sky-100 flex items-center justify-between">
                    <div className="flex items-center gap-2"><Wallet size={16} className="text-sky-500" /><span className="text-[10px] font-black text-slate-600 uppercase">Available</span></div>
                    <span className="text-sm font-black text-sky-600">Rs. {user?.balance?.toLocaleString()}</span>
                  </div>
                  <button disabled={user?.balance! < plan.price || loading} onClick={handlePurchase} className="w-full h-12 bg-slate-950 text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-xl disabled:opacity-30 active:scale-95 transition-all">
                    {loading ? 'Processing...' : (user?.balance! < plan.price ? 'Low Balance' : 'Confirm Activation')}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="text-[7px] font-black text-slate-400 uppercase mb-1">Send to EasyPaisa (Noor Admin)</p>
                    <p className="text-base font-black text-slate-800 tracking-wider">0300-1234567</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="tel" placeholder="Sender No" value={form.senderNumber} onChange={e => setForm({...form, senderNumber: e.target.value})} className="h-10 px-3 bg-slate-50 rounded-xl font-bold text-[10px] border border-slate-100 outline-none focus:bg-white" />
                    <input type="text" placeholder="TRX ID" value={form.trxId} onChange={e => setForm({...form, trxId: e.target.value})} className="h-10 px-3 bg-slate-50 rounded-xl font-bold text-[10px] border border-slate-100 outline-none focus:bg-white" />
                  </div>
                  <div className="relative group">
                    <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    <div className={clsx("h-12 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center justify-center gap-2 transition-all", form.proof ? "border-emerald-400 bg-emerald-50" : "hover:border-indigo-400")}>
                      {form.proof ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Upload size={12} className="text-slate-400" />}
                      <span className="text-[8px] font-black text-slate-500 uppercase">{form.proof ? "Proof Ready" : "Upload Evidence"}</span>
                    </div>
                  </div>
                  <button disabled={loading || !form.trxId || !form.proof} onClick={handlePurchase} className="w-full h-12 bg-indigo-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                    {loading ? 'Submitting...' : 'Commit Activation'}
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
