
import { dbNode } from '../utils/db';

export const financeController = {
  getAllDeposits: async (req: any, res: any) => {
    const users = dbNode.getUsers();
    let allDeposits: any[] = [];

    users.forEach((user: any) => {
      if (user.transactions) {
        const userDeposits = user.transactions
          .filter((t: any) => t.type === 'deposit')
          .map((t: any) => ({
            ...t,
            userName: user.name,
            userPhone: user.phone,
            userId: user.id
          }));
        allDeposits = [...allDeposits, ...userDeposits];
      }
    });

    return res.status(200).json(allDeposits.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
  },

  getAllWithdrawals: async (req: any, res: any) => {
    const users = dbNode.getUsers();
    let allWithdrawals: any[] = [];

    users.forEach((user: any) => {
      if (user.transactions) {
        const userWds = user.transactions
          .filter((t: any) => t.type === 'withdraw')
          .map((t: any) => ({
            ...t,
            userName: user.name,
            userPhone: user.phone,
            userId: user.id
          }));
        allWithdrawals = [...allWithdrawals, ...userWds];
      }
    });

    return res.status(200).json(allWithdrawals.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
  },

  approveDeposit: async (req: any, res: any) => {
    const { transactionId, userId } = req.body;
    const user = dbNode.findUserById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const trxIndex = user.transactions.findIndex((t: any) => t.id === transactionId);
    if (trxIndex === -1) return res.status(404).json({ message: "Trx not found" });

    if (user.transactions[trxIndex].status !== 'pending') return res.status(400).json({ message: "Already processed" });

    user.transactions[trxIndex].status = 'approved';
    const amount = Number(user.transactions[trxIndex].amount);
    const newBalance = (Number(user.balance) || 0) + amount;

    dbNode.updateUser(userId, { balance: newBalance, transactions: user.transactions });
    return res.status(200).json({ success: true });
  },

  rejectDeposit: async (req: any, res: any) => {
    const { transactionId, userId, reason } = req.body;
    const user = dbNode.findUserById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const trxIndex = user.transactions.findIndex((t: any) => t.id === transactionId);
    if (trxIndex === -1) return res.status(404).json({ message: "Trx not found" });

    user.transactions[trxIndex].status = 'rejected';
    user.transactions[trxIndex].adminRemark = reason;

    dbNode.updateUser(userId, { transactions: user.transactions });
    return res.status(200).json({ success: true });
  },

  approveWithdrawal: async (req: any, res: any) => {
    const { transactionId, userId } = req.body;
    const user = dbNode.findUserById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const trxIndex = user.transactions.findIndex((t: any) => t.id === transactionId);
    if (trxIndex === -1) return res.status(404).json({ message: "Withdrawal not found" });

    user.transactions[trxIndex].status = 'approved';
    dbNode.updateUser(userId, { transactions: user.transactions });
    return res.status(200).json({ success: true });
  },

  rejectWithdrawal: async (req: any, res: any) => {
    const { transactionId, userId, reason } = req.body;
    const user = dbNode.findUserById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const trxIndex = user.transactions.findIndex((t: any) => t.id === transactionId);
    if (trxIndex === -1) return res.status(404).json({ message: "Withdrawal not found" });

    const amount = Number(user.transactions[trxIndex].amount);
    user.transactions[trxIndex].status = 'rejected';
    user.transactions[trxIndex].adminRemark = reason || "Request Rejected";
    
    // Auto-Refund logic
    const newBalance = (Number(user.balance) || 0) + amount;

    // Create a refund entry in history for clarity
    const refundEntry = {
      id: `REF-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      type: 'reward',
      amount: amount,
      status: 'approved',
      gateway: 'Withdraw Refund',
      note: `Refund for rejected withdrawal: ${transactionId}`,
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString()
    };

    user.transactions.unshift(refundEntry);

    dbNode.updateUser(userId, { balance: newBalance, transactions: user.transactions });
    return res.status(200).json({ success: true });
  }
};
