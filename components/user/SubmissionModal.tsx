import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Upload, Camera, FileText, CheckCircle2, 
  Loader2, ShieldCheck, Image as ImageIcon,
  AlertCircle, ChevronRight, FileUp, Sparkles, Plus, Trash2,
  ListChecks
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { clsx } from 'clsx';

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: any;
  onSubmit: (evidence: string) => Promise<void>;
}

export const SubmissionModal = ({ isOpen, onClose, task, onSubmit }: SubmissionModalProps) => {
  const [files, setFiles] = useState<{file: File, preview: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []) as File[];
    if (selectedFiles.length === 0) return;

    const newFiles = selectedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setFiles(prev => [...prev, ...newFiles].slice(0, 10)); // Max 10 nodes per packet
  };

  const removeFile = (index: number) => {
    const updated = [...files];
    URL.revokeObjectURL(updated[index].preview);
    updated.splice(index, 1);
    setFiles(updated);
  };

  const generatePDFAndSubmit = async () => {
    if (files.length === 0) return alert("Security: Evidence packet is empty.");
    setLoading(true);

    try {
      let finalEvidence = "";

      if (files.length === 1 && files[0].file.type !== 'application/pdf') {
        // Single Image Logic: Direct Base64 for rapid sync
        const reader = new FileReader();
        finalEvidence = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(files[0].file);
        });
      } else {
        // PDF Engine Logic: Compile nodes into high-integrity ledger document
        const doc = new jsPDF();
        for (let i = 0; i < files.length; i++) {
          if (files[i].file.type.includes('image')) {
            const imgData = await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.readAsDataURL(files[i].file);
            });
            
            if (i > 0) doc.addPage();
            
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            
            // Auto-scale image to document canvas
            doc.addImage(imgData, 'JPEG', 5, 5, pageWidth - 10, pageHeight - 10);
          }
        }
        finalEvidence = doc.output('datauristring');
      }

      await onSubmit(finalEvidence);
      setFiles([]);
      onClose();
    } catch (err) {
      alert("Logic Collision: Failed to compile evidence document.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-3 sm:p-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
          
          <motion.div initial={{ scale: 0.9, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 30, opacity: 0 }} className="relative w-full max-w-xl bg-white rounded-[44px] shadow-2xl overflow-hidden border border-white flex flex-col max-h-[90vh]">
            
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center shrink-0">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <FileUp size={24} className="relative z-10" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase italic tracking-tight leading-none mb-1">{task?.title}</h3>
                    <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest italic">Evidence Synchronization Node</p>
                  </div>
               </div>
               <button onClick={onClose} className="p-2.5 bg-white rounded-full text-slate-300 hover:text-rose-500 border border-slate-100 shadow-sm transition-all active:scale-90"><X size={20}/></button>
            </div>

            <div className="p-8 overflow-y-auto no-scrollbar space-y-8 flex-grow">
               
               <div className="bg-slate-950 p-6 rounded-[32px] text-white relative overflow-hidden shadow-xl">
                  <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 scale-150 pointer-events-none"><ShieldCheck size={80} /></div>
                  <div className="relative z-10 space-y-2">
                    <h4 className="text-[9px] font-black text-sky-400 uppercase tracking-[0.2em] italic flex items-center gap-2">
                       <ListChecks size={14} /> Mandatory Protocol
                    </h4>
                    <p className="text-xs font-bold text-slate-300 leading-relaxed italic">
                      {task?.instruction || "Submit clean evidence nodes. Fraudulent packets result in node termination."}
                    </p>
                  </div>
               </div>

               <div className="space-y-5">
                  <div className="flex justify-between items-end px-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Proof Buffer ({files.length}/10)</label>
                     <button onClick={() => fileInputRef.current?.click()} className="text-[9px] font-black text-indigo-600 uppercase flex items-center gap-1.5 hover:underline transition-all">
                        <Plus size={12} /> Add More Nodes
                     </button>
                  </div>

                  <div className={clsx(
                    "grid gap-3 transition-all",
                    files.length === 0 ? "grid-cols-1" : "grid-cols-2 sm:grid-cols-3"
                  )}>
                     {files.map((f, i) => (
                       <motion.div key={i} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="relative aspect-[4/3] rounded-3xl overflow-hidden border-2 border-slate-100 shadow-sm group">
                          <img src={f.preview} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                          <button onClick={() => removeFile(i)} className="absolute top-2 right-2 w-7 h-7 bg-rose-500/90 text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                             <Trash2 size={12} />
                          </button>
                          <div className="absolute bottom-2 left-2 bg-slate-900/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[6px] font-black text-white uppercase tracking-widest">NODE #{i+1}</div>
                       </motion.div>
                     ))}

                     {files.length === 0 && (
                       <div 
                         onClick={() => fileInputRef.current?.click()}
                         className="w-full py-16 border-2 border-dashed border-slate-200 rounded-[40px] bg-slate-50 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/40 transition-all duration-300 group"
                       >
                          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-200 shadow-md group-hover:scale-110 transition-transform duration-500 group-hover:text-indigo-500">
                             <Upload size={32} />
                          </div>
                          <div className="text-center px-6">
                             <p className="text-[11px] font-black text-slate-900 uppercase italic tracking-widest">Inject Evidence Nodes</p>
                             <p className="text-[8px] font-bold text-slate-400 uppercase mt-1 tracking-tighter">Tap to browse local directory</p>
                          </div>
                       </div>
                     )}
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple accept="image/*,application/pdf" className="hidden" />
               </div>

               {files.length > 1 && (
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 bg-indigo-50/60 rounded-[32px] flex items-start gap-4 border border-indigo-100 shadow-inner">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg"><FileText size={20} /></div>
                    <div className="space-y-1">
                       <h5 className="text-[10px] font-black text-indigo-900 uppercase italic">Smart Multi-Compiler Active</h5>
                       <p className="text-[8px] font-bold text-indigo-700 uppercase leading-relaxed tracking-wider opacity-80">
                         Your {files.length} evidence nodes will be auto-synthesized into a sequential PDF document to ensure rapid audit verification.
                       </p>
                    </div>
                 </motion.div>
               )}
            </div>

            <div className="p-8 bg-white border-t border-slate-50 shrink-0">
               <button 
                 onClick={generatePDFAndSubmit}
                 disabled={loading || files.length === 0}
                 className="w-full h-18 bg-slate-950 text-white rounded-[32px] font-black text-[12px] uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-30 group"
               >
                  {loading ? (
                    <Loader2 size={24} className="animate-spin text-sky-400"/>
                  ) : (
                    <>
                      <ShieldCheck size={26} className="text-sky-400 group-hover:scale-110 transition-transform" /> 
                      Commit To Registry
                    </>
                  )}
               </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};