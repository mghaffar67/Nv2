
import { dbNode } from '../../utils/db';
import { workController } from '../../controllers/workController';

export const workPluginController = {
  getTasks: async (req: any, res: any) => {
    const userId = req.user.id;
    // Map internal query for compatibility
    req.query.userId = userId;
    return workController.getAvailableTasks(req, res);
  },

  completeTask: async (req: any, res: any) => {
    const userId = req.user.id;
    req.body.userId = userId;
    // Route to centralized submission logic
    return workController.submitPacket(req, res);
  }
};
