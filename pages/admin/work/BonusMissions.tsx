
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Plus, Trash2, Edit3, Target, 
  RefreshCw, Zap, Users, TrendingUp, X, 
  Save, ShieldCheck, Loader2, Star, Award
} from 'lucide-react';
import { api } from '../../../utils/api';
import { clsx } from 'clsx';

const BonusMissions = () => {
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [saveLoading, setSaveLoading] = useState(false);

  const fetchMissions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/system/admin/missions');
      setMissions(res || []);
    } catch (e) { } finally { setLoading(false); }
  };

  useEffect(() => { fetchMissions(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      await api.post('/system/admin/missions', editing);
      setEditing(null);
      fetchMissions();
      alert("Gamification Node synchronized.");
    } catch (err) {
      alert("Mission logic failure.");
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
           <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Bumper <span className="text-indigo-600">Nodes.</span></h2>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2 italic">
             <Trophy size={14} className="text-[#4A6CF7]" /> Configure Gamification Challenges & Bonus Payloads
           </p>
        </div>
        <button 
          onClick={() => setEditing({ title: '', description: '', type: 'TASK_COUNT', targetValue: 10, rewardAmount: 100, isActive: true })}
          className="h-14 px-10 bg-slate-950 text-white rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl flex items-center gap-3 active:scale-95 transition-all"
        >
          <Plus size={20} className="text-sky-400" /> New Challenge
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-24 text-center"><RefreshCw className="animate-spin mx-auto text-slate-200" size={48}/></div>
        ) : missions.length > 0 ? missions.map(m => (
          <motion.div layout key={m.id} className="bg-white p-10 rounded-[56px] border border-slate-100 shadow-sm flex flex-col relative group hover:border-indigo-100 transition-all overflow-hidden">
             <div className="flex justify-between items-start mb-10">
                <div className="w-20 h-20 rounded-[30px] bg-slate-950 text-sky-400 flex items-center justify-center shadow-2xl group-hover:rotate-6 transition-transform">
                   {m.type === 'TASK_COUNT' ? <Zap size={40} /> : m.type === 'REFERRAL_COUNT' ? <Users size={40} /> : <TrendingUp size={40} />}
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1 italic">Achievement Inam</p>
                   <p className="text-3xl font-black text-emerald-600 italic leading-none">Rs {m.rewardAmount}</p>
                </div>
             </div>

             <div className="mb-10">
                <h4 className="text-2xl font-black text-slate-900 uppercase italic mb-3 truncate">{m.title}</h4>
                <div className="flex items-center justify-between p-5 bg-slate-50 rounded-3xl border border-slate-100 shadow-inner">
                   <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Target Matrix</p>
                      <p className="text-[11px] font-black text-slate-700 uppercase italic">{m.type.replace('_', ' ')}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Goal</p>
                      <p className="text-[11px] font-black text-indigo-600 uppercase italic">{m.targetValue} Units</p>
                   </div>
                </div>
             </div>

             <div className="flex gap-2 pt-8 border-t border-slate-50 mt-auto">
                <button onClick={() => setEditing(m)} className="flex-1 h-14 bg-slate-950 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all shadow-xl active:scale-95"><Edit3 size={18}/> Modify Node</button>
                <button className="w-14 h-14 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-90"><Trash2 size={20}/></button>
             </div>
          </motion.div>
        )) : (
          <div className="col-span-full py-40 text-center bg-white rounded-[64px] border-4 border-dashed border-slate-50 opacity-20">
             <Star size={80} className="text-slate-100 mx-auto mb-8" />
             <p className="text-xs font-black uppercase tracking-[0.4em] italic">No active missions discovered</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {editing && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditing(null)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
             <motion.form 
                initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
                onSubmit={handleSave} className="relative w-full max-w-lg bg-white rounded-[64px] p-12 shadow-2xl space-y-8 border border-white"
             >
                <div className="flex justify-between items-center border-b border-slate-50 pb-8">
                   <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Mission <span className="text-indigo-600">Logic.</span></h3>
                   <button type="button" onClick={() => setEditing(null)} className="p-3 bg-slate-50 rounded-full hover:bg-rose-50 hover:text-rose-500 transition-all"><X size={28}/></button>
                </div>

                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6 italic">Protocol Title</label>
                      <input required value={editing.title} onChange={e => setEditing({...editing, title: e.target.value})} className="w-full h-14 px-8 bg-slate-50 border border-slate-100 rounded-[28px] font-black text-sm text-slate-900 outline-none focus:bg-white transition-all shadow-inner" placeholder="e.g. Diamond Referral" />
                   </div>
                   <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6 italic">Matrix Type</label>
                         <select value={editing.type} onChange={e => setEditing({...editing, type: e.target.value})} className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-[28px] font-black text-[11px] uppercase outline-none">
                            <option value="TASK_COUNT">Tasks Verified</option>
                            <option value="REFERRAL_COUNT">Direct Nodes</option>
                            <option value="TOTAL_WITHDRAW">Payout Volume</option>
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6 italic">Target Value</label>
                         <input required type="number" value={editing.targetValue} onChange={e => setEditing({...editing, targetValue: Number(e.target.value)})} className="w-full h-14 px-8 bg-slate-50 border border-slate-100 rounded-[28px] font-bold text-sm outline-none" />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6 italic">Reward Payload (PKR)</label>
                      <input required type="number" value={editing.rewardAmount} onChange={e => setEditing({...editing, rewardAmount: Number(e.target.value)})} className="w-full h-14 px-8 bg-slate-50 border border-slate-100 rounded-[28px] font-black text-2xl text-emerald-600 outline-none" />
                   </div>
                </div>

                <div className="pt-6">
                   <button type="submit" disabled={saveLoading} className="w-full h-18 bg-slate-950 text-white rounded-[32px] font-black text-[12px] uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50">
                      {saveLoading ? <Loader2 className="animate-spin" size={24}/> : <><ShieldCheck size={24} className="text-sky-400" /> Commit Node</>}
                   </button>
                </div>
             </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BonusMissions;
