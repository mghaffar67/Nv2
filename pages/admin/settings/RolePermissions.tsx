import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Lock, Check, X, ShieldAlert, Zap, Users, Target,
  Crown, Shield, User, Info, Save, RefreshCw, AlertCircle,
  Key, Globe, Database,
  // Added missing CheckCircle2 icon
  CheckCircle2
} from 'lucide-react';
import { clsx } from 'clsx';

const ROLES = [
  { id: 'admin', label: 'Executive Admin', desc: 'Full architectural and financial node authority.', icon: Crown, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { id: 'manager', label: 'Systems Manager', desc: 'Operational audit and member management privileges.', icon: Shield, color: 'text-sky-600', bg: 'bg-sky-50' },
  { id: 'user', label: 'Associate Partner', desc: 'Standard identity node with yield access.', icon: User, color: 'text-slate-400', bg: 'bg-slate-50' }
];

const PERMISSIONS = [
  { id: 'p1', label: 'Authorize Payouts', desc: 'Unlock financial disbursement corridors.', roles: ['admin', 'manager'] },
  { id: 'p2', label: 'Modify Task Inventory', desc: 'Add or terminate work assignment packets.', roles: ['admin', 'manager'] },
  { id: 'p3', label: 'System Logic Config', desc: 'Modify core constants and global variables.', roles: ['admin'] },
  { id: 'p4', label: 'Member Termination', desc: 'Revoke identity node access to the hub.', roles: ['admin', 'manager'] },
  { id: 'p5', label: 'Analytics Extraction', desc: 'Access business intelligence and growth logs.', roles: ['admin'] },
  { id: 'p6', label: 'Identity Adjustment', desc: 'Modify wallet balances and member tiers.', roles: ['admin', 'manager'] },
  { id: 'p7', label: 'Staff Integration', desc: 'Register or remove internal associate nodes.', roles: ['admin'] }
];

const RolePermissions = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSync = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="space-y-10 animate-fade-in pb-20">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2 pt-4">
          <div>
             <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase italic leading-none">Authority <span className="text-indigo-600">Matrix.</span></h2>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-3 flex items-center gap-2 italic">
                <Lock size={14} className="text-indigo-600" /> Cryptographic Node Authority Management
             </p>
          </div>
          <button 
            onClick={handleSync}
            disabled={loading}
            className="h-14 px-10 bg-slate-950 text-white rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
          >
            {loading ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} className="text-sky-400" />}
            Sync Authority Protocols
          </button>
       </div>

       {/* Role Definition Cards */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-1">
          {ROLES.map(role => (
            <motion.div 
              key={role.id} 
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6 group hover:border-indigo-200 transition-all relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12 scale-150 group-hover:rotate-45 transition-transform duration-[3s]"><role.icon size={80} fill="currentColor" /></div>
               <div className={clsx("w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform", role.bg, role.color)}>
                 <role.icon size={30}/>
               </div>
               <div className="relative z-10">
                  <h4 className="text-base font-black text-slate-900 uppercase italic mb-2 leading-none">{role.label}</h4>
                  <p className="text-[9px] font-bold text-slate-400 leading-relaxed uppercase tracking-tight italic opacity-80">{role.desc}</p>
               </div>
               <div className="flex items-center gap-2 relative z-10">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Active Protocol</span>
               </div>
            </motion.div>
          ))}
       </div>

       {/* Interactive Permission Matrix */}
       <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden p-2 mx-1">
          <div className="p-8 md:p-10 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/30">
             <div>
                <h3 className="text-lg font-black text-slate-900 uppercase italic tracking-tighter leading-none mb-2">Authority Ledger.</h3>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest italic">Inter-Role Access Node Mapping</p>
             </div>
             <div className="flex bg-white p-1 rounded-xl border border-slate-100 shadow-sm">
                {ROLES.map(r => (
                  <div key={r.id} className="flex items-center gap-2 px-4 py-2">
                     <div className={clsx("w-1.5 h-1.5 rounded-full", r.id === 'admin' ? "bg-indigo-600" : r.id === 'manager' ? "bg-sky-500" : "bg-slate-300")} />
                     <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{r.label?.split(' ')[1]}</span>
                  </div>
                ))}
             </div>
          </div>

          <div className="divide-y divide-slate-50">
             {PERMISSIONS.map(perm => (
               <div key={perm.id} className="p-8 md:p-10 flex items-center justify-between group hover:bg-slate-50/50 transition-all">
                  <div className="flex items-center gap-6">
                     <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-slate-200 group-hover:bg-slate-950 group-hover:text-indigo-400 transition-all shadow-inner border border-slate-50"><Zap size={22} fill="currentColor" /></div>
                     <div className="overflow-hidden">
                        <h4 className="text-[12px] md:text-[13px] font-black text-slate-800 uppercase tracking-tight leading-none mb-1.5">{perm.label}</h4>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest italic opacity-70 truncate max-w-[200px] md:max-w-none">{perm.desc}</p>
                     </div>
                  </div>
                  <div className="flex gap-4 md:gap-8">
                     {ROLES.map(role => (
                       <div key={role.id} className={clsx(
                         "w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-[18px] flex items-center justify-center transition-all border shadow-sm",
                         perm.roles.includes(role.id) ? "bg-slate-950 text-sky-400 border-slate-900" : "bg-white text-slate-100 border-slate-100"
                       )}>
                          {perm.roles.includes(role.id) ? <Check size={20} strokeWidth={4}/> : <X size={18} strokeWidth={3} className="opacity-20" />}
                       </div>
                     ))}
                  </div>
               </div>
             ))}
          </div>
       </div>

       {/* Security Disclaimer */}
       <div className="p-10 bg-slate-950 rounded-[48px] text-white flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden mx-1">
          <div className="absolute top-0 right-0 p-12 opacity-5"><Database size={100} /></div>
          <div className="w-20 h-20 bg-indigo-600 rounded-[30px] flex items-center justify-center text-white shadow-2xl shrink-0"><ShieldAlert size={36}/></div>
          <div>
            <h4 className="text-xl font-black italic tracking-tighter uppercase mb-2 text-sky-400 leading-none">Security <br/> Enforced.</h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase leading-relaxed tracking-wider italic max-w-xl opacity-90">
               Access Control Lists (ACL) are hard-coded into the API backend. Visual toggles in this matrix only affect UI visibility for Managers and Support Nodes. Executive Root Admin access remains immutable for system integrity.
            </p>
          </div>
       </div>

       <AnimatePresence>
          {success && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl z-[100] flex items-center gap-3 border-2 border-white/20">
               <CheckCircle2 size={18} /> Authority Hub Synchronized
            </motion.div>
          )}
       </AnimatePresence>
    </div>
  );
};

export default RolePermissions;