
/**
 * Noor Official V3 - Master Registry Seeding
 */

export const INITIAL_USERS = [
  { 
    id: 'NODE-ADMIN-PRO', 
    name: 'System Admin', 
    email: 'admin@noor.com', 
    phone: '03000000000',
    password: 'admin123', 
    role: 'admin', 
    balance: 50000, 
    currentPlan: 'DIAMOND', 
    referralCode: 'NOOR-HQ', 
    createdAt: '2024-01-01T10:00:00.000Z',
    isBanned: false,
    transactions: [
      { id: 'SYS-INIT', type: 'reward', amount: 50000, status: 'approved', gateway: 'Admin Setup', note: 'Starting Balance', date: '2024-01-01', timestamp: '2024-01-01T10:00:00Z' }
    ],
    workSubmissions: [],
    purchaseHistory: []
  },
  { 
    id: 'NODE-ASSOC-786', 
    name: 'Hamza Malik', 
    email: 'user@noor.com', 
    phone: '03123456789',
    password: 'user123', 
    role: 'user', 
    balance: 2450, 
    currentPlan: 'GOLD ELITE', 
    referralCode: 'HMZ-NODE', 
    referredBy: 'NOOR-HQ',
    streak: 5,
    lastCheckIn: new Date().toISOString(),
    isBanned: false,
    transactions: [
      { id: 'INC-PKT-101', type: 'reward', amount: 150, status: 'approved', gateway: 'Daily Work', note: 'Task #99 Done', date: '2024-05-20', timestamp: '2024-05-20T14:20:00Z' },
      { id: 'COM-PKT-882', type: 'reward', amount: 300, status: 'approved', gateway: 'Team Commission', note: 'Bonus from team member', date: '2024-05-19', timestamp: '2024-05-19T10:00:00Z' },
      { id: 'DEP-PKT-001', type: 'deposit', amount: 2000, status: 'approved', gateway: 'EasyPaisa', trxId: '88299100', date: '2024-05-18', timestamp: '2024-05-18T09:00:00Z' },
      { id: 'STRK-001', type: 'reward', amount: 50, status: 'approved', gateway: 'Daily Bonus', note: '5 Day Streak', date: '2024-05-21', timestamp: '2024-05-21T09:00:00Z' }
    ],
    workSubmissions: [],
    purchaseHistory: [
      { id: 'PH-GOLD', planId: 'GOLD ELITE', amount: 1500, status: 'active', date: '2024-05-10T11:00:00Z', method: 'wallet' }
    ],
    completedTasksToday: []
  }
];

export const INITIAL_TASKS = [
  { id: 'TASK-001', title: 'Handwritten Work', reward: 50, plan: 'BASIC', instruction: 'Write your name on a paper, take a photo and upload.', isActive: true },
  { id: 'TASK-002', title: 'Social Share', reward: 120, plan: 'GOLD ELITE', instruction: 'Write "Noor Official V3" on paper and upload a photo.', isActive: true }
];

export const INITIAL_CONFIG = {
  appName: "Noor Official V3",
  maintenanceMode: false,
  broadcastMessage: "Welcome! EasyPaisa and JazzCash withdrawals are working now.",
  branding: {
    logo: "",
    siteIcon: "",
    copyright: "© 2024 Noor Official V3."
  },
  financeSettings: {
    minWithdraw: 500,
    maxWithdraw: 50000,
    withdrawFeePercent: 10,
    referralRequiredForWithdraw: false
  },
  paymentGateways: [
    { name: 'EasyPaisa', accountNumber: '03001234567', accountTitle: 'Noor Admin' },
    { name: 'JazzCash', accountNumber: '03451122334', accountTitle: 'Noor Admin' }
  ],
  streakRewards: [10, 10, 15, 20, 25, 50, 200],
  referralSettings: { level1Percent: 15, level2Percent: 5, level3Percent: 2, signupBonus: 0 }
};
