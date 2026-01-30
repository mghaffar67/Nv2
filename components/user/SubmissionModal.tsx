import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Upload, Camera, FileText, CheckCircle2, 
  Loader2, ShieldCheck, Image as ImageIcon,
  AlertCircle, ChevronRight, FileUp, Sparkles, Plus, Trash2,
  ListChecks, Info, Link as LinkIcon, FileCheck
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

export const SubmissionModal = ({ isOpen, onClose, task, onSubmit }: SubmissionModalProps) => {
  const { config } = useConfig();
  const [files, setFiles] = useState<{file: File, preview: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'processing' | 'uploading'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []) as File[];
    if (selectedFiles.length === 0) return;

    const newFiles = selectedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    // Protocol: Multi-image or PDF allows 5, Single allows 1
    const limit = config.submissionMode === 'single_image' ? 1 : 5;
    setFiles(prev => [...prev, ...newFiles].slice(0, limit));
  };

  const removeFile = (index: number) => {
    const updated = [...files];
    URL.revokeObjectURL(updated[index].preview);
    updated.splice(index, 1);
    setFiles(updated);
  };

  const generateAndSubmit = async () => {
    if (files.length === 0) return alert("Select evidence nodes.");
    
    setLoading(true);
    
    try {
      let finalPayload = "";

      if (config.submissionMode === 'auto_pdf') {
        setStatus('processing');
        const doc = new jsPDF();
        
        for (let i = 0; i < files.length; i++) {
          if (i > 0) doc.addPage();
          
          const imgData = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(files[i].file);
          });

          // Aspect ratio logic for clean PDF
          const pageWidth = doc.internal.pageSize.getWidth();
          const pageHeight = doc.internal.pageSize.getHeight();
          doc.addImage(imgData, 'JPEG', 10, 10, pageWidth - 20, 0); // Height auto-calc
        }
        
        finalPayload = doc.output('datauristring');
      } else if (config.submissionMode === 'multi_image') {
        // Simple array logic (simplified for this mock as a combined string/array)
        const readers = files.map(f => {
          return new Promise<string>(r => {
             const reader = new FileReader();
             reader.onload = () => r(reader.result as string);
             reader.readAsDataURL(f.file);
          });
        });
        const results = await Promise.all(readers);
        finalPayload = JSON.stringify(results);
      } else {
        // Single Image Mode
        const reader = new FileReader();
        finalPayload = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(files[0].file);
        });
      }

      setStatus('uploading');
      await onSubmit(finalPayload);
      setFiles([]);
      setStatus('idle');
      onClose();
    } catch (err) {
      alert("Submission Node Error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-3 sm:p-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
          
          <motion.div initial={{ scale: 0.95, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, y: 30, opacity: 0 }} className="relative w-full max-w-xl bg-white rounded-[44px] shadow-2xl overflow-hidden border border-white flex flex-col max-h-[90vh]">
            
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center shrink-0">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                    <FileUp size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase italic tracking-tight leading-none mb-1">Upload Work</h3>
                    <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest italic">Submit proof to receive earning</p>
                  </div>
               </div>
               <button onClick={onClose} className="p-2.5 bg-white rounded-full text-slate-300 hover:text-rose-500 border border-slate-100 shadow-sm transition-all"><X size={20}/></button>
            </div>

            <div className="p-8 overflow-y-auto no-scrollbar space-y-8 flex-grow">
               
               <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 space-y-4 shadow-inner">
                  <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                     <ListChecks size={16} className="text-indigo-500" /> Standard Instructions
                  </h4>
                  <p className="text-[11px] font-bold text-slate-600 italic">"{task?.instruction}"</p>
               </div>

               <div className="space-y-5">
                  <div className="flex justify-between items-end px-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Evidence Nodes ({files.length}/{config.submissionMode === 'single_image' ? 1 : 5})</label>
                     {config.submissionMode !== 'single_image' && (
                       <button onClick={() => fileInputRef.current?.click()} className="text-[9px] font-black text-indigo-600 uppercase flex items-center gap-1.5 hover:underline transition-all">
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
                          <img src={f.preview} className="w-full h-full object-cover" />
                          <button onClick={() => removeFile(i)} className="absolute top-2 right-2 w-7 h-7 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg"><Trash2 size={12} /></button>
                       </motion.div>
                     ))}

                     {(files.length === 0 || (config.submissionMode !== 'single_image' && files.length < 5)) && (
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
                          <div className="text-center px-4">
                             <p className="text-[10px] font-black text-slate-900 uppercase italic">{files.length === 0 ? 'Upload Evidence' : 'Add Node'}</p>
                          </div>
                       </div>
                     )}
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple={config.submissionMode !== 'single_image'} accept="image/*" className="hidden" />
               </div>

               {loading && (
                 <div className="space-y-3">
                   <div className="flex justify-between items-center px-1">
                      <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">{status === 'processing' ? 'Generating PDF Document...' : 'Uploading Payload...'}</span>
                      <span className="text-[9px] font-black text-slate-400 uppercase">Audit Sync</span>
                   </div>
                   <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} animate={{ width: status === 'processing' ? '40%' : '100%' }}
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
                      {config.submissionMode === 'auto_pdf' ? <FileCheck size={26} className="text-sky-400" /> : <ShieldCheck size={26} className="text-sky-400" />}
                      {config.submissionMode === 'auto_pdf' ? 'Generate PDF & Submit' : 'Verify & Submit'}
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