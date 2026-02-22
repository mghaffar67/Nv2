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
      // Fix: Added await to async db call
      const user = await dbNode.findUserById(userId);

      if (!user) return res.status(404).json({ message: 'User account not found.' });
      
      const normalizedId = planId.replace(' PLAN', '').toUpperCase();
      const price = PLAN_PRICES[normalizedId] || 0;

      if (method === 'wallet') {
        // Fix: Property access on awaited object
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

        // Capture the updated user object
        // Fix: Added await to async db call
        const updatedUser = await dbNode.updateUser(userId, { 
          balance: newBalance, 
          currentPlan: normalizedId, 
          planExpiry: expiryDate.toISOString(),
          purchaseHistory: history,
          completedTasksToday: [] // Reset daily limits for new plan
        });

        distributeCommission(userId, price);

        return res.status(200).json({ 
          success: true,
          message: 'Plan activated successfully.', 
          user: updatedUser 
        });
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

        // Fix: Added await to async db call
        await dbNode.updateUser(userId, { purchaseHistory: history });
        return res.status(201).json({ success: true, message: 'Activation request submitted for approval.' });
      }

      return res.status(400).json({ message: 'Invalid activation method selected.' });
    } catch (err) {
      console.error("Plan Controller Error:", err);
      return res.status(500).json({ message: "Internal server error during plan activation." });
    }
  }
};