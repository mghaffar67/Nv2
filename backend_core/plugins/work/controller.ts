import { dbNode } from '../../utils/db';

/**
 * Noor Official V3 - Work Protocol Controller
 * Enhanced with Expiry Logic and Bounce Task Nodes
 */
export const workPluginController = {
  getTasks: async (req: any, res: any) => {
    try {
      const user = dbNode.findUserById(req.user.id);
      if (!user) return res.status(404).json({ message: "Identity node lost." });

      const config = dbNode.getConfig();
      const serverDate = new Date();
      const todayStr = serverDate.toISOString().split('T')[0];
      const day = serverDate.getDay(); 
      const currentHour = serverDate.getHours();

      // 1. WEEKEND & HOUR LOCK LOGIC
      const isWeekend = day === 0 || day === 6;
      if (isWeekend) {
        return res.status(200).json({ tasks: [], isLocked: true, lockReason: 'weekend', message: "Weekend Off! Stations are offline.", streak: user.streak || 0 });
      }

      const { start, end } = config.workHours || { start: 9, end: 22 };
      if (currentHour < start || currentHour >= end) {
        return res.status(200).json({ tasks: [], isLocked: true, lockReason: 'hours', message: `Station Closed until ${start}:00 AM.`, streak: user.streak || 0 });
      }

      // 2. FETCH REGISTRY DATA
      const allTasks = dbNode.getTasks();
      const plansRegistry = JSON.parse(localStorage.getItem('noor_plans_registry') || '[]');
      const userPlan = plansRegistry.find((p: any) => p.name === user.currentPlan);
      const userLimit = userPlan ? userPlan.dailyLimit : 0;
      
      const submissionsToday = (user.workSubmissions || []).filter((s: any) => 
        s.timestamp.startsWith(todayStr)
      ).length;

      // 3. ENHANCED FILTERING LOGIC
      const filteredTasks = allTasks.filter((task: any) => {
        // Expiry Date Check
        if (task.expiryDate && new Date(task.expiryDate) < serverDate) return false;
        
        // Plan Requirements
        if (task.plan && task.plan !== 'ANY' && task.plan !== user.currentPlan) return false;

        // Specific User Targeting
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
          lockReason: !userPlan ? 'No Active Station' : 'Daily Limit Reached',
          isBounceTask: task.reward > 500 // Logic for Bounce Tasks
        };
      });

      return res.status(200).json({
        tasks: tasksWithMeta,
        isLocked: false,
        streak: user.streak || 0,
        limitInfo: { total: userLimit, used: submissionsToday, remaining: Math.max(0, userLimit - submissionsToday) }
      });
    } catch (err) {
      return res.status(500).json({ message: "Work Hub Logic Error." });
    }
  },

  completeTask: async (req: any, res: any) => {
    try {
      const { taskId, evidence, taskTitle } = req.body;
      const user = dbNode.findUserById(req.user.id);
      if (!user) return res.status(404).json({ message: "Identity missing." });

      const allTasks = dbNode.getTasks();
      const taskRef = allTasks.find((t: any) => t.id === taskId);
      const reward = taskRef?.reward || 240;

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
      
      return res.status(201).json({ success: true, message: "Work logged for audit." });
    } catch (err) {
      return res.status(500).json({ message: "Submission Registry Error." });
    }
  }
};