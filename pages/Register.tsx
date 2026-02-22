import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useConfig } from '../context/ConfigContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Zap, Loader2, ChevronRight, 
  Smartphone, Mail, Lock, User, ArrowLeft,
  UserPlus, Target, AlertCircle
} from 'lucide-react';

const Register = () => {
  const { register, loading: authLoading } = useAuth();
  const { config } = useConfig();
  const location = useLocation();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', referralCode: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const refCode = params.get('ref');
    if (refCode) {
      setForm(prev => ({ ...prev, referralCode: refCode }));
    }
  }, [location.search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authLoading) return;
    setError('');
    
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    
    try {
      await register(form.name, form.email, form.phone, form.password, form.referralCode);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check your details.');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#f8f9fb] relative font-sans overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[420px] z-10 py-6"
      >
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.08)] p-8 md:p-10 relative">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">
              Create <span className="text-indigo-600">Account.</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-2 italic">Join Noor Official V3 Community</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-[10px] font-black uppercase flex items-center gap-2"
              >
                <AlertCircle size={16} /> {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
             <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3 italic">Full Name</label>
                <input 
                  type="text" placeholder="e.g. Ali Khan" required 
                  value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none focus:bg-white transition-all shadow-inner" 
                />
             </div>
             
             <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3 italic">Email Address</label>
                  <input 
                    type="email" placeholder="mail@example.com" required 
                    value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                    className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none focus:bg-white" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3 italic">Phone Number</label>
                  <input 
                    type="tel" placeholder="03XXXXXXXXX" required 
                    value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                    className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none focus:bg-white" 
                  />
                </div>
             </div>

             <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3 italic">Login Password</label>
                  <input 
                    type="password" placeholder="••••••••" required 
                    value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                    className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none focus:bg-white" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3 italic">Confirm Key</label>
                  <input 
                    type="password" placeholder="••••••••" required 
                    value={form.confirmPassword} onChange={e => setForm({...form, confirmPassword: e.target.value})}
                    className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none focus:bg-white" 
                  />
                </div>
             </div>

             <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3 italic">Referral ID (If any)</label>
                <input 
                  type="text" placeholder="Invite Code" 
                  value={form.referralCode} onChange={e => setForm({...form, referralCode: e.target.value})}
                  className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl font-black text-[11px] uppercase text-indigo-600 outline-none focus:bg-white" 
                />
             </div>

            <button 
              type="submit" 
              disabled={authLoading} 
              className="w-full h-16 bg-slate-900 text-white rounded-[24px] font-black text-[12px] uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
              {authLoading ? <Loader2 size={24} className="animate-spin" /> : <>Create Account <ChevronRight size={18} /></>}
            </button>
          </form>

          <p className="mt-8 text-center text-[11px] text-slate-400 font-bold uppercase tracking-widest italic">
            Already a member? <Link to="/login" className="text-indigo-600 font-black hover:underline">Sign In Instead</Link>
          </p>
        </div>
      </motion.div>

      <Link to="/" className="fixed top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors">
         <ArrowLeft size={18} />
         <span className="text-[10px] font-black uppercase tracking-widest">Back</span>
      </Link>
    </div>
  );
};

export default Register;