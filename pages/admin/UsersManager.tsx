
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, UserCog, Gem, ShieldCheck, Filter, Search, Smartphone, Wallet
} from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import UserDetailModal from '../../components/admin/UserDetailModal';
import { dbNode } from '../../backend_core/utils/db';
import DataTable from '../../components/ui/DataTable';

const UserManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshData = () => {
    setLoading(true);
    const list = dbNode.getUsers();
    setUsers(list || []);
    setLoading(false);
  };

  useEffect(() => { refreshData(); }, []);

  const filteredData = useMemo(() => {
    return users.filter(user => {
      const term = searchTerm.toLowerCase();
      const matchesSearch = user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term) || user.phone.includes(term);
      const matchesFilter = activeFilter === 'All' || (activeFilter === 'Active' && !user.isBanned) || (activeFilter === 'Banned' && user.isBanned);
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
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-sky-400 flex items-center justify-center font-black italic shadow-lg shrink-0">
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
      header: 'Cash Balance',
      accessor: 'balance',
      render: (val: number) => (
        <span className="font-black text-indigo-600 text-xs">Rs {Number(val || 0).toLocaleString()}</span>
      )
    },
    {
      header: 'Plan',
      accessor: 'currentPlan',
      render: (val: string) => (
        <span className="text-[8px] font-black bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md border border-indigo-100 uppercase">
          {val || 'No Plan'}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'isBanned',
      render: (val: boolean) => (
        <span className={clsx("text-[9px] font-black uppercase", val ? "text-rose-500" : "text-emerald-600")}>
           {val ? 'Suspended' : 'Active'}
        </span>
      )
    },
    {
      header: 'Edit',
      accessor: 'id',
      render: (_: any, row: any) => (
        <button 
          onClick={() => setSelectedUser(row)}
          className="p-2 bg-slate-950 text-white rounded-lg shadow-sm"
        >
          <UserCog size={14} />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto px-1.5 pb-24">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 px-2 pt-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Members <span className="text-indigo-600">List.</span></h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[8px] md:text-xs mt-2">Manage All Registered Users</p>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
           <div className="bg-white px-4 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 shrink-0">
             <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><Users size={16}/></div>
             <p className="text-sm font-black text-slate-900">{stats.total} Members</p>
           </div>
        </div>
      </header>

      <div className="bg-white p-1 rounded-[24px] border border-slate-100 shadow-sm mx-1 flex gap-1">
         {['All', 'Active', 'Banned'].map(f => (
           <button 
            key={f} onClick={() => setActiveFilter(f)} 
            className={clsx(
              "flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
              activeFilter === f ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"
            )}
           >
             {f}
           </button>
         ))}
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden p-1">
         <DataTable 
           title="Platform Members"
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
