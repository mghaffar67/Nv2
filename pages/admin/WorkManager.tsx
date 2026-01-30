
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Zap, CheckCircle2, Clock, Eye, Edit3, Trash2, X, Filter, RefreshCw, Briefcase, FileText, FileDown, Image as ImageIcon, Maximize2 } from 'lucide-react';
import { clsx } from 'clsx';
import { workController } from '../../backend_core/controllers/workController';
import { dbNode } from '../../backend_core/utils/db';
import TaskFormModal from '../../components/admin/TaskFormModal';

const CATEGORIES = [
  { id: 'all', label: 'All Work' },
  { id: 'social_media', label: 'Social Media' },
  { id: 'data_entry', label: 'Data Entry' },
  { id: 'content_creation', label: 'Article/Text' },
  { id: 'verification', label: 'Review Work' }
];

const ProofViewerModal = ({ isOpen, onClose, proof }: any) => {
  const [fullScreen, setFullScreen] = useState(false);
  if (!proof) return null;
  const isPDF = proof.startsWith('data:application/pdf');

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-2 sm:p-4">
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
           <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }} 
              className={clsx(
                "relative bg-white rounded-[44px] shadow-2xl overflow-hidden flex flex-col transition-all duration-500",
                fullScreen ? "w-[98vw] h-[95vh]" : "w-full max-w-4xl h-[85vh]"
              )}
           >
              <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center shrink-0">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white"><FileText size={20}/></div>
                   <div>
                      <h3 className="font-black text-slate-800 uppercase tracking-tight italic leading-none mb-1">Evidence Audit</h3>
                      <p className="text-[7px] font-bold text-slate-400 uppercase">Registry Verified Payload</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-2">
                    <button onClick={() => setFullScreen(!fullScreen)} className="p-2.5 bg-white border border-slate-100 rounded-full text-slate-400 hover:text-indigo-600 transition-all"><Maximize2 size={16}/></button>
                    <button onClick={onClose} className="p-2.5 hover:bg-rose-50 hover:text-rose-500 rounded-full transition-all"><X size={20}/></button>
                 </div>
              </div>
              <div className="flex-grow bg-slate-100 p-4 overflow-hidden relative">
                 {isPDF ? (
                   <iframe src={proof} className="w-full h-full rounded-2xl border-none shadow-inner bg-white" title="PDF Document" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center overflow-auto p-4 bg-white rounded-2xl shadow-inner">
                      <img src={proof} className="max-w-full rounded-lg shadow-lg border border-slate-50" alt="Submission Evidence" />
                   </div>
                 )}
              </div>
              <div className="p-6 bg-white border-t border-slate-50 flex justify-between items-center shrink-0">
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] italic">System Integrity: {isPDF ? 'PDF Node' : 'Image Buffer'}</p>
                 </div>
                 <div className="flex gap-4">
                    <a href={proof} download={`audit-${Date.now()}`} className="h-10 px-6 bg-slate-950 text-white rounded-xl font-black text-[9px] uppercase flex items-center gap-2 shadow-lg hover:bg-indigo-600 transition-all">
                       <FileDown size={14} /> Download for Archive
                    </a>
                 </div>
              </div>
           </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const WorkManager = () => {
  const [activeTab, setActiveTab] = useState<'manage' | 'review'>('manage');
  const [activeCategory, setActiveCategory] = useState('all');
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [selectedProof, setSelectedProof] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const taskRes = dbNode.getTasks();
      setTasks(Array.isArray(taskRes) ? taskRes : []);
      const subsRes = await new Promise<any[]>(r => workController.getAllSubmissions({}, { status: () => ({ json: r }) }));
      setSubmissions(Array.isArray(subsRes) ? subsRes : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleReview = async (sub: any, action: 'approved' | 'rejected') => {
    try {
      await workController.reviewSubmission({ 
        body: { userId: sub.userId, submissionId: sub.id, status: action, reward: sub.reward } 
      }, { status: () => ({ json: () => {} }) });
      fetchData();
    } catch (err) { alert("Review synchronization failed."); }
  };

  const filteredTasks = useMemo(() => {
    if (!Array.isArray(tasks)) return [];
    if (activeCategory === 'all') return tasks;
    return tasks.filter(t => t.category === activeCategory);
  }, [tasks, activeCategory]);

  return (
    <div className="space-y-6 md:space-y-8 pb-24 animate-fade-in max-w-7xl mx-auto px-1.5">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2 pt-4">
         <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic leading-none">Work <span className="text-indigo-600">Inventory.</span></h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px] mt-2 italic">Assignment Management & Quality Assurance</p>
         </div>
         <button onClick={() => { setSelectedTask(null); setIsTaskModalOpen(true); }} className="h-12 px-8 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2 active:scale-95 transition-all"><Plus size={18}/> Add Logic Node</button>
      </header>

      <div className="flex bg-white p-1.5 rounded-[28px] border border-slate-100 shadow-sm mx-1">
         <button onClick={() => setActiveTab('manage')} className={clsx("flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all", activeTab === 'manage' ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:text-slate-900")}>Database</button>
         <button onClick={() => setActiveTab('review')} className={clsx("flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all relative", activeTab === 'review' ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:text-slate-900")}>
            Review Queue
            {submissions.filter(s => s.status === 'pending').length > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
            )}
         </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'manage' ? (
          <motion.div key="manage" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex gap-2 overflow-x-auto no-scrollbar px-1">
               {CATEGORIES.map(cat => (
                 <button 
                  key={cat.id} onClick={() => setActiveCategory(cat.id)}
                  className={clsx(
                    "px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                    activeCategory === cat.id ? "bg-indigo-600 text-white" : "bg-white text-slate-400 border border-slate-100"
                  )}
                 >
                   {cat.label}
                 </button>
               ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-1">
              {filteredTasks.map(task => (
                <div key={task.id} className="bg-white p-6 rounded-[40px] border border-slate-100 shadow-sm flex flex-col group hover:border-indigo-200 transition-all">
                   <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-slate-900 text-sky-400 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Zap size={22} fill="currentColor"/>
                      </div>
                      <div className="text-right">
                         <p className="text-[11px] font-black text-slate-900 leading-none mb-1.5">Rs {task.reward}</p>
                         <div className="flex flex-col items-end gap-1">
                            <span className="text-[8px] font-black bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md border border-indigo-100 uppercase">{task.plan}</span>
                            <span className="text-[7px] font-bold text-slate-400 uppercase italic">Valid: {task.validityDays || 30} Days</span>
                         </div>
                      </div>
                   </div>
                   <h4 className="text-sm font-black text-slate-800 uppercase italic mb-1 truncate">{task.title}</h4>
                   <p className="text-[10px] font-medium text-slate-400 line-clamp-2 leading-relaxed mb-6 italic flex-grow">"{task.instruction}"</p>
                   <div className="flex gap-2 border-t border-slate-50 pt-4 mt-auto">
                      <button onClick={() => { setSelectedTask(task); setIsTaskModalOpen(true); }} className="flex-1 h-11 bg-slate-50 text-slate-400 rounded-xl font-black text-[9px] uppercase flex items-center justify-center gap-2 hover:bg-slate-900 hover:text-white transition-all"><Edit3 size={14}/> Edit</button>
                      <button onClick={() => {if(window.confirm('Delete task node?')) { const db = tasks.filter(t => t.id !== task.id); dbNode.saveTasks(db); fetchData(); }}} className="w-11 h-11 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center active:scale-90 transition-all"><Trash2 size={16}/></button>
                   </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="review" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 mx-1">
             {(Array.isArray(submissions) ? submissions : []).filter(s => s.status === 'pending').map(sub => (
               <div key={sub.id} className="bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
                  <div className="flex items-center gap-4 overflow-hidden">
                     <div className="w-12 h-12 bg-slate-900 text-sky-400 rounded-xl flex items-center justify-center font-black italic shadow-lg shrink-0 text-lg">{sub.userName?.charAt(0)}</div>
                     <div className="overflow-hidden">
                        <h4 className="font-black text-slate-900 text-[11px] uppercase truncate">{sub.userName}</h4>
                        <p className="text-[8px] font-bold text-slate-400 uppercase italic truncate mt-1">{sub.taskTitle}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0 md:border-l md:pl-6 border-slate-50">
                     <button onClick={() => setSelectedProof(sub.userAnswer)} className="h-12 px-6 bg-slate-50 rounded-xl border border-slate-100 hover:border-sky-400 transition-all group flex items-center gap-2 text-[10px] font-black uppercase text-slate-500">
                        {sub.userAnswer?.startsWith('data:application/pdf') ? <FileText size={16} /> : <ImageIcon size={16} />}
                        Audit Protocol
                     </button>
                     <p className="text-xs font-black text-emerald-600 italic">Rs {sub.reward}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                     <button onClick={() => handleReview(sub, 'approved')} className="px-8 h-12 bg-green-500 text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">Authorize</button>
                     <button onClick={() => handleReview(sub, 'rejected')} className="px-5 h-12 bg-rose-50 text-rose-500 rounded-xl border border-rose-100 active:scale-95 transition-all"><X size={20}/></button>
                  </div>
               </div>
             ))}
          </motion.div>
        )}
      </AnimatePresence>

      <TaskFormModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} task={selectedTask} onUpdate={fetchData} />
      <ProofViewerModal isOpen={!!selectedProof} onClose={() => setSelectedProof(null)} proof={selectedProof} />
    </div>
  );
};

export default WorkManager;
