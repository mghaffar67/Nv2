import { dbNode } from '../../utils/db';

/**
 * Noor Official V3 - Work Protocol Controller
 * Integrated with Global Config for dynamic work hours and strict filtering.
 */
export const workPluginController = {
  getTasks: async (req: any, res: any) => {
    try {
      const user = dbNode.findUserById(req.user.id);
      if (!user) return res.status(404).json({ message: "Identity node lost." });

      const config = dbNode.getConfig();
      const serverDate = new Date();
      const todayStr = serverDate.toISOString().split('T')[0];
      const currentHour = serverDate.getHours();

      // 1. DYNAMIC WORK HOURS LOGIC (Strictly from Config)
      const { start, end } = config.workHours || { start: 9, end: 22 };
      const isLockedByTime = currentHour < start || currentHour >= end;
      
      if (isLockedByTime) {
        return res.status(200).json({ 
          tasks: [], 
          isLocked: true, 
          lockReason: 'hours', 
          message: `Station Closed. Operates between ${start}:00 AM and ${end}:00 PM PKT.`, 
          streak: user.streak || 0 
        });
      }

      // 2. REGISTRY DATA & LIMITS
      const allTasks = dbNode.getTasks();
      const plansRegistry = JSON.parse(localStorage.getItem('noor_plans_registry') || '[]');
      const userPlan = plansRegistry.find((p: any) => p.name === user.currentPlan);
      const userLimit = userPlan ? userPlan.dailyLimit : 0;
      
      const submissionsToday = (user.workSubmissions || []).filter((s: any) => 
        s.timestamp.startsWith(todayStr)
      ).length;

      // 3. ENHANCED FILTERING PROTOCOL
      const filteredTasks = allTasks.filter((task: any) => {
        // Expiry Check
        if (task.expiryDate && new Date(task.expiryDate) < serverDate) return false;
        
        // Membership Plan Gate
        if (task.plan && task.plan !== 'ANY' && task.plan !== user.currentPlan) return false;

        // Specific Targeting
        if (task.assignmentType === 'specific' && !task.targetUsers?.includes(user.id)) return false;

        return true;
      });

      const tasksWithMeta = filteredTasks.map((task: any) => {
        const isCompletedToday = (user.workSubmissions || []).some((s: any) => 
          s.taskId === task.id && s.timestamp.startsWith(todayStr)
        );
        const isReachedLimit = (submissionsToday >= userLimit) && !isCompletedToday;

        return {
          ...task,
          myStatus: isCompletedToday ? 'completed' : 'new',
          isLocked: isReachedLimit,
          lockReason: !userPlan ? 'Activate Station' : 'Daily Capacity Full',
          isBounceTask: task.reward >= 500 // Mark high-yield tasks
        };
      });

      return res.status(200).json({
        tasks: tasksWithMeta,
        isLocked: false,
        streak: user.streak || 0,
        limitInfo: { total: userLimit, used: submissionsToday, remaining: Math.max(0, userLimit - submissionsToday) }
      });
    } catch (err) {
      return res.status(500).json({ message: "Work Engine Failure." });
    }
  },

  completeTask: async (req: any, res: any) => {
    try {
      const { taskId, evidence, taskTitle } = req.body;
      const user = dbNode.findUserById(req.user.id);
      if (!user) return res.status(404).json({ message: "Identity missing." });

      const allTasks = dbNode.getTasks();
      const taskRef = allTasks.find((t: any) => t.id === taskId);
      const reward = taskRef?.reward || 0;

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

      dbNode.updateUser(user.id, { 
        workSubmissions: user.workSubmissions,
        lastWorkDate: new Date().toISOString().split('T')[0]
      });
      
      return res.status(201).json({ success: true, message: "Ledger updated." });
    } catch (err) {
      return res.status(500).json({ message: "Submission Sync Error." });
    }
  }
};