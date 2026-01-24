
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
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#f8f9fb] font-sans">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-[360px]">
        <div className="bg-white rounded-[44px] border border-slate-100 shadow-2xl p-8 md:p-10 relative overflow-hidden">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-slate-950 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xl text-sky-400"><Zap size={28} fill="currentColor" /></div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Welcome Back.</h1>
            <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.3em] mt-2 italic">Authorized Partner Node</p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-rose-50 text-rose-600 rounded-2xl text-[10px] font-black uppercase flex items-center gap-3">
                <AlertCircle size={14} /> {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
               <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Email ya Mobile No.</label>
               <div className="relative group">
                 <User size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                 <input value={identifier} onChange={e => setIdentifier(e.target.value)} className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50" placeholder="03001234567" required />
               </div>
            </div>

            <div className="space-y-1.5">
               <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Password</label>
               <div className="relative group">
                 <Lock size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                 <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50" placeholder="••••••••" required />
               </div>
            </div>

            <button type="submit" disabled={authLoading} className="w-full h-14 bg-slate-950 text-white rounded-[20px] font-black text-[10px] uppercase tracking-[0.25em] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 mt-6">
              {authLoading ? <Loader2 size={20} className="animate-spin" /> : <><LoginIcon size={16} /> Enter Portal</>}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-50 flex flex-col items-center gap-4">
             {config.modules.demoLoginEnabled && (
               <div className="flex gap-2">
                  <button onClick={() => demoLogin('admin')} className="px-4 py-2 bg-slate-50 rounded-xl text-[8px] font-black uppercase text-slate-400 hover:text-slate-900 transition-colors">Demo Admin</button>
                  <button onClick={() => demoLogin('user')} className="px-4 py-2 bg-slate-50 rounded-xl text-[8px] font-black uppercase text-slate-400 hover:text-slate-900 transition-colors">Demo User</button>
               </div>
             )}
             <p className="text-[10px] text-slate-400 font-bold uppercase">New member? <Link to="/register" className="text-indigo-600 font-black">Join Hub</Link></p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
