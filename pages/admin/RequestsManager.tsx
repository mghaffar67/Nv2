import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Eye, RefreshCw, Smartphone, Copy, Check, X, 
  ArrowRight, ShieldCheck, Clock, AlertCircle, Image as ImageIcon,
  User as UserIcon, Wallet, CheckSquare, TrendingUp, TrendingDown,
  ChevronRight, Filter, ExternalLink, Zap, Activity, ShieldAlert,
  History, BadgeCheck, FileCheck,
  // Added missing CheckCircle2 icon import
  CheckCircle2
} from 'lucide-react';
import { clsx } from 'clsx';
import { api } from '../../utils/api';
import { ProofModal } from '../../components/admin/ProofModal';

const AnalyticsCard = ({ title, value, icon: Icon, gradient, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
    className={clsx(
      "p-5 rounded-[28px] border border-white/10 shadow-lg flex flex-col justify-between h-32 relative overflow-hidden group",
      gradient
    )}
  >
    <div className="absolute -top-10 -right-10 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700" />
    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-black/20 backdrop-blur-md border border-white/10 text-white relative z-10">
      <Icon size={18} />
    </div>
    <div className="relative z-10">
        <p className="text-[7px] font-black text-white/60 uppercase tracking-[0.2em] mb-1 italic">{title}</p>
        <h4 className="text-2xl font-black text-white italic tracking-tighter leading-none">{value}</h4>
    </div>
  </motion.div>
);

const RequestsManager = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [filterType, setFilterType] = useState<'all' | 'deposit' | 'withdraw' | 'plan'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedProof, setSelectedProof] = useState<string | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      // In a real scenario, we merge endpoints. For mock, we'll call both and combine.
      const [deps, withs] = await Promise.all([
        api.get('/admin/finance/deposits'),
        api.get('/admin/finance/withdrawals')
      ]);
      
      const combined = [...(deps || []), ...(withs || [])].sort((a, b) => 
        new Date(b.timestamp || b.date).getTime() - new Date(a.timestamp || a.date).getTime()
      );
      setData(combined);
    } catch (e) {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleAction = async (item: any, action: 'approve' | 'reject') => {
    let reason = "";
    if (action === 'reject') {
      reason = prompt("Enter Rejection Protocol Reason:") || "";
      if (!reason) return;
    }

    setProcessingId(item.id);
    try {
      await api.post('/admin/finance/requests/manage', { 
        transactionId: item.id, 
        userId: item.userId, 
        action,
        type: item.type, // passed from item
        reason 
      });
      await fetchRequests();
    } catch (e: any) { 
      alert(e.message); 
    } finally {
      setProcessingId(null);
    }
  };

  const stats = useMemo(() => {
    const pending = data.filter(i => i.status === 'pending');
    const approvedToday = data.filter(i => i.status === 'approved' && (i.date === new Date().toISOString().split('T')[0])).length;
    return {
      pendingCount: pending.length,
      approvedTodayCount: approvedToday,
      totalQueue: pending.length
    };
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter(i => {
      const matchesTab = activeTab === 'pending' ? i.status === 'pending' : i.status !== 'pending';
      const matchesType = filterType === 'all' || i.type === filterType;
      const matchesSearch = i.userName?.toLowerCase().includes(searchTerm.toLowerCase()) || i.trxId?.includes(searchTerm);
      return matchesTab && matchesType && matchesSearch;
    });
  }, [data, activeTab, filterType, searchTerm]);

  return (
    <div className="space-y-6 pb-24 animate-fade-in max-w-7xl mx-auto px-2">
      
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 p-2">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Validation <span className="text-indigo-600">Center.</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase text-[9px] tracking-[0.3em] mt-3 flex items-center gap-2 italic">
            <ShieldAlert size={14} className="text-indigo-500" /> Critical Authorization & Request Hub
          </p>
        </div>
        <button onClick={fetchRequests} className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 active:rotate-180 transition-all duration-500 shadow-sm"><RefreshCw size={22}/></button>
      </header>

      {/* ANALYTICS NODE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AnalyticsCard title="Approved Today" value={stats.approvedTodayCount} icon={BadgeCheck} gradient="bg-emerald-600" delay={0.1} />
        <AnalyticsCard title="Pending Validation" value={stats.pendingCount} icon={Clock} gradient="bg-amber-500" delay={0.2} />
        <AnalyticsCard title="Authorization Stream" value={stats.totalQueue} icon={Activity} gradient="bg-slate-900" delay={0.3} />
      </div>

      {/* TOOLBAR */}
      <div className="bg-white p-3 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
         <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex bg-slate-50 p-1.5 rounded-2xl gap-1">
               <button onClick={() => setActiveTab('pending')} className={clsx("px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all", activeTab === 'pending' ? "bg-slate-900 text-white shadow-lg" : "text-slate-400")}>Active Stream</button>
               <button onClick={() => setActiveTab('history')} className={clsx("px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all", activeTab === 'history' ? "bg-slate-900 text-white shadow-lg" : "text-slate-400")}>Protocol History</button>
            </div>

            <div className="flex bg-slate-50 p-1.5 rounded-2xl gap-1">
               {['all', 'deposit', 'withdraw'].map((t) => (
                 <button key={t} onClick={() => setFilterType(t as any)} className={clsx("px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all", filterType === t ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400")}>{t}</button>
               ))}
            </div>

            <div className="relative flex-grow max-w-md">
               <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
               <input 
                 value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                 className="w-full h-11 pl-11 pr-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-[10px] outline-none" 
                 placeholder="Probe identity or transaction reference..." 
               />
            </div>
         </div>
      </div>

      {/* DATA GRID */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="py-32 text-center"><RefreshCw className="animate-spin mx-auto text-slate-200" size={44}/></div>
        ) : filteredData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
             <AnimatePresence mode="popLayout">
                {filteredData.map(item => (
                  <motion.div 
                    layout key={item.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white p-6 rounded-[36px] border border-slate-100 shadow-sm flex flex-col group hover:shadow-2xl hover:border-indigo-100 transition-all"
                  >
                     <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                           <div className="w-11 h-11 rounded-2xl bg-slate-950 text-sky-400 flex items-center justify-center font-black italic shadow-lg">{item.userName?.charAt(0)}</div>
                           <div>
                              <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{item.userName}</h4>
                              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{item.userPhone}</p>
                           </div>
                        </div>
                        <div className={clsx("px-3 py-1 rounded-lg text-[7px] font-black uppercase tracking-widest border", item.type === 'deposit' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100")}>{item.type}</div>
                     </div>

                     <div className="space-y-4 mb-6 flex-grow">
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                           <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Voucher Value</p>
                           <h3 className="text-xl font-black text-slate-900 italic tracking-tighter leading-none">Rs {item.amount?.toLocaleString()}</h3>
                        </div>
                        <div className="flex justify-between items-center text-[8px] font-black text-slate-500 uppercase tracking-widest px-1">
                           <span>Reference ID: {item.trxId || item.id?.slice(0, 10)}</span>
                           <span>{item.gateway} Node</span>
                        </div>
                     </div>

                     {activeTab === 'pending' ? (
                       <div className="flex gap-2 pt-4 border-t border-slate-50">
                          {item.proofImage && (
                             <button onClick={() => setSelectedProof(item.proofImage)} className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-sm shrink-0"><ImageIcon size={18}/></button>
                          )}
                          <button onClick={() => handleAction(item, 'approve')} disabled={!!processingId} className="flex-grow h-12 bg-slate-950 text-white rounded-xl font-black text-[9px] uppercase tracking-[0.2em] shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"><FileCheck size={14}/> Authorize</button>
                          <button onClick={() => handleAction(item, 'reject')} disabled={!!processingId} className="h-12 w-12 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm disabled:opacity-50"><X size={18}/></button>
                       </div>
                     ) : (
                       <div className="pt-4 border-t border-slate-50 flex justify-between items-center px-1">
                          <span className={clsx("text-[9px] font-black uppercase tracking-widest", item.status === 'approved' ? "text-emerald-500" : "text-rose-500")}>{item.status} Node</span>
                          <p className="text-[8px] font-bold text-slate-300 uppercase italic">{item.date}</p>
                       </div>
                     )}
                  </motion.div>
                ))}
             </AnimatePresence>
          </div>
        ) : (
          <div className="py-40 text-center">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 size={40} className="text-slate-200" /></div>
             <h4 className="text-slate-900 font-black uppercase text-[11px] tracking-widest">Registry Synchronized</h4>
             <p className="text-slate-300 font-bold uppercase text-[8px] tracking-widest mt-2">Awaiting new terminal terminal pings...</p>
          </div>
        )}
      </div>

      <ProofModal isOpen={!!selectedProof} onClose={() => setSelectedProof(null)} imageUrl={selectedProof || ''} />
    </div>
  );
};

export default RequestsManager;