import { INITIAL_USERS, INITIAL_TASKS, INITIAL_CONFIG } from '../../src/data/mockTasks';

/**
 * Noor Official V3 - Master Registry Node
 * Refined to prevent LocalStorage Quota Exceeded errors and fix path resolution.
 */

const ENRICHED_TASKS = [
  ...INITIAL_TASKS,
  { id: 'TASK-AMZ-001', title: 'Viral Network Expansion', reward: 500, category: 'social_media', plan: 'DIAMOND', instruction: 'Post a 1-minute video about Noor V3 on TikTok and tag us.', isActive: true },
  { id: 'TASK-AMZ-002', title: 'Premium Article Hub', reward: 250, category: 'content_creation', plan: 'GOLD ELITE', instruction: 'Write a 200-word positive review on your blog or forum.', isActive: true },
  { id: 'TASK-TST-001', title: 'Beta Node Testing: V4 UI', reward: 150, category: 'verification', plan: 'STANDARD', instruction: 'Explore the new navigation menu and check if the PKR balance syncs smoothly. Take a screenshot of the dashboard and upload below.', isActive: true },
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

/**
 * Strips heavy data from the entire user array to keep registry size manageable.
 */
const pruneMasterRegistry = (users: any[]) => {
  return users.map(user => ({
    ...user,
    workSubmissions: (user.workSubmissions || []).slice(0, 10).map((s: any) => ({
      ...s,
      userAnswer: s.userAnswer?.length > 1000 ? s.userAnswer.substring(0, 500) + "...[TRUNCATED]" : s.userAnswer
    })),
    transactions: (user.transactions || []).slice(0, 20).map((t: any) => ({
      ...t,
      proofImage: t.proofImage?.length > 1000 ? t.proofImage.substring(0, 500) + "...[TRUNCATED]" : t.proofImage
    }))
  }));
};

const slimUserForSession = (user: any) => {
  if (!user) return null;
  const { password, ...slim } = user;
  
  if (slim.workSubmissions) {
    slim.workSubmissions = slim.workSubmissions.map((s: any) => ({
      ...s,
      userAnswer: s.userAnswer && s.userAnswer.length > 200 ? "[BLOB_DATA_STRIPPED]" : s.userAnswer
    }));
  }

  if (slim.transactions) {
    slim.transactions = slim.transactions.map((t: any) => ({
      ...t,
      proofImage: t.proofImage && t.proofImage.length > 200 ? "[PROOFOF_SYNC_STRIPPED]" : t.proofImage
    }));
  }
  
  return slim;
};

const getFromStore = (key: string, fallback: any) => {
  if (isNode) return fallback;
  const data = localStorage.getItem(key);
  if (!data) {
    try {
      localStorage.setItem(key, JSON.stringify(fallback));
    } catch (e) {
      console.warn(`Initial write failed for ${key}`);
    }
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
    try {
      let finalData = data;
      // If we are saving users, prune them first to prevent quota issues
      if (key === KEYS.USERS) {
        finalData = pruneMasterRegistry(data);
      }
      
      localStorage.setItem(key, JSON.stringify(finalData));
      notifySystemChange();
    } catch (e: any) {
      if (e.name === 'QuotaExceededError' || e.message?.includes('exceeded the quota')) {
        console.error("CRITICAL: LocalStorage Quota Exceeded. Emergency pruning triggered.");
        // Clear non-critical large items
        localStorage.removeItem(KEYS.INTEGRATIONS);
        localStorage.removeItem(KEYS.PAGE_CONTENTS);
        
        // Re-attempt with even more aggressive pruning
        const doublePruned = data.map((u: any) => ({
          ...u,
          workSubmissions: (u.workSubmissions || []).slice(0, 3).map((s: any) => ({ ...s, userAnswer: "[EMERGENCY_PURGE]" })),
          transactions: (u.transactions || []).slice(0, 5).map((t: any) => ({ ...t, proofImage: "[EMERGENCY_PURGE]" }))
        }));
        
        try {
          localStorage.setItem(key, JSON.stringify(doublePruned));
        } catch (e2) {
          throw new Error("Registry capacity critical. Please clear site data.");
        }
      } else {
        throw e;
      }
    }
  }
};

export const dbNode = {
  getUsers: () => getFromStore(KEYS.USERS, INITIAL_USERS),
  
  saveUsers: (users: any[]) => {
    // 1. Save the full data to the master registry
    saveToStore(KEYS.USERS, users);
    
    // 2. Update the session user with a SLIMMED version
    if (!isNode) {
      const sessionUserStr = localStorage.getItem('noor_user');
      if (sessionUserStr) {
        try {
          const sessionUser = JSON.parse(sessionUserStr);
          const updated = users.find(u => u.id === sessionUser.id);
          if (updated) {
            const slim = slimUserForSession(updated);
            localStorage.setItem('noor_user', JSON.stringify(slim));
          }
        } catch (e) {
          console.error("Session update node failed.");
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