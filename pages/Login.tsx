
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Zap, Loader2, ChevronRight, 
  Eye, EyeOff, Smartphone, Mail, RefreshCcw, 
  Lock, ArrowLeft, Fingerprint, Globe
} from 'lucide-react';
import { dbRegistry } from '../backend_core/utils/db';

const Login = () => {
  const { login, demoLogin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authLoading) return;
    setError('');
    
    try {
      await login(identifier, password);
    } catch (err: any) {
      setError(err.message || 'Authentication packet rejected.');
    }
  };

  const handleRestore = () => {
    if(window.confirm("Bahi, kya aap database ko factory settings par reset karna chahtay hain?")) {
      dbRegistry.resetDatabase();
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-950 relative font-sans overflow-hidden">
      
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-sky-500/10 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-10 pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[420px] z-10"
      >
        <div className="bg-white/5 backdrop-blur-3xl rounded-[50px] border border-white/10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] p-8 md:p-12 relative overflow-hidden group">
          
          {/* Header Branding */}
          <div className="text-center mb-10 relative">
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="w-20 h-20 bg-indigo-600 rounded-[30px] flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(79,70,229,0.4)] border border-indigo-400/50"
            >
              <Zap size={40} className="text-white fill-white" />
            </motion.div>
            
            <div className="space-y-1">
               <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase italic leading-none">
                 Noor <span className="text-indigo-400">V3.</span>
               </h1>
               <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.4em]">Authorized Access Portal</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-3xl text-[10px] font-black uppercase flex items-center gap-3 shadow-lg"
              >
                <ShieldCheck size={18} className="shrink-0" /> {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-5 flex items-center gap-2">
                 <Fingerprint size={12} className="text-indigo-500" /> Identity ID
               </label>
               <div className="relative group">
                  <Smartphone size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                  <input 
                    type="text" value={identifier} onChange={(e) => setIdentifier(e.target.value)} 
                    placeholder="Email or Mobile Node" 
                    className="w-full h-16 pl-16 pr-6 bg-white/5 border border-white/10 rounded-[28px] font-bold text-sm text-white placeholder:text-slate-600 outline-none focus:bg-white/10 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all" 
                    required 
                  />
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-5 flex items-center gap-2">
                 <Lock size={12} className="text-indigo-500" /> Security Key
               </label>
               <div className="relative group">
                 <Fingerprint size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                 <input 
                   type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} 
                   placeholder="Enter Password" 
                   className="w-full h-16 pl-16 pr-16 bg-white/5 border border-white/10 rounded-[28px] font-bold text-sm text-white placeholder:text-slate-600 outline-none focus:bg-white/10 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all" 
                   required 
                 />
                 <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-600 p-2 hover:text-white transition-colors">
                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                 </button>
               </div>
            </div>

            <div className="flex items-center justify-end px-2">
               <Link to="/support" className="text-[9px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300 transition-colors">Forgot Key?</Link>
            </div>

            <button 
              type="submit" 
              disabled={authLoading} 
              className="w-full h-16 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[28px] font-black text-[12px] uppercase tracking-[0.3em] shadow-[0_20px_40px_-10px_rgba(79,70,229,0.3)] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-4 overflow-hidden relative group"
            >
              {authLoading ? (
                <><Loader2 className="w-5 h-5 text-white animate-spin" /> Authorizing...</>
              ) : (
                <>
                  <span className="relative z-10">Initiate Session</span>
                  <ChevronRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5">
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => demoLogin('admin')} className="h-12 bg-white/5 text-white rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5">Admin Node</button>
              <button onClick={() => demoLogin('user')} className="h-12 bg-indigo-600/10 text-indigo-400 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600/20 transition-all border border-indigo-500/20">User Node</button>
            </div>
            
            <button 
              onClick={handleRestore}
              className="w-full mt-6 h-10 text-[8px] font-black text-slate-600 uppercase tracking-[0.3em] flex items-center justify-center gap-2 hover:text-rose-500 transition-all"
            >
              <RefreshCcw size={10} /> Factory Reset Database
            </button>
          </div>

          <div className="mt-10 text-center">
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">
              New to the platform? <Link to="/register" className="text-white font-black ml-1 hover:underline underline-offset-4 decoration-indigo-500">Create Identity</Link>
            </p>
          </div>

          {/* Bottom Branding */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-20 flex items-center gap-1.5 whitespace-nowrap">
             <Globe size={10} className="text-white" />
             <span className="text-[7px] font-black text-white uppercase tracking-[0.5em]">Global Decentralized Network</span>
          </div>
        </div>
      </motion.div>

      {/* Exit Button */}
      <Link to="/" className="fixed top-8 left-8 flex items-center gap-3 text-slate-500 hover:text-white transition-colors group">
         <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/5 group-hover:bg-white/10">
            <ArrowLeft size={18} />
         </div>
         <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">Back to Portal</span>
      </Link>
    </div>
  );
};

export default Login;
