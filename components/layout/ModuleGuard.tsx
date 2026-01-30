import React from 'react';
import { useConfig } from '../../context/ConfigContext';
import { motion } from 'framer-motion';
import { ShieldAlert, RefreshCw, XCircle } from 'lucide-react';

interface ModuleGuardProps {
  module: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const DefaultFallback = ({ title }: { title: string }) => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-white rounded-[44px] border-2 border-dashed border-slate-100 shadow-inner">
     <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-[30px] flex items-center justify-center mb-8 shadow-xl">
        <ShieldAlert size={40} />
     </div>
     <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-4">Node Offline.</h2>
     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest max-w-sm leading-relaxed">
        The {title} module has been temporarily suspended for maintenance. Please check back shortly.
     </p>
  </div>
);

export const ModuleGuard: React.FC<ModuleGuardProps> = ({ module, children, fallback }) => {
  const { config } = useConfig();
  const isActive = config.modules?.[module];

  if (!isActive) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {fallback || <DefaultFallback title={module.replace('enable', '').replace('allow', '')} />}
      </motion.div>
    );
  }

  return <>{children}</>;
};