
import { dbNode } from '../../utils/db';

/**
 * Noor Official V3 - System Plugin Controller
 * Manages global application states and payment nodes using Database persistence.
 */
export const systemPluginController = {
  getSettings: async (req: any, res: any) => {
    try {
      const config = await dbNode.getConfig();
      if (!config) return res.status(404).json({ message: "System config not initialized." });
      return res.status(200).json(config);
    } catch (e) {
      return res.status(500).json({ message: "Registry Read Failure." });
    }
  },

  updateSettings: async (req: any, res: any) => {
    try {
      // Only admins can reach this via route-level auth middleware
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: "Protocol Violation: Admin privileges required." });
      }

      const currentConfig = await dbNode.getConfig();
      const updates = req.body;

      const newConfig = {
        ...currentConfig,
        ...updates
      };

      await dbNode.saveConfig(newConfig);
      
      return res.status(200).json({ 
        success: true, 
        message: "System settings synchronized successfully.",
        config: newConfig
      });
    } catch (e) {
      return res.status(500).json({ message: "Registry Write Failure." });
    }
  }
};
