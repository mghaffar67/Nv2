
import { dbNode } from '../../utils/db';

export const adminPluginController = {
  // 1. GET PENDING STATS FOR SIDEBAR BADGES
  getPendingStats: async (req: any, res: any) => {
    try {
      const users = dbNode.getUsers();
      let deposits = 0;
      let withdrawals = 0;

      users.forEach((u: any) => {
        if (u.transactions) {
          u.transactions.forEach((t: any) => {
            if (t.status === 'pending') {
              if (t.type === 'deposit') deposits++;
              if (t.type === 'withdraw') withdrawals++;
            }
          });
        }
      });

      return res.status(200).json({
        deposits,
        withdrawals,
        total: deposits + withdrawals
      });
    } catch (e) {
      return res.status(500).json({ message: "Registry audit failed." });
    }
  },

  // 2. PROCESS REQUEST ACTION (REFINED)
  processRequestAction: async (req: any, res: any) => {
    const { transactionId, userId, action, type, reason } = req.body;
    
    try {
      const user = dbNode.findUserById(userId);
      if (!user) return res.status(404).json({ message: "Member node not found." });

      const trxIndex = user.transactions.findIndex((t: any) => t.id === transactionId);
      if (trxIndex === -1) return res.status(404).json({ message: "Voucher record missing." });

      const transaction = user.transactions[trxIndex];
      if (transaction.status !== 'pending') {
        return res.status(400).json({ message: "Voucher already processed." });
      }

      const amount = Number(transaction.amount);

      if (action === 'approve') {
        transaction.status = 'approved';
        transaction.processedAt = new Date().toISOString();
        
        // Deposits: Add to balance on approval
        if (type === 'deposit') {
          user.balance = (Number(user.balance) || 0) + amount;
        }
        // Withdrawals: No balance change (balance was already deducted on request)
      } else {
        transaction.status = 'rejected';
        transaction.adminNote = reason || "Data Discrepancy";
        
        // Withdrawals: Refund on rejection
        if (type === 'withdraw') {
          user.balance = (Number(user.balance) || 0) + amount;
          
          // Log refund in transaction history
          const refundLog = {
            id: `REF-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
            type: 'reward',
            amount: amount,
            status: 'approved',
            gateway: 'System Refund',
            note: `Refund for Payout #${transactionId}`,
            date: new Date().toISOString().split('T')[0],
            timestamp: new Date().toISOString()
          };
          user.transactions.unshift(refundLog);
        }
      }

      dbNode.updateUser(userId, { balance: user.balance, transactions: user.transactions });
      return res.status(200).json({ success: true, message: "Ledger Synchronized." });
    } catch (err) {
      return res.status(500).json({ message: "Critical Logic Error during process." });
    }
  }
};
