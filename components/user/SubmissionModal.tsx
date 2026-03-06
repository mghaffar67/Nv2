import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Upload, Camera, FileText, CheckCircle2, 
  Loader2, ShieldCheck, Image as ImageIcon,
  AlertCircle, ChevronRight, FileUp, Sparkles, Plus, Trash2,
  ListChecks, Info, FileCheck, Timer, ShieldAlert
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { clsx } from 'clsx';
import { useConfig } from '../../context/ConfigContext';

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: any;
  onSubmit: (evidence: string) => Promise<void>;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB Production Limit

export const SubmissionModal = ({ isOpen, onClose, task, onSubmit }: SubmissionModalProps) => {
  const { config } = useConfig();
  const [files, setFiles] = useState<{file: File, preview: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'uploading'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const selectedFiles = Array.from(e.target.files || []) as File[];
    if (selectedFiles.length === 0) return;

    // 1. Strict Size Audit
    const oversized = selectedFiles.some(f => f.size > MAX_FILE_SIZE);
    if (oversized) {
      setError("File size bohot bari hai (Maximum 5MB per file allowed).");
      return;
    }

    // 2. Format Audit
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    const invalidType = selectedFiles.some(f => !allowedTypes.includes(f.type));
    if (invalidType) {
      setError("Sirf Images ya PDF files upload kar sakte hain.");
      return;
    }

    const newFiles = selectedFiles.map(file => ({
      file,
      preview: file.type === 'application/pdf' ? 'pdf_icon' : URL.createObjectURL(file)
    }));

    const limit = 10; // Always allow up to 10 files
    setFiles(prev => [...prev, ...newFiles].slice(0, limit));
    
    // Reset input for same-file re-uploads if needed
    if (e.target) e.target.value = '';
  };

  const removeFile = (index: number) => {
    const updated = [...files];
    if (updated[index].preview !== 'pdf_icon') {
      URL.revokeObjectURL(updated[index].preview);
    }
    updated.splice(index, 1);
    setFiles(updated);
    if (updated.length === 0) setError(null);
  };

  const generateAndSubmit = async () => {
    if (files.length === 0) {
      setError("Pehle kam ka sabot (Screenshot/File) select karein.");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      let finalPayload = "";

      // Always generate PDF for multiple images
      setStatus('processing');
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 10;
      const availableWidth = pageWidth - (margin * 2);
      
      for (let i = 0; i < files.length; i++) {
        if (i > 0) doc.addPage();
        
        if (files[i].file.type === 'application/pdf') {
           // For simple mock we skip nested PDF embedding, in real app use pdf-lib
           continue; 
        }

        const imgData = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(files[i].file);
        });

        doc.addImage(imgData, 'JPEG', margin, margin, availableWidth, 0, undefined, 'MEDIUM');
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Noor V3 Evidence - Task ID: ${task?.id} - User Timestamp: ${new Date().toLocaleString()}`, margin, pageHeight - 5);
      }
      
      finalPayload = doc.output('datauristring');

      // Final Size Check for the Base64/PDF string (approx 8MB limit for sync safety)
      if (finalPayload.length > 8 * 1024 * 1024) {
        throw new Error("Payload size limit exceeded. Baraye meharbani kam files upload karein.");
      }

      setStatus('uploading');
      await onSubmit(finalPayload);
      setFiles([]);
      setStatus('idle');
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Kam submit nahi ho saka. Internet check karein aur dubara koshish karein.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-3 sm:p-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
          
          <motion.div 
            initial={{ scale: 0.95, y: 30, opacity: 0 }} 
            animate={{ scale: 1, y: 0, opacity: 1 }} 
            exit={{ scale: 0.95, y: 30, opacity: 0 }} 
            className="relative w-full max-w-xl bg-white rounded-[44px] shadow-2xl overflow-hidden border border-white flex flex-col max-h-[90vh]"
          >
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center shrink-0">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                    <FileUp size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase italic tracking-tight leading-none mb-1">Submit Proof</h3>
                    <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest italic">Encrypted Submission Tunnel</p>
                  </div>
               </div>
               <button onClick={onClose} className="p-2.5 bg-white rounded-full text-slate-300 hover:text-rose-500 border border-slate-100 shadow-sm transition-all"><X size={20}/></button>
            </div>

            <div className="p-8 overflow-y-auto no-scrollbar space-y-6 flex-grow">
               <AnimatePresence>
                 {error && (
                   <motion.div 
                     initial={{ height: 0, opacity: 0, x: -10 }}
                     animate={{ height: 'auto', opacity: 1, x: [0, -5, 5, -5, 5, 0] }}
                     exit={{ height: 0, opacity: 0 }}
                     className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-3 text-rose-600 mb-2 overflow-hidden"
                   >
                      <ShieldAlert size={20} className="shrink-0" />
                      <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">{error}</p>
                   </motion.div>
                 )}
               </AnimatePresence>

               <div className="bg-indigo-50/50 p-6 rounded-[32px] border border-indigo-100 space-y-4">
                  <h4 className="text-[10px] font-black text-indigo-900 uppercase tracking-widest flex items-center gap-2">
                     <ListChecks size={16} /> Final Audit Checklist
                  </h4>
                  <p className="text-[11px] font-bold text-indigo-700 italic">"{task?.instruction}"</p>
               </div>

               <div className="space-y-5">
                  <div className="flex justify-between items-end px-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Verification Artifacts ({files.length}/10)</label>
                     {files.length < 10 && (
                       <button onClick={() => fileInputRef.current?.click()} className="text-[9px] font-black text-indigo-600 uppercase flex items-center gap-1.5 hover:underline">
                          <Plus size={12} /> Add More
                       </button>
                     )}
                  </div>

                  <div className={clsx(
                    "grid gap-3 transition-all",
                    files.length === 0 ? "grid-cols-1" : "grid-cols-2 md:grid-cols-3"
                  )}>
                     {files.map((f, i) => (
                       <motion.div key={i} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="relative aspect-square rounded-[24px] overflow-hidden border-2 border-slate-100 shadow-sm group">
                          {f.preview === 'pdf_icon' ? (
                            <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center gap-2">
                               <FileText size={32} className="text-rose-500" />
                               <span className="text-[8px] font-black uppercase text-slate-400">PDF Node</span>
                            </div>
                          ) : (
                            <img src={f.preview} className="w-full h-full object-cover" alt="Proof" />
                          )}
                          <button onClick={() => removeFile(i)} className="absolute top-2 right-2 w-7 h-7 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"><Trash2 size={12} /></button>
                       </motion.div>
                     ))}

                     {(files.length < 10) && (
                       <div 
                         onClick={() => fileInputRef.current?.click()}
                         className={clsx(
                           "border-2 border-dashed border-slate-200 rounded-[32px] bg-slate-50 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-indigo-400 transition-all group",
                           files.length === 0 ? "py-16" : "aspect-square"
                         )}
                       >
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-200 shadow-md group-hover:text-indigo-500 transition-colors">
                             <Camera size={24} />
                          </div>
                          <p className="text-[10px] font-black text-slate-900 uppercase italic">Select Evidence</p>
                       </div>
                     )}
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple accept="image/*,application/pdf" className="hidden" />
               </div>

               {loading && (
                 <div className="space-y-3">
                   <div className="flex justify-between items-center px-1">
                      <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">{status === 'processing' ? 'Generating Secure PDF Registry...' : 'Syncing with Mainframe...'}</span>
                   </div>
                   <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} animate={{ width: status === 'processing' ? '60%' : '100%' }}
                        className="h-full bg-indigo-600"
                      />
                   </div>
                 </div>
               )}
            </div>

            <div className="p-8 bg-white border-t border-slate-100 shrink-0">
               <button 
                 onClick={generateAndSubmit}
                 disabled={loading || files.length === 0}
                 className="w-full h-18 bg-slate-950 text-white rounded-[32px] font-black text-[12px] uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-30"
               >
                  {loading ? (
                    <Loader2 size={24} className="animate-spin text-sky-400"/>
                  ) : (
                    <>
                      <ShieldCheck size={26} className="text-sky-400" />
                      Finish PDF & Submit
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