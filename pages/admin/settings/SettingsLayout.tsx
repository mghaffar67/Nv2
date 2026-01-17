
import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { 
  Settings as GeneralIcon, 
  Layers as ModuleIcon, 
  Palette as AppearanceIcon, 
  Globe as SEOIcon,
  ChevronRight,
  FileText,
  Monitor,
  Search
} from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

const SettingsLink = ({ to, label, icon: Icon }: { to: string; label: string; icon: any }) => {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => clsx(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative group shrink-0",
        isActive 
          ? "bg-slate-900 text-white shadow-xl shadow-slate-200" 
          : "text-slate-500 hover:bg-slate-50"
      )}
    >
      <Icon size={16} className="shrink-0" />
      <span className="font-black text-[8px] md:text-[10px] uppercase tracking-widest">{label}</span>
      <ChevronRight size={10} className="opacity-10 group-hover:opacity-100 hidden md:block ml-auto" />
    </NavLink>
  );
};

const SettingsLayout = () => {
  return (
    <div className="space-y-4 animate-fade-in max-w-7xl mx-auto px-1.5 pb-20">
      <div className="px-2">
         <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Protocols.</h1>
         <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px] mt-1">Infrastructure Command Center</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-3">
          <div className="flex lg:flex-col gap-2 overflow-x-auto no-scrollbar pb-2 lg:pb-0">
            <SettingsLink to="/admin/settings/general" label="Core" icon={GeneralIcon} />
            <SettingsLink to="/admin/settings/modules" label="Modules" icon={ModuleIcon} />
            <SettingsLink to="/admin/settings/seo" label="SEO/Meta" icon={Search} />
            <SettingsLink to="/admin/settings/appearance" label="Landing" icon={Monitor} />
            <SettingsLink to="/admin/settings/cms" label="Legal CMS" icon={FileText} />
          </div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-9 bg-white rounded-[32px] md:rounded-[44px] border border-slate-100 shadow-sm p-5 md:p-10">
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsLayout;
