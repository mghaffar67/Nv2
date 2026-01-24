
import { dbNode } from '../../utils/db';

export const authPluginController = {
  login: async (req: any, res: any) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ message: 'Missing credentials.' });

      const user = dbNode.findUserByIdentifier(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid ID ya password.' });
      }
      
      if (user.isBanned) return res.status(403).json({ message: 'Account Suspended.' });

      const { password: _, ...sessionUser } = user;
      return res.status(200).json({
        success: true,
        token: `jwt-noor-${user.id}-${Date.now()}`,
        user: sessionUser
      });
    } catch (err) {
      return res.status(500).json({ message: 'Auth Node Error.' });
    }
  },

  register: async (req: any, res: any) => {
    try {
      const { name, email, phone, password, referralCode } = req.body;
      if (dbNode.findUserByIdentifier(email) || dbNode.findUserByIdentifier(phone)) {
        return res.status(400).json({ message: 'Email/Phone pehle se registered hai.' });
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
        workSubmissions: [],
        purchaseHistory: [],
        streak: 0,
        createdAt: new Date().toISOString()
      };

      const users = dbNode.getUsers();
      users.push(newUser);
      dbNode.saveUsers(users);

      const { password: _, ...safeUser } = newUser;
      return res.status(201).json({ token: `jwt-noor-${newUser.id}-${Date.now()}`, user: safeUser });
    } catch (err) {
      return res.status(500).json({ message: "Registry creation failed." });
    }
  },

  getMe: async (req: any, res: any) => {
    const user = dbNode.findUserById(req.user.id);
    if (!user) return res.status(404).json({ message: "Node lost." });
    const { password: _, ...safe } = user;
    return res.status(200).json({ user: safe });
  },

  // Added updateProfile to handle identity updates and avatar uploads
  updateProfile: async (req: any, res: any) => {
    try {
      const { name, phone } = req.body;
      const userId = req.user.id;
      const user = dbNode.findUserById(userId);
      if (!user) return res.status(404).json({ message: "User not found." });

      const updates: any = {};
      if (name) updates.name = name;
      if (phone) updates.phone = phone;
      if (req.file) updates.avatar = req.file.path;

      dbNode.updateUser(userId, updates);
      return res.status(200).json({ success: true, message: "Profile updated successfully." });
    } catch (err) {
      return res.status(500).json({ message: "Identity sync failed." });
    }
  },

  // Added changePassword to handle security key updates
  changePassword: async (req: any, res: any) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const userId = req.user.id;
      const user = dbNode.findUserById(userId);
      if (!user) return res.status(404).json({ message: "User not found." });

      if (user.password !== oldPassword) {
        return res.status(400).json({ message: "Current security key is incorrect." });
      }

      dbNode.updateUser(userId, { password: newPassword });
      return res.status(200).json({ success: true, message: "Security key updated successfully." });
    } catch (err) {
      return res.status(500).json({ message: "Security update node failed." });
    }
  },

  getTeam: async (req: any, res: any) => {
    const user = dbNode.findUserById(req.user.id);
    if (!user) return res.status(404).json({ message: "Identity node missing." });

    const all = dbNode.getUsers();
    const t1 = all.filter((u: any) => u.referredBy === user.referralCode);
    const t1Codes = t1.map((u: any) => u.referralCode);
    const t2 = all.filter((u: any) => t1Codes.includes(u.referredBy));
    const t2Codes = t2.map((u: any) => u.referralCode);
    const t3 = all.filter((u: any) => t2Codes.includes(u.referredBy));

    const sanitize = (l: any[]) => l.map(u => ({ id: u.id, name: u.name, currentPlan: u.currentPlan }));
    return res.status(200).json({ t1: sanitize(t1), t2: sanitize(t2), t3: sanitize(t3) });
  }
};
