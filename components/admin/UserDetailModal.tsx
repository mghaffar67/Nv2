
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, User, Wallet, Users, Info, 
  Calendar, Phone, ShieldCheck, Mail,
  TrendingUp, TrendingDown, Edit3, Save,
  Zap, Award, Briefcase, History, Smartphone,
  ShieldAlert, Lock, ArrowRight, CheckCircle2,
  Gem, CreditCard, ExternalLink, LogIn, Trash2
} from 'lucide-react';
import { clsx } from 'clsx';

interface UserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onUpdate: () => void;
}

const UserDetailModal = ({ isOpen, onClose, user, onUpdate }: UserDetailModalProps) => {
  const [tab, setTab] = useState<'overview' | 'finance' | 'activity'>('overview');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', isBanned: false,
    currentPlan: 'None'
  });
  
  const [adjustment, setAdjustment] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        isBanned: !!user.isBanned,
        currentPlan: user.currentPlan || 'None'
      });
    }
  }, [user]);

  const saveToMockDB = (updatedUser: any) => {
    const db = JSON.parse(localStorage.getItem('noor_mock_db') || '[]');
    const index = db.findIndex((u: any) => u.id === user.id);
    if (index !== -1) {
      db[index] = { ...db[index], ...updatedUser };
      localStorage.setItem('noor_mock_db', JSON.stringify(db));
    }
  };

  const handleUpdateUser = async () => {
    setLoading(true);
    setTimeout(() => {
      saveToMockDB(formData);
      setLoading(false);
      onUpdate();
      alert("Partner configuration synchronized.");
    }, 800);
  };

  const handleBalanceAdjust = (type: 'add' | 'deduct') => {
    const amount = Number(adjustment);
    if (isNaN(amount) || amount <= 0) return alert("Enter valid amount");

    const db = JSON.parse(localStorage.getItem('noor_mock_db') || '[]');
    const index = db.findIndex((u: any) => u.id === user.id);
    if (index !== -1) {
      const currentBalance = Number(db[index].balance) || 0;
      db[index].balance = type === 'add' ? currentBalance + amount : Math.max(0, currentBalance - amount);
      
      if (!db[index].transactions) db[index].transactions = [];
      db[index].transactions.unshift({
        id: `ADJ-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        type: type === 'add' ? 'reward' : 'withdraw',
        amount: amount,
        gateway: 'Manual Adjustment',
        status: 'approved',
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString()
      });

      localStorage.setItem('noor_mock_db', JSON.stringify(db));
      setAdjustment('');
      onUpdate();
      alert(`Account ${type === 'add' ? 'Credited' : 'Debited'} successfully.`);
    }
  };

  const handleLoginAsUser = () => {
    localStorage.setItem('noor_token', `impersonate-${user.id}`);
    localStorage.setItem('noor_user', JSON.stringify({ ...user, isImpersonated: true }));
    window.location.href = '#/user/dashboard';
    window.location.reload();
  };

  if (!user) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-2 md:p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
          
          <motion.div 
            initial={{ scale: 0.9, y: 30, opacity: 0 }} 
            animate={{ scale: 1, y: 0, opacity: 1 }} 
            exit={{ scale: 0.9, y: 30, opacity: 0 }} 
            className="relative w-full max-w-2xl bg-white rounded-[40px] md:rounded-[56px] shadow-2xl overflow-hidden border border-white flex flex-col"
          >
            {/* BRANDED HEADER */}
            <div className="bg-slate-950 p-6 md:p-10 text-white relative shrink-0">
              <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-all text-white/40 hover:text-white z-20">
                <X size={20} />
              </button>
              
              <div className="flex items-center gap-6 relative z-10">
                <div className="w-16 h-16 md:w-24 md:h-24 rounded-[28px] md:rounded-[36px] bg-indigo-500 border-4 border-slate-800 flex items-center justify-center text-2xl md:text-4xl font-black text-white shadow-2xl shrink-0 italic">
                  {user.name?.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="px-2.5 py-0.5 bg-white/5 rounded-full text-[8px] font-black uppercase tracking-widest text-slate-500 border border-white/5">
                      NODE-ID: {user.id?.slice(-8)}
                    </span>
                    <span className={clsx(
                      "px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border flex items-center gap-1",
                      formData.isBanned ? "bg-rose-500/20 text-rose-400 border-rose-500/20" : "bg-green-500/20 text-green-400 border-green-500/20"
                    )}>
                      {formData.isBanned ? 'ACCESS DENIED' : 'VERIFIED'}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black tracking-tighter leading-none truncate">{user.name}</h3>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-2 italic flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" /> Authorized Partner Hub
                  </p>
                </div>
              </div>

              {/* TABS */}
              <div className="flex gap-2 mt-8 bg-white/5 p-1 rounded-2xl border border-white/5">
                {[
                  { id: 'overview', icon: User, label: 'BIO' },
                  { id: 'finance', icon: Wallet, label: 'CAPITAL' },
                  { id: 'activity', icon: Users, label: 'NETWORK' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id as any)}
                    className={clsx(
                      "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                      tab === t.id ? "bg-white text-slate-900 shadow-lg" : "text-slate-500 hover:text-white"
                    )}
                  >
                    <t.icon size={12} /> {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* CONTENT AREA */}
            <div className="p-6 md:p-10 overflow-y-auto no-scrollbar bg-[#f8fafc] flex-grow">
              <AnimatePresence mode="wait">
                {tab === 'overview' && (
                  <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                       <div className="p-4 bg-white rounded-3xl border border-slate-100 shadow-sm">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-2"><Mail size={10} /> Email Registry</p>
                          <p className="text-[11px] font-black text-slate-800 truncate">{user.email}</p>
                       </div>
                       <div className="p-4 bg-white rounded-3xl border border-slate-100 shadow-sm">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-2"><Phone size={10} /> Mobile Node</p>
                          <p className="text-[11px] font-black text-slate-800">{user.phone}</p>
                       </div>
                    </div>

                    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-5">
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Full Legal Identity</label>
                          <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-2xl font-black text-xs text-slate-900" />
                       </div>
                       
                       <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Assigned Station (Earning Tier)</label>
                          <select value={formData.currentPlan} onChange={e => setFormData({...formData, currentPlan: e.target.value})} className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-2xl font-black text-xs text-slate-900 appearance-none">
                             <option value="None">Null (Unauthorized)</option>
                             <option value="BASIC">BASIC (Tier 1)</option>
                             <option value="STANDARD">STANDARD (Tier 2)</option>
                             <option value="GOLD ELITE">GOLD ELITE (Tier 3)</option>
                             <option value="DIAMOND">DIAMOND (Tier 4)</option>
                          </select>
                       </div>
                    </div>

                    <div className={clsx("p-6 rounded-[32px] border flex items-center justify-between transition-colors", formData.isBanned ? "bg-rose-50 border-rose-100" : "bg-indigo-50 border-indigo-100")}>
                       <div className="flex items-center gap-4">
                          <div className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center shadow-md", formData.isBanned ? "bg-rose-600 text-white" : "bg-indigo-600 text-white")}>
                             <ShieldAlert size={20} />
                          </div>
                          <div>
                             <p className="text-sm font-black text-slate-900 uppercase leading-none">Global Ban Protocol</p>
                             <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Suspend all financial & task nodes</p>
                          </div>
                       </div>
                       <button onClick={() => setFormData({...formData, isBanned: !formData.isBanned})} className={clsx("w-14 h-7 rounded-full transition-all relative flex items-center px-1", formData.isBanned ? "bg-rose-600" : "bg-slate-300")}>
                         <motion.div animate={{ x: formData.isBanned ? 28 : 0 }} className="w-5 h-5 bg-white rounded-full shadow-sm" />
                       </button>
                    </div>
                  </motion.div>
                )}

                {tab === 'finance' && (
                  <motion.div key="finance" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="bg-slate-900 p-8 rounded-[40px] text-white flex justify-between items-center shadow-xl border border-white/5">
                       <div>
                         <p className="text-sky-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Current Liquidity</p>
                         <h4 className="text-4xl font-black tracking-tight">Rs. {user.balance?.toLocaleString()}</h4>
                       </div>
                       <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-sky-400"><CreditCard size={28} /></div>
                    </div>

                    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
                       <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2"><TrendingUp size={14} className="text-indigo-500" /> Manual Balance Override</h4>
                       <div className="relative">
                          <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-300 italic">Rs</span>
                          <input type="number" placeholder="0.00" value={adjustment} onChange={e => setAdjustment(e.target.value)} className="w-full h-16 pl-14 pr-6 bg-slate-50 border border-slate-100 rounded-3xl font-black text-2xl outline-none focus:ring-4 focus:ring-indigo-50" />
                       </div>
                       <div className="grid grid-cols-2 gap-3">
                          <button onClick={() => handleBalanceAdjust('add')} className="h-12 bg-green-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-green-100 active:scale-95 transition-all">Credit Node</button>
                          <button onClick={() => handleBalanceAdjust('deduct')} className="h-12 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-slate-200 active:scale-95 transition-all">Debit Node</button>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-5 bg-indigo-50 rounded-[32px] border border-indigo-100">
                          <p className="text-[8px] font-black text-indigo-400 uppercase mb-1">Total Payouts</p>
                          <p className="text-xl font-black text-indigo-900">Rs. 12,500</p>
                       </div>
                       <div className="p-5 bg-emerald-50 rounded-[32px] border border-emerald-100">
                          <p className="text-[8px] font-black text-emerald-400 uppercase mb-1">Yield Generated</p>
                          <p className="text-xl font-black text-emerald-900">Rs. 45,800</p>
                       </div>
                    </div>
                  </motion.div>
                )}

                {tab === 'activity' && (
                  <motion.div key="activity" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center text-center">
                          <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center mb-3"><Award size={20} /></div>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Earning Power</p>
                          <p className="text-xs font-black text-slate-800">Lvl 4 Elite</p>
                       </div>
                       <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center text-center">
                          <div className="w-10 h-10 bg-sky-50 text-sky-500 rounded-xl flex items-center justify-center mb-3"><Users size={20} /></div>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Direct Fleet</p>
                          <p className="text-xs font-black text-slate-800">14 Partners</p>
                       </div>
                    </div>

                    <div className="space-y-3">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Terminal Access Logs</p>
                       <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden divide-y divide-slate-50">
                          {[
                            { ip: '39.40.12.188', location: 'Lahore, PK', time: 'Active Now', dev: 'Mobile APP' },
                            { ip: '112.54.12.5', location: 'Karachi, PK', time: '2 hours ago', dev: 'Chrome Desktop' },
                          ].map((log, i) => (
                            <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50">
                               <div className="flex items-center gap-4">
                                  <div className="w-9 h-9 rounded-lg bg-slate-50 text-slate-300 flex items-center justify-center"><Smartphone size={16} /></div>
                                  <div>
                                     <p className="text-[11px] font-black text-slate-800 leading-none">{log.ip}</p>
                                     <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">{log.location} • {log.dev}</p>
                                  </div>
                               </div>
                               <span className={clsx("text-[8px] font-black uppercase", log.time.includes('Now') ? "text-green-500" : "text-slate-300")}>{log.time}</span>
                            </div>
                          ))}
                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ACTION BAR */}
            <div className="p-6 md:p-10 border-t border-slate-100 bg-white shrink-0 flex gap-3">
               <button 
                 onClick={handleUpdateUser}
                 disabled={loading}
                 className="flex-grow h-14 md:h-16 bg-slate-950 text-white rounded-[22px] md:rounded-[28px] font-black text-[10px] md:text-xs uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-2"
               >
                 {loading ? 'SYNCING HUB...' : <><Save size={18} /> COMMIT CONFIG</>}
               </button>
               <button onClick={handleLoginAsUser} className="w-14 md:w-16 h-14 md:h-16 bg-indigo-50 text-indigo-600 rounded-[22px] md:rounded-[28px] flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-sm"><LogIn size={20}/></button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UserDetailModal;
