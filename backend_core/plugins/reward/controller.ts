import { dbNode } from '../../utils/db';

/**
 * Noor Official V3 - Reward Engine Controller
 * Manages achievement progress and admin manual overrides.
 */
export const rewardController = {
  getRewards: async (req: any, res: any) => {
    return res.status(200).json(dbNode.getRewards());
  },

  getStats: async (req: any, res: any) => {
    const rewards = dbNode.getRewards();
    const users = dbNode.getUsers();
    let totalClaims = 0;
    let totalBudgetSpent = 0;

    users.forEach((u: any) => {
      (u.claimedRewards || []).forEach((rid: string) => {
        const r = rewards.find((item: any) => item.id === rid);
        if (r) {
          totalClaims++;
          totalBudgetSpent += Number(r.rewardAmount);
        }
      });
    });

    return res.status(200).json({ totalActiveRewards: rewards.length, totalClaims, totalBudgetSpent });
  },

  saveReward: async (req: any, res: any) => {
    const db = dbNode.getRewards();
    const { id, ...data } = req.body;
    const entry = { id: id || `REW-${Date.now()}`, ...data };
    const updated = id ? db.map((r: any) => r.id === id ? entry : r) : [entry, ...db];
    dbNode.saveRewards(updated);
    return res.status(200).json({ success: true });
  },

  deleteReward: async (req: any, res: any) => {
    const filtered = dbNode.getRewards().filter((r: any) => r.id !== req.params.id);
    dbNode.saveRewards(filtered);
    return res.status(200).json({ success: true });
  },

  getUserAchievements: async (req: any, res: any) => {
    const user = dbNode.findUserById(req.user.id);
    const users = dbNode.getUsers();
    const allRewards = dbNode.getRewards();

    const achievements = allRewards.map((reward: any) => {
      let currentProgress = 0;
      
      // Dynamic Progress Calculation
      if (reward.type === 'referral_count') {
        currentProgress = users.filter((u: any) => u.referredBy === user.referralCode).length;
      } else if (reward.type === 'task_count') {
        currentProgress = (user.workSubmissions || []).filter((s: any) => s.status === 'approved').length;
      } else if (reward.type === 'streak_days') {
        currentProgress = user.streak || 0;
      } else if (reward.type === 'withdraw_total') {
        currentProgress = (user.transactions || [])
          .filter((t: any) => t.type === 'withdraw' && t.status === 'approved')
          .reduce((sum: number, t: any) => sum + Number(t.amount), 0);
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
  },

  claimReward: async (req: any, res: any) => {
    const { rewardId } = req.body;
    const user = dbNode.findUserById(req.user.id);
    const reward = dbNode.getRewards().find((r: any) => r.id === rewardId);

    if (!reward) return res.status(404).json({ message: "Inam node missing." });
    if ((user.claimedRewards || []).includes(rewardId)) {
      return res.status(400).json({ message: "Packet already claimed." });
    }

    const bonus = Number(reward.rewardAmount);
    user.balance = (Number(user.balance) || 0) + bonus;
    
    if (!user.claimedRewards) user.claimedRewards = [];
    user.claimedRewards.push(rewardId);

    const bonusLog = {
      id: `BON-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      type: 'reward',
      amount: bonus,
      status: 'approved',
      gateway: 'Bumper Reward',
      note: `Milestone Achieved: ${reward.title}`,
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString()
    };

    user.transactions.unshift(bonusLog);

    dbNode.updateUser(user.id, { 
      balance: user.balance, 
      claimedRewards: user.claimedRewards, 
      transactions: user.transactions 
    });
    
    return res.status(200).json({ 
      success: true, 
      message: `Rs. ${bonus} has been added to your vault.`,
      newBalance: user.balance
    });
  }
};