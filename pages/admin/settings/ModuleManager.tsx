import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, Zap, Wallet, Users, LogIn, 
  Clock, ShieldCheck, RefreshCw, Save, X,
  AlertTriangle, MessageSquare, Trophy, ShieldAlert,
  Loader2
} from 'lucide-react';
import { clsx } from 'clsx';
import { useConfig } from '../../../context/ConfigContext';
import { api } from '../../../utils/api';

const ModuleCard = ({ title, icon: Icon, moduleKey, config, onToggle, onOpenSettings }: any) => {
  const mod = config[moduleKey];
  const isActive = mod?.enabled;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-between group hover:border-indigo-100 transition-all"
    >
      <div className="flex justify-between items-start mb-6">
        <div className={clsx(
          "w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-lg",
          isActive ? "bg-slate-950 text-sky-400" : "bg-slate-50 text-slate-300"
        )}>
          <Icon size={28} />
        </div>
        <button 
          onClick={onOpenSettings}
          className="p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-400 group-hover:text-indigo-600"
        >
          <Settings size={20} />
        </button>
      </div>

      <div>
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight mb-1">{title}</h3>
        <div className="flex items-center gap-2">
           <div className={clsx("w-2 h-2 rounded-full", isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-300")} />
           <span className={clsx("text-[9px] font-black uppercase tracking-[0.2em]", isActive ? "text-emerald-600" : "text-slate-400")}>
             {isActive ? 'Active Node' : 'Hibernated'}
           </span>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
         <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Toggle Switch</span>
         <button 
           onClick={() => onToggle(moduleKey)}
           className={clsx(
             "w-14 h-7 rounded-full relative transition-all flex items-center px-1",
             isActive ? "bg-indigo-600" : "bg-slate-200"
           )}
         >
           <motion.div 
             animate={{ x: isActive ? 28 : 0 }}
             className="w-5 h-5 bg-white rounded-full shadow-md"
           />
         </button>
      </div>
    </motion.div>
  );
};

const ModuleManager = () => {
  const { config, updateConfig } = useConfig();
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [historyTab, setHistoryTab] = useState(false);

  const handleToggle = (key: string) => {
    const current = (config as any)[key];
    updateConfig({ [key]: { ...current, enabled: !current.enabled } });
  };

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    // API logic to persist to backend
    setTimeout(() => {
      setSaveLoading(false);
      setEditingKey(null);
    }, 800);
  };

  const modules = [
    { key: 'withdrawals', title: 'Withdrawal Hub', icon: Wallet },
    { key: 'workTasks', title: 'Daily Work Console', icon: Zap },
    { key: 'dailyClaim', title: 'Consistency Bonus', icon: Trophy },
    { key: 'demoLogin', title: 'Landing Probe', icon: LogIn },
    { key: 'referralSystem', title: 'Network Growth', icon: Users },
    { key: 'userBonus', title: 'Manual Boosts', icon: ShieldAlert },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-24">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Feature <span className="text-indigo-600">Sync.</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px] mt-3 italic flex items-center gap-2">
            <ShieldAlert size={14} className="text-indigo-500" /> Platform Operational Protocol Center
          </p>
        </div>
        <div className="flex gap-2">
           <button onClick={() => setHistoryTab(!historyTab)} className="h-12 px-6 bg-white border border-slate-100 rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all hover:bg-slate-50 flex items-center gap-2">
              <ShieldCheck size={16} /> Audit Trail
           </button>
        </div>
      </header>

      {historyTab ? (
        <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
           <h3 className="text-sm font-black uppercase italic mb-8">Modification Log</h3>
           <div className="space-y-4">
              {(config as any).changeLog?.map((log: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 text-sky-400 flex items-center justify-center font-black text-[10px]">A</div>
                      <p className="text-[10px] font-black text-slate-800 uppercase">{log.action}</p>
                   </div>
                   <span className="text-[8px] font-bold text-slate-400 uppercase">{log.timestamp}</span>
                </div>
              )) || <p className="text-center text-slate-400 py-10 italic uppercase text-[9px]">No changes logged in current epoch.</p>}
           </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
           {modules.map(mod => (
             <ModuleCard 
               key={mod.key}
               {...mod}
               moduleKey={mod.key}
               config={config}
               onToggle={handleToggle}
               onOpenSettings={() => setEditingKey(mod.key)}
             />
           ))}
        </div>
      )}

      <AnimatePresence>
        {editingKey && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingKey(null)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
             <motion.form 
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                onSubmit={saveSettings} className="relative w-full max-w-lg bg-white rounded-[56px] p-10 shadow-2xl border border-white space-y-8"
             >
                <div className="flex justify-between items-center border-b border-slate-50 pb-8">
                   <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">Module Config.</h3>
                   <button type="button" onClick={() => setEditingKey(null)} className="p-2 hover:bg-rose-50 text-slate-300 hover:text-rose-500 rounded-full transition-all"><X size={24}/></button>
                </div>

                <div className="space-y-6">
                   {(editingKey === 'withdrawals' || editingKey === 'workTasks') && (
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                           <label className="text-[9px] font-black text-slate-400 uppercase ml-4">Open Time</label>
                           <input type="time" className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl font-black outline-none" />
                        </div>
                        <div className="space-y-1.5">
                           <label className="text-[9px] font-black text-slate-400 uppercase ml-4">Close Time</label>
                           <input type="time" className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl font-black outline-none" />
                        </div>
                     </div>
                   )}

                   {editingKey === 'dailyClaim' && (
                     <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-400 uppercase ml-4">Reward Amount (PKR)</label>
                        <input type="number" className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl font-black outline-none" placeholder="e.g. 50" />
                     </div>
                   )}

                   <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase ml-4 italic">Maintenance Message</label>
                      <textarea className="w-full p-6 bg-slate-50 border border-slate-100 rounded-3xl font-bold text-xs text-slate-600 outline-none resize-none" rows={3} placeholder="Enter message users see when module is OFF" />
                   </div>
                </div>

                <button type="submit" disabled={saveLoading} className="w-full h-16 bg-slate-950 text-white rounded-[28px] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3">
                   {saveLoading ? <Loader2 size={24} className="animate-spin" /> : <><ShieldCheck size={20} className="text-sky-400" /> Commit to Node</>}
                </button>
             </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModuleManager;