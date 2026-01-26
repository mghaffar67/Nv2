
import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { 
  FileText, 
  Search, 
  Puzzle, 
  Database,
  ShieldAlert,
  ChevronRight,
  BarChart3
} from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

const AdvancedLayout = () => {
  const subLinks = [
    { to: "/admin/advanced/analytics", label: "Module Analytics", icon: BarChart3 },
    { to: "/admin/advanced/page-editor", label: "Edit Pages", icon: FileText },
    { to: "/admin/advanced/seo", label: "SEO Settings", icon: Search },
    { to: "/admin/advanced/integration", label: "Third Party", icon: Puzzle },
    { to: "/admin/advanced/database", label: "System DB", icon: Database }
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto px-1.5 pb-20">
      <div className="px-2">
         <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight uppercase italic leading-none">Advanced <span className="text-indigo-600">Settings.</span></h1>
         <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px] mt-2 italic flex items-center gap-2">
            <ShieldAlert size={12} className="text-indigo-500" /> Professional Controls & Deployment Nodes
         </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3">
          <div className="flex lg:flex-col gap-2 overflow-x-auto no-scrollbar py-1">
            {subLinks.map(link => (
              <NavLink 
                key={link.to}
                to={link.to} 
                className={({ isActive }) => clsx(
                  "flex items-center justify-between px-5 py-4 rounded-2xl transition-all relative group shrink-0 border min-w-[140px]",
                  isActive 
                    ? "bg-slate-900 text-white border-slate-900 shadow-xl" 
                    : "text-slate-500 bg-white border-slate-100 hover:bg-slate-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <link.icon size={16} className="shrink-0" />
                  <span className="font-black text-[9px] uppercase tracking-widest">{link.label}</span>
                </div>
                <ChevronRight size={12} className="opacity-30 group-hover:opacity-100 transition-opacity" />
              </NavLink>
            ))}
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="lg:col-span-9 bg-white rounded-[40px] border border-slate-100 shadow-sm p-6 md:p-10 min-h-[500px]"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
};

export default AdvancedLayout;
