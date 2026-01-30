import { dbNode } from '../../utils/db';
import { distributeCommission } from '../../utils/commissionHelper';

/**
 * Noor Official V3 - Advanced Financial Controller
 */
export const financePluginController = {
  getHistory: async (req: any, res: any) => {
    try {
      const user = dbNode.findUserById(req.user.id);
      if (!user) return res.status(404).json({ message: "User account not found." });
      
      const history = (user.transactions || []).map((t: any) => {
        let context = "";
        if (t.type === 'withdraw') {
          const last4 = t.accountNumber ? t.accountNumber.slice(-4) : "****";
          context = `${t.gateway} (****${last4})`;
        } else if (t.type === 'deposit') {
          context = `via ${t.gateway}`;
        } else {
          context = t.note || "Earning";
        }
        return { ...t, displayContext: context };
      });

      return res.status(200).json(history);
    } catch (err) {
      return res.status(500).json({ message: "Failed to load history." });
    }
  },

  depositReq: async (req: any, res: any) => {
    const { amount, method, trxId, senderNumber, image } = req.body;
    const user = dbNode.findUserById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    // Aggressive data limitation for stability
    const truncatedImage = image && image.length > 2000 
      ? image.substring(0, 1000) + "...[TRUNCATED_FOR_STABILITY]" 
      : image;

    const newTrx = {
      id: `DEP-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      userId: user.id,
      type: 'deposit',
      amount: Number(amount),
      gateway: method,
      trxId,
      senderNumber,
      proofImage: truncatedImage,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString()
    };

    const trx = user.transactions || [];
    trx.unshift(newTrx);
    
    try {
      dbNode.updateUser(user.id, { transactions: trx });
    } catch (err) {
      return res.status(500).json({ message: "Registry capacity full. Submission aborted." });
    }
    
    return res.status(201).json({ success: true, message: 'Deposit request submitted.', transaction: newTrx });
  },

  withdrawReq: async (req: any, res: any) => {
    const { amount, gateway, accountNumber, accountTitle } = req.body;
    const user = dbNode.findUserById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Auth session expired.' });

    const amt = Number(amount);
    const config = dbNode.getConfig();
    const minLimit = config.financeSettings.minWithdraw || 500;
    const maxLimit = config.financeSettings.maxWithdraw || 50000;

    if (amt < minLimit) return res.status(400).json({ message: `Minimum withdrawal is PKR ${minLimit}.` });
    if (amt > maxLimit) return res.status(400).json({ message: `Maximum withdrawal is PKR ${maxLimit}.` });
    if ((user.balance || 0) < amt) return res.status(400).json({ message: 'Insufficient balance in wallet.' });

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

    const newBalance = (user.balance || 0) - amt;
    const trx = user.transactions || [];
    trx.unshift(newTrx);
    
    try {
      dbNode.updateUser(user.id, { balance: newBalance, transactions: trx });
    } catch (err) {
      return res.status(500).json({ message: "Registry error: Withdrawal failed." });
    }
    
    return res.status(201).json({ success: true, message: 'Withdrawal requested.', newBalance });
  },

  activatePlan: async (req: any, res: any) => {
    try {
      const { planId, method, trxId, proofImage, senderNumber } = req.body;
      const user = dbNode.findUserById(req.user.id);
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
        const currentBalance = Number(user.balance) || 0;
        if (currentBalance < price) return res.status(400).json({ message: "Insufficient balance." });
        
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

        const history = user.purchaseHistory || [];
        history.unshift(purchaseRecord);

        dbNode.updateUser(user.id, { 
          balance: newBalance, 
          currentPlan: normalized, 
          planExpiry: expiry.toISOString(), 
          purchaseHistory: history,
          completedTasksToday: []
        });

        distributeCommission(user.id, price);
        
        return res.status(200).json({ 
          success: true, 
          message: "Plan Activated Successfully!",
          config: dbNode.getConfig()
        });
      }

      if (method === 'direct') {
        if (!trxId || !proofImage) {
          return res.status(400).json({ message: "TRX ID and Screenshot are required." });
        }

        const truncatedProof = proofImage.length > 2000 
          ? proofImage.substring(0, 1000) + "...[TRUNCATED_FOR_STABILITY]" 
          : proofImage;

        const requestRecord = {
          id: `REQ-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          planId: normalized,
          amount: price,
          method: 'direct',
          status: 'pending',
          trxId,
          senderNumber,
          proofImage: truncatedProof,
          date: new Date().toISOString()
        };

        const history = user.purchaseHistory || [];
        history.unshift(requestRecord);

        dbNode.updateUser(user.id, { purchaseHistory: history });
        return res.status(201).json({ 
          success: true, 
          message: "Plan request submitted for approval." 
        });
      }

      return res.status(400).json({ message: "Invalid payment method." });
    } catch (err) {
      return res.status(500).json({ message: "Activation failed." });
    }
  }
};