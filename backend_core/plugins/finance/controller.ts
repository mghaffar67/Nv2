
import { distributeCommission } from '../../utils/commissionHelper';

const getDB = () => JSON.parse(localStorage.getItem('noor_mock_db') || '[]');
const saveDB = (db: any[]) => localStorage.setItem('noor_mock_db', JSON.stringify(db));

const PLAN_REGISTRY: Record<string, { id: string, price: number, name: string, validityDays: number }> = {
  'basic': { id: 'basic', price: 500, name: 'BASIC', validityDays: 30 },
  'standard': { id: 'standard', price: 1000, name: 'STANDARD', validityDays: 30 },
  'gold': { id: 'gold', price: 1500, name: 'GOLD ELITE', validityDays: 30 },
  'diamond': { id: 'diamond', price: 5000, name: 'DIAMOND', validityDays: 30 }
};

export const financePluginController = {
  activatePlan: async (req: any, res: any) => {
    const { planId } = req.body;
    const user = req.user;
    let db = getDB();

    const plan = PLAN_REGISTRY[planId.toLowerCase()];
    if (!plan) return res.status(404).json({ message: "Plan not found." });

    const userIndex = db.findIndex((u: any) => u.id === user.id);
    const currentUser = db[userIndex];

    if ((currentUser.balance || 0) < plan.price) {
      return res.status(400).json({ message: "Insufficient Balance. Please Deposit." });
    }

    // 1. Process Deduction
    currentUser.balance -= plan.price;
    currentUser.currentPlan = plan.name;
    
    // 2. Set Expiry correctly
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + plan.validityDays);
    currentUser.planExpiry = expiry.toISOString();

    // 3. Log Activation Transaction
    const activationTrx = {
      id: `PLN-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      userId: user.id,
      type: 'plan_activation',
      amount: plan.price,
      status: 'approved',
      gateway: 'Wallet Payment',
      details: `Activated ${plan.name} Plan`,
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString()
    };

    if (!currentUser.transactions) currentUser.transactions = [];
    currentUser.transactions.unshift(activationTrx);

    // 4. Persistence
    db[userIndex] = currentUser;
    saveDB(db);
    localStorage.setItem('noor_user', JSON.stringify({ ...currentUser, password: undefined }));

    // 5. Distribute Commissions Asynchronously
    distributeCommission(user.id, plan.price).catch(console.error);

    return res.status(200).json({ 
      success: true, 
      message: "Plan Activated Successfully! 🚀",
      user: { ...currentUser, password: undefined }
    });
  },

  depositReq: async (req: any, res: any) => {
    const { amount, method, trxId, senderNumber } = req.body;
    const user = req.user; 
    let db = getDB();
    const proofImage = req.file ? req.file.path : (req.body.image || 'no_proof');
    if (!amount || amount < 100) return res.status(400).json({ message: 'Min 100 PKR' });
    const newTransaction = {
      id: `TRX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      userId: user.id, type: 'deposit', amount: Number(amount),
      method: method || 'EasyPaisa', trxId, senderNumber, proofImage, status: 'pending',
      date: new Date().toISOString().split('T')[0], timestamp: new Date().toISOString()
    };
    const userIndex = db.findIndex((u: any) => u.id === user.id);
    if (!db[userIndex].transactions) db[userIndex].transactions = [];
    db[userIndex].transactions.unshift(newTransaction);
    saveDB(db);
    return res.status(201).json({ success: true, message: 'Deposit packet deployed.', transaction: newTransaction });
  },

  withdrawReq: async (req: any, res: any) => {
    const { amount, method, accountNumber, accountTitle } = req.body;
    const user = req.user;
    let db = getDB();
    const userIndex = db.findIndex((u: any) => u.id === user.id);
    const currentUser = db[userIndex];
    if (amount < 500) return res.status(400).json({ message: 'Min 500 PKR' });
    if (currentUser.balance < amount) return res.status(400).json({ message: 'Insufficient funds' });
    currentUser.balance -= Number(amount);
    const newTransaction = {
      id: `WD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      userId: user.id, type: 'withdraw', amount: Number(amount), method, status: 'pending',
      details: { accountNumber, accountTitle }, date: new Date().toISOString().split('T')[0], timestamp: new Date().toISOString()
    };
    currentUser.transactions.unshift(newTransaction);
    saveDB(db);
    localStorage.setItem('noor_user', JSON.stringify({ ...currentUser, password: undefined }));
    return res.status(201).json({ message: 'Withdrawal locked.', transaction: newTransaction });
  },

  getHistory: async (req: any, res: any) => {
    const user = req.user;
    const db = getDB();
    const currentUser = db.find((u: any) => u.id === user.id);
    return res.status(200).json(currentUser?.transactions || []);
  }
};
