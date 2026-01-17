
import { generateRefCode } from '../models/User';

const getMockDB = () => {
  const data = localStorage.getItem('noor_mock_db');
  if (!data) {
    const seedUsers = [
      { 
        id: 'admin-1', 
        name: 'Super Admin', 
        email: 'admin@noor.com', 
        password: 'admin123', 
        role: 'admin', 
        balance: 500000, 
        phone: '03000000000', 
        currentPlan: 'DIAMOND', 
        streak: 0, 
        lastCheckIn: null, 
        transactions: [], 
        referralCode: 'ADM-0001', 
        referredBy: null, 
        createdAt: new Date().toISOString() 
      },
      { 
        id: 'user-1', 
        name: 'Demo Partner', 
        email: 'user@noor.com', 
        password: 'user123', 
        role: 'user', 
        balance: 1500, 
        phone: '03123456789', 
        currentPlan: 'BASIC', 
        streak: 3, 
        lastCheckIn: null, 
        transactions: [], 
        referralCode: 'USR-7788', 
        referredBy: 'ADM-0001', 
        createdAt: new Date().toISOString() 
      }
    ];
    localStorage.setItem('noor_mock_db', JSON.stringify(seedUsers));
    return seedUsers;
  }
  return JSON.parse(data);
};

const saveToMockDB = (db: any[]) => {
  localStorage.setItem('noor_mock_db', JSON.stringify(db));
};

export const authController = {
  login: async (req: any, res: any) => {
    const { email, password } = req.body;
    const db = getMockDB();
    
    // Support login via either Email or Phone number
    const user = db.find((u: any) => 
      (u.email === email || u.phone === email) && u.password === password
    );
    
    if (user) {
      if (user.isBanned) return res.status(403).json({ message: 'Account Suspended.' });
      return res.status(200).json({
        token: `jwt-noor-${user.id}`,
        user: { ...user, password: undefined }
      });
    }
    return res.status(401).json({ message: 'Invalid credentials.' });
  },

  register: async (req: any, res: any) => {
    const { name, email, phone, password, referralCode: invitedByCode } = req.body;
    const db = getMockDB();

    if (db.some((u: any) => u.email === email)) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name, 
      email, 
      phone, 
      password, 
      role: 'user',
      balance: 0,
      depositBalance: 0,
      currentPlan: 'None',
      planExpiry: null,
      referralCode: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      referredBy: invitedByCode || null,
      isBanned: false,
      createdAt: new Date().toISOString(),
      transactions: [],
      purchaseHistory: [],
      workSubmissions: [],
      streak: 0,
      lastCheckIn: null,
      withdrawalInfo: { provider: '', accountNumber: '', accountTitle: '' }
    };

    db.push(newUser);
    saveToMockDB(db);

    return res.status(201).json({ 
      message: 'ID Created. Welcome to Noor Official!',
      token: `jwt-noor-${newUser.id}`,
      user: { ...newUser, password: undefined }
    });
  }
};
