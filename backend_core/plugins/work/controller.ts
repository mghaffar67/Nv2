
import { dbNode } from '../../utils/db';

/**
 * Noor Official V3 - Work Protocol
 * Logic: Plan -> Specific User Hub -> Daily Quota Sync
 */

const getTasksDB = () => {
  if (typeof window === 'undefined') {
    // In Node.js environment, simulate persistent task storage
    return [
      { id: 'NODE-101', title: 'Official Channel Subscription', reward: 25, plan: 'BASIC', instruction: 'Subscribe and screenshot.', isActive: true },
      { id: 'NODE-102', title: 'Premium Portal Audit', reward: 150, plan: 'GOLD ELITE', instruction: 'Verify ad nodes.', isActive: true }
    ];
  }
  const data = localStorage.getItem('noor_tasks_db');
  return data ? JSON.parse(data) : [];
};

export const workPluginController = {
  getTasks: async (req: any, res: any) => {
    if (!req.user) return res.status(401).json({ message: "Identity required." });
    const user = dbNode.findUserById(req.user.id);
    if (!user) return res.status(404).json({ message: "Identity Node missing." });

    const allTasks = getTasksDB();
    const today = new Date().toISOString().split('T')[0];
    const completedIds = (user.completedTasksToday || [])
      .filter((t: any) => t.date === today)
      .map((t: any) => t.taskId);

    const availableTasks = allTasks.filter((task: any) => {
      if (!task.isActive) return false;
      if (task.plan && task.plan !== 'ANY' && user.currentPlan !== task.plan) return false;
      if (task.assignmentType === 'specific' && !task.targetUsers?.includes(user.id)) return false;
      if (completedIds.includes(task.id)) return false;
      return true;
    });

    return res.status(200).json(availableTasks);
  },

  completeTask: async (req: any, res: any) => {
    const { taskId } = req.body;
    if (!req.user) return res.status(401).json({ message: "Identity required." });
    const user = dbNode.findUserById(req.user.id);
    if (!user) return res.status(404).json({ message: "Identity Node missing." });

    const allTasks = getTasksDB();
    const task = allTasks.find((t: any) => t.id === taskId);
    if (!task) return res.status(404).json({ message: "Task not found." });

    const today = new Date().toISOString().split('T')[0];
    if (!user.completedTasksToday) user.completedTasksToday = [];
    
    const alreadyDone = user.completedTasksToday.find((t: any) => t.taskId === taskId && t.date === today);
    if (alreadyDone) return res.status(400).json({ message: "Yield already distributed for this node." });

    const reward = Number(task.reward);
    const newBalance = (Number(user.balance) || 0) + reward;
    const completedTasksToday = [...user.completedTasksToday, { taskId, date: today }];

    const earningTrx = {
      id: `REW-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      type: 'reward',
      amount: reward,
      status: 'approved',
      gateway: 'Task Yield',
      note: `Sync: ${task.title}`,
      date: today,
      timestamp: new Date().toISOString()
    };

    const transactions = user.transactions || [];
    transactions.unshift(earningTrx);

    dbNode.updateUser(user.id, { 
      balance: newBalance, 
      completedTasksToday,
      transactions 
    });

    return res.status(200).json({
      success: true,
      message: `System Sync: Rs. ${reward} cached.`,
      newBalance
    });
  }
};
