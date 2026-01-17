
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Copy, Upload, ShieldCheck, 
  Info, CheckCircle2, Wallet, Smartphone, Banknote,
  ChevronLeft, Loader2, ImageIcon, Check
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../../../context/AuthContext';
import { useConfig } from '../../../context/ConfigContext';
import { api } from '../../../utils/api';

const Deposit = () => {
  const { user } = useAuth();
  const { config } = useConfig();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    amount: '',
    senderNumber: '',
    trxId: '',
    gateway: 'EasyPaisa'
  });

  const selectedGateway = config.paymentGateways.find(g => g.name === form.gateway);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        return alert("Security Alert: Only JPG/PNG images are allowed.");
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Account details copied to clipboard!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !form.amount || !form.trxId) {
      return alert("Missing Data: Please fill all audit fields and attach proof.");
    }
    
    setLoading(true);
    try {
      // CONSTRUCTION OF MULTIPART PACKET
      const formData = new FormData();
      formData.append('image', file);
      formData.append('amount', form.amount);
      formData.append('senderNumber', form.senderNumber);
      formData.append('trxId', form.trxId);
      formData.append('method', form.gateway);

      await api.upload('/finance/deposit', formData);
      setSuccess(true);
    } catch (err: any) {
      alert(err.message || "Ledger sync failed. Internal connection error.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-10 rounded-[44px] shadow-2xl border border-slate-50">
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner border border-green-100">
            <CheckCircle2 size={44} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tighter italic">Report Filed</h2>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest leading-relaxed mb-10">Audit node is verifying TRX {form.trxId}. PKR {form.amount} will be synced to your wallet shortly.</p>
          <button onClick={() => window.location.href = '#/user/dashboard'} className="w-full bg-slate-900 text-white h-16 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all">Proceed to Terminal</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-4 pb-24 px-1 animate-fade-in">
      
      {/* HEADER NODES */}
      <div className="bg-white px-5 py-5 rounded-[28px] border border-slate-100 shadow-sm flex items-center justify-between mx-1">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg"><Wallet size={18} /></div>
          <h1 className="font-black text-slate-900 text-[11px] uppercase tracking-widest italic">Capital Inflow</h1>
        </div>
        <div className="flex gap-1.5">
           {[1, 2].map(i => <div key={i} className={clsx("w-1.5 h-1.5 rounded-full transition-all", step >= i ? "bg-indigo-600 scale-125 shadow-sm shadow-indigo-200" : "bg-slate-200")} />)}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
             {/* GATEWAY SELECTION */}
             <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm mx-1">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-5 italic flex items-center gap-2">
                   <ShieldCheck size={12} className="text-indigo-500" /> Phase 01: Destination Node
                </h3>
                <div className="grid grid-cols-2 gap-3">
                   {config.paymentGateways.map(gw => (
                     <button 
                       key={gw.name} 
                       onClick={() => setForm({...form, gateway: gw.name})}
                       className={clsx(
                         "p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all",
                         form.gateway === gw.name ? "bg-slate-950 border-slate-950 text-white shadow-xl" : "bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100"
                       )}
                     >
                       <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center", form.gateway === gw.name ? "bg-indigo-500" : "bg-white shadow-sm")}>
                          {gw.name === 'Bank Transfer' ? <Banknote size={20} /> : <Smartphone size={20} />}
                       </div>
                       <p className="text-[9px] font-black uppercase tracking-widest">{gw.name}</p>
                     </button>
                   ))}
                </div>
             </div>

             {/* AMOUNT CONFIG */}
             <div className="bg-white p-6 rounded-[36px] border border-slate-100 shadow-sm space-y-5 mx-1">
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Deposit Value (PKR)</label>
                   <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 font-black italic text-lg">PKR</span>
                      <input 
                        type="number" 
                        placeholder="Minimum 100"
                        value={form.amount} 
                        onChange={e => setForm({...form, amount: e.target.value})} 
                        className="w-full h-16 pl-16 pr-6 bg-slate-50 rounded-2xl font-black text-slate-900 text-xl outline-none border border-slate-100 focus:ring-4 focus:ring-indigo-50 transition-all" 
                      />
                   </div>
                </div>
                <button 
                  disabled={!form.amount || Number(form.amount) < 100}
                  onClick={() => setStep(2)} 
                  className="w-full h-16 bg-slate-950 text-white rounded-[24px] font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 active:scale-95 shadow-xl disabled:opacity-50 transition-all"
                >
                  Confirm Liquidity <ArrowRight size={16} />
                </button>
             </div>
          </motion.div>
        ) : (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
             {/* ADMIN DESTINATION DATA */}
             <div className="bg-indigo-600 p-6 rounded-[32px] text-white shadow-xl mx-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><ShieldCheck size={60} /></div>
                <p className="text-[9px] font-black uppercase tracking-widest mb-3 opacity-60 italic">Receiver Node Details</p>
                <div className="flex justify-between items-center">
                   <div>
                      <h4 className="text-xl font-black tracking-widest">{selectedGateway?.accountNumber}</h4>
                      <p className="text-[9px] font-bold uppercase mt-1 opacity-80">{selectedGateway?.accountTitle}</p>
                   </div>
                   <button onClick={() => handleCopy(selectedGateway?.accountNumber || '')} className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all active:scale-90"><Copy size={16} /></button>
                </div>
             </div>

             {/* PROOF AUDIT FORM */}
             <form onSubmit={handleSubmit} className="bg-white p-6 rounded-[36px] border border-slate-100 shadow-sm space-y-4 mx-1">
                <div className="space-y-4">
                   <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-1.5">
                         <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Sender Phone Number</label>
                         <input type="tel" placeholder="03xx-xxxxxxx" required value={form.senderNumber} onChange={e => setForm({...form, senderNumber: e.target.value})} className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl font-black text-xs outline-none" />
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">System TRX ID</label>
                         <input type="text" placeholder="11-digit Transaction ID" required value={form.trxId} onChange={e => setForm({...form, trxId: e.target.value})} className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl font-black text-xs outline-none uppercase" />
                      </div>
                   </div>
                   
                   <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Evidence Documentation</label>
                      <div className="relative group">
                         <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                         <div className={clsx(
                           "w-full py-12 border-2 border-dashed rounded-[28px] flex flex-col items-center justify-center gap-4 transition-all",
                           preview ? "bg-green-50 border-green-200" : "bg-slate-50 border-slate-100 group-hover:border-indigo-200"
                         )}>
                            {preview ? (
                              <div className="w-16 h-16 rounded-xl overflow-hidden shadow-lg border-2 border-white relative">
                                 <img src={preview} className="w-full h-full object-cover" />
                                 <div className="absolute inset-0 bg-green-500/10 flex items-center justify-center"><Check size={24} className="text-green-500 drop-shadow-md" /></div>
                              </div>
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-slate-300 shadow-sm border border-slate-50">
                                 <Upload size={20} />
                              </div>
                            )}
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{preview ? "Evidence Packet Attached" : "Upload Receipt Screenshot"}</p>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="flex gap-2 pt-2">
                   <button type="button" onClick={() => setStep(1)} className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center active:scale-95 transition-all"><ChevronLeft size={24} /></button>
                   <button 
                     type="submit"
                     disabled={loading || !file}
                     className="flex-grow h-16 bg-slate-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 transition-all"
                   >
                     {loading ? <Loader2 size={20} className="animate-spin" /> : <>Deploy Deposit Packet <ArrowRight size={18} /></>}
                   </button>
                </div>
             </form>

             <div className="px-5 py-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3 mx-1">
                <Info size={14} className="shrink-0 mt-0.5 text-amber-600" />
                <p className="text-[8px] font-bold uppercase tracking-widest leading-relaxed text-amber-800">Warning: Submitting fraudulent evidence or duplicate TRX IDs will trigger an automated account node termination.</p>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Deposit;
