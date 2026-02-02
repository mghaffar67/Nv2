import { dbNode } from '../utils/db';

export const userController = {
  updateProfile: async (req: any, res: any) => {
    const { userId, updates } = req.body;
    const user = dbNode.findUserById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Apply updates (name, password, withdrawalInfo)
    if (updates.name) user.name = updates.name;
    if (updates.password) user.password = updates.password; 
    if (updates.withdrawalInfo) {
      user.withdrawalInfo = {
        ...user.withdrawalInfo,
        ...updates.withdrawalInfo
      };
    }

    dbNode.updateUser(userId, user);

    return res.status(200).json({
      message: 'Profile updated successfully!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        balance: user.balance,
        referralCode: user.referralCode,
        currentPlan: user.currentPlan,
        withdrawalInfo: user.withdrawalInfo
      }
    });
  }
};