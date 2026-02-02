
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, User, Wallet, Users, Info, 
  Calendar, Phone, ShieldCheck, Mail,
  TrendingUp, TrendingDown, Edit3, Save,
  Zap, Award, Briefcase, History, Smartphone,
  ShieldAlert, Lock, ArrowRight, CheckCircle2,
  Gem, CreditCard, ExternalLink, LogIn, Trash2,
  UserCog
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
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', isBanned: false,
    currentPlan: 'None'
  });
  
  const [adjustment, setAdjustment] = useState('');

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        isBanned: !!user.isBanned,
        currentPlan: user.currentPlan || 'None'
      });
      setIsEditing(true); // Edit button shows up immediately on open
    }
  }, [user, isOpen]);

  const handleUpdateUser = async () => {
    setLoading(true);
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
    if (!adjustment || Number(adjustment) <= 0) return alert("Enter amount");
    setLoading(true);
    try {
      await adminController.editUserBalance({
        body: { userId: user.id, amount: adjustment, action: type, reason: "Admin adjustment" }
      }, { status: () => ({ json: () => {} }) });
      setAdjustment('');
      onUpdate();
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-2">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
          
          <motion.div 
            initial={{ scale: 0.9, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 30, opacity: 0 }} 
            className="relative w-full max-w-lg bg-white rounded-[44px] shadow-2xl overflow-hidden border border-white flex flex-col h-[80vh]"
          >
            <div className="bg-slate-950 p-6 text-white shrink-0">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-xl font-black uppercase italic tracking-tight">Profile Manager</h3>
                 <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20"><X size={18} /></button>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500 border-2 border-slate-800 flex items-center justify-center text-xl font-black italic">{user.name?.charAt(0)}</div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-500">Member Registry</p>
                  <h4 className="text-lg font-black tracking-tight">{user.name}</h4>
                </div>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-grow bg-[#f8fafc]">
               <div className="grid grid-cols-1 gap-4">
                  <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                     <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                        <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs" />
                     </div>
                     <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                        <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs" />
                     </div>
                     <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Station Plan</label>
                        <select value={formData.currentPlan} onChange={e => setFormData({...formData, currentPlan: e.target.value})} className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl font-black text-[10px] uppercase">
                           <option value="None">None</option>
                           <option value="BASIC">BASIC</option>
                           <option value="STANDARD">STANDARD</option>
                           <option value="GOLD ELITE">GOLD ELITE</option>
                           <option value="DIAMOND">DIAMOND</option>
                        </select>
                     </div>
                  </div>

                  <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 italic">Wallet Control</p>
                     <div className="flex items-center gap-2">
                        <input type="number" placeholder="Enter amount" value={adjustment} onChange={e => setAdjustment(e.target.value)} className="flex-1 h-11 px-4 bg-slate-50 rounded-xl font-bold text-xs border border-slate-200 outline-none" />
                        <button onClick={() => handleBalanceAdjust('add')} className="h-11 px-4 bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase">Add</button>
                        <button onClick={() => handleBalanceAdjust('deduct')} className="h-11 px-4 bg-rose-500 text-white rounded-xl font-black text-[10px] uppercase">Cut</button>
                     </div>
                  </div>

                  <div className={clsx("p-4 rounded-3xl border flex items-center justify-between transition-all", formData.isBanned ? "bg-rose-50 border-rose-100" : "bg-indigo-50 border-indigo-100")}>
                     <span className="text-[10px] font-black text-slate-900 uppercase">Account Status: {formData.isBanned ? "BANNED" : "ACTIVE"}</span>
                     <button onClick={() => setFormData({...formData, isBanned: !formData.isBanned})} className={clsx("w-12 h-6 rounded-full relative flex items-center px-1", formData.isBanned ? "bg-rose-600" : "bg-slate-300")}>
                        <motion.div animate={{ x: formData.isBanned ? 24 : 0 }} className="w-4 h-4 bg-white rounded-full shadow-sm" />
                     </button>
                  </div>
               </div>
            </div>

            <div className="p-6 bg-white border-t border-slate-100 flex gap-3">
               <button onClick={handleUpdateUser} disabled={loading} className="flex-1 h-14 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-2">
                  {loading ? 'SAVING...' : <><ShieldCheck size={18} className="text-sky-400" /> APPLY CHANGES</>}
               </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UserDetailModal;
