
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
  CheckSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { useAuth } from '../../context/AuthContext';
import { useConfig } from '../../context/ConfigContext';
import { api } from '../../utils/api';

const NavItem = ({ item, active, badge, isOpen, toggleSub, collapsed, themeColor }: any) => {
  const hasSub = item.children && item.children.length > 0;
  const isSubOpen = isOpen === item.label;

  return (
    <div className="mb-1">
      <button
        onClick={() => hasSub ? toggleSub(item.label) : null}
        className={clsx(
          "w-full flex items-center gap-3 px-4 py-3.5 rounded-[22px] transition-all relative group",
          active && !hasSub ? "bg-slate-950 text-white shadow-xl" : "text-slate-500 hover:bg-slate-50"
        )}
      >
        {!hasSub ? (
          <Link to={item.to} className="absolute inset-0 z-10" />
        ) : null}
        
        <div className="relative">
          <item.icon size={20} style={active ? { color: themeColor } : {}} />
          {badge > 0 && (
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }} 
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 rounded-full border-2 border-white flex items-center justify-center text-[7px] font-black text-white shadow-sm"
            >
              {badge}
            </motion.div>
          )}
        </div>

        <span className="font-black text-[10px] uppercase tracking-widest flex-grow text-left ml-1">
          {item.label}
        </span>

        {hasSub && (
          <ChevronDown 
            size={14} 
            className={clsx("transition-transform duration-300", isSubOpen && "rotate-180")} 
          />
        )}
      </button>

      <AnimatePresence>
        {hasSub && isSubOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden pl-10 pr-2 space-y-1 mt-1"
          >
            {item.children.map((child: any) => (
              <Link
                key={child.label}
                to={child.to}
                className={clsx(
                  "flex items-center justify-between py-2.5 px-4 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all",
                  window.location.hash.includes(child.to) ? "bg-indigo-50 text-indigo-600" : "text-slate-400 hover:text-slate-600"
                )}
              >
                <span>{child.label}</span>
                {child.badge > 0 && (
                   <span className="w-4 h-4 bg-rose-500 text-white flex items-center justify-center rounded-full text-[6px] font-black">{child.badge}</span>
                )}
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
      } catch (e) { console.error("Badge fetch error"); }
    };
    if (user?.role === 'admin') {
      fetchBadges();
      const interval = setInterval(fetchBadges, 30000);
      return () => clearInterval(interval);
    }
  }, [user?.role]);

  const isAdmin = user?.role === 'admin';
  
  const menuStructure = isAdmin ? [
    { label: 'Overview', to: '/admin/dashboard', icon: LayoutDashboard },
    { 
      label: 'Finance Control', 
      icon: Wallet,
      badge: stats.total,
      children: [
        { label: 'Request Hub', to: '/admin/requests', badge: stats.total },
        { label: 'History', to: '/admin/finance' },
        { label: 'Settings', to: '/admin/settings/general' }
      ]
    },
    { label: 'Member List', to: '/admin/users', icon: Users },
    { label: 'Manage Tasks', to: '/admin/tasks', icon: Briefcase },
  ] : [
    { label: 'Home', to: '/user/dashboard', icon: LayoutDashboard },
    { label: 'Work', to: '/user/work', icon: Briefcase },
    { label: 'My Wallet', to: '/user/wallet', icon: Wallet },
    { label: 'Network', to: '/user/team', icon: Users },
    { label: 'Profile', to: '/user/settings', icon: UserCircle },
  ];

  return (
    <aside className={clsx(
      "fixed inset-y-0 left-0 bg-white border-r border-slate-100 flex flex-col z-[100] transition-all duration-500 w-64 lg:translate-x-0",
      isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
    )}>
      <div className="h-24 flex items-center gap-3 px-8 shrink-0">
        <div className="w-10 h-10 bg-slate-950 rounded-2xl flex items-center justify-center shadow-2xl text-white" style={{ color: config.theme.primaryColor }}>
          <Zap size={20} fill="currentColor" />
        </div>
        <h2 className="text-xl font-black tracking-tighter text-slate-950 italic uppercase">Noor<span style={{ color: config.theme.primaryColor }}>V3.</span></h2>
      </div>

      <nav className="flex-grow px-4 overflow-y-auto no-scrollbar py-6">
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

      <div className="p-6 mt-auto">
        <button onClick={logout} className="w-full h-14 rounded-3xl text-rose-500 bg-rose-50/50 hover:bg-rose-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest shadow-sm flex items-center justify-center gap-3">
          <LogOut size={18} /> End Session
        </button>
      </div>
    </aside>
  );
};
