
import { dbRegistry } from '../../utils/db';

export const authPluginController = {
  login: async (req: any, res: any) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'ID aur Password likhna zaroori hai.' });
      }

      const user = dbRegistry.findUserByIdentifier(email);

      if (!user || user.password !== password) {
        return res.status(401).json({ success: false, message: 'Ghalat details! Dobara check karen.' });
      }
      
      if (user.isBanned) {
        return res.status(403).json({ success: false, message: 'Aap ka account suspend kar diya gaya hai.' });
      }

      const { password: _, ...sessionUser } = user;
      const timestamp = Date.now();

      return res.status(200).json({
        success: true,
        token: `jwt-noor-${user.id}-${timestamp}`,
        user: sessionUser
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'System Error: Authentication node down.' });
    }
  },

  register: async (req: any, res: any) => {
    try {
      const { name, email, phone, password, referralCode } = req.body;
      
      if (dbRegistry.findUserByIdentifier(email) || dbRegistry.findUserByIdentifier(phone)) {
        return res.status(400).json({ success: false, message: 'Ye Email ya Phone pehle se registered hai.' });
      }

      const newUser = {
        id: `USR-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        name, email, phone, password,
        role: 'user',
        balance: 0,
        currentPlan: 'None',
        referralCode: `REF-${Math.floor(100000 + Math.random() * 800000)}`,
        referredBy: referralCode || null,
        transactions: [],
        completedTasksToday: [],
        streak: 0,
        createdAt: new Date().toISOString()
      };

      const users = dbRegistry.getUsers();
      users.push(newUser);
      dbRegistry.saveUsers(users);

      const { password: _, ...safeUser } = newUser;
      return res.status(201).json({ 
        success: true,
        token: `jwt-noor-${newUser.id}-${Date.now()}`, 
        user: safeUser 
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: "Registry update failed." });
    }
  },

  getMe: async (req: any, res: any) => {
    const user = dbRegistry.findUserById(req.user.id);
    if (!user) return res.status(404).json({ message: "User session lost." });
    const { password: _, ...safeUser } = user;
    return res.status(200).json({ user: safeUser });
  },

  // Fix: Added missing updateProfile method to handle user profile modifications
  updateProfile: async (req: any, res: any) => {
    try {
      const { name, phone } = req.body;
      const updates: any = {};
      if (name) updates.name = name;
      if (phone) updates.phone = phone;
      if (req.file) updates.avatar = req.file.path;

      const user = dbRegistry.updateUser(req.user.id, updates);
      if (!user) return res.status(404).json({ message: "User identity node not found" });

      return res.status(200).json({ success: true, message: "Profile synchronized successfully", user });
    } catch (err) {
      return res.status(500).json({ message: "Internal update failure" });
    }
  },

  // Fix: Added missing changePassword method for user security updates
  changePassword: async (req: any, res: any) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const user = dbRegistry.findUserById(req.user.id);

      if (!user || user.password !== oldPassword) {
        return res.status(400).json({ message: "Ghalat purana password" });
      }

      dbRegistry.updateUser(user.id, { password: newPassword });
      return res.status(200).json({ success: true, message: "Naya password set kar diya gaya hai" });
    } catch (err) {
      return res.status(500).json({ message: "Security update error" });
    }
  },

  // Fix: Added missing getTeam method to calculate and return 3-tier referral hierarchy
  getTeam: async (req: any, res: any) => {
    try {
      const user = dbRegistry.findUserById(req.user.id);
      if (!user) return res.status(404).json({ message: "Auth node session lost" });

      const allUsers = dbRegistry.getUsers();
      
      const t1 = allUsers.filter((u: any) => u.referredBy === user.referralCode);
      const t1Codes = t1.map((u: any) => u.referralCode);
      const t2 = allUsers.filter((u: any) => t1Codes.includes(u.referredBy));
      const t2Codes = t2.map((u: any) => u.referralCode);
      const t3 = allUsers.filter((u: any) => t2Codes.includes(u.referredBy));

      const sanitize = (list: any[]) => list.map(u => ({
        id: u.id,
        name: u.name,
        currentPlan: u.currentPlan,
        createdAt: u.createdAt
      }));

      return res.status(200).json({
        t1: sanitize(t1),
        t2: sanitize(t2),
        t3: sanitize(t3)
      });
    } catch (err) {
      return res.status(500).json({ message: "Team hierarchy sync failed" });
    }
  }
};
