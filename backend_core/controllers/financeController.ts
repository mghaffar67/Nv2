
const getMockDB = () => {
  const data = localStorage.getItem('noor_mock_db');
  return data ? JSON.parse(data) : [];
};

const saveToMockDB = (db: any[]) => {
  localStorage.setItem('noor_mock_db', JSON.stringify(db));
};

export const financeController = {
  // Fetch all transactions of type 'deposit' across all users
  getAllDeposits: async (req: any, res: any) => {
    const db = getMockDB();
    let allDeposits: any[] = [];

    db.forEach((user: any) => {
      if (user.transactions) {
        const userDeposits = user.transactions
          .filter((t: any) => t.type === 'deposit')
          .map((t: any) => ({
            ...t,
            userName: user.name,
            userPhone: user.phone,
            userId: user.id,
            // Ensure fields mapped from user.transactions are explicitly preserved if needed
            // though ...t already covers them
            gateway: t.gateway || t.method 
          }));
        allDeposits = [...allDeposits, ...userDeposits];
      }
    });

    allDeposits.sort((a, b) => {
      if (a.status === 'pending' && b.status !== 'pending') return -1;
      if (a.status !== 'pending' && b.status === 'pending') return 1;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    return res.status(200).json(allDeposits);
  },

  approveDeposit: async (req: any, res: any) => {
    const { transactionId, userId } = req.body;
    let db = getMockDB();
    
    const userIndex = db.findIndex((u: any) => u.id === userId);
    if (userIndex === -1) return res.status(404).json({ message: "User not found" });

    const user = db[userIndex];
    const trxIndex = user.transactions.findIndex((t: any) => t.id === transactionId);
    
    if (trxIndex === -1) return res.status(404).json({ message: "Transaction record not found" });

    const transaction = user.transactions[trxIndex];

    if (transaction.status !== 'pending') {
      return res.status(400).json({ message: "Security Alert: This transaction is already processed." });
    }

    transaction.status = 'approved';
    transaction.processedAt = new Date().toISOString();
    
    user.balance = (user.balance || 0) + Number(transaction.amount);
    user.depositBalance = (user.depositBalance || 0) + Number(transaction.amount);

    db[userIndex] = user;
    saveToMockDB(db);

    return res.status(200).json({ 
      message: `Deposit approved. Balance updated for ${user.name}.`,
      newBalance: user.balance 
    });
  },

  rejectDeposit: async (req: any, res: any) => {
    const { transactionId, userId, reason } = req.body;
    let db = getMockDB();

    const userIndex = db.findIndex((u: any) => u.id === userId);
    if (userIndex === -1) return res.status(404).json({ message: "User not found" });

    const user = db[userIndex];
    const trxIndex = user.transactions.findIndex((t: any) => t.id === transactionId);
    
    if (trxIndex === -1) return res.status(404).json({ message: "Transaction record not found" });

    const transaction = user.transactions[trxIndex];

    if (transaction.status !== 'pending') {
      return res.status(400).json({ message: "Only pending transactions can be rejected." });
    }

    transaction.status = 'rejected';
    transaction.adminRemark = reason || "Invalid transaction details or proof.";
    transaction.processedAt = new Date().toISOString();

    db[userIndex] = user;
    saveToMockDB(db);

    return res.status(200).json({ message: "Deposit request rejected." });
  },

  getAllWithdrawals: async (req: any, res: any) => {
    const db = getMockDB();
    let allWithdrawals: any[] = [];

    db.forEach((user: any) => {
      if (user.transactions) {
        const userWds = user.transactions
          .filter((t: any) => t.type === 'withdraw')
          .map((t: any) => ({
            ...t,
            userName: user.name,
            userPhone: user.phone,
            userId: user.id,
            gateway: t.gateway || t.method
          }));
        allWithdrawals = [...allWithdrawals, ...userWds];
      }
    });

    allWithdrawals.sort((a, b) => {
      if (a.status === 'pending' && b.status !== 'pending') return -1;
      if (a.status !== 'pending' && b.status === 'pending') return 1;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    return res.status(200).json(allWithdrawals);
  },

  approveWithdrawal: async (req: any, res: any) => {
    const { transactionId, userId } = req.body;
    let db = getMockDB();
    
    const userIndex = db.findIndex((u: any) => u.id === userId);
    if (userIndex === -1) return res.status(404).json({ message: "Target user for payout not found." });

    const user = db[userIndex];
    const trxIndex = user.transactions.findIndex((t: any) => t.id === transactionId);
    
    if (trxIndex === -1) return res.status(404).json({ message: "Withdrawal record missing in ledger." });

    const transaction = user.transactions[trxIndex];

    if (transaction.status !== 'pending') {
      return res.status(400).json({ message: "Critical Alert: Withdrawal already finalized." });
    }

    // Finalize payment state
    transaction.status = 'approved';
    transaction.processedAt = new Date().toISOString();
    
    db[userIndex] = user;
    saveToMockDB(db);

    return res.status(200).json({ message: "Withdrawal marked as PAID. Records updated." });
  },

  rejectWithdrawal: async (req: any, res: any) => {
    const { transactionId, userId, reason } = req.body;
    let db = getMockDB();

    const userIndex = db.findIndex((u: any) => u.id === userId);
    if (userIndex === -1) return res.status(404).json({ message: "User not found." });

    const user = db[userIndex];
    const trxIndex = user.transactions.findIndex((t: any) => t.id === transactionId);
    
    if (trxIndex === -1) return res.status(404).json({ message: "Withdrawal record missing." });

    const transaction = user.transactions[trxIndex];

    if (transaction.status !== 'pending') {
      return res.status(400).json({ message: "Already processed or cancelled." });
    }

    // ROBUST REFUND LOGIC: Re-credit the exact amount deducted
    const refundAmount = Number(transaction.amount);
    user.balance = (user.balance || 0) + refundAmount;
    
    transaction.status = 'rejected';
    transaction.adminRemark = reason || "Withdrawal declined by risk management.";
    transaction.processedAt = new Date().toISOString();

    // Create a refund event for visibility
    const refundEvent = {
      id: `REF-${transactionId.split('-')[1] || Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      type: 'reward',
      amount: refundAmount,
      status: 'approved',
      gateway: 'System Refund',
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString(),
      note: `Refund for rejected payout: ${transactionId}`
    };
    
    if (!user.transactions) user.transactions = [];
    user.transactions.unshift(refundEvent);

    db[userIndex] = user;
    saveToMockDB(db);

    return res.status(200).json({ message: "Payout rejected. PKR " + refundAmount + " has been auto-refunded to user wallet." });
  }
};
