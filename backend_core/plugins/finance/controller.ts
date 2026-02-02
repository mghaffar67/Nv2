import { dbNode } from '../../utils/db';
import { distributeCommission } from '../../utils/commissionHelper';

/**
 * Noor Official V3 - Advanced Financial Controller
 * Implementation of Atomic Payout Locking
 */
export const financePluginController = {
  getHistory: async (req: any, res: any) => {
    try {
      const user = dbNode.findUserById(req.user.id);
      if (!user) return res.status(404).json({ message: "Account context lost." });
      
      const history = (user.transactions || []).map((t: any) => {
        let context = "";
        if (t.type === 'withdraw') {
          const last4 = t.accountNumber ? t.accountNumber.slice(-4) : "****";
          context = `${t.gateway} (****${last4})`;
        } else if (t.type === 'deposit') {
          context = `via ${t.gateway}`;
        } else {
          context = t.note || "Bonus System";
        }
        return { ...t, displayContext: context };
      });

      return res.status(200).json(history);
    } catch (err) {
      return res.status(500).json({ message: "Registry sync failure." });
    }
  },

  depositReq: async (req: any, res: any) => {
    const { amount, method, trxId, senderNumber, image } = req.body;
    const user = dbNode.findUserById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Account context missing.' });

    const newTrx = {
      id: `DEP-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      userId: user.id,
      type: 'deposit',
      amount: Number(amount),
      gateway: method,
      trxId,
      senderNumber,
      proofImage: image,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString()
    };

    const trx = user.transactions || [];
    trx.unshift(newTrx);
    dbNode.updateUser(user.id, { transactions: trx });
    return res.status(201).json({ success: true, message: 'Deposit request submitted.', transaction: newTrx });
  },

  withdrawReq: async (req: any, res: any) => {
    const { amount, gateway, accountNumber, accountTitle } = req.body;
    const user = dbNode.findUserById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Auth session expired.' });

    const amt = Number(amount);
    const config = dbNode.getConfig();
    const minLimit = config.financeSettings.minWithdraw || 500;

    // 1. Validation Logic
    if (amt < minLimit) return res.status(400).json({ message: `Minimum withdrawal Rs. ${minLimit} hai.` });
    if (amt > (user.balance || 0)) return res.status(400).json({ message: 'Wallet mein balance kam hai.' });

    // 2. ATOMIC LOCK: Deduct balance immediately
    const updatedBalance = (Number(user.balance) || 0) - amt;

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

    const trx = user.transactions || [];
    trx.unshift(newTrx);
    
    // Sync User Identity with deducted balance
    dbNode.updateUser(user.id, { 
      balance: updatedBalance, 
      transactions: trx 
    });

    return res.status(201).json({ 
      success: true, 
      message: 'Withdrawal locked. Funds deducted for audit.', 
      newBalance: updatedBalance,
      transaction: newTrx 
    });
  },

  activatePlan: async (req: any, res: any) => {
    try {
      const { planId, method, trxId, proofImage, senderNumber } = req.body;
      const user = dbNode.findUserById(req.user.id);
      if (!user) return res.status(404).json({ message: "User not found." });

      const plansRegistry = JSON.parse(localStorage.getItem('noor_plans_registry') || '[]');
      const purchasedPlan = plansRegistry.find((p: any) => p.name === planId.toUpperCase());
      
      if (!purchasedPlan) return res.status(400).json({ message: "Invalid Plan." });
      
      const price = purchasedPlan.price;

      if (method === 'wallet') {
        const currentBalance = Number(user.balance) || 0;
        if (currentBalance < price) {
          return res.status(400).json({ message: "Balance kam hai." });
        }
        
        const newBalance = currentBalance - price;
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + (purchasedPlan.validityDays || 365));

        const purchaseRecord = {
          id: `PH-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          planId: purchasedPlan.name,
          amount: price,
          method: 'wallet',
          status: 'active',
          date: new Date().toISOString()
        };

        const history = user.purchaseHistory || [];
        history.unshift(purchaseRecord);

        dbNode.updateUser(user.id, { 
          balance: newBalance, 
          currentPlan: purchasedPlan.name, 
          planExpiry: expiry.toISOString(), 
          purchaseHistory: history 
        });

        distributeCommission(user.id, purchasedPlan.name);
        
        return res.status(200).json({ 
          success: true, 
          message: `${purchasedPlan.name} Station Active!`,
          config: dbNode.getConfig()
        });
      }

      if (method === 'direct') {
        const requestRecord = {
          id: `REQ-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          planId: purchasedPlan.name,
          amount: price,
          method: 'direct',
          status: 'pending',
          trxId,
          senderNumber,
          proofImage,
          date: new Date().toISOString()
        };
        const history = user.purchaseHistory || [];
        history.unshift(requestRecord);
        dbNode.updateUser(user.id, { purchaseHistory: history });
        return res.status(201).json({ success: true, message: "Request Submitted." });
      }
      return res.status(400).json({ message: "Invalid Protocol." });
    } catch (err) {
      return res.status(500).json({ message: "Activation Error." });
    }
  }
};