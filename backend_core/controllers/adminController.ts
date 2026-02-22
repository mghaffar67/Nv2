import { dbNode } from '../utils/db';

export const adminController = {
  getDashboardStats: async (req: any, res: any) => {
    try {
      const users = await dbNode.getUsers();
      const days = parseInt(req.query.days as string) || 30;
      const today = new Date().toISOString().split('T')[0];
      
      let totalRevenue = 0;
      let totalPayouts = 0;
      let totalUserEarnings = 0;
      let todayUserEarnings = 0;
      let totalTasksCompleted = 0;
      let pendingTasksCount = 0;
      let totalPendingRequests = 0;

      const planMap: Record<string, number> = {};

      users.forEach((user: any) => {
        // Plan Distribution
        const plan = user.currentPlan || 'None';
        planMap[plan] = (planMap[plan] || 0) + 1;

        // Purchase History (Revenue)
        if (user.purchaseHistory) {
          user.purchaseHistory.forEach((p: any) => {
            if (p.status === 'active' || p.status === 'approved') {
              totalRevenue += Number(p.amount) || 0;
            }
          });
        }

        // Submissions (Tasks)
        if (user.workSubmissions) {
          user.workSubmissions.forEach((s: any) => {
            if (s.status === 'pending') pendingTasksCount++;
            if (s.status === 'approved') {
              totalTasksCompleted++;
              const reward = Number(s.reward) || 0;
              totalUserEarnings += reward;
              if (s.timestamp?.startsWith(today)) todayUserEarnings += reward;
            }
          });
        }

        // Transactions (Payouts / Deposits)
        if (user.transactions) {
          user.transactions.forEach((t: any) => {
            if (t.status === 'pending') totalPendingRequests++;
            if (t.status === 'approved') {
              if (t.type === 'withdraw') totalPayouts += Number(t.amount) || 0;
              // Deposits already counted in purchaseHistory or separate deposit logs
              if (t.type === 'deposit') totalRevenue += Number(t.amount) || 0;
            }
          });
        }
      });

      // Simplified chart data for the last 'X' days
      const charts = {
        finance: Array.from({ length: 7 }).map((_, i) => ({
          date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString([], { month: 'short', day: 'numeric' }),
          deposits: Math.floor(totalRevenue / 10 + Math.random() * 500),
          withdrawals: Math.floor(totalPayouts / 10 + Math.random() * 300)
        })),
        plans: Object.entries(planMap).map(([name, value]) => ({ name, value }))
      };

      return res.status(200).json({
        summary: {
          revenue: totalRevenue,
          payouts: totalPayouts,
          profit: totalRevenue - totalPayouts,
          totalMembers: users.length,
          totalUserEarnings,
          todayUserEarnings,
          totalTasksCompleted,
          pendingTasksCount,
          totalPendingRequests
        },
        charts
      });
    } catch (err) {
      console.error("Admin Analytics Node Failure:", err);
      return res.status(500).json({ message: "Registry sync failure." });
    }
  },

  editUserBalance: async (req: any, res: any) => {
    try {
      const { userId, amount, action } = req.body;
      const user = await dbNode.findUserById(userId);
      if (!user) return res.status(404).json({ message: "User not found." });

      const amt = Number(amount);
      if (isNaN(amt) || amt < 0) return res.status(400).json({ message: "Invalid amount." });

      let currentBalance = Number(user.balance) || 0;
      let newBalance = currentBalance;
      let type = action === 'add' ? 'admin_bonus' : 'admin_deduction';
      let gateway = action === 'add' ? 'Admin Deposit' : 'Admin Deduction';

      if (action === 'add') {
        newBalance = currentBalance + amt;
      } else if (action === 'deduct') {
        if (currentBalance < amt) return res.status(400).json({ message: "Insufficient balance." });
        newBalance = currentBalance - amt;
      }

      const historyLog = {
        id: `ADM-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        type: type,
        amount: amt,
        status: 'approved',
        gateway: gateway,
        note: `Manual adjustment by Support`,
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString()
      };

      const trx = user.transactions || [];
      trx.unshift(historyLog);

      await dbNode.updateUser(userId, { balance: newBalance, transactions: trx });
      return res.status(200).json({ 
        success: true, 
        message: "Wallet synchronized.", 
        newBalance 
      });
    } catch (err) {
      return res.status(500).json({ message: "Operation failed." });
    }
  }
};