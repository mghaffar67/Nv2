
import React from 'react';
import { ShieldCheck, Lock, Check, X, ShieldAlert, Zap, Users, Target } from 'lucide-react';
import { clsx } from 'clsx';

const ROLES = [
  { id: 'admin', label: 'Executive Admin', desc: 'Full control of every system node, finance and CMS.' },
  { id: 'manager', label: 'Operational Manager', desc: 'Can process tasks, verify vouchers and manage users.' },
  { id: 'support', label: 'Support Agent', desc: 'Only view details and respond to associate queries.' }
];

const PERMISSIONS = [
  { id: 'p1', label: 'Authorize Payments', roles: ['admin', 'manager'] },
  { id: 'p2', label: 'Modify Task Inventory', roles: ['admin', 'manager'] },
  { id: 'p3', label: 'System Logic Config', roles: ['admin'] },
  { id: 'p4', label: 'Member Termination (Ban)', roles: ['admin', 'manager'] },
  { id: 'p5', label: 'Business Analytics Node', roles: ['admin'] },
  { id: 'p6', label: 'Identity Adjustment', roles: ['admin', 'manager'] },
  { id: 'p7', label: 'Team Associate Hiring', roles: ['admin'] }
];

const RolePermissions = () => {
  return (
    <div className="space-y-10 animate-fade-in">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
             <h2 className="text-2xl font-black text-slate-900 uppercase italic leading-none">Role Matrix.</h2>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                <Lock size={14} className="text-indigo-600" /> Define Access Boundaries for Staff Nodes
             </p>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ROLES.map(role => (
            <div key={role.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6 group hover:border-indigo-200 transition-all">
               <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform"><ShieldCheck size={24}/></div>
               <div>
                  <h4 className="text-sm font-black text-slate-900 uppercase italic mb-2">{role.label}</h4>
                  <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-tight">{role.desc}</p>
               </div>
            </div>
          ))}
       </div>

       <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden p-2">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
             <h3 className="text-sm font-black text-slate-900 uppercase italic tracking-widest">Master Authority Ledger</h3>
             <div className="flex gap-4">
                {ROLES.map(r => (
                  <div key={r.id} className="flex items-center gap-1.5">
                     <div className={clsx("w-2 h-2 rounded-full", r.id === 'admin' ? "bg-indigo-600" : r.id === 'manager' ? "bg-sky-500" : "bg-slate-300")} />
                     <span className="text-[8px] font-black text-slate-400 uppercase">{r.id}</span>
                  </div>
                ))}
             </div>
          </div>
          <div className="divide-y divide-slate-50">
             {PERMISSIONS.map(perm => (
               <div key={perm.id} className="p-8 flex items-center justify-between group hover:bg-slate-50/50 transition-all">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-white group-hover:text-indigo-600 transition-all shadow-inner"><Target size={18}/></div>
                     <div>
                        <h4 className="text-[12px] font-black text-slate-800 uppercase tracking-tight">{perm.label}</h4>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Node Access Code: {perm.id.toUpperCase()}</p>
                     </div>
                  </div>
                  <div className="flex gap-3">
                     {ROLES.map(role => (
                       <div key={role.id} className={clsx(
                         "w-10 h-10 rounded-xl flex items-center justify-center transition-all border shadow-sm",
                         perm.roles.includes(role.id) ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-100 border-slate-100"
                       )}>
                          {perm.roles.includes(role.id) ? <Check size={18} strokeWidth={3}/> : <X size={18} strokeWidth={3}/>}
                       </div>
                     ))}
                  </div>
               </div>
             ))}
          </div>
       </div>

       <div className="p-10 bg-amber-50 rounded-[48px] border border-amber-100 flex items-start gap-6 shadow-sm mx-1">
          <ShieldAlert size={32} className="text-amber-600 shrink-0 mt-1" />
          <p className="text-[11px] text-amber-800 font-bold uppercase leading-relaxed tracking-wider italic">
             Security Enforcement: Root Admin (admin@noor.com) holds cryptographic master-key. Assigned staff roles only restrict visual access to the terminal UI nodes. 
          </p>
       </div>
    </div>
  );
};

export default RolePermissions;
