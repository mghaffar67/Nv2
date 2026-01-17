
import React from 'react';
import { motion } from 'framer-motion';
import { Hammer, Zap, Info, ShieldAlert, LogOut } from 'lucide-react';
import { useConfig } from '../../context/ConfigContext';
import { useAuth } from '../../context/AuthContext';

interface MaintenanceGuardProps {
  children: React.ReactNode;
}

const MaintenanceGuard: React.FC<MaintenanceGuardProps> = ({ children }) => {
  const { config } = useConfig();
  const { user, logout } = useAuth();

  const isMaintenanceActive = config.maintenanceMode;
  const isAdmin = user?.role === 'admin';

  // If maintenance is ON and user is NOT an admin, show the block screen
  if (isMaintenanceActive && !isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-600/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 max-w-sm"
        >
          <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-[40px] flex items-center justify-center mx-auto mb-10 shadow-2xl backdrop-blur-xl">
             <Hammer size={48} className="text-amber-500 animate-bounce" />
          </div>

          <div className="space-y-4 mb-12">
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none">
              System <span className="text-amber-500">Lockdown.</span>
            </h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] leading-relaxed px-6">
              Our core nodes are currently undergoing routine maintenance for high-speed ledger synchronization.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] mb-10 backdrop-blur-md">
             <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-500 shrink-0">
                  <Info size={18} />
                </div>
                <div>
                   <p className="text-[8px] font-black text-white uppercase tracking-widest">Expected Restoration</p>
                   <p className="text-[10px] font-bold text-slate-400">Within 30-45 minutes</p>
                </div>
             </div>
          </div>

          <button 
            onClick={logout}
            className="w-full h-14 bg-white text-slate-900 rounded-[24px] font-black text-[10px] uppercase tracking-[0.3em] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
          >
             <LogOut size={16} /> Exit Session
          </button>
          
          <p className="mt-8 text-[8px] font-black text-slate-600 uppercase tracking-[0.4em]">Official Noor V3 Node</p>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
};

export default MaintenanceGuard;
