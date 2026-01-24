
import { dbNode } from '../../utils/db';
import { distributeCommission } from '../../utils/commissionHelper';

export const financePluginController = {
  getHistory: async (req: any, res: any) => {
    try {
      const user = dbNode.findUserById(req.user.id);
      if (!user) return res.status(404).json({ message: "Identity node lost." });
      
      const history = (user.transactions || []).map((t: any) => {
        let context = "";
        if (t.type === 'withdraw') {
          const last4 = t.accountNumber ? t.accountNumber.slice(-4) : "****";
          context = `${t.gateway} (****${last4})`;
        } else if (t.type === 'deposit') {
          context = `via ${t.gateway}`;
        } else {
          context = t.note || "System Yield";
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
    if (!user) return res.status(404).json({ message: 'Identity missing.' });

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
    return res.status(201).json({ success: true, message: 'Deposit packet submitted.', transaction: newTrx });
  },

  withdrawReq: async (req: any, res: any) => {
    const { amount, gateway, accountNumber, accountTitle } = req.body;
    const user = dbNode.findUserById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Auth session expired.' });

    const amt = Number(amount);
    const config = dbNode.getConfig();
    const minLimit = config.financeSettings.minWithdraw || 500;
    const maxLimit = config.financeSettings.maxWithdraw || 50000;

    // Hardened Security Validation
    if (amt < minLimit) return res.status(400).json({ message: `Minimum withdrawal is PKR ${minLimit}.` });
    if (amt > maxLimit) return res.status(400).json({ message: `Maximum withdrawal is PKR ${maxLimit}.` });
    if ((user.balance || 0) < amt) return res.status(400).json({ message: 'Insufficient liquidity in wallet.' });

    const newTrx = {
      id: `WD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
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

    // Atomic Deduct
    const newBalance = user.balance - amt;
    const trx = user.transactions || [];
    trx.unshift(newTrx);
    
    dbNode.updateUser(user.id, { balance: newBalance, transactions: trx });
    return res.status(201).json({ success: true, message: 'Withdrawal request locked.', newBalance });
  },

  activatePlan: async (req: any, res: any) => {
    const { planId, method } = req.body;
    const user = dbNode.findUserById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found." });

    const priceMap: Record<string, number> = { 'BASIC': 500, 'STANDARD': 1000, 'GOLD ELITE': 1500, 'DIAMOND': 5000 };
    const normalized = planId.replace(' PLAN', '').toUpperCase();
    const price = priceMap[normalized] || 0;

    if (method === 'wallet') {
      if ((user.balance || 0) < price) return res.status(400).json({ message: "Low balance." });
      
      const newBalance = (user.balance || 0) - price;
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 30);

      const history = user.purchaseHistory || [];
      history.unshift({ id: Date.now().toString(), planId: normalized, amount: price, method: 'wallet', status: 'active', date: new Date().toISOString() });

      dbNode.updateUser(user.id, { balance: newBalance, currentPlan: normalized, planExpiry: expiry.toISOString(), purchaseHistory: history });
      distributeCommission(user.id, price);
      return res.status(200).json({ success: true, message: "Station Activated." });
    }
    return res.status(400).json({ message: "Invalid method." });
  }
};
