
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useConfig } from '../context/ConfigContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Loader2, ChevronRight, 
  Lock, User, ArrowLeft, AlertCircle, 
  LogIn as LoginIcon
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
      setError(err.message || 'Login failed. Details check karen.');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#f8f9fb] relative font-sans overflow-hidden">
      
      {/* Background Decor matching Register */}
      <div className="absolute top-[-5%] left-[-5%] w-[300px] h-[300px] bg-sky-500/5 blur-[100px] rounded-full" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[300px] h-[300px] bg-indigo-500/5 blur-[100px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 10 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-[360px] z-10 py-6"
      >
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] p-6 md:p-8 relative">
          
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl text-sky-400">
              <Zap size={24} fill="currentColor" />
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase italic">
              Welcome <span className="text-indigo-600">Back.</span>
            </h1>
            <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mt-1">Authorized Partner Portal</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-[10px] font-black uppercase flex items-center gap-2"
              >
                <AlertCircle size={14} className="shrink-0" /> {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
               <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-3">Email ya Mobile No.</label>
               <div className="relative group">
                 <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                 <input 
                   value={identifier} onChange={e => setIdentifier(e.target.value)} 
                   className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs text-slate-900 outline-none focus:bg-white focus:border-indigo-500 transition-all" 
                   placeholder="03XXXXXXXXX" required 
                 />
               </div>
            </div>

            <div className="space-y-1">
               <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-3">Password</label>
               <div className="relative group">
                 <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                 <input 
                   type="password" value={password} onChange={e => setPassword(e.target.value)} 
                   className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs text-slate-900 outline-none focus:bg-white focus:border-indigo-500 transition-all" 
                   placeholder="••••••••" required 
                 />
               </div>
            </div>

            <button type="submit" disabled={authLoading} className="w-full h-12 bg-slate-950 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 mt-4">
              {authLoading ? <Loader2 size={16} className="animate-spin" /> : <><LoginIcon size={16} /> Enter Portal</>}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-50 flex flex-col items-center gap-4">
             {config.modules.demoLoginEnabled && (
               <div className="flex gap-2">
                  <button onClick={() => demoLogin('admin')} className="px-4 py-2 bg-slate-50 rounded-xl text-[8px] font-black uppercase text-slate-400 hover:text-slate-900 transition-colors">Demo Admin</button>
                  <button onClick={() => demoLogin('user')} className="px-4 py-2 bg-slate-50 rounded-xl text-[8px] font-black uppercase text-slate-400 hover:text-slate-900 transition-colors">Demo User</button>
               </div>
             )}
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
               New member? <Link to="/register" className="text-indigo-600 font-black ml-1 hover:underline">Join Hub</Link>
             </p>
          </div>
        </div>
      </motion.div>

      <Link to="/" className="fixed top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors">
         <ArrowLeft size={16} />
         <span className="text-[9px] font-black uppercase tracking-widest">Home</span>
      </Link>
    </div>
  );
};

export default Login;
