
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Lock, ChevronRight, ShieldCheck, Zap, Users, Loader2, CheckCircle2 } from 'lucide-react';

const Register = () => {
  const { register, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', referralCode: '' });
  const [error, setError] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLocalLoading(true);
    try {
      await register(
        formData.name,
        formData.email,
        formData.phone,
        formData.password,
        formData.referralCode
      );
      
      setIsSuccess(true);
      // The AuthContext.register already handles state and navigation, 
      // but we show the success UI for 1.5s for UX.
      setTimeout(() => {
        navigate('/user/dashboard', { replace: true });
      }, 1500);

    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check your details.');
      setLocalLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#f8f9fb]">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
           <div className="w-20 h-20 bg-green-50 text-green-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
             <CheckCircle2 size={40} />
           </div>
           <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Account Created!</h2>
           <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest animate-pulse">Syncing Membership Data...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#f8f9fb] relative overflow-hidden">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[340px] z-10">
        <div className="bg-white/95 backdrop-blur-xl rounded-[28px] border border-white shadow-xl p-6 md:p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 bg-slate-900 text-white px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest mb-3">
              <Zap size={8} fill="currentColor" className="text-sky-400" /> JOIN NOOR OFFICIAL
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1">Create ID</h1>
            <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest leading-none">Instant Dashboard Access</p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="mb-4 p-2.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-[9px] font-black uppercase flex items-center gap-2">
                <ShieldCheck size={12} /> {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
            <div className="relative">
              <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
              <input type="text" placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs outline-none focus:ring-4 focus:ring-sky-50 transition-all" required />
            </div>
            <div className="relative">
              <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
              <input type="email" placeholder="Email Address" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs outline-none focus:ring-4 focus:ring-sky-50 transition-all" required />
            </div>
            <div className="relative">
              <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
              <input type="tel" placeholder="Mobile Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs outline-none focus:ring-4 focus:ring-sky-50 transition-all" required />
            </div>
            <div className="relative">
              <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
              <input type="password" placeholder="Secure Password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs outline-none focus:ring-4 focus:ring-sky-50 transition-all" required />
            </div>
            <div className="relative">
              <Users size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
              <input type="text" placeholder="Referral Code (Optional)" value={formData.referralCode} onChange={e => setFormData({...formData, referralCode: e.target.value})} className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs outline-none uppercase" />
            </div>

            <button type="submit" disabled={localLoading || authLoading} className="w-full h-11 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 mt-2">
              {localLoading || authLoading ? <Loader2 size={16} className="animate-spin" /> : <>Register Now <ChevronRight size={14} /></>}
            </button>
          </form>

          <p className="mt-6 text-center text-[9px] text-slate-400 font-bold uppercase tracking-widest">
            Already have an ID? <Link to="/login" className="text-sky-500 ml-1">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
