
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, Users, Briefcase, Wallet, Settings, 
  LogOut, ChevronRight, Menu, Shield, Zap,
  Inbox, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { useAuth } from '../../context/AuthContext';

const Badge = ({ count, color = 'bg-rose-500' }: { count: number, color?: string }) => {
  if (!count || count <= 0) return null;
  return (
    <motion.span 
      initial={{ scale: 0 }} animate={{ scale: 1 }}
      className={clsx("ml-auto flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[8px] font-black text-white ring-2 ring-white shadow-sm", color)}
    >
      {count > 99 ? '99+' : count}
    </motion.span>
  );
};

const SidebarNavItem = ({ to, icon: Icon, label, isOpen, onClick, active, badge }: any) => (
  <Link to={to} onClick={onClick} className={clsx(
    "flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-200 group mb-1.5 overflow-hidden", 
    active ? "bg-slate-900 text-white shadow-xl" : "text-slate-500 hover:bg-slate-50"
  )}>
    <div className="flex-shrink-0 w-8 flex justify-center">
      <Icon size={18} className={clsx(active ? "text-sky-400" : "text-slate-400 group-hover:text-slate-900")} />
    </div>
    <span className={clsx("font-bold text-[10px] uppercase tracking-widest whitespace-nowrap transition-all flex-grow", isOpen ? "opacity-100" : "opacity-0 w-0")}>{label}</span>
    {isOpen && badge > 0 && <Badge count={badge} />}
  </Link>
);

export const Sidebar = ({ isOpen, onToggle, isMobileOpen, onMobileClose }: any) => {
  const { logout } = useAuth();
  const location = useLocation();
  const [counts, setCounts] = useState({ requests: 0, tasks: 0, finance: 0 });

  useEffect(() => {
    const syncBadges = () => {
      const db = JSON.parse(localStorage.getItem('noor_mock_db') || '[]');
      let reqCount = 0;
      let taskCount = 0;
      let finCount = 0;
      
      db.forEach((u: any) => {
        if (u.transactions) {
          const pending = u.transactions.filter((t: any) => t.status === 'pending');
          reqCount += pending.length;
          finCount += pending.length; // Combined pending for finance node
        }
        if (u.workSubmissions) {
          taskCount += u.workSubmissions.filter((s: any) => s.status === 'pending').length;
        }
      });
      setCounts({ requests: reqCount, tasks: taskCount, finance: finCount });
    };
    syncBadges();
    const interval = setInterval(syncBadges, 5000);
    return () => clearInterval(interval);
  }, [location.pathname]);

  return (
    <>
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onMobileClose} className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[100] lg:hidden" />
        )}
      </AnimatePresence>
      
      <aside className={clsx(
        "fixed left-0 top-0 h-screen bg-white border-r border-slate-100 flex flex-col z-[110] transition-all duration-500 shadow-sm", 
        isOpen ? "w-[260px]" : "w-[80px]", 
        "max-lg:fixed max-lg:w-[280px]", 
        isMobileOpen ? "max-lg:translate-x-0" : "max-lg:-translate-x-full"
      )}>
        <div className="px-6 flex items-center justify-between h-20 shrink-0">
          <div className={clsx("flex items-center gap-3", !isOpen && !isMobileOpen && "hidden")}>
            <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-sky-400 shadow-xl"><Shield size={18} /></div>
            <div>
              <h2 className="font-black text-slate-900 text-sm tracking-tighter italic">NOOR<span className="text-sky-500">PRO.</span></h2>
              <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">Admin Control</p>
            </div>
          </div>
          <button onClick={onToggle} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 max-lg:hidden">
            <Menu size={18} />
          </button>
        </div>

        <nav className="flex-grow px-3 mt-4 overflow-y-auto no-scrollbar space-y-1">
           <SidebarNavItem to="/admin/dashboard" icon={Home} label="Overview" isOpen={isOpen || isMobileOpen} active={location.pathname === '/admin/dashboard'} />
           <SidebarNavItem to="/admin/requests" icon={Inbox} label="Requests Hub" isOpen={isOpen || isMobileOpen} active={location.pathname === '/admin/requests'} badge={counts.requests} />
           <SidebarNavItem to="/admin/users" icon={Users} label="Partner Fleet" isOpen={isOpen || isMobileOpen} active={location.pathname === '/admin/users'} />
           <SidebarNavItem to="/admin/tasks" icon={Briefcase} label="Task Node" isOpen={isOpen || isMobileOpen} active={location.pathname === '/admin/tasks'} badge={counts.tasks} />
           <SidebarNavItem to="/admin/finance" icon={Wallet} label="Accounting" isOpen={isOpen || isMobileOpen} active={location.pathname === '/admin/finance'} badge={counts.finance} />
           <SidebarNavItem to="/admin/settings" icon={Settings} label="Protocols" isOpen={isOpen || isMobileOpen} active={location.pathname.startsWith('/admin/settings')} />
        </nav>

        <div className="p-4 mt-auto">
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-4 text-rose-500 bg-rose-50/50 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">
            <LogOut size={18} /> {(isOpen || isMobileOpen) && "Terminate"}
          </button>
        </div>
      </aside>
    </>
  );
};
