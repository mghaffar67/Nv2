
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Plus, Trash2, Save, Zap, Star, Users, 
  Briefcase, RefreshCw, CheckCircle2, ShieldCheck, 
  X, Edit3, PieChart, Wallet, Target, ChevronRight,
  TrendingUp, ArrowUpRight, Loader2, Search
} from 'lucide-react';
import { api } from '../../utils/api';
import { clsx } from 'clsx';

const MiniStat = ({ label, value, icon: Icon, color }: any) => (
  <div className="bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-4 group hover:border-indigo-200 transition-all">
    <div className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform", color)}>
       <Icon size={22} />
    </div>
    <div>
       <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{label}</p>
       <h4 className="text-xl font-black text-slate-900 tracking-tighter leading-none italic">{value}</h4>
    </div>
  </div>
);

const RewardManager = () => {
  const [rewards, setRewards] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedReward, setSelectedReward] = useState<any>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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
    } catch (e) { 
      console.error("Reward Sync failed.");
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleEdit = (reward: any) => {
    setSelectedReward(reward);
    setFormData({
      title: reward.title,
      description: reward.description,
      type: reward.type,
      targetValue: reward.targetValue,
      rewardAmount: reward.rewardAmount,
      isActive: reward.isActive
    });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      await api.post('/rewards/admin/save', { 
        ...formData, 
        id: selectedReward?.id 
      });
      setShowForm(false);
      setSelectedReward(null);
      setFormData({ title: '', description: '', type: 'referral_count', targetValue: 5, rewardAmount: 50, isActive: true });
      fetchData();
    } catch (e: any) { 
      alert(e.message); 
    } finally {
      setSaveLoading(false);
    }
  };

  const deleteReward = async (id: string) => {
    if (!window.confirm("Delete this bonus target permanently?")) return;
    try {
      await api.handleRequest('DELETE', `/rewards/admin/${id}`);
      fetchData();
    } catch (e) { }
  };

  const filteredRewards = useMemo(() => {
    return rewards.filter(r => r.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [rewards, searchTerm]);

  return (
    <div className="space-y-6 md:space-y-8 pb-24 animate-fade-in max-w-7xl mx-auto px-1.5">
      {/* Dynamic Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2 pt-4">
         <div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Reward <span className="text-indigo-600">Engine.</span></h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px] mt-3 italic flex items-center gap-2">
               <Trophy size={14} className="text-amber-500" /> Advanced Gamification & Incentive Logic
            </p>
         </div>
         <button 
           onClick={() => { setSelectedReward(null); setFormData({ title: '', description: '', type: 'referral_count', targetValue: 5, rewardAmount: 50, isActive: true }); setShowForm(true); }} 
           className="h-14 px-10 bg-slate-950 text-white rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl flex items-center gap-3 active:scale-95 transition-all"
         >
           <Plus size={20} className="text-sky-400" /> New Reward Node
         </button>
      </header>

      {/* 1. TOP STATS DASHBOARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-1">
         <MiniStat label="Active Targets" value={stats?.totalActiveRewards || 0} icon={Target} color="bg-indigo-50 text-indigo-600" />
         <MiniStat label="Total Claims" value={stats?.totalClaims || 0} icon={Zap} color="bg-emerald-50 text-emerald-600" />
         <MiniStat label="Distributed Capital" value={`Rs. ${stats?.totalBudgetSpent?.toLocaleString() || 0}`} icon={Wallet} color="bg-amber-50 text-amber-600" />
      </div>

      {/* 2. MAIN DATA GRID */}
      <div className="bg-white rounded-[44px] border border-slate-100 shadow-sm overflow-hidden p-2">
         <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
            <h3 className="text-sm font-black text-slate-900 uppercase italic tracking-widest">Incentive Registry</h3>
            <div className="relative w-full md:w-72">
               <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
               <input 
                 type="text" placeholder="Search by Title..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                 className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold outline-none focus:bg-white transition-all"
               />
            </div>
         </div>

         <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left">
               <thead>
                  <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                     <th className="px-8 py-6">Reward Detail</th>
                     <th className="px-8 py-6">Condition Type</th>
                     <th className="px-8 py-6">Audit Value</th>
                     <th className="px-8 py-6">Engagement</th>
                     <th className="px-8 py-6 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr><td colSpan={5} className="py-24 text-center"><RefreshCw className="animate-spin mx-auto text-indigo-400" size={32}/><p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-4">Syncing Nodes...</p></td></tr>
                  ) : filteredRewards.map(reward => (
                    <tr key={reward.id} className="group hover:bg-slate-50/50 transition-all">
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                             <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center shadow-sm", reward.isActive ? "bg-indigo-50 text-indigo-600" : "bg-slate-100 text-slate-400")}>
                                {reward.type === 'referral_count' ? <Users size={18}/> : reward.type === 'task_count' ? <Briefcase size={18}/> : <Star size={18}/>}
                             </div>
                             <div>
                                <h4 className="text-[11px] font-black text-slate-800 uppercase italic truncate max-w-[180px] leading-none mb-1.5">{reward.title}</h4>
                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter truncate max-w-[180px]">{reward.description}</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[8px] font-black uppercase tracking-widest border border-slate-200">
                             {reward.type?.replace('_', ' ')}
                          </span>
                       </td>
                       <td className="px-8 py-6">
                          <p className="text-sm font-black text-emerald-600 italic leading-none">Rs {reward.rewardAmount}</p>
                          <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">Target: {reward.targetValue}</p>
                       </td>
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                             <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (reward.timesClaimed || 0))}%` }} className="h-full bg-indigo-500" />
                             </div>
                             <span className="text-[9px] font-black text-slate-900">{reward.timesClaimed || 0} Claims</span>
                          </div>
                       </td>
                       <td className="px-8 py-6 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                             <button onClick={() => handleEdit(reward)} className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-indigo-600 transition-all shadow-sm"><Edit3 size={14}/></button>
                             <button onClick={() => deleteReward(reward.id)} className="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"><Trash2 size={14}/></button>
                          </div>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {/* Editor Modal */}
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
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl"><Trophy size={24}/></div>
                         <div>
                            <h3 className="text-xl font-black uppercase italic tracking-tight">{selectedReward ? 'Edit Target Node' : 'Initialize Reward'}</h3>
                            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">Incentive Architecture Terminal</p>
                         </div>
                      </div>
                      <button type="button" onClick={() => setShowForm(false)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-white/40"><X size={20}/></button>
                   </div>
                </div>

                <div className="p-8 md:p-10 space-y-6 max-h-[60vh] overflow-y-auto no-scrollbar">
                   <div className="space-y-4">
                      <div className="space-y-1.5">
                         <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Achievement Title</label>
                         <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-[22px] font-black text-sm outline-none focus:bg-white" placeholder="e.g. Master Referral Node" />
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Public Description</label>
                         <input required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-[22px] font-bold text-xs outline-none focus:bg-white" placeholder="Visible to users in Reward Hub" />
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                         <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Target Condition</label>
                         <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-[22px] font-black text-[10px] uppercase outline-none focus:bg-white appearance-none">
                            <option value="referral_count">Network Members Count</option>
                            <option value="task_count">Completed Assignments</option>
                            <option value="plan_buy">Station Activation</option>
                         </select>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                         <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Goal Qty</label>
                            <input type="number" required value={formData.targetValue} onChange={e => setFormData({...formData, targetValue: Number(e.target.value)})} className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-[22px] font-black text-sm outline-none focus:bg-white" />
                         </div>
                         <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Bonus (PKR)</label>
                            <input type="number" required value={formData.rewardAmount} onChange={e => setFormData({...formData, rewardAmount: Number(e.target.value)})} className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-[22px] font-black text-sm outline-none focus:bg-white text-emerald-600" />
                         </div>
                      </div>
                   </div>

                   <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                      <div className="flex items-center gap-3">
                         <div className={clsx("w-2 h-2 rounded-full", formData.isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-300")} />
                         <span className="text-[10px] font-black text-slate-900 uppercase">Live Public Access</span>
                      </div>
                      <button type="button" onClick={() => setFormData({...formData, isActive: !formData.isActive})} className={clsx("w-12 h-6 rounded-full relative transition-all flex items-center px-1", formData.isActive ? "bg-indigo-600" : "bg-slate-300")}>
                         <motion.div animate={{ x: formData.isActive ? 24 : 0 }} className="w-4 h-4 bg-white rounded-full shadow-sm" />
                      </button>
                   </div>
                </div>

                <div className="p-8 bg-white border-t border-slate-50">
                   <button type="submit" disabled={saveLoading} className="w-full h-16 bg-slate-950 text-white rounded-[28px] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3">
                      {saveLoading ? <Loader2 className="animate-spin" size={20}/> : <><Save size={20} className="text-sky-400" /> Push to Production Hub</>}
                   </button>
                </div>
             </motion.form>
          </div>
        )}
      </AnimatePresence>

      <div className="p-8 bg-indigo-50/50 rounded-[44px] border border-indigo-100 flex items-start gap-5 mx-1">
         <ShieldCheck size={28} className="text-indigo-600 shrink-0" />
         <p className="text-[11px] text-indigo-700 font-bold uppercase leading-relaxed tracking-wider">
            Protocol Security: Reward claiming is cryptographically verified against the partner registry. Fraudulent attempts are automatically flagged for admin review.
         </p>
      </div>
    </div>
  );
};

export default RewardManager;
