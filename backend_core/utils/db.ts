
/**
 * Noor Official V3 - Master Database Registry
 */

const INITIAL_USERS = [
  { id: 'ADMIN-MASTER-001', name: 'M Ghaffar (Owner)', email: 'admin@noor.com', phone: '923068665907', password: 'admin123', role: 'admin', balance: 250000, currentPlan: 'DIAMOND', referralCode: 'NOOR-OWNER', isBanned: false, transactions: [], workSubmissions: [], purchaseHistory: [] },
  { id: 'USER-GHAFFAR-786', name: 'M Ghaffar (User)', email: 'ghaffar@mail.com', phone: '923068665907', password: 'user123', role: 'user', balance: 1550, currentPlan: 'BASIC', referralCode: 'GHAFFAR-V3', isBanned: false, transactions: [], workSubmissions: [], purchaseHistory: [], streak: 3 },
  { id: 'USR-TEST-001', name: 'Ali Ahmed', email: 'ali@mail.pk', phone: '923001234567', password: 'user123', role: 'user', balance: 4500, currentPlan: 'STANDARD', referralCode: 'ALI-88', isBanned: false, transactions: [], workSubmissions: [], purchaseHistory: [] },
  { id: 'USR-TEST-002', name: 'Sara Khan', email: 'sara@mail.pk', phone: '923001234568', password: 'user123', role: 'user', balance: 12000, currentPlan: 'GOLD', referralCode: 'SARA-99', isBanned: false, transactions: [], workSubmissions: [], purchaseHistory: [] },
  { id: 'USR-TEST-003', name: 'Hammad Malik', email: 'hammad@mail.pk', phone: '923001234569', password: 'user123', role: 'user', balance: 800, currentPlan: 'BASIC', referralCode: 'HAM-10', isBanned: false, transactions: [], workSubmissions: [], purchaseHistory: [] },
  { id: 'USR-TEST-004', name: 'Zoya Shah', email: 'zoya@mail.pk', phone: '923001234570', password: 'user123', role: 'user', balance: 56700, currentPlan: 'DIAMOND', referralCode: 'ZOYA-PK', isBanned: false, transactions: [], workSubmissions: [], purchaseHistory: [] },
  { id: 'USR-TEST-005', name: 'Bilal Javed', email: 'bilal@mail.pk', phone: '923001234571', password: 'user123', role: 'user', balance: 2300, currentPlan: 'STANDARD', referralCode: 'BILAL-01', isBanned: false, transactions: [], workSubmissions: [], purchaseHistory: [] },
  { id: 'USR-TEST-006', name: 'Nida Azhar', email: 'nida@mail.pk', phone: '923001234572', password: 'user123', role: 'user', balance: 0, currentPlan: 'None', referralCode: 'NIDA-PK', isBanned: false, transactions: [], workSubmissions: [], purchaseHistory: [] },
  { id: 'USR-TEST-007', name: 'Usman Ghani', email: 'usman@mail.pk', phone: '923001234573', password: 'user123', role: 'user', balance: 9500, currentPlan: 'GOLD', referralCode: 'USMAN-77', isBanned: false, transactions: [], workSubmissions: [], purchaseHistory: [] },
  { id: 'USR-TEST-008', name: 'Ibrahim Ali', email: 'ibrahim@mail.pk', phone: '923001234574', password: 'user123', role: 'user', balance: 150, currentPlan: 'BASIC', referralCode: 'IBI-22', isBanned: false, transactions: [], workSubmissions: [], purchaseHistory: [] },
  { id: 'USR-TEST-009', name: 'Kashif Mehmood', email: 'kashif@mail.pk', phone: '923001234575', password: 'user123', role: 'user', balance: 6700, currentPlan: 'STANDARD', referralCode: 'KASH-90', isBanned: false, transactions: [], workSubmissions: [], purchaseHistory: [] }
];

const INITIAL_TASKS = [
  { id: 'T-001', title: 'YouTube Video Like', instruction: 'Video ko like karein aur screenshot upload karein.', reward: 240, plan: 'BASIC', category: 'social_media', isActive: true },
  { id: 'T-002', title: 'Play Store App Review', instruction: 'App ko 5 star review dein aur apna username screenshot mein dikhayein.', reward: 240, plan: 'STANDARD', category: 'verification', isActive: true },
  { id: 'T-003', title: 'Data Entry Assignment', instruction: 'Table mein data entry karein aur completion file upload karein.', reward: 240, plan: 'GOLD', category: 'data_entry', isActive: true },
  { id: 'T-004', title: 'Article Writing Task', instruction: '200 words ka article likhein aur link share karein.', reward: 240, plan: 'DIAMOND', category: 'verification', isActive: true }
];

const INITIAL_CONFIG = {
  appName: "Noor Official V3",
  maintenanceMode: false,
  rewardPerTask: 240,
  workDays: "Mon-Fri",
  workHours: { start: 9, end: 22 },
  financeSettings: { minWithdraw: 500, maxWithdraw: 100000, withdrawFeePercent: 10, referralRequiredForWithdraw: false, requiredReferralCount: 2 },
  paymentGateways: [
    { name: 'EasyPaisa', accountNumber: '923068665907', accountTitle: 'M Ghaffar' },
    { name: 'JazzCash', accountNumber: '923068665907', accountTitle: 'M Ghaffar' }
  ],
  streakRewards: [10, 20, 30, 40, 50, 60, 150]
};

const KEYS = {
  USERS: 'noor_v3_master_registry',
  TASKS: 'noor_tasks_db',
  CONFIG: 'noor_config',
  SUPPORT: 'noor_support_chats',
  // Fix: Added missing keys for rewards, integrations and page contents
  REWARDS: 'noor_rewards',
  INTEGRATIONS: 'noor_integrations',
  PAGE_CONTENTS: 'noor_page_contents'
};

const getFromStore = (key: string, fallback: any) => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
  try { return JSON.parse(data); } catch (e) { return fallback; }
};

const saveToStore = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
  window.dispatchEvent(new Event('noor_db_update'));
};

export const dbNode = {
  getUsers: () => getFromStore(KEYS.USERS, INITIAL_USERS),
  saveUsers: (users: any[]) => saveToStore(KEYS.USERS, users),
  findUserById: (id: string) => dbNode.getUsers().find((u: any) => u.id === id),
  findUserByIdentifier: (input: string) => {
    const term = input?.toLowerCase().trim();
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
  getTasks: () => getFromStore(KEYS.TASKS, INITIAL_TASKS),
  saveTasks: (tasks: any[]) => saveToStore(KEYS.TASKS, tasks),
  getChats: () => getFromStore(KEYS.SUPPORT, []),
  saveChats: (chats: any[]) => saveToStore(KEYS.SUPPORT, chats),
  // Fix: Added missing methods for rewards, integrations and page contents to resolve controller errors
  getRewards: () => getFromStore(KEYS.REWARDS, []),
  saveRewards: (rewards: any[]) => saveToStore(KEYS.REWARDS, rewards),
  getIntegrations: () => getFromStore(KEYS.INTEGRATIONS, []),
  saveIntegrations: (integrations: any[]) => saveToStore(KEYS.INTEGRATIONS, integrations),
  getPageContents: () => getFromStore(KEYS.PAGE_CONTENTS, {}),
  savePageContents: (contents: any) => saveToStore(KEYS.PAGE_CONTENTS, contents)
};

export const dbRegistry = dbNode;
