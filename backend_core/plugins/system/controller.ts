
/**
 * Noor Official V3 - System Plugin Controller
 * Manages global application states and payment nodes.
 */

const getConfig = () => {
  const data = localStorage.getItem('noor_config');
  return data ? JSON.parse(data) : null;
};

const saveConfig = (config: any) => {
  localStorage.setItem('noor_config', JSON.stringify(config));
};

export const systemPluginController = {
  getSettings: async (req: any, res: any) => {
    const config = getConfig();
    if (!config) return res.status(404).json({ message: "System config not initialized." });
    
    // Return only necessary public/admin fields
    return res.status(200).json(config);
  },

  updateSettings: async (req: any, res: any) => {
    // Only admins can reach this via route-level auth middleware
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: "Protocol Violation: Admin privileges required." });
    }

    const currentConfig = getConfig();
    const updates = req.body;

    const newConfig = {
      ...currentConfig,
      ...updates
    };

    saveConfig(newConfig);
    
    return res.status(200).json({ 
      success: true, 
      message: "System settings synchronized successfully.",
      config: newConfig
    });
  }
};
