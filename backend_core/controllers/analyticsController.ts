
import { dbNode } from '../utils/db';
import { format, subDays, eachDayOfInterval, isSameDay } from 'date-fns';

/**
 * Noor V3 - Professional Data Aggregation Engine
 */
export const analyticsController = {
  getSystemReports: async (req: any, res: any) => {
    try {
      const users = dbNode.getUsers();
      const days = parseInt(req.query.days) || 7;
      
      const today = new Date();
      const startDate = subDays(today, days - 1);
      
      // 1. Generate Date Range for empty slots
      const dateRange = eachDayOfInterval({ start: startDate, end: today });

      // 2. Financial Aggregation (Revenue/Payouts)
      let totalRevenue = 0;
      let totalPayouts = 0;
      let totalBonusPaid = 0;

      const financeTrend = dateRange.map(date => {
        const dateStr = format(date, 'yyyy-MM-dd');
        let dailyDeposit = 0;
        let dailyWithdraw = 0;

        users.forEach((u: any) => {
          (u.transactions || []).forEach((t: any) => {
            if (t.status === 'approved') {
              const tDate = t.date || t.timestamp?.split('T')[0];
              const amt = Number(t.amount) || 0;

              if (isSameDay(new Date(tDate), date)) {
                if (t.type === 'deposit') dailyDeposit += amt;
                if (t.type === 'withdraw') dailyWithdraw += amt;
              }
              
              // Global totals
              if (t.type === 'deposit') totalRevenue += amt;
              else if (t.type === 'withdraw') totalPayouts += amt;
              else if (t.type === 'reward') totalBonusPaid += amt;
            }
          });
        });

        return {
          date: format(date, 'MMM dd'),
          deposits: dailyDeposit,
          withdrawals: dailyWithdraw
        };
      });

      // 3. Member Acquisition Aggregation
      const memberGrowth = dateRange.map(date => {
        const count = users.filter((u: any) => isSameDay(new Date(u.createdAt), date)).length;
        return {
          date: format(date, 'MMM dd'),
          newMembers: count
        };
      });

      // 4. Plan Distribution (Donut Chart)
      const planMap: Record<string, number> = {};
      users.forEach((u: any) => {
        const plan = u.currentPlan || 'Unsubscribed';
        planMap[plan] = (planMap[plan] || 0) + 1;
      });

      const planDistribution = Object.keys(planMap).map(name => ({
        name: name === 'None' ? 'Unsubscribed' : name,
        value: planMap[name]
      }));

      return res.status(200).json({
        summary: {
          revenue: totalRevenue,
          payouts: totalPayouts,
          profit: totalRevenue - totalPayouts,
          bonusTotal: totalBonusPaid,
          totalMembers: users.length
        },
        charts: {
          finance: financeTrend,
          growth: memberGrowth,
          plans: planDistribution
        }
      });
    } catch (err) {
      return res.status(500).json({ message: "Analytics processing failed." });
    }
  }
};
