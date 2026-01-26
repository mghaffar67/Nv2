
import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { 
  FileText, 
  Search, 
  Puzzle, 
  Database,
  ChevronRight
} from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

const ConfigLink = ({ to, label, icon: Icon }: { to: string; label: string; icon: any }) => {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => clsx(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative group shrink-0 border",
        isActive 
          ? "bg-slate-900 text-white border-slate-900 shadow-xl" 
          : "text-slate-500 bg-white border-slate-100 hover:bg-slate-50"
      )}
    >
      <Icon size={14} className="shrink-0" />
      <span className="font-black text-[8px] uppercase tracking-widest">{label}</span>
    </NavLink>
  );
};

const ConfigLayout = () => {
  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto px-1.5 pb-20">
      <div className="px-2">
         <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight uppercase italic leading-none">Admin <span className="text-indigo-600">Config.</span></h1>
         <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px] mt-2 italic">Developer tools and page editing</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3">
          <div className="flex lg:flex-col gap-2 overflow-x-auto no-scrollbar py-1">
            <ConfigLink to="/admin/config/page-editor" label="Edit Pages" icon={FileText} />
            <ConfigLink to="/admin/config/seo" label="SEO Settings" icon={Search} />
            <ConfigLink to="/admin/config/integration" label="Popups & Code" icon={Puzzle} />
            <ConfigLink to="/admin/config/database" label="Database Connection" icon={Database} />
          </div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-9 bg-white rounded-[40px] border border-slate-100 shadow-sm p-6 md:p-10 min-h-[500px]">
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
};

export default ConfigLayout;
