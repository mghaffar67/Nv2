
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserPlus, ShieldCheck, Mail, Phone, Trash2, X, RefreshCw, BadgeCheck, ShieldAlert, UserCog } from 'lucide-react';
import { api } from '../../../utils/api';
import { clsx } from 'clsx';

const TeamManagement = () => {
  const [team, setTeam] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', role: 'manager' });
  const [loading, setLoading] = useState(false);

  const fetchTeam = async () => {
    setLoading(true);
    try {
        const allUsers = await api.get('/admin/users');
        const staff = allUsers.filter((u: any) => u.role === 'admin' || u.role === 'manager');
        setTeam(staff);
    } catch (e) {
        console.error("Staff sync failed.");
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => { fetchTeam(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        await api.post('/auth/register', { ...formData, referralCode: 'STAFF' });
        setShowAdd(false);
        setFormData({ name: '', email: '', phone: '', password: '', role: 'manager' });
        fetchTeam();
        alert("Associate Integrated into Staff Registry.");
    } catch (e: any) {
        alert(e.message);
    }
  };

  const deleteStaff = async (id: string) => {
    const member = team.find(m => m.id === id);
    if (member?.email === 'admin@noor.com') return alert("Root Admin access cannot be revoked!");
    if (!window.confirm("Remove this staff associate?")) return;
    try {
        await api.delete(`/admin/users/${id}`);
        fetchTeam();
    } catch (e) {
        alert("Removal failed.");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-50 pb-8">
          <div>
             <h2 className="text-3xl font-black text-slate-900 uppercase italic leading-none">Identity <span className="text-indigo-600">Nodes.</span></h2>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-3 flex items-center gap-2 italic">
                <ShieldAlert size={14} className="text-indigo-600" /> Internal Staff, Managers & Regional Admins
             </p>
          </div>
          <button onClick={() => setShowAdd(true)} className="h-14 px-10 bg-slate-950 text-white rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-3 shadow-2xl active:scale-95 transition-all">
             <UserPlus size={20} className="text-sky-400" /> Register Associate
          </button>
       </div>

       {loading ? (
         <div className="py-20 text-center"><RefreshCw className="animate-spin mx-auto text-indigo-500" size={44}/></div>
       ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map(member => (
              <div key={member.id} className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-sm flex flex-col group hover:border-indigo-100 transition-all">
                 <div className="flex items-center justify-between mb-8">
                    <div className={clsx("w-16 h-16 rounded-[24px] flex items-center justify-center text-white shadow-xl transform group-hover:rotate-6 transition-all", member.role === 'admin' ? "bg-slate-950" : "bg-indigo-600")}>
                       <ShieldCheck size={28} />
                    </div>
                    <div className="text-right">
                       <span className={clsx("px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border shadow-inner", member.role === 'admin' ? "bg-sky-50 text-sky-600 border-sky-100" : "bg-indigo-50 text-indigo-600 border-indigo-100")}>{member.role.toUpperCase()} LEVEL</span>
                       <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-3 italic">Node ID: {member.id}</p>
                    </div>
                 </div>
                 
                 <div className="space-y-4 mb-10">
                    <h4 className="text-xl font-black text-slate-900 uppercase italic leading-none">{member.name}</h4>
                    <div className="space-y-3 pt-2">
                       <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest"><Mail size={14} className="text-indigo-500" /> {member.email}</div>
                       <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest"><Phone size={14} className="text-indigo-500" /> {member.phone}</div>
                    </div>
                 </div>

                 <div className="flex gap-2 pt-8 border-t border-slate-50 mt-auto">
                    <button className="flex-1 h-12 bg-slate-50 text-slate-400 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-2"><UserCog size={16}/> Profile</button>
                    {member.email !== 'admin@noor.com' && (
                      <button onClick={() => deleteStaff(member.id)} className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-90"><Trash2 size={20}/></button>
                    )}
                 </div>
              </div>
            ))}
         </div>
       )}

       <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAdd(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
             <motion.form 
               initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
               onSubmit={handleAdd} className="relative w-full max-w-lg bg-white rounded-[56px] p-12 shadow-2xl space-y-8 border border-white"
             >
                <div className="flex justify-between items-center border-b border-slate-50 pb-8">
                   <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Initialize Node.</h3>
                   <button type="button" onClick={() => setShowAdd(false)} className="p-3 bg-slate-50 rounded-full hover:bg-rose-50 hover:text-rose-500 transition-all"><X size={28}/></button>
                </div>
                <div className="space-y-5">
                   <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full h-14 px-7 bg-slate-50 border border-slate-100 rounded-[28px] font-black text-sm" placeholder="Staff Name" />
                   <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full h-14 px-7 bg-slate-50 border border-slate-100 rounded-[28px] font-bold text-xs" placeholder="Staff Email" />
                   <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full h-14 px-7 bg-slate-50 border border-slate-100 rounded-[28px] font-bold text-xs" placeholder="Access Key" />
                   <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full h-14 px-7 bg-slate-50 border border-slate-100 rounded-[28px] font-black text-[10px] uppercase">
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                   </select>
                </div>
                <button type="submit" className="w-full h-18 bg-slate-950 text-white rounded-[32px] font-black text-[12px] uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4">
                   <BadgeCheck size={24} className="text-sky-400" /> Deploy Associate
                </button>
             </motion.form>
          </div>
        )}
       </AnimatePresence>
    </div>
  );
};

export default TeamManagement;
