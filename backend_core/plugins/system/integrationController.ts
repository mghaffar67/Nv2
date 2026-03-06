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
        // Handle both camelCase and snake_case
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
      
      let result;
      // Check if it's a UUID (existing) or new
      // Simple check: if it has an ID and it looks like a UUID, try update.
      // If it's "INT-..." it might be a legacy ID or client-generated temp ID.
      // Since we moved to UUIDs in DB, we should rely on DB IDs.
      // If the ID exists in DB, update. Else create.
      
      // However, for simplicity with the new table:
      // If ID is provided and valid UUID, update.
      // If not, create.
      
      // But wait, the previous logic handled "INT-" IDs.
      // Let's assume if ID is present, we try to update. If it fails (not found), we create?
      // Or better: explicit create vs update.
      
      // The frontend likely sends an ID if it's editing.
      // If it's a new item, it might send a temp ID or null.
      
      if (id && id.length > 10 && !id.startsWith('INT-')) {
         // Try update
         result = await dbNode.updateIntegration(id, { name, type, position, content, isActive, ...rest });
      }
      
      if (!result) {
        // Create new
        result = await dbNode.createIntegration({ name, type, position, content, isActive, ...rest });
      }

      return res.status(200).json({ success: true, message: "Hub Synchronized.", data: result });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Deployment failure." });
    }
  },

  toggleStatus: async (req: any, res: any) => {
    try {
      const { id } = req.params;
      // Fetch current status to toggle? Or just receive new status?
      // The route is PATCH /:id/toggle.
      // We need to fetch first.
      
      // Since we don't have getIntegrationById exposed, we can just use update with a negated value if we knew it.
      // But we don't.
      // Let's fetch all (cached/fast) or just query DB.
      // We can add getIntegrationById to dbNode but for now let's just fetch all and find.
      // Actually, let's just assume the frontend sends the new status or we fetch.
      
      // Better: dbNode.updateIntegration accepts partial updates.
      // But we need to know the current status to toggle.
      // Let's fetch all for now.
      const all = await dbNode.getIntegrations();
      const target = all.find((i: any) => i.id === id);
      
      if (!target) return res.status(404).json({ message: "Integration not found." });
      
      const newStatus = !target.is_active; // snake_case from DB
      await dbNode.updateIntegration(id, { isActive: newStatus });
      
      return res.status(200).json({ success: true, message: "Status Toggled." });
    } catch (e) {
      return res.status(500).json({ message: "Node switch failed." });
    }
  },

  deleteIntegration: async (req: any, res: any) => {
    try {
      const { id } = req.params;
      await dbNode.deleteIntegration(id);
      return res.status(200).json({ success: true, message: "Node removed." });
    } catch (e) {
      return res.status(500).json({ message: "Removal failed." });
    }
  }
};