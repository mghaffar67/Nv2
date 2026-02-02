import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Plus, Trash2, Save, Zap, Users, 
  RefreshCw, X, Edit3, Search, UserMinus, UserPlus, Loader2, BadgeCheck,
  TrendingUp, Target, ShieldCheck
} from 'lucide-react';
import { api } from '../../utils/api';
import { dbNode } from '../../backend_core/utils/db';
import { clsx } from 'clsx';

const RewardManager = () => {
  const [rewards, setRewards] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedReward, setSelectedReward] = useState<any>(null);
  const [saveLoading, setSaveLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '', 
    description: '', 
    type: 'task_count', // referral_count | task_count | streak_days | withdraw_total
    targetValue: 10, 
    rewardAmount: 50, 
    isActive: true
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
    } catch (e) { } finally { setLoading(false); }
  };

  useEffect(() => { 
    // Seed initial test data if registry is empty
    const current = dbNode.getRewards();
    if (current.length === 0) {
      const seeds = [
        { id: 'REW-TEST-1', title: '10 Tasks Complete', description: 'Complete 10 assignments successfully.', type: 'task_count', targetValue: 10, rewardAmount: 50, isActive: true },
        { id: 'REW-TEST-2', title: 'Network Growth', description: 'Refer 2 new verified members.', type: 'referral_count', targetValue: 2, rewardAmount: 150, isActive: true },
        { id: 'REW-TEST-3', title: 'Consistency King', description: 'Maintain a daily claim streak for 10 days.', type: 'streak_days', targetValue: 10, rewardAmount: 20, isActive: true },
        { id: 'REW-TEST-4', title: 'High Volume Partner', description: 'Process Rs. 1000 in successful withdrawals.', type: 'withdraw_total', targetValue: 1000, rewardAmount: 120, isActive: true }
      ];
      dbNode.saveRewards(seeds);
    }
    fetchData(); 
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      await api.post('/rewards/admin/save', { ...formData, id: selectedReward?.id });
      setShowForm(false);
      fetchData();
    } catch (e: any) { alert(e.message); } finally { setSaveLoading(false); }
  };

  const deleteReward = async (id: string) => {
    if (!window.confirm("Remove this reward node permanently?")) return;
    try {
      await api.handleRequest('DELETE', `/rewards/admin/${id}`);
      fetchData();
    } catch (e) {}
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto px-4 font-sans">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-4">
         <div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Inam <span className="text-indigo-600">Hub.</span></h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px] mt-3 italic flex items-center gap-2">
               <Trophy size={14} className="text-amber-500" /> Reward Engine Architecture & Control
            </p>
         </div>
         <div className="flex gap-2">
           <button onClick={fetchData} className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 active:rotate-180 transition-all shadow-sm active:scale-90"><RefreshCw size={24}/></button>
           <button onClick={() => { setSelectedReward(null); setFormData({title: '', description: '', type: 'task_count', targetValue: 10, rewardAmount: 50, isActive: true}); setShowForm(true); }} className="h-14 px-10 bg-slate-950 text-white rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl flex items-center gap-3 active:scale-95 transition-all">
              <Plus size={20} className="text-sky-400" /> New Reward
           </button>
         </div>
      </header>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex items-center gap-6">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner"><Target size={28}/></div>
            <div>
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Targets</p>
               <p className="text-2xl font-black text-slate-900">{stats?.totalActiveRewards || 0}</p>
            </div>
         </div>
         <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex items-center gap-6">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner"><BadgeCheck size={28}/></div>
            <div>
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Verified Claims</p>
               <p className="text-2xl font-black text-slate-900">{stats?.totalClaims || 0}</p>
            </div>
         </div>
         <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex items-center gap-6">
            <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center shadow-inner"><TrendingUp size={28}/></div>
            <div>
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Inam Disbursed</p>
               <p className="text-2xl font-black text-slate-900">Rs {stats?.totalBudgetSpent?.toLocaleString() || 0}</p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {loading ? (
            <div className="col-span-full py-32 text-center flex flex-col items-center gap-4">
               <RefreshCw size={44} className="animate-spin text-slate-200" />
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Synchronizing Reward Pool...</p>
            </div>
         ) : rewards.map(r => (
           <motion.div 
             key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
             className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col relative overflow-hidden group"
           >
              {!r.isActive && <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center font-black text-slate-400 uppercase tracking-widest text-xs italic">Hibernated</div>}
              
              <div className="flex justify-between items-start mb-8">
                 <div className="w-16 h-16 rounded-3xl bg-slate-950 text-sky-400 flex items-center justify-center shadow-xl group-hover:rotate-6 transition-transform">
                    <Zap size={32} fill="currentColor" />
                 </div>
                 <div className="text-right">
                    <p className="text-2xl font-black text-emerald-600 italic leading-none">Rs {r.rewardAmount}</p>
                    <span className="text-[8px] font-black uppercase text-slate-400 mt-2 block tracking-tighter">Instant Yield Node</span>
                 </div>
              </div>

              <h4 className="text-lg font-black text-slate-900 uppercase italic mb-2 truncate">{r.title}</h4>
              <p className="text-[11px] font-medium text-slate-400 leading-relaxed mb-8 italic">"{r.description}"</p>

              <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                 <div className="px-4 py-1.5 bg-slate-50 rounded-full border border-slate-100 text-[9px] font-black uppercase text-slate-500">
                    {r.type.replace('_', ' ')}: {r.targetValue}
                 </div>
                 <div className="flex gap-2">
                    <button onClick={() => { setSelectedReward(r); setFormData({...r}); setShowForm(true); }} className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all active:scale-90"><Edit3 size={18}/></button>
                    <button onClick={() => deleteReward(r.id)} className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all active:scale-90"><Trash2 size={18}/></button>
                 </div>
              </div>
           </motion.div>
         ))}
      </div>

      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowForm(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
             <motion.form 
                initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
                onSubmit={handleSave} className="relative w-full max-w-lg bg-white rounded-[56px] p-10 shadow-2xl space-y-8 border border-white max-h-[90vh] overflow-y-auto no-scrollbar"
             >
                <div className="flex justify-between items-center border-b border-slate-50 pb-8">
                   <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Reward Node.</h3>
                   <button type="button" onClick={() => setShowForm(false)} className="p-3 bg-slate-50 rounded-full hover:bg-rose-50 hover:text-rose-500 transition-all"><X size={28}/></button>
                </div>

                <div className="space-y-6">
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6 italic">Inam Headline</label>
                      <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full h-14 px-7 bg-slate-50 border border-slate-100 rounded-[28px] font-black text-sm text-slate-900 outline-none focus:bg-white transition-all shadow-inner" placeholder="e.g. 10 Tasks Mastery" />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6 italic">Protocol Description</label>
                      <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[28px] font-medium text-xs text-slate-600 outline-none resize-none" rows={2} placeholder="Explain how to unlock..." />
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6 italic">Target Matrix</label>
                         <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-[28px] font-black text-[10px] uppercase outline-none cursor-pointer">
                            <option value="task_count">Total Assignments Completed</option>
                            <option value="referral_count">Direct Referrals Joined</option>
                            <option value="streak_days">Consistency Days (Streak)</option>
                            <option value="withdraw_total">Withdrawal Volume (PKR)</option>
                         </select>
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6 italic">Target Goal Value</label>
                         <input required type="number" value={formData.targetValue} onChange={e => setFormData({...formData, targetValue: Number(e.target.value)})} className="w-full h-14 px-7 bg-slate-50 border border-slate-100 rounded-[28px] font-black text-lg outline-none" />
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6 italic">Inam Amount (PKR)</label>
                         <input required type="number" value={formData.rewardAmount} onChange={e => setFormData({...formData, rewardAmount: Number(e.target.value)})} className="w-full h-14 px-7 bg-slate-50 border border-slate-100 rounded-[28px] font-black text-lg text-emerald-600 outline-none" />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-[28px] border border-slate-100 mt-4">
                         <span className="text-[10px] font-black text-slate-400 uppercase ml-2">Live Node</span>
                         <button type="button" onClick={() => setFormData({...formData, isActive: !formData.isActive})} className={clsx("w-12 h-6 rounded-full relative transition-all flex items-center px-1 shadow-inner", formData.isActive ? "bg-emerald-500" : "bg-slate-300")}>
                            <motion.div animate={{ x: formData.isActive ? 24 : 0 }} className="w-4 h-4 bg-white rounded-full shadow-sm" />
                         </button>
                      </div>
                   </div>
                </div>

                <div className="pt-6">
                   <button type="submit" disabled={saveLoading} className="w-full h-18 bg-slate-950 text-white rounded-[32px] font-black text-[12px] uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50">
                      {saveLoading ? <Loader2 className="animate-spin" size={24}/> : <><ShieldCheck size={24} className="text-sky-400" /> Synchronize Reward</>}
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