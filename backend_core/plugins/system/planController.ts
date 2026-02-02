import { dbNode } from '../../utils/db';

/**
 * Noor Official V3 - Plan Management Controller
 */
export const planManagementController = {
  getAdminPlans: async (req: any, res: any) => {
    try {
      const data = JSON.parse(localStorage.getItem('noor_plans_registry') || '[]');
      return res.status(200).json(data);
    } catch (e) {
      return res.status(500).json({ message: "Plan Hub Offline." });
    }
  },

  savePlan: async (req: any, res: any) => {
    try {
      const { id, name, price, dailyLimit, dailyEarning, referralBonus, isActive, isPopular, colorTheme, validityDays } = req.body;
      
      // Safety Logic
      if (price < 0 || dailyLimit < 1) {
        return res.status(400).json({ message: "Invalid parameters detected." });
      }

      const data = JSON.parse(localStorage.getItem('noor_plans_registry') || '[]');
      
      const newEntry = {
        id: id || `PLAN-${Date.now()}`,
        name: name.toUpperCase(),
        price: Number(price),
        dailyLimit: Number(dailyLimit),
        dailyEarning: Number(dailyEarning),
        referralBonus: Number(referralBonus),
        isActive: isActive !== undefined ? isActive : true,
        isPopular: !!isPopular,
        colorTheme: colorTheme || '#4A6CF7',
        validityDays: Number(validityDays || 365)
      };

      let updatedData;
      if (id) {
        updatedData = data.map((p: any) => p.id === id ? newEntry : p);
      } else {
        updatedData = [...data, newEntry];
      }

      localStorage.setItem('noor_plans_registry', JSON.stringify(updatedData));
      window.dispatchEvent(new Event('noor_db_update'));
      
      return res.status(200).json({ success: true, message: "Station Node Synchronized.", data: newEntry });
    } catch (e) {
      return res.status(500).json({ message: "Deployment Failure." });
    }
  },

  deletePlan: async (req: any, res: any) => {
    try {
      const { id } = req.params;
      const data = JSON.parse(localStorage.getItem('noor_plans_registry') || '[]');
      const filtered = data.filter((p: any) => p.id !== id);
      localStorage.setItem('noor_plans_registry', JSON.stringify(filtered));
      window.dispatchEvent(new Event('noor_db_update'));
      return res.status(200).json({ success: true, message: "Node Removed." });
    } catch (e) {
      return res.status(500).json({ message: "Deletion Error." });
    }
  }
};