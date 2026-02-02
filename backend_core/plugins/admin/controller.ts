
import { dbNode } from '../../utils/db';

export const adminPluginController = {
  getPendingStats: async (req: any, res: any) => {
    try {
      const users = await dbNode.getUsers();
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

      return res.status(200).json({ deposits, withdrawals, total: deposits + withdrawals });
    } catch (e) {
      return res.status(500).json({ message: "Audit failed." });
    }
  },

  getAllUsers: async (req: any, res: any) => {
    try {
        const users = await dbNode.getUsers();
        const safeUsers = users.map((u: any) => {
            const { password, ...safe } = u;
            return safe;
        });
        return res.status(200).json(safeUsers);
    } catch (e) {
        return res.status(500).json({ message: "Identity registry inaccessible." });
    }
  },

  updateUser: async (req: any, res: any) => {
      try {
          const { id, ...updates } = req.body;
          if (!id) return res.status(400).json({ message: "Missing User Identity." });
          const result = await dbNode.updateUser(id, updates);
          return res.status(200).json({ success: true, user: result });
      } catch (e) {
          return res.status(500).json({ message: "Registry update failed." });
      }
  },

  deleteUser: async (req: any, res: any) => {
    try {
      const { id } = req.params;
      await dbNode.deleteUser(id);
      return res.status(200).json({ success: true, message: "Node removed." });
    } catch (e) {
      return res.status(500).json({ message: "Registry deletion failed." });
    }
  },

  processRequestAction: async (req: any, res: any) => {
    const { transactionId, userId, action, type, reason } = req.body;
    try {
      const user = await dbNode.findUserById(userId);
      if (!user) return res.status(404).json({ message: "Member node missing." });

      const trxIndex = (user.transactions || []).findIndex((t: any) => t.id === transactionId);
      if (trxIndex === -1) return res.status(404).json({ message: "Voucher missing." });

      const transaction = user.transactions[trxIndex];
      if (transaction.status !== 'pending') return res.status(400).json({ message: "Processed already." });

      const amount = Number(transaction.amount);

      if (action === 'approve') {
        transaction.status = 'approved';
        transaction.processedAt = new Date().toISOString();
        if (type === 'deposit') user.balance = (Number(user.balance) || 0) + amount;
      } else {
        transaction.status = 'rejected';
        transaction.adminNote = reason || "Data Discrepancy";
        if (type === 'withdraw') user.balance = (Number(user.balance) || 0) + amount;
      }

      await dbNode.updateUser(userId, { balance: user.balance, transactions: user.transactions });
      return res.status(200).json({ success: true, message: "Ledger Synced." });
    } catch (err) {
      return res.status(500).json({ message: "Process error." });
    }
  }
};
