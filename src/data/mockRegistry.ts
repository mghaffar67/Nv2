
/**
 * Noor Official V3 - Master Registry Seeding
 */

export const INITIAL_USERS = [
  { 
    id: 'ADMIN-MASTER-001', 
    name: 'M Ghaffar (Owner)', 
    email: 'admin@noor.com', 
    phone: '923068665907',
    password: 'admin123', 
    role: 'admin', 
    balance: 250000, 
    currentPlan: 'DIAMOND', 
    referralCode: 'NOOR-OWNER', 
    createdAt: '2024-01-01T10:00:00.000Z',
    isBanned: false,
    transactions: [],
    workSubmissions: [],
    purchaseHistory: []
  },
  { 
    id: 'MANAGER-001', 
    name: 'Staff Manager', 
    email: 'manager@noor.com', 
    phone: '923000000000',
    password: 'manager123', 
    role: 'manager', 
    balance: 0, 
    currentPlan: 'None', 
    referralCode: 'NOOR-STAFF', 
    createdAt: '2024-02-01T10:00:00.000Z',
    isBanned: false,
    transactions: [],
    workSubmissions: [],
    purchaseHistory: []
  },
  { 
    id: 'USER-GHAFFAR-786', 
    name: 'M Ghaffar', 
    email: 'ghaffar@mail.com', 
    phone: '923068665907',
    password: 'user123', 
    role: 'user', 
    balance: 15500, 
    currentPlan: 'DIAMOND', 
    referralCode: 'GHAFFAR-PK', 
    referredBy: 'NOOR-OWNER',
    streak: 5,
    lastCheckIn: new Date().toISOString(),
    isBanned: false,
    transactions: [
      { id: 'INC-101', type: 'reward', amount: 650, status: 'approved', gateway: 'Daily Work', note: 'Task Completion Reward', date: '2024-05-20', timestamp: '2024-05-20T14:20:00Z' },
      { id: 'DEP-102', type: 'deposit', amount: 5000, status: 'approved', gateway: 'EasyPaisa', trxId: '88299100', date: '2024-05-18', timestamp: '2024-05-18T09:00:00Z' }
    ],
    workSubmissions: [],
    purchaseHistory: [
      { id: 'PH-DIAMOND', planId: 'DIAMOND', amount: 5000, status: 'active', date: '2024-05-10T11:00:00Z', method: 'wallet' }
    ],
    completedTasksToday: []
  }
];

export const INITIAL_TASKS = [
  { id: 'TASK-001', title: 'YouTube Subscription', reward: 50, plan: 'BASIC', category: 'social_media', instruction: 'Channel subscribe karein aur screenshot upload karein.', isActive: true },
  { id: 'TASK-002', title: 'Premium Review', reward: 650, plan: 'DIAMOND', category: 'verification', instruction: 'App ka acha review dein aur screenshot bhejein.', isActive: true }
];

export const INITIAL_CONFIG = {
  appName: "Noor Official V3",
  maintenanceMode: false,
  broadcastMessage: "M Ghaffar Official: Withdrawals are processed within 24 hours.",
  branding: {
    logo: "",
    siteIcon: "",
    copyright: "© 2024 Noor Official V3. Managed by M Ghaffar.",
    contactPhone: "923068665907",
    supportPhone: "923068665907"
  },
  financeSettings: {
    minWithdraw: 500,
    maxWithdraw: 100000,
    withdrawFeePercent: 10,
    referralRequiredForWithdraw: false,
    requiredReferralCount: 2
  },
  paymentGateways: [
    { name: 'EasyPaisa', accountNumber: '923068665907', accountTitle: 'M Ghaffar' },
    { name: 'JazzCash', accountNumber: '923068665907', accountTitle: 'M Ghaffar' }
  ],
  streakRewards: [10, 10, 15, 20, 25, 50, 200],
  referralSettings: { level1Percent: 15, level2Percent: 5, level3Percent: 2, signupBonus: 0 }
};
