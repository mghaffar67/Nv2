
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Edit3, ShieldCheck, LogIn, Search, Zap, Award, Users, 
  UserCheck, UserX, Gem, Plus, ArrowUpRight, ArrowLeft,
  ChevronLeft, ChevronRight, Ban, UserCog, Wallet, Smartphone,
  Info, AlertCircle
} from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import UserDetailModal from '../../components/admin/UserDetailModal';
import { adminController } from '../../backend_core/controllers/adminController';

const UserManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await new Promise<any>((resolve) => {
        adminController.getAllUsers({}, { status: () => ({ json: resolve }) });
      });
      setUsers(Array.isArray(res) ? res : []);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const filteredData = useMemo(() => {
    return users.filter(user => {
      const term = searchTerm.toLowerCase();
      const matchesSearch = user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term) || user.phone.includes(term);
      const matchesFilter = activeFilter === 'All' || (activeFilter === 'Active' && !user.isBanned) || (activeFilter === 'Banned' && user.isBanned) || (activeFilter === 'Premium' && user.currentPlan && user.currentPlan !== 'None');
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, activeFilter, users]);

  const paginatedData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter(u => !u.isBanned).length,
    premium: users.filter(u => u.currentPlan && u.currentPlan !== 'None').length
  }), [users]);

  const handleGhostLogin = (row: any) => {
    if (!window.confirm(`Initialize Proxy Access as ${row.name}?`)) return;
    localStorage.setItem('noor_token', `jwt-noor-${row.id}`);
    localStorage.setItem('noor_user', JSON.stringify({ ...row, password: undefined, isImpersonated: true }));
    window.location.href = '#/user/dashboard';
    window.location.reload();
  };

  return (
    <div className="space-y-4 md:space-y-8 animate-fade-in max-w-7xl mx-auto px-1.5 pb-24">
      
      {/* 1. COMMAND HEADER */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 px-2 pt-4">
        <div className="space-y-1.5">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Fleet <span className="text-indigo-600">Hub.</span></h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[8px] md:text-xs">Partner Network Control Protocol</p>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <StatMini icon={Users} label="FLEET" value={stats.total} color="bg-slate-950" />
          <StatMini icon={UserCheck} label="ONLINE" value={stats.active} color="bg-emerald-500" />
          <StatMini icon={Gem} label="TIER 4" value={stats.premium} color="bg-indigo-600" />
        </div>
      </header>

      {/* 2. SEARCH & FILTER NODES */}
      <div className="bg-white p-4 md:p-8 rounded-[36px] md:rounded-[48px] border border-slate-100 shadow-sm space-y-6 mx-1">
         <div className="flex flex-col lg:flex-row items-center gap-4">
            <div className="w-full lg:flex-grow relative group">
               <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search Partner ID, Name, or Node..."
                 value={searchTerm}
                 onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                 className="w-full h-14 pl-14 pr-6 bg-slate-50 border border-slate-100 rounded-2xl font-black text-sm text-slate-800 outline-none focus:ring-4 focus:ring-indigo-50 transition-all"
               />
            </div>
            <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100 w-full lg:w-auto overflow-x-auto no-scrollbar shrink-0">
              {['All', 'Active', 'Banned', 'Premium'].map((f) => (
                <button key={f} onClick={() => setActiveFilter(f)} className={clsx("flex-1 px-6 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap", activeFilter === f ? "bg-white text-slate-900 shadow-md" : "text-slate-400")}>{f}</button>
              ))}
            </div>
         </div>

         {/* 3. RESPONSIVE DATA CONTAINER */}
         <div className="space-y-4">
            {loading ? (
              <div className="py-24 text-center"><div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" /><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scanning Registry...</p></div>
            ) : paginatedData.length === 0 ? (
              <div className="py-24 text-center bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200"><p className="text-slate-300 font-black uppercase text-[10px] tracking-widest">No Node Signal Found</p></div>
            ) : (
              <>
                {/* Desktop View (Table) */}
                <div className="hidden lg:block overflow-x-auto">
                   <table className="w-full text-left border-collapse">
                      <thead>
                         <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                            <th className="px-6 py-5">Identity Node</th>
                            <th className="px-6 py-5">Capital Balance</th>
                            <th className="px-6 py-5">Assigned Station</th>
                            <th className="px-6 py-5 text-right">Access</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                         {paginatedData.map(user => (
                           <tr key={user.id} className="hover:bg-slate-50/80 transition-colors group">
                              <td className="px-6 py-5">
                                 <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-xl bg-slate-950 text-sky-400 flex items-center justify-center font-black italic shadow-lg shrink-0">{user.name.charAt(0)}</div>
                                    <div>
                                       <p className="text-xs font-black text-slate-800 uppercase leading-none mb-1.5">{user.name}</p>
                                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{user.phone}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-5">
                                 <p className="text-sm font-black text-indigo-600">PKR {user.balance?.toLocaleString()}</p>
                                 <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">Liquid Assets</p>
                              </td>
                              <td className="px-6 py-5">
                                 <span className={clsx("px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border", user.currentPlan && user.currentPlan !== 'None' ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-slate-50 text-slate-400 border-slate-100")}>{user.currentPlan || 'BASIC'}</span>
                              </td>
                              <td className="px-6 py-5 text-right">
                                 <div className="flex justify-end gap-2">
                                    <button onClick={() => handleGhostLogin(user)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-xl transition-all shadow-sm"><LogIn size={16} /></button>
                                    <button onClick={() => setSelectedUser(user)} className="p-2.5 bg-slate-900 text-white rounded-xl transition-all shadow-md"><UserCog size={16} /></button>
                                 </div>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>

                {/* Mobile View (Cards) */}
                <div className="lg:hidden space-y-4">
                   {paginatedData.map(user => (
                     <div key={user.id} className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-5 space-y-4">
                        <div className="flex justify-between items-start">
                           <div className="flex items-center gap-3 overflow-hidden">
                              <div className="w-12 h-12 bg-slate-950 text-sky-400 rounded-[18px] flex items-center justify-center font-black italic shadow-lg shrink-0">{user.name.charAt(0)}</div>
                              <div className="overflow-hidden">
                                 <h4 className="font-black text-slate-900 text-sm truncate uppercase leading-none mb-2">{user.name}</h4>
                                 <div className="flex items-center gap-2">
                                    <div className={clsx("w-1.5 h-1.5 rounded-full", user.isBanned ? "bg-rose-500" : "bg-green-500 animate-pulse")} />
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">{user.phone}</p>
                                 </div>
                              </div>
                           </div>
                           <span className={clsx("px-2.5 py-1 rounded-lg text-[7px] font-black uppercase border", user.currentPlan && user.currentPlan !== 'None' ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-slate-50 text-slate-300 border-slate-100")}>{user.currentPlan || 'BASIC'}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                           <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col items-center">
                              <p className="text-[7px] font-black text-slate-400 uppercase mb-1">Balance</p>
                              <p className="text-xs font-black text-indigo-600">Rs {user.balance?.toLocaleString()}</p>
                           </div>
                           <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col items-center">
                              <p className="text-[7px] font-black text-slate-400 uppercase mb-1">Fleet ID</p>
                              <p className="text-xs font-black text-slate-800 truncate uppercase">{user.referralCode || 'NODE'}</p>
                           </div>
                        </div>

                        <div className="flex gap-2 pt-1">
                           <button onClick={() => handleGhostLogin(user)} className="flex-1 h-12 bg-slate-50 text-slate-500 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all"><LogIn size={18} /></button>
                           <button onClick={() => setSelectedUser(user)} className="flex-1 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg"><UserCog size={18} /></button>
                           <button onClick={() => alert('Ban Protocol Initialized')} className="w-12 h-12 bg-rose-50 text-rose-400 rounded-2xl border border-rose-100 flex items-center justify-center"><Ban size={18} /></button>
                        </div>
                     </div>
                   ))}
                </div>
              </>
            )}
         </div>

         {/* 4. PAGINATION TERMINAL */}
         <div className="flex items-center justify-between pt-6 border-t border-slate-50 px-2">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Signal Page <span className="text-slate-900">{page}</span> of {totalPages || 1}</p>
            <div className="flex gap-2">
               <button disabled={page === 1} onClick={() => setPage(prev => prev - 1)} className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center disabled:opacity-30 active:scale-90 transition-all border border-slate-100"><ChevronLeft size={20} /></button>
               <button disabled={page === totalPages || totalPages === 0} onClick={() => setPage(prev => prev + 1)} className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center disabled:opacity-30 active:scale-90 transition-all shadow-lg"><ChevronRight size={20} /></button>
            </div>
         </div>
      </div>

      <UserDetailModal 
        isOpen={!!selectedUser} 
        onClose={() => setSelectedUser(null)} 
        user={selectedUser} 
        onUpdate={() => { fetchUsers(); setSelectedUser(null); }} 
      />
    </div>
  );
};

const StatMini = ({ icon: Icon, label, value, color }: any) => (
  <div className="bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 shrink-0 active:scale-95 transition-all">
     <div className={clsx("w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-lg", color)}><Icon size={14} /></div>
     <div>
        <p className="text-[6px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1.5">{label}</p>
        <p className="text-sm font-black text-slate-900 leading-none">{value}</p>
     </div>
  </div>
);

export default UserManager;
