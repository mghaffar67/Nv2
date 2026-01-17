
import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  Wallet as WalletIcon, 
  History, 
  Settings as SettingsIcon, 
  LayoutDashboard, 
  Briefcase,
  Users,
  User,
  ChevronLeft,
  ChevronRight,
  Bell,
  LogOut,
  X,
  ShieldCheck,
  Search,
  Zap,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from './admin/Sidebar';
import Footer from './layout/Footer';

const NavItem = ({ to, label, icon: Icon, active, collapsed }: any) => (
  <Link 
    to={to} 
    className={clsx(
      "flex items-center gap-4 px-4 py-4 rounded-xl transition-all relative group mb-1",
      active ? "sidebar-item-active text-white" : "text-slate-400 hover:text-slate-900"
    )}
  >
    <Icon size={18} className={clsx("shrink-0", active ? "text-white" : "group-hover:text-slate-900")} />
    {!collapsed && (
      <span className="font-bold text-[11px] uppercase tracking-widest">{label}</span>
    )}
  </Link>
);

const BottomNav = () => {
  const location = useLocation();
  const navItems = [
    { to: '/user/dashboard', icon: LayoutDashboard, label: 'Home' },
    { to: '/user/work', icon: Briefcase, label: 'Work' },
    { to: '/user/wallet', icon: WalletIcon, label: 'Wallet' },
    { to: '/user/team', icon: Users, label: 'Team' },
    { to: '/user/settings', icon: SettingsIcon, label: 'Profile' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 px-1 py-1.5 z-[100] flex justify-around items-center safe-bottom shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)] h-16">
      {navItems.map((item) => {
        const isActive = location.pathname === item.to;
        return (
          <Link 
            key={item.to} 
            to={item.to} 
            className={clsx(
              "flex flex-col items-center justify-center gap-0.5 transition-all relative px-3 py-1 rounded-2xl min-w-[50px]",
              isActive ? "text-indigo-600" : "text-slate-400"
            )}
          >
            <item.icon size={18} strokeWidth={isActive ? 3 : 2} />
            <span className="text-[7px] font-black uppercase tracking-widest mt-0.5">{item.label}</span>
            {isActive && (
               <motion.div layoutId="bottomActive" className="absolute -top-1 w-1 h-1 rounded-full bg-indigo-600" />
            )}
          </Link>
        );
      })}
    </nav>
  );
};

export const UserLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex overflow-hidden">
      
      {/* Desktop Sidebar */}
      <aside className={clsx(
        "fixed inset-y-0 left-0 bg-white border-r border-slate-100 flex flex-col z-[70] transition-all duration-300 w-[240px]",
        "max-lg:hidden"
      )}>
        <div className="flex items-center gap-3 px-8 h-20 shrink-0">
          <div className="w-8 h-8 sidebar-item-active rounded-xl flex items-center justify-center text-white"><Zap size={16} fill="currentColor" /></div>
          <h2 className="text-lg font-black tracking-tight text-slate-800 italic">Noor<span className="text-indigo-500">.</span></h2>
        </div>

        <nav className="flex-grow px-4 overflow-y-auto no-scrollbar space-y-1 mt-4">
           <NavItem to="/user/dashboard" label="Dashboard" icon={LayoutDashboard} active={location.pathname === '/user/dashboard'} />
           <NavItem to="/user/work" label="Daily Work" icon={Briefcase} active={location.pathname === '/user/work'} />
           <NavItem to="/user/wallet" label="My Wallet" icon={WalletIcon} active={location.pathname === '/user/wallet'} />
           <NavItem to="/user/team" label="My Team" icon={Users} active={location.pathname === '/user/team'} />
           <NavItem to="/user/history" label="Activity History" icon={History} active={location.pathname === '/user/history'} />
           <NavItem to="/user/plans" label="Membership Plans" icon={Award} active={location.pathname === '/user/plans'} />
           <NavItem to="/user/settings" label="Settings" icon={SettingsIcon} active={location.pathname === '/user/settings'} />
        </nav>

        <div className="p-4 mt-auto">
           <button onClick={logout} className="w-full flex items-center gap-4 px-4 py-4 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all">
             <LogOut size={18} />
             <span className="font-bold text-[11px] uppercase tracking-widest">Sign Out</span>
           </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="flex-grow flex flex-col min-h-screen lg:ml-[240px] transition-all">
        
        <header className="h-14 md:h-20 flex items-center justify-between px-4 md:px-8 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center text-sky-400 lg:hidden shadow-lg"><Zap size={14} fill="currentColor" /></div>
              <h1 className="text-[8px] md:text-sm font-black uppercase tracking-[0.2em] text-slate-400">Noor <span className="text-slate-900 italic">V3</span></h1>
           </div>

           <div className="flex items-center gap-2 md:gap-5">
              <div className="text-right hidden sm:block">
                 <p className="text-xs font-black text-slate-800 leading-none mb-1">{user?.name || 'User'}</p>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Member</p>
              </div>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-slate-900 flex items-center justify-center text-white text-[10px] md:sm font-black italic shadow-lg border border-white/10">
                {user?.name?.charAt(0) || 'U'}
              </div>
           </div>
        </header>

        <main className="p-1.5 md:p-8 pb-24 lg:pb-8 max-w-full overflow-x-hidden flex-grow">
           <Outlet />
        </main>

        <BottomNav />
      </div>
    </div>
  );
};

export const Navbar = () => (
  <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 md:px-6 py-3.5 flex justify-between items-center sticky top-0 z-50">
    <div className="flex items-center gap-2 md:gap-3">
      <div className="w-7 h-7 md:w-8 md:h-8 sidebar-item-active rounded-lg flex items-center justify-center text-white font-black italic shadow-lg">N</div>
      <span className="font-black text-base md:text-lg tracking-tighter text-slate-800">Noor<span className="text-indigo-500">Official</span></span>
    </div>
    <Link to="/login" className="bg-slate-900 text-white px-5 py-2 rounded-lg font-black text-[9px] md:text-xs uppercase tracking-widest transition-all active:scale-95">Login</Link>
  </nav>
);

export const PublicLayout = () => (
  <div className="min-h-screen flex flex-col bg-[#f8f9fc]">
    <Navbar />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#f8f9fc] overflow-x-hidden flex">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
        isMobileOpen={isMobileSidebarOpen} 
        onMobileClose={() => setIsMobileSidebarOpen(false)} 
      />
      
      <div className={clsx(
        "flex-grow flex flex-col min-h-screen transition-all duration-500 ease-in-out", 
        isSidebarOpen ? "lg:ml-[240px]" : "lg:ml-[80px]"
      )}>
        <header className="h-14 md:h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center px-4 md:px-8 justify-between sticky top-0 z-40">
           <button 
             onClick={() => setIsMobileSidebarOpen(true)} 
             className="lg:hidden p-2 bg-slate-900 text-white rounded-xl shadow-lg active:scale-95"
           >
             <Menu size={18} />
           </button>
           <div className="flex items-center gap-3">
              <span className="text-[8px] md:text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Admin Dashboard</span>
           </div>
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 md:w-11 md:h-11 bg-slate-900 rounded-xl flex items-center justify-center text-sky-400 shadow-xl border border-white/5">
                <User size={16} />
              </div>
           </div>
        </header>
        <main className="p-2 md:p-8 max-w-full overflow-x-hidden pb-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
