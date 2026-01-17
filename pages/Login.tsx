
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Lock, ChevronRight, Eye, EyeOff, 
  ShieldCheck, Zap, Loader2 
} from 'lucide-react';

const DemoLoginSection = ({ onDemo }: { onDemo: (role: 'user' | 'admin') => void }) => (
  <div className="mt-5 pt-4 border-t border-slate-50">
    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest text-center mb-3">One-Tap Demo Access</p>
    <div className="grid grid-cols-2 gap-2">
      <button onClick={() => onDemo('admin')} className="h-9 bg-sky-50 text-sky-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-sky-100">Admin</button>
      <button onClick={() => onDemo('user')} className="h-9 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-indigo-100">User</button>
    </div>
  </div>
);

const Login = () => {
  const { login, demoLogin, loading, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && !loading) {
      const target = user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard';
      navigate(target, { replace: true });
    }
  }, [user, navigate, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#f8f9fb] relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-sky-100 blur-[80px] rounded-full opacity-30"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-100 blur-[80px] rounded-full opacity-30"></div>

      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-[360px] z-10">
        <div className="relative bg-white/95 backdrop-blur-xl rounded-[28px] border border-white shadow-xl p-5 md:p-8 overflow-hidden">
          
          <AnimatePresence>
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
                <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest mt-2">Authenticating</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="text-center mb-5">
            <div className="inline-flex items-center gap-1.5 bg-slate-900 text-white px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest mb-3">
              <Zap size={8} fill="currentColor" className="text-sky-400" /> NOOR PORTAL
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1">Partner Login</h1>
            <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">Secure Access</p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-3 p-2.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-[9px] font-black uppercase flex items-center gap-2">
                <ShieldCheck size={12} /> {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full h-11 pl-11 pr-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs outline-none focus:ring-4 focus:ring-sky-500/5 transition-all" required />
            </div>
            <div className="relative">
              <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full h-11 pl-11 pr-11 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs outline-none focus:ring-4 focus:ring-sky-500/5 transition-all" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-300 p-2">{showPassword ? <EyeOff size={14} /> : <Eye size={14} />}</button>
            </div>
            <button type="submit" disabled={loading} className="w-full h-12 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2">Sign In <ChevronRight size={16} /></button>
          </form>

          <DemoLoginSection onDemo={demoLogin} />

          <p className="mt-5 text-center text-[9px] text-slate-400 font-bold uppercase tracking-widest">
            New here? <Link to="/register" className="text-sky-500 ml-1">Create ID</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
