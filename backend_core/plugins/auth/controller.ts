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

      let uplineCode = null;
      if (referralCode) {
        const allUsers = await dbNode.getUsers();
        const referrer = allUsers.find((u: any) => (u.referralCode === referralCode.trim() || u.referral_code === referralCode.trim()));
        if (referrer) {
           uplineCode = referrer.referralCode || referrer.referral_code;
        }
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
        currentPlan: 'None',
        referralCode: generatedRef,
        referredBy: uplineCode,
        transactions: [],
        workSubmissions: [],
        workHistory: [], // Unified Audit Ledger
        purchaseHistory: [],
        claimedRewards: [],
        rewardHistory: [],
        supportMessages: [], // Live Support Bridge
        streak: 0,
        createdAt: new Date().toISOString(),
        isBanned: false
      };

      const allUsers = await dbNode.getUsers();
      allUsers.push(newUser);
      await dbNode.saveUsers(allUsers);

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

  // Manual Support Node Handler
  submitSupportMessage: async (req: any, res: any) => {
    const { userId, message } = req.body;
    try {
      const user = await dbNode.findUserById(userId);
      if (!user) return res.status(404).json({ message: "Node lost." });

      const msgPacket = {
        id: `MSG-${Date.now()}`,
        text: message,
        role: 'user',
        timestamp: new Date().toISOString(),
        status: 'unread'
      };

      if (!user.supportMessages) user.supportMessages = [];
      user.supportMessages.push(msgPacket);

      await dbNode.updateUser(userId, { supportMessages: user.supportMessages });
      return res.status(200).json({ success: true, message: "Transmitted to Support Registry." });
    } catch (e) {
      return res.status(500).json({ message: "Relay failure." });
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

      await dbNode.updateUser(userId, updates);
      const freshUser = await dbNode.findUserById(userId);
      const { password: _, ...safeUser } = freshUser!;
      return res.status(200).json({ success: true, user: safeUser });
    } catch (err) {
      return res.status(500).json({ message: "Identity sync failed." });
    }
  },

  changePassword: async (req: any, res: any) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const user = await dbNode.findUserById(req.user.id);
      if (!user || user.password !== oldPassword) return res.status(400).json({ message: "Incorrect security key." });
      await dbNode.updateUser(req.user.id, { password: newPassword });
      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ message: "Security update node failed." });
    }
  },

  getTeam: async (req: any, res: any) => {
    try {
      const user = await dbNode.findUserById(req.user.id);
      const all = await dbNode.getUsers();
      const myCode = user.referralCode || user.referral_code;
      const t1 = all.filter((u: any) => (u.referredBy === myCode || u.referred_by === myCode));
      const t1Codes = t1.map((u: any) => (u.referralCode || u.referral_code));
      const t2 = all.filter((u: any) => t1Codes.length > 0 && t1Codes.includes(u.referredBy || u.referred_by));
      const t2Codes = t2.map((u: any) => (u.referralCode || u.referral_code));
      const t3 = all.filter((u: any) => t2Codes.length > 0 && t2Codes.includes(u.referredBy || u.referred_by));

      const sanitize = (l: any[]) => l.map(u => ({ id: u.id, name: u.name, currentPlan: u.currentPlan || 'None', createdAt: u.createdAt, isVerified: !u.isBanned }));
      return res.status(200).json({ t1: sanitize(t1), t2: sanitize(t2), t3: sanitize(t3) });
    } catch (err) {
      return res.status(500).json({ message: "Network failure." });
    }
  }
};