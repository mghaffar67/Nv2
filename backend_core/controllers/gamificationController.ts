
const getMockDB = () => {
  const data = localStorage.getItem('noor_v3_master_registry');
  return data ? JSON.parse(data) : [];
};

const saveToMockDB = (db: any[]) => {
  localStorage.setItem('noor_v3_master_registry', JSON.stringify(db));
};

export const gamificationController = {
  claimReward: async (req: any, res: any) => {
    try {
      const { userId, streakRewards } = req.body;
      let db = getMockDB();
      const userIndex = db.findIndex((u: any) => u.id === userId);

      if (userIndex === -1) return res.status(404).json({ success: false, message: "Registry node lost. Access denied." });
      const user = db[userIndex];

      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      
      // Verification: Prevent duplicate daily claims
      if (user.lastCheckIn) {
        const lastClaimStr = new Date(user.lastCheckIn).toISOString().split('T')[0];
        if (lastClaimStr === todayStr) {
          return res.status(400).json({ success: false, message: "Daily reward packet already synced for today." });
        }
      }

      // Logic: Calculate streak continuity
      let newStreak = (user.streak || 0) + 1;
      if (user.lastCheckIn) {
        const lastDate = new Date(user.lastCheckIn);
        const lastDayStart = new Date(lastDate.toISOString().split('T')[0]).getTime();
        const currentDayStart = new Date(todayStr).getTime();
        const oneDayInMs = 24 * 60 * 60 * 1000;
        const diffDays = (currentDayStart - lastDayStart) / oneDayInMs;

        if (diffDays > 1.8) {
          newStreak = 1; // Integrity Check: Streak broken due to inactivity
        } else if (newStreak > 7) {
          newStreak = 1; // Registry Check: 7-day cycle completed
        }
      } else {
        newStreak = 1;
      }

      const rewards = streakRewards || [5, 10, 15, 20, 25, 30, 100];
      const rewardAmount = Number(rewards[newStreak - 1]) || 5;

      // Atomic Ledger Entry
      user.balance = (Number(user.balance) || 0) + rewardAmount;
      user.streak = newStreak;
      user.lastCheckIn = now.toISOString();

      const newTrx = {
        id: `STRK-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        type: 'reward',
        amount: rewardAmount,
        status: 'approved',
        gateway: `Cycle: Day ${newStreak}`,
        date: todayStr,
        timestamp: now.toISOString(),
        note: `Consistent Partner Reward: Node ${newStreak}`
      };

      if (!user.transactions) user.transactions = [];
      user.transactions.unshift(newTrx);

      db[userIndex] = user;
      saveToMockDB(db);
      
      // Global Session Sync
      localStorage.setItem('noor_user', JSON.stringify({ ...user, password: undefined }));

      return res.status(200).json({
        success: true,
        rewardAmount,
        newStreak,
        updatedUser: { ...user, password: undefined }
      });
    } catch (err) {
      console.error("Streak Audit Failure:", err);
      return res.status(500).json({ success: false, message: "Platform Logic Exception. Try again later." });
    }
  }
};
