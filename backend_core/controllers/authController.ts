
import { dbRegistry } from '../utils/db';

export const authController = {
  login: async (req: any, res: any) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: 'Email/Mobile aur Password likhna zaroori hai.' });
      }

      const user = dbRegistry.findUserByIdentifier(email);

      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Ghalat details! Dobara check karen.' });
      }
      
      if (user.isBanned) {
        return res.status(403).json({ message: 'Aap ka account suspend kar diya gaya hai.' });
      }

      const { password: _, ...sessionUser } = user;
      const timestamp = Date.now();

      return res.status(200).json({
        success: true,
        token: `jwt-noor-${user.id}-${timestamp}`,
        user: sessionUser
      });
    } catch (err) {
      return res.status(500).json({ message: 'System Error: Syncing failure.' });
    }
  },

  register: async (req: any, res: any) => {
    try {
      const { name, email, phone, password, referralCode } = req.body;
      
      if (dbRegistry.findUserByIdentifier(email) || dbRegistry.findUserByIdentifier(phone)) {
        return res.status(400).json({ message: 'Ye Email ya Phone pehle se registered hai.' });
      }

      const newUser = {
        id: `USR-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        name, email, phone, password,
        role: 'user',
        balance: 0,
        currentPlan: 'None',
        referralCode: `REF-${Math.floor(1000 + Math.random() * 9000)}`,
        referredBy: referralCode || null,
        transactions: [],
        completedTasksToday: [],
        purchaseHistory: [],
        workSubmissions: [],
        streak: 0,
        createdAt: new Date().toISOString()
      };

      const users = dbRegistry.getUsers();
      users.push(newUser);
      dbRegistry.saveUsers(users);

      const { password: _, ...safeUser } = newUser;
      return res.status(201).json({ 
        token: `jwt-noor-${newUser.id}-${Date.now()}`, 
        user: safeUser 
      });
    } catch (err) {
      return res.status(500).json({ message: "Identity creation failed." });
    }
  }
};
