import { dbNode } from '../utils/db';

export const adminController = {
  getDashboardStats: async (req: any, res: any) => {
    const db = dbNode.getUsers();
    let totalRevenue = 0;
    let pendingRequests = 0;
    let totalCompletedTasks = 0;
    
    db.forEach((user: any) => {
      if (user.purchaseHistory) {
        user.purchaseHistory.forEach((p: any) => {
          if (p.status === 'active' || p.status === 'approved') totalRevenue += Number(p.amount) || 0;
        });
      }
      if (user.workSubmissions) {
        user.workSubmissions.forEach((s: any) => {
          if (s.status === 'pending') pendingRequests++;
          if (s.status === 'approved') totalCompletedTasks++;
        });
      }
      if (user.transactions) {
        user.transactions.forEach((t: any) => {
          if (t.status === 'pending') pendingRequests++;
        });
      }
    });

    return res.status(200).json({ totalRevenue, pendingRequests, totalCompletedTasks });
  },

  editUserBalance: async (req: any, res: any) => {
    try {
      const { userId, amount, action } = req.body;
      const user = dbNode.findUserById(userId);
      if (!user) return res.status(404).json({ message: "User not found." });

      const amt = Number(amount);
      if (isNaN(amt) || amt <= 0) return res.status(400).json({ message: "Ghalat raqam." });

      let currentBalance = Number(user.balance) || 0;
      let newBalance = action === 'add' ? currentBalance + amt : currentBalance - amt;

      if (newBalance < 0) return res.status(400).json({ message: "Natija manfi (negative) nahi ho sakta." });

      const updatePayload = {
        balance: newBalance,
        transactions: [
          {
            id: `ADJ-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
            type: 'reward',
            amount: amt,
            status: 'approved',
            gateway: 'Admin Adjustment',
            note: action === 'add' ? 'Funds added by Admin' : 'Funds deducted by Admin',
            date: new Date().toISOString().split('T')[0],
            timestamp: new Date().toISOString()
          },
          ...(user.transactions || [])
        ]
      };

      dbNode.updateUser(userId, updatePayload);
      return res.status(200).json({ success: true, message: "Balance update ho gaya.", newBalance });
    } catch (err) {
      return res.status(500).json({ message: "Error updating balance." });
    }
  }
};