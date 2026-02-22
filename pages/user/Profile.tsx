import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, Lock, Camera, 
  ShieldCheck, Save, Loader2, Key,
  ShieldAlert, ChevronRight, CheckCircle2,
  Zap, LogOut, Upload, ImageIcon
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';

const Profile = () => {
  const { user, logout, syncUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [activeTab, setActiveTab] = useState<'info' | 'security'>('info');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || ''
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [passForm, setPassForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) return alert("Registry limit: 2MB.");
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', profileForm.name);
      formData.append('phone', profileForm.phone);
      if (avatarFile) formData.append('image', avatarFile);

      const res = await api.upload('/auth/profile', formData, 'PUT');
      if (res.success) {
        setSuccess("Identity Updated.");
        if (res.user) {
          localStorage.setItem('noor_user', JSON.stringify(res.user));
          syncUser();
        }
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err: any) {
      alert("Sync failed.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) return alert("Mismatch.");
    setLoading(true);
    try {
      await api.put('/auth/password', { oldPassword: passForm.oldPassword, newPassword: passForm.newPassword });
      setSuccess("Security key rotated.");
      setPassForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      alert("Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-4 pb-24 animate-fade-in px-1">
      <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden flex flex-col items-center text-center">
         <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-r from-indigo-50 to-sky-50 opacity-40" />
         
         <div className="relative mb-5 mt-2">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-20 h-20 rounded-[28px] bg-slate-900 border-4 border-white shadow-xl flex items-center justify-center overflow-hidden cursor-pointer group"
            >
               {avatarPreview ? (
                 <img src={avatarPreview} className="w-full h-full object-cover" alt="Avatar" />
               ) : (
                 <span className="text-3xl font-black text-sky-400 italic">{user?.name?.charAt(0)}</span>
               )}
               <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <Camera size={20} />
               </div>
            </div>
            <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-1 -right-1 w-8 h-8 bg-indigo-600 text-white rounded-xl border-4 border-white shadow-md flex items-center justify-center"><Camera size={12} /></button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
         </div>

         <div className="relative z-10">
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-2 uppercase italic">{user?.name}</h1>
            <div className="flex items-center justify-center gap-2 mb-3">
               <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-lg text-[7px] font-black uppercase tracking-widest border border-indigo-100 italic">Tier: {user?.currentPlan || 'BASIC'}</span>
               <span className="px-2 py-0.5 bg-slate-50 text-slate-400 rounded-lg text-[7px] font-black uppercase tracking-widest border border-slate-100">#{user?.id?.slice(-6)}</span>
            </div>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{user?.email}</p>
         </div>
      </div>

      <div className="flex bg-white p-1 rounded-xl border border-slate-100 shadow-sm mx-1">
         <button onClick={() => setActiveTab('info')} className={clsx("flex-1 py-3 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all", activeTab === 'info' ? "bg-slate-950 text-white shadow-md" : "text-slate-400")}>Identity</button>
         <button onClick={() => setActiveTab('security')} className={clsx("flex-1 py-3 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all", activeTab === 'security' ? "bg-slate-950 text-white shadow-md" : "text-slate-400")}>Security</button>
      </div>

      {success && (
        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2 text-emerald-600 mx-1">
           <CheckCircle2 size={14} />
           <p className="text-[8px] font-black uppercase tracking-widest">{success}</p>
        </motion.div>
      )}

      <div className="px-1">
        <AnimatePresence mode="wait">
          {activeTab === 'info' ? (
            <motion.form key="info" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} onSubmit={handleProfileSubmit} className="space-y-3">
              <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm space-y-5">
                 <div className="space-y-1.5">
                    <label className="text-[8px] font-black text-slate-400 uppercase ml-3 italic">Member Name</label>
                    <input type="text" required value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} className="w-full h-11 px-5 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs outline-none focus:bg-white transition-all shadow-inner" />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[8px] font-black text-slate-400 uppercase ml-3 italic">Mobile ID</label>
                    <input type="tel" required value={profileForm.phone} onChange={e => setProfileForm({...profileForm, phone: e.target.value})} className="w-full h-11 px-5 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs outline-none focus:bg-white shadow-inner" />
                 </div>
              </div>
              <button type="submit" disabled={loading} className="w-full h-14 bg-slate-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all">
                {loading ? <Loader2 className="animate-spin" size={16} /> : <><Save size={16} /> Update Identity</>}
              </button>
            </motion.form>
          ) : (
            <motion.form key="security" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} onSubmit={handlePasswordSubmit} className="space-y-3">
              <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm space-y-5">
                 <div className="space-y-1.5">
                    <label className="text-[8px] font-black text-slate-400 uppercase ml-3 italic">Current Security Key</label>
                    <input type="password" required value={passForm.oldPassword} onChange={e => setPassForm({...passForm, oldPassword: e.target.value})} className="w-full h-11 px-5 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs outline-none focus:bg-white shadow-inner" placeholder="••••••••" />
                 </div>
                 <div className="space-y-1.5 pt-2">
                    <label className="text-[8px] font-black text-slate-400 uppercase ml-3 italic">New Secure Node Key</label>
                    <input type="password" required value={passForm.newPassword} onChange={e => setPassForm({...passForm, newPassword: e.target.value})} className="w-full h-11 px-5 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs outline-none focus:bg-white shadow-inner" placeholder="New Password" />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[8px] font-black text-slate-400 uppercase ml-3 italic">Confirm Protocol</label>
                    <input type="password" required value={passForm.confirmPassword} onChange={e => setPassForm({...passForm, confirmPassword: e.target.value})} className="w-full h-11 px-5 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs outline-none focus:bg-white shadow-inner" placeholder="Repeat Password" />
                 </div>
              </div>
              <button type="submit" disabled={loading} className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all">
                {loading ? <Loader2 className="animate-spin" size={16} /> : <><ShieldCheck size={16} /> Rotate Access Keys</>}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      <button onClick={logout} className="w-full h-12 bg-rose-50 text-rose-600 rounded-[22px] border border-rose-100 font-black text-[8px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 active:scale-95 transition-all mt-6">
        <LogOut size={16} /> Sign Out Node
      </button>
    </div>
  );
};

export default Profile;