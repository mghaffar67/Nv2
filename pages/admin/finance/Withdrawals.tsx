
import React, { useState, useEffect, useMemo } from 'react';
import DataTable from '../../../components/ui/DataTable';
import { 
  Wallet, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Copy, 
  Smartphone, 
  History, 
  ArrowUpRight,
  TrendingDown,
  User as UserIcon,
  AlertCircle,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { clsx } from 'clsx';
import { financeController } from '../../../backend_core/controllers/financeController';
import { motion, AnimatePresence } from 'framer-motion';

const Withdrawals = () => {
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ row: any; action: 'paid' | 'reject' } | null>(null);

  const fetchWithdrawals = async () => {
    setLoading(true);
    try {
      const res = await new Promise<any>((resolve) => {
        financeController.getAllWithdrawals({}, { 
          status: () => ({ json: (data: any) => resolve(data) }) 
        });
      });
      setWithdrawals(res || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleProcess = async () => {
    if (!confirmModal) return;
    const { row, action } = confirmModal;
    
    let reason = null;
    if (action === 'reject') {
      reason = prompt("Enter rejection reason (Required):");
      if (reason === null) {
        setConfirmModal(null);
        return;
      }
    }

    setActionLoading(row.id);
    setConfirmModal(null);
    try {
      const method = action === 'paid' ? financeController.approveWithdrawal : financeController.rejectWithdrawal;
      await new Promise<any>((resolve, reject) => {
        method({ 
          body: { transactionId: row.id, userId: row.userId, reason } 
        }, { 
          status: (code: number) => ({ 
            json: (data: any) => code === 200 ? resolve(data) : reject(data) 
          }) 
        });
      });
      fetchWithdrawals();
    } catch (err: any) {
      alert(err.message || "Failed to process payment");
    } finally {
      setActionLoading(null);
    }
  };

  const stats = useMemo(() => {
    const pending = withdrawals.filter(w => w.status === 'pending');
    return {
      pendingCount: pending.length,
      pendingTotal: pending.reduce((acc, curr) => acc + curr.amount, 0),
      approvedTotal: withdrawals.filter(w => w.status === 'approved').reduce((acc, curr) => acc + curr.amount, 0)
    };
  }, [withdrawals]);

  const columns = [
    {
      header: 'Member Info',
      accessor: 'userName',
      render: (_: any, row: any) => (
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shrink-0 shadow-sm">
             <UserIcon size={14} className="md:size-18" />
          </div>
          <div className="overflow-hidden">
            <p className="font-black text-slate-800 text-[10px] md:text-sm leading-none mb-1 truncate">{row.userName}</p>
            <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">ID: {row.userId?.slice(-6)}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Amount',
      accessor: 'amount',
      render: (val: number) => (
        <div className="flex flex-col">
           <span className="font-black text-rose-600 text-xs md:text-base whitespace-nowrap">Rs {val.toLocaleString()}</span>
           <span className="text-[7px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest hidden sm:block">Requested</span>
        </div>
      )
    },
    {
      header: 'Wallet Info',
      accessor: 'accountNumber',
      render: (val: string, row: any) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 bg-sky-50 text-sky-600 rounded-md text-[7px] md:text-[9px] font-black uppercase border border-sky-100">
              {row.gateway}
            </span>
            <div className="flex items-center gap-1 relative">
              <span className="font-mono font-black text-[10px] md:text-xs text-slate-700">{val}</span>
              <button onClick={() => handleCopy(val, row.id)} className="p-1 hover:bg-slate-100 rounded-md text-slate-400">
                <Copy size={10} />
              </button>
            </div>
          </div>
          <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase truncate max-w-[100px]">{row.accountTitle}</p>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (val: string) => (
        <span className={clsx(
          "px-2 md:px-4 py-1 md:py-2 rounded-lg md:rounded-xl text-[7px] md:text-[9px] font-black uppercase tracking-widest shadow-sm flex items-center gap-1 border",
          val === 'approved' ? "bg-green-50 text-green-600 border-green-100" :
          val === 'pending' ? "bg-amber-50 text-amber-600 border-amber-100 animate-pulse" : "bg-rose-50 text-rose-600 border-rose-100"
        )}>
          {val === 'approved' ? <ShieldCheck size={8} /> : val === 'pending' ? <Clock size={8} /> : <XCircle size={8} />}
          {val}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (_: string, row: any) => row.status === 'pending' ? (
        <div className="flex gap-1.5 md:gap-2">
          <button 
            disabled={!!actionLoading}
            onClick={() => setConfirmModal({ row, action: 'paid' })}
            className="px-2 md:px-4 py-1.5 md:py-2 bg-slate-900 text-white text-[8px] md:text-[10px] font-black rounded-lg md:rounded-xl hover:bg-indigo-600 transition-all uppercase disabled:opacity-30 whitespace-nowrap"
          >
            Pay Now
          </button>
          <button 
            disabled={!!actionLoading}
            onClick={() => setConfirmModal({ row, action: 'reject' })}
            className="px-2 md:px-4 py-1.5 md:py-2 bg-white border border-slate-200 text-rose-500 text-[8px] md:text-[10px] font-black rounded-lg md:rounded-xl hover:bg-rose-50 transition-all uppercase disabled:opacity-30"
          >
            Reject
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-1 text-slate-300">
           <Zap size={10} />
           <span className="text-[7px] md:text-[9px] font-black uppercase tracking-widest italic">Logged</span>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4 md:space-y-8 pb-12 animate-fade-in px-1 md:px-0">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 md:gap-8">
        <div>
          <h1 className="text-xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <div className="p-2 md:p-3 bg-rose-600 text-white rounded-xl md:rounded-2xl shadow-lg"><TrendingDown size={20} className="md:size-[28px]" /></div>
             Payout Requests
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px] md:text-[10px] mt-1.5">Manage user withdrawal requests and finalize payments.</p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-4 w-full lg:w-auto">
           <div className="bg-white px-4 md:px-8 py-3 md:py-5 rounded-2xl md:rounded-[36px] border border-slate-100 shadow-sm flex items-center gap-3 md:gap-5">
              <div className="w-8 h-8 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0"><Wallet size={16} className="md:size-24" /></div>
              <div>
                <p className="text-[7px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5 md:mb-1.5">Pending</p>
                <p className="text-xs md:text-2xl font-black text-slate-800 tracking-tighter">Rs {stats.pendingTotal.toLocaleString()}</p>
              </div>
           </div>
           <div className="bg-white px-4 md:px-8 py-3 md:py-5 rounded-2xl md:rounded-[36px] border border-slate-100 shadow-sm flex items-center gap-3 md:gap-5">
              <div className="w-8 h-8 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-green-50 text-green-500 flex items-center justify-center shrink-0"><History size={16} className="md:size-24" /></div>
              <div>
                <p className="text-[7px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5 md:mb-1.5">Paid Total</p>
                <p className="text-xs md:text-2xl font-black text-slate-800 tracking-tighter">Rs {stats.approvedTotal.toLocaleString()}</p>
              </div>
           </div>
        </div>
      </header>

      <div className="bg-white rounded-[24px] md:rounded-[44px] border border-slate-100 shadow-sm overflow-hidden p-1 md:p-6">
        <DataTable 
          title="Withdrawal Ledger"
          columns={columns}
          data={withdrawals}
          isLoading={loading}
        />
      </div>

      <div className="p-4 md:p-8 bg-indigo-50 rounded-[28px] md:rounded-[44px] border border-indigo-100 flex items-start gap-4 md:gap-6 shadow-sm">
         <div className="w-9 h-9 md:w-12 md:h-12 bg-white rounded-xl md:rounded-2xl flex items-center justify-center text-indigo-500 shadow-sm shrink-0 mt-0.5">
            <AlertCircle size={18} className="md:size-24" />
         </div>
         <div>
            <h4 className="text-[10px] md:text-sm font-black text-indigo-900 uppercase tracking-tight mb-1 md:mb-2">Admin Security Protocol</h4>
            <p className="text-[8px] md:text-[11px] text-indigo-700 font-medium leading-relaxed">
              Marking as <b>Paid</b> will finalize the transaction. Rejecting will automatically refund the PKR amount back to the user's wallet with a system notification.
            </p>
         </div>
      </div>

      <AnimatePresence>
        {confirmModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setConfirmModal(null)} className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" />
             <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-sm bg-white rounded-[32px] md:rounded-[44px] p-6 md:p-10 text-center shadow-2xl border border-white">
                <div className={clsx(
                  "w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-[28px] flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-xl",
                  confirmModal.action === 'paid' ? "bg-indigo-50 text-indigo-500" : "bg-rose-50 text-rose-500"
                )}>
                   {confirmModal.action === 'paid' ? <ShieldCheck size={32} className="md:size-40" /> : <AlertCircle size={32} className="md:size-40" />}
                </div>
                <h3 className="text-lg md:text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2 md:mb-4">Confirm Action?</h3>
                <p className="text-[9px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 md:mb-10 leading-relaxed px-2">
                  {confirmModal.action === 'paid' 
                    ? `Finalizing PKR ${confirmModal.row.amount} for ${confirmModal.row.userName}. Please ensure the manual transfer is complete.` 
                    : `Declining this request. The funds will be automatically returned to the user's account.`}
                </p>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                   <button onClick={handleProcess} className={clsx("h-11 md:h-14 rounded-xl md:rounded-2xl font-black text-[8px] md:text-[10px] uppercase tracking-widest text-white shadow-xl active:scale-95 transition-all", confirmModal.action === 'paid' ? "bg-indigo-600" : "bg-rose-600")}>
                      Proceed
                   </button>
                   <button onClick={() => setConfirmModal(null)} className="h-11 md:h-14 rounded-xl md:rounded-2xl font-black text-[8px] md:text-[10px] uppercase tracking-widest bg-slate-50 text-slate-400 active:scale-95 transition-all">
                      Cancel
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Withdrawals;
