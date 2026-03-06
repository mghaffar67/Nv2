import { dbNode } from '../../utils/db';

export const adminPluginController = {
  // 1. GET PENDING STATS FOR SIDEBAR BADGES
  getPendingStats: async (req: any, res: any) => {
    try {
      const stats = await dbNode.getPendingStats();
      return res.status(200).json({
        deposits: stats.deposits,
        withdrawals: stats.withdrawals,
        total: stats.deposits + stats.withdrawals
      });
    } catch (e) {
      return res.status(500).json({ message: "Registry audit failed." });
    }
  },

  // 2. PROCESS REQUEST ACTION
  processRequestAction: async (req: any, res: any) => {
    const { transactionId, userId, action, type, reason } = req.body;
    
    try {
      const user = await dbNode.findUserById(userId);
      if (!user) return res.status(404).json({ message: "Member node not found." });

      const transaction = await dbNode.getTransactionById(transactionId);
      if (!transaction) return res.status(404).json({ message: "Voucher record missing." });

      if (transaction.status !== 'pending') {
        return res.status(400).json({ message: "Voucher already processed." });
      }

      const amount = Number(transaction.amount);

      if (action === 'approve') {
        // Update Transaction Status
        await dbNode.updateTransactionStatus(transactionId, 'approved');
        
        if (type === 'deposit') {
          // Add balance
          await dbNode.updateUser(userId, { 
            balance: (Number(user.balance) || 0) + amount 
          });
        }
      } else {
        // Reject
        await dbNode.updateTransactionStatus(transactionId, 'rejected', reason || "Data Discrepancy");
        
        if (type === 'withdraw') {
          // Refund balance
          await dbNode.updateUser(userId, { 
            balance: (Number(user.balance) || 0) + amount 
          });
          
          // Optionally create a refund transaction record if needed, 
          // but usually updating the status to rejected and refunding balance is enough.
          // The old code created a separate 'refund' transaction. 
          // Let's create a refund transaction to keep the ledger clear.
          await dbNode.createTransaction({
            userId: user.id,
            type: 'reward', // or 'refund'
            amount: amount,
            status: 'approved',
            gateway: 'System Refund',
            adminNote: `Refund for Payout #${transactionId}`
          });
        }
      }

      return res.status(200).json({ success: true, message: "Ledger Synchronized." });
    } catch (err) {
      console.error("Ledger Node Failure:", err);
      return res.status(500).json({ message: "Critical Logic Error." });
    }
  }
};