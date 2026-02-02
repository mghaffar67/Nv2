
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, User, Wallet, Users, Mail, Phone, ShieldCheck, 
  TrendingUp, TrendingDown, Edit3, Save, RefreshCw,
  Award, History, Smartphone, ShieldAlert, LogIn, 
  Trash2, Eye, Network, CreditCard, ChevronRight
} from 'lucide-react';
import { clsx } from 'clsx';
import { adminController } from '../../backend_core/controllers/adminController';

interface UserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onUpdate: () => void;
}

const UserDetailModal = ({ isOpen, onClose, user, onUpdate }: UserDetailModalProps) => {
  const [activeTab, setActiveTab] = useState<'identity' | 'statement' | 'network'>('identity');
  const [loading, setLoading] = useState(false);
  const [adjustment, setAdjustment] = useState('');
  
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', isBanned: false,
    currentPlan: 'None'
  });

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        isBanned: !!user.isBanned,
        currentPlan: user.currentPlan || 'None'
      });
      setActiveTab('identity');
    }
  }, [user, isOpen]);

  const handleUpdateUser = async () => {
    setLoading(true);
    // Simulate API update
    const db = JSON.parse(localStorage.getItem('noor_v3_master_registry') || '[]');
    const index = db.findIndex((u: any) => u.id === user.id);
    if (index !== -1) {
      db[index] = { ...db[index], ...formData };
      localStorage.setItem('noor_v3_master_registry', JSON.stringify(db));
    }
    setTimeout(() => {
      setLoading(false);
      onUpdate();
      onClose();
    }, 600);
  };

  const handleBalanceAdjust = async (type: 'add' | 'deduct') => {
    if (!adjustment || Number(adjustment) <= 0) return alert("Please enter a valid amount.");
    setLoading(true);
    try {
      await adminController.editUserBalance({
        body: { userId: user.id, amount: adjustment, action: type }
      }, { status: () => ({ json: () => {} }) });
      setAdjustment('');
      onUpdate();
      alert("Account balance adjusted successfully.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginAsUser = () => {
    if (!window.confirm(`Switch to ${user.name}'s account? You will need to login again as admin to return.`)) return;
    const { password: _, ...safeUser } = user;
    localStorage.setItem('noor_user', JSON.stringify(safeUser));
    localStorage.setItem('noor_token', `jwt-noor-${user.id}-${Date.now()}`);
    window.location.href = '/#/user/dashboard';
    window.location.reload();
  };

  if (!user) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-2 md:p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
          
          <motion.div 
            initial={{ scale: 0.95, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, y: 30, opacity: 0 }} 
            className="relative w-full max-w-xl bg-white rounded-[40px] shadow-2xl overflow-hidden border border-white flex flex-col h-[85vh] md:h-auto md:max-h-[90vh]"
          >
            {/* Header Section */}
            <div className="bg-slate-950 p-6 md:p-10 text-white shrink-0 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12 scale-150"><Users size={120} /></div>
              <div className="flex items-center justify-between mb-8 relative z-10">
                 <h3 className="text-xl font-black uppercase italic tracking-tight">Partner Profile</h3>
                 <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-rose-500 transition-all"><X size={20} /></button>
              </div>
              <div className="flex items-center gap-6 relative z-10">
                <div className="w-20 h-20 rounded-[30px] bg-indigo-500 border-2 border-slate-800 flex items-center justify-center text-4xl font-black italic shadow-xl shrink-0">{user.name?.charAt(0)}</div>
                <div className="overflow-hidden">
                  <h4 className="text-2xl font-black tracking-tight truncate mb-1">{user.name}</h4>
                  <div className="flex items-center gap-2">
                     <span className="px-3 py-1 bg-sky-500/20 text-sky-400 rounded-full text-[9px] font-black uppercase tracking-widest border border-sky-500/30">ID: {user.id?.slice(-8)}</span>
                     <span className={clsx("px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border", formData.isBanned ? "bg-rose-500/20 text-rose-400 border-rose-500/30" : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30")}>
                        {formData.isBanned ? "Suspended" : "Verified Node"}
                     </span>
                  </div>
                </div>
              </div>

              {/* Enhanced Tab Navigation */}
              <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5 mt-10">
                 {[
                   { id: 'identity', icon: User, label: 'Identity' },
                   { id: 'statement', icon: CreditCard, label: 'Wallet' },
                   { id: 'network', icon: Network, label: 'Team' }
                 ].map(t => (
                   <button 
                     key={t.id} onClick={() => setActiveTab(t.id as any)}
                     className={clsx(
                       "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                       activeTab === t.id ? "bg-white text-slate-900 shadow-xl" : "text-white/40 hover:text-white"
                     )}
                   >
                     <t.icon size={15} /> <span className="hidden sm:inline">{t.label}</span>
                   </button>
                 ))}
              </div>
            </div>

            <div className="p-6 md:p-10 overflow-y-auto no-scrollbar space-y-8 flex-grow bg-[#fcfdfe]">
               <AnimatePresence mode="wait">
                  {activeTab === 'identity' && (
                    <motion.div key="identity" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                       <div className="grid grid-cols-1 gap-5">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Partner Name</label>
                             <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full h-14 px-6 bg-white border border-slate-200 rounded-[24px] font-black text-slate-900 outline-none focus:ring-4 focus:ring-indigo-50/50" />
                          </div>
                          <div className="grid grid-cols-2 gap-5">
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Mobile ID</label>
                                <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full h-14 px-6 bg-white border border-slate-200 rounded-[24px] font-bold text-sm outline-none" />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Station Type</label>
                                <select value={formData.currentPlan} onChange={e => setFormData({...formData, currentPlan: e.target.value})} className="w-full h-14 px-5 bg-white border border-slate-200 rounded-[24px] font-black text-[10px] uppercase outline-none">
                                   <option value="None">No Active Plan</option>
                                   <option value="BASIC">BASIC STATION</option>
                                   <option value="STANDARD">STANDARD STATION</option>
                                   <option value="GOLD ELITE">GOLD ELITE HUB</option>
                                   <option value="DIAMOND">DIAMOND TERMINAL</option>
                                </select>
                             </div>
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Email Identity (Locked)</label>
                             <input value={formData.email} readOnly className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-[24px] font-bold text-xs text-slate-400 outline-none" />
                          </div>
                       </div>
                    </motion.div>
                  )}

                  {activeTab === 'statement' && (
                    <motion.div key="statement" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                       <div className="bg-slate-900 p-8 rounded-[44px] text-white flex justify-between items-center shadow-xl relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12 scale-150"><CreditCard size={80}/></div>
                          <div className="relative z-10">
                             <p className="text-sky-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2 italic">ACCOUNT LIQUIDITY</p>
                             <h4 className="text-4xl font-black tracking-tighter leading-none italic">Rs. {(user.balance || 0).toLocaleString()}</h4>
                          </div>
                          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner"><Wallet size={24} className="text-emerald-400" /></div>
                       </div>

                       <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 italic text-center">Manual Fund Adjustment</p>
                          <div className="flex items-center gap-3">
                             <input 
                               type="number" placeholder="Enter PKR Amount" value={adjustment} 
                               onChange={e => setAdjustment(e.target.value)} 
                               className="flex-1 h-14 px-7 bg-slate-50 border border-slate-200 rounded-[24px] font-black text-lg outline-none focus:bg-white transition-all shadow-inner" 
                             />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                             <button onClick={() => handleBalanceAdjust('add')} className="h-14 bg-emerald-500 text-white rounded-[24px] font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all"><TrendingUp size={18}/> Credit</button>
                             <button onClick={() => handleBalanceAdjust('deduct')} className="h-14 bg-rose-500 text-white rounded-[24px] font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all"><TrendingDown size={18}/> Debit</button>
                          </div>
                       </div>
                    </motion.div>
                  )}

                  {activeTab === 'network' && (
                    <motion.div key="network" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                       <div className="grid grid-cols-2 gap-5">
                          <div className="p-8 bg-indigo-50 border border-indigo-100 rounded-[40px] text-center shadow-inner">
                             <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-2 italic">Total Directs</p>
                             <h4 className="text-4xl font-black text-indigo-600 italic leading-none">15</h4>
                          </div>
                          <div className="p-8 bg-emerald-50 border border-emerald-100 rounded-[40px] text-center shadow-inner">
                             <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-2 italic">Commissions</p>
                             <h4 className="text-4xl font-black text-emerald-600 italic leading-none">Rs 8.2k</h4>
                          </div>
                       </div>
                       <div className="bg-white p-8 rounded-[40px] border border-slate-100 space-y-4">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 italic">Identity Referrer Token</p>
                          <div className="p-5 bg-slate-50 rounded-[28px] flex items-center justify-between border border-slate-100 group">
                             <div>
                                <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Referral Code</p>
                                <p className="text-lg font-black text-indigo-600 tracking-tighter">{user.referralCode || 'NO-TOKEN'}</p>
                             </div>
                             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md text-slate-300 group-hover:text-indigo-600 transition-colors"><Network size={24}/></div>
                          </div>
                       </div>
                    </motion.div>
                  )}
               </AnimatePresence>

               {/* Probe & Account Control Action */}
               <div className="pt-4 space-y-4 border-t border-slate-50">
                  <div className={clsx("p-6 rounded-[32px] border flex items-center justify-between transition-all", formData.isBanned ? "bg-rose-50 border-rose-100" : "bg-indigo-50 border-indigo-100 shadow-inner")}>
                     <div className="flex items-center gap-4">
                        <ShieldAlert size={24} className={formData.isBanned ? "text-rose-500" : "text-indigo-500"} />
                        <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Account Status: {formData.isBanned ? "SUSPENDED" : "ACTIVE"}</span>
                     </div>
                     <button onClick={() => setFormData({...formData, isBanned: !formData.isBanned})} className={clsx("w-14 h-7 rounded-full relative flex items-center px-1 transition-all", formData.isBanned ? "bg-rose-600" : "bg-slate-300")}>
                        <motion.div animate={{ x: formData.isBanned ? 28 : 0 }} className="w-5 h-5 bg-white rounded-full shadow-md" />
                     </button>
                  </div>

                  <button 
                    onClick={handleLoginAsUser}
                    className="w-full h-16 bg-white border-2 border-slate-100 hover:border-indigo-600 text-slate-400 hover:text-indigo-600 rounded-[32px] font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-95 group shadow-sm"
                  >
                    <Eye size={22} className="group-hover:animate-pulse" /> Login as {user.name} (Secure Probe)
                  </button>
               </div>
            </div>

            <div className="p-6 md:p-10 bg-white border-t border-slate-100 flex gap-4 shrink-0">
               <button onClick={handleUpdateUser} disabled={loading} className="flex-1 h-16 bg-slate-950 text-white rounded-[32px] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-all">
                  {loading ? <RefreshCw className="animate-spin" size={24}/> : <><ShieldCheck size={26} className="text-sky-400" /> Save Config</>}
               </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UserDetailModal;
