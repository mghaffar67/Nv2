
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useConfig } from '../context/ConfigContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Loader2, ChevronRight, 
  Lock, User, ArrowLeft, AlertCircle, 
  LogIn as LoginIcon, ShieldCheck, UserCheck, Mail
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
      setError(err.message || 'Identity verification failed.');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#fcfdfe] relative font-sans overflow-hidden">
      
      {/* Floating Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-500/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-sky-500/5 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[380px] z-10"
      >
        <div className="bg-white rounded-[44px] border border-slate-100 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.08)] p-8 md:p-12 relative overflow-hidden">
          
          <div className="text-center mb-10">
            <div 
              className="w-16 h-16 rounded-[26px] flex items-center justify-center mx-auto mb-6 shadow-2xl text-white transform -rotate-3"
              style={{ backgroundColor: config.theme.primaryColor }}
            >
              <Zap size={32} fill="currentColor" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">
              Member <span style={{ color: config.theme.primaryColor }}>Portal.</span>
            </h1>
            <p className="text-slate-400 text-[9px] font-bold uppercase tracking-[0.3em] mt-2">Authorized Access Only</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-[9px] font-black uppercase flex items-center gap-3"
              >
                <AlertCircle size={16} /> {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
               <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Email / ID Node</label>
               <div className="relative">
                  <Mail size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input 
                    value={identifier} onChange={e => setIdentifier(e.target.value)} 
                    className="w-full h-14 pl-14 pr-6 bg-slate-50/50 border border-slate-100 rounded-2xl font-bold text-sm text-slate-900 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all shadow-inner placeholder:text-slate-300" 
                    placeholder="Enter email or phone" required 
                  />
               </div>
            </div>

            <div className="space-y-1.5">
               <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Security Key</label>
               <div className="relative">
                  <Lock size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input 
                    type="password" value={password} onChange={e => setPassword(e.target.value)} 
                    className="w-full h-14 pl-14 pr-6 bg-slate-50/50 border border-slate-100 rounded-2xl font-bold text-sm text-slate-900 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all shadow-inner placeholder:text-slate-300" 
                    placeholder="••••••••" required 
                  />
               </div>
            </div>

            <button 
              type="submit" 
              disabled={authLoading} 
              className="w-full h-16 text-white rounded-[26px] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 mt-6 disabled:opacity-50"
              style={{ backgroundColor: config.theme.primaryColor }}
            >
              {authLoading ? <Loader2 size={24} className="animate-spin" /> : <>Access Account <ChevronRight size={18} /></>}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50 flex flex-col gap-6">
             <div className="grid grid-cols-2 gap-3">
                <button onClick={() => demoLogin('admin')} className="h-11 bg-slate-950 text-white rounded-xl text-[8px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2">
                  <ShieldCheck size={14} className="text-sky-400" /> Admin Probe
                </button>
                <button onClick={() => demoLogin('user')} className="h-11 bg-white border border-slate-100 text-slate-600 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-sm flex items-center justify-center gap-2">
                  <User size={14} className="text-indigo-500" /> Partner Access
                </button>
             </div>
             
             <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
               New Associate? <Link to="/register" className="font-black hover:underline" style={{ color: config.theme.primaryColor }}>Join Network</Link>
             </p>
          </div>
        </div>
      </motion.div>

      <Link to="/" className="fixed top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all group">
         <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-sm group-hover:-translate-x-1 transition-transform"><ArrowLeft size={16} /></div>
         <span className="text-[9px] font-black uppercase tracking-widest">Platform Exit</span>
      </Link>
    </div>
  );
};

export default Login;
