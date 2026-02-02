
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
      
      <div className="absolute top-[-5%] left-[-5%] w-[200px] h-[200px] bg-indigo-500/5 blur-[80px] rounded-full" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[200px] h-[200px] bg-sky-500/5 blur-[80px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 10 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-[380px] z-10 py-6"
      >
        <div className="bg-white rounded-[36px] border border-slate-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.08)] p-8 md:p-10 relative">
          
          <div className="text-center mb-8">
            <div 
              className="w-12 h-12 rounded-[18px] flex items-center justify-center mx-auto mb-5 shadow-lg text-white"
              style={{ backgroundColor: config.theme.primaryColor }}
            >
              <UserPlus size={24} />
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase italic">
              Join <span style={{ color: config.theme.primaryColor }}>Network.</span>
            </h1>
            <p className="text-slate-400 text-[8px] font-bold uppercase tracking-[0.2em] mt-2">Initialize Your Identity Node</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-[9px] font-black uppercase flex items-center gap-2"
              >
                <ShieldCheck size={14} /> {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
             <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Legal Name</label>
                <input 
                  type="text" placeholder="Your Name" required 
                  value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs text-slate-900 outline-none focus:bg-white transition-all shadow-inner" 
                />
             </div>
             
             <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Email Node</label>
                <input 
                  type="email" placeholder="example@mail.com" required 
                  value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                  className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs text-slate-900 outline-none focus:bg-white transition-all shadow-inner" 
                />
             </div>

             <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Mobile ID</label>
                <input 
                  type="tel" placeholder="03XXXXXXXXX" required 
                  value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                  className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs text-slate-900 outline-none focus:bg-white transition-all shadow-inner" 
                />
             </div>

             <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Security Key</label>
                <input 
                  type="password" placeholder="Min. 6 characters" required 
                  value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                  className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs text-slate-900 outline-none focus:bg-white transition-all shadow-inner" 
                />
             </div>

             <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Referral Token</label>
                <input 
                  type="text" placeholder="Invite Code (Optional)" 
                  value={form.referralCode} onChange={e => setForm({...form, referralCode: e.target.value})}
                  className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl font-black text-[10px] uppercase text-indigo-600 outline-none focus:bg-white transition-all shadow-inner" 
                />
             </div>

            <button 
              type="submit" 
              disabled={authLoading} 
              className="w-full h-14 text-white rounded-[20px] font-black text-[10px] uppercase tracking-[0.3em] shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
              style={{ backgroundColor: config.theme.primaryColor }}
            >
              {authLoading ? <Loader2 size={24} className="animate-spin" /> : <>Join Network <ChevronRight size={16} /></>}
            </button>
          </form>

          <div className="mt-8 text-center">
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
               Registered? <Link to="/login" className="font-black hover:underline ml-1" style={{ color: config.theme.primaryColor }}>Portal Login</Link>
             </p>
          </div>
        </div>
      </motion.div>

      <Link to="/" className="fixed top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors">
         <ArrowLeft size={18} />
         <span className="text-[9px] font-black uppercase tracking-widest">Portal Exit</span>
      </Link>
    </div>
  );
};

export default Register;
