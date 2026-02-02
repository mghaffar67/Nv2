import { dbNode } from '../../utils/db';

/**
 * Noor V3 - Mission Intelligence Controller
 */
export const missionController = {
  getAdminMissions: async (req: any, res: any) => {
    try {
      const data = JSON.parse(localStorage.getItem('noor_missions_registry') || '[]');
      return res.status(200).json(data);
    } catch (e) {
      return res.status(500).json({ message: "Mission Hub Offline." });
    }
  },

  saveMission: async (req: any, res: any) => {
    try {
      const { id, title, description, type, targetValue, rewardAmount, isActive, iconType } = req.body;
      const data = JSON.parse(localStorage.getItem('noor_missions_registry') || '[]');
      
      const entry = {
        id: id || `MSN-${Date.now()}`,
        title,
        description,
        type,
        targetValue: Number(targetValue),
        rewardAmount: Number(rewardAmount),
        isActive: isActive !== undefined ? isActive : true,
        iconType: iconType || 'Zap'
      };

      let updated;
      if (id) {
        updated = data.map((m: any) => m.id === id ? entry : m);
      } else {
        updated = [...data, entry];
      }

      localStorage.setItem('noor_missions_registry', JSON.stringify(updated));
      return res.status(200).json({ success: true, data: entry });
    } catch (e) {
      return res.status(500).json({ message: "Logic deployment failure." });
    }
  },

  getUserMissions: async (req: any, res: any) => {
    try {
      const user = dbNode.findUserById(req.user.id);
      const allUsers = dbNode.getUsers();
      const missions = JSON.parse(localStorage.getItem('noor_missions_registry') || '[]');
      const activeMissions = missions.filter((m: any) => m.isActive);

      const calculatedMissions = activeMissions.map((m: any) => {
        let currentProgress = 0;

        // 1. DYNAMIC AUDIT LOGIC
        if (m.type === 'TASK_COUNT') {
          currentProgress = (user.workSubmissions || []).filter((s: any) => s.status === 'approved').length;
        } else if (m.type === 'REFERRAL_COUNT') {
          currentProgress = allUsers.filter((u: any) => u.referredBy === user.referralCode).length;
        } else if (m.type === 'STREAK_DAYS') {
          currentProgress = user.streak || 0;
        } else if (m.type === 'TOTAL_WITHDRAW') {
          currentProgress = (user.transactions || [])
            .filter((t: any) => t.type === 'withdraw' && t.status === 'approved')
            .reduce((sum: number, t: any) => sum + Number(t.amount), 0);
        }

        const isClaimed = (user.claimedMissions || []).includes(m.id);
        const canClaim = currentProgress >= m.targetValue && !isClaimed;

        return {
          ...m,
          currentProgress,
          isClaimed,
          canClaim,
          percentage: Math.min(100, Math.floor((currentProgress / m.targetValue) * 100))
        };
      });

      return res.status(200).json(calculatedMissions);
    } catch (e) {
      return res.status(500).json({ message: "Progress audit failed." });
    }
  },

  claimMissionReward: async (req: any, res: any) => {
    try {
      const { missionId } = req.body;
      const user = dbNode.findUserById(req.user.id);
      const missions = JSON.parse(localStorage.getItem('noor_missions_registry') || '[]');
      const mission = missions.find((m: any) => m.id === missionId);

      if (!mission) return res.status(404).json({ message: "Mission node missing." });
      
      // Verification logic again to prevent API abuse
      if ((user.claimedMissions || []).includes(missionId)) {
        return res.status(400).json({ message: "Inam pehle hi liya ja chuka hai." });
      }

      const reward = Number(mission.rewardAmount);
      const newBalance = (Number(user.balance) || 0) + reward;
      const claimedMissions = [...(user.claimedMissions || []), missionId];

      const bonusTrx = {
        id: `BON-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        type: 'reward',
        amount: reward,
        status: 'approved',
        gateway: 'Mission Hub',
        note: `Reward for: ${mission.title}`,
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString()
      };

      const transactions = [bonusTrx, ...(user.transactions || [])];

      dbNode.updateUser(user.id, { 
        balance: newBalance, 
        claimedMissions,
        transactions 
      });

      return res.status(200).json({ 
        success: true, 
        message: `Rs. ${reward} has been added to your wallet!`,
        newBalance 
      });
    } catch (e) {
      return res.status(500).json({ message: "Claim execution failed." });
    }
  }
};