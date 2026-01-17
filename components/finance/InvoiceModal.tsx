
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Printer, Download, CheckCircle2, AlertCircle, XCircle, Zap, ShieldCheck } from 'lucide-react';
import { clsx } from 'clsx';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: any;
}

export const InvoiceModal = ({ isOpen, onClose, transaction }: InvoiceModalProps) => {
  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const statusConfig = {
    approved: { label: 'PAID', color: 'text-green-600', border: 'border-green-600', icon: CheckCircle2 },
    pending: { label: 'PROCESSING', color: 'text-amber-600', border: 'border-amber-600', icon: AlertCircle },
    rejected: { label: 'DECLINED', color: 'text-rose-600', border: 'border-rose-600', icon: XCircle }
  };

  const currentStatus = (statusConfig as any)[transaction.status] || statusConfig.pending;
  const StatusIcon = currentStatus.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm no-print"
          />

          {/* Style for Print Logic */}
          <style dangerouslySetInnerHTML={{ __html: `
            @media print {
              body * { visibility: hidden; }
              #receipt-content, #receipt-content * { visibility: visible; }
              #receipt-content { 
                position: absolute; 
                left: 0; 
                top: 0; 
                width: 100%; 
                box-shadow: none !important;
                border: none !important;
              }
              .no-print { display: none !important; }
            }
          `}} />

          {/* Receipt Modal */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg z-10 no-print"
          >
            {/* Action Bar */}
            <div className="flex justify-end gap-3 mb-4 no-print">
              <button 
                onClick={handlePrint}
                className="p-3 bg-white/10 backdrop-blur-md text-white hover:bg-white hover:text-slate-900 rounded-full transition-all"
              >
                <Printer size={20} />
              </button>
              <button 
                onClick={onClose}
                className="p-3 bg-white/10 backdrop-blur-md text-white hover:bg-rose-500 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* The Actual Receipt Paper */}
            <div 
              id="receipt-content"
              className="bg-white rounded-t-[20px] shadow-2xl relative overflow-hidden"
              style={{
                filter: 'drop-shadow(0 20px 25px rgba(0,0,0,0.15))'
              }}
            >
              {/* Jagged Edge Top Decor */}
              <div className="h-2 w-full bg-slate-100 flex overflow-hidden">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="min-w-[32px] h-8 bg-white rotate-45 -translate-y-6 mx-1 shadow-sm" />
                ))}
              </div>

              <div className="p-8 md:p-12 space-y-10">
                {/* Receipt Header */}
                <div className="text-center space-y-2">
                   <div className="flex items-center justify-center gap-2 mb-4">
                      <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-sky-400">
                        <Zap size={20} fill="currentColor" />
                      </div>
                      <span className="text-xl font-black tracking-tighter text-slate-900 italic">Noor Official.</span>
                   </div>
                   <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Electronic Payout Voucher</h2>
                </div>

                {/* Status Stamp */}
                <div className="flex justify-center relative py-4">
                   <div className={clsx(
                     "border-[4px] px-6 py-2 rounded-xl rotate-[-12deg] font-black text-2xl tracking-widest opacity-80 flex items-center gap-3",
                     currentStatus.color,
                     currentStatus.border
                   )}>
                      <StatusIcon size={24} />
                      {currentStatus.label}
                   </div>
                </div>

                {/* Amount Section */}
                <div className="text-center bg-slate-50 py-10 rounded-[32px] border border-dashed border-slate-200">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Amount Disbursed</p>
                   <h3 className="text-5xl font-black text-slate-900 tracking-tighter">
                     <span className="text-xl text-sky-500 mr-2 italic">Rs.</span>
                     {transaction.amount?.toLocaleString()}
                   </h3>
                </div>

                {/* Details Table */}
                <div className="space-y-4 pt-4">
                   <div className="flex justify-between items-end border-b border-slate-100 pb-4">
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Beneficiary Name</p>
                        <p className="text-sm font-black text-slate-800 uppercase mt-1">{transaction.userName || 'Authorized Partner'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Gateway Provider</p>
                        <p className="text-sm font-black text-slate-800 mt-1">{transaction.gateway}</p>
                      </div>
                   </div>

                   <div className="flex justify-between items-end border-b border-slate-100 pb-4">
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Wallet Destination</p>
                        <p className="text-sm font-mono font-bold text-slate-700 mt-1">{transaction.accountNumber || '****-*******'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Voucher Ref ID</p>
                        <p className="text-sm font-mono font-bold text-slate-500 mt-1">{transaction.id}</p>
                      </div>
                   </div>

                   <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Auth Timestamp</p>
                        <p className="text-xs font-bold text-slate-800 mt-1">
                          {new Date(transaction.timestamp || transaction.date).toLocaleString('en-PK', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-green-600">
                           <ShieldCheck size={12} />
                           <span className="text-[8px] font-black uppercase tracking-widest">Verified Digital</span>
                        </div>
                      </div>
                   </div>
                </div>

                {/* Footer Signature */}
                <div className="pt-10 flex flex-col items-center gap-4">
                   <div className="w-16 h-16 opacity-10">
                      <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=noorofficial_v3_payout" alt="Auth QR" className="w-full h-full grayscale" />
                   </div>
                   <p className="text-[8px] text-slate-400 font-bold uppercase tracking-[0.3em] text-center max-w-[200px] leading-relaxed">
                     This is a computer generated receipt and does not require a physical signature.
                   </p>
                </div>
              </div>

              {/* Jagged Bottom Decor */}
              <div className="h-6 w-full flex items-center justify-center overflow-hidden">
                <div className="flex gap-1">
                  {Array.from({ length: 40 }).map((_, i) => (
                    <div key={i} className="w-3 h-3 bg-white rotate-45 translate-y-2 border-b border-r border-slate-200" />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="h-8 bg-black/10 rounded-b-[40px] blur-xl -mt-4 mx-8 pointer-events-none" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
