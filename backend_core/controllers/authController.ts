
const DB_KEY = 'noor_mock_db';

const getMockDB = () => {
  const data = localStorage.getItem(DB_KEY);
  if (!data) {
    const today = new Date().toISOString().split('T')[0];
    const seedUsers = [
      { 
        id: 'ADM-1', name: 'Super Admin', email: 'admin@noor.com', password: 'admin123', role: 'admin', 
        balance: 500000, phone: '03000000000', currentPlan: 'DIAMOND', referralCode: 'NOOR-ADM', createdAt: new Date().toISOString(),
        transactions: []
      },
      { 
        id: 'USR-DEMO', name: 'Demo Partner', email: 'user@noor.com', password: 'user123', role: 'user', 
        balance: 25450, phone: '03123456789', currentPlan: 'GOLD ELITE', referralCode: 'USR-DEMO', referredBy: 'NOOR-ADM',
        streak: 5, lastCheckIn: new Date().toISOString(),
        transactions: [
          { id: 'TRX-1', type: 'reward', amount: 500, status: 'approved', gateway: 'Daily Task', date: today, timestamp: new Date().toISOString() },
          { id: 'TRX-2', type: 'withdraw', amount: 1500, status: 'approved', gateway: 'EasyPaisa', date: today, timestamp: new Date().toISOString() }
        ],
        createdAt: new Date().toISOString() 
      }
    ];
    localStorage.setItem(DB_KEY, JSON.stringify(seedUsers));
    return seedUsers;
  }
  return JSON.parse(data);
};

export const authController = {
  login: async (req: any, res: any) => {
    const { email, password } = req.body;
    const db = getMockDB();
    
    // Support both Email and Phone for login
    const user = db.find((u: any) => (u.email === email || u.phone === email) && u.password === password);
    
    if (user) {
      if (user.isBanned) return res.status(403).json({ message: 'Account Suspended.' });
      
      const sessionUser = { ...user, password: undefined };
      return res.status(200).json({ 
        token: `jwt-noor-${user.id}`, 
        user: sessionUser 
      });
    }
    return res.status(401).json({ message: 'Ghalat Email ya Password. Dobara check karen.' });
  },

  register: async (req: any, res: any) => {
    const { name, email, phone, password, referralCode } = req.body;
    const db = getMockDB();
    
    if (db.some((u: any) => u.email === email)) return res.status(400).json({ message: 'Ye Email pehle se registered hai.' });
    if (db.some((u: any) => u.phone === phone)) return res.status(400).json({ message: 'Ye Phone number pehle se istimal mein hai.' });
    
    const newUser = {
      id: `USR-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      name, email, phone, password, role: 'user', balance: 0, depositBalance: 0, currentPlan: 'None',
      referralCode: `REF-${Math.floor(1000 + Math.random() * 9000)}`, referredBy: referralCode || null,
      createdAt: new Date().toISOString(), transactions: [], streak: 0,
      withdrawalInfo: { provider: '', accountNumber: '', accountTitle: '' }
    };
    
    db.push(newUser);
    localStorage.setItem(DB_KEY, JSON.stringify(db));
    
    const sessionUser = { ...newUser, password: undefined };
    return res.status(201).json({ token: `jwt-noor-${newUser.id}`, user: sessionUser });
  }
};
