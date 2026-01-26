
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ChevronRight, Zap, ShieldCheck, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Login = () => {
  const { login, demoLogin } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#f8fafc] relative overflow-hidden font-sans">
      
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-lg pointer-events-none opacity-50">
         <div className="absolute top-10 left-10 w-32 h-32 bg-indigo-200 blur-[80px] rounded-full" />
         <div className="absolute bottom-20 right-10 w-40 h-40 bg-sky-200 blur-[100px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[340px] z-10"
      >
        <div className="bg-white rounded-[32px] border border-slate-100 p-6 md:p-8 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] relative overflow-hidden">
          
          <div className="text-center mb-6">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl text-white transform -rotate-3"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <Zap size={24} fill="currentColor" />
            </div>
            <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase italic">Partner <span style={{ color: 'var(--color-primary)' }}>Login.</span></h1>
            <p className="text-[7px] font-bold uppercase tracking-[0.3em] text-slate-400 mt-1.5 italic">Sign in to your account</p>
          </div>

          {error && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
              className="mb-4 p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-[8px] font-black uppercase flex items-center gap-2"
            >
              <ShieldCheck size={12} /> {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-[7px] font-black uppercase tracking-widest text-slate-400 ml-2 italic">Email / Phone Number</label>
              <div className="relative">
                <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <input 
                  type="text" required placeholder="example@mail.com"
                  className="w-full h-11 pl-11 pr-4 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none transition-all focus:bg-white focus:ring-4 focus:ring-indigo-50/50"
                  onChange={e => setForm({...form, email: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-[7px] font-black uppercase tracking-widest text-slate-400 ml-2 italic">Login Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <input 
                  type="password" required placeholder="••••••••"
                  className="w-full h-11 pl-11 pr-4 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none transition-all focus:bg-white focus:ring-4 focus:ring-indigo-50/50"
                  onChange={e => setForm({...form, password: e.target.value})}
                />
              </div>
            </div>

            <button 
              disabled={loading}
              type="submit"
              className="w-full h-12 rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all mt-4 disabled:opacity-50 text-white"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <>Login Now <ChevronRight size={14} /></>}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-50 flex flex-col gap-4">
             <div className="grid grid-cols-2 gap-2">
                <button onClick={() => demoLogin('admin')} className="h-9 bg-slate-900 text-white rounded-lg text-[7px] font-black uppercase tracking-widest active:scale-95 shadow-md">Demo Admin</button>
                <button onClick={() => demoLogin('user')} className="h-9 bg-white border border-slate-100 text-slate-500 rounded-lg text-[7px] font-black uppercase tracking-widest active:scale-95">Demo User</button>
             </div>
             <p className="text-center text-[8px] font-bold uppercase tracking-widest text-slate-400 italic">
                No account? <Link to="/register" className="font-black" style={{ color: 'var(--color-primary)' }}>Create One</Link>
             </p>
          </div>
        </div>
      </motion.div>

      <Link to="/" className="mt-8 flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all group">
         <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
         <span className="text-[8px] font-black uppercase tracking-widest">Back to Home</span>
      </Link>
    </div>
  );
};

export default Login;
