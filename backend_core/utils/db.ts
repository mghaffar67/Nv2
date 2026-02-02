/**
 * Noor Official V3 - Core Database Utility
 */

const INITIAL_USERS = [
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
    isBanned: false,
    transactions: [],
    workSubmissions: [],
    purchaseHistory: []
  },
  { 
    id: 'USER-GHAFFAR-786', 
    name: 'M Ghaffar (User)', 
    email: 'ghaffar@mail.com', 
    phone: '923068665907',
    password: 'user123', 
    role: 'user', 
    balance: 1550, 
    currentPlan: 'BASIC', 
    referralCode: 'GHAFFAR-V3', 
    isBanned: false,
    transactions: [],
    workSubmissions: [],
    purchaseHistory: [],
    streak: 3
  }
];

const INITIAL_TASKS = [
  { id: 'T-001', title: 'Article Verification Page 1', instruction: 'Read and verify the digital content text.', reward: 240, plan: 'ANY', category: 'verification', isActive: true },
  { id: 'T-002', title: 'Article Verification Page 2', instruction: 'Read and verify the digital content text.', reward: 240, plan: 'ANY', category: 'verification', isActive: true },
  { id: 'T-003', title: 'Article Verification Page 3', instruction: 'Read and verify the digital content text.', reward: 240, plan: 'ANY', category: 'verification', isActive: true },
  { id: 'T-004', title: 'Article Verification Page 4', instruction: 'Read and verify the digital content text.', reward: 240, plan: 'ANY', category: 'verification', isActive: true }
];

const INITIAL_CONFIG = {
  appName: "Noor Official V3",
  maintenanceMode: false,
  rewardPerTask: 240,
  workDays: "Mon-Fri",
  workHours: { start: 9, end: 22 }, // 9 AM to 10 PM
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
  streakRewards: [10, 20, 30, 40, 50, 60, 150] // PKRs for Day 1 through 7
};

const KEYS = {
  USERS: 'noor_v3_master_registry',
  TASKS: 'noor_tasks_db',
  CONFIG: 'noor_config',
  PLANS: 'noor_plans_registry',
  INTEGRATIONS: 'noor_integrations_registry',
  PAGE_CONTENTS: 'noor_page_contents_registry',
  REWARDS: 'noor_rewards_registry'
};

const isNode = typeof window === 'undefined';

const getFromStore = (key: string, fallback: any) => {
  if (isNode) return fallback;
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
  try { return JSON.parse(data); } catch (e) { return fallback; }
};

const saveToStore = (key: string, data: any) => {
  if (!isNode) {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event('noor_db_update'));
  }
};

export const dbNode = {
  getUsers: () => getFromStore(KEYS.USERS, INITIAL_USERS),
  saveUsers: (users: any[]) => {
    saveToStore(KEYS.USERS, users);
    if (!isNode) {
      const sessionUserStr = localStorage.getItem('noor_user');
      if (sessionUserStr) {
        const sessionUser = JSON.parse(sessionUserStr);
        const updated = users.find(u => u.id === sessionUser.id);
        if (updated) {
          const { password: _, ...safe } = updated;
          localStorage.setItem('noor_user', JSON.stringify(safe));
        }
      }
    }
  },
  findUserById: (id: string) => dbNode.getUsers().find((u: any) => u.id === id),
  findUserByIdentifier: (input: string) => {
    if (!input) return null;
    const term = input.toLowerCase().trim();
    return dbNode.getUsers().find((u: any) => u.email?.toLowerCase() === term || u.phone === term);
  },
  updateUser: (id: string, updates: any) => {
    const users = dbNode.getUsers();
    const idx = users.findIndex((u: any) => u.id === id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates };
      dbNode.saveUsers(users);
      return users[idx];
    }
    return null;
  },
  getConfig: () => getFromStore(KEYS.CONFIG, INITIAL_CONFIG),
  saveConfig: (config: any) => saveToStore(KEYS.CONFIG, config),
  getIntegrations: () => getFromStore(KEYS.INTEGRATIONS, []),
  saveIntegrations: (integrations: any[]) => saveToStore(KEYS.INTEGRATIONS, integrations),
  getPageContents: () => getFromStore(KEYS.PAGE_CONTENTS, {}),
  savePageContents: (contents: any) => saveToStore(KEYS.PAGE_CONTENTS, contents),
  getRewards: () => getFromStore(KEYS.REWARDS, []),
  saveRewards: (rewards: any[]) => saveToStore(KEYS.REWARDS, rewards),
  getTasks: () => getFromStore(KEYS.TASKS, INITIAL_TASKS),
  saveTasks: (tasks: any[]) => saveToStore(KEYS.TASKS, tasks)
};

export const dbRegistry = dbNode;