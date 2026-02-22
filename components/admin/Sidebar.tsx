import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, Users, Briefcase, Wallet, Settings, 
  LogOut, Shield, Zap, Inbox, BarChart3, Clock,
  ChevronDown, ShieldAlert, FileText, Search, Puzzle, Database, Trophy,
  LineChart, Sliders, Headphones
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { useAuth } from '../../context/AuthContext';
import { useConfig } from '../../context/ConfigContext';
import { api } from '../../utils/api';

const SidebarNavItem = ({ item, active, badge, isOpen, toggleSub, themeColor }: any) => {
  const hasSub = item.children && item.children.length > 0;
  const isSubOpen = isOpen === item.label;
  const location = useLocation();

  return (
    <div className="mb-1">
      <button
        onClick={() => hasSub ? toggleSub(item.label) : null}
        className={clsx(
          "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all relative group",
          active && !hasSub ? "bg-slate-900 text-white shadow-xl" : "text-slate-500 hover:bg-slate-50"
        )}
      >
        {!hasSub && <Link to={item.to} className="absolute inset-0 z-10" />}
        <div className="shrink-0">
          <item.icon size={18} style={active ? { color: themeColor } : {}} />
          {badge > 0 && (
             <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[7px] font-black rounded-full flex items-center justify-center ring-2 ring-white">{badge}</span>
          )}
        </div>
        <span className="font-black text-[9px] uppercase tracking-widest flex-grow text-left">
          {item.label}
        </span>
        {hasSub && <ChevronDown size={12} className={clsx("transition-transform duration-300 opacity-40", isSubOpen && "rotate-180")} />}
      </button>

      <AnimatePresence>
        {hasSub && isSubOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pl-12 pr-2 space-y-1 mt-1">
            {item.children.map((child: any) => (
              <Link key={child.to} to={child.to} className={clsx("block py-2 text-[8px] font-black uppercase tracking-widest transition-all", location.pathname === child.to ? "text-indigo-600" : "text-slate-400 hover:text-slate-600")}>
                {child.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Sidebar = ({ isOpen, onToggle, isMobileOpen, onMobileClose }: any) => {
  const { logout, user } = useAuth();
  const { config } = useConfig();
  const location = useLocation();
  const [openSub, setOpenSub] = useState<string | null>(null);
  const [stats, setStats] = useState({ total: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try { const res = await api.get('/admin/pending-stats'); setStats(res); } catch(e){}
    };
    if(user?.role === 'admin') fetchStats();
  }, [user]);

  const menu = [
    { label: 'Overview', to: '/admin/dashboard', icon: Home },
    { label: 'Pending Approvals', to: '/admin/requests', icon: Inbox, badge: stats.total },
    { label: 'Member Registry', to: '/admin/users', icon: Users },
    { label: 'Daily Tasks', to: '/admin/tasks', icon: Briefcase },
    { label: 'Finance Reports', to: '/admin/finance', icon: BarChart3 },
    { label: 'Support Center', to: '/admin/support', icon: Headphones },
    { 
      label: 'Advance Settings', icon: ShieldAlert, 
      children: [
        { label: 'Manage Popups', to: '/admin/advanced/campaigns' },
        { label: 'Website Content', to: '/admin/advanced/global-cms' },
        { label: 'Custom Pages', to: '/admin/advanced/page-editor' },
        { label: 'SEO Settings', to: '/admin/advanced/seo' },
        { label: 'Database', to: '/admin/advanced/database' }
      ]
    },
    {
      label: 'Admin Team', icon: Settings,
      children: [
        { label: 'Branding', to: '/admin/settings/branding' },
        { label: 'Themes', to: '/admin/settings/appearance' },
        { label: 'Staff Management', to: '/admin/settings/team' }
      ]
    }
  ];

  return (
    <>
      <AnimatePresence>
        {isMobileOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onMobileClose} className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] lg:hidden" />}
      </AnimatePresence>
      
      <aside className={clsx(
        "fixed left-0 top-0 h-screen bg-white border-r border-slate-100 flex flex-col z-[110] transition-all duration-500", 
        isOpen ? "w-60" : "w-20", "max-lg:w-64", isMobileOpen ? "translate-x-0" : "max-lg:-translate-x-full"
      )}>
        <div className="px-6 flex items-center h-20 shrink-0 border-b border-slate-50 gap-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-xl shrink-0"><Shield size={18} /></div>
          {(isOpen || isMobileOpen) && <h2 className="font-black text-slate-900 text-sm italic uppercase tracking-tighter">Noor<span style={{ color: config.theme.primaryColor }}>HQ.</span></h2>}
        </div>

        <nav className="flex-grow px-3 py-4 space-y-0.5 overflow-y-auto no-scrollbar">
           {menu.map((item) => (
             <SidebarNavItem 
               key={item.label}
               item={item}
                               active={item.to ? location.pathname.startsWith(item.to) : false}
               badge={item.badge}
               isOpen={openSub}
               toggleSub={(l: string) => setOpenSub(openSub === l ? null : l)}
               themeColor={config.theme.primaryColor}
             />
           ))}
        </nav>

        <div className="p-4 bg-white border-t border-slate-100 shrink-0">
          <button onClick={logout} className="w-full flex items-center justify-center gap-3 px-4 py-3 text-rose-500 bg-rose-50/50 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-95">
            <LogOut size={16} /> {(isOpen || isMobileOpen) && "Logout"}
          </button>
        </div>
      </aside>
    </>
  );
};