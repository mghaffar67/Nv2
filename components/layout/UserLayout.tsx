
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Bell, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../context/AuthContext';

export const UserLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  // Auto-close sidebar on mobile when route changes (extra safety)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex">
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

      {/* 2. SIDEBAR NAVIGATION */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* 3. MAIN CONTENT AREA */}
      <div className="flex-grow flex flex-col min-w-0 lg:ml-64 transition-all">
        
        {/* MOBILE HEADER (Fixed Top) */}
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
              <button className="p-2 text-slate-400 relative">
                 <Bell size={20} />
                 <div className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
              </button>
              <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-slate-600 italic">
                {user?.name?.charAt(0) || 'U'}
              </div>
           </div>
        </header>

        {/* PAGE VIEWPORT */}
        <main className="p-3 md:p-8 flex-grow">
           <div className="max-w-5xl mx-auto">
              <Outlet />
           </div>
        </main>

        {/* DESKTOP FOOTER / STATUS BAR */}
        <footer className="hidden lg:flex px-8 py-4 bg-white border-t border-slate-100 justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
           <span>Secure Terminal Node: {user?.id?.slice(-8)}</span>
           <span className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> 
             System Encrypted & Live
           </span>
        </footer>
      </div>
    </div>
  );
};
