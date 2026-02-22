import { dbNode } from '../utils/db';

/**
 * Noor Official V3 - Advanced Work & Yield Hub
 * Specialized in associate assignments and immutable history tracking.
 */

export const workController = {
  createTask: async (req: any, res: any) => {
    const taskData = req.body;
    const db = await dbNode.getTasks();
    const newTask = { 
      ...taskData, 
      id: `TASK-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      createdAt: new Date().toISOString()
    };
    db.unshift(newTask);
    await dbNode.saveTasks(db);
    return res.status(201).json({ message: 'Assignment Node Initialized.', task: newTask });
  },

  getAvailableTasks: async (req: any, res: any) => {
    const { userId } = req.query;
    const user = await dbNode.findUserById(userId as string);
    const db = await dbNode.getTasks();
    
    if (!user) return res.status(404).json({ message: "Identity node missing." });

    const today = new Date().toISOString().split('T')[0];
    const completedIds = (user?.completedTasksToday || [])
      .filter((t: any) => t.date === today)
      .map((t: any) => t.taskId);

    const filtered = db.filter((t: any) => {
      if (!t.isActive) return false;
      if (completedIds.includes(t.id)) return false;
      if (t.plan && t.plan !== 'ANY' && user?.currentPlan !== t.plan) return false;
      
      if (t.assignmentType === 'specific') {
        if (!t.targetUsers || !t.targetUsers.includes(userId as string)) return false;
      }
      return true;
    });

    return res.status(200).json(filtered);
  },

  submitPacket: async (req: any, res: any) => {
    const { userId, taskId, evidence, username, taskTitle, reward } = req.body;
    const user = await dbNode.findUserById(userId);
    if (!user) return res.status(404).json({ message: "Identity node missing." });

    const submissionPacket = {
      id: `SUB-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      userId,
      taskId,
      taskTitle,
      reward,
      userAnswer: evidence,
      userName: username,
      status: 'pending',
      timestamp: new Date().toISOString()
    };

    // 1. Log to active submissions for admin review
    if (!user.workSubmissions) user.workSubmissions = [];
    user.workSubmissions.unshift(submissionPacket);

    // 2. Permanent Work History Registry (Immutable Record for Auditing)
    if (!user.workHistory) user.workHistory = [];
    user.workHistory.unshift({
      taskId,
      taskTitle,
      submissionTime: submissionPacket.timestamp,
      status: 'pending',
      rewardAmount: reward,
      nodeId: submissionPacket.id
    });

    // Update Daily Completion Limiters
    if (!user.completedTasksToday) user.completedTasksToday = [];
    user.completedTasksToday.push({ taskId, date: new Date().toISOString().split('T')[0] });

    await dbNode.updateUser(userId, { 
      workSubmissions: user.workSubmissions,
      workHistory: user.workHistory,
      completedTasksToday: user.completedTasksToday 
    });

    return res.status(201).json({ success: true, message: "Work Packet submitted to registry." });
  },

  reviewSubmission: async (req: any, res: any) => {
    try {
      const { userId, submissionId, status, reward } = req.body;
      const user = await dbNode.findUserById(userId);
      if (!user) return res.status(404).json({ message: "Identity node missing." });

      const subIdx = (user.workSubmissions || []).findIndex((s: any) => s.id === submissionId);
      if (subIdx === -1) return res.status(404).json({ message: "Submission packet not found." });

      if (user.workSubmissions[subIdx].status !== 'pending') {
        return res.status(400).json({ message: "Node already processed." });
      }

      user.workSubmissions[subIdx].status = status;

      // Synchronize update to the permanent workHistory registry
      if (user.workHistory) {
        const historyIdx = user.workHistory.findIndex((h: any) => h.nodeId === submissionId);
        if (historyIdx !== -1) {
          user.workHistory[historyIdx].status = status;
          user.workHistory[historyIdx].reviewedAt = new Date().toISOString();
        }
      }

      if (status === 'approved') {
        user.balance = (Number(user.balance) || 0) + Number(reward);
        
        const rewardTrx = {
          id: `INC-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          type: 'reward',
          amount: Number(reward),
          status: 'approved',
          gateway: 'Ecosystem Yield',
          note: `Authorized Packet: ${user.workSubmissions[subIdx].taskTitle}`,
          date: new Date().toISOString().split('T')[0],
          timestamp: new Date().toISOString()
        };

        if (!user.transactions) user.transactions = [];
        user.transactions.unshift(rewardTrx);
      }

      await dbNode.updateUser(userId, { 
        workSubmissions: user.workSubmissions, 
        workHistory: user.workHistory,
        balance: user.balance,
        transactions: user.transactions || []
      });

      return res.status(200).json({ success: true, message: "Registry audit finalized." });
    } catch (err) {
      return res.status(500).json({ message: "Hub synchronization failure." });
    }
  }
};