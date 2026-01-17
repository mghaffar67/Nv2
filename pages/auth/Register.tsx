
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, ChevronRight, Zap, ShieldCheck, Users, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Register = () => {
  const { register } = useAuth();
  const { config: theme } = useTheme();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', referralCode: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.phone, form.password, form.referralCode);
      navigate('/user/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registry creation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--bg-base)' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div 
          className="rounded-[40px] border p-8 shadow-2xl relative overflow-hidden"
          style={{ backgroundColor: 'var(--card-base)', borderColor: 'rgba(var(--primary-rgb), 0.1)' }}
        >
          {/* Brand Mark */}
          <div className="text-center mb-8">
            <div 
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest mb-4"
              style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}
            >
              <Zap size={10} fill="currentColor" /> Noor Official V3
            </div>
            <h1 className="text-2xl font-black tracking-tight" style={{ color: 'var(--text-base)' }}>Create Identity</h1>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Access Global Earning Nodes</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-[10px] font-black uppercase flex items-center gap-3">
              <ShieldCheck size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
              <input 
                type="text" required placeholder="Full Name"
                className="w-full h-12 pl-12 pr-4 bg-slate-50/50 border rounded-2xl text-sm font-bold outline-none transition-all"
                style={{ borderColor: 'rgba(0,0,0,0.05)', color: 'var(--text-base)' }}
                onChange={e => setForm({...form, name: e.target.value})}
              />
            </div>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
              <input 
                type="email" required placeholder="Email Address"
                className="w-full h-12 pl-12 pr-4 bg-slate-50/50 border rounded-2xl text-sm font-bold outline-none transition-all"
                style={{ borderColor: 'rgba(0,0,0,0.05)', color: 'var(--text-base)' }}
                onChange={e => setForm({...form, email: e.target.value})}
              />
            </div>
            <div className="relative">
              <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
              <input 
                type="tel" required placeholder="Mobile Number"
                className="w-full h-12 pl-12 pr-4 bg-slate-50/50 border rounded-2xl text-sm font-bold outline-none transition-all"
                style={{ borderColor: 'rgba(0,0,0,0.05)', color: 'var(--text-base)' }}
                onChange={e => setForm({...form, phone: e.target.value})}
              />
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
              <input 
                type="password" required placeholder="Secure Password"
                className="w-full h-12 pl-12 pr-4 bg-slate-50/50 border rounded-2xl text-sm font-bold outline-none transition-all"
                style={{ borderColor: 'rgba(0,0,0,0.05)', color: 'var(--text-base)' }}
                onChange={e => setForm({...form, password: e.target.value})}
              />
            </div>
            <div className="relative">
              <Users size={16} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" />
              <input 
                type="text" placeholder="Invite Code (Optional)"
                className="w-full h-12 pl-12 pr-4 bg-slate-50/50 border rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none transition-all"
                style={{ borderColor: 'rgba(0,0,0,0.05)', color: 'var(--text-base)' }}
                onChange={e => setForm({...form, referralCode: e.target.value})}
              />
            </div>

            <button 
              disabled={loading}
              type="submit"
              className="w-full h-14 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
              style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <>Register Account <ChevronRight size={16} /></>}
            </button>
          </form>

          <p className="mt-8 text-center text-[10px] font-bold uppercase tracking-widest opacity-40">
            Already registered? <Link to="/login" className="font-black" style={{ color: 'var(--color-primary)' }}>Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
