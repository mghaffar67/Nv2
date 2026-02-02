
import { dbNode } from '../../utils/db';

/**
 * Noor V3 - Reward Hub Controller
 * Enhanced with Stats Aggregation and Unified Management
 */
export const rewardController = {
  // 1. ADMIN: Get rewards with claim counts
  getRewards: async (req: any, res: any) => {
    // Add missing await to fix Promise map error
    const rewards = await dbNode.getRewards() || [];
    // Add missing await to fix Promise filter error
    const users = await dbNode.getUsers();

    // Map claim counts to each reward
    // Fix map on Promise error
    const enriched = rewards.map((r: any) => {
      // Fix filter on Promise error
      const claimCount = users.filter((u: any) => (u.claimedRewards || []).includes(r.id)).length;
      return { ...r, timesClaimed: claimCount };
    });

    return res.status(200).json(enriched);
  },

  // 2. ADMIN: Unified Stats Retrieval
  getStats: async (req: any, res: any) => {
    try {
      // Add missing await to fix Promise forEach error
      const rewards = await dbNode.getRewards() || [];
      // Add missing await to fix Promise filter error
      const users = await dbNode.getUsers();
      
      let totalClaims = 0;
      let totalBudgetSpent = 0;

      // Fix forEach on Promise error
      rewards.forEach((r: any) => {
        // Fix filter on Promise error
        const count = users.filter((u: any) => (u.claimedRewards || []).includes(r.id)).length;
        totalClaims += count;
        totalBudgetSpent += (count * Number(r.rewardAmount));
      });

      return res.status(200).json({
        // Fix filter on Promise error
        totalActiveRewards: rewards.filter((r: any) => r.isActive).length,
        totalClaims,
        totalBudgetSpent,
        // Fix filter on Promise error
        activeParticipants: users.filter((u: any) => (u.claimedRewards || []).length > 0).length
      });
    } catch (e) {
      return res.status(500).json({ message: "Stats Node failure." });
    }
  },

  saveReward: async (req: any, res: any) => {
    const { id, title, description, type, targetValue, rewardAmount, isActive } = req.body;
    // Add missing await to fix Promise findIndex error
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
    // Fix findIndex on Promise error
    const exists = db.findIndex((r: any) => r.id === entry.id);
    if (exists !== -1) {
      // Fix iterator error on Promise
      updated = [...db];
      updated[exists] = entry;
    } else {
      // Fix iterator error on Promise
      updated = [entry, ...db];
    }

    await dbNode.saveRewards(updated);
    return res.status(200).json({ success: true, message: "Reward Node Synchronized." });
  },

  deleteReward: async (req: any, res: any) => {
    const { id } = req.params;
    // Add missing await to fix Promise filter error
    const db = await dbNode.getRewards() || [];
    // Fix filter on Promise error
    const filtered = db.filter((r: any) => r.id !== id);
    await dbNode.saveRewards(filtered);
    return res.status(200).json({ success: true, message: "Reward Terminated." });
  },

  // 3. USER: Get My Progress & Claim (Stay existing logic)
  getUserAchievements: async (req: any, res: any) => {
    try {
      // Add missing await to fix Promise property access error
      const user = await dbNode.findUserById(req.user.id);
      // Add missing await to fix Promise filter error
      const allRewards = (await dbNode.getRewards() || []).filter((r: any) => r.isActive);
      // Add missing await to fix Promise filter error
      const users = await dbNode.getUsers();

      // Fix map on Promise error
      const achievements = allRewards.map((reward: any) => {
        let currentProgress = 0;
        if (reward.type === 'referral_count') {
          // Fix filter on Promise and property access on Promise
          currentProgress = users.filter((u: any) => u.referredBy === user.referralCode).length;
        } else if (reward.type === 'task_count') {
          // Fix property access on Promise
          currentProgress = (user.workSubmissions || []).filter((s: any) => s.status === 'approved').length;
        } else if (reward.type === 'plan_buy') {
          // Fix property access on Promise
          currentProgress = (user.currentPlan && user.currentPlan !== 'None') ? 1 : 0;
        }

        // Fix property access on Promise
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
      // Add missing await to fix Promise find error
      const user = await dbNode.findUserById(req.user.id);
      // Add missing await to fix Promise find error
      const allRewards = await dbNode.getRewards() || [];
      // Fix find on Promise error
      const reward = allRewards.find((r: any) => r.id === rewardId);

      // Fix property access on Promise
      if (!reward || (user.claimedRewards || []).includes(rewardId)) {
        return res.status(400).json({ message: "Invalid or already claimed reward node." });
      }

      const bonus = Number(reward.rewardAmount);
      // Fix property access on Promise
      user.balance = (Number(user.balance) || 0) + bonus;
      // Fix property access on Promise
      if (!user.claimedRewards) user.claimedRewards = [];
      // Fix property access on Promise
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

      // Fix property access on Promise
      if (!user.transactions) user.transactions = [];
      // Fix property access on Promise
      user.transactions.unshift(bonusTrx);

      // Fix property access on Promise
      await dbNode.updateUser(user.id, { balance: user.balance, claimedRewards: user.claimedRewards, transactions: user.transactions });
      // Fix property access on Promise
      return res.status(200).json({ success: true, message: "Bonus credited.", newBalance: user.balance });
    } catch (e) {
      return res.status(500).json({ message: "Claim sync failure." });
    }
  }
};
