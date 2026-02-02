
import { dbNode } from '../../utils/db';

/**
 * Noor V3 - Advanced Campaign (Popup) Controller
 * Handles targeting, frequency and live status.
 */
export const popupController = {
  // 1. PUBLIC: Get matching campaign for current user
  getPublicCampaigns: async (req: any, res: any) => {
    try {
      const { userId } = req.query;
      // Add await to fix Promise filter error
      const allPopups = (await dbNode.getIntegrations()).filter((i: any) => i.type === 'campaign' && i.isActive);
      
      // Add await to fix Promise property access error
      const user = userId ? await dbNode.findUserById(userId) : null;
      // Fix property access on Promise
      const hasPlan = user?.currentPlan && user.currentPlan !== 'None';

      const filtered = allPopups.filter((p: any) => {
        if (p.targetAudience === 'paid_users' && !hasPlan) return false;
        if (p.targetAudience === 'free_users' && hasPlan) return false;
        return true;
      });

      return res.status(200).json(filtered);
    } catch (e) {
      return res.status(500).json({ message: "Campaign Node failure." });
    }
  },

  // 2. ADMIN: Manage Campaigns
  saveCampaign: async (req: any, res: any) => {
    try {
      const { id, title, bodyText, imageUrl, btnText, btnAction, targetAudience, frequency, isActive } = req.body;
      // Add await to fix Promise findIndex error
      const data = await dbNode.getIntegrations();
      
      const newEntry = {
        id: id || `CMP-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        type: 'campaign',
        title,
        bodyText,
        imageUrl,
        btnText,
        btnAction,
        targetAudience, // 'all', 'free_users', 'paid_users'
        frequency, // 'always', 'once_daily', 'once_lifetime'
        isActive: isActive !== undefined ? isActive : true,
        updatedAt: new Date().toISOString()
      };

      let updatedData;
      // Fix findIndex on Promise error
      const existingIdx = data.findIndex((i: any) => i.id === id);
      
      if (existingIdx !== -1) {
        // Fix iterator error on Promise
        updatedData = [...data];
        updatedData[existingIdx] = newEntry;
      } else {
        // Fix iterator error on Promise
        updatedData = [newEntry, ...data];
      }

      await dbNode.saveIntegrations(updatedData);
      return res.status(200).json({ success: true, message: "Campaign Synchronized.", data: newEntry });
    } catch (e) {
      return res.status(500).json({ message: "Deployment failure." });
    }
  }
};
