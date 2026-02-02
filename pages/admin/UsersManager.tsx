import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, UserCog, Gem, ShieldCheck, Filter, Search, Smartphone, Wallet
} from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import UserDetailModal from '../../components/admin/UserDetailModal';
import DataTable from '../../components/ui/DataTable';
import { api } from '../../utils/api';

const UserManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    setLoading(true);
    try {
      const list = await api.get('/admin/users');
      // Filter out non-user roles from the standard management list if desired
      const clientUsers = (list || []).filter((u: any) => u.role === 'user');
      setUsers(clientUsers);
    } catch (err) {
      console.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refreshData(); }, []);

  const filteredData = useMemo(() => {
    return users.filter(user => {
      const term = searchTerm.toLowerCase();
      const matchesSearch = (user.name?.toLowerCase().includes(term)) || 
                           (user.email?.toLowerCase().includes(term)) || 
                           (user.phone?.includes(term));
      const matchesFilter = activeFilter === 'All' || 
                           (activeFilter === 'Active' && !user.isBanned) || 
                           (activeFilter === 'Banned' && user.isBanned);
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, activeFilter, users]);

  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter(u => !u.isBanned).length,
    premium: users.filter(u => u.currentPlan && u.currentPlan !== 'None').length,
    totalPool: users.reduce((a, b) => a + (Number(b.balance) || 0), 0)
  }), [users]);

  const columns = [
    {
      header: 'Member Name',
      accessor: 'name',
      render: (_: any, row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 text-sky-400 flex items-center justify-center font-black italic shadow-lg shrink-0">
            {row.name?.charAt(0)}
          </div>
          <div>
            <p className="font-black text-slate-800 text-[11px] uppercase leading-none mb-1.5">{row.name}</p>
            <p className="text-[8px] font-bold text-slate-400 uppercase">{row.phone}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Earning Wallet',
      accessor: 'balance',
      render: (val: number) => (
        <span className="font-black text-indigo-600 text-xs">Rs {Number(val || 0).toLocaleString()}</span>
      )
    },
    {
      header: 'Current Station',
      accessor: 'currentPlan',
      render: (val: string) => (
        <span className="text-[8px] font-black bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg border border-indigo-100 uppercase">
          {val || 'None'}
        </span>
      )
    },
    {
      header: 'Account Status',
      accessor: 'isBanned',
      render: (val: boolean) => (
        <span className={clsx("text-[9px] font-black uppercase px-2 py-0.5 rounded-md border", val ? "text-rose-500 border-rose-100 bg-rose-50" : "text-emerald-600 border-emerald-100 bg-emerald-50")}>
           {val ? 'Suspended' : 'Verified'}
        </span>
      )
    },
    {
      header: 'Manage',
      accessor: 'id',
      render: (_: any, row: any) => (
        <button 
          onClick={() => setSelectedUser(row)}
          className="p-2.5 bg-slate-950 text-white rounded-xl shadow-lg hover:bg-indigo-600 transition-all active:scale-90"
        >
          <UserCog size={16} />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto px-1.5 pb-24">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 px-2 pt-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Registered <span className="text-indigo-600">Associates.</span></h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[8px] md:text-xs mt-2 italic">Client Database Hub</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-white px-5 py-4 rounded-[28px] border border-slate-100 shadow-sm flex items-center gap-3 shrink-0">
             <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner"><Users size={20}/></div>
             <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Partners</p>
                <p className="text-sm font-black text-slate-900">{stats.total}</p>
             </div>
           </div>
        </div>
      </header>

      <div className="bg-white p-1.5 rounded-[32px] border border-slate-100 shadow-sm mx-1 flex gap-1">
         {['All', 'Active', 'Banned'].map(f => (
           <button 
            key={f} onClick={() => setActiveFilter(f)} 
            className={clsx(
              "flex-1 py-4 rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all",
              activeFilter === f ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:text-slate-600"
            )}
           >
             {f}
           </button>
         ))}
      </div>

      <div className="bg-white rounded-[44px] border border-slate-100 shadow-sm overflow-hidden p-2">
         <DataTable 
           title="Member Registry"
           columns={columns}
           data={filteredData}
           isLoading={loading}
           onSearch={setSearchTerm}
         />
      </div>

      <UserDetailModal 
        isOpen={!!selectedUser} 
        onClose={() => setSelectedUser(null)} 
        user={selectedUser} 
        onUpdate={() => { refreshData(); setSelectedUser(null); }} 
      />
    </div>
  );
};

export default UserManager;