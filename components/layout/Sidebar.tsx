
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

const NavItem = ({ to, label, icon: Icon, active, badge, onClick, collapsed }: any) => (
  <Link 
    to={to} 
    onClick={onClick}
    className={clsx(
      "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative group mb-0.5",
      active 
        ? "bg-slate-900 text-white shadow-md shadow-slate-100" 
        : "text-slate-400 hover:bg-slate-50",
      collapsed ? "justify-center px-2" : ""
    )}
  >
    <div className="relative">
      <Icon size={18} className={clsx("shrink-0", active ? "text-sky-400" : "group-hover:text-slate-900")} />
      {badge > 0 && (
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }} 
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full border border-white" 
        />
      )}
    </div>
    {!collapsed && (
      <span className="font-black text-[9px] uppercase tracking-widest flex-grow">
        {label}
      </span>
    )}
  </Link>
);

export const Sidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose?: () => void }) => {
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
    { to: '/admin/dashboard', label: 'Home', icon: LayoutDashboard },
    { to: '/admin/requests', label: 'Requests', icon: MessageSquare, badge: badgeCount },
    { to: '/admin/users', label: 'Members', icon: Users },
    { to: '/admin/tasks', label: 'Work Hub', icon: Briefcase },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
  ] : [
    { to: '/user/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/user/work', label: 'Daily Work', icon: Briefcase },
    { to: '/user/wallet', icon: ArrowDownCircle, label: 'Wallet' },
    { to: '/user/team', icon: Users, label: 'Team' },
    { to: '/user/history', icon: History, label: 'History' },
    { to: '/user/plans', icon: Award, label: 'Plans' },
    { to: '/user/settings', icon: UserCircle, label: 'Profile' },
  ];

  return (
    <aside className={clsx(
      "fixed inset-y-0 left-0 bg-white border-r border-slate-100 flex flex-col z-[100] transition-all duration-500 lg:translate-x-0",
      isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full",
      isCollapsed ? "w-16" : "w-56"
    )}>
      <div className="h-16 flex items-center gap-3 px-5 shrink-0 justify-between">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-sky-400 shadow-lg">
                <Zap size={16} fill="currentColor" />
              </div>
              <h2 className="text-[11px] font-black tracking-tighter text-slate-800 italic uppercase">Noor<span className="text-indigo-600">Pro.</span></h2>
            </motion.div>
          )}
        </AnimatePresence>
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-300 hidden lg:block">
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="flex-grow px-2 overflow-y-auto no-scrollbar py-2">
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
          />
        ))}
      </nav>

      <div className="p-2 mt-auto">
        <button onClick={logout} className={clsx("w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500 bg-rose-50/30 hover:bg-rose-500 hover:text-white transition-all font-black text-[9px] uppercase tracking-widest", isCollapsed && "justify-center px-0")}>
          <LogOut size={16} /> {!isCollapsed && "Logout"}
        </button>
      </div>
    </aside>
  );
};
