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
    <div className="space-y-6 md:space-y-8 pb-24 animate-fade-in max-w-7xl mx-auto px-1.5 font-sans">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2 pt-4">
         <div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Inam <span className="text-indigo-600">Hub.</span></h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px] mt-3 italic flex items-center gap-2">
               <Trophy size={14} className="text-amber-500" /> Reward Architecture & Member Tracking
            </p>
         </div>
         <div className="flex gap-2">
           <button onClick={fetchData} className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 active:rotate-180 transition-all shadow-sm"><RefreshCw size={24}/></button>
           <button onClick={() => { setSelectedReward(null); setShowForm(true); }} className="h-14 px-10 bg-slate-950 text-white rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl flex items-center gap-3 active:scale-95 transition-all">
              <Plus size={20} className="text-sky-400" /> Naya Target
           </button>
         </div>
      </header>

      {/* SUMMARY STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-1">
         <div className="bg-white p-6 rounded-[36px] border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner"><Target size={24}/></div>
            <div>
               <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Targets</p>
               <p className="text-xl font-black text-slate-900">{stats?.totalActiveRewards || 0}</p>
            </div>
         </div>
         <div className="bg-white p-6 rounded-[36px] border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner"><BadgeCheck size={24}/></div>
            <div>
               <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Claims</p>
               <p className="text-xl font-black text-slate-900">{stats?.totalClaims || 0}</p>
            </div>
         </div>
         <div className="bg-white p-6 rounded-[36px] border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center shadow-inner"><TrendingUp size={24}/></div>
            <div>
               <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Budget Disbursed</p>
               <p className="text-xl font-black text-slate-900">Rs {stats?.totalBudgetSpent?.toLocaleString() || 0}</p>
            </div>
         </div>
      </div>

      <div className="flex bg-white p-1.5 rounded-[28px] border border-slate-100 shadow-sm w-fit gap-1 mx-1">
         <button onClick={() => setActiveTab('targets')} className={clsx("px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all", activeTab === 'targets' ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:text-slate-900")}>Target Pool</button>
         <button onClick={() => setActiveTab('tracking')} className={clsx("px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all", activeTab === 'tracking' ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:text-slate-900")}>Identity Progress</button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'targets' ? (
          <motion.div key="targets" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-1">
             {rewards.map(r => (
               <div key={r.id} className="bg-white p-6 rounded-[44px] border border-slate-100 shadow-sm group hover:border-indigo-200 transition-all flex flex-col relative overflow-hidden">
                  {r.isActive ? <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" /> : <div className="absolute top-0 left-0 w-full h-1 bg-slate-200" />}
                  <div className="flex justify-between items-start mb-6">
                     <div className={clsx("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all", r.isActive ? "bg-slate-950" : "bg-slate-200")}>
                        <Zap size={28} fill={r.isActive ? "currentColor" : "none"} />
                     </div>
                     <div className="text-right">
                        <p className="text-xl font-black text-emerald-600 italic leading-none">Rs {r.rewardAmount}</p>
                        <span className="text-[7px] font-black uppercase text-slate-400 italic mt-1 block">Yield Node</span>
                     </div>
                  </div>
                  <h4 className="text-[13px] font-black text-slate-900 uppercase italic mb-1 truncate">{r.title}</h4>
                  <p className="text-[10px] font-bold text-slate-400 leading-relaxed italic mb-6">"{r.description}"</p>
                  <div className="mt-auto pt-4 border-t border-slate-50 flex justify-between items-center">
                     <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full text-[8px] font-black uppercase text-slate-400 border border-slate-100">
                        Target: {r.targetValue} {r.type.split('_')[0]}s
                     </div>
                     <div className="flex gap-1">
                        <button onClick={() => { setSelectedReward(r); setFormData({...r}); setShowForm(true); }} className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-indigo-600 transition-all shadow-sm"><Edit3 size={16}/></button>
                        <button onClick={async () => { if(window.confirm('Remove Target?')) { await api.handleRequest('DELETE', `/rewards/admin/${r.id}`); fetchData(); }}} className="w-10 h-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm"><Trash2 size={16}/></button>
                     </div>
                  </div>
               </div>
             ))}
          </motion.div>
        ) : (
          <motion.div key="tracking" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 mx-1">
             <div className="bg-white p-4 rounded-[32px] border border-slate-100 shadow-sm">
                <div className="relative">
                   <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                   <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-[11px] outline-none focus:bg-white" placeholder="Search by name, ID or mobile..." />
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.phone.includes(searchTerm) || u.id.includes(searchTerm)).map(u => (
                  <div key={u.id} className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-sm group hover:border-indigo-100 transition-all">
                     <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                           <div className="w-14 h-14 rounded-3xl bg-slate-950 text-sky-400 flex items-center justify-center font-black italic shadow-lg text-xl border border-white/10">{u.name.charAt(0)}</div>
                           <div>
                              <h4 className="text-[14px] font-black text-slate-900 uppercase truncate max-w-[150px]">{u.name}</h4>
                              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Station: {u.currentPlan || 'NONE'}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-[7px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-1">Account Liquidity</p>
                           <p className="text-lg font-black text-slate-900 italic leading-none">Rs {u.balance?.toLocaleString()}</p>
                        </div>
                     </div>
                     
                     <div className="space-y-6">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 border-b border-slate-50 pb-2">Achievement Nodes</p>
                        {rewards.map(r => {
                           // Logic to calculate progress manually for the view
                           let progress = 0;
                           if (r.type === 'referral_count') {
                              progress = dbNode.getUsers().filter((usr: any) => usr.referredBy === u.referralCode).length;
                           } else if (r.type === 'task_count') {
                              progress = (u.workSubmissions || []).filter((s: any) => s.status === 'approved').length;
                           } else if (r.type === 'deposit_total') {
                              progress = (u.transactions || []).filter((t: any) => t.type === 'deposit' && t.status === 'approved').reduce((a: number, b: any) => a + Number(b.amount), 0);
                           }

                           const isClaimed = (u.claimedRewards || []).includes(r.id);
                           const isProcessing = processingId === `${u.id}-${r.id}`;
                           const percent = Math.min(100, Math.round((progress / r.targetValue) * 100));
                           const isComplete = progress >= r.targetValue;
                           
                           return (
                             <div key={r.id} className="space-y-3 p-5 bg-slate-50/50 rounded-[32px] border border-transparent hover:border-slate-100 hover:bg-white transition-all shadow-inner hover:shadow-xl">
                                <div className="flex justify-between items-center px-1">
                                   <div className="overflow-hidden pr-2">
                                      <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight truncate leading-none mb-1">{r.title}</p>
                                      <p className="text-[8px] font-bold text-emerald-600 uppercase italic">Inam Value: Rs {r.rewardAmount}</p>
                                   </div>
                                   <span className={clsx("text-[8px] font-black px-2 py-0.5 rounded-md", isComplete ? "bg-emerald-50 text-emerald-600" : "bg-indigo-50 text-indigo-600")}>
                                      {progress} / {r.targetValue}
                                   </span>
                                </div>

                                <div className="h-2 w-full bg-slate-200/50 rounded-full overflow-hidden p-0.5 border border-slate-100">
                                   <motion.div 
                                      initial={{ width: 0 }} animate={{ width: `${percent}%` }}
                                      className={clsx("h-full rounded-full", isComplete ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-indigo-600")} 
                                   />
                                </div>

                                <div className="flex justify-end pt-1">
                                  {isClaimed ? (
                                    <button 
                                      onClick={() => handleAction(u.id, r.id, 'revoke')}
                                      disabled={isProcessing}
                                      className="px-6 h-9 bg-rose-50 text-rose-600 rounded-xl text-[8px] font-black uppercase border border-rose-100 hover:bg-rose-600 hover:text-white transition-all flex items-center gap-1.5 shadow-sm"
                                    >
                                      {isProcessing ? <Loader2 size={12} className="animate-spin"/> : <UserMinus size={12} />} Revoke Access
                                    </button>
                                  ) : (
                                    <button 
                                      onClick={() => handleAction(u.id, r.id, 'award')}
                                      disabled={isProcessing}
                                      className={clsx(
                                        "px-6 h-9 rounded-xl text-[8px] font-black uppercase border transition-all flex items-center gap-1.5 shadow-sm",
                                        isComplete ? "bg-emerald-600 text-white border-emerald-600 shadow-lg" : "bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-600 hover:text-white"
                                      )}
                                    >
                                      {isProcessing ? <Loader2 size={12} className="animate-spin"/> : <UserPlus size={12} />} {isComplete ? 'Authorize Manual' : 'Award Node'}
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
                <div className="bg-slate-950 p-8 text-white shrink-0 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-5 scale-150 rotate-12"><Trophy size={80}/></div>
                   <div className="flex items-center justify-between mb-4 relative z-10">
                      <h3 className="text-xl font-black uppercase italic tracking-tighter">{selectedReward ? 'Configure Node' : 'Initialize Achievement'}</h3>
                      <button type="button" onClick={() => setShowForm(false)} className="p-2 bg-white/10 rounded-full text-white/40 hover:bg-rose-500 hover:text-white transition-all"><X size={20}/></button>
                   </div>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest relative z-10">Define behavior for the reward engine cluster.</p>
                </div>

                <div className="p-8 space-y-6">
                   <div className="space-y-4">
                      <div className="space-y-1.5">
                         <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Target Headline</label>
                         <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-[22px] font-black text-sm text-slate-900 outline-none focus:bg-white transition-all shadow-inner" placeholder="e.g. Silver Associate Tier" />
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Guideline Description</label>
                         <input required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-[22px] font-bold text-xs" placeholder="How to unlock this node..." />
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                         <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Logic Class (Type)</label>
                         <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-[22px] font-black text-[10px] uppercase outline-none focus:bg-white appearance-none cursor-pointer">
                            <option value="referral_count">Network Scale (Referrals)</option>
                            <option value="task_count">Output Yield (Tasks)</option>
                            <option value="deposit_total">Inflow Node (Deposits)</option>
                         </select>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                         <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Target Units</label>
                            <input type="number" required value={formData.targetValue} onChange={e => setFormData({...formData, targetValue: Number(e.target.value)})} className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-[22px] font-black text-sm outline-none" />
                         </div>
                         <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Yield (PKR)</label>
                            <input type="number" required value={formData.rewardAmount} onChange={e => setFormData({...formData, rewardAmount: Number(e.target.value)})} className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-[22px] font-black text-sm text-emerald-600 outline-none" />
                         </div>
                      </div>
                   </div>
                </div>

                <div className="p-8 bg-white border-t border-slate-50">
                   <button type="submit" className="w-full h-16 bg-slate-950 text-white rounded-[28px] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3">
                      <BadgeCheck size={20} className="text-sky-400" /> Synchronize Reward Cluster
                   </button>
                </div>
             </motion.form>
          </div>
        )}
      </AnimatePresence>

      <div className="p-10 bg-indigo-50/50 rounded-[44px] border border-indigo-100 flex items-start gap-6 shadow-inner mx-1">
         <ShieldCheck size={32} className="text-indigo-600 shrink-0 mt-1" />
         <div>
            <h4 className="text-sm font-black text-indigo-900 uppercase italic mb-1">Authorized Audit Node</h4>
            <p className="text-[10px] text-indigo-700 font-bold uppercase leading-relaxed tracking-wider">
               Member progress is calculated using live ledger data. Manual awarding bypasses target requirements and adds funds directly to the user's earning wallet with an audit trail.
            </p>
         </div>
      </div>
    </div>
  );
};

export default RewardManager;