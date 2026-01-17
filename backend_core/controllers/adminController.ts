
const getMockDB = () => {
  const data = localStorage.getItem('noor_mock_db');
  return data ? JSON.parse(data) : [];
};

const saveToMockDB = (db: any[]) => {
  localStorage.setItem('noor_mock_db', JSON.stringify(db));
};

export const adminController = {
  // Returns a simple list of partners for targeting dropdowns
  getPartnerList: async (req: any, res: any) => {
    const db = getMockDB();
    const partners = db.map((u: any) => ({ 
      id: u.id, 
      name: u.name, 
      phone: u.phone 
    }));
    return res.status(200).json(partners);
  },

  getAllUsers: async (req: any, res: any) => {
    const db = getMockDB();
    const sortedUsers = [...db].sort((a: any, b: any) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });
    return res.status(200).json(sortedUsers);
  },

  getDashboardStats: async (req: any, res: any) => {
    const db = getMockDB();
    const todayStr = new Date().toISOString().split('T')[0];

    let pendingWithdrawals = 0;
    let pendingDeposits = 0;
    let totalCashDisbursed = 0;
    let totalRevenue = 0;
    let recentLogs: any[] = [];
    
    db.forEach((user: any) => {
      if (user.transactions) {
        user.transactions.forEach((t: any) => {
          if (t.type === 'withdraw' && t.status === 'pending') pendingWithdrawals++;
          if (t.type === 'deposit' && t.status === 'pending') pendingDeposits++;
          if (t.type === 'withdraw' && t.status === 'approved') totalCashDisbursed += Number(t.amount);
          if (t.type === 'deposit' && t.status === 'approved') totalRevenue += Number(t.amount);
          
          recentLogs.push({
            id: t.id,
            userName: user.name,
            type: t.type,
            amount: t.amount,
            status: t.status,
            date: t.date,
            timestamp: t.timestamp
          });
        });
      }
    });

    recentLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const stats = {
      totalActivePartners: db.length,
      totalCapitalPool: db.reduce((acc: number, u: any) => acc + (u.balance || 0), 0),
      pendingWithdrawals,
      pendingDeposits,
      totalCashDisbursed,
      totalRevenue,
      todayActiveUsers: db.filter((u: any) => u.lastCheckIn?.startsWith(todayStr)).length,
      recentLogs: recentLogs.slice(0, 10) 
    };

    return res.status(200).json(stats);
  },

  editUserBalance: async (req: any, res: any) => {
    const { userId, amount, action } = req.body; 
    let db = getMockDB();
    const userIndex = db.findIndex((u: any) => u.id === userId);
    if (userIndex === -1) return res.status(404).json({ message: "User not found" });

    const user = db[userIndex];
    if (action === 'add') {
      user.balance += Number(amount);
    } else {
      user.balance -= Number(amount);
    }

    db[userIndex] = user;
    saveToMockDB(db);
    return res.status(200).json({ success: true, newBalance: user.balance });
  },

  // Added missing loginAsUser method to support admin impersonation API route and resolve reference error
  loginAsUser: async (req: any, res: any) => {
    const { userId } = req.body;
    const db = getMockDB();
    const user = db.find((u: any) => u.id === userId);
    
    if (user) {
      return res.status(200).json({
        success: true,
        token: `impersonate-mock-${user.id}`,
        user: { ...user, password: undefined, isImpersonated: true }
      });
    }
    return res.status(404).json({ message: 'User not found for impersonation.' });
  }
};
