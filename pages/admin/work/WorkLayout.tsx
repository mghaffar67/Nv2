
import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { ListChecks, Zap, Trophy } from 'lucide-react';
import { clsx } from 'clsx';

const WorkLayout = () => {
  const tabs = [
    { to: "/admin/work/assignments", label: "Assignment Manager", icon: ListChecks },
    { to: "/admin/work/daily-config", label: "Daily Task Config", icon: Zap },
    { to: "/admin/work/bonus", label: "Bonus Missions", icon: Trophy }
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto px-2">
      <div className="flex bg-white p-2 rounded-[32px] border border-slate-100 shadow-sm w-fit gap-2">
         {tabs.map(tab => (
           <NavLink 
             key={tab.to} 
             to={tab.to}
             className={({ isActive }) => clsx(
               "px-8 py-4 rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2.5",
               isActive ? "bg-slate-900 text-white shadow-2xl" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
             )}
           >
             <tab.icon size={16} />
             {tab.label}
           </NavLink>
         ))}
      </div>
      <div className="pb-24">
        <Outlet />
      </div>
    </div>
  );
};

export default WorkLayout;
