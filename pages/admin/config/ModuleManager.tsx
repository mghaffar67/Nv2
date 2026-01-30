import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, UserPlus, LogIn, Wallet, ArrowDownCircle, 
  Zap, Trophy, CheckSquare, Settings, MessageCircle, 
  Loader2, CheckCircle2, ShieldCheck, Activity,
  Globe, Smartphone, Heart, Network
} from 'lucide-react';
import { useConfig } from '../../../context/ConfigContext';
import { clsx } from 'clsx';

const ModuleCard = ({ title, moduleKey, icon: Icon, isActive, onToggle, description, category }: any) => (
  <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-indigo-100 transition-all">
    <div className="flex items-center gap-4">
      <div className={clsx(
        "w-12 h-12 rounded-[18px] flex items-center justify-center transition-all",
        isActive ? "bg-slate-950 text-white shadow-lg" : "bg-slate-50 text-slate-300"
      )}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-[7px] font-black text-indigo-500 uppercase tracking-widest mb-1">{category}</p>
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">{title}</h3>
        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{description}</p>
      </div>
    </div>

    <button 
      onClick={() => onToggle(moduleKey)}
      className={clsx(
        "w-14 h-7 rounded-full relative flex items-center px-1 transition-all",
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
      setSuccessMsg(`${key.replace('enable', '').replace('is', '')} Updated!`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    {
      id: 'auth',
      label: 'Authentication Node',
      items: [
        { key: 'allowRegistration', title: 'New Registration', desc: 'Allow new signups', icon: UserPlus },
        { key: 'allowDemoLogin', title: 'Demo Access', desc: 'Toggle demo login buttons', icon: LogIn }
      ]
    },
    {
      id: 'finance',
      label: 'Financial Corridor',
      items: [
        { key: 'enableDeposits', title: 'Liquidity Inflow', desc: 'Accept deposit packets', icon: ArrowDownCircle },
        { key: 'enableWithdrawals', title: 'Liquidity Outflow', desc: 'Process withdrawal requests', icon: Wallet }
      ]
    },
    {
      id: 'earning',
      label: 'Earning Engine',
      items: [
        { key: 'enableDailyTasks', title: 'Work Inventory', desc: 'Show daily tasks to users', icon: Zap },
        { key: 'allowTaskSubmission', title: 'Work Verification', desc: 'Allow users to file proof', icon: CheckSquare },
        { key: 'enableDailyCheckIn', title: 'Check-in Rewards', desc: 'Active streak yield node', icon: Trophy }
      ]
    },
    {
      id: 'system',
      label: 'Core Infrastructure',
      items: [
        { key: 'isMaintenanceMode', title: 'Maintenance Lockdown', desc: 'Block access for nodes', icon: ShieldAlert },
        { key: 'enableReferralSystem', title: 'Network Protocol', desc: 'MLM commissions & team', icon: Network },
        { key: 'showPopups', title: 'Marketing Stream', desc: 'Display global popups', icon: Globe }
      ]
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-24">
      <header className="px-2 pt-4">
        <h1 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
          Master <span className="text-indigo-600">Switchboard.</span>
        </h1>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] mt-3 italic flex items-center gap-2">
           <Settings size={14} className="text-indigo-500" /> Real-time Platform Feature Governance
        </p>
      </header>

      {loading && (
        <div className="fixed inset-0 z-[300] bg-white/20 backdrop-blur-[2px] flex items-center justify-center">
           <div className="bg-slate-950 text-white p-6 rounded-3xl shadow-2xl flex items-center gap-4">
              <Loader2 className="animate-spin" size={24} />
              <span className="font-black text-[10px] uppercase tracking-widest">Updating System Nodes...</span>
           </div>
        </div>
      )}

      {successMsg && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] bg-emerald-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20">
           <CheckCircle2 size={20} />
           <span className="font-black text-[10px] uppercase tracking-widest">{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 px-2">
         {categories.map(cat => (
           <div key={cat.id} className="space-y-5">
              <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] ml-4 flex items-center gap-2">
                 <Activity size={12} className="text-indigo-500" /> {cat.label}
              </h3>
              <div className="space-y-3">
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

      <div className="p-8 bg-indigo-50 rounded-[44px] border border-indigo-100 flex items-start gap-6 mx-2 shadow-inner">
         <ShieldCheck size={32} className="text-indigo-600 shrink-0 mt-1" />
         <div>
            <h4 className="text-sm font-black text-indigo-900 uppercase italic">Executive Control Notice</h4>
            <p className="text-[10px] text-indigo-700 font-bold leading-relaxed uppercase tracking-widest mt-1">
               Toggling these switches sends a real-time signal to all active client nodes. Changes are irreversible without manual override. Use lockdown mode ONLY for maintenance.
            </p>
         </div>
      </div>
    </div>
  );
};

export default ModuleManager;