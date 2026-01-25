
import { INITIAL_USERS, INITIAL_TASKS, INITIAL_CONFIG } from '../../src/data/mockRegistry';

/**
 * Noor V3 - Data Persistence & Integrity Layer
 */

const KEYS = {
  USERS: 'noor_v3_master_registry',
  TASKS: 'noor_tasks_db',
  PAGES: 'noor_pages_db',
  CONFIG: 'noor_config'
};

const isNode = typeof window === 'undefined';

const notifySystemChange = () => {
  if (!isNode) {
    window.dispatchEvent(new Event('noor_db_update'));
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
  
  getTasks: () => getFromStore(KEYS.TASKS, INITIAL_TASKS),
  saveTasks: (tasks: any[]) => saveToStore(KEYS.TASKS, tasks)
};

export const dbRegistry = dbNode;
