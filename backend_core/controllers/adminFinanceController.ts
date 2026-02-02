import { dbNode } from '../utils/db';

export const adminFinanceController = {
  manageRequest: async (req: any, res: any) => {
    const { transactionId, userId, action, type } = req.body;
    // Added await to fix Promise property access error
    const user = await dbNode.findUserById(userId);
    if (!user) return res.status(404).json({ message: "Identity node missing." });

    // Fix property access on Promise
    const trxIndex = user.transactions.findIndex((t: any) => t.id === transactionId);
    if (trxIndex === -1) return res.status(404).json({ message: "Ledger entry missing." });

    // Fix property access on Promise
    const transaction = user.transactions[trxIndex];
    if (transaction.status !== 'pending') {
      return res.status(400).json({ message: "Packet already processed." });
    }

    if (type === 'deposit') {
      if (action === 'approve') {
        transaction.status = 'approved';
        // Fix property access on Promise
        user.balance = (Number(user.balance) || 0) + Number(transaction.amount);
      } else {
        transaction.status = 'rejected';
      }
    } else if (type === 'withdraw') {
      if (action === 'approve') {
        transaction.status = 'approved';
      } else {
        transaction.status = 'rejected';
        // REFUND logic: Re-credit user balance since it was locked on request
        // Fix property access on Promise
        user.balance = (Number(user.balance) || 0) + Number(transaction.amount);
      }
    }

    // Fix property access on Promise
    dbNode.updateUser(userId, { transactions: user.transactions, balance: user.balance });
    return res.status(200).json({ success: true, message: "Protocol synchronized." });
  }
};