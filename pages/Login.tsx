import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useConfig } from '../context/ConfigContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Loader2, ChevronRight, 
  Lock, ArrowLeft, AlertCircle, 
  Mail, ShieldCheck, User, Eye, EyeOff
} from 'lucide-react';

const Login = () => {
  const { login, demoLogin, loading: authLoading, user } = useAuth();
  const { config } = useConfig();
  const navigate = useNavigate();
  
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      setError(err.message || 'Login failed. Please check your email and password.');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#f8fafc] relative font-sans overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-500/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-sky-500/5 blur-[120px] rounded-full" />

      <div className="w-full max-w-[450px] bg-white rounded-[44px] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.08)] border border-slate-100 p-8 md:p-12 relative z-10">
          <div className="text-center mb-10">
            <div 
              className="w-16 h-16 rounded-[26px] flex items-center justify-center mx-auto mb-6 shadow-2xl text-white transform -rotate-3 bg-indigo-600"
            >
              <Zap size={32} fill="currentColor" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
              Login <span className="text-indigo-600">Portal.</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-2 italic">Welcome to Noor Official V3</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-[10px] font-black uppercase flex items-center gap-3"
              >
                <AlertCircle size={16} /> {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Email or Phone</label>
               <div className="relative">
                  <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input 
                    value={identifier} onChange={e => setIdentifier(e.target.value)} 
                    className="w-full h-14 pl-14 pr-6 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm text-slate-900 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all" 
                    placeholder="example@mail.com" required 
                  />
               </div>
            </div>

            <div className="space-y-1.5">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Password</label>
               <div className="relative">
                  <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password} onChange={e => setPassword(e.target.value)} 
                    className="w-full h-14 pl-14 pr-14 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm text-slate-900 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all" 
                    placeholder="••••••••" required 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
               </div>
            </div>

            <button 
              type="submit" 
              disabled={authLoading} 
              className="w-full h-16 bg-slate-900 text-white rounded-[26px] font-black text-[12px] uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 mt-6 disabled:opacity-50"
            >
              {authLoading ? <Loader2 size={24} className="animate-spin" /> : <>Sign In Now <ChevronRight size={18} /></>}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50 flex flex-col gap-6">
             <div className="grid grid-cols-2 gap-3">
                <button onClick={() => demoLogin('admin')} className="h-12 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">Demo Admin</button>
                <button onClick={() => demoLogin('user')} className="h-12 bg-white border border-slate-100 text-slate-600 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm active:scale-95 transition-all">Demo User</button>
             </div>
             <p className="text-center text-[11px] text-slate-400 font-bold uppercase tracking-widest italic">
               No account? <Link to="/register" className="text-indigo-600 font-black hover:underline">Create One Here</Link>
             </p>
          </div>
      </div>

      <Link to="/" className="fixed top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all group">
         <ArrowLeft size={16} />
         <span className="text-[10px] font-black uppercase tracking-widest">Back</span>
      </Link>
    </div>
  );
};

export default Login;