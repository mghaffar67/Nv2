import { dbNode } from '../utils/db';

/**
 * Noor Official V3 - User Finance Controller
 * Handles user-side financial interactions with validation.
 */
export const userFinanceController = {
  requestDeposit: async (req: any, res: any) => {
    const { userId, amount, trxId, gateway, proofImage } = req.body;
    const user = dbNode.findUserById(userId);

    if (!user) return res.status(404).json({ message: "Identity node not found." });
    
    const depositAmt = Number(amount);
    if (isNaN(depositAmt) || depositAmt < 100) {
      return res.status(400).json({ message: "Minimum liquidity inflow is 100 PKR." });
    }

    const newTrx = {
      id: `TRX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      userId,
      type: 'deposit',
      amount: depositAmt,
      gateway: gateway || 'EasyPaisa',
      trxId,
      proofImage,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString()
    };

    const transactions = user.transactions || [];
    transactions.unshift(newTrx);
    
    dbNode.updateUser(userId, { transactions });
    return res.status(201).json({ message: 'Packet submitted. Node audit completes in 1-3 hours.', transaction: newTrx });
  },

  requestWithdraw: async (req: any, res: any) => {
    const { userId, amount, accountNumber, accountTitle, gateway } = req.body;
    const user = dbNode.findUserById(userId);

    if (!user) return res.status(404).json({ message: "Node missing in registry." });

    const withdrawAmount = Number(amount);
    if (isNaN(withdrawAmount) || withdrawAmount < 500) {
      return res.status(400).json({ message: "Minimum payout is PKR 500." });
    }

    if (Number(user.balance) < withdrawAmount) {
      return res.status(400).json({ message: "Insufficient account liquidity." });
    }

    // 1. Lock funds immediately to prevent double-spending
    const newBalance = Number(user.balance) - withdrawAmount;

    const newTrx = {
      id: `WD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      userId,
      type: 'withdraw',
      amount: withdrawAmount,
      gateway: gateway || 'EasyPaisa',
      accountNumber,
      accountTitle,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString()
    };

    const transactions = user.transactions || [];
    transactions.unshift(newTrx);

    dbNode.updateUser(userId, { balance: newBalance, transactions });
    
    return res.status(201).json({ message: 'Withdrawal locked. Payout sync in progress.', user: { ...user, balance: newBalance } });
  },

  getMyTransactions: async (req: any, res: any) => {
    const { userId } = req?.query || {};
    if (!userId) return res.status(400).json({ message: "Auth required" });
    
    const user = dbNode.findUserById(userId);

    if (!user) return res.status(404).json({ message: "Node missing." });
    return res.status(200).json(user.transactions || []);
  }
};