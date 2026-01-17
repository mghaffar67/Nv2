
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowDownCircle, ArrowUpCircle, Clock, CheckCircle2, 
  XCircle, Eye, Wallet, Smartphone, ShieldCheck, 
  X, Check, User as UserIcon, Calendar, Info
} from 'lucide-react';
import { clsx } from 'clsx';
import { financeController } from '../../../backend_core/controllers/financeController';
import { ProofModal } from '../../../components/admin/ProofModal';

const FinanceManager = () => {
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProof, setSelectedProof] = useState<string | null>(null);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const method = activeTab === 'deposit' ? financeController.getAllDeposits : financeController.getAllWithdrawals;
      const res = await new Promise<any>(r => method({}, { status: () => ({ json: r }) }));
      setData(res || []);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchRecords(); }, [activeTab]);

  const handleAction = async (id: string, userId: string, action: 'approve' | 'reject') => {
    const confirmMsg = action === 'approve' ? "Confirm approval and credit user?" : "Reject this request?";
    if (!window.confirm(confirmMsg)) return;

    try {
      const method = activeTab === 'deposit' 
        ? (action === 'approve' ? financeController.approveDeposit : financeController.rejectDeposit)
        : (action === 'approve' ? financeController.approveWithdrawal : financeController.rejectWithdrawal);
      
      await new Promise<any>((resolve) => {
        method({ body: { transactionId: id, userId } }, { 
          status: () => ({ json: (d: any) => resolve(d) }) 
        });
      });
      fetchRecords();
    } catch (err: any) { alert("Security Node Conflict: Action Failed"); }
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-24 animate-fade-in max-w-5xl mx-auto px-1">
      
      {/* 1. Header Protocol */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 px-2">
         <div>
            <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Ledger Hub.</h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px] md:text-xs mt-2">Manual Audit of System Capital Flow</p>
         </div>
         <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm w-full md:w-auto">
            {['deposit', 'withdraw'].map(t => (
              <button 
                key={t} 
                onClick={() => setActiveTab(t as any)} 
                className={clsx(
                  "flex-1 md:px-8 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                  activeTab === t ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:text-slate-900"
                )}
              >
                {t === 'deposit' ? 'Inbound' : 'Outbound'}
              </button>
            ))}
         </div>
      </div>

      {/* 2. Responsive Content Container */}
      <div className="space-y-4">
         {loading ? (
           <div className="py-24 text-center">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Auditing Local Storage Nodes...</p>
           </div>
         ) : data.length === 0 ? (
           <div className="bg-white p-16 rounded-[44px] border border-slate-100 text-center mx-1 flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 mb-6 shadow-inner"><Info size={32} /></div>
              <p className="text-slate-300 font-black text-[10px] uppercase tracking-widest">Queue Status: Sector Clear</p>
           </div>
         ) : (
           <>
             {/* Desktop Table View */}
             <div className="hidden lg:block bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                   <thead>
                      <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                         <th className="px-8 py-5">Partner</th>
                         <th className="px-8 py-5">Value</th>
                         <th className="px-8 py-5">Source</th>
                         <th className="px-8 py-5">Status</th>
                         <th className="px-8 py-5 text-right">Verify</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {data.map(trx => (
                        <tr key={trx.id} className="hover:bg-slate-50 transition-colors group">
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-3">
                                 <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-sky-400 font-black italic text-xs shrink-0">{trx.userName?.charAt(0)}</div>
                                 <div>
                                    <p className="font-black text-slate-800 text-[11px] leading-none uppercase">{trx.userName}</p>
                                    <p className="text-[8px] font-bold text-slate-400 uppercase mt-1.5 tracking-tighter">{trx.userPhone}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <p className={clsx("font-black text-sm", activeTab === 'deposit' ? "text-emerald-600" : "text-rose-600")}>PKR {trx.amount}</p>
                           </td>
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-2 text-slate-500 font-black text-[9px] uppercase"><Smartphone size={12}/> {trx.gateway || trx.method}</div>
                           </td>
                           <td className="px-8 py-6">
                              <span className={clsx(
                                "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border",
                                trx.status === 'pending' ? "bg-amber-50 text-amber-600 border-amber-100 animate-pulse" : 
                                trx.status === 'approved' ? "bg-green-50 text-green-600 border-green-100" : "bg-rose-50 text-rose-600 border-rose-100"
                              )}>
                                 {trx.status}
                              </span>
                           </td>
                           <td className="px-8 py-6 text-right">
                              <div className="flex justify-end gap-2">
                                 {trx.proofImage && <button onClick={() => setSelectedProof(trx.proofImage)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl shadow-sm transition-all" title="View Proof"><Eye size={14}/></button>}
                                 {trx.status === 'pending' && (
                                   <>
                                     <button onClick={() => handleAction(trx.id, trx.userId, 'approve')} className="p-2.5 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm"><Check size={16}/></button>
                                     <button onClick={() => handleAction(trx.id, trx.userId, 'reject')} className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"><X size={16}/></button>
                                   </>
                                 )}
                              </div>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>

             {/* Mobile Card View */}
             <div className="lg:hidden space-y-3 px-1">
                {data.map(trx => (
                  <motion.div layout key={trx.id} className="bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
                     <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3 overflow-hidden">
                           <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-sky-400 font-black italic shadow-lg shrink-0">{trx.userName?.charAt(0)}</div>
                           <div className="overflow-hidden">
                              <h4 className="font-black text-slate-900 text-[11px] truncate leading-tight uppercase">{trx.userName}</h4>
                              <p className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{trx.userPhone}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className={clsx("font-black text-xs tracking-tight", activeTab === 'deposit' ? "text-emerald-600" : "text-rose-600")}>Rs {trx.amount}</p>
                           <p className="text-[7px] font-black uppercase text-slate-300 mt-1">{trx.date}</p>
                        </div>
                     </div>

                     <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between border border-slate-100">
                        <div className="flex flex-col gap-0.5 overflow-hidden">
                           <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest italic">Node Logic</p>
                           <p className="text-[9px] font-bold text-slate-800 uppercase truncate">{trx.gateway || trx.method}</p>
                        </div>
                        {trx.proofImage && (
                          <button onClick={() => setSelectedProof(trx.proofImage)} className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-indigo-500 shadow-sm active:scale-90 transition-all">
                             <Eye size={18} />
                          </button>
                        )}
                     </div>

                     {trx.status === 'pending' ? (
                       <div className="flex gap-2">
                          <button onClick={() => handleAction(trx.id, trx.userId, 'approve')} className="flex-grow h-12 bg-green-500 text-white rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] shadow-lg shadow-green-100 active:scale-95 transition-all">
                             Authorize
                          </button>
                          <button onClick={() => handleAction(trx.id, trx.userId, 'reject')} className="px-6 h-12 bg-rose-50 text-rose-500 rounded-2xl font-black text-[9px] uppercase border border-rose-100 active:scale-95 transition-all">
                             <X size={16} />
                          </button>
                       </div>
                     ) : (
                       <div className={clsx(
                         "h-10 rounded-xl flex items-center justify-center gap-2 font-black text-[8px] uppercase tracking-widest border",
                         trx.status === 'approved' ? "bg-green-50 text-green-600 border-green-100" : "bg-rose-50 text-rose-600 border-rose-100"
                       )}>
                          {trx.status === 'approved' ? <ShieldCheck size={12}/> : <XCircle size={12}/>}
                          Processed: {trx.status}
                       </div>
                     )}
                  </motion.div>
                ))}
             </div>
           </>
         )}
      </div>

      {/* 3. Proof Engine Portal */}
      <ProofModal 
        isOpen={!!selectedProof} 
        onClose={() => setSelectedProof(null)} 
        imageUrl={selectedProof || ''} 
      />
    </div>
  );
};

export default FinanceManager;
