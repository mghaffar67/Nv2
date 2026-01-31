import { dbNode } from '../../utils/db';
import { distributeCommission } from '../../utils/commissionHelper';

export const financePluginController = {
  getHistory: async (req: any, res: any) => {
    try {
      // Fix: Added await to async db call
      const user = await dbNode.findUserById(req.user.id);
      if (!user) return res.status(404).json({ message: "User account not found." });
      // Fix: Property access on awaited object
      return res.status(200).json(user.transactions || []);
    } catch (err) {
      return res.status(500).json({ message: "Failed to load history." });
    }
  },

  depositReq: async (req: any, res: any) => {
    const { amount, method, trxId, senderNumber, image } = req.body;
    const userId = req.user.id;
    // Fix: Added await to async db call
    const user = await dbNode.findUserById(userId);

    if (!user) return res.status(404).json({ message: 'User identity node not found.' });

    // FIX: Ensure proofImage handles null/empty and logs persistence
    const depositPacket = {
      id: `DEP-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      userId: userId,
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

    try {
      // Fix: Property access on awaited object
      const currentTrx = user.transactions || [];
      currentTrx.unshift(depositPacket);
      // Fix: Added await to async db call
      await dbNode.updateUser(userId, { transactions: currentTrx });
      return res.status(201).json({ success: true, message: 'Deposit request synchronized to ledger.', transaction: depositPacket });
    } catch (err: any) {
      console.error("Critical: Deposit persistence failed.", err.message);
      return res.status(500).json({ message: "Ledger writing failed. Try a smaller image." });
    }
  },

  withdrawReq: async (req: any, res: any) => {
    const { amount, gateway, accountNumber, accountTitle } = req.body;
    const userId = req.user.id;
    // Fix: Added await to async db call
    const user = await dbNode.findUserById(userId);
    if (!user) return res.status(404).json({ message: 'Auth session expired.' });

    const amt = Number(amount);
    // Fix: Property access on awaited object
    if ((user.balance || 0) < amt) return res.status(400).json({ message: 'Insufficient balance.' });

    const newTrx = {
      id: `WD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      userId,
      type: 'withdraw',
      amount: amt,
      gateway,
      accountNumber,
      accountTitle,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString()
    };

    // Fix: Property access on awaited object
    const newBalance = (user.balance || 0) - amt;
    const trx = user.transactions || [];
    trx.unshift(newTrx);
    
    // Fix: Added await to async db call
    await dbNode.updateUser(userId, { balance: newBalance, transactions: trx });
    return res.status(201).json({ success: true, message: 'Withdrawal locked.', newBalance });
  },

  activatePlan: async (req: any, res: any) => {
    try {
      const { planId, method, trxId, proofImage, senderNumber } = req.body;
      const userId = req.user.id;
      // Fix: Added await to async db call
      const user = await dbNode.findUserById(userId);
      if (!user) return res.status(404).json({ message: "User not found." });

      const priceMap: Record<string, number> = { 'BASIC': 500, 'STANDARD': 1000, 'GOLD ELITE': 1500, 'DIAMOND': 5000 };
      const normalized = planId.replace(' PLAN', '').toUpperCase();
      const price = priceMap[normalized] || 0;

      if (method === 'wallet') {
        // Fix: Property access on awaited object
        const newBalance = (Number(user.balance) || 0) - price;
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 30);

        // Fix: Added await to async db call
        const updatedUser = await dbNode.updateUser(userId, { 
          balance: newBalance, 
          currentPlan: normalized, 
          planExpiry: expiry.toISOString(),
          completedTasksToday: []
        });

        distributeCommission(userId, price);
        
        // FIX: Return POPULATED updated user details immediately
        return res.status(200).json({ 
          success: true, 
          message: "Node Level Upgraded!",
          user: updatedUser 
        });
      }

      // Direct payment flow
      const requestRecord = {
        id: `REQ-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        planId: normalized,
        amount: price,
        method: 'direct',
        status: 'pending',
        trxId,
        senderNumber,
        proofImage,
        date: new Date().toISOString()
      };
      // Fix: Property access on awaited object
      const history = user.purchaseHistory || [];
      history.unshift(requestRecord);
      // Fix: Added await to async db call
      await dbNode.updateUser(userId, { purchaseHistory: history });
      return res.status(201).json({ success: true, message: "Activation pending audit." });
    } catch (err) {
      return res.status(500).json({ message: "Activation failure." });
    }
  }
};