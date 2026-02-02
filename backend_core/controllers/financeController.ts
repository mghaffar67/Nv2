import { dbNode } from '../utils/db';

/**
 * Noor V3 - Advanced Financial Controller (Admin Logic)
 */
export const financeController = {
  // ... existing getAllDeposits and getAllWithdrawals nodes ...
  getAllDeposits: async (req: any, res: any) => {
    const users = dbNode.getUsers();
    let deposits: any[] = [];
    users.forEach((user: any) => {
      if (user.transactions) {
        const userDeps = user.transactions
          .filter((t: any) => t.type === 'deposit')
          .map((t: any) => ({
            ...t,
            userName: user.name,
            userPhone: user.phone,
            userId: user.id,
            userEmail: user.email
          }));
        deposits = [...deposits, ...userDeps];
      }
    });
    return res.status(200).json(deposits.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
  },

  getAllWithdrawals: async (req: any, res: any) => {
    const users = dbNode.getUsers();
    let withdrawals: any[] = [];
    users.forEach((user: any) => {
      if (user.transactions) {
        const userWds = user.transactions
          .filter((t: any) => t.type === 'withdraw')
          .map((t: any) => ({
            ...t,
            userName: user.name,
            userPhone: user.phone,
            userId: user.id,
            userEmail: user.email
          }));
        withdrawals = [...withdrawals, ...userWds];
      }
    });
    return res.status(200).json(withdrawals.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
  },

  approveDeposit: async (req: any, res: any) => {
    const { transactionId, userId } = req.body;
    const user = dbNode.findUserById(userId);
    if (!user) return res.status(404).json({ message: "Identity node missing." });

    const trxIndex = user.transactions.findIndex((t: any) => t.id === transactionId);
    if (trxIndex === -1) return res.status(404).json({ message: "Ledger entry not found." });

    if (user.transactions[trxIndex].status !== 'pending') {
      return res.status(400).json({ message: "Transaction already processed." });
    }

    user.transactions[trxIndex].status = 'approved';
    user.transactions[trxIndex].processedAt = new Date().toISOString();
    
    const amount = Number(user.transactions[trxIndex].amount);
    user.balance = (Number(user.balance) || 0) + amount;

    dbNode.updateUser(userId, { balance: user.balance, transactions: user.transactions });
    return res.status(200).json({ success: true, message: "Funds Authorized." });
  },

  rejectDeposit: async (req: any, res: any) => {
    const { transactionId, userId, reason } = req.body;
    const user = dbNode.findUserById(userId);
    if (!user) return res.status(404).json({ message: "Identity node missing." });

    const trxIndex = user.transactions.findIndex((t: any) => t.id === transactionId);
    if (trxIndex === -1) return res.status(404).json({ message: "Ledger entry not found." });

    user.transactions[trxIndex].status = 'rejected';
    user.transactions[trxIndex].adminNote = reason || "Evidence Invalid";
    user.transactions[trxIndex].processedAt = new Date().toISOString();

    dbNode.updateUser(userId, { transactions: user.transactions });
    return res.status(200).json({ success: true, message: "Request Terminated." });
  },

  approveWithdrawal: async (req: any, res: any) => {
    const { transactionId, userId } = req.body;
    const user = dbNode.findUserById(userId);
    if (!user) return res.status(404).json({ message: "Identity node missing." });

    const trxIndex = user.transactions.findIndex((t: any) => t.id === transactionId);
    if (trxIndex === -1) return res.status(404).json({ message: "Payout record not found." });

    if (user.transactions[trxIndex].status !== 'pending') {
      return res.status(400).json({ message: "Payout already processed." });
    }

    user.transactions[trxIndex].status = 'approved';
    user.transactions[trxIndex].processedAt = new Date().toISOString();

    dbNode.updateUser(userId, { transactions: user.transactions });
    return res.status(200).json({ success: true, message: "Payout Confirmed." });
  },

  rejectWithdrawal: async (req: any, res: any) => {
    const { transactionId, userId, reason } = req.body;
    const user = dbNode.findUserById(userId);
    if (!user) return res.status(404).json({ message: "Identity node missing." });

    const trxIndex = user.transactions.findIndex((t: any) => t.id === transactionId);
    if (trxIndex === -1) return res.status(404).json({ message: "Payout record not found." });

    if (user.transactions[trxIndex].status !== 'pending') return res.status(400).json({ message: "Already processed." });

    const amount = Number(user.transactions[trxIndex].amount);
    
    // --- V3 AUTO-REFUND LOGIC ---
    user.transactions[trxIndex].status = 'rejected';
    user.transactions[trxIndex].adminNote = reason || "Declined by Admin";
    user.transactions[trxIndex].processedAt = new Date().toISOString();

    // Mandatory Refund of locked funds
    user.balance = (Number(user.balance) || 0) + amount;

    // Log the refund event in history
    const refundTrace = {
      id: `REF-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      type: 'reward',
      amount: amount,
      status: 'approved',
      gateway: 'Auto-Refund',
      note: `Refund for rejected payout #${transactionId}`,
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString()
    };
    user.transactions.unshift(refundTrace);

    dbNode.updateUser(userId, { balance: user.balance, transactions: user.transactions });
    return res.status(200).json({ success: true, message: "Payout Rejected & Raqam Refunded." });
  }
};