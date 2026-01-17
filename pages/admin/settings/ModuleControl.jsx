
import React from 'react';
import { useConfig } from '../../../context/ConfigContext';
import { 
  Wallet, 
  UserPlus, 
  MessageCircle, 
  ShieldAlert, 
  Zap, 
  ArrowDownCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const ToggleCard = ({ title, status, icon: Icon, isActive, onToggle, description }) => {
  return (
    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-slate-200 transition-all">
      <div className="flex items-center gap-6">
        <div className={clsx(
          "w-16 h-16 rounded-[24px] flex items-center justify-center transition-all",
          isActive ? "bg-slate-900 text-sky-400 shadow-xl" : "bg-slate-50 text-slate-400"
        )}>
          <Icon size={28} />
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-900">{title}</h3>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{description}</p>
          <div className="flex items-center gap-2">
            <div className={clsx("w-2 h-2 rounded-full", isActive ? "bg-green-500 animate-pulse" : "bg-slate-300")} />
            <span className={clsx("text-[9px] font-black uppercase tracking-widest", isActive ? "text-green-600" : "text-slate-400")}>
              {isActive ? "System is Active" : "System Disabled"}
            </span>
          </div>
        </div>
      </div>

      <button 
        onClick={onToggle}
        className={clsx(
          "w-16 h-8 rounded-full transition-all relative flex items-center px-1.5",
          isActive ? "bg-sky-500" : "bg-slate-200"
        )}
      >
        <motion.div 
          animate={{ x: isActive ? 32 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="w-5 h-5 bg-white rounded-full shadow-sm"
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
      <div className="bg-slate-900 p-10 rounded-[44px] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5 scale-[2] rotate-12"><ShieldAlert size={64} /></div>
        <h2 className="text-2xl font-black mb-1">Module Command Hub</h2>
        <p className="text-slate-400 text-xs font-medium max-w-md">Enable or disable core platform features instantly. Changes take effect for all users globally.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ToggleCard 
          title="Deposit System"
          description="Funds Management"
          icon={ArrowDownCircle}
          isActive={config.modules.allowDeposits}
          onToggle={() => handleToggle('allowDeposits')}
        />
        <ToggleCard 
          title="Withdrawal System"
          description="Payout Control"
          icon={Wallet}
          isActive={config.modules.allowWithdrawals}
          onToggle={() => handleToggle('allowWithdrawals')}
        />
        <ToggleCard 
          title="New Registration"
          description="Growth Control"
          icon={UserPlus}
          isActive={config.modules.isRegistrationOpen}
          onToggle={() => handleToggle('isRegistrationOpen')}
        />
        <ToggleCard 
          title="Daily Task Station"
          description="Member Earnings"
          icon={Zap}
          isActive={config.modules.allowTaskSubmission}
          onToggle={() => handleToggle('allowTaskSubmission')}
        />
        <ToggleCard 
          title="Live Support Chat"
          description="Customer Care"
          icon={MessageCircle}
          isActive={config.modules.isChatSupportActive}
          onToggle={() => handleToggle('isChatSupportActive')}
        />
      </div>

      <div className="bg-amber-50 p-8 rounded-[40px] border border-amber-100 flex gap-6 items-center">
        <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 shrink-0">
          <ShieldAlert size={24} />
        </div>
        <p className="text-[11px] font-medium text-amber-700 leading-relaxed">
          <b>Warning:</b> Disabling a module like 'Withdrawal' will prevent all users from requesting payouts. Only use this for scheduled maintenance or security audits.
        </p>
      </div>
    </div>
  );
};

export default ModuleControl;
