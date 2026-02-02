import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Plus, Trash2, Save, Zap, Users, 
  RefreshCw, X, Edit3, Search, UserMinus, UserPlus, Loader2, BadgeCheck
} from 'lucide-react';
import { api } from '../../utils/api';
import { dbNode } from '../../backend_core/utils/db';
import { clsx } from 'clsx';

const RewardManager = () => {
  const [rewards, setRewards] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'targets' | 'tracking'>('targets');
  const [showForm, setShowForm] = useState(false);
  const [selectedReward, setSelectedReward] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '', description: '', type: 'referral_count', targetValue: 5, rewardAmount: 50, isActive: true
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [listRes, statsRes] = await Promise.all([
        api.get('/rewards/admin/list'),
        api.get('/rewards/admin/stats')
      ]);
      setRewards(listRes || []);
      setStats(statsRes);
      setUsers(dbNode.getUsers().filter((u: any) => u.role === 'user'));
    } catch (e) { } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAction = async (userId: string, rewardId: string, action: 'award' | 'revoke') => {
    setProcessingId(`${userId}-${rewardId}`);
    try {
      const endpoint = action === 'award' ? '/rewards/admin/award-manual' : '/rewards/admin/revoke-manual';
      await api.post(endpoint, { userId, rewardId });
      fetchData();
    } catch (e: any) { 
      alert(e.message); 
    } finally { 
      setProcessingId(null); 
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/rewards/admin/save', { ...formData, id: selectedReward?.id });
      setShowForm(false);
      fetchData();
    } catch (e: any) { alert(e.message); }
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-24 animate-fade-in max-w-7xl mx-auto px-1.5">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2 pt-4">
         <div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Inam <span className="text-indigo-600">Hub.</span></h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px] mt-3 italic flex items-center gap-2">
               <Trophy size={14} className="text-amber-500" /> Reward Architecture & Member Tracking
            </p>
         </div>
         <div className="flex gap-2">
           <button onClick={fetchData} className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 active:rotate-180 transition-all shadow-sm"><RefreshCw size={24}/></button>
           <button onClick={() => { setSelectedReward(null); setShowForm(true); }} className="h-14 px-10 bg-slate-950 text-white rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl flex items-center gap-3 active:scale-95">
              <Plus size={20} className="text-sky-400" /> Naya Target
           </button>
         </div>
      </header>

      <div className="flex bg-white p-1.5 rounded-[28px] border border-slate-100 shadow-sm w-fit gap-1 mx-1">
         <button onClick={() => setActiveTab('targets')} className={clsx("px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all", activeTab === 'targets' ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:text-slate-900")}>Target List</button>
         <button onClick={() => setActiveTab('tracking')} className={clsx("px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all", activeTab === 'tracking' ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:text-slate-900")}>Member Progress</button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'targets' ? (
          <motion.div key="targets" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-1">
             {rewards.map(r => (
               <div key={r.id} className="bg-white p-6 rounded-[44px] border border-slate-100 shadow-sm group hover:border-indigo-200 transition-all flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                     <div className={clsx("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all", r.isActive ? "bg-slate-950" : "bg-slate-200")}>
                        <Zap size={28}/>
                     </div>
                     <div className="text-right">
                        <p className="text-xl font-black text-emerald-600 italic">Rs {r.rewardAmount}</p>
                        <span className="text-[8px] font-black uppercase text-slate-400 italic">Inam PKR</span>
                     </div>
                  </div>
                  <h4 className="text-[13px] font-black text-slate-900 uppercase italic mb-1">{r.title}</h4>
                  <p className="text-[10px] font-bold text-slate-400 leading-relaxed italic mb-6">"{r.description}"</p>
                  <div className="mt-auto pt-4 border-t border-slate-50 flex justify-between items-center">
                     <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full text-[8px] font-black uppercase text-slate-400 border border-slate-100">
                        Target: {r.targetValue}
                     </div>
                     <button onClick={() => { setSelectedReward(r); setFormData({...r}); setShowForm(true); }} className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-indigo-600 transition-all shadow-sm"><Edit3 size={16}/></button>
                  </div>
               </div>
             ))}
          </motion.div>
        ) : (
          <motion.div key="tracking" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 mx-1">
             <div className="bg-white p-4 rounded-[32px] border border-slate-100 shadow-sm">
                <div className="relative">
                   <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                   <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-[11px] outline-none focus:bg-white" placeholder="Member name ya mobile se search karein..." />
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.phone.includes(searchTerm)).map(u => (
                  <div key={u.id} className="bg-white p-6 rounded-[44px] border border-slate-100 shadow-sm group">
                     <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-slate-950 text-sky-400 flex items-center justify-center font-black italic shadow-lg text-lg border border-white/10">{u.name.charAt(0)}</div>
                        <div className="overflow-hidden">
                           <h4 className="text-[12px] font-black text-slate-900 uppercase truncate">{u.name}</h4>
                           <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{u.phone}</p>
                        </div>
                     </div>
                     
                     <div className="space-y-3">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 italic">Eligibility Audit & Actions</p>
                        {rewards.map(r => {
                           const isClaimed = (u.claimedRewards || []).includes(r.id);
                           const isProcessing = processingId === `${u.id}-${r.id}`;
                           
                           return (
                             <div key={r.id} className="p-4 bg-slate-50 rounded-[24px] border border-slate-100 flex items-center justify-between group-hover:bg-white transition-all">
                                <div>
                                   <p className="text-[10px] font-black text-slate-700 uppercase tracking-tight truncate max-w-[120px]">{r.title}</p>
                                   <p className="text-[8px] font-bold text-emerald-600 uppercase italic">Inam: Rs {r.rewardAmount}</p>
                                </div>
                                <div className="flex gap-2">
                                  {isClaimed ? (
                                    <button 
                                      onClick={() => handleAction(u.id, r.id, 'revoke')}
                                      disabled={isProcessing}
                                      className="px-4 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-[7px] font-black uppercase border border-rose-100 hover:bg-rose-600 hover:text-white transition-all flex items-center gap-1"
                                    >
                                      {isProcessing ? <Loader2 size={10} className="animate-spin"/> : <UserMinus size={10} />} Revoke
                                    </button>
                                  ) : (
                                    <button 
                                      onClick={() => handleAction(u.id, r.id, 'award')}
                                      disabled={isProcessing}
                                      className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[7px] font-black uppercase border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-1"
                                    >
                                      {isProcessing ? <Loader2 size={10} className="animate-spin"/> : <UserPlus size={10} />} Award Inam
                                    </button>
                                  )}
                                </div>
                             </div>
                           );
                        })}
                     </div>
                  </div>
                ))}
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-3">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowForm(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
             <motion.form 
                initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onSubmit={handleSave} className="relative w-full max-w-xl bg-white rounded-[44px] shadow-2xl overflow-hidden border border-white"
             >
                <div className="bg-slate-950 p-8 text-white shrink-0">
                   <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-black uppercase italic">{selectedReward ? 'Edit Inam' : 'Naya Inam Target'}</h3>
                      <button type="button" onClick={() => setShowForm(false)} className="p-2 bg-white/5 rounded-full text-white/40"><X size={20}/></button>
                   </div>
                </div>

                <div className="p-8 space-y-6">
                   <div className="space-y-4">
                      <div className="space-y-1.5">
                         <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Inam Ka Naam</label>
                         <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-[22px] font-black text-sm outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50" />
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Detail (Description)</label>
                         <input required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-[22px] font-bold text-xs" />
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                         <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Shart (Type)</label>
                         <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-[22px] font-black text-[10px] uppercase outline-none">
                            <option value="referral_count">Total Referrals</option>
                            <option value="task_count">Assignments Completed</option>
                            <option value="deposit_total">Total Wallet Deposit</option>
                         </select>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                         <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Target (Value)</label>
                            <input type="number" required value={formData.targetValue} onChange={e => setFormData({...formData, targetValue: Number(e.target.value)})} className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-[22px] font-black text-sm outline-none" />
                         </div>
                         <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Inam (PKR)</label>
                            <input type="number" required value={formData.rewardAmount} onChange={e => setFormData({...formData, rewardAmount: Number(e.target.value)})} className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-[22px] font-black text-sm text-emerald-600 outline-none" />
                         </div>
                      </div>
                   </div>
                </div>

                <div className="p-8 bg-white border-t border-slate-50">
                   <button type="submit" className="w-full h-16 bg-slate-950 text-white rounded-[28px] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3">
                      <BadgeCheck size={20} className="text-sky-400" /> Deploy Target Node
                   </button>
                </div>
             </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RewardManager;