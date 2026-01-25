
import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { 
  Settings as GeneralIcon, 
  Palette, 
  ShieldCheck, 
  Image as ImageIcon,
  Monitor,
  Search,
  MessageSquare,
  ChevronRight,
  FileText,
  Database,
  Lock
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
          ? "bg-slate-900 text-white shadow-xl" 
          : "text-slate-500 hover:bg-slate-50"
      )}
    >
      <Icon size={16} className="shrink-0" />
      <span className="font-black text-[9px] uppercase tracking-widest">{label}</span>
    </NavLink>
  );
};

const SettingsLayout = () => {
  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto px-1.5 pb-20">
      <div className="px-2">
         <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight uppercase italic leading-none">Global <span className="text-indigo-600">Settings.</span></h1>
         <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px] mt-2">Manage all system parameters</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3">
          <div className="flex lg:flex-col gap-2 overflow-x-auto no-scrollbar bg-white p-2 rounded-3xl border border-slate-100 shadow-sm">
            <SettingsLink to="/admin/settings/general" label="Core System" icon={Lock} />
            <SettingsLink to="/admin/settings/branding" label="Branding & Info" icon={ImageIcon} />
            <SettingsLink to="/admin/settings/appearance" label="Themes & UI" icon={Palette} />
            <SettingsLink to="/admin/settings/seo" label="SEO Settings" icon={Search} />
            <SettingsLink to="/admin/settings/database" label="Database" icon={Database} />
            <SettingsLink to="/admin/settings/cms" label="CMS Pages" icon={FileText} />
          </div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-9 bg-white rounded-[40px] border border-slate-100 shadow-sm p-6 md:p-10">
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsLayout;
