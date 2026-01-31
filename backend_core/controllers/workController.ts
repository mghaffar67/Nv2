import { dbNode } from '../utils/db';

/**
 * Noor Official V3 - Work Controller
 * Simple terminology for better user understanding.
 */

export const workController = {
  createTask: async (req: any, res: any) => {
    const taskData = req.body;
    // Fix: Added await to async db call
    const db = await dbNode.getTasks();
    const newTask = { 
      ...taskData, 
      id: `TASK-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      createdAt: new Date().toISOString()
    };
    // Fix: db is now the array from awaited promise
    db.unshift(newTask);
    await dbNode.saveTasks(db);
    return res.status(201).json({ message: 'Daily Task Added.', task: newTask });
  },

  getAvailableTasks: async (req: any, res: any) => {
    const { userId } = req.query;
    // Fix: Added await to async db calls
    const user = await dbNode.findUserById(userId as string);
    const db = await dbNode.getTasks();
    
    if (!user) return res.status(404).json({ message: "Account not found." });

    const today = new Date().toISOString().split('T')[0];
    // Fix: Proper access on awaited user object
    const completedIds = (user?.completedTasksToday || [])
      .filter((t: any) => t.date === today)
      .map((t: any) => t.taskId);

    // Fix: db is now the array from awaited promise
    const filtered = db.filter((t: any) => {
      if (!t.isActive) return false;
      if (completedIds.includes(t.id)) return false;
      
      // 1. Plan Gating (If task requires a plan and it's not 'ANY')
      // Fix: Proper access on awaited user object
      if (t.plan && t.plan !== 'ANY' && user?.currentPlan !== t.plan) {
         return false;
      }

      // 2. Targeting Gating
      if (t.assignmentType === 'specific') {
        if (!t.targetUsers || !t.targetUsers.includes(userId as string)) {
          return false;
        }
      }

      return true;
    });

    return res.status(200).json(filtered);
  },

  submitPacket: async (req: any, res: any) => {
    const { userId, taskId, evidence, username, taskTitle, reward } = req.body;
    // Fix: Added await to async db calls
    const user = await dbNode.findUserById(userId);
    if (!user) return res.status(404).json({ message: "Account node missing." });

    const allTasks = await dbNode.getTasks();
    const originalTask = allTasks.find((t: any) => t.id === taskId);

    const submissionPacket = {
      id: `SUB-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      userId,
      taskId,
      taskTitle,
      category: originalTask?.category || 'verification',
      reward,
      userAnswer: evidence,
      userName: username,
      status: 'pending',
      timestamp: new Date().toISOString()
    };

    // Fix: Proper access on awaited user object
    if (!user.workSubmissions) user.workSubmissions = [];
    user.workSubmissions.unshift(submissionPacket);

    if (!user.completedTasksToday) user.completedTasksToday = [];
    user.completedTasksToday.push({ taskId, date: new Date().toISOString().split('T')[0] });

    await dbNode.updateUser(userId, { 
      workSubmissions: user.workSubmissions,
      completedTasksToday: user.completedTasksToday 
    });

    return res.status(201).json({ success: true, message: "Work submitted successfully." });
  },

  getAllSubmissions: async (req: any, res: any) => {
    // Fix: Added await to async db call
    const users = await dbNode.getUsers();
    let submissions: any[] = [];
    users.forEach((u: any) => {
      if (u.workSubmissions) {
        submissions = [...submissions, ...u.workSubmissions.map((s: any) => ({ 
          ...s, 
          userName: u.name, 
          userId: u.id,
          userPhone: u.phone 
        }))];
      }
    });
    return res.status(200).json(submissions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
  },

  reviewSubmission: async (req: any, res: any) => {
    try {
      const { userId, submissionId, status, reward } = req.body;
      // Fix: Added await to async db calls
      const user = await dbNode.findUserById(userId);
      if (!user) return res.status(404).json({ message: "Account not found." });

      // Fix: Proper access on awaited user object
      const subIdx = (user.workSubmissions || []).findIndex((s: any) => s.id === submissionId);
      if (subIdx === -1) return res.status(404).json({ message: "Submission history not found." });

      if (user.workSubmissions[subIdx].status !== 'pending') {
        return res.status(400).json({ message: "Already processed." });
      }

      user.workSubmissions[subIdx].status = status;

      if (status === 'approved') {
        user.balance = (Number(user.balance) || 0) + Number(reward);
        
        const rewardTrx = {
          id: `INC-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          type: 'reward',
          amount: Number(reward),
          status: 'approved',
          gateway: 'Daily Income',
          note: `Approved Work: ${user.workSubmissions[subIdx].taskTitle}`,
          date: new Date().toISOString().split('T')[0],
          timestamp: new Date().toISOString()
        };

        if (!user.transactions) user.transactions = [];
        user.transactions.unshift(rewardTrx);
      }

      // Fix: Added await to updateUser call
      await dbNode.updateUser(userId, { 
        workSubmissions: user.workSubmissions, 
        balance: user.balance,
        transactions: user.transactions || []
      });

      return res.status(200).json({ success: true, message: "Review complete." });
    } catch (err) {
      return res.status(500).json({ message: "Server error during review." });
    }
  }
};