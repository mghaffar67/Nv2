import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Copy, Upload, ShieldCheck, 
  Info, CheckCircle2, Smartphone, Loader2, 
  Check, Zap, Image as ImageIcon, Wallet,
  ChevronLeft
} from 'lucide-react';
import { clsx } from 'clsx';
import { useNavigate, Link } from 'react-router-dom';
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
      <header className="flex items-center justify-between px-2 pt-2">
        <Link to="/user/wallet" className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-400 active:scale-90 transition-all">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Add <span className="text-indigo-600">Liquidity</span></h1>
        <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-sky-400 shadow-lg">
          <Wallet size={16} />
        </div>
      </header>

      {/* 1. BIG METHOD CARDS */}
      <div className="grid grid-cols-2 gap-3 px-1">
        {[
          { name: 'EasyPaisa', color: 'bg-emerald-600', icon: Smartphone },
          { name: 'JazzCash', color: 'bg-rose-600', icon: Smartphone }
        ].map(method => (
          <button 
            key={method.name}
            onClick={() => setForm({...form, gateway: method.name})}
            className={clsx(
              "relative p-6 rounded-[32px] border-2 transition-all flex flex-col items-center gap-3 active:scale-95 shadow-sm overflow-hidden",
              form.gateway === method.name ? `border-indigo-600 bg-indigo-50/50` : "border-white bg-white"
            )}
          >
            {form.gateway === method.name && (
              <motion.div layoutId="activeMethod" className="absolute top-2 right-2 text-indigo-600">
                <CheckCircle2 size={16} fill="currentColor" className="text-indigo-100" />
              </motion.div>
            )}
            <div className={clsx(
              "w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg",
              method.color
            )}>
              <method.icon size={28} />
            </div>
            <span className="font-black text-[10px] uppercase tracking-widest text-slate-800">{method.name}</span>
          </button>
        ))}
      </div>

      {/* 2. ADMIN RECIPIENT BOX */}
      <div className="bg-slate-900 p-6 rounded-[36px] text-white mx-1 relative overflow-hidden shadow-xl">
         <div className="absolute top-0 right-0 p-4 opacity-[0.05] rotate-12 scale-150">
            <ShieldCheck size={100} />
         </div>
         <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
               <span className="px-3 py-1 bg-white/10 rounded-full text-[8px] font-black uppercase tracking-widest text-sky-400 border border-white/5">
                 Official Receiver
               </span>
               <div className="flex items-center gap-2 text-emerald-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[8px] font-black uppercase tracking-widest">Online</span>
               </div>
            </div>
            
            <h3 className="text-xl font-black mb-1 tracking-tight">{selectedGateway?.accountTitle || 'Loading...'}</h3>
            
            <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between backdrop-blur-md">
               <span className="font-mono font-black text-lg tracking-widest">{selectedGateway?.accountNumber || '0000000000'}</span>
               <button 
                 onClick={() => handleCopy(selectedGateway?.accountNumber || '')}
                 className="h-10 px-6 bg-indigo-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest active:scale-90 transition-all flex items-center gap-2 shadow-lg"
               >
                 <Copy size={14} /> Copy
               </button>
            </div>
         </div>
      </div>

      {/* 3. INPUT FORM & UPLOAD AREA */}
      <form onSubmit={handleSubmit} className="space-y-4 px-1">
        <div className="bg-white p-6 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Inflow Amount (PKR)</label>
              <div className="relative">
                 <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-300 text-xl">Rs</span>
                 <input 
                   type="number" placeholder="000" required
                   value={form.amount} onChange={e => setForm({...form, amount: e.target.value})}
                   className="w-full h-16 pl-16 pr-6 bg-slate-50 border border-slate-100 rounded-3xl font-black text-2xl text-slate-900 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all"
                 />
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">TRX ID (Evidence)</label>
              <input 
                type="text" placeholder="Transaction Reference" required
                value={form.trxId} onChange={e => setForm({...form, trxId: e.target.value})}
                className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl font-black text-sm uppercase outline-none focus:bg-white transition-all"
              />
           </div>

           {/* DASHED UPLOAD AREA */}
           <div className="relative group">
              <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
              <div className={clsx(
                "w-full py-10 border-2 border-dashed rounded-[32px] flex flex-col items-center justify-center gap-3 transition-all",
                preview ? "bg-indigo-50 border-indigo-400" : "bg-slate-50 border-slate-200 group-hover:border-indigo-400"
              )}>
                 {preview ? (
                   <div className="relative">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                         <img src={preview} className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1 shadow-lg border-2 border-white">
                         <Check size={12} strokeWidth={4} />
                      </div>
                   </div>
                 ) : (
                   <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-300 shadow-md border border-slate-100 group-hover:scale-110 transition-transform">
                      <ImageIcon size={24} />
                   </div>
                 )}
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{preview ? "Proof Ready" : "Upload Receipt Screenshot"}</p>
              </div>
           </div>
        </div>

        {/* FLOATING ACTION BUTTON */}
        <div className="pt-4">
           <button 
             type="submit"
             disabled={loading || !file}
             className="w-full h-16 bg-gradient-to-r from-slate-900 to-indigo-900 text-white rounded-[28px] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
           >
             {loading ? <Loader2 size={24} className="animate-spin" /> : <>Commit Deposit <ArrowRight size={20} /></>}
           </button>
        </div>
        
        <div className="p-4 bg-amber-50 rounded-2xl flex gap-3 items-start border border-amber-100">
           <Info size={16} className="text-amber-500 shrink-0 mt-0.5" />
           <p className="text-[8px] font-bold text-amber-800 uppercase tracking-widest leading-relaxed">
             Security Node: Fraudulent or duplicate TRX IDs result in immediate account termination. Manual audit is performed by Noor Core Team.
           </p>
        </div>
      </form>
    </div>
  );
};

export default Deposit;