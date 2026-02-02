import { dbNode } from '../utils/db';

/**
 * Noor Official V3 - Gamification Controller
 * Refined for dynamic reward pool management.
 */
export const gamificationController = {
  claimReward: async (req: any, res: any) => {
    try {
      const { userId } = req.body;
      const user = dbNode.findUserById(userId);

      if (!user) {
        return res.status(404).json({ success: false, message: "User account not found." });
      }

      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      
      // 1. DUPLICATE CLAIM CHECK
      if (user.lastCheckIn) {
        const lastClaimDate = new Date(user.lastCheckIn).toISOString().split('T')[0];
        if (lastClaimDate === todayStr) {
          return res.status(400).json({ 
            success: false, 
            message: "Aap aaj ka reward pehle hi le chuke hain. Kal dobara koshish karein." 
          });
        }
      }

      // 2. STREAK LOGIC (New User Friendly & Forgiving Window)
      let newStreak = 1;
      
      if (user.lastCheckIn) {
        const lastDate = new Date(user.lastCheckIn);
        const diffMs = now.getTime() - lastDate.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);

        // 48-hour window to keep the streak alive (handles midnight edge cases)
        if (diffHours <= 48) {
          newStreak = (user.streak || 0) + 1;
          if (newStreak > 7) newStreak = 1; // Cycle resets after 7 days
        } else {
          newStreak = 1; // Streak broken
        }
      } else {
        newStreak = 1; // First claim ever
      }

      // 3. DYNAMIC REWARD CALCULATION (From Config)
      const config = dbNode.getConfig();
      const rewardsPool = config.streakRewards || [5, 10, 15, 20, 25, 30, 100];
      
      // Ensure we don't index out of bounds
      const rewardAmount = Number(rewardsPool[newStreak - 1]) || 5;

      // 4. LEDGER UPDATE
      const updatedBalance = (Number(user.balance) || 0) + rewardAmount;
      
      const newTrx = {
        id: `STRK-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        type: 'reward',
        amount: rewardAmount,
        status: 'approved',
        gateway: `Hazari Inam`,
        note: `Day ${newStreak} Consistency Reward`,
        date: todayStr,
        timestamp: now.toISOString()
      };

      const transactions = user.transactions || [];
      transactions.unshift(newTrx);

      dbNode.updateUser(userId, { 
        balance: updatedBalance,
        streak: newStreak,
        lastCheckIn: now.toISOString(),
        transactions
      });
      
      return res.status(200).json({
        success: true,
        message: `Mubarak! Day ${newStreak} ka Inam Rs. ${rewardAmount} aapke wallet mein add kar diya gaya hai.`,
        rewardAmount,
        newStreak,
        updatedBalance
      });

    } catch (err) {
      console.error("Gamification Protocol Error:", err);
      return res.status(500).json({ success: false, message: "System logic error. Try again." });
    }
  }
};