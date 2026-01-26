
import { useState, useEffect } from 'react';
import { api } from '../utils/api';

/**
 * Noor V3 - CMS Hook
 * Fetches dynamic content and provides fallbacks
 */
export const useSiteContent = (pageSlug: string, defaultContent: any = {}) => {
  const [content, setContent] = useState<any>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/system/site-content/${pageSlug}`);
        if (res && res.sections) {
          setContent(res.sections);
        }
      } catch (err: any) {
        console.warn(`CMS Node [${pageSlug}] offline. Using local fallback.`);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [pageSlug]);

  return { content, loading, error };
};
