
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { api } from '../../utils/api';
import { PopupRenderer } from './PopupRenderer';

/**
 * Noor Official V3 - Dynamic Connection Loader
 * Role: Silent Proxy for Third-Party Assets & Smart Popups
 */
export const IntegrationLoader = () => {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        const res = await api.get('/system/public/integrations');
        if (Array.isArray(res)) {
          setItems(res);
          injectScripts(res);
        }
      } catch (e) {
        console.error("Connection Hub logic failed.");
      }
    };

    fetchIntegrations();
  }, []);

  const injectScripts = (data: any[]) => {
    data.filter(i => i.type === 'script').forEach(item => {
      if (document.getElementById(item.id)) return;

      const element = document.createElement('div');
      element.id = item.id;
      element.style.display = 'none';
      element.innerHTML = item.content;

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
    <>
      <PopupRenderer />
    </>
  );
};
