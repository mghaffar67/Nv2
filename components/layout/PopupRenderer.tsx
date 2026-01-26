
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Zap, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

export const PopupRenderer = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activePopup, setActivePopup] = useState<any>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const userId = user?.id;
        const res = await api.get(`/system/public/campaigns${userId ? `?userId=${userId}` : ''}`);
        
        if (res && res.length > 0) {
          const campaign = res[0]; // Logic: Show latest/top campaign
          
          // Frequency Check
          const seenKey = `popup_seen_${campaign.id}`;
          const lastSeen = localStorage.getItem(seenKey);
          const today = new Date().toISOString().split('T')[0];

          if (campaign.frequency === 'once_lifetime' && lastSeen) return;
          if (campaign.frequency === 'once_daily' && lastSeen === today) return;

          // Artificial delay for better UX
          setTimeout(() => setActivePopup(campaign), 2500);
        }
      } catch (e) {
        console.error("Popup Hub logic failed.");
      }
    };

    fetchCampaigns();
  }, [user?.id]);

  const handleClose = () => {
    if (activePopup) {
      const seenKey = `popup_seen_${activePopup.id}`;
      const today = new Date().toISOString().split('T')[0];
      
      if (activePopup.frequency === 'once_lifetime') localStorage.setItem(seenKey, 'true');
      if (activePopup.frequency === 'once_daily') localStorage.setItem(seenKey, today);
    }
    setActivePopup(null);
  };

  const handleAction = () => {
    if (activePopup.btnAction) {
      if (activePopup.btnAction.startsWith('http')) {
        window.open(activePopup.btnAction, '_blank');
      } else {
        navigate(activePopup.btnAction);
      }
    }
    handleClose();
  };

  return (
    <AnimatePresence>
      {activePopup && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          />
          
          <motion.div 
            initial={{ scale: 0.9, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 30, opacity: 0 }}
            className="relative z-10 w-full max-w-[360px] bg-white rounded-[44px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] overflow-hidden border border-white"
          >
             {activePopup.imageUrl && (
               <div className="relative h-44 overflow-hidden">
                  <img src={activePopup.imageUrl} className="w-full h-full object-cover" alt="Campaign" />
                  <div className="absolute top-4 left-4">
                     <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl text-white border border-white/20">
                        <Zap size={16} fill="currentColor" className="text-amber-400" />
                     </div>
                  </div>
               </div>
             )}
             
             <div className="p-8 text-center space-y-5">
                <div>
                   <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter leading-tight mb-2">{activePopup.title}</h3>
                   <p className="text-[11px] font-bold text-slate-500 leading-relaxed uppercase">{activePopup.bodyText}</p>
                </div>

                <button 
                   onClick={handleAction}
                   className="w-full h-14 bg-slate-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                   {activePopup.btnText || 'Explore'} <ChevronRight size={16} />
                </button>

                <button 
                  onClick={handleClose}
                  className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors"
                >
                  Dismiss for now
                </button>
             </div>

             <div className="absolute top-4 right-4 z-20">
                <button onClick={handleClose} className="p-2 bg-black/20 backdrop-blur-md text-white rounded-full hover:bg-rose-500 transition-all border border-white/10">
                   <X size={16} />
                </button>
             </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
