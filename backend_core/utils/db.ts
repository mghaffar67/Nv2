
import { INITIAL_USERS, INITIAL_TASKS, INITIAL_CONFIG } from '../../src/data/mockTasks';

const ENRICHED_TASKS = [
  ...INITIAL_TASKS,
  { id: 'TASK-AMZ-001', title: 'Viral Expansion', reward: 500, category: 'social_media', plan: 'DIAMOND', instruction: 'Post a TikTok review of our platform and tag @NoorOfficial.', isActive: true, validityDays: 30, timeLimitSeconds: 1200 },
  { id: 'TASK-TST-001', title: 'System Security Audit', reward: 150, category: 'verification', plan: 'STANDARD', instruction: 'Test the withdrawal logic and screenshot any error logs.', isActive: true, validityDays: 15, timeLimitSeconds: 600 }
];

const KEYS = {
  USERS: 'noor_v3_master_registry',
  TASKS: 'noor_tasks_db',
  PAGES: 'noor_pages_db',
  CONFIG: 'noor_config',
  INTEGRATIONS: 'noor_integrations_db',
  PAGE_CONTENTS: 'noor_page_contents_db',
  REWARDS: 'noor_rewards_db'
};

const isNode = typeof window === 'undefined';

const pruneMasterRegistry = (users: any[]) => {
  return users.map(user => ({
    ...user,
    // Evidence strings (Base64 PDF/Images) can be large. Increased limit to 2MB to prevent corruption.
    workSubmissions: (user.workSubmissions || []).slice(0, 20).map((s: any) => ({
      ...s,
      userAnswer: s.userAnswer?.length > 2000000 ? s.userAnswer.substring(0, 2000000) + "...[PRUNED]" : s.userAnswer
    })),
    transactions: (user.transactions || []).slice(0, 30).map((t: any) => ({
      ...t,
      proofImage: t.proofImage?.length > 2000000 ? t.proofImage.substring(0, 2000000) + "...[PRUNED]" : t.proofImage
    }))
  }));
};

export const dbNode = {
  getUsers: () => {
    if (isNode) return INITIAL_USERS;
    const data = localStorage.getItem(KEYS.USERS);
    return data ? JSON.parse(data) : INITIAL_USERS;
  },
  
  saveUsers: (users: any[]) => {
    if (isNode) return;
    try {
      const pruned = pruneMasterRegistry(users);
      localStorage.setItem(KEYS.USERS, JSON.stringify(pruned));
      window.dispatchEvent(new Event('noor_db_update'));
    } catch (e) {
      console.error("Master Registry Quota Warning. Forcing aggressive cleanup.");
      const ultraPruned = users.map(u => ({ ...u, workSubmissions: [], transactions: u.transactions?.slice(0, 5) }));
      localStorage.setItem(KEYS.USERS, JSON.stringify(ultraPruned));
    }
  },

  findUserById: (id: string) => dbNode.getUsers().find((u: any) => u.id === id),

  findUserByIdentifier: (input: string) => {
    const term = input.toLowerCase().trim();
    return dbNode.getUsers().find((u: any) => u.email.toLowerCase() === term || u.phone === term);
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

  getConfig: () => {
    if (isNode) return INITIAL_CONFIG;
    const data = localStorage.getItem(KEYS.CONFIG);
    return data ? JSON.parse(data) : INITIAL_CONFIG;
  },
  
  saveConfig: (config: any) => {
    if (isNode) return;
    localStorage.setItem(KEYS.CONFIG, JSON.stringify(config));
    window.dispatchEvent(new Event('noor_db_update'));
  },
  
  getTasks: () => {
    if (isNode) return ENRICHED_TASKS;
    const data = localStorage.getItem(KEYS.TASKS);
    return data ? JSON.parse(data) : ENRICHED_TASKS;
  },
  
  saveTasks: (tasks: any[]) => {
    if (isNode) return;
    localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
  },

  getRewards: () => {
    if (isNode) return [];
    const data = localStorage.getItem(KEYS.REWARDS);
    return data ? JSON.parse(data) : [];
  },

  saveRewards: (data: any[]) => {
    if (!isNode) localStorage.setItem(KEYS.REWARDS, JSON.stringify(data));
  },

  getIntegrations: () => {
    if (isNode) return [];
    const data = localStorage.getItem(KEYS.INTEGRATIONS);
    return data ? JSON.parse(data) : [];
  },

  saveIntegrations: (data: any[]) => {
    if (!isNode) localStorage.setItem(KEYS.INTEGRATIONS, JSON.stringify(data));
  },

  getPageContents: () => {
    if (isNode) return {};
    const data = localStorage.getItem(KEYS.PAGE_CONTENTS);
    return data ? JSON.parse(data) : {};
  },

  savePageContents: (data: any) => {
    if (!isNode) localStorage.setItem(KEYS.PAGE_CONTENTS, JSON.stringify(data));
  }
};

export const dbRegistry = dbNode;
