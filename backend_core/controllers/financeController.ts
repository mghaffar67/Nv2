
import { dbNode } from '../utils/db';

/**
 * Noor V3 - Advanced Financial Controller (Admin Logic)
 */
export const financeController = {
  // 1. DATA RETRIEVAL NODES
  getAllDeposits: async (req: any, res: any) => {
    // Add await to fix Promise property access error
    const users = await dbNode.getUsers();
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
    // Add await to fix Promise property access error
    const users = await dbNode.getUsers();
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

  // 2. DEPOSIT PROTOCOL
  approveDeposit: async (req: any, res: any) => {
    const { transactionId, userId } = req.body;
    // Add await to fix Promise property access error
    const user = await dbNode.findUserById(userId);
    if (!user) return res.status(404).json({ message: "Identity node missing." });

    // Fix property access on Promise
    const trxIndex = user.transactions.findIndex((t: any) => t.id === transactionId);
    if (trxIndex === -1) return res.status(404).json({ message: "Ledger entry not found." });

    // Fix property access on Promise
    if (user.transactions[trxIndex].status !== 'pending') {
      return res.status(400).json({ message: "Transaction already processed." });
    }

    // Logic: Finalize Status and Add Balance
    // Fix property access on Promise
    user.transactions[trxIndex].status = 'approved';
    user.transactions[trxIndex].processedAt = new Date().toISOString();
    
    // Fix property access on Promise
    const amount = Number(user.transactions[trxIndex].amount);
    // Fix property access on Promise
    user.balance = (Number(user.balance) || 0) + amount;

    // Fix property access on Promise
    dbNode.updateUser(userId, { balance: user.balance, transactions: user.transactions });
    return res.status(200).json({ success: true, message: "Funds Authorized." });
  },

  rejectDeposit: async (req: any, res: any) => {
    const { transactionId, userId, reason } = req.body;
    // Add await to fix Promise property access error
    const user = await dbNode.findUserById(userId);
    if (!user) return res.status(404).json({ message: "Identity node missing." });

    // Fix property access on Promise
    const trxIndex = user.transactions.findIndex((t: any) => t.id === transactionId);
    if (trxIndex === -1) return res.status(404).json({ message: "Ledger entry not found." });

    // Fix property access on Promise
    user.transactions[trxIndex].status = 'rejected';
    user.transactions[trxIndex].adminNote = reason || "Evidence Invalid";
    user.transactions[trxIndex].processedAt = new Date().toISOString();

    // Fix property access on Promise
    dbNode.updateUser(userId, { transactions: user.transactions });
    return res.status(200).json({ success: true, message: "Request Terminated." });
  },

  // 3. WITHDRAWAL PROTOCOL (CRITICAL)
  approveWithdrawal: async (req: any, res: any) => {
    const { transactionId, userId } = req.body;
    // Add await to fix Promise property access error
    const user = await dbNode.findUserById(userId);
    if (!user) return res.status(404).json({ message: "Identity node missing." });

    // Fix property access on Promise
    const trxIndex = user.transactions.findIndex((t: any) => t.id === transactionId);
    if (trxIndex === -1) return res.status(404).json({ message: "Payout record not found." });

    // Fix property access on Promise
    if (user.transactions[trxIndex].status !== 'pending') {
      return res.status(400).json({ message: "Payout already processed." });
    }

    // Logic: Status change only (Balance was already locked/deducted at request time)
    // Fix property access on Promise
    user.transactions[trxIndex].status = 'approved';
    user.transactions[trxIndex].processedAt = new Date().toISOString();

    // Fix property access on Promise
    dbNode.updateUser(userId, { transactions: user.transactions });
    return res.status(200).json({ success: true, message: "Payout Confirmed." });
  },

  rejectWithdrawal: async (req: any, res: any) => {
    const { transactionId, userId, reason } = req.body;
    // Add await to fix Promise property access error
    const user = await dbNode.findUserById(userId);
    if (!user) return res.status(404).json({ message: "Identity node missing." });

    // Fix property access on Promise
    const trxIndex = user.transactions.findIndex((t: any) => t.id === transactionId);
    if (trxIndex === -1) return res.status(404).json({ message: "Payout record not found." });

    // Fix property access on Promise
    if (user.transactions[trxIndex].status !== 'pending') return res.status(400).json({ message: "Already processed." });

    // Fix property access on Promise
    const amount = Number(user.transactions[trxIndex].amount);
    
    // Logic: Reject status and REFUND balance
    // Fix property access on Promise
    user.transactions[trxIndex].status = 'rejected';
    user.transactions[trxIndex].adminNote = reason || "Information Discrepancy";
    user.transactions[trxIndex].processedAt = new Date().toISOString();

    // Refund Logic
    // Fix property access on Promise
    user.balance = (Number(user.balance) || 0) + amount;

    // Create Refund Trace in Ledger
    const refundTrace = {
      id: `REF-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      type: 'reward',
      amount: amount,
      status: 'approved',
      gateway: 'System Refund',
      note: `Auto-refund for declined payout #${transactionId}`,
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString()
    };
    // Fix property access on Promise
    user.transactions.unshift(refundTrace);

    // Fix property access on Promise
    dbNode.updateUser(userId, { balance: user.balance, transactions: user.transactions });
    return res.status(200).json({ success: true, message: "Payout Terminated & Refunded." });
  }
};
