import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, UserPlus, LogIn, Wallet, ArrowDownCircle, 
  Zap, Trophy, CheckSquare, Settings, Activity,
  Server, Lock, RefreshCw, Sliders, ShieldCheck, Cpu, Terminal
} from 'lucide-react';
import { useConfig } from '../../../context/ConfigContext';
import { clsx } from 'clsx';

const ModuleCard = ({ title, moduleKey, icon: Icon, isActive, onToggle, description, category }: any) => (
  <div className="bg-white p-5 md:p-6 rounded-[36px] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-indigo-100 transition-all relative overflow-hidden">
    <div className="flex items-center gap-5 relative z-10">
      <div className={clsx(
        "w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-[22px] flex items-center justify-center transition-all shadow-inner shrink-0",
        isActive ? "bg-slate-950 text-white shadow-xl" : "bg-slate-50 text-slate-300"
      )}>
        <Icon size={22} className={clsx(isActive && "animate-pulse")} />
      </div>
      <div className="overflow-hidden">
        <p className="text-[7px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-1.5 italic">{category}</p>
        <h3 className="text-[11px] md:text-sm font-black text-slate-900 uppercase tracking-tight leading-none mb-1 truncate">{title}</h3>
        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest truncate">{description}</p>
      </div>
    </div>

    <button 
      onClick={() => onToggle(moduleKey)}
      className={clsx(
        "w-12 h-6 md:w-14 md:h-7 rounded-full relative flex items-center px-1 transition-all shadow-inner shrink-0",
        isActive ? "bg-emerald-500" : "bg-slate-200"
      )}
    >
      <motion.div 
        animate={{ x: isActive ? (window.innerWidth < 768 ? 24 : 28) : 0 }}
        className="w-4 h-4 md:w-5 md:h-5 bg-white rounded-full shadow-md"
      />
    </button>
  </div>
);

const ModuleManager = () => {
  const { config, updateConfig } = useConfig();
  const [loading, setLoading] = useState(false);

  const handleToggle = async (key: string) => {
    setLoading(true);
    // Simulation of API delay
    setTimeout(() => {
      const newModules = { ...config.modules, [key]: !config.modules[key] };
      updateConfig({ modules: newModules });
      setLoading(false);
    }, 400);
  };

  const categories = [
    {
      id: 'Access',
      label: 'Security & Access',
      items: [
        { key: 'allowRegistration', title: 'User Inflow', desc: 'Accept new signups', icon: UserPlus },
        { key: 'allowDemoLogin', title: 'Demo Access', desc: 'Pre-auth quick login', icon: LogIn },
        { key: 'isMaintenanceMode', title: 'Lockdown Mode', desc: 'Suspend public access', icon: ShieldAlert }
      ]
    },
    {
      id: 'Finance',
      label: 'Financial Nodes',
      items: [
        { key: 'enableDeposits', title: 'Liquidity Inflow', desc: 'Authorize plan upgrades', icon: ArrowDownCircle },
        { key: 'enableWithdrawals', title: 'Payout Stream', desc: 'Process withdrawal queue', icon: Wallet }
      ]
    },
    {
      id: 'Earning',
      label: 'Yield Management',
      items: [
        { key: 'enableDailyTasks', title: 'Assignment Feed', desc: 'Live task allocation', icon: Zap },
        { key: 'allowTaskSubmission', title: 'Audit Protocol', desc: 'Enable proof verification', icon: CheckSquare },
        { key: 'enableDailyCheckIn', title: 'Streak Loop', desc: 'Daily bonus claiming', icon: Trophy }
      ]
    }
  ];

  const vitals = [
    { label: 'CPU Load', val: '8.4%', icon: Cpu, color: 'text-indigo-500' },
    { label: 'Registry', val: 'Healthy', icon: Server, color: 'text-emerald-500' },
    { label: 'Latency', val: '42ms', icon: Activity, color: 'text-sky-500' }
  ];

  return (
    <div className="space-y-10 animate-fade-in">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2">
         <div>
            <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none mb-2">Master <span className="text-indigo-600">Switches.</span></h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic flex items-center gap-2"><Terminal size={14} className="text-indigo-500" /> Platform Architecture Controller</p>
         </div>
         <div className="flex bg-white p-2 rounded-[28px] border border-slate-100 shadow-sm gap-6 px-6 overflow-x-auto no-scrollbar max-w-full">
            {vitals.map(v => (
              <div key={v.label} className="flex items-center gap-3 shrink-0">
                 <v.icon size={16} className={v.color} />
                 <div>
                    <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{v.label}</p>
                    <p className="text-[10px] font-black text-slate-900 italic tracking-tight">{v.val}</p>
                 </div>
              </div>
            ))}
         </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 px-1">
         {categories.map(cat => (
           <div key={cat.id} className="space-y-6">
              <h3 className="text-[11px] font-black text-slate-300 uppercase tracking-[0.4em] ml-6 flex items-center gap-3 italic">
                 <Activity size={14} className="text-indigo-500" /> {cat.label}
              </h3>
              <div className="grid grid-cols-1 gap-4">
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

      <div className="p-8 bg-indigo-50 rounded-[44px] border border-indigo-100 flex flex-col md:flex-row items-center gap-6 mx-1 shadow-inner">
         <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-indigo-600 shadow-xl shrink-0"><ShieldCheck size={32} /></div>
         <div>
            <h4 className="text-[11px] font-black text-indigo-900 uppercase italic mb-1 tracking-tight">Ecosystem Policy Node</h4>
            <p className="text-[9px] font-bold text-indigo-700 uppercase tracking-widest leading-relaxed opacity-80 max-w-2xl">
               Changes to module switches are logged in the administrative audit trail. Disabling core financial nodes will freeze all active user requests instantly.
            </p>
         </div>
      </div>

      {loading && (
        <div className="fixed inset-0 z-[500] bg-slate-950/20 backdrop-blur-md flex items-center justify-center">
           <div className="bg-slate-950 text-white p-10 rounded-[44px] shadow-2xl flex flex-col items-center gap-6 border border-white/10 mx-4">
              <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center animate-spin shadow-2xl"><RefreshCw size={32} /></div>
              <p className="font-black text-[11px] uppercase tracking-[0.4em] italic">Updating Registry...</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default ModuleManager;