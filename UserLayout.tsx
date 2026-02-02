
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Menu, X, Bell, Zap, ShieldCheck, History, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import LiveChatWidget from '../layout/LiveChatWidget';

export const UserLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [lastActivity, setLastActivity] = useState<any>(null);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    setIsSidebarOpen(false);
    fetchActivity();
  }, [location.pathname]);

  const fetchActivity = async () => {
    try {
      const history = await api.get('/finance/history');
      if (history && history.length > 0) {
        setLastActivity(history[0]);
      }
    } catch (e) {
      console.warn("Activity tracker offline.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex overflow-x-hidden">
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[90] lg:hidden"
          />
        )}
      </AnimatePresence>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-grow flex flex-col min-w-0 lg:ml-48 transition-all duration-300">
        <header className="h-14 flex items-center justify-between px-4 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-[80] lg:hidden">
           <div className="flex items-center gap-3">
              <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-slate-950 text-white rounded-lg shadow-lg active:scale-95">
                <Menu size={18} />
              </button>
              <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg">
                <Zap size={14} fill="currentColor" />
              </div>
           </div>
           
           <div className="flex items-center gap-3">
              <Link to="/user/settings" className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-xs text-slate-600 italic">
                {user?.name?.charAt(0) || 'U'}
              </Link>
           </div>
        </header>

        <main className="p-3 md:p-6 flex-grow">
           <div className="max-w-4xl mx-auto">
              <Outlet />
           </div>
        </main>

        <footer className="hidden lg:flex px-6 py-3 bg-white border-t border-slate-100 justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-widest h-12">
           <div className="flex items-center gap-4">
              <span className="flex items-center gap-2">
                 <ShieldCheck size={12} className="text-indigo-500" /> Identity: {user?.id?.slice(-8)}
              </span>
              <span className="h-3 w-[1px] bg-slate-100" />
              {lastActivity ? (
                <div className="flex items-center gap-2 text-slate-500 italic">
                   <History size={12} className="text-slate-300" />
                   <span>Recent: </span>
                   <span className={lastActivity.type === 'withdraw' ? "text-rose-500" : "text-emerald-500"}>
                     {lastActivity.type === 'withdraw' ? 'Withdrawal' : lastActivity.type === 'deposit' ? 'Deposit' : 'Yield'}
                   </span>
                   <ArrowRight size={8} />
                   <span className="text-slate-900 not-italic font-black">{lastActivity.displayContext}</span>
                </div>
              ) : (
                <span className="text-slate-300 italic">No recent activity</span>
              )}
           </div>
           <span className="flex items-center gap-2">
             <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" /> 
             Live Synchronization Active
           </span>
        </footer>
      </div>

      {/* GLOBAL SUPPORT WIDGET */}
      <LiveChatWidget />
    </div>
  );
};
