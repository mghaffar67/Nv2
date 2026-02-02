
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Wallet, Users, Settings, LogOut, 
  Zap, ChevronDown, History, UserCircle, Briefcase, 
  Inbox, Trophy, Package, Headphones, FileCheck, Target,
  ShieldCheck, BarChart3, CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';

const NavItem = ({ item, active, badge, isOpen, toggleSub }: any) => {
  const hasSub = item.children && item.children.length > 0;
  const isSubOpen = isOpen === item.label;
  const location = useLocation();

  return (
    <div className="mb-1">
      <div className="relative group">
        {hasSub ? (
          <button
            onClick={() => toggleSub(item.label)}
            className={clsx(
              "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all relative group",
              active ? "bg-slate-900 text-white shadow-xl" : "text-slate-500 hover:bg-slate-50"
            )}
          >
            <div className="shrink-0">
              <item.icon size={18} className={clsx(active ? "text-[#4A6CF7]" : "text-slate-400 group-hover:text-slate-900")} />
            </div>
            <span className="font-black text-[10px] uppercase tracking-widest flex-grow text-left">{item.label}</span>
            <ChevronDown size={12} className={clsx("transition-transform duration-300 opacity-40", isSubOpen && "rotate-180")} />
          </button>
        ) : (
          <Link
            to={item.to}
            className={clsx(
              "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all relative group",
              active ? "bg-slate-950 text-white shadow-xl" : "text-slate-500 hover:bg-slate-50"
            )}
          >
            <div className="shrink-0 relative">
              <item.icon size={18} className={clsx(active ? "text-[#4A6CF7]" : "text-slate-400 group-hover:text-slate-900")} />
              {badge > 0 && (
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-500 rounded-full border-2 border-white flex items-center justify-center text-[7px] font-black text-white shadow-sm">
                  {badge}
                </motion.div>
              )}
            </div>
            <span className="font-black text-[10px] uppercase tracking-widest flex-grow text-left">{item.label}</span>
          </Link>
        )}
      </div>

      <AnimatePresence>
        {hasSub && isSubOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }} 
            className="overflow-hidden pl-11 pr-2 space-y-1 mt-1"
          >
            {item.children.map((child: any) => (
              <Link 
                key={child.label} 
                to={child.to} 
                className={clsx(
                  "flex items-center justify-between py-2.5 px-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all", 
                  location.pathname === child.to ? "bg-indigo-50 text-[#4A6CF7]" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
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
  const location = useLocation();
  const { user, logout } = useAuth();
  const [openSub, setOpenSub] = useState<string | null>(null);
  const [stats, setStats] = useState({ total: 0 });

  useEffect(() => {
    const fetchBadges = async () => {
      try { 
        const data = await api.get('/admin/pending-stats'); 
        setStats(data); 
      } catch (e) { }
    };
    if (user?.role === 'admin') fetchBadges();
  }, [user?.role]);

  const isAdmin = user?.role === 'admin';
  
  const menuStructure = isAdmin ? [
    { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Requests Hub', to: '/admin/requests', icon: Inbox, badge: stats.total },
    { label: 'Users Manager', to: '/admin/users', icon: Users },
    { 
      label: 'Work Manager', icon: Briefcase,
      children: [
        { label: 'Review Assignments', to: '/admin/work/assignments' },
        { label: 'Task Config', to: '/admin/work/daily-config' },
        { label: 'Bonus Missions', to: '/admin/work/bonus' }
      ]
    },
    { label: 'Plan Manager', to: '/admin/plans', icon: Package },
    { label: 'Support Center', to: '/admin/support-hub', icon: Headphones },
    { label: 'Earning Ledger', to: '/admin/finance', icon: BarChart3 },
    { 
      label: 'Settings', icon: Settings,
      children: [
        { label: 'Branding', to: '/admin/advanced/global-cms' },
        { label: 'Features', to: '/admin/advanced/analytics' }
      ]
    }
  ] : [
    { label: 'Dashboard', to: '/user/dashboard', icon: LayoutDashboard },
    { label: 'Daily Work', to: '/user/work', icon: Briefcase },
    { label: 'Daily Reward', to: '/user/achievements', icon: Trophy },
    { label: 'My Balance', to: '/user/wallet', icon: CreditCard },
    { label: 'My Team', to: '/user/team', icon: Users },
    { label: 'My Profile', to: '/user/settings', icon: UserCircle },
  ];

  return (
    <aside className={clsx("fixed inset-y-0 left-0 bg-white border-r border-slate-100 flex flex-col z-[100] transition-all duration-500 w-60 lg:translate-x-0", isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full")}>
      <div className="h-20 flex items-center gap-3 px-8 shrink-0 border-b border-slate-50">
        <div className="w-10 h-10 bg-slate-950 rounded-2xl flex items-center justify-center shadow-xl text-white">
          <Zap size={20} fill="currentColor" className="text-[#4A6CF7]" />
        </div>
        <h2 className="text-[16px] font-black tracking-tighter text-slate-950 italic uppercase">Noor<span className="text-[#4A6CF7]">HQ</span></h2>
      </div>
      <nav className="flex-grow px-4 overflow-y-auto no-scrollbar py-8">
        {menuStructure.map((item) => (
          <NavItem 
            key={item.label} 
            item={item} 
            active={location.pathname === item.to || (item.children && item.children.some((c:any) => location.pathname === c.to))} 
            badge={item.badge} 
            isOpen={openSub} 
            toggleSub={(name: string) => setOpenSub(openSub === name ? null : name)} 
          />
        ))}
      </nav>
      <div className="p-4 mt-auto border-t border-slate-50">
        <button onClick={logout} className="w-full h-12 rounded-2xl text-rose-500 bg-rose-50/50 hover:bg-rose-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm"><LogOut size={16} /> End Session</button>
      </div>
    </aside>
  );
};
