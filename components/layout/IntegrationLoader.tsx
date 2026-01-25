
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { api } from '../../utils/api';

/**
 * Noor Official V3 - Dynamic Connection Loader
 * Role: Silent Proxy for Third-Party Assets & Popups
 */
export const IntegrationLoader = () => {
  const [items, setItems] = useState<any[]>([]);
  const [activePopup, setActivePopup] = useState<any>(null);

  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        const res = await api.get('/system/public/integrations');
        if (Array.isArray(res)) {
          setItems(res);
          injectScripts(res);
          // Check for popups
          const popup = res.find(i => i.type === 'popup');
          if (popup) {
            // Delay popup by 2s for better UX
            setTimeout(() => {
              setActivePopup(popup);
            }, 2000);
          }
        }
      } catch (e) {
        console.error("Connection Hub logic failed.");
      }
    };

    fetchIntegrations();

    // Global Close Function for injected HTML
    (window as any).closeNoorPopup = () => setActivePopup(null);

    return () => {
      delete (window as any).closeNoorPopup;
    };
  }, []);

  const injectScripts = (data: any[]) => {
    data.filter(i => i.type === 'script').forEach(item => {
      // Basic check to see if already injected (simulated)
      if (document.getElementById(item.id)) return;

      const element = document.createElement('div');
      element.id = item.id;
      element.style.display = 'none';
      element.innerHTML = item.content;

      // Handle raw JS extraction if present
      const scripts = element.getElementsByTagName('script');
      for (let i = 0; i < scripts.length; i++) {
        const s = document.createElement('script');
        if (scripts[i].src) {
          s.src = scripts[i].src;
        } else {
          s.textContent = scripts[i].textContent;
        }
        document.head.appendChild(s);
      }

      if (item.position === 'head') {
        document.head.appendChild(element);
      } else {
        document.body.appendChild(element);
      }
    });
  };

  return (
    <AnimatePresence>
      {activePopup && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePopup(null)}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          />
          
          <motion.div 
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 30, opacity: 0 }}
            className="relative z-10 max-w-full"
          >
             {/* Dynamic Render of Admin-Provided HTML */}
             <div dangerouslySetInnerHTML={{ __html: activePopup.content }} />
             
             {/* Invisible close catch for safety */}
             <button 
               onClick={() => setActivePopup(null)}
               className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-slate-100 text-slate-400 hover:text-rose-500 transition-all"
             >
                <X size={20} />
             </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
