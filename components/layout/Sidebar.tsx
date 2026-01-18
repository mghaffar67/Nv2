
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Award, 
  Briefcase, 
  Users, 
  Settings, 
  LogOut, 
  Zap,
  ChevronRight,
  History,
  UserCircle
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../../context/AuthContext';

const NavItem = ({ to, label, icon: Icon, active, badge, onClick }: any) => (
  <Link 
    to={to} 
    onClick={onClick}
    className={clsx(
      "flex items-center gap-4 px-4 py-4 rounded-2xl transition-all relative group mb-1.5",
      active 
        ? "bg-indigo-600 text-white shadow-xl shadow-indigo-200" 
        : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
    )}
  >
    <Icon size={20} className={clsx("shrink-0", active ? "text-white" : "group-hover:text-indigo-600")} />
    <span className="font-bold text-[11px] uppercase tracking-widest flex-grow">{label}</span>
    {badge && (
      <div className="w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center text-[9px] font-black text-white ring-4 ring-white">
        !
      </div>
    )}
    {active && <ChevronRight size={16} className="opacity-40" />}
  </Link>
);

export const Sidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose?: () => void }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  const navItems = [
    { to: '/user/dashboard', label: 'Home Node', icon: LayoutDashboard },
    { to: '/user/work', label: 'Earning Tasks', icon: Briefcase, badge: true },
    { to: '/user/wallet', label: 'Finance Hub', icon: ArrowDownCircle },
    { to: '/user/history', label: 'Audit History', icon: History },
    { to: '/user/plans', label: 'Membership', icon: Award },
    { to: '/user/team', label: 'Network Fleet', icon: Users },
    { to: '/user/profile', label: 'My Profile', icon: UserCircle },
  ];

  return (
    <aside className={clsx(
      "fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-100 flex flex-col z-[100] transition-transform duration-300 ease-in-out lg:translate-x-0",
      isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
    )}>
      {/* Brand Node */}
      <div className="h-20 flex items-center gap-3 px-8 shrink-0">
        <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center text-sky-400 shadow-xl border border-white/10">
          <Zap size={20} fill="currentColor" />
        </div>
        <div>
          <h2 className="text-xl font-black tracking-tight text-slate-800 italic leading-none">NOOR<span className="text-indigo-600">V3</span></h2>
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Partner Terminal</p>
        </div>
      </div>

      {/* Navigation Nodes */}
      <nav className="flex-grow px-4 overflow-y-auto no-scrollbar py-6">
        {navItems.map((item) => (
          <NavItem 
            key={item.label}
            to={item.to}
            label={item.label}
            icon={item.icon}
            active={location.pathname === item.to}
            badge={item.badge}
            onClick={handleLinkClick}
          />
        ))}

        <div className="mt-8 pt-8 border-t border-slate-50 px-2">
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-5 ml-2">Personal Node</p>
          <NavItem to="/user/settings" label="Withdrawal Info" icon={Settings} active={location.pathname === '/user/settings'} onClick={handleLinkClick} />
        </div>
      </nav>

      {/* Security Terminate */}
      <div className="p-4 mt-auto">
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-rose-500 bg-rose-50/50 hover:bg-rose-500 hover:text-white transition-all font-black text-[11px] uppercase tracking-widest shadow-sm active:scale-95"
        >
          <LogOut size={20} />
          <span>Exit Node</span>
        </button>
      </div>
    </aside>
  );
};
