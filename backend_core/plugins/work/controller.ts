
import { dbNode } from '../../utils/db';

export const workPluginController = {
  getTasks: async (req: any, res: any) => {
    try {
      const user = dbNode.findUserById(req.user.id);
      if (!user) return res.status(404).json({ message: "Identity node lost." });

      const allTasks = dbNode.getTasks();
      const today = new Date().toISOString().split('T')[0];

      // Logic: Filter by Plan and Merge status from user's history
      const tasksWithStatus = allTasks
        .filter((t: any) => {
          if (t.plan && t.plan !== 'ANY' && user.currentPlan !== t.plan) return false;
          return t.isActive !== false;
        })
        .map((task: any) => {
          // Check if user has a submission for this task today
          const submission = (user.workSubmissions || []).find((s: any) => 
            s.taskId === task.id && s.timestamp.startsWith(today)
          );

          return {
            ...task,
            myStatus: submission ? submission.status : 'new',
            adminNote: submission?.adminNote || ""
          };
        });

      return res.status(200).json(tasksWithStatus);
    } catch (err) {
      return res.status(500).json({ message: "Task Node Sync Failure." });
    }
  },

  completeTask: async (req: any, res: any) => {
    try {
      const { taskId, evidence, username, taskTitle, reward } = req.body;
      const user = dbNode.findUserById(req.user.id);
      if (!user) return res.status(404).json({ message: "Identity missing." });

      const today = new Date().toISOString().split('T')[0];
      
      // Verification: Prevent double submission
      const existing = (user.workSubmissions || []).find((s: any) => 
        s.taskId === taskId && s.timestamp.startsWith(today)
      );
      if (existing) return res.status(400).json({ message: "Work already filed for this node today." });

      const submissionPacket = {
        id: `SUB-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        userId: user.id,
        taskId,
        taskTitle,
        reward,
        userAnswer: evidence, // This is the proof screenshot base64
        status: 'pending',
        timestamp: new Date().toISOString()
      };

      if (!user.workSubmissions) user.workSubmissions = [];
      user.workSubmissions.unshift(submissionPacket);

      dbNode.updateUser(user.id, { workSubmissions: user.workSubmissions });
      
      return res.status(201).json({ 
        success: true, 
        message: "Packet Synchronized. Pending admin audit." 
      });
    } catch (err) {
      return res.status(500).json({ message: "Submission Protocol Failure." });
    }
  }
};
