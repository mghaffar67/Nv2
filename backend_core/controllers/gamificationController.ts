
const getMockDB = () => {
  const data = localStorage.getItem('noor_mock_db');
  return data ? JSON.parse(data) : [];
};

const saveToMockDB = (db: any[]) => {
  localStorage.setItem('noor_mock_db', JSON.stringify(db));
};

export const gamificationController = {
  claimReward: async (req: any, res: any) => {
    const { userId, streakRewards } = req.body;
    let db = getMockDB();
    const userIndex = db.findIndex((u: any) => u.id === userId);

    if (userIndex === -1) return res.status(404).json({ message: "User identity lost." });
    const user = db[userIndex];

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    
    // Check if already claimed today
    if (user.lastCheckIn) {
      const lastClaimStr = new Date(user.lastCheckIn).toISOString().split('T')[0];
      if (lastClaimStr === todayStr) {
        return res.status(400).json({ message: "Daily reward already synced for today." });
      }
    }

    let newStreak = (user.streak || 0) + 1;
    if (user.lastCheckIn) {
      const lastDate = new Date(user.lastCheckIn);
      const lastDayStart = new Date(lastDate.toISOString().split('T')[0]).getTime();
      const currentDayStart = new Date(todayStr).getTime();
      const oneDayInMs = 24 * 60 * 60 * 1000;
      const diffDays = (currentDayStart - lastDayStart) / oneDayInMs;

      if (diffDays > 1.5) {
        newStreak = 1; // Missed more than a day, reset streak
      } else if (newStreak > 7) {
        newStreak = 1; // Cycle complete
      }
    } else {
      newStreak = 1;
    }

    const rewardAmount = streakRewards[newStreak - 1] || 5;

    // Atomic Updates
    user.balance = (Number(user.balance) || 0) + Number(rewardAmount);
    user.streak = newStreak;
    user.lastCheckIn = now.toISOString();

    const newTrx = {
      id: `STRK-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      type: 'reward',
      amount: rewardAmount,
      status: 'approved',
      gateway: `Day ${newStreak} Bonus`,
      date: todayStr,
      timestamp: now.toISOString()
    };

    if (!user.transactions) user.transactions = [];
    user.transactions.unshift(newTrx);

    db[userIndex] = user;
    saveToMockDB(db);
    
    // CRITICAL: Sync active session to avoid stale state crash
    localStorage.setItem('noor_user', JSON.stringify({ ...user, password: undefined }));

    return res.status(200).json({
      success: true,
      rewardAmount,
      newStreak,
      updatedUser: { ...user, password: undefined }
    });
  }
};
