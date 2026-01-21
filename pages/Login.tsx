
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Zap, Loader2, ChevronRight, 
  Eye, EyeOff, Lock, User, ArrowLeft, AlertCircle
} from 'lucide-react';

const Login = () => {
  const { login, demoLogin, loading: authLoading, user } = useAuth();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [btnLoading, setBtnLoading] = useState(false);

  // Prevention check: If already logged in, redirect away
  useEffect(() => {
    if (user && !authLoading) {
      const target = user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard';
      navigate(target, { replace: true });
    }
  }, [user, authLoading, navigate]);

  const validate = () => {
    if (!identifier.trim()) return "Email ya Mobile number likhna zaroori hai.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^((\+92)|(92)|(0))?3[0-9]{9}$/;
    
    if (!emailRegex.test(identifier) && !phoneRegex.test(identifier)) {
      return "Ghalat format! Sahi Email ya Mobile (03001234567) likhen.";
    }
    if (password.length < 6) return "Password kam az kam 6 characters ka hona chahiye.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authLoading || btnLoading) return;
    
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setBtnLoading(true);
    
    try {
      await login(identifier, password);
    } catch (err: any) {
      setError(err.message || 'Login nahi ho saka. Details check karen.');
      setBtnLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#f8f9fb] relative font-sans overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-indigo-500/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-sky-500/5 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-[380px] z-10"
      >
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.08)] p-8 md:p-10 relative">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-slate-900 rounded-[24px] flex items-center justify-center mx-auto mb-6 shadow-2xl border-4 border-slate-50 text-sky-400">
              <Zap size={32} fill="currentColor" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
              Noor <span className="text-indigo-600">Portal.</span>
            </h1>
            <p className="text-slate-400 text-[9px] font-bold uppercase tracking-[0.3em] mt-3 italic">Verified Node Authentication</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-[10px] font-black uppercase flex items-start gap-3 shadow-sm"
              >
                <AlertCircle size={16} className="shrink-0 mt-0.5" /> 
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
               <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Email ya Mobile</label>
               <div className="relative group">
                 <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                 <input 
                   type="text" value={identifier} onChange={(e) => setIdentifier(e.target.value)} 
                   placeholder="03001234567" 
                   className="w-full h-14 pl-14 pr-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm text-slate-900 outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all" 
                   required 
                 />
               </div>
            </div>

            <div className="space-y-1.5">
               <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Secure Key</label>
               <div className="relative group">
                 <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                 <input 
                   type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} 
                   placeholder="••••••••" 
                   className="w-full h-14 pl-14 pr-14 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm text-slate-900 outline-none focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all" 
                   required 
                 />
                 <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600">
                   {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                 </button>
               </div>
            </div>

            <button 
              type="submit" 
              disabled={authLoading || btnLoading} 
              className="w-full h-16 bg-slate-950 hover:bg-indigo-600 text-white rounded-[24px] font-black text-[11px] uppercase tracking-[0.25em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-6"
            >
              {(authLoading || btnLoading) ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sync Identity <ChevronRight size={18} /></>}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50 text-center">
             <div className="grid grid-cols-2 gap-3 mb-6">
                <button onClick={() => demoLogin('admin')} className="h-11 bg-slate-50 text-slate-400 rounded-xl text-[8px] font-black uppercase hover:bg-slate-100 hover:text-slate-900 transition-all border border-slate-100">Test Admin</button>
                <button onClick={() => demoLogin('user')} className="h-11 bg-slate-50 text-slate-400 rounded-xl text-[8px] font-black uppercase hover:bg-slate-100 hover:text-slate-900 transition-all border border-slate-100">Test User</button>
             </div>
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
               New associate? <Link to="/register" className="text-indigo-600 font-black ml-1 hover:underline">Register Hub</Link>
             </p>
          </div>
        </div>
      </motion.div>

      <Link to="/" className="fixed top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors group">
         <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
         <span className="text-[10px] font-black uppercase tracking-widest">Portal Home</span>
      </Link>
    </div>
  );
};

export default Login;
