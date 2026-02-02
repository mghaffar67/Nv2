
import { dbNode } from '../../utils/db';
import { distributeCommission } from '../../utils/commissionHelper';

/**
 * Noor Official V3 - Advanced Financial Controller
 * Consolidated activation logic for high-speed ledger sync.
 */
export const financePluginController = {
  getHistory: async (req: any, res: any) => {
    try {
      // Add await to fix Promise property access error
      const user = await dbNode.findUserById(req.user.id);
      if (!user) return res.status(404).json({ message: "Identity node lost." });
      
      // Fix property access on Promise
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
    // Add await to fix Promise property access error
    const user = await dbNode.findUserById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Identity missing.' });

    const newTrx = {
      // Fix property access on Promise
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

    // Fix property access on Promise
    const trx = user.transactions || [];
    trx.unshift(newTrx);
    // Fix property access on Promise
    await dbNode.updateUser(user.id, { transactions: trx });
    return res.status(201).json({ success: true, message: 'Deposit packet submitted.', transaction: newTrx });
  },

  withdrawReq: async (req: any, res: any) => {
    const { amount, gateway, accountNumber, accountTitle } = req.body;
    // Add await to fix Promise property access error
    const user = await dbNode.findUserById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Auth session expired.' });

    const amt = Number(amount);
    // Add await to fix Promise property access error
    const config = await dbNode.getConfig();
    // Fix property access on Promise
    const minLimit = config.financeSettings.minWithdraw || 500;
    const maxLimit = config.financeSettings.maxWithdraw || 50000;

    if (amt < minLimit) return res.status(400).json({ message: `Minimum withdrawal is PKR ${minLimit}.` });
    if (amt > maxLimit) return res.status(400).json({ message: `Maximum withdrawal is PKR ${maxLimit}.` });
    // Fix property access on Promise
    if ((user.balance || 0) < amt) return res.status(400).json({ message: 'Insufficient liquidity in wallet.' });

    const newTrx = {
      // Fix property access on Promise
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

    // Fix property access on Promise
    const newBalance = user.balance - amt;
    // Fix property access on Promise
    const trx = user.transactions || [];
    trx.unshift(newTrx);
    
    // Fix property access on Promise
    await dbNode.updateUser(user.id, { balance: newBalance, transactions: trx });
    return res.status(201).json({ success: true, message: 'Withdrawal request locked.', newBalance });
  },

  activatePlan: async (req: any, res: any) => {
    try {
      const { planId, method, trxId, proofImage, senderNumber } = req.body;
      // Add await to fix Promise property access error
      const user = await dbNode.findUserById(req.user.id);
      if (!user) return res.status(404).json({ message: "User not found." });

      const priceMap: Record<string, number> = { 
        'BASIC': 500, 
        'STANDARD': 1000, 
        'GOLD ELITE': 1500, 
        'DIAMOND': 5000 
      };
      
      const normalized = planId.replace(' PLAN', '').toUpperCase();
      const price = priceMap[normalized] || 0;

      if (method === 'wallet') {
        // Fix property access on Promise
        const currentBalance = Number(user.balance) || 0;
        if (currentBalance < price) return res.status(400).json({ message: "Insufficient account balance." });
        
        const newBalance = currentBalance - price;
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 30);

        const purchaseRecord = {
          id: `PH-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          planId: normalized,
          amount: price,
          method: 'wallet',
          status: 'active',
          date: new Date().toISOString()
        };

        // Fix property access on Promise
        const history = user.purchaseHistory || [];
        history.unshift(purchaseRecord);

        // Fix property access on Promise
        await dbNode.updateUser(user.id, { 
          balance: newBalance, 
          currentPlan: normalized, 
          planExpiry: expiry.toISOString(), 
          purchaseHistory: history 
        });

        // Referral commission logic
        // Fix property access on Promise
        await distributeCommission(user.id, price);
        
        return res.status(200).json({ 
          success: true, 
          message: "Station Activated Successfully.",
          config: await dbNode.getConfig()
        });
      }

      if (method === 'direct') {
        if (!trxId || !proofImage) {
          return res.status(400).json({ message: "Audit Protocol: TRX ID and Screenshot required." });
        }

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

        // Fix property access on Promise
        const history = user.purchaseHistory || [];
        history.unshift(requestRecord);

        // Fix property access on Promise
        await dbNode.updateUser(user.id, { purchaseHistory: history });
        return res.status(201).json({ 
          success: true, 
          message: "Activation packet submitted for audit." 
        });
      }

      return res.status(400).json({ message: "Invalid activation protocol." });
    } catch (err) {
      return res.status(500).json({ message: "Internal server error during activation." });
    }
  }
};
