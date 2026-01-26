
import React from 'react';
import { useConfig } from '../../../context/ConfigContext';
import { 
  Wallet, 
  UserPlus, 
  MessageCircle, 
  ShieldAlert, 
  Zap, 
  ArrowDownCircle,
  LogIn,
  Trophy
} from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const ToggleCard = ({ title, status, icon: Icon, isActive, onToggle, description }) => {
  return (
    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-slate-200 transition-all">
      <div className="flex items-center gap-4">
        <div className={clsx(
          "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
          isActive ? "bg-slate-900 text-sky-400 shadow-lg" : "bg-slate-50 text-slate-300"
        )}>
          <Icon size={20} />
        </div>
        <div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">{title}</h3>
          <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">{description}</p>
          <div className="flex items-center gap-1.5">
            <div className={clsx("w-1.5 h-1.5 rounded-full", isActive ? "bg-green-500 animate-pulse" : "bg-slate-300")} />
            <span className={clsx("text-[7px] font-black uppercase tracking-widest", isActive ? "text-green-600" : "text-slate-400")}>
              {isActive ? "ON" : "OFF"}
            </span>
          </div>
        </div>
      </div>

      <button 
        onClick={onToggle}
        className={clsx(
          "w-12 h-6 rounded-full transition-all relative flex items-center px-1",
          isActive ? "bg-indigo-600" : "bg-slate-200"
        )}
      >
        <motion.div 
          animate={{ x: isActive ? 24 : 0 }}
          className="w-4 h-4 bg-white rounded-full shadow-sm"
        />
      </button>
    </div>
  );
};

const ModuleControl = () => {
  const { config, updateConfig } = useConfig();

  const handleToggle = (key) => {
    updateConfig({ 
      modules: { ...config.modules, [key]: !config.modules[key] } 
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-950 p-8 rounded-[40px] text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-10 opacity-5 scale-150 rotate-12"><ShieldAlert size={64} /></div>
        <h2 className="text-xl font-black mb-1 uppercase italic tracking-tighter">System Modules.</h2>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Enable or disable core functions instantly.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ToggleCard 
          title="Demo Logins"
          description="Landing Access"
          icon={LogIn}
          isActive={config.modules.demoLoginEnabled}
          onToggle={() => handleToggle('demoLoginEnabled')}
        />
        <ToggleCard 
          title="Rewards Hub"
          description="Achievement Bonus"
          icon={Trophy}
          isActive={config.modules.rewardsEnabled}
          onToggle={() => handleToggle('rewardsEnabled')}
        />
        <ToggleCard 
          title="Deposits"
          description="Plan Upgrade"
          icon={ArrowDownCircle}
          isActive={config.modules.allowDeposits}
          onToggle={() => handleToggle('allowDeposits')}
        />
        <ToggleCard 
          title="Withdrawals"
          description="Payout Gate"
          icon={Wallet}
          isActive={config.modules.allowWithdrawals}
          onToggle={() => handleToggle('allowWithdrawals')}
        />
        <ToggleCard 
          title="Registration"
          description="New Entries"
          icon={UserPlus}
          isActive={config.modules.isRegistrationOpen}
          onToggle={() => handleToggle('isRegistrationOpen')}
        />
        <ToggleCard 
          title="Task Console"
          description="Daily Earning"
          icon={Zap}
          isActive={config.modules.allowTaskSubmission}
          onToggle={() => handleToggle('allowTaskSubmission')}
        />
        <ToggleCard 
          title="Help Chat"
          description="Support Hub"
          icon={MessageCircle}
          isActive={config.modules.isChatSupportActive}
          onToggle={() => handleToggle('isChatSupportActive')}
        />
      </div>

      <div className="bg-amber-50 p-6 rounded-[32px] border border-amber-100 flex gap-4 items-center">
        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
          <ShieldAlert size={20} />
        </div>
        <p className="text-[9px] font-bold text-amber-800 uppercase leading-relaxed">
          Protocol Change: Modifying these settings will affect all active user nodes immediately. Use with caution during high traffic.
        </p>
      </div>
    </div>
  );
};

export default ModuleControl;
