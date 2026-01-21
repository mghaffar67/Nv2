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
    const registry = dbNode.getUsers();
    setUsers(registry || []);
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
      header: 'Partner Node',
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
      header: 'Liquidity',
      accessor: 'balance',
      render: (val: number) => (
        <span className="font-black text-indigo-600 text-xs">Rs {Number(val || 0).toLocaleString()}</span>
      )
    },
    {
      header: 'Station',
      accessor: 'currentPlan',
      render: (val: string) => (
        <span className="text-[8px] font-black bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md border border-indigo-100 uppercase">
          {val || 'None'}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'isBanned',
      render: (val: boolean) => (
        <div className="flex items-center gap-1.5">
           <div className={clsx("w-1.5 h-1.5 rounded-full", val ? "bg-rose-500" : "bg-emerald-500 animate-pulse")} />
           <span className={clsx("text-[9px] font-black uppercase", val ? "text-rose-500" : "text-emerald-600")}>
              {val ? 'Suspended' : 'Operational'}
           </span>
        </div>
      )
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (_: any, row: any) => (
        <button 
          onClick={() => setSelectedUser(row)}
          className="p-2 bg-slate-950 text-white rounded-lg shadow-sm hover:scale-105 transition-all"
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
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Fleet <span className="text-indigo-600">Hub.</span></h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[8px] md:text-xs mt-2">Partner Network Intelligence</p>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          <AdminStatPill label="PARTNERS" value={stats.total} icon={Users} color="text-indigo-600 bg-indigo-50" />
          <AdminStatPill label="CAPITAL" value={`Rs.${(stats.totalPool / 1000).toFixed(1)}k`} icon={Wallet} color="text-emerald-600 bg-emerald-50" />
          <AdminStatPill label=" PREMIUM" value={stats.premium} icon={Gem} color="text-sky-600 bg-sky-50" />
        </div>
      </header>

      <div className="bg-white p-1.5 rounded-[28px] border border-slate-100 shadow-sm mx-1 flex gap-1">
         {['All', 'Active', 'Banned'].map(f => (
           <button 
            key={f} onClick={() => setActiveFilter(f)} 
            className={clsx(
              "flex-1 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all",
              activeFilter === f ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"
            )}
           >
             {f}
           </button>
         ))}
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden p-1">
         <DataTable 
           title="Active Partner Fleet"
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

const AdminStatPill = ({ label, value, icon: Icon, color }: any) => (
  <div className="bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 shrink-0">
     <div className={clsx("w-9 h-9 rounded-xl flex items-center justify-center shadow-inner", color)}><Icon size={16} /></div>
     <div>
        <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-sm font-black text-slate-900 leading-none">{value}</p>
     </div>
  </div>
);

export default UserManager;