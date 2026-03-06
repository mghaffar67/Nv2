import { dbNode } from '../../utils/db';
import { planController } from '../../controllers/planController';

export const financePluginController = {
  getHistory: async (req: any, res: any) => {
    try {
      const history = await dbNode.getUserTransactions(req.user.id);
      return res.status(200).json(history);
    } catch (err) {
      return res.status(500).json({ message: "Failed to load history." });
    }
  },

  depositReq: async (req: any, res: any) => {
    try {
      const { amount, method, trxId, senderNumber, image } = req.body;
      const user = await dbNode.findUserById(req.user.id);
      if (!user) return res.status(404).json({ message: 'Identity missing.' });

      const depositPacket = {
        userId: user.id,
        type: 'deposit',
        amount: Number(amount),
        gateway: method,
        trxId,
        senderNumber,
        proofImage: image || null,
        status: 'pending',
        adminNote: ''
      };

      const transaction = await dbNode.createTransaction(depositPacket);

      return res.status(201).json({ 
        success: true, 
        message: 'Deposit synced to ledger.', 
        transaction 
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Ledger writing failed." });
    }
  },

  withdrawReq: async (req: any, res: any) => {
    try {
      const { amount, gateway, accountNumber, accountTitle } = req.body;
      const user = await dbNode.findUserById(req.user.id);
      if (!user) return res.status(404).json({ message: 'Auth expired.' });

      const amt = Number(amount);
      if (Number(user.balance) < amt) return res.status(400).json({ message: 'Insufficient balance.' });

      const newTrx = {
        userId: user.id,
        type: 'withdraw',
        amount: amt,
        gateway,
        accountNumber,
        accountTitle,
        status: 'pending',
        adminNote: ''
      };

      // Create transaction
      await dbNode.createTransaction(newTrx);
      
      // Deduct balance immediately
      await dbNode.updateUser(user.id, { 
        balance: Number(user.balance) - amt
      });

      return res.status(201).json({ success: true, message: 'Withdrawal locked.' });
    } catch (err) {
      return res.status(500).json({ message: "Withdrawal node failed." });
    }
  },

  // Added activatePlan to resolve property existence error in finance routes
  activatePlan: async (req: any, res: any) => {
    try {
      // Inject user ID from auth middleware for the plan controller requirement
      req.body.userId = req.user.id;
      return planController.requestPlanPurchase(req, res);
    } catch (err) {
      return res.status(500).json({ message: "Plan activation node failed." });
    }
  }
};