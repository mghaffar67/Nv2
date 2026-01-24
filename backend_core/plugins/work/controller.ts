
import { dbNode } from '../../utils/db';

export const workPluginController = {
  getTasks: async (req: any, res: any) => {
    const user = dbNode.findUserById(req.user.id);
    if (!user) return res.status(404).json({ message: "Identity Node missing." });

    const allTasks = dbNode.getTasks();
    const today = new Date().toISOString().split('T')[0];
    const completedIds = (user.completedTasksToday || [])
      .filter((t: any) => t.date === today)
      .map((t: any) => t.taskId);

    const filtered = allTasks.filter((task: any) => {
      if (!task.isActive) return false;
      if (task.plan && task.plan !== 'ANY' && user.currentPlan !== task.plan) return false;
      if (completedIds.includes(task.id)) return false;
      return true;
    });

    return res.status(200).json(filtered);
  },

  completeTask: async (req: any, res: any) => {
    const { taskId } = req.body;
    const user = dbNode.findUserById(req.user.id);
    if (!user) return res.status(404).json({ message: "Identity lost." });

    const task = dbNode.getTasks().find((t: any) => t.id === taskId);
    if (!task) return res.status(404).json({ message: "Node missing." });

    const today = new Date().toISOString().split('T')[0];
    const completed = user.completedTasksToday || [];
    if (completed.find((c: any) => c.taskId === taskId && c.date === today)) {
      return res.status(400).json({ message: "Yield already collected." });
    }

    const reward = Number(task.reward);
    const newBalance = (Number(user.balance) || 0) + reward;
    const newTrx = {
      id: `REW-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      type: 'reward', amount: reward, status: 'approved',
      gateway: 'Task Yield', note: task.title,
      date: today, timestamp: new Date().toISOString()
    };

    const trx = user.transactions || [];
    trx.unshift(newTrx);
    completed.push({ taskId, date: today });

    dbNode.updateUser(user.id, { 
      balance: newBalance, 
      completedTasksToday: completed, 
      transactions: trx 
    });

    return res.status(200).json({ success: true, newBalance, historyEntry: newTrx });
  }
};
