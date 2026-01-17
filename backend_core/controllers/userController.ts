
const getMockDB = () => {
  const data = localStorage.getItem('noor_mock_db');
  return data ? JSON.parse(data) : [];
};

const saveToMockDB = (db: any[]) => {
  localStorage.setItem('noor_mock_db', JSON.stringify(db));
};

export const userController = {
  updateProfile: async (req: any, res: any) => {
    const { userId, updates } = req.body;
    let db = getMockDB();
    
    const userIndex = db.findIndex((u: any) => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Apply updates (name, password, withdrawalInfo)
    const user = db[userIndex];
    
    if (updates.name) user.name = updates.name;
    if (updates.password) user.password = updates.password; // In real app, hash this!
    if (updates.withdrawalInfo) {
      user.withdrawalInfo = {
        ...user.withdrawalInfo,
        ...updates.withdrawalInfo
      };
    }

    db[userIndex] = user;
    saveToMockDB(db);

    // Sync localStorage session user
    localStorage.setItem('noor_user', JSON.stringify(user));

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
