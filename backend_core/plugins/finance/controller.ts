import { dbNode } from '../../utils/db';
import { distributeCommission } from '../../utils/commissionHelper';
/* Import planController to fix missing property activatePlan in financePluginController */
import { planController } from '../../controllers/planController';

export const financePluginController = {
  getHistory: async (req: any, res: any) => {
    try {
      const user = await dbNode.findUserById(req.user.id);
      if (!user) return res.status(404).json({ message: "Account lost." });
      
      const history = typeof user.transactions === 'string' 
        ? JSON.parse(user.transactions) 
        : (user.transactions || []);
        
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
        id: `DEP-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        userId: user.id,
        type: 'deposit',
        amount: Number(amount),
        gateway: method,
        trxId,
        senderNumber,
        proofImage: image || null,
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString()
      };

      const currentTrx = Array.isArray(user.transactions) 
        ? user.transactions 
        : (typeof user.transactions === 'string' ? JSON.parse(user.transactions) : []);
      
      currentTrx.unshift(depositPacket);
      
      await dbNode.updateUser(user.id, { 
        transactions: currentTrx 
      });

      return res.status(201).json({ 
        success: true, 
        message: 'Deposit synced to ledger.', 
        transaction: depositPacket 
      });
    } catch (err) {
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
        id: `WD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        userId: user.id,
        type: 'withdraw',
        amount: amt,
        gateway,
        accountNumber,
        accountTitle,
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString()
      };

      const currentTrx = Array.isArray(user.transactions) 
        ? user.transactions 
        : (typeof user.transactions === 'string' ? JSON.parse(user.transactions) : []);
        
      currentTrx.unshift(newTrx);
      
      await dbNode.updateUser(user.id, { 
        balance: Number(user.balance) - amt, 
        transactions: currentTrx 
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