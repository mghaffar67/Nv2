
import { INITIAL_USERS, INITIAL_TASKS, INITIAL_CONFIG } from '../../src/data/mockRegistry';

/**
 * expanded_tasks for Noor V3
 */
const ENRICHED_TASKS = [
  ...INITIAL_TASKS,
  { id: 'TASK-AMZ-001', title: 'Viral Network Expansion', reward: 500, category: 'social_media', plan: 'DIAMOND', instruction: 'Post a 1-minute video about Noor V3 on TikTok and tag us.', isActive: true },
  { id: 'TASK-AMZ-002', title: 'Premium Article Hub', reward: 250, category: 'content_creation', plan: 'GOLD ELITE', instruction: 'Write a 200-word positive review on your blog or forum.', isActive: true },
  { id: 'TASK-TST-001', title: 'Beta Node Testing: V4 UI', reward: 150, category: 'verification', plan: 'STANDARD', instruction: 'Test the new navigation menu and report any lag in PKR sync.', isActive: true },
  { id: 'TASK-TST-002', title: 'EasyPaisa API Probe', reward: 80, category: 'verification', plan: 'BASIC', instruction: 'Simulate a deposit sequence and screenshot the receipt window.', isActive: true }
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

const notifySystemChange = () => {
  if (!isNode) {
    window.dispatchEvent(new Event('noor_db_update'));
    window.dispatchEvent(new Event('noor_badge_update'));
  }
};

const getFromStore = (key: string, fallback: any) => {
  if (isNode) return fallback;
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return fallback;
  }
};

const saveToStore = (key: string, data: any) => {
  if (!isNode) {
    localStorage.setItem(key, JSON.stringify(data));
    notifySystemChange();
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

  findUserById: (id: string) => {
    const users = dbNode.getUsers();
    return users.find((u: any) => u.id === id);
  },

  findUserByIdentifier: (input: string) => {
    const term = input.toLowerCase().trim();
    const users = dbNode.getUsers();
    return users.find((u: any) => u.email.toLowerCase() === term || u.phone === term);
  },

  updateUser: (id: string, updates: any) => {
    const users = dbNode.getUsers();
    const idx = users.findIndex((u: any) => u.id === id);
    if (idx !== -1) {
      const currentUser = users[idx];
      users[idx] = { 
        ...currentUser, 
        ...updates
      };
      dbNode.saveUsers(users);
      return users[idx];
    }
    return null;
  },

  getConfig: () => getFromStore(KEYS.CONFIG, INITIAL_CONFIG),
  saveConfig: (config: any) => saveToStore(KEYS.CONFIG, config),
  
  getTasks: () => getFromStore(KEYS.TASKS, ENRICHED_TASKS),
  saveTasks: (tasks: any[]) => saveToStore(KEYS.TASKS, tasks),

  getRewards: () => getFromStore(KEYS.REWARDS, []),
  saveRewards: (data: any[]) => saveToStore(KEYS.REWARDS, data),

  getIntegrations: () => getFromStore(KEYS.INTEGRATIONS, []),
  saveIntegrations: (data: any[]) => saveToStore(KEYS.INTEGRATIONS, data),

  getPageContents: () => getFromStore(KEYS.PAGE_CONTENTS, {}),
  savePageContents: (data: any) => saveToStore(KEYS.PAGE_CONTENTS, data)
};

export const dbRegistry = dbNode;
