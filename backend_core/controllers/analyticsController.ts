
import { dbNode } from '../utils/db';

/**
 * Noor V3 - Aggregation Engine
 * High-performance reports for admin visibility.
 */
export const analyticsController = {
  getSystemReports: async (req: any, res: any) => {
    try {
      const users = dbNode.getUsers();
      const allTasks = dbNode.getTasks();
      const allRewards = dbNode.getRewards() || [];
      const today = new Date().toISOString().split('T')[0];
      
      let totalDeposits = 0;
      let totalWithdrawals = 0;
      let totalLiability = 0;
      let usersJoinedToday = 0;
      let activePlanUsers = 0;
      
      // Module Specific Stats
      let totalTasksCompleted = 0;
      let tasksCompletedToday = 0;
      let totalRewardsClaimed = 0;
      let totalRewardBonusPaid = 0;

      // 7-Day Trend Logic
      const trendMap: Record<string, { date: string, deposit: number, withdraw: number }> = {};
      const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const ds = d.toISOString().split('T')[0];
        trendMap[ds] = { date: ds, deposit: 0, withdraw: 0 };
        return ds;
      });

      users.forEach((user: any) => {
        // 1. Total User Balance
        totalLiability += (Number(user.balance) || 0);

        // 2. Member Stats
        if (user.createdAt?.startsWith(today)) usersJoinedToday++;
        if (user.currentPlan && user.currentPlan !== 'None') activePlanUsers++;

        // 3. Task Stats
        if (user.workSubmissions) {
          user.workSubmissions.forEach((s: any) => {
            if (s.status === 'approved') {
              totalTasksCompleted++;
              if (s.timestamp?.startsWith(today)) tasksCompletedToday++;
            }
          });
        }

        // 4. Reward Stats
        if (user.claimedRewards) {
          totalRewardsClaimed += user.claimedRewards.length;
        }

        // 5. Financial Totals
        if (user.transactions) {
          user.transactions.forEach((t: any) => {
            if (t.status === 'approved') {
              const amt = Number(t.amount) || 0;
              const tDate = t.date || t.timestamp?.split('T')[0];

              if (t.type === 'deposit') {
                totalDeposits += amt;
                if (trendMap[tDate]) trendMap[tDate].deposit += amt;
              } else if (t.type === 'withdraw') {
                totalWithdrawals += amt;
                if (trendMap[tDate]) trendMap[tDate].withdraw += amt;
              } else if (t.type === 'reward') {
                totalRewardBonusPaid += amt;
              }
            }
          });
        }
      });

      const netProfit = totalDeposits - totalWithdrawals;

      // Convert trendMap to array for Recharts
      const trendData = last7Days.map(date => trendMap[date]).reverse();

      return res.status(200).json({
        finance: {
          totalDeposits,
          totalWithdrawals,
          netProfit,
          totalLiability,
          totalRewardBonusPaid
        },
        users: {
          totalUsers: users.length,
          joinedToday: usersJoinedToday,
          activePremium: activePlanUsers
        },
        modules: {
          rewards: {
            totalAvailable: allRewards.length,
            activeAvailable: allRewards.filter((r: any) => r.isActive).length,
            totalClaims: totalRewardsClaimed
          },
          tasks: {
            totalInventory: allTasks.length,
            completionsAllTime: totalTasksCompleted,
            completionsToday: tasksCompletedToday
          }
        },
        trends: trendData,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      return res.status(500).json({ message: "Analytics processing failed." });
    }
  }
};
