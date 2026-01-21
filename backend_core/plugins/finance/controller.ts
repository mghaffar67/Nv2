
import { dbRegistry } from '../../utils/db';
import { distributeCommission } from '../../utils/commissionHelper';

export const financePluginController = {
  depositReq: async (req: any, res: any) => {
    const { amount, method, trxId, senderNumber } = req.body;
    const user = dbRegistry.findUserById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Auth session lost.' });

    const newTrx = {
      id: `TRX-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      type: 'deposit',
      amount: Number(amount),
      gateway: method || 'EasyPaisa',
      trxId,
      senderNumber,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString()
    };

    const transactions = user.transactions || [];
    transactions.unshift(newTrx);
    dbRegistry.updateUser(user.id, { transactions });

    return res.status(201).json({ success: true, message: 'Deposit filed. Verification pending.' });
  },

  withdrawReq: async (req: any, res: any) => {
    const { amount, method, accountNumber, accountTitle } = req.body;
    const user = dbRegistry.findUserById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Auth session lost.' });

    const amt = Number(amount);
    if (user.balance < amt) return res.status(400).json({ message: 'Insufficient liquidity.' });

    const newBalance = user.balance - amt;
    const newTrx = {
      id: `WD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      type: 'withdraw',
      amount: amt,
      gateway: method,
      status: 'pending',
      accountNumber,
      accountTitle,
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString()
    };

    const transactions = user.transactions || [];
    transactions.unshift(newTrx);
    dbRegistry.updateUser(user.id, { balance: newBalance, transactions });

    return res.status(201).json({ message: 'Withdrawal locked. Syncing with registry.' });
  },

  getHistory: async (req: any, res: any) => {
    if (!req.user) return res.status(401).json({ message: "Identity missing." });
    const user = dbRegistry.findUserById(req.user.id);
    if (!user) return res.status(404).json({ message: "Identity Station missing." });
    
    const history = (user.transactions || []).sort((a: any, b: any) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    return res.status(200).json(history);
  },

  activatePlan: async (req: any, res: any) => {
    const { planId } = req.body;
    const user = dbRegistry.findUserById(req.user.id);
    if (!user) return res.status(404).json({ message: "Auth session lost." });

    const PLAN_PRICES: Record<string, number> = {
      'BASIC': 500,
      'STANDARD': 1000,
      'GOLD ELITE': 1500,
      'DIAMOND': 5000
    };

    const normalizedPlanId = planId.toUpperCase().replace(' PLAN', '');
    const price = PLAN_PRICES[normalizedPlanId] || 0;
    const currentPlanPrice = PLAN_PRICES[user.currentPlan || ''] || 0;

    let newBalance = user.balance;

    if (user.currentPlan && user.currentPlan !== 'None' && price < currentPlanPrice) {
      const refund = currentPlanPrice - price;
      newBalance += refund;
      
      const refundTrx = {
        id: `REF-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
        type: 'reward',
        amount: refund,
        status: 'approved',
        gateway: 'Station Downgrade Refund',
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString()
      };
      const transactions = user.transactions || [];
      transactions.unshift(refundTrx);
      dbRegistry.updateUser(user.id, { transactions });
    } else {
      if (user.balance < price) {
        return res.status(400).json({ message: "Insufficient liquidity for upgrade." });
      }
      newBalance -= price;
    }

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    const purchase = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      planId: normalizedPlanId,
      amount: price,
      method: 'wallet',
      status: 'active',
      date: new Date().toISOString()
    };

    const purchaseHistory = user.purchaseHistory || [];
    purchaseHistory.unshift(purchase);

    dbRegistry.updateUser(user.id, {
      balance: newBalance,
      currentPlan: normalizedPlanId,
      planExpiry: expiryDate.toISOString(),
      purchaseHistory
    });
    
    if (price > currentPlanPrice) {
      await distributeCommission(user.id, price - currentPlanPrice);
    }
    
    return res.status(200).json({ success: true, message: `${normalizedPlanId} Station Active.`, newBalance });
  }
};
