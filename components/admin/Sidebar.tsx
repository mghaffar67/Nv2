
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, Users, Briefcase, Wallet, Settings, 
  LogOut, Shield, Zap, Inbox, BarChart3, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { useAuth } from '../../context/AuthContext';

const SidebarNavItem = ({ to, icon: Icon, label, isOpen, active, badge }: any) => (
  <Link to={to} className={clsx(
    "flex items-center gap-3 px-3.5 py-4 rounded-2xl transition-all duration-200 mb-1.5 overflow-hidden", 
    active ? "bg-slate-900 text-white shadow-xl" : "text-slate-500 hover:bg-slate-50"
  )}>
    <div className="flex-shrink-0 w-6 flex justify-center">
      <Icon size={18} className={clsx(active ? "text-sky-400" : "text-slate-400")} />
    </div>
    <span className={clsx("font-black text-[10px] uppercase tracking-[0.2em] whitespace-nowrap transition-all", isOpen ? "opacity-100" : "opacity-0 w-0")}>{label}</span>
    {isOpen && badge > 0 && (
      <span className="ml-auto w-5 h-5 bg-rose-500 text-white text-[8px] font-black rounded-full flex items-center justify-center ring-2 ring-white shadow-sm">{badge}</span>
    )}
  </Link>
);

export const Sidebar = ({ isOpen, onToggle, isMobileOpen, onMobileClose }: any) => {
  const { logout } = useAuth();
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
    const interval = setInterval(syncBadges, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isMobileOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onMobileClose} className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[100] lg:hidden" />}
      </AnimatePresence>
      
      <aside className={clsx("fixed left-0 top-0 h-screen bg-white border-r border-slate-100 flex flex-col z-[110] transition-all duration-500", isOpen ? "w-[240px]" : "w-[80px]", "max-lg:fixed max-lg:w-[260px]", isMobileOpen ? "max-lg:translate-x-0" : "max-lg:-translate-x-full")}>
        <div className="px-6 flex items-center justify-between h-20 shrink-0">
          <div className={clsx("flex items-center gap-3", !isOpen && !isMobileOpen && "hidden")}>
            <div className="w-9 h-9 bg-slate-950 rounded-xl flex items-center justify-center text-sky-400 shadow-lg"><Shield size={18} /></div>
            <h2 className="font-black text-slate-900 text-sm italic tracking-tighter">NOOR<span className="text-sky-500">PRO.</span></h2>
          </div>
        </div>

        <nav className="flex-grow px-3 mt-4 space-y-1 overflow-y-auto no-scrollbar">
           <SidebarNavItem to="/admin/dashboard" icon={Home} label="Home" isOpen={isOpen || isMobileOpen} active={location.pathname === '/admin/dashboard'} />
           <SidebarNavItem to="/admin/requests" icon={Inbox} label="Requests Hub" isOpen={isOpen || isMobileOpen} active={location.pathname === '/admin/requests'} badge={counts.requests} />
           <SidebarNavItem to="/admin/users" icon={Users} label="User List" isOpen={isOpen || isMobileOpen} active={location.pathname === '/admin/users'} />
           <SidebarNavItem to="/admin/tasks" icon={Briefcase} label="Daily Tasks" isOpen={isOpen || isMobileOpen} active={location.pathname === '/admin/tasks'} badge={counts.tasks} />
           <SidebarNavItem to="/admin/finance" icon={BarChart3} label="System Reports" isOpen={isOpen || isMobileOpen} active={location.pathname === '/admin/finance'} />
           <SidebarNavItem to="/admin/settings" icon={Settings} label="Global Settings" isOpen={isOpen || isMobileOpen} active={location.pathname.startsWith('/admin/settings')} />
        </nav>

        <div className="p-4 mt-auto">
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-4 text-rose-500 bg-rose-50/50 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">
            <LogOut size={18} /> {(isOpen || isMobileOpen) && "Logout"}
          </button>
        </div>
      </aside>
    </>
  );
};
