import { dbNode } from '../../utils/db';

/**
 * Noor V3 - Reward Hub Controller
 * Enhanced with Stats Aggregation and Unified Management
 */
export const rewardController = {
  // 1. ADMIN: Get rewards with claim counts
  getRewards: async (req: any, res: any) => {
    try {
      const rewards = await dbNode.getRewards() || [];
      const allClaims = await dbNode.getAllUserRewards();

      // Map claim counts to each reward
      const enriched = rewards.map((r: any) => {
        const claimCount = allClaims.filter((c: any) => c.reward_id === r.id).length;
        return { ...r, timesClaimed: claimCount };
      });

      return res.status(200).json(enriched);
    } catch (e) {
      return res.status(500).json({ message: "Reward Fetch Error." });
    }
  },

  // 2. ADMIN: Unified Stats Retrieval
  getStats: async (req: any, res: any) => {
    try {
      const rewards = await dbNode.getRewards() || [];
      const allClaims = await dbNode.getAllUserRewards();
      
      let totalClaims = allClaims.length;
      let totalBudgetSpent = 0;

      allClaims.forEach((c: any) => {
        const reward = rewards.find((r: any) => r.id === c.reward_id);
        if (reward) {
          totalBudgetSpent += Number(reward.rewardAmount || 0);
        }
      });

      // Count unique users who claimed at least one reward
      const uniqueClaimants = new Set(allClaims.map((c: any) => c.user_id)).size;

      return res.status(200).json({
        totalActiveRewards: rewards.filter((r: any) => r.isActive).length,
        totalClaims,
        totalBudgetSpent,
        activeParticipants: uniqueClaimants
      });
    } catch (e) {
      return res.status(500).json({ message: "Stats Node failure." });
    }
  },

  saveReward: async (req: any, res: any) => {
    try {
      const { id, title, description, type, targetValue, rewardAmount, isActive } = req.body;
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
      const exists = db.findIndex((r: any) => r.id === entry.id);
      if (exists !== -1) {
        updated = [...db];
        updated[exists] = entry;
      } else {
        updated = [entry, ...db];
      }

      await dbNode.saveRewards(updated);
      return res.status(200).json({ success: true, message: "Reward Node Synchronized." });
    } catch (e) {
      return res.status(500).json({ message: "Reward Save Error." });
    }
  },

  deleteReward: async (req: any, res: any) => {
    try {
      const { id } = req.params;
      const db = await dbNode.getRewards() || [];
      const filtered = db.filter((r: any) => r.id !== id);
      await dbNode.saveRewards(filtered);
      return res.status(200).json({ success: true, message: "Reward Terminated." });
    } catch (e) {
      return res.status(500).json({ message: "Reward Delete Error." });
    }
  },

  // 3. USER: Get My Progress & Claim
  getUserAchievements: async (req: any, res: any) => {
    try {
      const userId = req.user.id;
      const user = await dbNode.findUserById(userId);
      if (!user) return res.status(404).json({ message: "User not found." });

      const allRewards = await dbNode.getRewards() || [];
      const userClaims = await dbNode.getUserRewards(userId);
      const claimedIds = userClaims.map((c: any) => c.reward_id);

      // Fetch necessary data for progress calculation
      const tasks = await dbNode.getTaskSubmissions(userId);
      const team = await dbNode.getReferralTeam(user.referral_code || user.referralCode); // referralCode might be camelCase in object but snake_case in DB

      const achievements = allRewards.filter((r: any) => r.isActive).map((reward: any) => {
        let currentProgress = 0;
        
        if (reward.type === 'referral_count') {
          // Count direct referrals (Level 1)
          currentProgress = (team.t1 || []).length;
        } else if (reward.type === 'task_count') {
          currentProgress = tasks.filter((s: any) => s.status === 'approved').length;
        } else if (reward.type === 'plan_buy') {
          currentProgress = (user.current_plan && user.current_plan !== 'None') ? 1 : 0;
        }

        const isClaimed = claimedIds.includes(reward.id);
        return { 
          ...reward, 
          currentProgress, 
          isClaimed, 
          canClaim: currentProgress >= Number(reward.targetValue) && !isClaimed 
        };
      });

      return res.status(200).json(achievements);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Achievement sync failed." });
    }
  },

  claimReward: async (req: any, res: any) => {
    try {
      const { rewardId } = req.body;
      const userId = req.user.id;
      
      const user = await dbNode.findUserById(userId);
      if (!user) return res.status(404).json({ message: "User not found." });

      const allRewards = await dbNode.getRewards() || [];
      const reward = allRewards.find((r: any) => r.id === rewardId);
      
      const userClaims = await dbNode.getUserRewards(userId);
      const isClaimed = userClaims.some((c: any) => c.reward_id === rewardId);

      if (!reward || isClaimed) {
        return res.status(400).json({ message: "Invalid or already claimed reward node." });
      }

      // Verify eligibility again just in case
      const tasks = await dbNode.getTaskSubmissions(userId);
      const team = await dbNode.getReferralTeam(user.referral_code || user.referralCode);
      
      let currentProgress = 0;
      if (reward.type === 'referral_count') {
        currentProgress = (team.t1 || []).length;
      } else if (reward.type === 'task_count') {
        currentProgress = tasks.filter((s: any) => s.status === 'approved').length;
      } else if (reward.type === 'plan_buy') {
        currentProgress = (user.current_plan && user.current_plan !== 'None') ? 1 : 0;
      }

      if (currentProgress < Number(reward.targetValue)) {
         return res.status(400).json({ message: "Target not reached yet." });
      }

      const bonus = Number(reward.rewardAmount);
      
      // 1. Add balance
      const newBalance = Number(user.balance) + bonus;
      await dbNode.updateUser(userId, { balance: newBalance });

      // 2. Record claim
      await dbNode.claimUserReward(userId, rewardId);

      // 3. Record transaction
      await dbNode.createTransaction({
        userId,
        type: 'reward',
        amount: bonus,
        status: 'approved',
        gateway: 'Achievement Bonus',
        adminNote: `Target Reached: ${reward.title}`,
        trxId: `BON-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
      });

      return res.status(200).json({ success: true, message: "Bonus credited.", newBalance });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "Claim sync failure." });
    }
  }
};