
import { dbNode } from '../../utils/db';

/**
 * Noor V3 - Reward Hub Controller
 * Logic for calculating achievements and processing bonuses.
 */
export const rewardController = {
  // 1. ADMIN: Create/Get Rewards
  getRewards: async (req: any, res: any) => {
    const rewards = dbNode.getRewards() || [];
    return res.status(200).json(rewards);
  },

  saveReward: async (req: any, res: any) => {
    const { id, title, description, type, targetValue, rewardAmount, isActive } = req.body;
    const db = dbNode.getRewards() || [];
    
    const newReward = {
      id: id || `REW-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      title,
      description,
      type, // 'referral_count', 'task_count', 'plan_buy'
      targetValue: Number(targetValue),
      rewardAmount: Number(rewardAmount),
      isActive: isActive !== undefined ? isActive : true,
      createdAt: new Date().toISOString()
    };

    let updated;
    if (id) {
      updated = db.map((r: any) => r.id === id ? newReward : r);
    } else {
      updated = [newReward, ...db];
    }

    dbNode.saveRewards(updated);
    return res.status(200).json({ success: true, reward: newReward });
  },

  deleteReward: async (req: any, res: any) => {
    const { id } = req.params;
    const db = dbNode.getRewards() || [];
    const filtered = db.filter((r: any) => r.id !== id);
    dbNode.saveRewards(filtered);
    return res.status(200).json({ success: true });
  },

  // 2. USER: Get My Progress & Claim
  getUserAchievements: async (req: any, res: any) => {
    try {
      const user = dbNode.findUserById(req.user.id);
      const allRewards = (dbNode.getRewards() || []).filter((r: any) => r.isActive);
      const users = dbNode.getUsers();

      const achievements = allRewards.map((reward: any) => {
        let currentProgress = 0;

        // Calculate Real-time Progress based on type
        if (reward.type === 'referral_count') {
          currentProgress = users.filter((u: any) => u.referredBy === user.referralCode).length;
        } else if (reward.type === 'task_count') {
          currentProgress = (user.workSubmissions || []).filter((s: any) => s.status === 'approved').length;
        } else if (reward.type === 'plan_buy') {
          currentProgress = (user.currentPlan && user.currentPlan !== 'None') ? 1 : 0;
        }

        const isClaimed = (user.claimedRewards || []).includes(reward.id);

        return {
          ...reward,
          currentProgress,
          isClaimed,
          canClaim: currentProgress >= reward.targetValue && !isClaimed
        };
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

      if (!reward) return res.status(404).json({ message: "Reward not found." });
      
      // Verification Logic
      if ((user.claimedRewards || []).includes(rewardId)) {
        return res.status(400).json({ message: "Identity already synced for this bonus." });
      }

      // Re-calculate progress for final audit
      let progress = 0;
      const users = dbNode.getUsers();
      if (reward.type === 'referral_count') {
        progress = users.filter((u: any) => u.referredBy === user.referralCode).length;
      } else if (reward.type === 'task_count') {
        progress = (user.workSubmissions || []).filter((s: any) => s.status === 'approved').length;
      } else if (reward.type === 'plan_buy') {
        progress = (user.currentPlan && user.currentPlan !== 'None') ? 1 : 0;
      }

      if (progress < reward.targetValue) {
        return res.status(400).json({ message: "Protocol Warning: Target not met." });
      }

      // Atomic Balance Update
      const bonus = Number(reward.rewardAmount);
      user.balance = (Number(user.balance) || 0) + bonus;
      
      if (!user.claimedRewards) user.claimedRewards = [];
      user.claimedRewards.push(rewardId);

      // Log Transaction
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

      dbNode.updateUser(user.id, { 
        balance: user.balance, 
        claimedRewards: user.claimedRewards,
        transactions: user.transactions 
      });

      return res.status(200).json({ success: true, message: "Bonus credited to wallet.", newBalance: user.balance });
    } catch (e) {
      return res.status(500).json({ message: "Claim sync failure." });
    }
  }
};
