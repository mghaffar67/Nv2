
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, Lock, Camera, 
  ShieldCheck, Save, Loader2, Key,
  ShieldAlert, ChevronRight, CheckCircle2,
  Zap, LogOut
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';

const Profile = () => {
  const { user, logout } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [activeTab, setActiveTab] = useState<'info' | 'security'>('info');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Profile Form
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || ''
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // Password Form
  const [passForm, setPassForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    
    try {
      const formData = new FormData();
      formData.append('name', profileForm.name);
      formData.append('phone', profileForm.phone);
      if (avatarFile) formData.append('image', avatarFile);

      await api.upload('/auth/profile', formData, 'PUT');
      setSuccess("Account protocols updated successfully.");
      setTimeout(() => setSuccess(null), 3000);
      
      // Force soft refresh of session data
      window.location.reload();
    } catch (err: any) {
      alert(err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) {
      return alert("Security Conflict: New passwords do not match.");
    }

    setLoading(true);
    setSuccess(null);
    try {
      await api.put('/auth/password', {
        oldPassword: passForm.oldPassword,
        newPassword: passForm.newPassword
      });
      setSuccess("Security key changed successfully.");
      setPassForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      alert(err.message || "Password change rejected.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24 animate-fade-in px-1">
      
      {/* 1. IDENTITY HEADER */}
      <div className="bg-white p-8 rounded-[44px] border border-slate-100 shadow-sm relative overflow-hidden flex flex-col items-center text-center">
         <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-indigo-50 to-sky-50 opacity-40" />
         
         <div className="relative mb-6 mt-4">
            <div 
              onClick={handleAvatarClick}
              className="w-28 h-28 rounded-[40px] bg-slate-900 border-4 border-white shadow-2xl flex items-center justify-center overflow-hidden cursor-pointer group"
            >
               {avatarPreview || user?.avatar ? (
                 <img src={avatarPreview || (user?.avatar as string)} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
               ) : (
                 <span className="text-4xl font-black text-sky-400 italic">{user?.name?.charAt(0)}</span>
               )}
               <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera size={24} className="text-white" />
               </div>
            </div>
            <button 
              onClick={handleAvatarClick}
              className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-600 text-white rounded-2xl border-4 border-white shadow-lg flex items-center justify-center active:scale-90 transition-all"
            >
               <Camera size={16} />
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
         </div>

         <div className="relative z-10">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-2 uppercase italic">{user?.name}</h1>
            <div className="flex items-center justify-center gap-2 mb-4">
               <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[8px] font-black uppercase tracking-widest border border-indigo-100">
                  Tier: {user?.currentPlan || 'BASIC'}
               </span>
               <span className="px-3 py-1 bg-slate-50 text-slate-400 rounded-full text-[8px] font-black uppercase tracking-widest border border-slate-100">
                  ID: {user?.id?.slice(-8)}
               </span>
            </div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">{user?.email}</p>
         </div>
      </div>

      {/* 2. TAB CONTROL */}
      <div className="flex bg-white p-1.5 rounded-[24px] border border-slate-100 shadow-sm mx-1">
         <button 
           onClick={() => setActiveTab('info')}
           className={clsx(
             "flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
             activeTab === 'info' ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:text-slate-900"
           )}
         >
           <User size={14} /> Profile Information
         </button>
         <button 
           onClick={() => setActiveTab('security')}
           className={clsx(
             "flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
             activeTab === 'security' ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:text-slate-900"
           )}
         >
           <Lock size={14} /> Security Protocols
         </button>
      </div>

      {/* 3. SUCCESS ALERT */}
      <AnimatePresence>
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-600 mx-1 shadow-sm"
          >
             <CheckCircle2 size={18} />
             <p className="text-[10px] font-black uppercase tracking-widest">{success}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. FORM CONTENT */}
      <div className="px-1">
        <AnimatePresence mode="wait">
          {activeTab === 'info' ? (
            <motion.form 
              key="info" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
              onSubmit={handleProfileSubmit} className="space-y-4"
            >
              <div className="bg-white p-6 md:p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Full Identity Name</label>
                    <div className="relative">
                       <User size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
                       <input 
                         type="text" required value={profileForm.name}
                         onChange={e => setProfileForm({...profileForm, name: e.target.value})}
                         className="w-full h-14 pl-14 pr-6 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all"
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Registered Mobile Node</label>
                    <div className="relative">
                       <Phone size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
                       <input 
                         type="tel" required value={profileForm.phone}
                         onChange={e => setProfileForm({...profileForm, phone: e.target.value})}
                         className="w-full h-14 pl-14 pr-6 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all"
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Email (Unchangeable)</label>
                    <div className="relative opacity-60">
                       <Mail size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
                       <input 
                         type="email" disabled value={user?.email}
                         className="w-full h-14 pl-14 pr-6 bg-slate-100 border border-slate-100 rounded-2xl font-bold text-sm outline-none cursor-not-allowed"
                       />
                    </div>
                 </div>
              </div>

              <button 
                type="submit" disabled={loading}
                className="w-full h-16 bg-slate-900 text-white rounded-[28px] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <><Save size={18} /> Commit Changes</>}
              </button>
            </motion.form>
          ) : (
            <motion.form 
              key="security" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
              onSubmit={handlePasswordSubmit} className="space-y-4"
            >
              <div className="bg-white p-6 md:p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Current Security Key</label>
                    <div className="relative">
                       <Key size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
                       <input 
                         type="password" required value={passForm.oldPassword}
                         onChange={e => setPassForm({...passForm, oldPassword: e.target.value})}
                         className="w-full h-14 pl-14 pr-6 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none focus:bg-white"
                         placeholder="Enter current password"
                       />
                    </div>
                 </div>

                 <div className="space-y-2 pt-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">New Access Key</label>
                    <div className="relative">
                       <Lock size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
                       <input 
                         type="password" required value={passForm.newPassword}
                         onChange={e => setPassForm({...passForm, newPassword: e.target.value})}
                         className="w-full h-14 pl-14 pr-6 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none focus:bg-white"
                         placeholder="Min 6 characters"
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Confirm New Key</label>
                    <div className="relative">
                       <ShieldCheck size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
                       <input 
                         type="password" required value={passForm.confirmPassword}
                         onChange={e => setPassForm({...passForm, confirmPassword: e.target.value})}
                         className="w-full h-14 pl-14 pr-6 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none focus:bg-white"
                         placeholder="Repeat new password"
                       />
                    </div>
                 </div>
              </div>

              <div className="bg-amber-50 p-6 rounded-[32px] border border-amber-100 flex items-start gap-4">
                 <ShieldAlert size={24} className="text-amber-500 shrink-0 mt-0.5" />
                 <p className="text-[10px] font-bold text-amber-800 leading-relaxed uppercase tracking-wider italic">
                   Security Node Alert: Changing your password will not end other active sessions. If you suspect compromise, please contact WhatsApp support.
                 </p>
              </div>

              <button 
                type="submit" disabled={loading}
                className="w-full h-16 bg-slate-900 text-white rounded-[28px] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <><ShieldCheck size={18} /> Update Key Node</>}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* 5. DANGER ZONE */}
      <div className="pt-8 px-1">
         <button 
           onClick={logout}
           className="w-full h-14 bg-rose-50 text-rose-600 rounded-[24px] border border-rose-100 font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 active:scale-95 transition-all"
         >
            <LogOut size={18} /> Terminate Current Session
         </button>
      </div>
    </div>
  );
};

export default Profile;
