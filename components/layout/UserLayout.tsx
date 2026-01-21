import React, { useState, useEffect } from 'react';
// Fix: Moved Link import to the top with other react-router-dom imports for cleaner scope
import { Outlet, useLocation, Link } from 'react-router-dom';
// Fix: Added ShieldCheck to lucide-react imports to resolve "Cannot find name 'ShieldCheck'" error
import { Menu, X, Bell, Zap, UserCircle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../context/AuthContext';

export const UserLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  // Auto-close sidebar on mobile when route changes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex overflow-x-hidden">
      {/* 1. BACKDROP OVERLAY (Mobile Only) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[90] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* 2. COLLAPSIBLE SIDEBAR */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* 3. MAIN WORKSPACE */}
      <div className="flex-grow flex flex-col min-w-0 lg:ml-64 transition-all duration-300">
        
        {/* MOBILE HEADER */}
        <header className="h-16 flex items-center justify-between px-4 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-[80] lg:hidden">
           <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2.5 bg-slate-950 text-white rounded-xl shadow-lg active:scale-95"
              >
                <Menu size={20} />
              </button>
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg">
                <Zap size={16} fill="currentColor" />
              </div>
           </div>
           
           <div className="flex items-center gap-3">
              <Link to="/user/profile" className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-slate-600 italic">
                {user?.name?.charAt(0) || 'U'}
              </Link>
           </div>
        </header>

        {/* MAIN VIEWPORT */}
        <main className="p-3 md:p-8 flex-grow">
           <div className="max-w-5xl mx-auto">
              <Outlet />
           </div>
        </main>

        {/* STATUS BAR (Desktop Only) */}
        <footer className="hidden lg:flex px-8 py-4 bg-white border-t border-slate-100 justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
           <span className="flex items-center gap-2">
              <ShieldCheck size={12} className="text-indigo-500" /> Terminal: {user?.id?.slice(-8)}
           </span>
           <span className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> 
             Ledger Synchronized
           </span>
        </footer>
      </div>
    </div>
  );
};
