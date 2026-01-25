
import { dbNode } from '../utils/db';

/**
 * Noor V3 - Data Science & Analytics Engine
 * High-performance aggregation for platform health.
 */
export const analyticsController = {
  getSystemReports: async (req: any, res: any) => {
    try {
      const users = dbNode.getUsers();
      const today = new Date().toISOString().split('T')[0];
      
      let totalDeposits = 0;
      let totalWithdrawals = 0;
      let totalLiability = 0;
      let usersJoinedToday = 0;
      let activePlanUsers = 0;

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
        // 1. Accumulate Liability (Money held by users)
        totalLiability += (Number(user.balance) || 0);

        // 2. User Stats
        if (user.createdAt?.startsWith(today)) usersJoinedToday++;
        if (user.currentPlan && user.currentPlan !== 'None') activePlanUsers++;

        // 3. Financial Aggregation (Transactions)
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
              }
            }
          });
        }
      });

      const netProfit = totalDeposits - totalWithdrawals;
      const systemHealth = netProfit > totalLiability ? 'HEALTHY' : 'DEFICIT';

      // Convert trendMap to sorted array
      const trendData = last7Days.map(date => trendMap[date]).reverse();

      return res.status(200).json({
        finance: {
          totalDeposits,
          totalWithdrawals,
          netProfit,
          totalLiability,
          systemHealth
        },
        users: {
          totalUsers: users.length,
          joinedToday: usersJoinedToday,
          activePremium: activePlanUsers
        },
        trends: trendData,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      return res.status(500).json({ message: "Analytics Node Failure." });
    }
  }
};
