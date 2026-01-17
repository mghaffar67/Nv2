
/**
 * Noor Official V3 - Finance Controller
 * Manages the flow of capital within the platform.
 */

const getDB = () => JSON.parse(localStorage.getItem('noor_mock_db') || '[]');
const saveDB = (db: any[]) => localStorage.setItem('noor_mock_db', JSON.stringify(db));

export const financePluginController = {
  /**
   * Request a Deposit
   * Status defaults to 'pending' awaiting admin audit.
   * Consolidates logic from route to ensure data persistence.
   */
  depositReq: async (req: any, res: any) => {
    const { amount, method, trxId, senderNumber } = req.body;
    const user = req.user; // Populated by authMiddleware
    let db = getDB();

    // Use req.file.path if provided by upload middleware, fallback to body.image
    const proofImage = req.file ? req.file.path : (req.body.image || 'no_proof_attached');

    if (!amount || amount < 100) {
      return res.status(400).json({ message: 'Minimum deposit amount is PKR 100.' });
    }

    if (!proofImage || !trxId) {
      return res.status(400).json({ message: 'Transaction ID and Proof Screenshot are mandatory.' });
    }

    const newTransaction = {
      id: `TRX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      userId: user.id,
      type: 'deposit',
      amount: Number(amount),
      method: method || 'EasyPaisa', // Gateway
      trxId: trxId,
      senderNumber: senderNumber,
      proofImage: proofImage,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString()
    };

    const userIndex = db.findIndex((u: any) => u.id === user.id);
    if (userIndex === -1) {
      return res.status(404).json({ message: "Identity node missing." });
    }

    if (!db[userIndex].transactions) db[userIndex].transactions = [];
    db[userIndex].transactions.unshift(newTransaction);

    saveDB(db);

    return res.status(201).json({
      success: true,
      message: 'Deposit packet deployed. Verification in progress.',
      transaction: newTransaction
    });
  },

  /**
   * Request a Withdrawal
   * CRITICAL: Deducts balance immediately to prevent double-spend.
   */
  withdrawReq: async (req: any, res: any) => {
    const { amount, method, accountNumber, accountTitle } = req.body;
    const user = req.user;
    let db = getDB();

    const userIndex = db.findIndex((u: any) => u.id === user.id);
    const currentUser = db[userIndex];

    if (amount < 500) {
      return res.status(400).json({ message: 'Minimum withdrawal is PKR 500.' });
    }

    if (currentUser.balance < amount) {
      return res.status(400).json({ message: 'Insufficient liquidity in account node.' });
    }

    // 1. Lock funds immediately
    currentUser.balance -= Number(amount);

    // 2. Create ledger entry
    const newTransaction = {
      id: `WD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      userId: user.id,
      type: 'withdraw',
      amount: Number(amount),
      method: method,
      status: 'pending',
      details: {
        accountNumber,
        accountTitle
      },
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString()
    };

    if (!currentUser.transactions) currentUser.transactions = [];
    currentUser.transactions.unshift(newTransaction);

    db[userIndex] = currentUser;
    saveDB(db);

    // Sync session for frontend
    localStorage.setItem('noor_user', JSON.stringify({ ...currentUser, password: undefined }));

    return res.status(201).json({
      message: 'Withdrawal locked. Funds deducted. Payout is in the queue.',
      transaction: newTransaction
    });
  },

  /**
   * Get User Transaction History
   * Returns last 20 entries for performance.
   */
  getHistory: async (req: any, res: any) => {
    const user = req.user;
    const db = getDB();
    const currentUser = db.find((u: any) => u.id === user.id);

    if (!currentUser) {
      return res.status(404).json({ message: 'Ledger not found for this identity.' });
    }

    const history = (currentUser.transactions || []).slice(0, 20);

    return res.status(200).json(history);
  }
};
