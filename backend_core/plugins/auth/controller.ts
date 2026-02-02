
import { dbNode } from '../../utils/db';

export const authPluginController = {
  login: async (req: any, res: any) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ message: 'Missing credentials.' });

      // Add await to fix Promise property access error
      const user = await dbNode.findUserByIdentifier(email);
      // Fix property access on Promise
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid ID ya password.' });
      }
      
      // Fix property access on Promise
      if (user.isBanned) return res.status(403).json({ message: 'Account Suspended.' });

      // Fix property access on Promise
      const { password: _, ...sessionUser } = user;
      return res.status(200).json({
        success: true,
        // Fix property access on Promise
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
      // Add missing awaits to fix Promise check error
      if (await dbNode.findUserByIdentifier(email) || await dbNode.findUserByIdentifier(phone)) {
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

      // Add await to fix push on Promise error
      const users = await dbNode.getUsers();
      users.push(newUser);
      // Fix argument type error
      await dbNode.saveUsers(users);

      const { password: _, ...safeUser } = newUser;
      return res.status(201).json({ token: `jwt-noor-${newUser.id}-${Date.now()}`, user: safeUser });
    } catch (err) {
      return res.status(500).json({ message: "Registry creation failed." });
    }
  },

  getMe: async (req: any, res: any) => {
    // Add await to fix Promise property access error
    const user = await dbNode.findUserById(req.user.id);
    if (!user) return res.status(404).json({ message: "Node lost." });
    // Fix property access on Promise
    const { password: _, ...safe } = user;
    return res.status(200).json({ user: safe });
  },

  updateProfile: async (req: any, res: any) => {
    try {
      const { name, phone } = req.body;
      const userId = req.user.id;
      // Add await to fix Promise property access error
      const user = await dbNode.findUserById(userId);
      if (!user) return res.status(404).json({ message: "User not found." });

      const updates: any = {};
      if (name) updates.name = name;
      if (phone) updates.phone = phone;
      if (req.file) updates.avatar = req.file.path;

      await dbNode.updateUser(userId, updates);
      return res.status(200).json({ success: true, message: "Profile updated successfully." });
    } catch (err) {
      return res.status(500).json({ message: "Identity sync failed." });
    }
  },

  changePassword: async (req: any, res: any) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const userId = req.user.id;
      // Add await to fix Promise property access error
      const user = await dbNode.findUserById(userId);
      if (!user) return res.status(404).json({ message: "User not found." });

      // Fix property access on Promise
      if (user.password !== oldPassword) {
        return res.status(400).json({ message: "Current security key is incorrect." });
      }

      await dbNode.updateUser(userId, { password: newPassword });
      return res.status(200).json({ success: true, message: "Security key updated successfully." });
    } catch (err) {
      return res.status(500).json({ message: "Security update node failed." });
    }
  },

  getTeam: async (req: any, res: any) => {
    // Add await to fix Promise property access error
    const user = await dbNode.findUserById(req.user.id);
    if (!user) return res.status(404).json({ message: "Identity node missing." });

    // Add await to fix Promise array method error
    const all = await dbNode.getUsers();
    
    // Level 1: Users referred directly by current user
    // Fix filter on Promise and property access on Promise
    const t1 = all.filter((u: any) => u.referredBy === user.referralCode);
    const t1Codes = t1.map((u: any) => u.referralCode);
    
    // Level 2: Users referred by Level 1 members
    // Fix filter on Promise
    const t2 = all.filter((u: any) => t1Codes.length > 0 && t1Codes.includes(u.referredBy));
    const t2Codes = t2.map((u: any) => u.referralCode);
    
    // Level 3: Users referred by Level 2 members
    // Fix filter on Promise
    const t3 = all.filter((u: any) => t2Codes.length > 0 && t2Codes.includes(u.referredBy));

    const sanitize = (l: any[]) => l.map(u => ({ id: u.id, name: u.name, currentPlan: u.currentPlan }));
    
    return res.status(200).json({ 
      t1: sanitize(t1), 
      t2: sanitize(t2), 
      t3: sanitize(t3) 
    });
  }
};
