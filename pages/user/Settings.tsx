import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  LogOut, 
  ShieldCheck, 
  Smartphone,
  CheckCircle2,
  ChevronRight,
  Camera,
  Wallet,
  ShieldAlert,
  Save,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { clsx } from 'clsx';

type TabType = 'profile' | 'payment' | 'security';

const Settings = () => {
  const { user, logout, syncUser } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Form States
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [paymentForm, setPaymentForm] = useState({
    provider: (user as any)?.withdrawalInfo?.provider || 'EasyPaisa',
    accountNumber: (user as any)?.withdrawalInfo?.accountNumber || '',
    accountTitle: (user as any)?.withdrawalInfo?.accountTitle || ''
  });
  const [securityForm, setSecurityForm] = useState({ oldPass: '', newPass: '' });

  const handleUpdate = async (type: TabType) => {
    setLoading(true);
    setSaveStatus(null);
    try {
      if (type === 'profile') {
        const res = await api.put('/auth/profile', { name: profileForm.name, phone: profileForm.phone });
        if (res.success) {
            localStorage.setItem('noor_user', JSON.stringify(res.user));
            syncUser();
        }
      }
      if (type === 'security') {
        await api.put('/auth/password', { oldPassword: securityForm.oldPass, newPassword: securityForm.newPass });
      }
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      setSaveStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const isPaymentSaved = (user as any)?.withdrawalInfo?.accountNumber && (user as any)?.withdrawalInfo?.accountTitle;

  return (
    <div className="max-w-2xl mx-auto px-4 pb-24 space-y-6">
      <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-r from-sky-50 to-indigo-50 opacity-40"></div>
        <div className="relative mb-4 mt-2">
           <div className="w-20 h-20 rounded-full bg-slate-900 border-4 border-white shadow-xl flex items-center justify-center text-2xl font-black text-sky-400">
             {user?.name?.charAt(0) || 'U'}
           </div>
        </div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">{user?.name || 'Partner'}</h2>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Authorized Member</p>
      </div>

      <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm sticky top-20 z-30">
        {[
          { id: 'profile', icon: User, label: 'Profile' },
          { id: 'payment', icon: CreditCard, label: 'Payment' },
          { id: 'security', icon: Lock, label: 'Security' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={clsx(
              "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
              activeTab === tab.id ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <tab.icon size={14} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="min-h-[300px]">
        <AnimatePresence mode="wait">
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
              <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-50">
                <div className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Mail size={18} className="text-slate-300" />
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Primary Email</p>
                      <p className="text-sm font-bold text-slate-800">{user?.email}</p>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Full Legal Name</label>
                   <input 
                     type="text" 
                     value={profileForm.name} 
                     onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                     className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none focus:ring-4 focus:ring-sky-50"
                   />
                </div>
                <div className="p-5">
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Mobile Node</label>
                   <input 
                     type="text" 
                     value={profileForm.phone} 
                     onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                     className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none focus:ring-4 focus:ring-sky-50"
                   />
                </div>
              </div>
              <button 
                onClick={() => handleUpdate('profile')}
                disabled={loading}
                className="w-full h-14 bg-slate-900 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all"
              >
                {loading ? 'Processing...' : 'Save Changes'} <Save size={16} />
              </button>
            </motion.div>
          )}

          {activeTab === 'payment' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
              <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-5">
                <div className="flex items-center justify-between mb-2">
                   <h3 className="text-sm font-black text-slate-800 tracking-tight">Withdrawal Account</h3>
                   {isPaymentSaved && (
                     <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-green-100">
                        <CheckCircle2 size={10} /> Saved
                     </div>
                   )}
                </div>
                <div className="space-y-4">
                   <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Provider</label>
                      <div className="grid grid-cols-2 gap-3">
                        {['EasyPaisa', 'JazzCash'].map(opt => (
                          <button
                            key={opt}
                            onClick={() => setPaymentForm({...paymentForm, provider: opt})}
                            className={clsx(
                              "py-3 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all",
                              paymentForm.provider === opt ? "bg-slate-900 text-white border-slate-900 shadow-lg" : "bg-white text-slate-400 border-slate-50"
                            )}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Title</label>
                      <input 
                        type="text" 
                        placeholder="Ali Ahmed"
                        value={paymentForm.accountTitle}
                        onChange={(e) => setPaymentForm({...paymentForm, accountTitle: e.target.value})}
                        className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Number</label>
                      <input 
                        type="tel" 
                        placeholder="03001234567"
                        value={paymentForm.accountNumber}
                        onChange={(e) => setPaymentForm({...paymentForm, accountNumber: e.target.value})}
                        className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none"
                      />
                   </div>
                </div>
              </div>
              <button 
                onClick={() => handleUpdate('payment')}
                disabled={loading}
                className="w-full h-14 bg-sky-500 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-xl shadow-sky-100 active:scale-95 transition-all"
              >
                {loading ? 'Syncing...' : 'Save Payment Details'} <CheckCircle2 size={16} />
              </button>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
              <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
                 <div className="space-y-4">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Old Password</label>
                       <input 
                         type="password" 
                         placeholder="••••••••"
                         value={securityForm.oldPass}
                         onChange={(e) => setSecurityForm({...securityForm, oldPass: e.target.value})}
                         className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">New Secure Password</label>
                       <input 
                         type="password" 
                         placeholder="••••••••"
                         value={securityForm.newPass}
                         onChange={(e) => setSecurityForm({...securityForm, newPass: e.target.value})}
                         className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-sm outline-none"
                       />
                    </div>
                 </div>
              </div>
              <button 
                onClick={() => handleUpdate('security')}
                disabled={loading}
                className="w-full h-14 bg-slate-900 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all"
              >
                {loading ? 'Updating...' : 'Update Password'} <ShieldCheck size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button 
        onClick={logout}
        className="w-full h-14 bg-rose-50 text-rose-600 rounded-[28px] border border-rose-100 font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 active:scale-95 transition-all mt-4"
      >
        <LogOut size={18} /> End Session
      </button>
    </div>
  );
};

export default Settings;