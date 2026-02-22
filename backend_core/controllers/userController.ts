
import { dbNode } from '../utils/db';

export const userController = {
  updateProfile: async (req: any, res: any) => {
    const { userId, updates } = req.body;
    
    const user = await dbNode.findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Apply updates (name, password, withdrawalInfo)
    const updatedFields: any = {};
    if (updates.name) updatedFields.name = updates.name;
    if (updates.password) updatedFields.password = updates.password; // In real app, hash this!
    if (updates.withdrawalInfo) {
      updatedFields.withdrawalInfo = {
        ...(user.withdrawalInfo || {}),
        ...updates.withdrawalInfo
      };
    }

    const updatedUser = await dbNode.updateUser(userId, updatedFields);

    return res.status(200).json({
      message: 'Profile updated successfully!',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        balance: updatedUser.balance,
        referralCode: updatedUser.referralCode,
        currentPlan: updatedUser.currentPlan,
        withdrawalInfo: updatedUser.withdrawalInfo
      }
    });
  }
};
