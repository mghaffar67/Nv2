import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, Users, Briefcase, Wallet, Settings, 
  LogOut, Shield, Zap, Inbox, BarChart3, Clock,
  ChevronDown, ShieldAlert, FileText, Search, Puzzle, Database, Trophy,
  LineChart, Sliders
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { useAuth } from '../../context/AuthContext';
import { useConfig } from '../../context/ConfigContext';

const SidebarNavItem = ({ to, icon: Icon, label, isOpen, active, badge, themeColor, children }: any) => {
  const [isSubOpen, setIsSubOpen] = useState(false);
  const hasChildren = children && children.length > 0;

  useEffect(() => {
    if (active && hasChildren) setIsSubOpen(true);
  }, [active, hasChildren]);

  return (
    <div className="mb-1">
      <div className="relative group">
        {hasChildren ? (
          <button
            onClick={() => setIsSubOpen(!isSubOpen)}
            className={clsx(
              "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 overflow-hidden",
              active ? "bg-slate-950 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"
            )}
          >
            <div className="flex-shrink-0 w-5 flex justify-center">
              <Icon size={18} style={active ? { color: themeColor } : { color: 'inherit' }} />
            </div>
            <span className={clsx("font-bold text-[9px] uppercase tracking-widest whitespace-nowrap transition-all duration-300", isOpen ? "opacity-100" : "opacity-0 w-0")}>
              {label}
            </span>
            {isOpen && (
              <ChevronDown size={12} className={clsx("ml-auto transition-transform", isSubOpen && "rotate-180")} />
            )}
          </button>
        ) : (
          <Link to={to} className={clsx(
            "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 overflow-hidden", 
            active ? "bg-slate-950 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"
          )}>
            <div className="flex-shrink-0 w-5 flex justify-center">
              <Icon size={18} style={active ? { color: themeColor } : { color: 'inherit' }} />
            </div>
            <span className={clsx("font-bold text-[9px] uppercase tracking-widest whitespace-nowrap transition-all duration-300", isOpen ? "opacity-100" : "opacity-0 w-0")}>
              {label}
            </span>
            {isOpen && badge > 0 && (
              <span className="ml-auto min-w-[18px] h-[18px] text-white text-[8px] font-black rounded-full flex items-center justify-center ring-2 ring-white shadow-md px-1" style={{ backgroundColor: themeColor }}>{badge}</span>
            )}
          </Link>
        )}
      </div>

      <AnimatePresence>
        {hasChildren && isSubOpen && isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="pl-12 pr-2 space-y-1 mt-1"
          >
            {children.map((child: any) => (
              <Link
                key={child.to}
                to={child.to}
                className={clsx(
                  "block py-2 text-[8px] font-black uppercase tracking-widest transition-all",
                  useLocation().pathname === child.to ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
                )}
              >
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
  const { logout } = useAuth();
  const { config } = useConfig();
  const location = useLocation();
  const [counts, setCounts] = useState({ requests: 0, tasks: 0 });

  useEffect(() => {
    const syncBadges = () => {
      const db = JSON.parse(localStorage.getItem('noor_v3_master_registry') || '[]');
      let reqCount = 0;
      let taskCount = 0;
      db.forEach((u: any) => {
        if (u.transactions) reqCount += u.transactions.filter((t: any) => t.status === 'pending').length;
        if (u.workSubmissions) taskCount += u.workSubmissions.filter((s: any) => s.status === 'pending').length;
      });
      setCounts({ requests: reqCount, tasks: taskCount });
    };
    syncBadges();
    window.addEventListener('noor_db_update', syncBadges);
    return () => window.removeEventListener('noor_db_update', syncBadges);
  }, []);

  const adminMenu = [
    { to: '/admin/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/admin/requests', icon: Inbox, label: 'Requests Hub', badge: counts.requests },
    { to: '/admin/users', icon: Users, label: 'Members' },
    { to: '/admin/rewards', icon: Trophy, label: 'Reward Hub' },
    { to: '/admin/tasks', icon: Briefcase, label: 'Daily Tasks', badge: counts.tasks },
    { to: '/admin/finance', icon: BarChart3, label: 'Finance Hub' },
    { 
      to: '/admin/advanced', 
      icon: ShieldAlert, 
      label: 'Advanced Settings',
      children: [
        { to: '/admin/advanced/modules', label: 'Feature Control' },
        { to: '/admin/advanced/campaigns', label: 'Unified Campaigns' },
        { to: '/admin/advanced/global-cms', label: 'Global CMS' },
        { to: '/admin/advanced/page-editor', label: 'Page Content' },
        { to: '/admin/advanced/seo', label: 'SEO Config' },
        { to: '/admin/advanced/database', label: 'System DB' }
      ]
    },
    { 
      to: '/admin/settings', 
      icon: Settings, 
      label: 'System Config',
      children: [
        { to: '/admin/settings/general', label: 'Branding' },
        { to: '/admin/settings/appearance', label: 'Theme Logic' }
      ]
    }
  ];

  return (
    <>
      <AnimatePresence>
        {isMobileOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onMobileClose} className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] lg:hidden" />}
      </AnimatePresence>
      
      <aside className={clsx("fixed left-0 top-0 h-screen bg-white border-r border-slate-100 flex flex-col z-[110] transition-all duration-500 ease-in-out", isOpen ? "w-60" : "w-20", "max-lg:fixed max-lg:w-64", isMobileOpen ? "max-lg:translate-x-0" : "max-lg:-translate-x-full")}>
        <div className="px-6 flex items-center justify-between h-20 shrink-0">
          <div className={clsx("flex items-center gap-2.5", !isOpen && !isMobileOpen && "mx-auto")}>
            <div className="w-8 h-8 bg-slate-950 rounded-xl flex items-center justify-center shadow-xl shrink-0" style={{ color: config.theme.primaryColor }}><Shield size={16} /></div>
            {(isOpen || isMobileOpen) && <h2 className="font-black text-slate-900 text-base italic tracking-tighter uppercase">NOOR<span style={{ color: config.theme.primaryColor }}>HQ.</span></h2>}
          </div>
        </div>

        <nav className="flex-grow px-3 mt-2 space-y-0.5 overflow-y-auto no-scrollbar">
           {adminMenu.map((item) => (
             <SidebarNavItem 
               key={item.label}
               to={item.to}
               icon={item.icon}
               label={item.label}
               isOpen={isOpen || isMobileOpen}
               active={location.pathname === item.to || (item.children && item.children.some((c:any) => location.pathname === c.to))}
               badge={item.badge}
               themeColor={config.theme.primaryColor}
               children={item.children}
             />
           ))}
        </nav>

        {/* FIXED LOGOUT FOOTER: Never scrolls away, always visible */}
        <div className="p-4 bg-white border-t border-slate-50 mt-auto shrink-0 z-20">
          <button 
            onClick={logout} 
            className="w-full flex items-center justify-center gap-3 px-4 py-3 text-rose-500 bg-rose-50/50 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-95"
          >
            <LogOut size={16} /> {(isOpen || isMobileOpen) && "Terminate Session"}
          </button>
        </div>
      </aside>
    </>
  );
};