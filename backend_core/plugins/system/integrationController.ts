
import { dbNode } from '../../utils/db';

/**
 * Noor Official V3 - Integration Protocol
 * Handles External Connections and Dynamic Popups.
 */
export const integrationController = {
  // 1. PUBLIC ENDPOINT: Fetch active items for the App
  getPublicIntegrations: async (req: any, res: any) => {
    try {
      const data = dbNode.getIntegrations();
      const activeOnly = data.filter((i: any) => i.isActive);
      return res.status(200).json(activeOnly);
    } catch (e) {
      return res.status(500).json({ message: "Connection Node failure." });
    }
  },

  // 2. ADMIN ENDPOINT: Get all items
  getAllIntegrations: async (req: any, res: any) => {
    try {
      const data = dbNode.getIntegrations();
      return res.status(200).json(data);
    } catch (e) {
      return res.status(500).json({ message: "Registry Hub access denied." });
    }
  },

  // 3. ADMIN ENDPOINT: Create or Update
  saveIntegration: async (req: any, res: any) => {
    try {
      const { id, name, type, position, content, isActive } = req.body;
      const data = dbNode.getIntegrations();
      
      const newEntry = {
        id: id || `INT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        name,
        type, // 'script' | 'popup'
        position, // 'head' | 'body_end' | 'center_modal'
        content,
        isActive: isActive !== undefined ? isActive : true,
        updatedAt: new Date().toISOString()
      };

      let updatedData;
      if (id) {
        updatedData = data.map((i: any) => i.id === id ? newEntry : i);
      } else {
        updatedData = [newEntry, ...data];
      }

      dbNode.saveIntegrations(updatedData);
      return res.status(200).json({ success: true, message: "Hub Synchronized.", data: newEntry });
    } catch (e) {
      return res.status(500).json({ message: "Deployment failure." });
    }
  },

  // 4. ADMIN ENDPOINT: Toggle Status
  toggleStatus: async (req: any, res: any) => {
    try {
      const { id } = req.params;
      const data = dbNode.getIntegrations();
      const updatedData = data.map((i: any) => 
        i.id === id ? { ...i, isActive: !i.isActive } : i
      );
      dbNode.saveIntegrations(updatedData);
      return res.status(200).json({ success: true, message: "Status Toggled." });
    } catch (e) {
      return res.status(500).json({ message: "Node switch failed." });
    }
  },

  // 5. ADMIN ENDPOINT: Delete
  deleteIntegration: async (req: any, res: any) => {
    try {
      const { id } = req.params;
      const data = dbNode.getIntegrations();
      const updatedData = data.filter((i: any) => i.id !== id);
      dbNode.saveIntegrations(updatedData);
      return res.status(200).json({ success: true, message: "Node removed." });
    } catch (e) {
      return res.status(500).json({ message: "Removal failed." });
    }
  }
};
