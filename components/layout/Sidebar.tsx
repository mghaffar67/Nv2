
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wallet, 
  Users, 
  Settings, 
  LogOut, 
  Zap,
  ChevronDown,
  History,
  UserCircle,
  Briefcase,
  Bell,
  CheckSquare,
  Sliders,
  Database,
  Search,
  Puzzle,
  FileText,
  Inbox,
  ShieldAlert,
  Trophy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { useAuth } from '../../context/AuthContext';
import { useConfig } from '../../context/ConfigContext';
import { api } from '../../utils/api';

const NavItem = ({ item, active, badge, isOpen, toggleSub, themeColor }: any) => {
  const hasSub = item.children && item.children.length > 0;
  const isSubOpen = isOpen === item.label;
  const location = useLocation();

  return (
    <div className="mb-0.5">
      <div className="relative group">
        <button
          onClick={() => hasSub ? toggleSub(item.label) : null}
          className={clsx(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative",
            active && !hasSub ? "bg-slate-950 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"
          )}
        >
          {!hasSub ? (
            <Link to={item.to} className="absolute inset-0 z-10" />
          ) : null}
          
          <div className="relative shrink-0">
            <item.icon size={15} style={active ? { color: themeColor } : {}} />
            {badge > 0 && (
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }} 
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-rose-500 rounded-full border-2 border-white flex items-center justify-center text-[5px] font-black text-white shadow-sm"
              >
                {badge}
              </motion.div>
            )}
          </div>

          <span className="font-black text-[8px] uppercase tracking-widest flex-grow text-left ml-0.5">
            {item.label}
          </span>

          {hasSub && (
            <ChevronDown 
              size={9} 
              className={clsx("transition-transform duration-300 opacity-30", isSubOpen && "rotate-180")} 
            />
          )}
        </button>
      </div>

      <AnimatePresence>
        {hasSub && isSubOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden pl-8 pr-2 space-y-0.5 mt-0.5"
          >
            {item.children.map((child: any) => (
              <Link
                key={child.label}
                to={child.to}
                className={clsx(
                  "flex items-center justify-between py-2 px-3 rounded-lg text-[6.5px] font-black uppercase tracking-widest transition-all",
                  location.pathname === child.to ? "bg-indigo-50 text-indigo-600" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                )}
              >
                <span>{child.label}</span>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Sidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose?: () => void }) => {
  const { config } = useConfig();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [openSub, setOpenSub] = useState<string | null>(null);
  const [stats, setStats] = useState({ deposits: 0, withdrawals: 0, total: 0 });

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const data = await api.get('/admin/pending-stats');
        setStats(data);
      } catch (e) { }
    };
    if (user?.role === 'admin') {
      fetchBadges();
      const int = setInterval(fetchBadges, 30000);
      return () => clearInterval(int);
    }
  }, [user?.role]);

  useEffect(() => {
    if (location.pathname.includes('/admin/advanced')) setOpenSub('Advanced Settings');
    else if (location.pathname.includes('/admin/settings')) setOpenSub('Basic Settings');
  }, [location.pathname]);

  const isAdmin = user?.role === 'admin';
  
  const menuStructure = isAdmin ? [
    { label: 'Overview', to: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Requests Hub', to: '/admin/requests', icon: Inbox, badge: stats.total },
    { label: 'Members', to: '/admin/users', icon: Users },
    { label: 'Reward Engine', to: '/admin/rewards', icon: Trophy },
    { label: 'Daily Tasks', to: '/admin/tasks', icon: Briefcase },
    { label: 'Financials', to: '/admin/finance', icon: History },
    { 
      label: 'Basic Settings', 
      icon: Settings,
      children: [
        { label: 'General', to: '/admin/settings/general' },
        { label: 'Branding', to: '/admin/settings/branding' },
        { label: 'Appearance', to: '/admin/settings/appearance' }
      ]
    },
    { 
      label: 'Advanced Settings', 
      icon: ShieldAlert,
      children: [
        { label: 'Edit Pages', to: '/admin/advanced/page-editor' },
        { label: 'SEO Settings', to: '/admin/advanced/seo' },
        { label: 'Third Party', to: '/admin/advanced/integration' },
        { label: 'Database', to: '/admin/advanced/database' }
      ]
    }
  ] : [
    { label: 'Dashboard', to: '/user/dashboard', icon: LayoutDashboard },
    { label: 'Daily Work', to: '/user/work', icon: Briefcase },
    { label: 'Bonus Hub', to: '/user/achievements', icon: Trophy },
    { label: 'My Wallet', to: '/user/wallet', icon: Wallet },
    { label: 'My Team', to: '/user/team', icon: Users },
    { label: 'My Profile', to: '/user/settings', icon: UserCircle },
  ];

  return (
    <aside className={clsx(
      "fixed inset-y-0 left-0 bg-white border-r border-slate-100 flex flex-col z-[100] transition-all duration-500 w-48 lg:translate-x-0",
      isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
    )}>
      <div className="h-14 flex items-center gap-3 px-6 shrink-0 border-b border-slate-50">
        <div className="w-7 h-7 bg-slate-950 rounded-lg flex items-center justify-center shadow-lg text-white">
          <Zap size={14} fill="currentColor" style={{ color: config.theme.primaryColor }} />
        </div>
        <h2 className="text-[11px] font-black tracking-tighter text-slate-950 italic uppercase">Noor<span style={{ color: config.theme.primaryColor }}>V3</span></h2>
      </div>

      <nav className="flex-grow px-2 overflow-y-auto no-scrollbar py-3">
        {menuStructure.map((item) => (
          <NavItem 
            key={item.label}
            item={item}
            active={location.pathname.startsWith(item.to)}
            badge={item.badge}
            isOpen={openSub}
            toggleSub={(name: string) => setOpenSub(openSub === name ? null : name)}
            themeColor={config.theme.primaryColor}
          />
        ))}
      </nav>

      <div className="p-3 mt-auto border-t border-slate-50">
        <button onClick={logout} className="w-full h-9 rounded-xl text-rose-500 bg-rose-50/50 hover:bg-rose-500 hover:text-white transition-all font-black text-[7px] uppercase tracking-widest flex items-center justify-center gap-2">
          <LogOut size={12} /> Sign Out
        </button>
      </div>
    </aside>
  );
};
