
import React, { useState } from 'react';
import { useConfig } from '../../../context/ConfigContext';
import { 
  MessageSquare, Star, Plus, Trash2, Save, 
  CheckCircle2, User, Quote, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ReviewsManager = () => {
  const { config, updateConfig } = useConfig();
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({ name: '', comment: '', rating: 5 });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleAddReview = () => {
    if (!newReview.name || !newReview.comment) return;
    const updatedReviews = [newReview, ...config.appearance.reviews];
    updateConfig({ appearance: { ...config.appearance, reviews: updatedReviews } });
    setNewReview({ name: '', comment: '', rating: 5 });
    setShowForm(false);
    triggerSuccess();
  };

  const handleDelete = (index: number) => {
    if (!window.confirm("Delete this testimonial?")) return;
    const updatedReviews = config.appearance.reviews.filter((_, i) => i !== index);
    updateConfig({ appearance: { ...config.appearance, reviews: updatedReviews } });
    triggerSuccess();
  };

  const triggerSuccess = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="space-y-8 pb-20 animate-fade-in">
      <div className="bg-slate-950 p-8 rounded-[40px] text-white relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 p-10 opacity-5 scale-[2] rotate-12"><MessageSquare size={64} /></div>
         <div className="relative z-10 flex justify-between items-end">
            <div>
               <h2 className="text-2xl font-black mb-1 uppercase tracking-tight italic">Reviews Hub.</h2>
               <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Community Sentiment Control</p>
            </div>
            <button 
               onClick={() => setShowForm(true)}
               className="h-12 px-6 bg-sky-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 active:scale-95 shadow-xl shadow-sky-500/20"
            >
               <Plus size={16} /> New Echo
            </button>
         </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Partner Name</label>
                   <input 
                     type="text" value={newReview.name} onChange={e => setNewReview({...newReview, name: e.target.value})}
                     className="w-full h-12 px-5 bg-white border border-slate-200 rounded-2xl font-black text-xs outline-none" 
                     placeholder="e.g. Hammad Malik"
                   />
                </div>
                <div className="space-y-1.5">
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Trust Rating</label>
                   <select 
                     value={newReview.rating} onChange={e => setNewReview({...newReview, rating: Number(e.target.value)})}
                     className="w-full h-12 px-5 bg-white border border-slate-200 rounded-2xl font-black text-xs outline-none"
                   >
                      {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Stars (Perfect)</option>)}
                   </select>
                </div>
             </div>
             <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Testimonial Content</label>
                <textarea 
                  rows={3} value={newReview.comment} onChange={e => setNewReview({...newReview, comment: e.target.value})}
                  className="w-full p-5 bg-white border border-slate-200 rounded-3xl font-medium text-xs text-slate-600 outline-none resize-none"
                  placeholder="Share the success story..."
                />
             </div>
             <div className="flex gap-2">
                <button onClick={handleAddReview} className="flex-1 h-12 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 shadow-lg">Push to Live</button>
                <button onClick={() => setShowForm(false)} className="px-8 h-12 bg-white border border-slate-200 text-slate-400 rounded-2xl font-black text-[10px] uppercase">Abort</button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
         <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Live Testimonials</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {config.appearance.reviews.map((rev, idx) => (
               <div key={idx} className="bg-white p-6 rounded-[36px] border border-slate-100 shadow-sm group relative">
                  <button 
                    onClick={() => handleDelete(idx)}
                    className="absolute top-4 right-4 w-8 h-8 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all active:scale-90"
                  >
                     <Trash2 size={14} />
                  </button>
                  <div className="flex gap-0.5 mb-3">
                     {[...Array(rev.rating)].map((_, i) => <Star key={i} size={8} className="fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium italic mb-6 leading-relaxed line-clamp-2">"{rev.comment}"</p>
                  <div className="flex items-center gap-3 border-t border-slate-50 pt-4">
                     <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 font-black text-[10px] italic">
                        {rev.name.charAt(0)}
                     </div>
                     <div>
                        <h4 className="text-[9px] font-black text-slate-900 uppercase">{rev.name}</h4>
                        <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">Active Associate</p>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>

      <AnimatePresence>
        {saveSuccess && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-2xl z-50">
             <CheckCircle2 size={16} /> Hub Synchronized
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReviewsManager;
