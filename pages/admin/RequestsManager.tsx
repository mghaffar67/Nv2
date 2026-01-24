
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Eye, RefreshCw, Package, Briefcase, Wallet, Clock, Check, X
} from 'lucide-react';
import { clsx } from 'clsx';
import { api } from '../../utils/api';
import { ProofModal } from '../../components/admin/ProofModal';

const RequestsManager = () => {
  const [activeTab, setActiveTab] = useState<'plans' | 'work' | 'payouts'>('plans');
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProof, setSelectedProof] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      let res: any = [];
      if (activeTab === 'plans') res = await api.get('/admin/finance/deposits');
      else if (activeTab === 'payouts') res = await api.get('/admin/finance/withdrawals');
      else if (activeTab === 'work') res = await api.get('/admin/work/submissions');
      
      setData(Array.isArray(res) ? res : []);
    } catch (e) {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [activeTab]);

  const filteredData = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return data.filter(item => 
      item.status === 'pending' && (
        item.userName?.toLowerCase().includes(term) || 
        item.userPhone?.includes(term)
      )
    );
  }, [data, searchTerm]);

  return (
    <div className="space-y-5 pb-24 animate-fade-in max-w-5xl mx-auto px-1">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 px-2 pt-4">
         <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Requests <span className="text-indigo-600">Center.</span></h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px] mt-1">Review and approve requests</p>
         </div>
         <button onClick={fetchData} className="w-9 h-9 bg-white rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 active:rotate-180 transition-all duration-500 shadow-sm"><RefreshCw size={14}/></button>
      </header>

      <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm mx-1">
         {[
           { id: 'plans', label: 'Deposits', icon: Package },
           { id: 'work', label: 'Tasks', icon: Briefcase },
           { id: 'payouts', label: 'Withdraws', icon: Wallet }
         ].map((tab) => (
           <button 
             key={tab.id} onClick={() => setActiveTab(tab.id as any)} 
             className={clsx(
               "flex-1 flex flex-col items-center justify-center py-2.5 rounded-xl transition-all",
               activeTab === tab.id ? "bg-slate-950 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"
             )}
           >
             <tab.icon size={14} />
             <span className="text-[7px] font-black uppercase mt-1 tracking-widest">{tab.label}</span>
           </button>
         ))}
      </div>

      <div className="relative group mx-1">
         <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
         <input type="text" placeholder="Search by name or phone..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full h-10 pl-10 pr-4 bg-white border border-slate-100 rounded-xl font-bold text-[10px] outline-none shadow-sm focus:ring-4 focus:ring-indigo-50" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 px-1">
        {loading ? (
          <div className="col-span-full py-20 text-center flex flex-col items-center gap-2">
             <RefreshCw className="animate-spin text-indigo-400" size={20} />
             <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Loading...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-[32px] text-center border-2 border-dashed border-slate-100 text-slate-300 font-black uppercase text-[9px]">No Pending Requests</div>
        ) : (
          filteredData.map((item) => (
            <motion.div layout key={item.id} className="bg-white p-4 rounded-[28px] border border-slate-100 shadow-sm flex flex-col justify-between">
               <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-lg bg-slate-900 text-sky-400 flex items-center justify-center font-black italic shadow-md shrink-0 text-xs">{item.userName?.charAt(0)}</div>
                     <div className="overflow-hidden">
                        <h4 className="font-black text-slate-900 text-[10px] truncate leading-tight uppercase">{item.userName}</h4>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">{item.userPhone}</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className={clsx("font-black text-[11px]", activeTab === 'payouts' ? "text-rose-600" : "text-emerald-600")}>Rs {item.amount}</p>
                  </div>
               </div>

               <div className="flex gap-2">
                  <button className="flex-grow h-9 bg-slate-950 text-white rounded-lg font-black text-[8px] uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2"><Check size={12}/> Approve</button>
                  <button className="px-3 h-9 bg-rose-50 text-rose-500 rounded-lg font-black text-[8px] uppercase border border-rose-100 active:scale-95 transition-all flex items-center justify-center gap-1"><X size={12}/> Reject</button>
                  {item.proofImage && <button onClick={() => setSelectedProof(item.proofImage)} className="w-9 h-9 bg-slate-50 text-indigo-500 rounded-lg flex items-center justify-center border border-slate-100"><Eye size={12}/></button>}
               </div>
            </motion.div>
          ))
        )}
      </div>
      <ProofModal isOpen={!!selectedProof} onClose={() => setSelectedProof(null)} imageUrl={selectedProof || ''} />
    </div>
  );
};

export default RequestsManager;
