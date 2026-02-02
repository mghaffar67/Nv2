import { dbNode } from '../../utils/db';

/**
 * Noor V3 - Advanced Campaign (Popup) Controller
 */
export const popupController = {
  // PUBLIC: Get matching campaigns for current user
  getActivePopups: async (req: any, res: any) => {
    try {
      const { userId } = req.query;
      const integrations = await dbNode.getIntegrations();
      
      if (!integrations || !Array.isArray(integrations)) {
        return res.status(200).json([]);
      }

      // Filter for active campaigns/popups
      const allPopups = integrations.filter((i: any) => {
        const typeStr = (i.type || '').toLowerCase();
        const isCampaign = (typeStr === 'campaign' || typeStr === 'popup');
        const isActive = (i.isActive !== false && i.isactive !== false && i.is_active !== false);
        return isCampaign && isActive;
      });
      
      const user = userId ? await dbNode.findUserById(userId) : null;
      const userPlan = (user?.currentPlan || user?.current_plan || 'None').toUpperCase();
      const hasPlan = userPlan !== 'None';

      const filtered = allPopups.filter((p: any) => {
        const target = (p.targetAudience || p.target_audience || 'all').toLowerCase();
        if (target === 'paid_users' && !hasPlan) return false;
        if (target === 'free_users' && hasPlan) return false;
        if (target === 'vip_users' && (userPlan !== 'DIAMOND')) return false;
        return true;
      });

      // Normalize object for frontend consumption
      const normalized = filtered.map((p: any) => ({
        id: p.id,
        title: p.title || p.name,
        bodyText: p.bodyText || p.content || '',
        imageUrl: p.imageUrl || p.image_url || '',
        btnText: p.btnText || 'Learn More',
        btnAction: p.btnAction || '/user/dashboard',
        frequency: p.frequency || 'always',
        templateStyle: p.templateStyle || 'modern_modal'
      }));

      return res.status(200).json(normalized);
    } catch (e) {
      console.error("Popup Retrieval Failure:", e);
      // Fail-safe: Always return empty array to prevent Frontend crash
      return res.status(200).json([]); 
    }
  },

  saveCampaign: async (req: any, res: any) => {
    try {
      const { id, title, bodyText, imageUrl, btnText, btnAction, targetAudience, frequency, isActive } = req.body;
      const data = await dbNode.getIntegrations();
      
      const newEntry = {
        id: id || `CMP-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        type: 'campaign',
        title,
        bodyText,
        imageUrl,
        btnText,
        btnAction,
        targetAudience: targetAudience || 'all', 
        frequency: frequency || 'once_daily', 
        isActive: isActive !== undefined ? isActive : true,
        updatedAt: new Date().toISOString()
      };

      let updatedData;
      const existingIdx = data.findIndex((i: any) => i.id === id);
      
      if (existingIdx !== -1) {
        updatedData = [...data];
        updatedData[existingIdx] = newEntry;
      } else {
        updatedData = [newEntry, ...data];
      }

      await dbNode.saveIntegrations(updatedData);
      return res.status(200).json({ success: true, message: "Campaign Synchronized.", data: newEntry });
    } catch (e) {
      return res.status(500).json({ message: "Deployment failure." });
    }
  }
};