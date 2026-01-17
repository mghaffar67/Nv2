
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ChevronRight, Zap, ShieldCheck, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Login = () => {
  const { login } = useAuth();
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
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--bg-base)' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm"
      >
        <div 
          className="rounded-[40px] border p-8 md:p-10 shadow-2xl relative overflow-hidden"
          style={{ backgroundColor: 'var(--card-base)', borderColor: 'rgba(0,0,0,0.05)' }}
        >
          {/* Brand Mark */}
          <div className="text-center mb-10">
            <div 
              className="w-16 h-16 rounded-[22px] flex items-center justify-center mx-auto mb-6 shadow-2xl"
              style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}
            >
              <Zap size={32} fill="currentColor" />
            </div>
            <h1 className="text-2xl font-black tracking-tight" style={{ color: 'var(--text-base)' }}>Partner Login</h1>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mt-1">Authorized Access Only</p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-[10px] font-black uppercase flex items-center gap-3">
              <ShieldCheck size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-widest opacity-30 ml-3">Email or Phone</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" />
                <input 
                  type="text" required placeholder="member@noor.com"
                  className="w-full h-12 pl-12 pr-4 bg-slate-50/50 border border-transparent rounded-2xl text-sm font-bold outline-none transition-all focus:bg-white"
                  style={{ color: 'var(--text-base)', borderColor: 'rgba(0,0,0,0.03)' }}
                  onChange={e => setForm({...form, email: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-widest opacity-30 ml-3">Secure Key</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20" />
                <input 
                  type="password" required placeholder="••••••••"
                  className="w-full h-12 pl-12 pr-4 bg-slate-50/50 border border-transparent rounded-2xl text-sm font-bold outline-none transition-all focus:bg-white"
                  style={{ color: 'var(--text-base)', borderColor: 'rgba(0,0,0,0.03)' }}
                  onChange={e => setForm({...form, password: e.target.value})}
                />
              </div>
            </div>

            <button 
              disabled={loading}
              type="submit"
              className="w-full h-14 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all mt-6 disabled:opacity-50"
              style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <>Enter Portal <ChevronRight size={16} /></>}
            </button>
          </form>

          <p className="mt-10 text-center text-[10px] font-bold uppercase tracking-widest opacity-40">
            No account yet? <Link to="/register" className="font-black underline underline-offset-4" style={{ color: 'var(--color-primary)' }}>Register ID</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
