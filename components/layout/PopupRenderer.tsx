import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Zap } from 'lucide-react';
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
          const now = new Date();
          const campaign = res.find((p: any) => {
             // 1. Time Validity Logic
             if (p.validFrom && new Date(p.validFrom) > now) return false;
             if (p.validUntil && new Date(p.validUntil) < now) return false;

             // 2. Specific User Logic
             if (p.targetAudience === 'specific') {
                if (!p.specificUserIds?.split(',').map((id: string) => id.trim()).includes(user?.id)) return false;
             }

             // 3. Frequency Logic
             const seenKey = `popup_seen_${p.id}`;
             const lastSeen = localStorage.getItem(seenKey);
             const todayStr = now.toISOString().split('T')[0];

             if (p.frequency === 'once_lifetime' && lastSeen) return false;
             if (p.frequency === 'once_daily' && lastSeen === todayStr) return false;

             return true;
          });

          if (campaign) {
            setTimeout(() => setActivePopup(campaign), 2500);
          }
        }
      } catch (e) {
        console.error("Popup intelligence node failed.");
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
      if (activePopup.btnAction.startsWith('http')) window.open(activePopup.btnAction, '_blank');
      else navigate(activePopup.btnAction);
    }
    handleClose();
  };

  return (
    <AnimatePresence>
      {activePopup && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleClose} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
          <motion.div initial={{ scale: 0.9, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 30, opacity: 0 }} className="relative z-10 w-full max-w-[360px] bg-white rounded-[44px] shadow-2xl overflow-hidden border border-white">
             {activePopup.imageUrl && <img src={activePopup.imageUrl} className="h-44 w-full object-cover" alt="Campaign" />}
             <div className="p-8 text-center space-y-5">
                <h3 className="text-xl font-black text-slate-900 uppercase italic leading-tight">{activePopup.title}</h3>
                <p className="text-[11px] font-bold text-slate-500 leading-relaxed uppercase">{activePopup.bodyText}</p>
                <button onClick={handleAction} className="w-full h-14 bg-slate-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-xl">{activePopup.btnText || 'Explore'} <ChevronRight size={16} /></button>
                <button onClick={handleClose} className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">Dismiss Intelligence</button>
             </div>
             <button onClick={handleClose} className="absolute top-4 right-4 p-2 bg-black/20 backdrop-blur-md text-white rounded-full hover:bg-rose-500 transition-all"><X size={16} /></button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};