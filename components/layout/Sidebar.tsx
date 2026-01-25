
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ArrowDownCircle, 
  Award, 
  Briefcase, 
  Users, 
  Settings, 
  LogOut, 
  Zap,
  ChevronRight,
  History,
  UserCircle,
  Menu,
  ChevronLeft,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { useAuth } from '../../context/AuthContext';
import { useConfig } from '../../context/ConfigContext';

const NavItem = ({ to, label, icon: Icon, active, badge, onClick, collapsed, themeColor }: any) => (
  <Link 
    to={to} 
    onClick={onClick}
    className={clsx(
      "flex items-center gap-3 px-3 py-3 rounded-[20px] transition-all relative group mb-1",
      active 
        ? "bg-slate-950 text-white shadow-xl shadow-slate-200" 
        : "text-slate-400 hover:bg-slate-50",
      collapsed ? "justify-center px-2" : ""
    )}
  >
    <div className="relative">
      <Icon size={20} className={clsx("shrink-0", active ? "" : "group-hover:text-slate-900")} style={active ? { color: themeColor } : { color: 'inherit' }} />
      {badge > 0 && (
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }} 
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-black text-white" 
          style={{ backgroundColor: themeColor }}
        >
           {badge}
        </motion.div>
      )}
    </div>
    {!collapsed && (
      <span className="font-black text-[10px] uppercase tracking-[0.15em] flex-grow">
        {label}
      </span>
    )}
  </Link>
);

export const Sidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose?: () => void }) => {
  const { config } = useConfig();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const [badgeCount, setBadgeCount] = useState(0);

  useEffect(() => {
    const db = JSON.parse(localStorage.getItem('noor_v3_master_registry') || '[]');
    let pending = 0;
    db.forEach((u: any) => {
      if (u.transactions) pending += u.transactions.filter((t: any) => t.status === 'pending').length;
    });
    setBadgeCount(pending);
  }, [location.pathname]);

  const isAdmin = user?.role === 'admin';
  const navItems = isAdmin ? [
    { to: '/admin/dashboard', label: 'Command Hub', icon: LayoutDashboard },
    { to: '/admin/requests', label: 'Protocol Hub', icon: MessageSquare, badge: badgeCount },
    { to: '/admin/users', label: 'Member Fleet', icon: Users },
    { to: '/admin/tasks', label: 'Work Registry', icon: Briefcase },
    { to: '/admin/finance', label: 'Global Ledger', icon: History },
    { to: '/admin/settings', label: 'System Node', icon: Settings },
  ] : [
    { to: '/user/dashboard', label: 'My Hub', icon: LayoutDashboard },
    { to: '/user/work', label: 'Daily Cycle', icon: Briefcase },
    { to: '/user/wallet', icon: ArrowDownCircle, label: 'Capital Node' },
    { to: '/user/team', icon: Users, label: 'My Network' },
    { to: '/user/history', icon: History, label: 'Audit Log' },
    { to: '/user/plans', icon: Award, label: 'Station Hub' },
    { to: '/user/settings', icon: UserCircle, label: 'Identity' },
  ];

  return (
    <aside className={clsx(
      "fixed inset-y-0 left-0 bg-white border-r border-slate-100 flex flex-col z-[100] transition-all duration-500 lg:translate-x-0",
      isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <div className="h-20 flex items-center gap-4 px-6 shrink-0 justify-between">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-950 rounded-2xl flex items-center justify-center shadow-2xl" style={{ color: config.theme.primaryColor }}>
                <Zap size={20} fill="currentColor" />
              </div>
              <h2 className="text-sm font-black tracking-tighter text-slate-900 italic uppercase">NOOR<span style={{ color: config.theme.primaryColor }}>V3.</span></h2>
            </motion.div>
          )}
        </AnimatePresence>
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 hover:bg-slate-50 rounded-xl text-slate-300 hidden lg:block active:scale-90 transition-all">
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-grow px-3 overflow-y-auto no-scrollbar py-4 space-y-1">
        {navItems.map((item) => (
          <NavItem 
            key={item.label}
            to={item.to}
            label={item.label}
            icon={item.icon}
            active={location.pathname.startsWith(item.to)}
            badge={item.badge}
            onClick={() => window.innerWidth < 1024 && onClose?.()}
            collapsed={isCollapsed}
            themeColor={config.theme.primaryColor}
          />
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <button onClick={logout} className={clsx("w-full flex items-center gap-4 px-5 py-4 rounded-[24px] text-rose-500 bg-rose-50/50 hover:bg-rose-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest shadow-sm", isCollapsed && "justify-center px-0")}>
          <LogOut size={18} /> {!isCollapsed && "End Session"}
        </button>
      </div>
    </aside>
  );
};
