
import { dbRegistry } from '../../utils/db';

export const authPluginController = {
  login: async (req: any, res: any) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ 
          success: false, 
          message: 'Identity and security key required.' 
        });
      }

      // High-speed lookup using normalized identity node
      const user = dbRegistry.findUserByIdentifier(email);

      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: 'This identity is not registered in our core.' 
        });
      }

      // Constant time comparison (simulated)
      if (user.password !== password) {
        return res.status(401).json({ 
          success: false, 
          message: 'Security key mismatch. Check your credentials.' 
        });
      }
      
      if (user.isBanned) {
        return res.status(403).json({ 
          success: false, 
          message: 'Account restricted due to protocol violation.' 
        });
      }

      // Generate secure packet
      const { password: _, ...sessionUser } = user;

      console.log(`✅ Auth Sync: ${user.name} logged in successfully.`);

      return res.status(200).json({
        success: true,
        token: `jwt-noor-${user.id}-${Date.now()}`,
        user: sessionUser
      });
    } catch (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'System Node Failure during authentication.' 
      });
    }
  },

  register: async (req: any, res: any) => {
    try {
      const { name, email, phone, password, referralCode } = req.body;
      let users = dbRegistry.getUsers();

      if (dbRegistry.findUserByIdentifier(email) || dbRegistry.findUserByIdentifier(phone)) {
        return res.status(400).json({ message: 'This Email or Phone is already synchronized with another node.' });
      }

      const newUser = {
        id: `USR-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        name, email, phone, password,
        role: 'user',
        balance: 0,
        currentPlan: 'None',
        referralCode: `REF-${Math.floor(100000 + Math.random() * 800000)}`,
        referredBy: referralCode || null,
        transactions: [],
        streak: 0,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      dbRegistry.saveUsers(users);

      const { password: _, ...safeUser } = newUser;
      return res.status(201).json({ 
        token: `jwt-noor-${newUser.id}-${Date.now()}`, 
        user: safeUser 
      });
    } catch (err) {
      return res.status(500).json({ message: "Registry error." });
    }
  },

  getMe: async (req: any, res: any) => {
    const user = dbRegistry.findUserById(req.user.id);
    if (!user) return res.status(404).json({ message: "Session expired." });
    const { password: _, ...safeUser } = user;
    return res.status(200).json({ user: safeUser });
  },

  updateProfile: async (req: any, res: any) => {
    try {
      const { name, phone } = req.body;
      const updatedUser = dbRegistry.updateUser(req.user.id, { name, phone });
      if (!updatedUser) return res.status(404).json({ message: "Identity not found." });
      return res.status(200).json({ user: updatedUser });
    } catch (err) {
      return res.status(500).json({ message: "Failed to sync profile changes." });
    }
  },

  changePassword: async (req: any, res: any) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const user = dbRegistry.findUserById(req.user.id);
      if (user.password !== oldPassword) return res.status(400).json({ message: "Current password mismatch." });
      dbRegistry.updateUser(user.id, { password: newPassword });
      return res.status(200).json({ message: "Password synchronized." });
    } catch (err) {
      return res.status(500).json({ message: "Security update failed." });
    }
  },

  getTeam: async (req: any, res: any) => {
    try {
      const user = dbRegistry.findUserById(req.user.id);
      const allUsers = dbRegistry.getUsers();
      const t1 = allUsers.filter((u: any) => u.referredBy === user.referralCode);
      return res.status(200).json({ t1, t2: [], t3: [] });
    } catch (err) {
      return res.status(500).json({ message: "Network Hub sync failed." });
    }
  }
};
