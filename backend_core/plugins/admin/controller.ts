import { dbNode } from '../../utils/db';

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
      if (!user) return res.status(404).json({ message: "Identity missing." });

      const trxIndex = (user.transactions || []).findIndex((t: any) => t.id === transactionId);
      if (trxIndex === -1) return res.status(404).json({ message: "Ledger entry missing." });

      const transaction = user.transactions[trxIndex];
      if (transaction.status !== 'pending') return res.status(400).json({ message: "Packet already processed." });

      const amount = Number(transaction.amount);

      if (action === 'approve') {
        transaction.status = 'approved';
        transaction.processedAt = new Date().toISOString();
        // Funds were already deducted on request for withdrawals.
      } 
      else {
        // --- ATOMIC AUTO-REFUND NODE ---
        transaction.status = 'rejected';
        transaction.adminNote = reason || "Audit mismatch.";
        transaction.processedAt = new Date().toISOString();
        
        // If it's a withdrawal or "reward claim" deduction, return the funds
        if (type === 'withdraw' || type === 'claim') {
          user.balance = (Number(user.balance) || 0) + amount;
          
          // Inject Audit Trace
          const refundLog = {
            id: `REFUND-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
            type: 'reward',
            amount: amount,
            status: 'approved',
            gateway: 'System Reversal',
            note: `Refund for rejected ${type}: ${transactionId}`,
            date: new Date().toISOString().split('T')[0],
            timestamp: new Date().toISOString()
          };
          user.transactions.unshift(refundLog);
        }
      }

      dbNode.updateUser(userId, { 
        balance: user.balance, 
        transactions: user.transactions 
      });

      return res.status(200).json({ 
        success: true, 
        message: action === 'approve' ? "Action Approved." : "Action Rejected & Raqam Refunded." 
      });
    } catch (err) {
      return res.status(500).json({ message: "Internal Logic Failure." });
    }
  },

  updateSystemConfig: async (req: any, res: any) => {
    const { updates } = req.body;
    const current = dbNode.getConfig();
    const newConfig = { ...current, ...updates };
    
    // Add audit log
    if (!newConfig.changeLog) newConfig.changeLog = [];
    newConfig.changeLog.unshift({
      adminId: req.user.id,
      action: `Modified Module Settings: ${Object.keys(updates).join(', ')}`,
      timestamp: new Date().toISOString()
    });

    dbNode.saveConfig(newConfig);
    return res.status(200).json({ success: true, config: newConfig });
  }
};