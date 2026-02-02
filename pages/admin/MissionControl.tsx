import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Edit3, Target, Trophy, 
  Zap, Users, TrendingUp, X, Save, 
  RefreshCw, ShieldCheck, Loader2, CheckCircle2,
  Lock, Eye, EyeOff, Layout
} from 'lucide-react';
import { clsx } from 'clsx';
import { api } from '../../utils/api';

const MissionControl = () => {
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [saveLoading, setSaveLoading] = useState(false);

  const fetchMissions = async () => {
    setLoading(true);
    try {
      // Simulate registry seeding if empty for testing
      const raw = localStorage.getItem('noor_missions_registry');
      if (!raw) {
        const seeds = [
          { id: 'm1', title: 'Assignment Champ', description: 'Complete 10 tasks successfully.', type: 'TASK_COUNT', targetValue: 10, rewardAmount: 50, isActive: true, iconType: 'Zap' },
          { id: 'm2', title: 'Team Builder', description: 'Invite 2 new verified members.', type: 'REFERRAL_COUNT', targetValue: 2, rewardAmount: 150, isActive: true, iconType: 'Users' },
          { id: 'm3', title: 'Streak King', description: 'Daily claim for 10 days.', type: 'STREAK_DAYS', targetValue: 10, rewardAmount: 20, isActive: true, iconType: 'Trophy' },
          { id: 'm4', title: 'Big Spender', description: 'Withdraw Rs. 1000 total.', type: 'TOTAL_WITHDRAW', targetValue: 1000, rewardAmount: 120, isActive: true, iconType: 'TrendingUp' }
        ];
        localStorage.setItem('noor_missions_registry', JSON.stringify(seeds));
      }
      const data = JSON.parse(localStorage.getItem('noor_missions_registry') || '[]');
      setMissions(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchMissions(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      const data = JSON.parse(localStorage.getItem('noor_missions_registry') || '[]');
      const finalObj = { ...editing, id: editing.id || `MSN-${Date.now()}` };
      let updated;
      if (editing.id) updated = data.map((m: any) => m.id === editing.id ? finalObj : m);
      else updated = [finalObj, ...data];
      localStorage.setItem('noor_missions_registry', JSON.stringify(updated));
      setTimeout(() => {
        setSaveLoading(false);
        setEditing(null);
        fetchMissions();
      }, 600);
    } catch (err) { setSaveLoading(false); }
  };

  const deleteMission = (id: string) => {
    if (!window.confirm("Remove this challenge? This resets progress for all users.")) return;
    const data = JSON.parse(localStorage.getItem('noor_missions_registry') || '[]');
    localStorage.setItem('noor_missions_registry', JSON.stringify(data.filter((m: any) => m.id !== id)));
    fetchMissions();
  };

  const toggleStatus = (id: string) => {
    const data = JSON.parse(localStorage.getItem('noor_missions_registry') || '[]');
    const updated = data.map((m: any) => m.id === id ? { ...m, isActive: !m.isActive } : m);
    localStorage.setItem('noor_missions_registry', JSON.stringify(updated));
    fetchMissions();
  };

  return (
    <div className="space-y-8 pb-24 animate-fade-in font-sans">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2 pt-4">
        <div>
           <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Mission <span className="text-indigo-600">Control.</span></h1>
           <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px] mt-3 italic flex items-center gap-2">
             <Target size={14} className="text-indigo-500" /> Advanced Earning Gamification Engine
           </p>
        </div>
        <button 
          onClick={() => setEditing({ title: '', description: '', type: 'TASK_COUNT', targetValue: 1, rewardAmount: 50, isActive: true, iconType: 'Zap' })}
          className="h-14 px-10 bg-slate-950 text-white rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl flex items-center gap-3 active:scale-95 transition-all"
        >
          <Plus size={20} className="text-sky-400" /> New Challenge
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 px-1">
        {loading ? (
          <div className="col-span-full py-24 text-center"><RefreshCw className="animate-spin mx-auto text-slate-200" size={48}/></div>
        ) : missions.map(m => (
          <motion.div 
            key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className={clsx(
              "bg-white p-8 rounded-[48px] border border-slate-100 shadow-sm relative overflow-hidden group hover:border-indigo-100 transition-all",
              !m.isActive && "opacity-60 grayscale"
            )}
          >
             <div className="flex justify-between items-start mb-8">
                <div className="w-16 h-16 rounded-[24px] bg-slate-50 text-indigo-600 flex items-center justify-center shadow-inner">
                   {m.type === 'TASK_COUNT' ? <Zap size={28}/> : 
                    m.type === 'REFERRAL_COUNT' ? <Users size={28}/> :
                    m.type === 'STREAK_DAYS' ? <Trophy size={28}/> : <TrendingUp size={28}/>}
                </div>
                <div className="text-right">
                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Reward Packet</p>
                   <p className="text-2xl font-black text-emerald-600 italic tracking-tighter leading-none">Rs {m.rewardAmount}</p>
                </div>
             </div>

             <div className="mb-8">
                <h4 className="text-lg font-black text-slate-800 uppercase italic mb-2">{m.title}</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">{m.description || 'Global Platform Mission'}</p>
             </div>

             <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-8 shadow-inner">
                <div>
                   <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1">Trigger Protocol</p>
                   <p className="text-[10px] font-black text-slate-900 uppercase italic leading-none">{m.type.replace('_', ' ')}</p>
                </div>
                <div className="text-right">
                   <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1">Threshold</p>
                   <p className="text-[10px] font-black text-indigo-600 italic leading-none">{m.targetValue} Units</p>
                </div>
             </div>

             <div className="flex gap-2 pt-6 border-t border-slate-50 mt-auto">
                <button onClick={() => toggleStatus(m.id)} className={clsx("flex-1 h-11 rounded-xl font-black text-[8px] uppercase tracking-widest transition-all shadow-sm flex items-center justify-center gap-2", m.isActive ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400")}>
                   {m.isActive ? <Eye size={14}/> : <EyeOff size={14}/>} {m.isActive ? 'Live' : 'Hidden'}
                </button>
                <button onClick={() => setEditing(m)} className="w-11 h-11 bg-white border border-slate-100 text-slate-400 rounded-xl flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all shadow-sm"><Edit3 size={16}/></button>
                <button onClick={() => deleteMission(m.id)} className="w-11 h-11 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm"><Trash2 size={16}/></button>
             </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {editing && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditing(null)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
             <motion.form 
                initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
                onSubmit={handleSave} className="relative w-full max-w-lg bg-white rounded-[56px] p-10 shadow-2xl space-y-8 border border-white"
             >
                <div className="flex justify-between items-center border-b border-slate-50 pb-8">
                   <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Mission <span className="text-indigo-600">Node.</span></h3>
                   <button type="button" onClick={() => setEditing(null)} className="p-3 bg-slate-50 rounded-full hover:bg-rose-50 hover:text-rose-500 transition-all"><X size={28}/></button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="md:col-span-2 space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6 italic">Challenge Title</label>
                      <input required value={editing.title} onChange={e => setEditing({...editing, title: e.target.value})} className="w-full h-14 px-7 bg-slate-50 border border-slate-100 rounded-[28px] font-black text-sm text-slate-900 outline-none focus:bg-white transition-all shadow-inner" placeholder="e.g. Master Contributor" />
                   </div>
                   <div className="md:col-span-2 space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6 italic">Description</label>
                      <textarea value={editing.description} onChange={e => setEditing({...editing, description: e.target.value})} className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[28px] font-medium text-xs text-slate-600 outline-none resize-none h-24" placeholder="Briefly explain the goal..." />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6 italic">Metric Protocol</label>
                      <select value={editing.type} onChange={e => setEditing({...editing, type: e.target.value})} className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-[28px] font-black text-[10px] uppercase outline-none appearance-none">
                         <option value="TASK_COUNT">Tasks Completed</option>
                         <option value="REFERRAL_COUNT">New Referrals</option>
                         <option value="STREAK_DAYS">Streak Loyalty</option>
                         <option value="TOTAL_WITHDRAW">Withdrawal Volume</option>
                      </select>
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6 italic">Target Value</label>
                      <input required type="number" value={editing.targetValue} onChange={e => setEditing({...editing, targetValue: e.target.value})} className="w-full h-14 px-7 bg-slate-50 border border-slate-100 rounded-[28px] font-bold text-sm outline-none" />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-6 italic">Reward (PKR)</label>
                      <input required type="number" value={editing.rewardAmount} onChange={e => setEditing({...editing, rewardAmount: e.target.value})} className="w-full h-14 px-7 bg-slate-50 border border-slate-100 rounded-[28px] font-black text-lg text-emerald-600 outline-none" />
                   </div>
                   <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-3xl border border-slate-100 h-14 mt-auto">
                      <button type="button" onClick={() => setEditing({...editing, isActive: !editing.isActive})} className={clsx("w-12 h-6 rounded-full relative flex items-center px-1 shadow-inner", editing.isActive ? "bg-indigo-600" : "bg-slate-300")}>
                         <motion.div animate={{ x: editing.isActive ? 24 : 0 }} className="w-4 h-4 bg-white rounded-full shadow-sm" />
                      </button>
                      <span className="text-[9px] font-black text-slate-900 uppercase">Live Hub Status</span>
                   </div>
                </div>

                <div className="pt-6">
                   <button type="submit" disabled={saveLoading} className="w-full h-18 bg-slate-950 text-white rounded-[32px] font-black text-[12px] uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4">
                      {saveLoading ? <Loader2 className="animate-spin" size={24}/> : <><CheckCircle2 size={24} className="text-sky-400" /> Deploy Challenge</>}
                   </button>
                </div>
             </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MissionControl;