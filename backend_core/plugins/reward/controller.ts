import { dbNode } from '../../utils/db';

/**
 * Noor V3 - Reward Hub Controller
 * Enhanced with Stats Aggregation and Unified Management
 */
export const rewardController = {
  // 1. ADMIN: Get rewards with claim counts
  getRewards: async (req: any, res: any) => {
    // Fix: Added await to async db call
    const rewards = await dbNode.getRewards() || [];
    // Fix: Added await to async db call
    const users = await dbNode.getUsers();

    // Map claim counts to each reward
    // Fix: rewards and users are now data from awaited promises
    const enriched = rewards.map((r: any) => {
      const claimCount = users.filter((u: any) => (u.claimedRewards || []).includes(r.id)).length;
      return { ...r, timesClaimed: claimCount };
    });

    return res.status(200).json(enriched);
  },

  // 2. ADMIN: Unified Stats Retrieval
  getStats: async (req: any, res: any) => {
    try {
      // Fix: Added await to async db calls
      const rewards = await dbNode.getRewards() || [];
      const users = await dbNode.getUsers();
      
      let totalClaims = 0;
      let totalBudgetSpent = 0;

      // Fix: rewards and users are now data from awaited promises
      rewards.forEach((r: any) => {
        const count = users.filter((u: any) => (u.claimedRewards || []).includes(r.id)).length;
        totalClaims += count;
        totalBudgetSpent += (count * Number(r.rewardAmount));
      });

      return res.status(200).json({
        totalActiveRewards: rewards.filter((r: any) => r.isActive).length,
        totalClaims,
        totalBudgetSpent,
        activeParticipants: users.filter((u: any) => (u.claimedRewards || []).length > 0).length
      });
    } catch (e) {
      return res.status(500).json({ message: "Stats Node failure." });
    }
  },

  saveReward: async (req: any, res: any) => {
    const { id, title, description, type, targetValue, rewardAmount, isActive } = req.body;
    // Fix: Added await to async db call
    const db = await dbNode.getRewards() || [];
    
    const entry = {
      id: id || `REW-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      title,
      description,
      type,
      targetValue: Number(targetValue),
      rewardAmount: Number(rewardAmount),
      isActive: isActive !== undefined ? isActive : true,
      updatedAt: new Date().toISOString()
    };

    let updated;
    // Fix: db is now the array from awaited promise
    const exists = db.findIndex((r: any) => r.id === entry.id);
    if (exists !== -1) {
      updated = [...db];
      updated[exists] = entry;
    } else {
      updated = [entry, ...db];
    }

    // Fix: Added await to async db call
    await dbNode.saveRewards(updated);
    return res.status(200).json({ success: true, message: "Reward Node Synchronized." });
  },

  deleteReward: async (req: any, res: any) => {
    const { id } = req.params;
    // Fix: Added await to async db call
    const db = await dbNode.getRewards() || [];
    // Fix: db is now the array from awaited promise
    const filtered = db.filter((r: any) => r.id !== id);
    // Fix: Added await to async db call
    await dbNode.saveRewards(filtered);
    return res.status(200).json({ success: true, message: "Reward Terminated." });
  },

  // 3. USER: Get My Progress & Claim (Stay existing logic)
  getUserAchievements: async (req: any, res: any) => {
    try {
      // Fix: Added await to async db calls
      const user = await dbNode.findUserById(req.user.id);
      const allRewards = await dbNode.getRewards() || [];
      const users = await dbNode.getUsers();

      // Fix: allRewards and users are now data from awaited promises
      const achievements = allRewards.filter((r: any) => r.isActive).map((reward: any) => {
        let currentProgress = 0;
        if (reward.type === 'referral_count') {
          // Fix: Properly access referralCode on awaited user object
          currentProgress = users.filter((u: any) => u.referredBy === user.referralCode).length;
        } else if (reward.type === 'task_count') {
          // Fix: Properly access workSubmissions on awaited user object
          currentProgress = (user.workSubmissions || []).filter((s: any) => s.status === 'approved').length;
        } else if (reward.type === 'plan_buy') {
          // Fix: Properly access currentPlan on awaited user object
          currentProgress = (user.currentPlan && user.currentPlan !== 'None') ? 1 : 0;
        }

        // Fix: Properly access claimedRewards on awaited user object
        const isClaimed = (user.claimedRewards || []).includes(reward.id);
        return { ...reward, currentProgress, isClaimed, canClaim: currentProgress >= reward.targetValue && !isClaimed };
      });

      return res.status(200).json(achievements);
    } catch (e) {
      return res.status(500).json({ message: "Achievement sync failed." });
    }
  },

  claimReward: async (req: any, res: any) => {
    try {
      const { rewardId } = req.body;
      // Fix: Added await to async db calls
      const user = await dbNode.findUserById(req.user.id);
      const allRewards = await dbNode.getRewards() || [];
      const reward = allRewards.find((r: any) => r.id === rewardId);

      // Fix: Proper access on awaited user object
      if (!reward || (user.claimedRewards || []).includes(rewardId)) {
        return res.status(400).json({ message: "Invalid or already claimed reward node." });
      }

      const bonus = Number(reward.rewardAmount);
      // Fix: Property access on awaited object
      user.balance = (Number(user.balance) || 0) + bonus;
      if (!user.claimedRewards) user.claimedRewards = [];
      user.claimedRewards.push(rewardId);

      const bonusTrx = {
        id: `BON-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        type: 'reward',
        amount: bonus,
        status: 'approved',
        gateway: 'Achievement Bonus',
        note: `Target Reached: ${reward.title}`,
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString()
      };

      if (!user.transactions) user.transactions = [];
      user.transactions.unshift(bonusTrx);

      // Fix: Added await and proper property access
      await dbNode.updateUser(user.id, { balance: user.balance, claimedRewards: user.claimedRewards, transactions: user.transactions });
      return res.status(200).json({ success: true, message: "Bonus credited.", newBalance: user.balance });
    } catch (e) {
      return res.status(500).json({ message: "Claim sync failure." });
    }
  }
};