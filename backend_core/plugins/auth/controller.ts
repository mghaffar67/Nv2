import { dbNode } from '../../utils/db';

export const authPluginController = {
  login: async (req: any, res: any) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ message: 'Missing credentials.' });

      const user = await dbNode.findUserByIdentifier(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid ID ya password.' });
      }
      
      if (user.is_banned || user.isBanned) return res.status(403).json({ message: 'Account Suspended.' });

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
      
      const existing = await dbNode.findUserByIdentifier(email);
      if (existing) {
        return res.status(400).json({ message: 'Email/Phone pehle se registered hai.' });
      }

      const namePart = (name || 'USR').substring(0, 3).toUpperCase().replace(/\s/g, '');
      const uniqueSuffix = Math.floor(1000 + Math.random() * 8999);
      const generatedRef = `${namePart}-${uniqueSuffix}`;

      const newUser = {
        id: `USR-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        name, 
        email: email.toLowerCase(), 
        phone, 
        password,
        role: 'user',
        balance: 0,
        current_plan: 'None',
        referral_code: generatedRef,
        referred_by: referralCode?.trim() || null,
        transactions: JSON.stringify([]),
        work_submissions: JSON.stringify([]),
        purchase_history: JSON.stringify([]),
        streak: 0,
        created_at: new Date().toISOString()
      };

      await dbNode.saveUsers([newUser]);

      const { password: _, ...safeUser } = newUser;
      return res.status(201).json({ 
        token: `jwt-noor-${newUser.id}-${Date.now()}`, 
        user: safeUser 
      });
    } catch (err) {
      console.error("Reg Error:", err);
      return res.status(500).json({ message: "Registry creation failed." });
    }
  },

  getMe: async (req: any, res: any) => {
    const user = await dbNode.findUserById(req.user.id);
    if (!user) return res.status(404).json({ message: "Node lost." });
    const { password: _, ...safe } = user;
    return res.status(200).json({ user: safe });
  },

  updateProfile: async (req: any, res: any) => {
    try {
      const { name, phone } = req.body;
      const userId = req.user.id;
      
      const updates: any = {};
      if (name) updates.name = name;
      if (phone) updates.phone = phone;

      const updatedUser = await dbNode.updateUser(userId, updates);
      if (!updatedUser) return res.status(404).json({ message: "User not found." });
      
      // Ensure we return the user with sanitized properties for session update
      const freshUser = await dbNode.findUserById(userId);
      const { password: _, ...safeUser } = freshUser!;
      
      return res.status(200).json({ 
        success: true, 
        message: "Profile updated successfully.",
        user: safeUser
      });
    } catch (err) {
      return res.status(500).json({ message: "Identity sync failed." });
    }
  },

  changePassword: async (req: any, res: any) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const userId = req.user.id;
      const user = await dbNode.findUserById(userId);
      
      if (!user || user.password !== oldPassword) {
        return res.status(400).json({ message: "Current security key is incorrect." });
      }

      await dbNode.updateUser(userId, { password: newPassword });
      return res.status(200).json({ success: true, message: "Security key updated." });
    } catch (err) {
      return res.status(500).json({ message: "Security update node failed." });
    }
  },

  getTeam: async (req: any, res: any) => {
    const user = await dbNode.findUserById(req.user.id);
    if (!user) return res.status(404).json({ message: "Identity node missing." });

    const all = await dbNode.getUsers();
    const t1 = all.filter((u: any) => u.referred_by === user.referral_code);
    const t1Codes = t1.map((u: any) => u.referral_code);
    const t2 = all.filter((u: any) => t1Codes.length > 0 && t1Codes.includes(u.referred_by));
    const t2Codes = t2.map((u: any) => u.referral_code);
    const t3 = all.filter((u: any) => t2Codes.length > 0 && t2Codes.includes(u.referred_by));

    const sanitize = (l: any[]) => l.map(u => ({ 
      id: u.id, 
      name: u.name, 
      currentPlan: u.current_plan || u.currentPlan, 
      avatar: u.avatar 
    }));
    
    return res.status(200).json({ 
      t1: sanitize(t1), 
      t2: sanitize(t2), 
      t3: sanitize(t3) 
    });
  }
};