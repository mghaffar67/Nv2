
import { dbNode } from '../utils/db';

export const adminController = {
  getDashboardStats: async (req: any, res: any) => {
    // Force fresh registry pull
    const db = dbNode.getUsers();
    
    let pendingWithdrawals = 0;
    let pendingDeposits = 0;
    let totalCapitalPool = 0;
    let totalPayoutsProcessed = 0;
    
    db.forEach((user: any) => {
      // Calculate active balance pool
      totalCapitalPool += (Number(user.balance) || 0);
      
      if (user.transactions && Array.isArray(user.transactions)) {
        user.transactions.forEach((t: any) => {
          // Track pending items for the hub badges
          if (t.type === 'withdraw' && t.status === 'pending') {
            pendingWithdrawals++;
          }
          if (t.type === 'deposit' && t.status === 'pending') {
            pendingDeposits++;
          }
          // Track total payouts
          if (t.type === 'withdraw' && t.status === 'approved') {
            totalPayoutsProcessed += Number(t.amount);
          }
        });
      }
    });

    return res.status(200).json({
      totalActivePartners: db.length,
      totalCapitalPool,
      pendingWithdrawals,
      pendingDeposits,
      totalPayoutsProcessed,
      serverTime: new Date().toISOString()
    });
  },

  getPartnerList: async (req: any, res: any) => {
    const db = dbNode.getUsers();
    return res.status(200).json(db);
  },

  loginAsUser: async (req: any, res: any) => {
    const { userId } = req.body;
    const user = dbNode.findUserById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const { password: _, ...sessionUser } = user;
    return res.status(200).json({
      success: true,
      token: `jwt-noor-${user.id}-${Date.now()}`,
      user: sessionUser
    });
  },

  editUserBalance: async (req: any, res: any) => {
    const { userId, amount, action, reason } = req.body; 
    const user = dbNode.findUserById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const numericAmount = Number(amount);
    let newBalance = Number(user.balance) || 0;
    
    if (action === 'add') {
      newBalance += numericAmount;
    } else {
      newBalance = Math.max(0, newBalance - numericAmount);
    }

    const historyEntry = {
      id: `ADM-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      type: action === 'add' ? 'reward' : 'withdraw',
      amount: numericAmount,
      status: 'approved',
      gateway: 'System Adjustment',
      note: reason || `Manual balance adjustment by admin.`,
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString()
    };

    const trx = user.transactions || [];
    trx.unshift(historyEntry);

    dbNode.updateUser(userId, { balance: newBalance, transactions: trx });
    return res.status(200).json({ success: true, newBalance, historyEntry });
  }
};
