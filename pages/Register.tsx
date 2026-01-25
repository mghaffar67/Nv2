
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useConfig } from '../context/ConfigContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Zap, Loader2, ChevronRight, 
  Smartphone, Mail, Lock, User, ArrowLeft,
  UserPlus
} from 'lucide-react';

const Register = () => {
  const { register, loading: authLoading } = useAuth();
  const { config } = useConfig();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', referralCode: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authLoading) return;
    setError('');
    
    try {
      await register(form.name, form.email, form.phone, form.password, form.referralCode);
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#f8f9fb] relative font-sans overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-[-5%] left-[-5%] w-[300px] h-[300px] bg-sky-500/5 blur-[100px] rounded-full" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[300px] h-[300px] bg-indigo-500/5 blur-[100px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 10 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-[420px] z-10 py-6"
      >
        <div className="bg-white rounded-[44px] border border-slate-100 shadow-[0_25px_70px_-20px_rgba(0,0,0,0.08)] p-8 md:p-12 relative">
          
          <div className="text-center mb-10">
            <div 
              className="w-16 h-16 rounded-[24px] flex items-center justify-center mx-auto mb-6 shadow-2xl text-white"
              style={{ backgroundColor: config.theme.primaryColor }}
            >
              <UserPlus size={32} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">
              Join <span style={{ color: config.theme.primaryColor }}>Noor.</span>
            </h1>
            <p className="text-slate-400 text-[9px] font-bold uppercase tracking-[0.2em] mt-2 urdu-text">ارننگ شروع کرنے کے لیے اکاؤنٹ بنائیں</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-[10px] font-black uppercase flex items-center gap-3"
              >
                <ShieldCheck size={16} className="shrink-0" /> {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
             <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Full Name</label>
                <input 
                  type="text" placeholder="Your Name" required 
                  value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm text-slate-900 outline-none focus:bg-white transition-all shadow-inner" 
                />
             </div>
             
             <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Email Address</label>
                <input 
                  type="email" placeholder="example@mail.com" required 
                  value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                  className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm text-slate-900 outline-none focus:bg-white transition-all shadow-inner" 
                />
             </div>

             <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Mobile Number</label>
                <input 
                  type="tel" placeholder="03XXXXXXXXX" required 
                  value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                  className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm text-slate-900 outline-none focus:bg-white transition-all shadow-inner" 
                />
             </div>

             <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Password</label>
                <input 
                  type="password" placeholder="Min. 6 characters" required 
                  value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                  className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm text-slate-900 outline-none focus:bg-white transition-all shadow-inner" 
                />
             </div>

             <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Referral Code (Optional)</label>
                <input 
                  type="text" placeholder="Invite Code" 
                  value={form.referralCode} onChange={e => setForm({...form, referralCode: e.target.value})}
                  className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl font-black text-[11px] uppercase text-indigo-600 outline-none focus:bg-white transition-all shadow-inner" 
                />
             </div>

            <button 
              type="submit" 
              disabled={authLoading} 
              className="w-full h-16 text-white rounded-[28px] font-black text-xs uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 mt-6 disabled:opacity-50"
              style={{ backgroundColor: config.theme.primaryColor }}
            >
              {authLoading ? <Loader2 size={24} className="animate-spin" /> : <>Join Now <ChevronRight size={20} /></>}
            </button>
          </form>

          <div className="mt-10 text-center">
             <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
               Member already? <Link to="/login" className="font-black hover:underline ml-1" style={{ color: config.theme.primaryColor }}>Login Now</Link>
             </p>
          </div>
        </div>
      </motion.div>

      <Link to="/" className="fixed top-8 left-8 flex items-center gap-3 text-slate-400 hover:text-slate-900 transition-colors">
         <ArrowLeft size={20} />
         <span className="text-[10px] font-black uppercase tracking-widest">Back to Home</span>
      </Link>
    </div>
  );
};

export default Register;
