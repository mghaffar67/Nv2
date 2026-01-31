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
      // Fix: Added await to async db call
      const integrations = await dbNode.getIntegrations();
      // Fix: integrations is now the array from awaited promise
      const allPopups = integrations.filter((i: any) => i.type === 'campaign' && i.isActive);
      
      // Fix: Added await to async db call
      const user = userId ? await dbNode.findUserById(userId) : null;
      // Fix: user is now the object from awaited promise
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
      // Fix: Added await to async db call
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
      // Fix: data is now the array from awaited promise
      const existingIdx = data.findIndex((i: any) => i.id === id);
      
      if (existingIdx !== -1) {
        updatedData = [...data];
        updatedData[existingIdx] = newEntry;
      } else {
        // Fix: data is now the array from awaited promise
        updatedData = [newEntry, ...data];
      }

      // Fix: Added await to async db call
      await dbNode.saveIntegrations(updatedData);
      return res.status(200).json({ success: true, message: "Campaign Synchronized.", data: newEntry });
    } catch (e) {
      return res.status(500).json({ message: "Deployment failure." });
    }
  }
};