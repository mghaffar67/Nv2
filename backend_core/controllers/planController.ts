
const getMockDB = () => {
  const data = localStorage.getItem('noor_mock_db');
  return data ? JSON.parse(data) : [];
};

const saveToMockDB = (db: any[]) => {
  localStorage.setItem('noor_mock_db', JSON.stringify(db));
};

const getConfig = () => {
  const data = localStorage.getItem('noor_config');
  return data ? JSON.parse(data) : null;
};

// Commission logic: Recursive upline rewards
const distributeCommission = (db: any[], startUser: any, amount: number) => {
  const config = getConfig();
  if (!config) return;

  const tiers = [
    { percent: config.referralSettings.level1Percent, level: 1 },
    { percent: config.referralSettings.level2Percent, level: 2 },
    { percent: config.referralSettings.level3Percent, level: 3 }
  ];

  let currentUplineCode = startUser.referredBy;

  for (const tier of tiers) {
    if (!currentUplineCode) break;

    const uplineIndex = db.findIndex(u => u.referralCode === currentUplineCode);
    if (uplineIndex === -1) break;

    const uplineUser = db[uplineIndex];
    const commission = (amount * tier.percent) / 100;

    // Credit Upline
    uplineUser.balance = (uplineUser.balance || 0) + commission;
    
    // Log Commission Transaction
    if (!uplineUser.transactions) uplineUser.transactions = [];
    uplineUser.transactions.unshift({
      id: `COM-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      type: 'reward',
      amount: commission,
      status: 'approved',
      gateway: `Team L${tier.level} Bonus`,
      note: `Commission from ${startUser.name}'s upgrade`,
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString()
    });

    currentUplineCode = uplineUser.referredBy;
  }
};

const PLAN_PRICES: Record<string, number> = {
  'BASIC': 500,
  'STANDARD': 1000,
  'GOLD ELITE': 1500,
  'DIAMOND': 5000
};

export const planController = {
  requestPlanPurchase: async (req: any, res: any) => {
    const { userId, planId, method, trxId, proofImage, senderNumber } = req.body;
    let db = getMockDB();
    const userIndex = db.findIndex((u: any) => u.id === userId);

    if (userIndex === -1) return res.status(404).json({ message: 'User not found' });
    const user = db[userIndex];
    
    const normalizedId = planId.replace(' PLAN', '').toUpperCase();
    const price = PLAN_PRICES[normalizedId] || 0;

    if (method === 'wallet') {
      if ((user.balance || 0) < price) {
        return res.status(400).json({ message: 'Insufficient wallet balance.' });
      }

      user.balance = (user.balance || 0) - price;
      user.currentPlan = normalizedId;
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      user.planExpiry = expiryDate.toISOString();

      if (!user.purchaseHistory) user.purchaseHistory = [];
      user.purchaseHistory.unshift({
        id: Math.random().toString(36).substr(2, 9).toUpperCase(),
        planId: normalizedId,
        amount: price,
        method: 'wallet',
        status: 'active',
        date: new Date().toISOString()
      });

      // Distribute Network Commissions
      distributeCommission(db, user, price);

      db[userIndex] = user;
      saveToMockDB(db);
      localStorage.setItem('noor_user', JSON.stringify(user));
      return res.status(200).json({ message: 'Station Upgraded & Commissions Paid!', user });
    }

    if (method === 'direct') {
      if (!trxId || !proofImage) {
        return res.status(400).json({ message: 'TRX ID and Proof Screenshot are required.' });
      }

      if (!user.purchaseHistory) user.purchaseHistory = [];
      user.purchaseHistory.unshift({
        id: `REQ-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        planId: normalizedId,
        amount: price,
        method: 'direct',
        status: 'pending',
        trxId,
        senderNumber,
        proofImage,
        date: new Date().toISOString()
      });

      db[userIndex] = user;
      saveToMockDB(db);
      localStorage.setItem('noor_user', JSON.stringify(user));
      return res.status(201).json({ message: 'Activation request submitted for audit!' });
    }

    return res.status(400).json({ message: 'Invalid activation method.' });
  }
};
