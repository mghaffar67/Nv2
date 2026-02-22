import React, { useState, useEffect, useMemo } from 'react';
import DataTable from '../../../components/ui/DataTable';
import { ImageModal } from '../../../components/ui/ImageModal';
import { 
  Check, 
  X, 
  Eye, 
  ShieldCheck, 
  Clock, 
  AlertCircle,
  TrendingUp,
  User as UserIcon,
  RefreshCw
} from 'lucide-react';
import { clsx } from 'clsx';
import { api } from '../../../utils/api';

const Deposits = () => {
  const [allData, setAllData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchDeposits = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/finance/deposits');
      setAllData(res || []);
    } catch (err) {
      console.error("Failed to fetch deposits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  const handleAction = async (trx: any, action: 'approve' | 'reject') => {
    const reason = action === 'reject' ? prompt("Reason for rejection:") : null;
    if (action === 'reject' && reason === null) return;

    setActionLoading(trx.id);
    try {
      const endpoint = action === 'approve' ? '/admin/finance/deposit/approve' : '/admin/finance/deposit/reject';
      await api.post(endpoint, { 
        transactionId: trx.id, 
        userId: trx.userId, 
        reason 
      });
      alert(`Successfully ${action === 'approve' ? 'Approved' : 'Rejected'}`);
      fetchDeposits();
    } catch (err: any) {
      alert(err.message || "Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredData = useMemo(() => {
    if (activeTab === 'all') return allData;
    return allData.filter(d => d.status === activeTab);
  }, [allData, activeTab]);

  const stats = useMemo(() => ({
    pending: allData.filter(d => d.status === 'pending').length,
    totalVolume: allData.filter(d => d.status === 'approved').reduce((acc, curr) => acc + curr.amount, 0)
  }), [allData]);

  const columns = [
    {
      header: 'Partner Details',
      accessor: 'userName',
      render: (_: any, row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shrink-0">
             <UserIcon size={18} />
          </div>
          <div>
            <p className="font-black text-slate-800 text-sm">{row.userName}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{row.userPhone}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Amount (PKR)',
      accessor: 'amount',
      render: (val: number) => (
        <div className="flex items-center gap-2">
           <div className="w-1.5 h-6 bg-green-500 rounded-full" />
           <span className="font-black text-slate-900 text-base">Rs {val.toLocaleString()}</span>
        </div>
      )
    },
    {
      header: 'Audit Data',
      accessor: 'gateway',
      render: (val: string, row: any) => (
        <div>
          <p className="text-xs font-black text-sky-600 uppercase tracking-widest">{val}</p>
          <p className="text-[10px] font-mono font-bold text-slate-500 mt-1">TRX: {row.trxId}</p>
        </div>
      )
    },
    {
      header: 'Evidence',
      accessor: 'proofImage',
      render: (val: string) => (
        <button 
          onClick={() => setSelectedImage(val)}
          className="w-14 h-10 rounded-xl overflow-hidden border border-slate-100 hover:border-sky-500 transition-all group relative"
        >
          {val ? <img src={val} alt="Proof" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300 italic text-[8px]">No Img</div>}
          <div className="absolute inset-0 bg-sky-500/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white">
            <Eye size={14} />
          </div>
        </button>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (val: string) => (
        <span className={clsx(
          "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm inline-flex items-center gap-2",
          val === 'approved' ? "bg-green-500 text-white" :
          val === 'pending' ? "bg-amber-500 text-white animate-pulse" : "bg-rose-500 text-white"
        )}>
          {val === 'approved' ? <ShieldCheck size={10} /> : val === 'pending' ? <Clock size={10} /> : <AlertCircle size={10} />}
          {val}
        </span>
      )
    },
    {
      header: 'Verification',
      accessor: 'id',
      render: (_: string, row: any) => row.status === 'pending' ? (
        <div className="flex gap-2">
          <button 
            disabled={!!actionLoading}
            onClick={() => handleAction(row, 'approve')}
            className="p-3 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded-xl transition-all shadow-sm disabled:opacity-30"
          >
            <Check size={16} />
          </button>
          <button 
            disabled={!!actionLoading}
            onClick={() => handleAction(row, 'reject')}
            className="p-3 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl transition-all shadow-sm disabled:opacity-30"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <span className="text-[10px] font-black text-slate-300 uppercase italic tracking-widest">Logged</span>
      )
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 px-2">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <div className="p-2 bg-slate-900 text-white rounded-2xl"><TrendingUp size={24} /></div>
             Deposit Command Center
          </h1>
          <p className="text-slate-400 font-medium text-sm mt-1">Audit incoming liquidity and authorize account credits.</p>
        </div>

        <div className="flex gap-4">
           <div className="bg-white px-6 py-4 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center"><Clock size={20} /></div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Queue</p>
                <p className="text-xl font-black text-slate-800">{stats.pending}</p>
              </div>
           </div>
           <button onClick={fetchDeposits} className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 active:rotate-180 transition-all shadow-sm hover:text-indigo-600"><RefreshCw size={24}/></button>
        </div>
      </header>

      <div className="flex bg-white p-1.5 rounded-[24px] shadow-sm border border-slate-100 w-fit mx-2">
        {(['pending', 'approved', 'rejected', 'all'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              "px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
              activeTab === tab ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:text-slate-600"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden p-2 mx-2">
        <DataTable 
          title="Financial Audit Ledger"
          columns={columns}
          data={filteredData}
          isLoading={loading}
        />
      </div>

      <ImageModal 
        isOpen={!!selectedImage} 
        onClose={() => setSelectedImage(null)} 
        imageUrl={selectedImage || ''} 
      />
    </div>
  );
};

export default Deposits;