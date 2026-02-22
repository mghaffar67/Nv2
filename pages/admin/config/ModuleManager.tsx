import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, UserPlus, LogIn, Wallet, ArrowDownCircle, 
  Zap, Trophy, CheckSquare, Settings, MessageCircle, 
  Loader2, CheckCircle2, ShieldCheck, Activity,
  Globe, Smartphone, Heart, Network, Cpu, Server,
  Lock, RefreshCw, AlertTriangle
} from 'lucide-react';
import { useConfig } from '../../../context/ConfigContext';
import { clsx } from 'clsx';

const ModuleCard = ({ title, moduleKey, icon: Icon, isActive, onToggle, description, category }: any) => (
  <div className="bg-white p-6 rounded-[36px] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-indigo-100 transition-all relative overflow-hidden">
    <div className="flex items-center gap-5 relative z-10">
      <div className={clsx(
        "w-14 h-14 rounded-[22px] flex items-center justify-center transition-all shadow-inner",
        isActive ? "bg-slate-950 text-white shadow-xl" : "bg-slate-50 text-slate-300"
      )}>
        <Icon size={24} className={clsx(isActive && "animate-pulse")} />
      </div>
      <div>
        <p className="text-[7px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-1.5 italic">{category}</p>
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none mb-1">{title}</h3>
        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{description}</p>
      </div>
    </div>

    <button 
      onClick={() => onToggle(moduleKey)}
      className={clsx(
        "w-14 h-7 rounded-full relative flex items-center px-1 transition-all shadow-inner relative z-10",
        isActive ? "bg-emerald-500" : "bg-slate-200"
      )}
    >
      <motion.div 
        animate={{ x: isActive ? 28 : 0 }}
        className="w-5 h-5 bg-white rounded-full shadow-md"
      />
    </button>
  </div>
);

const ModuleManager = () => {
  const { config, updateConfig } = useConfig();
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleToggle = async (key: string) => {
    setLoading(true);
    try {
      const newModules = { ...config.modules, [key]: !config.modules[key] };
      updateConfig({ modules: newModules });
      setSuccessMsg(`${key.replace('enable', '').replace('is', '')} Protocol Updated!`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    {
      id: 'auth',
      label: 'Identity Protocol',
      items: [
        { key: 'allowRegistration', title: 'User Inflow', desc: 'Accept new identity nodes', icon: UserPlus },
        { key: 'allowDemoLogin', title: 'Demo Buffer', desc: 'Pre-auth login access', icon: LogIn }
      ]
    },
    {
      id: 'finance',
      label: 'Financial Corridor',
      items: [
        { key: 'enableDeposits', title: 'Liquidity Inflow', desc: 'Authorizing plan upgrades', icon: ArrowDownCircle },
        { key: 'enableWithdrawals', title: 'Payout Stream', desc: 'Automated withdrawal requests', icon: Wallet }
      ]
    },
    {
      id: 'earning',
      label: 'Earning Engine',
      items: [
        { key: 'enableDailyTasks', title: 'Assignment Feed', desc: 'Live task allocation', icon: Zap },
        { key: 'allowTaskSubmission', title: 'Audit Protocol', desc: 'Verification evidence intake', icon: CheckSquare },
        { key: 'enableDailyCheckIn', title: 'Streak Yield', desc: 'Gamification reward loop', icon: Trophy }
      ]
    }
  ];

  const vitals = [
    { label: 'Core CPU', val: '12%', status: 'Stable', icon: Cpu, color: 'text-indigo-500' },
    { label: 'Ledger Node', val: 'Online', status: 'Healthy', icon: Server, color: 'text-emerald-500' },
    { label: 'Firewall', val: 'Active', status: 'Secured', icon: Lock, color: 'text-sky-500' }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-24 max-w-7xl mx-auto">
      <header className="px-2 pt-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
           <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
             Executive <span className="text-indigo-600">Switches.</span>
           </h1>
           <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] mt-4 italic flex items-center gap-2">
              <Settings size={14} className="text-indigo-500" /> High-Level Platform Logic Governance
           </p>
        </div>
        <div className="flex bg-white p-2 rounded-[28px] border border-slate-100 shadow-sm gap-6 px-6">
           {vitals.map(v => (
             <div key={v.label} className="flex items-center gap-3">
                <v.icon size={16} className={v.color} />
                <div>
                   <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{v.label}</p>
                   <p className="text-[10px] font-black text-slate-900 italic tracking-tight">{v.val}</p>
                </div>
             </div>
           ))}
        </div>
      </header>

      {config.modules.isMaintenanceMode && (
         <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-rose-500 p-8 rounded-[48px] text-white shadow-2xl relative overflow-hidden mx-1">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/20"><ShieldAlert size={32} className="animate-bounce" /></div>
                  <div>
                     <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-1">SYSTEM LOCKDOWN ACTIVE</h3>
                     <p className="text-rose-100 text-[10px] font-bold uppercase tracking-widest">Public access has been suspended for maintenance.</p>
                  </div>
               </div>
               <button onClick={() => handleToggle('isMaintenanceMode')} className="h-14 px-10 bg-white text-rose-600 rounded-[28px] font-black text-[11px] uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all flex items-center gap-3"><Lock size={18} /> Restore Node Access</button>
            </div>
         </motion.div>
      )}

      {loading && (
        <div className="fixed inset-0 z-[500] bg-slate-950/20 backdrop-blur-md flex items-center justify-center">
           <div className="bg-slate-950 text-white p-10 rounded-[44px] shadow-2xl flex flex-col items-center gap-6 border border-white/10">
              <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center animate-spin"><RefreshCw size={32} /></div>
              <p className="font-black text-[11px] uppercase tracking-[0.4em] italic mb-2">Syncing Mainframe...</p>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-2">
         {categories.map(cat => (
           <div key={cat.id} className="space-y-6">
              <h3 className="text-[11px] font-black text-slate-300 uppercase tracking-[0.4em] ml-6 flex items-center gap-3">
                 <Activity size={14} className="text-indigo-500" /> {cat.label}
              </h3>
              <div className="space-y-4">
                 {cat.items.map(item => (
                    <ModuleCard 
                      key={item.key}
                      category={cat.id.toUpperCase()}
                      title={item.title}
                      moduleKey={item.key}
                      description={item.desc}
                      icon={item.icon}
                      isActive={config.modules[item.key]}
                      onToggle={handleToggle}
                    />
                 ))}
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};

export default ModuleManager;