
import { dbNode } from '../utils/db';
import { distributeCommission } from '../utils/commissionHelper';

const PLAN_PRICES: Record<string, number> = {
  'BASIC': 500,
  'STANDARD': 1000,
  'GOLD ELITE': 1500,
  'DIAMOND': 5000
};

export const planController = {
  requestPlanPurchase: async (req: any, res: any) => {
    try {
      const { userId, planId, method, trxId, proofImage, senderNumber } = req.body;
      const user = dbNode.findUserById(userId);

      if (!user) return res.status(404).json({ message: 'User account not found.' });
      
      const normalizedId = planId.replace(' PLAN', '').toUpperCase();
      const price = PLAN_PRICES[normalizedId] || 0;

      if (method === 'wallet') {
        const currentBalance = Number(user.balance) || 0;
        if (currentBalance < price) {
          return res.status(400).json({ message: 'Insufficient account balance.' });
        }

        const newBalance = currentBalance - price;
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);

        const purchaseRecord = {
          id: `PH-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          planId: normalizedId,
          amount: price,
          method: 'wallet',
          status: 'active',
          date: new Date().toISOString()
        };

        const history = user.purchaseHistory || [];
        history.unshift(purchaseRecord);

        dbNode.updateUser(userId, { 
          balance: newBalance, 
          currentPlan: normalizedId, 
          planExpiry: expiryDate.toISOString(),
          purchaseHistory: history
        });

        distributeCommission(userId, price);

        return res.status(200).json({ message: 'Plan activated successfully.', user });
      }

      if (method === 'direct') {
        if (!trxId || (!proofImage && !req.body.proofImage)) {
          return res.status(400).json({ message: 'Transaction details and proof are required.' });
        }

        const requestRecord = {
          id: `REQ-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          planId: normalizedId,
          amount: price,
          method: 'direct',
          status: 'pending',
          trxId,
          senderNumber,
          proofImage: proofImage || req.body.proofImage,
          date: new Date().toISOString()
        };

        const history = user.purchaseHistory || [];
        history.unshift(requestRecord);

        dbNode.updateUser(userId, { purchaseHistory: history });
        return res.status(201).json({ message: 'Activation request submitted for approval.' });
      }

      return res.status(400).json({ message: 'Invalid activation method selected.' });
    } catch (err) {
      console.error("Plan Controller Error:", err);
      return res.status(500).json({ message: "Internal server error during plan activation." });
    }
  }
};
