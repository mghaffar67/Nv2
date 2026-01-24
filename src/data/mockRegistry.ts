
/**
 * Noor Official V3 - Master Mock Registry
 * Enhanced Demo Data for Professional testing and UI visualization
 */

export const INITIAL_USERS = [
  { 
    id: 'ADM-101-MAIN', 
    name: 'Admin Command', 
    email: 'admin@noor.com', 
    phone: '03000000000',
    password: 'admin123', 
    role: 'admin', 
    balance: 5000000, 
    currentPlan: 'DIAMOND', 
    referralCode: 'NOOR-PRO', 
    createdAt: '2024-01-01T10:00:00.000Z',
    isBanned: false,
    transactions: [],
    workSubmissions: [],
    purchaseHistory: []
  },
  { 
    id: 'USR-786-ALEE', 
    name: 'Ali Haider', 
    email: 'ali@test.com', 
    phone: '03124455667',
    password: 'user123', 
    role: 'user', 
    balance: 12450, 
    currentPlan: 'GOLD ELITE', 
    referralCode: 'ALI-V3', 
    referredBy: 'NOOR-PRO',
    streak: 5,
    lastCheckIn: new Date().toISOString(),
    isBanned: false,
    transactions: [
      { id: 'DEP-P1', type: 'deposit', amount: 5000, status: 'pending', gateway: 'EasyPaisa', trxId: '882771662', date: '2024-05-20', timestamp: '2024-05-20T14:20:00Z', proofImage: 'https://images.unsplash.com/photo-1554224155-1696413565d3?q=80&w=400' },
      { id: 'REW-1', type: 'reward', amount: 150, status: 'approved', gateway: 'Task Yield', date: '2024-05-19', timestamp: '2024-05-19T10:00:00Z' }
    ],
    workSubmissions: [
      { id: 'SUB-101', taskId: 'TASK-01', taskTitle: 'Social Audit', status: 'pending', reward: 50, timestamp: '2024-05-20T16:00:00Z', userAnswer: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=400' }
    ],
    purchaseHistory: [
      { id: 'PH-01', planId: 'GOLD ELITE', amount: 1500, status: 'active', date: '2024-05-10T11:00:00Z', method: 'wallet' }
    ]
  },
  { 
    id: 'USR-992-SARA', 
    name: 'Sara Khan', 
    email: 'sara@test.com', 
    phone: '03451122334',
    password: 'user123', 
    role: 'user', 
    balance: 890, 
    currentPlan: 'STANDARD', 
    referralCode: 'SARA-99', 
    referredBy: 'ALI-V3',
    isBanned: false,
    transactions: [
      { id: 'WD-P1', type: 'withdraw', amount: 1200, status: 'pending', gateway: 'JazzCash', accountNumber: '03451122334', accountTitle: 'Sara Khan', date: '2024-05-20', timestamp: '2024-05-20T17:10:00Z' }
    ]
  }
];

export const INITIAL_TASKS = [
  { id: 'TASK-01', title: 'Premium Platform Audit', reward: 50, plan: 'BASIC', instruction: 'Visit the link and stay for 30 seconds.', isActive: true },
  { id: 'TASK-02', title: 'High-Value Network Subscription', reward: 120, plan: 'GOLD ELITE', instruction: 'Subscribe to our channel and provide proof.', isActive: true }
];

export const INITIAL_CONFIG = {
  appName: "Noor Official V3",
  maintenanceMode: false,
  broadcastMessage: "Welcome to Noor Official V3! Optimized for Pakistani earners.",
  branding: {
    logo: "",
    siteIcon: "",
    copyright: "© 2024 Noor Official V3. All Rights Reserved."
  },
  financeSettings: {
    minWithdraw: 500,
    maxWithdraw: 50000,
    withdrawFeePercent: 10,
    referralRequiredForWithdraw: false
  },
  paymentGateways: [
    { name: 'EasyPaisa', accountNumber: '03001234567', accountTitle: 'Noor Admin Hub' },
    { name: 'JazzCash', accountNumber: '03451122334', accountTitle: 'Noor Finance Main' }
  ],
  streakRewards: [5, 10, 15, 20, 25, 30, 100],
  referralSettings: { level1Percent: 15, level2Percent: 5, level3Percent: 2, signupBonus: 0 }
};
