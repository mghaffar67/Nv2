
import { dbNode } from '../utils/db';
import { format, subDays, eachDayOfInterval, isSameDay } from 'date-fns';

/**
 * Noor V3 - Professional Data Aggregation Engine
 */
export const analyticsController = {
  getSystemReports: async (req: any, res: any) => {
    try {
      // Add await to fix Promise iteration error
      const users = await dbNode.getUsers();
      const days = parseInt(req.query.days as string) || 7;
      
      const today = new Date();
      const todayStr = format(today, 'yyyy-MM-dd');
      const startDate = subDays(today, days - 1);
      
      const dateRange = eachDayOfInterval({ start: startDate, end: today });

      let totalRevenue = 0;
      let totalPayouts = 0;
      
      // Task specific metrics
      let totalUserEarnings = 0;
      let todayUserEarnings = 0;
      let totalTasksCompleted = 0;
      let pendingTasksCount = 0;

      // Fix forEach on Promise error
      users.forEach((u: any) => {
        // Task aggregations
        (u.workSubmissions || []).forEach((s: any) => {
          if (s.status === 'pending') pendingTasksCount++;
          if (s.status === 'approved') {
            totalTasksCompleted++;
            totalUserEarnings += Number(s.reward || 0);
            const sDate = s.timestamp?.split('T')[0];
            if (sDate === todayStr) {
              todayUserEarnings += Number(s.reward || 0);
            }
          }
        });

        // Transaction aggregations
        (u.transactions || []).forEach((t: any) => {
          if (t.status === 'approved') {
            if (t.type === 'deposit') totalRevenue += Number(t.amount || 0);
            else if (t.type === 'withdraw') totalPayouts += Number(t.amount || 0);
          }
        });
      });

      const financeTrend = dateRange.map(date => {
        let dailyDeposit = 0;
        let dailyWithdraw = 0;

        // Fix forEach on Promise error
        users.forEach((u: any) => {
          (u.transactions || []).forEach((t: any) => {
            if (t.status === 'approved') {
              const tDate = t.date || t.timestamp?.split('T')[0];
              if (isSameDay(new Date(tDate), date)) {
                if (t.type === 'deposit') dailyDeposit += Number(t.amount || 0);
                if (t.type === 'withdraw') dailyWithdraw += Number(t.amount || 0);
              }
            }
          });
        });

        return {
          date: format(date, 'MMM dd'),
          deposits: dailyDeposit,
          withdrawals: dailyWithdraw
        };
      });

      const memberGrowth = dateRange.map(date => {
        // Fix filter on Promise error
        const count = users.filter((u: any) => isSameDay(new Date(u.createdAt), date)).length;
        return {
          date: format(date, 'MMM dd'),
          newMembers: count
        };
      });

      const planMap: Record<string, number> = {};
      // Fix forEach on Promise error
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
          // Fix length on Promise error
          totalMembers: users.length,
          totalUserEarnings,
          todayUserEarnings,
          totalTasksCompleted,
          pendingTasksCount
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
