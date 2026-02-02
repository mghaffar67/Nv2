import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  Wallet as WalletIcon, 
  History, 
  Settings as SettingsIcon, 
  LayoutDashboard, 
  Briefcase,
  Share2,
  User,
  ChevronLeft,
  ChevronRight,
  Bell,
  LogOut,
  X,
  ShieldCheck,
  Search,
  Zap,
  Award,
  ClipboardList,
  Network,
  CreditCard,
  TrendingUp
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
      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative group mb-1",
      active ? "bg-[#4A6CF7] text-white shadow-md" : "text-slate-400 hover:text-slate-900"
    )}
  >
    <Icon size={16} className={clsx("shrink-0", active ? "text-white" : "group-hover:text-slate-900")} />
    {!collapsed && (
      <span className="font-bold text-[9px] uppercase tracking-widest">{label}</span>
    )}
  </Link>
);

const BottomNav = () => {
  const location = useLocation();
  const navItems = [
    { to: '/user/dashboard', icon: LayoutDashboard, label: 'Home' },
    { to: '/user/work', icon: Briefcase, label: 'Work' },
    { to: '/user/wallet', icon: WalletIcon, label: 'Wallet' },
    { to: '/user/team', icon: Network, label: 'My Team' },
    { to: '/user/settings', icon: SettingsIcon, label: 'Profile' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-100 px-1 py-1 z-[100] flex justify-around items-center safe-bottom shadow-[0_-5px_20px_-10px_rgba(0,0,0,0.1)] h-14">
      {navItems.map((item) => {
        const isActive = location.pathname === item.to;
        return (
          <Link 
            key={item.to} 
            to={item.to} 
            className={clsx(
              "flex flex-col items-center justify-center gap-0 transition-all relative px-2 py-0.5 rounded-xl min-w-[45px]",
              isActive ? "text-[#4A6CF7]" : "text-slate-400"
            )}
          >
            <item.icon size={16} strokeWidth={isActive ? 3 : 2} />
            <span className="text-[6px] font-black uppercase tracking-widest mt-0.5">{item.label}</span>
            {isActive && (
               <motion.div layoutId="bottomActive" className="absolute -top-1 w-1 h-1 rounded-full bg-[#4A6CF7]" />
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
    <div className="min-h-screen bg-[#F7F9FC] flex w-full">
      
      {/* Desktop Sidebar */}
      <aside className={clsx(
        "fixed inset-y-0 left-0 bg-white border-r border-slate-100 flex flex-col z-[70] transition-all duration-300 w-60",
        "max-lg:hidden"
      )}>
        <div className="flex items-center gap-2.5 px-8 h-20 shrink-0">
          <div className="w-8 h-8 bg-[#4A6CF7] rounded-xl flex items-center justify-center text-white shadow-lg"><Zap size={16} fill="currentColor" /></div>
          <h2 className="text-base font-black tracking-tighter text-slate-800 italic uppercase">Noor<span className="text-[#4A6CF7]">.</span></h2>
        </div>

        <nav className="flex-grow px-4 overflow-y-auto no-scrollbar space-y-0.5 mt-2">
           <NavItem to="/user/dashboard" label="Dashboard" icon={LayoutDashboard} active={location.pathname === '/user/dashboard'} />
           <NavItem to="/user/work" label="Daily Work" icon={Briefcase} active={location.pathname === '/user/work'} />
           <NavItem to="/user/wallet" label="My Wallet" icon={WalletIcon} active={location.pathname === '/user/wallet'} />
           <NavItem to="/user/team" label="My Team" icon={Network} active={location.pathname === '/user/team'} />
           <NavItem to="/user/plans" label="Membership" icon={Award} active={location.pathname === '/user/plans'} />
           <NavItem to="/user/settings" label="Profile Settings" icon={SettingsIcon} active={location.pathname === '/user/settings'} />
        </nav>

        <div className="p-4 mt-auto">
           <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all">
             <LogOut size={16} />
             <span className="font-bold text-[9px] uppercase tracking-widest">Logout</span>
           </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="flex-grow flex flex-col min-h-screen lg:ml-60 transition-all w-full max-w-full">
        
        <header className="h-16 flex items-center justify-between px-4 md:px-8 bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 w-full">
           <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-slate-900 rounded-lg flex items-center justify-center text-sky-400 lg:hidden shadow-lg"><Zap size={14} fill="currentColor" /></div>
              <h1 className="text-[7px] md:text-sm font-black uppercase tracking-[0.2em] text-slate-400">Noor <span className="text-slate-900 italic">Official</span></h1>
           </div>

           <div className="flex items-center gap-4">
              {/* --- V3 PREMIUM WALLET PILL --- */}
              <Link to="/user/wallet" className="bg-slate-900 border border-white/10 px-5 py-2.5 rounded-[22px] flex items-center gap-4 group hover:bg-slate-800 transition-all shadow-xl">
                 <div className="w-8 h-8 rounded-xl bg-[#4A6CF7] shadow-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <TrendingUp size={16} />
                 </div>
                 <div className="text-left hidden sm:block">
                    <p className="text-[6px] font-black text-slate-500 uppercase tracking-[0.2em] leading-none mb-1.5">Aap ka Balance</p>
                    <p className="text-sm font-black text-white leading-none italic tracking-tighter">Rs. {(user?.balance || 0).toLocaleString()}</p>
                 </div>
                 <ChevronRight size={14} className="text-slate-500 group-hover:text-white transition-colors" />
              </Link>

              <div className="w-10 h-10 rounded-[14px] bg-[#4A6CF7] flex items-center justify-center text-white text-xs font-black italic shadow-xl border border-white/20">
                {user?.name?.charAt(0) || 'U'}
              </div>
           </div>
        </header>

        <main className="p-4 md:p-8 pb-20 lg:pb-8 w-full max-w-full flex-grow">
           <div className="max-w-7xl mx-auto">
              <Outlet />
           </div>
        </main>

        <BottomNav />
      </div>
    </div>
  );
};
// Navbar, PublicLayout, and AdminLayout logic remains consistent...
export const Navbar = () => (
  <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 md:px-6 py-3 flex justify-between items-center sticky top-0 z-50 h-14 md:h-16">
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 bg-[#4A6CF7] rounded-lg flex items-center justify-center text-white font-black italic shadow-lg text-sm">N</div>
      <span className="font-black text-sm md:text-base tracking-tighter text-slate-800 uppercase italic">Noor<span className="text-[#4A6CF7]">Official</span></span>
    </div>
    <Link 
      to="/login" 
      className="bg-slate-950 text-white px-5 py-2 rounded-xl font-black text-[9px] md:text-xs uppercase tracking-widest transition-all hover:bg-[#4A6CF7] active:scale-95 flex items-center gap-2 group"
    >
      Login 
      <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
    </Link>
  </nav>
);

export const PublicLayout = () => (
  <div className="min-h-screen flex flex-col bg-[#F7F9FC] w-full">
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
    <div className="min-h-screen bg-[#F7F9FC] flex w-full">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
        isMobileOpen={isMobileSidebarOpen} 
        onMobileClose={() => setIsMobileSidebarOpen(false)} 
      />
      
      <div className={clsx(
        "flex-grow flex flex-col min-h-screen transition-all duration-500 w-full", 
        isSidebarOpen ? "lg:ml-60" : "lg:ml-20"
      )}>
        <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-100 flex items-center px-4 md:px-8 justify-between sticky top-0 z-40">
           <button 
             onClick={() => setIsMobileSidebarOpen(true)} 
             className="lg:hidden p-2 bg-slate-950 text-white rounded-lg shadow-lg active:scale-95"
           >
             <Menu size={16} />
           </button>
           <div className="flex items-center gap-3">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] italic">COMMAND HUB V3</span>
           </div>
           <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                 <p className="text-[10px] font-black text-slate-800 leading-none mb-1">M Ghaffar (Owner)</p>
                 <span className="text-[7px] font-black uppercase text-[#2EC4B6] border border-[#2EC4B6]/20 px-2 py-0.5 rounded-full">Root Authority</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-sky-400 shadow-xl">
                <User size={16} />
              </div>
           </div>
        </header>
        <main className="p-4 md:p-8 max-w-full pb-10 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};