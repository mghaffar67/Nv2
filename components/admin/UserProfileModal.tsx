import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, User, Wallet, Users, Info, 
  Calendar, Phone, ShieldCheck, Mail,
  TrendingUp, TrendingDown, Edit3, Save,
  Zap, Award, Briefcase, RefreshCw
} from 'lucide-react';
import { clsx } from 'clsx';
import { api } from '../../utils/api';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onUpdate: () => void;
}

const UserProfileModal = ({ isOpen, onClose, user, onUpdate }: UserProfileModalProps) => {
  const [tab, setTab] = useState<'overview' | 'finance' | 'activity'>('overview');
  const [isEditingBalance, setIsEditingBalance] = useState(false);
  const [balanceAmount, setBalanceAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEditBalance = async (action: 'add' | 'deduct') => {
    if (!balanceAmount || isNaN(Number(balanceAmount))) return;
    setLoading(true);
    try {
      await api.put('/admin/users/balance', { 
        userId: user.id, 
        amount: balanceAmount, 
        action 
      });
      setIsEditingBalance(false);
      setBalanceAmount('');
      onUpdate();
    } catch (err: any) {
      alert(err.message || "Balance adjustment failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" />
          
          <motion.div 
            initial={{ scale: 0.9, y: 20, opacity: 0 }} 
            animate={{ scale: 1, y: 0, opacity: 1 }} 
            exit={{ scale: 0.9, y: 20, opacity: 0 }} 
            className="relative w-full max-w-2xl bg-white rounded-[44px] shadow-2xl overflow-hidden border border-white"
          >
            {/* Header */}
            <div className="bg-slate-900 p-8 text-white relative">
              <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-all text-white/40 hover:text-white">
                <X size={20} />
              </button>
              
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-[28px] bg-sky-500 border-4 border-slate-800 flex items-center justify-center text-3xl font-black text-white shadow-xl">
                  {user.name?.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tight">{user.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="px-3 py-1 bg-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-sky-400">
                      ID: {user.id}
                    </span>
                    <span className={clsx(
                      "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                      !user.isBanned ? "bg-green-500/20 text-green-400" : "bg-rose-500/20 text-rose-400"
                    )}>
                      {!user.isBanned ? 'Active' : 'Suspended'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tab Nav */}
              <div className="flex gap-4 mt-8 bg-white/5 p-1.5 rounded-2xl border border-white/5">
                {[
                  { id: 'overview', icon: User, label: 'Bio' },
                  { id: 'finance', icon: Wallet, label: 'Wallet' },
                  { id: 'activity', icon: Users, label: 'Network' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id as any)}
                    className={clsx(
                      "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                      tab === t.id ? "bg-white text-slate-900 shadow-xl" : "text-white/40 hover:text-white"
                    )}
                  >
                    <t.icon size={14} /> {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-8 min-h-[350px]">
              <AnimatePresence mode="wait">
                {tab === 'overview' && (
                  <motion.div key="overview" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                             <Mail size={12} /> Contact Email
                          </p>
                          <p className="text-sm font-black text-slate-800">{user.email}</p>
                       </div>
                       <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                             <Phone size={12} /> Mobile ID
                          </p>
                          <p className="text-sm font-black text-slate-800">{user.phone}</p>
                       </div>
                       <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                             <Zap size={12} /> Active Plan
                          </p>
                          <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{user.currentPlan || 'No Active Plan'}</p>
                       </div>
                       <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                             <Calendar size={12} /> Created
                          </p>
                          <p className="text-sm font-black text-slate-800">{new Date(user.createdAt).toLocaleDateString()}</p>
                       </div>
                    </div>
                  </motion.div>
                )}

                {tab === 'finance' && (
                  <motion.div key="finance" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <div className="bg-slate-900 p-8 rounded-[36px] text-white flex justify-between items-center shadow-xl">
                       <div>
                         <p className="text-sky-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Wallet Liquidity</p>
                         <h4 className="text-4xl font-black tracking-tight leading-none">Rs. {(user.balance || 0).toLocaleString()}</h4>
                       </div>
                       <button onClick={() => setIsEditingBalance(true)} className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-sky-400 hover:bg-white hover:text-slate-900 transition-all">
                          <Edit3 size={20} />
                       </button>
                    </div>

                    {isEditingBalance && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                         <div className="flex items-center gap-3">
                            <input 
                              type="number" 
                              placeholder="Enter PKR Amount"
                              value={balanceAmount}
                              onChange={(e) => setBalanceAmount(e.target.value)}
                              className="flex-grow h-12 px-4 bg-white border border-slate-100 rounded-xl font-black text-sm outline-none"
                            />
                         </div>
                         <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => handleEditBalance('add')} disabled={loading} className="h-11 bg-green-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                               {loading ? <RefreshCw className="animate-spin" size={14}/> : <><TrendingUp size={14} /> Add Funds</>}
                            </button>
                            <button onClick={() => handleEditBalance('deduct')} disabled={loading} className="h-11 bg-rose-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                               {loading ? <RefreshCw className="animate-spin" size={14}/> : <><TrendingDown size={14} /> Deduct</>}
                            </button>
                         </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {tab === 'activity' && (
                  <motion.div key="activity" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <div className="bg-sky-50 p-6 rounded-3xl border border-sky-100 flex items-center justify-between">
                       <div className="flex items-center gap-4">
                         <div className="p-3 bg-sky-500 text-white rounded-2xl"><Users size={20} /></div>
                         <div>
                            <h4 className="text-sm font-black text-sky-900">Referral Code</h4>
                            <p className="text-[10px] font-bold text-sky-600 uppercase">{user.referralCode}</p>
                         </div>
                       </div>
                    </div>
                    <div className="space-y-3">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Engagement Metrics</p>
                       <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-100">
                          <div className="flex items-center gap-3">
                             <Briefcase size={16} className="text-slate-300" />
                             <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight">Work Submissions</span>
                          </div>
                          <span className="text-[10px] font-black text-indigo-600">{(user.workSubmissions || []).length}</span>
                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Actions */}
            <div className="p-8 pt-0 flex gap-4">
               <button onClick={onClose} className="flex-1 h-14 bg-slate-900 text-white rounded-[24px] font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-2">
                 Close Profile
               </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UserProfileModal;