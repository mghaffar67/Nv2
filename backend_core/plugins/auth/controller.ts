
/**
 * Noor Official V3 - Auth Controller
 * Handles account lifecycle and network statistics.
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
      name, email, phone, password,
      role: 'user',
      balance: 0,
      depositBalance: 0,
      currentPlan: 'None',
      referralCode: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      referredBy: referralCode || null,
      isBanned: false,
      avatar: null,
      createdAt: new Date().toISOString(),
      transactions: [],
      streak: 0,
      completedTasksToday: [],
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
    const user = db.find((u: any) => (u.email === email || u.phone === email) && u.password === password);

    if (!user) return res.status(401).json({ message: 'Invalid credentials.' });
    if (user.isBanned) return res.status(403).json({ message: 'Access denied.' });

    return res.status(200).json({
      token: `jwt-noor-${user.id}`,
      user: { ...user, password: undefined }
    });
  },

  getMe: async (req: any, res: any) => {
    const db = getDB();
    const freshUser = db.find((u: any) => u.id === req.user.id);
    if (!freshUser) return res.status(404).json({ message: "Identity missing." });
    return res.status(200).json({ user: { ...freshUser, password: undefined } });
  },

  updateProfile: async (req: any, res: any) => {
    const { name, phone } = req.body;
    const user = req.user;
    let db = getDB();
    const userIndex = db.findIndex((u: any) => u.id === user.id);

    if (userIndex === -1) return res.status(404).json({ message: "User not found." });

    const currentUser = db[userIndex];
    if (name) currentUser.name = name;
    if (phone) currentUser.phone = phone;
    
    if (req.file) {
      currentUser.avatar = req.file.path;
    }

    db[userIndex] = currentUser;
    saveDB(db);
    localStorage.setItem('noor_user', JSON.stringify({ ...currentUser, password: undefined }));

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: { ...currentUser, password: undefined }
    });
  },

  changePassword: async (req: any, res: any) => {
    const { oldPassword, newPassword } = req.body;
    const user = req.user;
    let db = getDB();
    const userIndex = db.findIndex((u: any) => u.id === user.id);

    if (userIndex === -1) return res.status(404).json({ message: "User not found." });

    const currentUser = db[userIndex];
    
    // In mock, passwords are plain text. In real apps, use bcrypt.compare
    if (currentUser.password !== oldPassword) {
      return res.status(400).json({ message: "Incorrect current password." });
    }

    currentUser.password = newPassword;
    db[userIndex] = currentUser;
    saveDB(db);

    return res.status(200).json({
      success: true,
      message: "Password changed successfully."
    });
  },

  getTeam: async (req: any, res: any) => {
    const user = req.user;
    const db = getDB();
    
    const transactions = user.transactions || [];
    const referralBonuses = transactions.filter((t: any) => t.gateway === 'Network Reward');
    const totalCommission = referralBonuses.reduce((acc: number, curr: any) => acc + (Number(curr.amount) || 0), 0);

    const level1 = db.filter((u: any) => u.referredBy === user.referralCode);
    const level1Codes = level1.map((u: any) => u.referralCode);
    
    const level2 = db.filter((u: any) => level1Codes.includes(u.referredBy));
    const level2Codes = level2.map((u: any) => u.referralCode);
    
    const level3 = db.filter((u: any) => level2Codes.includes(u.referredBy));

    return res.status(200).json({
      totalCommission,
      totalMembers: level1.length + level2.length + level3.length,
      t1: level1.map((u: any) => ({ id: u.id, name: u.name, createdAt: u.createdAt, currentPlan: u.currentPlan })),
      t2: level2.map((u: any) => ({ id: u.id, name: u.name, createdAt: u.createdAt, currentPlan: u.currentPlan })),
      t3: level3.map((u: any) => ({ id: u.id, name: u.name, createdAt: u.createdAt, currentPlan: u.currentPlan }))
    });
  }
};
