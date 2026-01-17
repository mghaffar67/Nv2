
import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, ArrowDownCircle, ArrowUpCircle, ClipboardCheck, 
  Search, Check, X, Clock, Eye, ShieldCheck, AlertCircle, Smartphone, UserPlus, Inbox
} from 'lucide-react';
import { clsx } from 'clsx';
import { adminController } from '../../backend_core/controllers/adminController';
import { financeController } from '../../backend_core/controllers/financeController';
import { workController } from '../../backend_core/controllers/workController';
import { ImageModal } from '../../components/ui/ImageModal';

const RequestsManager = () => {
  const location = useLocation();
  const [activeType, setActiveType] = useState<'deposits' | 'withdrawals' | 'tasks'>('deposits');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProof, setSelectedProof] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      let res: any[] = [];
      if (activeType === 'deposits') {
        res = await new Promise<any>(r => financeController.getAllDeposits({}, { status: () => ({ json: r }) }));
      } else if (activeType === 'withdrawals') {
        res = await new Promise<any>(r => financeController.getAllWithdrawals({}, { status: () => ({ json: r }) }));
      } else if (activeType === 'tasks') {
        res = await new Promise<any>(r => workController.getAllSubmissions({}, { status: () => ({ json: r }) }));
      }
      setData(res || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [activeType]);

  const handleAction = async (id: string, userId: string, action: 'approve' | 'reject', payload?: any) => {
    try {
      if (activeType === 'deposits') {
        const method = action === 'approve' ? financeController.approveDeposit : financeController.rejectDeposit;
        await method({ body: { transactionId: id, userId } }, { status: () => ({ json: () => {} }) });
      } else if (activeType === 'withdrawals') {
        const method = action === 'approve' ? financeController.approveWithdrawal : financeController.rejectWithdrawal;
        await method({ body: { transactionId: id, userId } }, { status: () => ({ json: () => {} }) });
      } else if (activeType === 'tasks') {
        await workController.reviewSubmission({ body: { userId, submissionId: id, status: action === 'approve' ? 'approved' : 'rejected', reward: payload.reward } }, { status: () => ({ json: () => {} }) });
      }
      fetchData();
    } catch (e) { alert("Failed"); }
  };

  return (
    <div className="space-y-4 pb-24 animate-fade-in max-w-lg mx-auto px-1">
      
      <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm mx-1 sticky top-16 z-40 backdrop-blur-md">
         {[
           { id: 'deposits', icon: ArrowDownCircle, label: 'Capital' },
           { id: 'withdrawals', icon: ArrowUpCircle, label: 'Payouts' },
           { id: 'tasks', icon: ClipboardCheck, label: 'Audits' }
         ].map((t) => (
           <button 
            key={t.id} 
            onClick={() => setActiveType(t.id as any)} 
            className={clsx(
              "flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all",
              activeType === t.id ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:text-slate-900"
            )}
           >
             <t.icon size={16} />
             {t.label}
           </button>
         ))}
      </div>

      <div className="space-y-3 px-1">
        {loading ? (
          <div className="py-20 text-center animate-pulse text-slate-300 font-black uppercase text-[10px] tracking-widest">Synchronizing Hub...</div>
        ) : data.filter(i => i.status === 'pending').length === 0 ? (
          <div className="bg-white p-12 rounded-[40px] border border-slate-100 text-center flex flex-col items-center gap-4">
             <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center shadow-inner"><ShieldCheck size={32} /></div>
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Sector Queue Clear</p>
          </div>
        ) : (
          data.filter(i => i.status === 'pending').map((item) => (
            <motion.div key={item.id} layout initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm flex flex-col gap-4">
               <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3 overflow-hidden">
                     <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-sky-400 font-black italic shadow-lg shrink-0">
                        {item.userName?.charAt(0) || 'U'}
                     </div>
                     <div className="overflow-hidden">
                        <h4 className="font-black text-slate-900 text-[11px] truncate leading-tight uppercase">{item.userName || 'New Partner'}</h4>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter truncate">{item.userPhone || item.id}</p>
                     </div>
                  </div>
                  <div className="text-right shrink-0">
                     {item.amount && <p className="font-black text-indigo-600 text-xs tracking-tight">Rs {item.amount}</p>}
                     <span className="text-[6px] font-black uppercase text-amber-500 tracking-widest italic animate-pulse">In Review</span>
                  </div>
               </div>

               <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between">
                  <div className="flex flex-col gap-0.5 overflow-hidden">
                     <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Ledger Context</p>
                     <p className="text-[9px] font-bold text-slate-800 uppercase truncate">{item.gateway || item.taskTitle || 'Node Audit'}</p>
                  </div>
                  {item.proofImage && (
                    <button onClick={() => setSelectedProof(item.proofImage)} className="w-9 h-9 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-sky-500 shadow-sm active:scale-90 transition-all">
                       <Eye size={14} />
                    </button>
                  )}
               </div>

               <div className="flex gap-2">
                  <button onClick={() => handleAction(item.id, item.userId, 'approve', item)} className="flex-grow h-11 bg-green-500 text-white rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-green-100 active:scale-95 transition-all">
                     <Check size={14} /> Authorize
                  </button>
                  <button onClick={() => handleAction(item.id, item.userId, 'reject')} className="h-11 px-6 bg-rose-50 text-rose-500 rounded-xl font-black text-[9px] uppercase border border-rose-100 active:scale-95 transition-all">
                     <X size={14} />
                  </button>
               </div>
            </motion.div>
          ))
        )}
      </div>

      <ImageModal isOpen={!!selectedProof} onClose={() => setSelectedProof(null)} imageUrl={selectedProof || ''} />
    </div>
  );
};

export default RequestsManager;
