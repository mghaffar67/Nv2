
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
  ChevronRight
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../../context/AuthContext';

const NavItem = ({ to, label, icon: Icon, active, badge }: any) => (
  <Link 
    to={to} 
    className={clsx(
      "flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all relative group mb-1.5",
      active 
        ? "bg-indigo-600 text-white shadow-xl shadow-indigo-200" 
        : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
    )}
  >
    <Icon size={18} className={clsx("shrink-0", active ? "text-white" : "group-hover:text-indigo-600")} />
    <span className="font-bold text-[11px] uppercase tracking-widest flex-grow">{label}</span>
    {badge && (
      <div className="w-4 h-4 bg-rose-500 rounded-full flex items-center justify-center text-[8px] font-black text-white ring-2 ring-white">
        !
      </div>
    )}
    {active && <ChevronRight size={14} className="opacity-40" />}
  </Link>
);

export const Sidebar = ({ isOpen }: { isOpen: boolean }) => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const navItems = [
    { to: '/user/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/user/wallet', label: 'Deposit', icon: ArrowDownCircle },
    { to: '/user/wallet?tab=withdraw', label: 'Withdraw', icon: ArrowUpCircle },
    { to: '/user/plans', label: 'Plans', icon: Award },
    { to: '/user/work', label: 'Daily Work', icon: Briefcase, badge: true },
    { to: '/user/team', label: 'Team', icon: Users },
  ];

  return (
    <aside className={clsx(
      "fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-100 flex flex-col z-[100] transition-transform duration-300 ease-in-out lg:translate-x-0",
      isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
    )}>
      {/* Brand Node */}
      <div className="h-20 flex items-center gap-3 px-8 shrink-0">
        <div className="w-9 h-9 bg-slate-950 rounded-xl flex items-center justify-center text-sky-400 shadow-xl border border-white/10">
          <Zap size={18} fill="currentColor" />
        </div>
        <div>
          <h2 className="text-lg font-black tracking-tight text-slate-800 italic leading-none">NOOR<span className="text-indigo-600">V3</span></h2>
          <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mt-1">Authorized Hub</p>
        </div>
      </div>

      {/* Navigation Nodes */}
      <nav className="flex-grow px-4 overflow-y-auto no-scrollbar py-4">
        {navItems.map((item) => (
          <NavItem 
            key={item.to}
            to={item.to}
            label={item.label}
            icon={item.icon}
            active={location.pathname === item.to.split('?')[0]}
            badge={item.badge}
          />
        ))}

        <div className="mt-8 pt-8 border-t border-slate-50 px-2">
          <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-4 ml-2">Configuration</p>
          <NavItem to="/user/settings" label="Settings" icon={Settings} active={location.pathname === '/user/settings'} />
        </div>
      </nav>

      {/* Terminate Session */}
      <div className="p-4 mt-auto">
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-rose-500 bg-rose-50/50 hover:bg-rose-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest shadow-sm active:scale-95"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
