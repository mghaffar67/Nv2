import { dbNode } from '../../utils/db';

/**
 * Noor Official V3 - Advanced Work & Streak Protocol
 */
export const workPluginController = {
  getTasks: async (req: any, res: any) => {
    try {
      const user = await dbNode.findUserById(req.user.id);
      if (!user) return res.status(404).json({ message: "Account not found." });

      // Static tasks definition (could be moved to DB later if needed)
      const allTasks = await dbNode.getTasks(); 
      const today = new Date().toISOString().split('T')[0];
      
      let currentStreak = user.streak_count || user.streak || 0;
      
      // Check if streak is broken
      if (user.last_task_date || user.lastWorkDate) {
        const lastDate = new Date(user.last_task_date || user.lastWorkDate);
        const todayDate = new Date(today);
        const diffTime = todayDate.getTime() - lastDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 1) {
          currentStreak = 0; 
          // Optionally update DB here, but maybe wait for next action
        }
      }

      const PLAN_LIMITS: Record<string, number> = {
        'BASIC': 2,
        'STANDARD': 5,
        'GOLD ELITE': 10,
        'DIAMOND': 25,
        'None': 0
      };

      const userPlan = user.current_plan || user.currentPlan || 'None';
      const userLimit = PLAN_LIMITS[userPlan] || 0;
      
      // Fetch submissions from DB
      const submissions = await dbNode.getTaskSubmissions(user.id, today);
      const submissionsToday = submissions.length;

      const remainingSlots = Math.max(0, userLimit - submissionsToday);

      const tasksWithMeta = allTasks.map((task: any) => {
        const isCompletedToday = submissions.some((s: any) => s.task_number === task.id || s.taskId === task.id);

        const isLocked = !isCompletedToday && (submissionsToday >= userLimit);

        return {
          ...task,
          myStatus: isCompletedToday ? 'completed' : 'new',
          isLocked,
          lockReason: userPlan === 'None' ? 'No Active Station' : 'Plan Limit Reached'
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
      console.error(err);
      return res.status(500).json({ message: "Work Hub Logic Error." });
    }
  },

  completeTask: async (req: any, res: any) => {
    try {
      const { taskId, evidence, taskTitle, reward } = req.body;
      const user = await dbNode.findUserById(req.user.id);
      
      if (!user) return res.status(404).json({ message: "Account verification failed. Logout karke dubara login karein." });
      if (!taskId) return res.status(400).json({ message: "Task ID missing. Dubara try karein." });
      // evidence is now pdfUrl or image url
      if (!evidence) return res.status(400).json({ message: "Sabot (Evidence) upload karna zaroori hai." });

      const today = new Date().toISOString().split('T')[0];
      
      let newStreak = user.streak_count || user.streak || 0;
      const lastWorkDate = user.last_task_date || user.lastWorkDate;

      if (lastWorkDate !== today) {
        if (!lastWorkDate) {
          newStreak = 1;
        } else {
          const lastDate = new Date(lastWorkDate);
          const todayDate = new Date(today);
          const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
          newStreak = diffDays === 1 ? newStreak + 1 : 1;
        }
      }

      // Create submission in DB
      await dbNode.createTaskSubmission({
        userId: user.id,
        taskNumber: taskId, // Assuming taskId maps to task_number or ID
        pdfUrl: evidence,
        status: 'pending',
        reward: reward,
        adminNote: ''
      });

      // Update user stats
      await dbNode.updateUser(user.id, { 
        streak: newStreak,
        lastWorkDate: today
      });
      
      return res.status(201).json({ 
        success: true, 
        message: "Aapka kam audit ke liye submit ho chuka hai.",
        streak: newStreak
      });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ message: "Submission protocol failure. Technical error." });
    }
  }
};