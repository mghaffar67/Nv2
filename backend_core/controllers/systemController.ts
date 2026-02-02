import { dbNode } from '../utils/db';

/**
 * Noor V3 - System Public Data Controller
 * Ensures frontend never receives a 404 for configuration nodes.
 */
export const systemController = {
  // GET /api/system/public/campaigns
  getPublicPopups: async (req: any, res: any) => {
    try {
      const integrations = await dbNode.getIntegrations();
      
      // If DB is empty or fails, return empty array (200 OK)
      if (!integrations || !Array.isArray(integrations)) {
        return res.status(200).json([]);
      }

      // Filter for active popups/campaigns
      const activePopups = integrations.filter((item: any) => {
        const type = (item.type || '').toLowerCase();
        const isActive = item.isActive === true || item.is_active === true;
        return (type === 'campaign' || type === 'popup') && isActive;
      });

      return res.status(200).json(activePopups);
    } catch (error) {
      console.error("[SYSTEM_CTRL] Popup fetch failure:", error);
      // Return empty array instead of error to keep Frontend stable
      return res.status(200).json([]);
    }
  },

  // GET /api/system/public/integrations
  getPublicIntegrations: async (req: any, res: any) => {
    try {
      const integrations = await dbNode.getIntegrations();
      
      if (!integrations || !Array.isArray(integrations)) {
        return res.status(200).json([]);
      }

      // Filter for active script integrations (e.g. Tawk.to, FB Pixel)
      const activeScripts = integrations.filter((item: any) => {
        const type = (item.type || '').toLowerCase();
        const isActive = item.isActive === true || item.is_active === true;
        return type === 'script' && isActive;
      });

      return res.status(200).json(activeScripts);
    } catch (error) {
      console.error("[SYSTEM_CTRL] Integration fetch failure:", error);
      // Safe fallback for Frontend loaders
      return res.status(200).json([]);
    }
  }
};