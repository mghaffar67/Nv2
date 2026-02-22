import { dbNode } from '../../utils/db';

/**
 * Noor Official V3 - Integration Protocol
 * Handles External Connections and Dynamic Scripts.
 */
export const integrationController = {
  // PUBLIC: Fetch active integration scripts
  getPublicScripts: async (req: any, res: any) => {
    try {
      const data = await dbNode.getIntegrations();
      if (!data || !Array.isArray(data)) return res.status(200).json([]);

      // Filter only active script types
      const activeOnly = data.filter((i: any) => {
        const isActive = (i.isActive !== false && i.isactive !== false && i.is_active !== false);
        return i.type === 'script' && isActive;
      });
      
      // Normalize position for scripts
      const normalized = activeOnly.map((i: any) => ({
        ...i,
        position: i.position || 'head',
        content: i.content || ''
      }));

      return res.status(200).json(normalized);
    } catch (e) {
      console.error("Integration Fetch Error:", e);
      // Safe fallback for Frontend loaders
      return res.status(200).json([]);
    }
  },

  getAllIntegrations: async (req: any, res: any) => {
    try {
      const data = await dbNode.getIntegrations();
      return res.status(200).json(data || []);
    } catch (e) {
      return res.status(500).json({ message: "Registry Hub access denied." });
    }
  },

  saveIntegration: async (req: any, res: any) => {
    try {
      const { id, name, type, position, content, isActive, ...rest } = req.body;
      const data = await dbNode.getIntegrations();
      
      const newEntry = {
        id: id || `INT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        name, 
        type: type || 'script', 
        position, 
        content,
        ...rest,
        isActive: isActive !== undefined ? isActive : true,
        updatedAt: new Date().toISOString()
      };

      let updatedData;
      const existsIdx = (data || []).findIndex((i: any) => i.id === newEntry.id);
      
      if (existsIdx !== -1) {
        updatedData = [...data];
        updatedData[existsIdx] = newEntry;
      } else {
        updatedData = [newEntry, ...(data || [])];
      }

      await dbNode.saveIntegrations(updatedData);
      return res.status(200).json({ success: true, message: "Hub Synchronized.", data: newEntry });
    } catch (e) {
      return res.status(500).json({ message: "Deployment failure." });
    }
  },

  toggleStatus: async (req: any, res: any) => {
    try {
      const { id } = req.params;
      const data = await dbNode.getIntegrations();
      const updatedData = (data || []).map((i: any) => 
        i.id === id ? { ...i, isActive: !i.isActive } : i
      );
      await dbNode.saveIntegrations(updatedData);
      return res.status(200).json({ success: true, message: "Status Toggled." });
    } catch (e) {
      return res.status(500).json({ message: "Node switch failed." });
    }
  },

  deleteIntegration: async (req: any, res: any) => {
    try {
      const { id } = req.params;
      const data = await dbNode.getIntegrations();
      const updatedData = (data || []).filter((i: any) => i.id !== id);
      await dbNode.saveIntegrations(updatedData);
      return res.status(200).json({ success: true, message: "Node removed." });
    } catch (e) {
      return res.status(500).json({ message: "Removal failed." });
    }
  }
};