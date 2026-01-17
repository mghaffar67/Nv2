
/**
 * Noor Official V3 - Auth Controller
 * Handles account lifecycle and secure entry.
 */
const getDB = () => JSON.parse(localStorage.getItem('noor_mock_db') || '[]');
const saveDB = (db: any[]) => localStorage.setItem('noor_mock_db', JSON.stringify(db));

export const authPluginController = {
  register: async (req: any, res: any) => {
    const { name, email, phone, password, referralCode } = req.body;
    let db = getDB();

    if (db.some((u: any) => u.email === email)) {
      return res.status(400).json({ message: 'Email address already in use.' });
    }

    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      phone,
      password, // In production, use: await bcrypt.hash(password, 10)
      role: 'user',
      balance: 0,
      depositBalance: 0,
      currentPlan: 'None',
      referralCode: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      referredBy: referralCode || null,
      isBanned: false,
      createdAt: new Date().toISOString(),
      transactions: [],
      streak: 0,
      withdrawalInfo: { provider: '', accountNumber: '', accountTitle: '' }
    };

    db.push(newUser);
    saveDB(db);

    return res.status(201).json({
      message: 'Account provisioned successfully.',
      token: `jwt-noor-${newUser.id}`,
      user: { ...newUser, password: undefined }
    });
  },

  login: async (req: any, res: any) => {
    const { email, password } = req.body;
    const db = getDB();
    
    // Checks for either email or phone for accessibility
    const user = db.find((u: any) => (u.email === email || u.phone === email) && u.password === password);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials. Please verify your data.' });
    }

    if (user.isBanned) {
      return res.status(403).json({ message: 'Access denied. Account is suspended.' });
    }

    return res.status(200).json({
      token: `jwt-noor-${user.id}`,
      user: { ...user, password: undefined }
    });
  },

  getMe: async (req: any, res: any) => {
    // req.user is hydrated by authMiddleware
    return res.status(200).json({
      user: { ...req.user, password: undefined }
    });
  }
};
