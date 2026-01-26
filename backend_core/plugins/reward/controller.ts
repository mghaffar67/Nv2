
import { dbNode } from '../../utils/db';

/**
 * Noor V3 - Reward Hub Controller
 * Enhanced with Stats Aggregation and Unified Management
 */
export const rewardController = {
  // 1. ADMIN: Get rewards with claim counts
  getRewards: async (req: any, res: any) => {
    const rewards = dbNode.getRewards() || [];
    const users = dbNode.getUsers();

    // Map claim counts to each reward
    const enriched = rewards.map((r: any) => {
      const claimCount = users.filter((u: any) => (u.claimedRewards || []).includes(r.id)).length;
      return { ...r, timesClaimed: claimCount };
    });

    return res.status(200).json(enriched);
  },

  // 2. ADMIN: Unified Stats Retrieval
  getStats: async (req: any, res: any) => {
    try {
      const rewards = dbNode.getRewards() || [];
      const users = dbNode.getUsers();
      
      let totalClaims = 0;
      let totalBudgetSpent = 0;

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
    const db = dbNode.getRewards() || [];
    
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
    const exists = db.findIndex((r: any) => r.id === entry.id);
    if (exists !== -1) {
      updated = [...db];
      updated[exists] = entry;
    } else {
      updated = [entry, ...db];
    }

    dbNode.saveRewards(updated);
    return res.status(200).json({ success: true, message: "Reward Node Synchronized." });
  },

  deleteReward: async (req: any, res: any) => {
    const { id } = req.params;
    const db = dbNode.getRewards() || [];
    const filtered = db.filter((r: any) => r.id !== id);
    dbNode.saveRewards(filtered);
    return res.status(200).json({ success: true, message: "Reward Terminated." });
  },

  // 3. USER: Get My Progress & Claim (Stay existing logic)
  getUserAchievements: async (req: any, res: any) => {
    try {
      const user = dbNode.findUserById(req.user.id);
      const allRewards = (dbNode.getRewards() || []).filter((r: any) => r.isActive);
      const users = dbNode.getUsers();

      const achievements = allRewards.map((reward: any) => {
        let currentProgress = 0;
        if (reward.type === 'referral_count') {
          currentProgress = users.filter((u: any) => u.referredBy === user.referralCode).length;
        } else if (reward.type === 'task_count') {
          currentProgress = (user.workSubmissions || []).filter((s: any) => s.status === 'approved').length;
        } else if (reward.type === 'plan_buy') {
          currentProgress = (user.currentPlan && user.currentPlan !== 'None') ? 1 : 0;
        }

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
      const user = dbNode.findUserById(req.user.id);
      const allRewards = dbNode.getRewards() || [];
      const reward = allRewards.find((r: any) => r.id === rewardId);

      if (!reward || (user.claimedRewards || []).includes(rewardId)) {
        return res.status(400).json({ message: "Invalid or already claimed reward node." });
      }

      const bonus = Number(reward.rewardAmount);
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

      dbNode.updateUser(user.id, { balance: user.balance, claimedRewards: user.claimedRewards, transactions: user.transactions });
      return res.status(200).json({ success: true, message: "Bonus credited.", newBalance: user.balance });
    } catch (e) {
      return res.status(500).json({ message: "Claim sync failure." });
    }
  }
};
