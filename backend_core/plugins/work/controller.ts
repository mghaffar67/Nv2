
import { dbNode } from '../../utils/db';

export const workPluginController = {
  // Admin Task List
  adminList: async (req: any, res: any) => {
    try {
      const tasks = await dbNode.getTasks();
      return res.status(200).json(tasks);
    } catch (err) {
      return res.status(500).json({ message: "Registry access failure." });
    }
  },

  // Admin Task Delete
  adminDelete: async (req: any, res: any) => {
    try {
      const { id } = req.params;
      await dbNode.deleteTask(id);
      return res.status(200).json({ success: true, message: "Node terminated." });
    } catch (err) {
      return res.status(500).json({ message: "Registry deletion failure." });
    }
  },

  getTasks: async (req: any, res: any) => {
    try {
      const user = await dbNode.findUserById(req.user.id);
      if (!user) return res.status(404).json({ message: "Identity node lost." });

      const allTasks = await dbNode.getTasks();
      const today = new Date().toISOString().split('T')[0];
      
      const PLAN_LIMITS: Record<string, number> = {
        'BASIC': 2,
        'STANDARD': 5,
        'GOLD ELITE': 10,
        'DIAMOND': 25,
        'None': 0
      };

      const userLimit = PLAN_LIMITS[user.currentPlan || 'None'] || 0;
      const submissionsToday = (user.workSubmissions || []).filter((s: any) => 
        s.timestamp.startsWith(today)
      ).length;

      const remainingSlots = Math.max(0, userLimit - submissionsToday);

      const tasksWithMeta = allTasks.map((task: any) => {
        const isCompletedToday = (user.workSubmissions || []).some((s: any) => 
          s.taskId === task.id && s.timestamp.startsWith(today)
        );

        const isLocked = !isCompletedToday && (submissionsToday >= userLimit);

        return {
          ...task,
          myStatus: isCompletedToday ? 'completed' : 'new',
          isLocked,
          lockReason: user.currentPlan === 'None' ? 'No Active Station' : 'Plan Limit Reached'
        };
      });

      return res.status(200).json({
        tasks: tasksWithMeta,
        streak: user.streak || 0,
        limitInfo: {
          total: userLimit,
          used: submissionsToday,
          remaining: remainingSlots
        }
      });
    } catch (err) {
      return res.status(500).json({ message: "Work Hub Logic Error." });
    }
  },

  completeTask: async (req: any, res: any) => {
    try {
      const { taskId, evidence, taskTitle, reward } = req.body;
      const user = await dbNode.findUserById(req.user.id);
      if (!user) return res.status(404).json({ message: "Identity missing." });

      const submissionPacket = {
        id: `SUB-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        userId: user.id,
        taskId,
        taskTitle,
        reward,
        userAnswer: evidence,
        status: 'pending',
        timestamp: new Date().toISOString()
      };

      if (!user.workSubmissions) user.workSubmissions = [];
      user.workSubmissions.unshift(submissionPacket);

      await dbNode.updateUser(user.id, { 
        workSubmissions: user.workSubmissions
      });
      
      return res.status(201).json({ success: true, message: "Packet synced." });
    } catch (err) {
      return res.status(500).json({ message: "Registry Error." });
    }
  }
};
