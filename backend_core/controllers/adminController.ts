
import { dbNode } from '../utils/db';

export const adminController = {
  getDashboardStats: async (req: any, res: any) => {
    const db = dbNode.getUsers();
    const today = new Date().toISOString().split('T')[0];
    
    let totalRevenue = 0;
    let todayRevenue = 0;
    let pendingRequests = 0;
    let totalCompletedTasks = 0;
    
    // Generate L-7 Date nodes
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    const revenueTrend = last7Days.map(date => ({ name: date.split('-')[2], revenue: 0, tasks: 0 }));

    db.forEach((user: any) => {
      // Calculate Revenue
      if (user.purchaseHistory) {
        user.purchaseHistory.forEach((p: any) => {
          if (p.status === 'active' || p.status === 'approved') {
            const amt = Number(p.amount) || 0;
            totalRevenue += amt;
            const pDate = p.date?.split('T')[0] || p.timestamp?.split('T')[0];
            if (pDate === today) todayRevenue += amt;
            
            const trendIdx = last7Days.indexOf(pDate);
            if (trendIdx !== -1) revenueTrend[trendIdx].revenue += amt;
          }
        });
      }

      // Calculate Work & Requests
      if (user.workSubmissions) {
        user.workSubmissions.forEach((s: any) => {
          if (s.status === 'pending') pendingRequests++;
          if (s.status === 'approved') {
            totalCompletedTasks++;
            const sDate = s.timestamp?.split('T')[0];
            const trendIdx = last7Days.indexOf(sDate);
            if (trendIdx !== -1) revenueTrend[trendIdx].tasks += 1;
          }
        });
      }
      
      // Calculate Finance Pending
      if (user.transactions) {
        user.transactions.forEach((t: any) => {
          if (t.status === 'pending') pendingRequests++;
        });
      }
    });

    return res.status(200).json({
      totalRevenue,
      todayRevenue,
      pendingRequests,
      totalCompletedTasks,
      revenueTrend,
      serverTime: new Date().toISOString()
    });
  },

  // Added editUserBalance to fix property missing errors in admin modals
  editUserBalance: async (req: any, res: any) => {
    try {
      const { userId, amount, action } = req.body;
      const user = dbNode.findUserById(userId);
      if (!user) return res.status(404).json({ message: "User not found in registry." });

      const amt = Number(amount);
      if (isNaN(amt) || amt < 0) return res.status(400).json({ message: "Invalid liquidity amount." });

      let currentBalance = Number(user.balance) || 0;
      let newBalance = currentBalance;

      if (action === 'add') {
        newBalance = currentBalance + amt;
      } else if (action === 'deduct') {
        if (currentBalance < amt) return res.status(400).json({ message: "Insufficient balance for deduction." });
        newBalance = currentBalance - amt;
      }

      dbNode.updateUser(userId, { balance: newBalance });
      return res.status(200).json({ 
        success: true, 
        message: "Liquidity sync complete.", 
        newBalance 
      });
    } catch (err) {
      return res.status(500).json({ message: "Ledger adjustment node failed." });
    }
  }
};
