import { dbNode } from '../utils/db';

export const adminController = {
  getDashboardStats: async (req: any, res: any) => {
    // Fix: Added await to async db call
    const db = await dbNode.getUsers();
    const today = new Date().toISOString().split('T')[0];
    
    let totalRevenue = 0;
    let todayRevenue = 0;
    let pendingRequests = 0;
    let totalCompletedTasks = 0;
    
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    const revenueTrend = last7Days.map(date => ({ name: date.split('-')[2], revenue: 0, tasks: 0 }));

    // Fix: db is now the array from awaited promise
    db.forEach((user: any) => {
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

  editUserBalance: async (req: any, res: any) => {
    try {
      const { userId, amount, action } = req.body;
      // Fix: Added await to async db call
      const user = await dbNode.findUserById(userId);
      if (!user) return res.status(404).json({ message: "User not found." });

      const amt = Number(amount);
      if (isNaN(amt) || amt < 0) return res.status(400).json({ message: "Invalid amount." });

      // Fix: Property access on awaited user object
      let currentBalance = Number(user.balance) || 0;
      let newBalance = currentBalance;
      let type = action === 'add' ? 'admin_bonus' : 'admin_deduction';
      let gateway = action === 'add' ? 'Admin Deposit' : 'Admin Deduction';

      if (action === 'add') {
        newBalance = currentBalance + amt;
      } else if (action === 'deduct') {
        if (currentBalance < amt) return res.status(400).json({ message: "Insufficient balance for deduction." });
        newBalance = currentBalance - amt;
      }

      // Generate history record
      const historyLog = {
        id: `ADM-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        type: type,
        amount: amt,
        status: 'approved',
        gateway: gateway,
        note: `Manual adjustment by Support Team`,
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString()
      };

      // Fix: Property access on awaited user object
      const trx = user.transactions || [];
      trx.unshift(historyLog);

      // Fix: Added await to updateUser call
      await dbNode.updateUser(userId, { balance: newBalance, transactions: trx });
      return res.status(200).json({ 
        success: true, 
        message: "Wallet updated and logged.", 
        newBalance 
      });
    } catch (err) {
      return res.status(500).json({ message: "Operation failed." });
    }
  }
};