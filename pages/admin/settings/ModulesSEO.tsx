
import React from 'react';
import { useConfig } from '../../../context/ConfigContext';
import { 
  ShieldCheck, 
  Globe, 
  Search, 
  Settings as SettingsIcon,
  Zap,
  ArrowDownCircle,
  Wallet,
  UserPlus,
  Save
} from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const ToggleCard = ({ title, isActive, onToggle, icon: Icon, description }: any) => (
  <div className="bg-white p-6 rounded-[32px] border border-slate-100 flex items-center justify-between group">
    <div className="flex items-center gap-4">
      <div className={clsx(
        "w-12 h-12 rounded-[18px] flex items-center justify-center transition-all",
        isActive ? "bg-slate-900 text-sky-400" : "bg-slate-50 text-slate-300"
      )}>
        <Icon size={20} />
      </div>
      <div>
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">{title}</h3>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{description}</p>
      </div>
    </div>
    <button 
      onClick={onToggle}
      className={clsx(
        "w-12 h-6 rounded-full transition-all relative flex items-center px-1",
        isActive ? "bg-sky-500" : "bg-slate-200"
      )}
    >
      <motion.div 
        animate={{ x: isActive ? 24 : 0 }}
        className="w-4 h-4 bg-white rounded-full shadow-sm"
      />
    </button>
  </div>
);

const ModulesSEO = () => {
  const { config, updateConfig } = useConfig();

  const handleModuleToggle = (key: string) => {
    updateConfig({ 
      modules: { ...config.modules, [key]: !(config.modules as any)[key] } 
    });
  };

  const handleSEOChange = (key: string, value: string) => {
    updateConfig({
      seo: { ...config.seo, [key]: value }
    });
  };

  return (
    <div className="space-y-8 pb-24">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* MODULES SECTION */}
        <section className="bg-white p-8 md:p-10 rounded-[44px] border border-slate-100 shadow-sm space-y-8">
          <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-300 mb-8 flex items-center gap-2">
            <SettingsIcon size={18} /> Module Architecture
          </h2>
          
          <div className="space-y-4">
            <ToggleCard 
              title="Deposit System"
              description="Funds Gateway"
              icon={ArrowDownCircle}
              isActive={config.modules.deposit}
              onToggle={() => handleModuleToggle('deposit')}
            />
            <ToggleCard 
              title="Withdrawal System"
              description="Payout Portal"
              icon={Wallet}
              isActive={config.modules.withdraw}
              onToggle={() => handleModuleToggle('withdraw')}
            />
            <ToggleCard 
              title="Registration"
              description="New User Intake"
              icon={UserPlus}
              isActive={config.modules.register}
              onToggle={() => handleModuleToggle('register')}
            />
            <ToggleCard 
              title="Task Submission"
              description="Earning Engine"
              icon={Zap}
              isActive={config.modules.allowTaskSubmission}
              onToggle={() => handleModuleToggle('allowTaskSubmission')}
            />
          </div>
        </section>

        {/* SEO SECTION */}
        <section className="bg-white p-8 md:p-10 rounded-[44px] border border-slate-100 shadow-sm space-y-8">
          <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-300 mb-8 flex items-center gap-2">
            <Globe size={18} /> Search Optimization
          </h2>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Browser Title</label>
              <input 
                type="text"
                value={config.seo.title}
                onChange={(e) => handleSEOChange('title', e.target.value)}
                className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[24px] font-black text-slate-800 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Meta Description</label>
              <textarea 
                rows={3}
                value={config.seo.description}
                onChange={(e) => handleSEOChange('description', e.target.value)}
                className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[24px] font-bold text-xs text-slate-600 outline-none resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Keywords Index</label>
              <textarea 
                rows={3}
                value={config.seo.keywords}
                onChange={(e) => handleSEOChange('keywords', e.target.value)}
                className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[24px] font-bold text-xs text-slate-600 outline-none resize-none"
                placeholder="Comma separated tags..."
              />
            </div>
          </div>

          <button 
            onClick={() => alert('Search Tags Updated!')}
            className="w-full h-14 bg-slate-900 text-white rounded-[24px] font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-xl"
          >
            <Search size={16} /> Re-Index Metadata
          </button>
        </section>

      </div>
    </div>
  );
};

export default ModulesSEO;
