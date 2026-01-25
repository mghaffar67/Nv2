
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
      setError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#f8f9fb] relative font-sans overflow-hidden">
      
      <div className="absolute top-[-5%] left-[-5%] w-[200px] h-[200px] bg-indigo-500/5 blur-[80px] rounded-full" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[200px] h-[200px] bg-sky-500/5 blur-[80px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 10 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-[360px] z-10 py-6"
      >
        <div className="bg-white rounded-[36px] border border-slate-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.08)] p-8 md:p-10 relative">
          
          <div className="text-center mb-8">
            <div 
              className="w-12 h-12 rounded-[18px] flex items-center justify-center mx-auto mb-5 shadow-lg text-white"
              style={{ backgroundColor: config.theme.primaryColor }}
            >
              <Zap size={24} fill="currentColor" />
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase italic">
              Member <span style={{ color: config.theme.primaryColor }}>Login.</span>
            </h1>
            <p className="text-slate-400 text-[8px] font-bold uppercase tracking-[0.2em] mt-2">Authenticated Access Portal</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-[9px] font-black uppercase flex items-center gap-2"
              >
                <AlertCircle size={14} /> {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
               <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Account ID / Mobile</label>
               <input 
                 value={identifier} onChange={e => setIdentifier(e.target.value)} 
                 className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs text-slate-900 outline-none focus:bg-white transition-all shadow-inner" 
                 placeholder="Email or Mobile" required 
               />
            </div>

            <div className="space-y-1.5">
               <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Secure Password</label>
               <input 
                 type="password" value={password} onChange={e => setPassword(e.target.value)} 
                 className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs text-slate-900 outline-none focus:bg-white transition-all shadow-inner" 
                 placeholder="••••••••" required 
               />
            </div>

            <button 
              type="submit" 
              disabled={authLoading} 
              className="w-full h-14 text-white rounded-[20px] font-black text-[10px] uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
              style={{ backgroundColor: config.theme.primaryColor }}
            >
              {authLoading ? <Loader2 size={20} className="animate-spin" /> : <>Authenticate Node <ChevronRight size={16} /></>}
            </button>
          </form>

          {/* Demo Login Buttons */}
          <div className="mt-8 pt-8 border-t border-slate-50">
             <p className="text-center text-[8px] font-black text-slate-300 uppercase tracking-widest mb-4">Quick Probe Access</p>
             <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => demoLogin('admin')} 
                  className="h-10 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-slate-100 active:scale-95"
                >
                  <ShieldCheck size={14} /> Admin
                </button>
                <button 
                  onClick={() => demoLogin('user')} 
                  className="h-10 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-slate-100 active:scale-95"
                >
                  <UserCheck size={14} /> User
                </button>
             </div>
          </div>

          <div className="mt-8 text-center">
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
               New Associate? <Link to="/register" className="font-black hover:underline ml-1" style={{ color: config.theme.primaryColor }}>Join Now</Link>
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

export default Login;
