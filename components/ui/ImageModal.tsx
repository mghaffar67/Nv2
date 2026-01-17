
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Maximize2 } from 'lucide-react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

export const ImageModal = ({ isOpen, onClose, imageUrl }: ImageModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/90 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative max-w-4xl w-full bg-white rounded-[40px] overflow-hidden shadow-2xl z-10"
          >
            <div className="absolute top-6 right-6 flex items-center gap-3 z-20">
              <button className="p-3 bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-slate-900 rounded-full transition-all">
                <Download size={20} />
              </button>
              <button 
                onClick={onClose}
                className="p-3 bg-white/20 backdrop-blur-md text-white hover:bg-red-500 hover:text-white rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 flex items-center justify-center bg-slate-100 min-h-[400px]">
              <img 
                src={imageUrl} 
                alt="Proof Screenshot" 
                className="max-w-full max-h-[70vh] rounded-2xl shadow-xl object-contain"
              />
            </div>
            
            <div className="p-8 bg-white flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-800">Verification Proof</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Transaction Evidence submitted by user</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-sky-50 text-sky-600 rounded-xl font-black text-[10px] uppercase">
                <Maximize2 size={14} /> High Quality
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
