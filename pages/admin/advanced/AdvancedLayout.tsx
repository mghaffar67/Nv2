import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { 
  FileText, Search, Puzzle, Database, 
  ShieldAlert, ChevronRight, BarChart3, Target,
  Layout, Settings as SettingsIcon, Globe
} from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

const AdvancedLayout = () => {
  const subLinks = [
    { to: "/admin/advanced/analytics", label: "Module Analytics", icon: BarChart3 },
    { to: "/admin/advanced/global-cms", label: "Global Content", icon: Globe },
    { to: "/admin/advanced/page-editor", label: "Edit Pages", icon: FileText },
    { to: "/admin/advanced/campaigns", label: "Campaign Hub", icon: Target },
    { to: "/admin/advanced/seo", label: "SEO Settings", icon: Search },
    { to: "/admin/advanced/integration", label: "Third Party", icon: Puzzle },
    { to: "/admin/advanced/database", label: "System DB", icon: Database }
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto px-4 pb-24 bg-[#F7F9FC] min-h-screen pt-4">
      <div className="px-2 mb-8">
         <h1 className="text-3xl font-black text-[#1F2937] tracking-tight uppercase italic leading-none">ADVANCED SETTINGS</h1>
         <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2 italic flex items-center gap-2">
            <ShieldAlert size={14} className="text-[#4A6CF7]" /> Master Configuration Hub
         </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-3">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-3 space-y-1">
            {subLinks.map(link => (
              <NavLink 
                key={link.to}
                to={link.to} 
                className={({ isActive }) => clsx(
                  "flex items-center justify-between px-5 py-4 rounded-2xl transition-all relative group shrink-0 border-2",
                  isActive 
                    ? "bg-[#1F2937] border-[#1F2937] text-white shadow-xl" 
                    : "text-slate-500 bg-white border-transparent hover:border-slate-50 hover:bg-slate-50"
                )}
              >
                <div className="flex items-center gap-4">
                  <link.icon size={18} className={clsx("shrink-0", "opacity-80")} />
                  <span className="font-black text-[10px] uppercase tracking-widest">{link.label}</span>
                </div>
                <ChevronRight size={14} className="opacity-30 group-hover:opacity-100 transition-opacity" />
              </NavLink>
            ))}
          </div>
          
          <div className="mt-8 p-6 bg-indigo-50 border border-indigo-100 rounded-3xl flex items-center gap-4">
             <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg"><SettingsIcon size={20}/></div>
             <p className="text-[9px] font-black uppercase text-indigo-700 leading-relaxed italic">Changes made here are pushed live instantly.</p>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="lg:col-span-9 bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 md:p-12 min-h-[600px] relative overflow-hidden"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
};

export default AdvancedLayout;