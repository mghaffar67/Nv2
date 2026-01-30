import { dbNode } from '../../utils/db';

/**
 * Noor Official V3 - Advanced Work & Streak Protocol
 */
export const workPluginController = {
  getTasks: async (req: any, res: any) => {
    try {
      const user = dbNode.findUserById(req.user.id);
      if (!user) return res.status(404).json({ message: "Identity node lost." });

      const allTasks = dbNode.getTasks();
      const today = new Date().toISOString().split('T')[0];
      
      let currentStreak = user.streak || 0;
      
      if (user.lastWorkDate) {
        const lastDate = new Date(user.lastWorkDate);
        const todayDate = new Date(today);
        const diffTime = todayDate.getTime() - lastDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 1) {
          currentStreak = 0; 
        }
      }

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
        streak: currentStreak,
        limitInfo: {
          total: userLimit,
          used: submissionsToday,
          remaining: remainingSlots
        },
        nextMilestone: `Day ${((currentStreak) % 7) + 1}: Bonus Ready`
      });
    } catch (err) {
      return res.status(500).json({ message: "Work Hub Logic Error." });
    }
  },

  completeTask: async (req: any, res: any) => {
    try {
      const { taskId, evidence, taskTitle, reward } = req.body;
      const user = dbNode.findUserById(req.user.id);
      if (!user) return res.status(404).json({ message: "Identity missing." });

      const today = new Date().toISOString().split('T')[0];
      
      let newStreak = user.streak || 0;
      if (user.lastWorkDate !== today) {
        if (!user.lastWorkDate) {
          newStreak = 1;
        } else {
          const lastDate = new Date(user.lastWorkDate);
          const todayDate = new Date(today);
          const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
          newStreak = diffDays === 1 ? newStreak + 1 : 1;
        }
      }

      // Aggressive data limitation for browser preview stability
      const truncatedEvidence = evidence && evidence.length > 2000 
        ? evidence.substring(0, 1000) + "...[TRUNCATED_FOR_STABILITY]" 
        : evidence;

      const submissionPacket = {
        id: `SUB-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        userId: user.id,
        taskId,
        taskTitle,
        reward,
        userAnswer: truncatedEvidence, 
        status: 'pending',
        timestamp: new Date().toISOString(),
        adminNote: ''
      };

      const submissions = user.workSubmissions || [];
      submissions.unshift(submissionPacket);

      // Save to registry with try-catch
      try {
        dbNode.updateUser(user.id, { 
          workSubmissions: submissions,
          streak: newStreak,
          lastWorkDate: today
        });
      } catch (err: any) {
        console.error("Internal Registry Write Error:", err);
        return res.status(500).json({ 
          message: "Registry Full. Please delete some task history or contact admin." 
        });
      }
      
      return res.status(201).json({ 
        success: true, 
        message: "Task proof submitted successfully.",
        streak: newStreak
      });
    } catch (err: any) {
      return res.status(500).json({ message: "Submission Registry Error." });
    }
  }
};