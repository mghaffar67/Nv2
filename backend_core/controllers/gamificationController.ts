import { dbNode } from '../utils/db';

export const gamificationController = {
  claimReward: async (req: any, res: any) => {
    try {
      const { userId } = req.body;
      const config = await dbNode.getConfig();
      const streakRewards = config.streakRewards || [5, 10, 15, 20, 25, 30, 100];
      
      const user = await dbNode.findUserById(userId);
      if (!user) return res.status(404).json({ success: false, message: "Registry node lost." });

      const now = new Date();
      const todayStr = now.toDateString();
      
      // Verification: Prevent duplicate daily claims
      if (user.lastCheckIn) {
        const lastClaimStr = new Date(user.lastCheckIn).toDateString();
        if (lastClaimStr === todayStr) {
          return res.status(400).json({ success: false, message: "Aap aaj ka reward pehle hi le chuke hain." });
        }
      }

      // Logic: Calculate streak continuity
      let newStreak = (user.streak || 0) + 1;
      if (user.lastCheckIn) {
        const lastDate = new Date(user.lastCheckIn);
        const diffTime = now.getTime() - lastDate.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        if (diffDays > 2) { 
          newStreak = 1; 
        } else if (newStreak > 7) {
          newStreak = 1; 
        }
      } else {
        newStreak = 1;
      }

      const rewardAmount = Number(streakRewards[newStreak - 1]) || 5;
      const updatedBalance = (Number(user.balance) || 0) + rewardAmount;
      
      // Track Reward History (Last 5 Entries)
      const claimEntry = {
        amount: rewardAmount,
        day: newStreak,
        timestamp: now.toISOString(),
        id: `RWD-${Math.random().toString(36).substr(2, 4).toUpperCase()}`
      };
      
      const currentHistory = user.rewardHistory || [];
      const updatedHistory = [claimEntry, ...currentHistory].slice(0, 5);

      // Log Transaction in Ledger
      const newTrx = {
        id: `STRK-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        type: 'reward',
        amount: rewardAmount,
        status: 'approved',
        gateway: `Daily Day ${newStreak}`,
        date: now.toISOString().split('T')[0],
        timestamp: now.toISOString(),
        note: `Daily Login Bonus: Day ${newStreak}`
      };

      const transactions = user.transactions || [];
      transactions.unshift(newTrx);

      const updatedUser = await dbNode.updateUser(userId, {
        balance: updatedBalance,
        streak: newStreak,
        lastCheckIn: now.toISOString(),
        rewardHistory: updatedHistory,
        transactions
      });

      if (updatedUser) {
        // No need for localStorage or window event in the backend
      }

      return res.status(200).json({
        success: true,
        rewardAmount,
        newStreak,
        history: updatedHistory
      });
    } catch (err) {
      console.error("Streak Audit Failure:", err);
      return res.status(500).json({ success: false, message: "System Logic Error." });
    }
  }
};