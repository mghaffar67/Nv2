import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserPlus, ShieldCheck, Mail, Phone, Trash2, X, RefreshCw, UserCog, BadgeCheck, ShieldAlert, Loader2, Crown, Shield } from 'lucide-react';
import { api } from '../../../utils/api';
import { clsx } from 'clsx';

const TeamManagement = () => {
  const [team, setTeam] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', role: 'manager' });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const staff = await api.get('/admin/staff');
      setTeam(staff || []);
    } catch (e) {
      console.error("Staff Registry Offline.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTeam(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Direct update to localRegistry in this mock build
      const db = JSON.parse(localStorage.getItem('noor_v3_users') || '[]');
      const newStaff = {
         id: `STF-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
         ...formData,
         balance: 0,
         createdAt: new Date().toISOString()
      };
      db.push(newStaff);
      localStorage.setItem('noor_v3_users', JSON.stringify(db));
      
      setShowAdd(false);
      setFormData({ name: '', email: '', phone: '', password: '', role: 'manager' });
      fetchTeam();
      alert("Associate Integrated into Staff Registry.");
    } catch (err: any) {
      alert("Registration failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteStaff = async (id: string) => {
    const member = team.find(m => m.id === id);
    if (member?.email === 'admin@noor.com') return alert("Root Admin access cannot be revoked!");
    if (!window.confirm("Remove this staff associate from the system hub?")) return;
    
    try {
      const db = JSON.parse(localStorage.getItem('noor_v3_users') || '[]');
      const updated = db.filter((u: any) => u.id !== id);
      localStorage.setItem('noor_v3_users', JSON.stringify(updated));
      fetchTeam();
    } catch (e: any) {
      alert("Termination Node Failure.");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-50 pb-8">
          <div>
             <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none mb-2">Staff <span className="text-indigo-600">Identity.</span></h2>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 italic">
                <ShieldAlert size={14} className="text-indigo-600" /> Manage Managers & Administrative Associate Nodes
             </p>
          </div>
          <button onClick={() => setShowAdd(true)} className="h-14 px-10 bg-slate-950 text-white rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-3 shadow-2xl active:scale-95 transition-all">
             <UserPlus size={20} className="text-sky-400" /> Initialize Staff
          </button>
       </div>

       {loading ? (
         <div className="py-24 text-center flex flex-col items-center gap-4 opacity-30">
            <RefreshCw className="animate-spin text-indigo-500" size={44}/>
            <p className="text-[10px] font-black uppercase tracking-widest">Querying Identity Hub...</p>
         </div>
       ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map(member => (
              <div key={member.id} className="bg-white p-6 rounded-[40px] border border-slate-100 shadow-sm flex flex-col group hover:border-indigo-100 transition-all relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-6 opacity-[0.02] rotate-12 scale-150"><ShieldCheck size={100} /></div>
                 
                 <div className="flex items-center justify-between mb-8 relative z-10">
                    <div className={clsx(
                       "w-14 h-14 rounded-[22px] flex items-center justify-center text-white shadow-lg transition-transform group-hover:rotate-6",
                       member.role === 'admin' ? "bg-slate-950" : "bg-indigo-600"
                    )}>
                       {member.role === 'admin' ? <Crown size={28} /> : <Shield size={28} />}
                    </div>
                    <div className="text-right">
                       <span className={clsx(
                         "px-3 py-1 rounded-lg text-[7px] font-black uppercase tracking-widest border shadow-inner",
                         member.role === 'admin' ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-sky-50 text-sky-600 border-sky-100"
                       )}>{member.role} NODE</span>
                       <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-2">ID: {member.id?.slice(-6)}</p>
                    </div>
                 </div>
                 
                 <div className="space-y-4 mb-8 relative z-10">
                    <h4 className="text-lg font-black text-slate-900 uppercase italic leading-none truncate">{member.name}</h4>
                    <div className="space-y-2">
                       <div className="flex items-center gap-2.5 text-[9px] font-black text-slate-400 uppercase tracking-widest truncate"><Mail size={12} className="text-indigo-500" /> {member.email}</div>
                       <div className="flex items-center gap-2.5 text-[9px] font-black text-slate-400 uppercase tracking-widest"><Phone size={12} className="text-indigo-500" /> {member.phone}</div>
                    </div>
                 </div>

                 <div className="flex gap-2 pt-6 border-t border-slate-50 mt-auto relative z-10">
                    <button className="flex-1 h-11 bg-slate-50 text-slate-400 rounded-xl font-black text-[8px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-2 active:scale-95"><UserCog size={14}/> Audit</button>
                    {member.email !== 'admin@noor.com' && (
                      <button onClick={() => deleteStaff(member.id)} className="w-11 h-11 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-90"><Trash2 size={18}/></button>
                    )}
                 </div>
              </div>
            ))}
         </div>
       )}

       <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-3">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAdd(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
             <motion.form 
               initial={{ scale: 0.9, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
               onSubmit={handleAdd} className="relative w-full max-w-lg bg-white rounded-[56px] p-8 md:p-12 shadow-2xl space-y-10 border border-white"
             >
                <div className="flex justify-between items-center">
                   <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">Initialize Node.</h3>
                   <button type="button" onClick={() => setShowAdd(false)} className="p-3 bg-slate-50 rounded-full hover:bg-rose-50 transition-all"><X size={24}/></button>
                </div>
                
                <div className="space-y-6">
                   <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-6 italic">Associate Name</label>
                      <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full h-14 px-7 bg-slate-50 border border-slate-100 rounded-[28px] font-black text-sm text-slate-900 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50/50 shadow-inner" placeholder="Full Name" />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                         <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-6">Registry Email</label>
                         <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-[28px] font-bold text-xs" />
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-6">Identity ID (Phone)</label>
                         <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-[28px] font-bold text-xs" />
                      </div>
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-6 italic">Authority Level</label>
                      <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full h-14 px-7 bg-slate-50 border border-slate-100 rounded-[28px] font-black text-[10px] uppercase outline-none focus:bg-white appearance-none cursor-pointer">
                         <option value="manager">Manager Node (Audit & Support)</option>
                         <option value="admin">Admin Node (Master Architecture)</option>
                      </select>
                   </div>
                </div>

                <div className="pt-4">
                   <button type="submit" disabled={submitting} className="w-full h-18 bg-slate-950 text-white rounded-[32px] font-black text-[12px] uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4">
                      {submitting ? <Loader2 size={24} className="animate-spin" /> : <><BadgeCheck size={24} className="text-sky-400" /> Deploy to Staff Cluster</>}
                   </button>
                </div>
             </motion.form>
          </div>
        )}
       </AnimatePresence>
    </div>
  );
};

export default TeamManagement;