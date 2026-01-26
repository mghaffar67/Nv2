
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Plus, Trash2, Save, Zap, Star, Users, Briefcase, RefreshCw, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { api } from '../../utils/api';
import { clsx } from 'clsx';

const RewardManager = () => {
  const [rewards, setRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', type: 'referral_count', targetValue: 5, rewardAmount: 50
  });

  const fetchRewards = async () => {
    setLoading(true);
    try {
      const res = await api.get('/rewards/admin/list');
      setRewards(res || []);
    } catch (e) { } finally { setLoading(false); }
  };

  useEffect(() => { fetchRewards(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/rewards/admin/save', formData);
      setShowForm(false);
      setFormData({ title: '', description: '', type: 'referral_count', targetValue: 5, rewardAmount: 50 });
      fetchRewards();
    } catch (e: any) { alert(e.message); }
  };

  const deleteReward = async (id: string) => {
    if (!window.confirm("Delete this bonus target?")) return;
    try {
      await api.handleRequest('DELETE', `/rewards/${id}`);
      fetchRewards();
    } catch (e) { }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto px-1.5 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2 pt-4">
         <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic leading-none">Bonus <span className="text-indigo-600">Architect.</span></h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px] mt-2 italic flex items-center gap-2">
               <Trophy size={12} className="text-amber-500" /> Manage System Achievements & Payouts
            </p>
         </div>
         <button onClick={() => setShowForm(true)} className="h-12 px-8 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2 active:scale-95 transition-all"><Plus size={18}/> New Reward</button>
      </header>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl space-y-6 mx-1">
             <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-black uppercase italic text-slate-800">Create Target Node</h3>
                <button onClick={() => setShowForm(false)} className="p-2 bg-slate-50 rounded-full text-slate-400"><X size={16}/></button>
             </div>
             <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-8 space-y-4">
                   <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-4">Achievement Title</label>
                      <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full h-12 px-6 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs outline-none focus:bg-white" placeholder="e.g. Referral King" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-4">User Instruction</label>
                      <input required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full h-12 px-6 bg-slate-50 border border-slate-100 rounded-xl font-bold text-xs outline-none focus:bg-white" placeholder="e.g. Invite 5 friends to claim this bonus" />
                   </div>
                </div>
                <div className="md:col-span-4 space-y-4">
                   <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-4">Target Condition</label>
                      <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl font-black text-[10px] uppercase outline-none">
                         <option value="referral_count">Invite Friends</option>
                         <option value="task_count">Complete Tasks</option>
                         <option value="plan_buy">Purchase Any Plan</option>
                      </select>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                         <label className="text-[9px] font-black text-slate-400 uppercase ml-4">Target Qty</label>
                         <input type="number" required value={formData.targetValue} onChange={e => setFormData({...formData, targetValue: Number(e.target.value)})} className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl font-black text-xs outline-none" />
                      </div>
                      <div className="space-y-1">
                         <label className="text-[9px] font-black text-slate-400 uppercase ml-4">Bonus (PKR)</label>
                         <input type="number" required value={formData.rewardAmount} onChange={e => setFormData({...formData, rewardAmount: Number(e.target.value)})} className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl font-black text-xs outline-none text-emerald-600" />
                      </div>
                   </div>
                </div>
                <div className="md:col-span-12">
                   <button type="submit" className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-2"><Save size={16}/> Deploy Achievement</button>
                </div>
             </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-1">
        {loading ? (
           <div className="col-span-full py-20 text-center flex flex-col items-center gap-3">
              <RefreshCw className="animate-spin text-slate-200" size={32} />
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Scanning Achievement Node...</p>
           </div>
        ) : rewards.map(reward => (
          <div key={reward.id} className="bg-white p-6 rounded-[40px] border border-slate-100 shadow-sm group hover:border-indigo-200 transition-all">
             <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-slate-950 text-amber-400 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Trophy size={22} />
                </div>
                <div className="text-right">
                   <p className="text-[11px] font-black text-emerald-600 leading-none mb-1.5">Rs {reward.rewardAmount}</p>
                   <span className="text-[7px] font-black bg-slate-50 text-slate-400 px-2 py-0.5 rounded-md uppercase border border-slate-100 italic">{reward.type?.replace('_', ' ')}</span>
                </div>
             </div>
             <h4 className="text-sm font-black text-slate-800 uppercase italic mb-1 truncate">{reward.title}</h4>
             <p className="text-[10px] font-medium text-slate-400 leading-relaxed mb-6 italic min-h-[30px]">Target: {reward.targetValue} units</p>
             <button onClick={() => deleteReward(reward.id)} className="w-full h-10 bg-rose-50 text-rose-500 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={14}/> Remove Node</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RewardManager;
