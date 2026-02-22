import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { 
  Search, Puzzle, Database, 
  ShieldAlert, ChevronRight, Target,
  Layout, Cpu, Activity, Globe, Sliders, Box, Layers,
  Terminal, ShieldCheck
} from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

const AdvancedLayout = () => {
  const location = useLocation();
  
  const subLinks = [
    { to: "/admin/advanced/modules", label: "Feature Control", icon: Sliders, desc: "Enable/Disable Modules" },
    { to: "/admin/advanced/content", label: "Page Content", icon: Layout, desc: "Edit Website Text" },
    { to: "/admin/advanced/campaigns", label: "Popups & Alerts", icon: Target, desc: "Marketing Notifications" },
    { to: "/admin/advanced/seo", label: "Search Settings", icon: Search, desc: "SEO Management" },
    { to: "/admin/advanced/integration", label: "Third-Party Tools", icon: Puzzle, desc: "Integration Scripts" },
    { to: "/admin/advanced/database", label: "Database Config", icon: Database, desc: "Core System Connection" }
  ];

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in max-w-7xl mx-auto px-1 pb-24">
      <header className="px-2 pt-4">
         <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg">
               <Sliders size={18} />
            </div>
            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 italic">System Configuration</span>
         </div>
         <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Advanced <span className="text-indigo-600">Control.</span></h1>
         <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px] md:text-[9px] mt-4 flex items-center gap-2 italic">
            <ShieldAlert size={14} className="text-indigo-500" /> System Settings & Management Center
         </p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-8 items-start">
        {/* Modern Settings Sidebar */}
        <div className="xl:col-span-3 flex xl:flex-col gap-2 overflow-x-auto no-scrollbar py-1 px-1">
          {subLinks.map(link => {
            const isActive = location.pathname === link.to;
            return (
              <NavLink 
                key={link.to}
                to={link.to} 
                className={clsx(
                  "flex items-center justify-between px-5 py-4 rounded-[28px] transition-all group shrink-0 border min-w-[220px] xl:w-full relative overflow-hidden",
                  isActive 
                    ? "bg-slate-950 text-white border-slate-950 shadow-xl" 
                    : "bg-white border-slate-50 text-slate-400 hover:bg-slate-50 hover:border-indigo-100"
                )}
              >
                <div className="flex items-center gap-4 relative z-10">
                  <div className={clsx(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-inner",
                    isActive ? "bg-indigo-600 text-white shadow-lg" : "bg-slate-50 text-slate-300"
                  )}>
                    <link.icon size={20} />
                  </div>
                  <div>
                    <span className="font-black text-[9px] uppercase tracking-widest block leading-none mb-1">{link.label}</span>
                    <span className="text-[7px] font-bold uppercase opacity-40 tracking-tighter">{link.desc}</span>
                  </div>
                </div>
                <ChevronRight size={12} className={clsx("transition-all relative z-10", isActive ? "translate-x-1 opacity-100" : "opacity-0 group-hover:opacity-100")} />
              </NavLink>
            );
          })}

          <div className="mt-6 p-6 bg-indigo-50/50 rounded-[32px] border border-indigo-100 hidden xl:block">
             <div className="flex items-center gap-2 mb-3">
                <ShieldCheck size={14} className="text-indigo-600" />
                <span className="text-[8px] font-black uppercase text-indigo-900">Security Status</span>
             </div>
             <p className="text-[7px] font-bold text-indigo-500 uppercase leading-relaxed tracking-wider">
               You are accessing advanced settings. All changes are saved and logged for security.
             </p>
          </div>
        </div>

        {/* Dynamic Viewport Hub */}
        <motion.div 
          key={location.pathname}
          initial={{ opacity: 0, x: 10 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.3 }}
          className="xl:col-span-9"
        >
          <div className="bg-white rounded-[44px] md:rounded-[56px] border border-slate-100 shadow-sm p-6 md:p-10 min-h-[600px] relative overflow-hidden">
             <div className="absolute top-0 right-0 p-10 opacity-[0.01] pointer-events-none rotate-12 scale-150">
               <Terminal size={200} />
             </div>
             <Outlet />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdvancedLayout;