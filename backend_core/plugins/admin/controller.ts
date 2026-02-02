import { dbNode } from '../../utils/db';

/**
 * Noor Official V3 - Admin Request Management Controller
 */
export const adminPluginController = {
  getPendingStats: async (req: any, res: any) => {
    try {
      const users = dbNode.getUsers();
      let total = 0;
      users.forEach((u: any) => {
        if (u.transactions) total += u.transactions.filter((t: any) => t.status === 'pending').length;
      });
      return res.status(200).json({ total });
    } catch (e) { return res.status(500).json({ total: 0 }); }
  },

  processRequestAction: async (req: any, res: any) => {
    const { transactionId, userId, action, type, reason } = req.body;
    
    try {
      const user = dbNode.findUserById(userId);
      if (!user) return res.status(404).json({ message: "User not found." });

      const trxIndex = (user.transactions || []).findIndex((t: any) => t.id === transactionId);
      if (trxIndex === -1) return res.status(404).json({ message: "Ledger entry missing." });

      const transaction = user.transactions[trxIndex];
      if (transaction.status !== 'pending') return res.status(400).json({ message: "Already processed." });

      const amount = Number(transaction.amount);

      if (action === 'approve') {
        transaction.status = 'approved';
        transaction.processedAt = new Date().toISOString();

        if (type === 'deposit') {
          user.balance = (Number(user.balance) || 0) + amount;
          // Sync plan activation if deposit was for plan
          if (user.purchaseHistory) {
            const planReq = user.purchaseHistory.find((p: any) => p.status === 'pending' && p.amount === amount);
            if (planReq) {
              planReq.status = 'active';
              user.currentPlan = planReq.planId;
              const expiry = new Date();
              expiry.setDate(expiry.getDate() + 365);
              user.planExpiry = expiry.toISOString();
            }
          }
        }
        // Withdrawal: Balance already deducted on request. Approval just finalizes status.
      } 
      else {
        // --- V3 REJECTION PROTOCOL (AUTO-REFUND) ---
        transaction.status = 'rejected';
        transaction.adminNote = reason || "Data mismatch found.";
        transaction.processedAt = new Date().toISOString();
        
        if (type === 'withdraw') {
          // Add funds back to balance as it was deducted during WD request
          user.balance = (Number(user.balance) || 0) + amount;
          
          // Inject Refund Log
          const refundLog = {
            id: `REF-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
            type: 'reward',
            amount: amount,
            status: 'approved',
            gateway: 'System Auto-Refund',
            note: `Refund for rejected payout ID: ${transactionId}`,
            date: new Date().toISOString().split('T')[0],
            timestamp: new Date().toISOString()
          };
          user.transactions.unshift(refundLog);
        }
      }

      dbNode.updateUser(userId, { 
        balance: user.balance, 
        transactions: user.transactions,
        currentPlan: user.currentPlan,
        planExpiry: user.planExpiry,
        purchaseHistory: user.purchaseHistory 
      });

      return res.status(200).json({ 
        success: true, 
        message: action === 'approve' ? "Protocol Synchronized." : "Request Rejected & Balance Refunded.",
        user: { balance: user.balance } 
      });
    } catch (err) {
      return res.status(500).json({ message: "Admin Sync Failure." });
    }
  }
};