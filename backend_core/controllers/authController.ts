import { dbNode } from '../utils/db';

export const authController = {
  login: async (req: any, res: any) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ message: 'Missing credentials.' });

      const user = await dbNode.findUserByIdentifier(email);
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
      if (await dbNode.findUserByIdentifier(email) || await dbNode.findUserByIdentifier(phone)) {
        return res.status(400).json({ message: 'Email/Phone pehle se registered hai.' });
      }

      const namePart = (name || 'USR').substring(0, 3).toUpperCase().replace(/\s/g, '');
      const uniqueSuffix = Math.floor(1000 + Math.random() * 8999);
      const generatedRef = `${namePart}-${uniqueSuffix}`;

      const newUser = {
        id: `USR-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        name, email, phone, password,
        role: 'user',
        balance: 0,
        currentPlan: 'None',
        referralCode: generatedRef,
        referredBy: referralCode?.trim() || null,
        transactions: [],
        completedTasksToday: [],
        workSubmissions: [],
        purchaseHistory: [],
        streak: 0,
        createdAt: new Date().toISOString()
      };

      const users = await dbNode.getUsers();
      users.push(newUser);
      await dbNode.saveUsers(users);

      const { password: _, ...safeUser } = newUser;
      return res.status(201).json({ token: `jwt-noor-${newUser.id}-${Date.now()}`, user: safeUser });
    } catch (err) {
      return res.status(500).json({ message: "Registry creation failed." });
    }
  }
};