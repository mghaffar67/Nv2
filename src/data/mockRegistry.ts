
/**
 * Noor Official V3 - Master Mock Registry
 * Absolute source of truth for the platform.
 */

export const INITIAL_USERS = [
  { 
    id: 'ADM-786', 
    name: 'Noor Admin', 
    email: 'admin@noor.com', 
    phone: '03000000000',
    password: 'admin123', 
    role: 'admin', 
    balance: 750000, 
    currentPlan: 'DIAMOND', 
    referralCode: 'NOOR-MAIN', 
    createdAt: '2024-01-01T10:00:00.000Z',
    isBanned: false,
    transactions: [
      { id: 'TRX-INIT', type: 'reward', amount: 750000, status: 'approved', gateway: 'System Grant', date: '2024-01-01', timestamp: '2024-01-01T10:05:00Z' }
    ],
    workSubmissions: [],
    withdrawalInfo: { provider: 'EasyPaisa', accountNumber: '03000000000', accountTitle: 'Noor Admin Main' }
  },
  { 
    id: 'USR-110', 
    name: 'Hammad Malik', 
    email: 'user@noor.com', 
    phone: '03123456789',
    password: 'user123', 
    role: 'user', 
    balance: 4550, 
    currentPlan: 'GOLD ELITE', 
    referralCode: 'HM-990', 
    referredBy: 'NOOR-MAIN',
    streak: 4,
    lastCheckIn: new Date().toISOString(),
    isBanned: false,
    transactions: [
      { id: 'TRX-101', type: 'deposit', amount: 1500, status: 'approved', gateway: 'JazzCash', date: '2024-05-10', timestamp: '2024-05-10T12:00:00Z' },
      { id: 'TRX-102', type: 'reward', amount: 150, status: 'approved', gateway: 'Daily Yield', date: '2024-05-11', timestamp: '2024-05-11T09:30:00Z' },
      { id: 'TRX-103', type: 'withdraw', amount: 500, status: 'approved', gateway: 'EasyPaisa', date: '2024-05-12', timestamp: '2024-05-12T15:45:00Z' }
    ],
    completedTasksToday: [],
    workSubmissions: [
      { id: 'SUB-01', taskId: 'TASK-001', taskTitle: 'Visit Brand Site', status: 'approved', reward: 50, timestamp: '2024-05-12T08:00:00Z', userAnswer: 'https://i.imgur.com/example.png' }
    ],
    createdAt: '2024-05-01T08:00:00.000Z',
    withdrawalInfo: { provider: 'EasyPaisa', accountNumber: '03123456789', accountTitle: 'Hammad Malik' }
  }
];

export const INITIAL_TASKS = [
  { id: 'TASK-001', title: 'Verify Traffic Link', reward: 50, plan: 'BASIC', instruction: 'Visit the link, stay for 30s, and upload screenshot proof.', isActive: true, assignmentType: 'all', createdAt: new Date().toISOString() },
  { id: 'TASK-002', title: 'YouTube Node Sync', reward: 150, plan: 'GOLD ELITE', instruction: 'Subscribe to Noor Official Channel and send verification.', isActive: true, assignmentType: 'all', createdAt: new Date().toISOString() },
  { id: 'TASK-003', title: 'Premium Brand Audit', reward: 650, plan: 'DIAMOND', instruction: 'Complete detailed brand audit for our partner nodes.', isActive: true, assignmentType: 'all', createdAt: new Date().toISOString() }
];

export const INITIAL_PAGES = [
  { slug: 'privacy', title: 'Privacy Policy', content: '<h1>Privacy Node</h1><p>Your data is encrypted and stored on private Noor nodes.</p>' },
  { slug: 'terms', title: 'Terms of Service', content: '<h1>Terms Node</h1><p>Strictly one account per user identity protocol.</p>' }
];

export const INITIAL_CONFIG = {
  appName: "Noor Official V3",
  currency: "PKR",
  maintenanceMode: false,
  theme: { primaryColor: '#6366f1', secondaryColor: '#0ea5e9' },
  paymentGateways: [
    { name: 'EasyPaisa', accountNumber: '03001234567', accountTitle: 'Noor Core Admin' },
    { name: 'JazzCash', accountNumber: '03451122334', accountTitle: 'Noor Core Admin' }
  ],
  streakRewards: [5, 10, 15, 20, 25, 30, 100],
  referralSettings: { level1Percent: 10, level2Percent: 5, level3Percent: 2, signupBonus: 0 }
};
