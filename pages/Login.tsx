
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useConfig } from '../context/ConfigContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Loader2, ChevronRight, 
  Lock, User, ArrowLeft, AlertCircle, 
  LogIn as LoginIcon, ShieldCheck, UserCheck
} from 'lucide-react';

const Login = () => {
  const { login, demoLogin, loading: authLoading, user } = useAuth();
  const { config } = useConfig();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && !authLoading) {
      const target = user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard';
      navigate(target, { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(identifier, password);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your details.');
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
        className="w-full max-w-[400px] z-10 py-6"
      >
        <div className="bg-white rounded-[44px] border border-slate-100 shadow-[0_25px_70px_-20px_rgba(0,0,0,0.08)] p-8 md:p-12 relative">
          
          <div className="text-center mb-10">
            <div 
              className="w-16 h-16 rounded-[24px] flex items-center justify-center mx-auto mb-6 shadow-2xl text-white"
              style={{ backgroundColor: config.theme.primaryColor }}
            >
              <Zap size={32} fill="currentColor" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">
              Welcome <span style={{ color: config.theme.primaryColor }}>Back.</span>
            </h1>
            <p className="text-slate-400 text-[9px] font-bold uppercase tracking-[0.2em] mt-2 urdu-text">اپنے اکاؤنٹ میں لاگ ان کریں</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-[10px] font-black uppercase flex items-center gap-3"
              >
                <AlertCircle size={16} className="shrink-0" /> {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Email or Mobile</label>
               <div className="relative group">
                 <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                 <input 
                   value={identifier} onChange={e => setIdentifier(e.target.value)} 
                   className="w-full h-15 pl-13 pr-6 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm text-slate-900 outline-none focus:bg-white transition-all shadow-inner" 
                   placeholder="Enter your ID" required 
                 />
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Password</label>
               <div className="relative group">
                 <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                 <input 
                   type="password" value={password} onChange={e => setPassword(e.target.value)} 
                   className="w-full h-15 pl-13 pr-6 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm text-slate-900 outline-none focus:bg-white transition-all shadow-inner" 
                   placeholder="••••••••" required 
                 />
               </div>
            </div>

            <button 
              type="submit" 
              disabled={authLoading} 
              className="w-full h-16 text-white rounded-[28px] font-black text-xs uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 mt-6 disabled:opacity-50"
              style={{ backgroundColor: config.theme.primaryColor }}
            >
              {authLoading ? <Loader2 size={24} className="animate-spin" /> : <><LoginIcon size={20} /> Log In Now</>}
            </button>
          </form>

          {/* Demo Login Buttons */}
          <div className="mt-10 pt-10 border-t border-slate-50">
             <p className="text-center text-[9px] font-black text-slate-300 uppercase tracking-widest mb-6">Quick Demo Access</p>
             <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => demoLogin('admin')} 
                  className="h-12 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-slate-100 shadow-sm active:scale-95"
                >
                  <ShieldCheck size={14} className="text-indigo-500" /> Demo Admin
                </button>
                <button 
                  onClick={() => demoLogin('user')} 
                  className="h-12 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-slate-100 shadow-sm active:scale-95"
                >
                  <UserCheck size={14} className="text-indigo-500" /> Demo User
                </button>
             </div>
          </div>

          <div className="mt-10 text-center">
             <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
               New here? <Link to="/register" className="font-black hover:underline ml-1" style={{ color: config.theme.primaryColor }}>Create Account</Link>
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

export default Login;
