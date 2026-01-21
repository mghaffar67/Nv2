
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Zap, Loader2, ChevronRight, 
  Smartphone, Mail, Lock, User, ArrowLeft
} from 'lucide-react';

const Register = () => {
  const { register, loading: authLoading } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', referralCode: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authLoading) return;
    setError('');
    
    try {
      await register(form.name, form.email, form.phone, form.password, form.referralCode);
    } catch (err: any) {
      setError(err.message || 'Signup failed.');
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
        className="w-full max-w-[350px] z-10 py-6"
      >
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] p-6 md:p-8 relative">
          
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-sky-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-sky-100">
              <Zap size={24} className="text-white" fill="currentColor" />
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase italic">
              Join <span className="text-sky-500">Noor.</span>
            </h1>
            <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mt-1">Start your earning journey</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-[10px] font-black uppercase flex items-center gap-2"
              >
                <ShieldCheck size={14} className="shrink-0" /> {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-3">
             <div className="space-y-1">
                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-3">Full Name</label>
                <input 
                  type="text" placeholder="e.g. Ali Ahmed" required 
                  value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs text-slate-900 outline-none focus:bg-white focus:border-sky-500 transition-all" 
                />
             </div>
             
             <div className="space-y-1">
                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-3">Email Address</label>
                <input 
                  type="email" placeholder="example@mail.com" required 
                  value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs text-slate-900 outline-none focus:bg-white focus:border-sky-500 transition-all" 
                />
             </div>

             <div className="space-y-1">
                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-3">Mobile Number</label>
                <input 
                  type="tel" placeholder="03XXXXXXXXX" required 
                  value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs text-slate-900 outline-none focus:bg-white focus:border-sky-500 transition-all" 
                />
             </div>

             <div className="space-y-1">
                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-3">Password</label>
                <input 
                  type="password" placeholder="Min. 6 characters" required 
                  value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs text-slate-900 outline-none focus:bg-white focus:border-sky-500 transition-all" 
                />
             </div>

             <div className="space-y-1">
                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-3">Invite Code (Optional)</label>
                <input 
                  type="text" placeholder="Invite Code" 
                  value={form.referralCode} onChange={e => setForm({...form, referralCode: e.target.value})}
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-100 rounded-xl font-black text-[10px] uppercase text-sky-600 outline-none focus:bg-white transition-all" 
                />
             </div>

            <button 
              type="submit" 
              disabled={authLoading} 
              className="w-full h-12 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
            >
              {authLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Create Account <ChevronRight size={14} /></>}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-50 text-center">
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
               Already have an account? <Link to="/login" className="text-sky-600 font-black ml-1 hover:underline">Login</Link>
             </p>
          </div>
        </div>
      </motion.div>

      <Link to="/" className="fixed top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-sky-600 transition-colors">
         <ArrowLeft size={16} />
         <span className="text-[9px] font-black uppercase tracking-widest">Home</span>
      </Link>
    </div>
  );
};

export default Register;
