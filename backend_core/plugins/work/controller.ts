
/**
 * Noor Official V3 - Work Controller
 * Logic: User Plan -> Allowed Tasks -> Reward Calculation
 */

const getDB = () => JSON.parse(localStorage.getItem('noor_mock_db') || '[]');
const saveDB = (db: any[]) => localStorage.setItem('noor_mock_db', JSON.stringify(db));

const TASK_QUOTAS: Record<string, { count: number, rewardPerTask: number }> = {
  'BASIC': { count: 5, rewardPerTask: 10 },
  'STANDARD': { count: 10, rewardPerTask: 10 },
  'GOLD ELITE': { count: 15, rewardPerTask: 10 },
  'DIAMOND': { count: 20, rewardPerTask: 32.5 }
};

export const workPluginController = {
  getTasks: async (req: any, res: any) => {
    const user = req.user;
    const plan = user.currentPlan || 'BASIC';
    const quota = TASK_QUOTAS[plan.toUpperCase()] || TASK_QUOTAS['BASIC'];
    
    // In mock, we generate tasks dynamically based on quota
    const today = new Date().toISOString().split('T')[0];
    const completedIds = (user.completedTasksToday || [])
      .filter((t: any) => t.date === today)
      .map((t: any) => t.taskId);

    const tasks = [];
    for (let i = 1; i <= quota.count; i++) {
      const taskId = `TASK-${plan.toUpperCase()}-${i}`;
      if (!completedIds.includes(taskId)) {
        tasks.push({
          id: taskId,
          title: `${plan} Earning Node #${i}`,
          reward: quota.rewardPerTask,
          timer: 15,
          category: 'Digital Ad Audit'
        });
      }
    }

    return res.status(200).json(tasks);
  },

  completeTask: async (req: any, res: any) => {
    const { taskId } = req.body;
    const user = req.user;
    let db = getDB();
    const uIdx = db.findIndex((u: any) => u.id === user.id);
    const currentUser = db[uIdx];

    const plan = currentUser.currentPlan || 'BASIC';
    const quota = TASK_QUOTAS[plan.toUpperCase()] || TASK_QUOTAS['BASIC'];
    const today = new Date().toISOString().split('T')[0];

    // Ensure not already completed
    if (!currentUser.completedTasksToday) currentUser.completedTasksToday = [];
    const alreadyDone = currentUser.completedTasksToday.find((t: any) => t.taskId === taskId && t.date === today);
    if (alreadyDone) return res.status(400).json({ message: "Task already synced for today." });

    // Reward Logic
    const reward = quota.rewardPerTask;
    currentUser.balance = (Number(currentUser.balance) || 0) + reward;
    
    // Log Completion
    currentUser.completedTasksToday.push({ taskId, date: today });

    // Log Transaction
    const earningTrx = {
      id: `WRK-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      userId: user.id,
      type: 'reward',
      amount: reward,
      status: 'approved',
      gateway: 'Daily Work Yield',
      note: `Completed Task: ${taskId}`,
      date: today,
      timestamp: new Date().toISOString()
    };

    if (!currentUser.transactions) currentUser.transactions = [];
    currentUser.transactions.unshift(earningTrx);

    db[uIdx] = currentUser;
    saveDB(db);
    localStorage.setItem('noor_user', JSON.stringify({ ...currentUser, password: undefined }));

    return res.status(200).json({
      success: true,
      message: `Success! Rs. ${reward} Added to Node.`,
      newBalance: currentUser.balance
    });
  }
};
