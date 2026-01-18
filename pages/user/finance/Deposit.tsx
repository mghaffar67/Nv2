
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Copy, Upload, ShieldCheck, 
  Info, CheckCircle2, Smartphone, Loader2, 
  Check, Zap, Image as ImageIcon, Wallet
} from 'lucide-react';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useConfig } from '../../../context/ConfigContext';
import { api } from '../../../utils/api';

const Deposit = () => {
  const { user } = useAuth();
  const { config } = useConfig();
  const navigate = useNavigate();
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
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Official account number copied! 📋");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !form.amount || !form.trxId) return alert("Audit Protocol: All fields are required.");
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('amount', form.amount);
      formData.append('senderNumber', form.senderNumber);
      formData.append('trxId', form.trxId);
      formData.append('method', form.gateway);

      await api.upload('/finance/deposit', formData);
      setSuccess(true);
    } catch (err: any) {
      alert(err.message || "Packet deployment failed.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 text-center animate-fade-in">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-12 rounded-[50px] shadow-2xl border border-emerald-50">
          <div className="w-24 h-24 bg-emerald-500 text-white rounded-[35px] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-200">
            <CheckCircle2 size={52} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter uppercase italic">Packet Filed</h2>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest leading-relaxed mb-10">Manual verification node is auditing your screenshot. Sync completes within 1-3 hours.</p>
          <button onClick={() => navigate('/user/dashboard')} className="w-full bg-slate-900 text-white h-16 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all">Go to Dashboard</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6 pb-32 px-1 animate-fade-in">
      <div className="text-center pt-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Add <span className="text-indigo-600">Liquidity</span></h1>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-3">Select your inbound node</p>
      </div>

      {/* 1. FINTECH METHOD SELECTOR */}
      <div className="grid grid-cols-2 gap-4 px-1">
        {[
          { name: 'EasyPaisa', color: 'bg-emerald-600', border: 'border-emerald-500' },
          { name: 'JazzCash', color: 'bg-red-600', border: 'border-red-500' }
        ].map(method => (
          <button 
            key={method.name}
            onClick={() => setForm({...form, gateway: method.name})}
            className={clsx(
              "p-6 rounded-[36px] border-4 transition-all flex flex-col items-center gap-4 active:scale-95 shadow-sm",
              form.gateway === method.name ? `border-indigo-600 bg-indigo-50/50` : "border-white bg-white"
            )}
          >
            <div className={clsx(
              "w-16 h-16 rounded-[24px] flex items-center justify-center text-white shadow-lg",
              method.color
            )}>
              <Smartphone size={32} />
            </div>
            <span className="font-black text-[11px] uppercase tracking-widest text-slate-800">{method.name}</span>
          </button>
        ))}
      </div>

      {/* 2. ADMIN RECIPIENT BOX */}
      <div className="bg-slate-100 p-7 rounded-[40px] border border-slate-200 mx-1">
         <div className="flex justify-between items-start mb-6">
            <div>
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Official Recipient</p>
               <h3 className="text-xl font-black text-slate-900 tracking-tight">{selectedGateway?.accountTitle || 'Admin Noor'}</h3>
            </div>
            <div className="p-3 bg-white rounded-2xl shadow-sm text-indigo-600">
               <ShieldCheck size={20} fill="currentColor" />
            </div>
         </div>
         <div className="bg-white p-4 rounded-2xl flex items-center justify-between border border-slate-200">
            <span className="font-black text-lg text-slate-800 tracking-widest">{selectedGateway?.accountNumber || '03001234567'}</span>
            <button 
              onClick={() => handleCopy(selectedGateway?.accountNumber || '')}
              className="h-10 px-6 bg-slate-950 text-white rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-90 transition-all flex items-center gap-2"
            >
              <Copy size={14} /> Copy
            </button>
         </div>
      </div>

      {/* 3. INTERACTIVE UPLOAD FORM */}
      <form onSubmit={handleSubmit} className="space-y-4 px-1">
        <div className="bg-white p-6 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Deposit Amount (PKR)</label>
              <input 
                type="number" placeholder="Enter Value" required
                value={form.amount} onChange={e => setForm({...form, amount: e.target.value})}
                className="w-full h-16 px-6 bg-slate-50 border border-slate-100 rounded-3xl font-black text-2xl text-slate-900 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all"
              />
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">TRX ID (From SMS/APP)</label>
              <input 
                type="text" placeholder="Transaction ID" required
                value={form.trxId} onChange={e => setForm({...form, trxId: e.target.value})}
                className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl font-black text-sm uppercase outline-none focus:bg-white"
              />
           </div>

           {/* DASHED UPLOAD AREA */}
           <div className="relative group">
              <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
              <div className={clsx(
                "w-full py-12 border-2 border-dashed rounded-[32px] flex flex-col items-center justify-center gap-4 transition-all",
                preview ? "bg-indigo-50 border-indigo-400" : "bg-slate-50 border-slate-200 group-hover:border-indigo-400"
              )}>
                 {preview ? (
                   <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-xl border-4 border-white relative">
                      <img src={preview} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-indigo-500/20 flex items-center justify-center"><Check size={32} className="text-white drop-shadow-md" /></div>
                   </div>
                 ) : (
                   <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 shadow-md border border-slate-100">
                      <Upload size={28} />
                   </div>
                 )}
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{preview ? "Proof Loaded" : "Tap to Upload Screenshot"}</p>
              </div>
           </div>
        </div>

        <div className="bg-amber-50 p-6 rounded-[32px] border border-amber-100 flex items-start gap-4">
           <Info size={20} className="text-amber-500 shrink-0 mt-0.5" />
           <p className="text-[10px] font-bold text-amber-800 leading-relaxed uppercase tracking-wider">
             Manual Verification: System audits every receipt. Fake or duplicate IDs result in permanent ID termination.
           </p>
        </div>

        {/* FLOATING ACTION BUTTON */}
        <div className="pt-6">
           <button 
             type="submit"
             disabled={loading || !file}
             className="w-full h-20 bg-gradient-to-r from-indigo-600 to-sky-500 text-white rounded-[32px] font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-indigo-100 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
           >
             {loading ? <Loader2 size={28} className="animate-spin" /> : <>Finalize Deposit <ArrowRight size={24} /></>}
           </button>
        </div>
      </form>
    </div>
  );
};

export default Deposit;
