
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ShieldCheck, Smartphone, Maximize2 } from 'lucide-react';

interface ProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

export const ProofModal = ({ isOpen, onClose, imageUrl }: ProofModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12">
          {/* 1. SECURE OVERLAY */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
          />

          {/* 2. MODAL FRAME */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[40px] md:rounded-[56px] overflow-hidden shadow-2xl z-10 border border-white flex flex-col max-h-[85vh]"
          >
            {/* Action Header */}
            <div className="absolute top-6 right-6 flex items-center gap-3 z-30">
              <a 
                href={imageUrl} 
                download={`proof-${Date.now()}.png`}
                className="p-3 bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-slate-900 rounded-full transition-all shadow-xl"
              >
                <Download size={20} />
              </a>
              <button 
                onClick={onClose}
                className="p-3 bg-white/20 backdrop-blur-md text-white hover:bg-rose-500 hover:text-white rounded-full transition-all shadow-xl"
              >
                <X size={20} />
              </button>
            </div>

            {/* Evidence Viewport */}
            <div className="flex-grow p-4 bg-slate-100 flex items-center justify-center overflow-hidden">
               <div className="relative group w-full h-full flex items-center justify-center">
                  <img 
                    src={imageUrl} 
                    alt="Transaction Evidence" 
                    className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-slate-900/10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
               </div>
            </div>
            
            {/* Metadata Footer */}
            <div className="p-8 bg-white shrink-0 border-t border-slate-50">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2 uppercase italic">
                       <Smartphone size={18} className="text-indigo-600" /> Audit Evidence
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 italic">Authorized screenshot provided by system node</p>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="flex items-center gap-1.5 px-4 py-2 bg-green-50 text-green-600 rounded-2xl font-black text-[9px] uppercase border border-green-100 shadow-sm">
                        <ShieldCheck size={14} /> High Fidelity
                     </div>
                     <div className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-slate-50 text-slate-400 rounded-2xl font-black text-[9px] uppercase border border-slate-100">
                        <Maximize2 size={14} /> View Full
                     </div>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
