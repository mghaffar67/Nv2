
import { INITIAL_USERS } from '../../src/data/mockRegistry';

const DB_KEY = 'noor_v3_unified_storage';
// Added key for export history storage
const HISTORY_KEY = 'noor_v3_export_history';
const isNode = typeof window === 'undefined';

/**
 * Identity Normalizer: 
 * Ensures '0300...' and '300...' are treated the same for login.
 */
const normalize = (val: string) => {
  if (!val) return '';
  let clean = val.toLowerCase().trim().replace(/\s+/g, '');
  if (clean.includes('@')) return clean;
  let digits = clean.replace(/[^0-9]/g, '');
  if (digits.startsWith('92') && digits.length > 10) digits = '0' + digits.slice(2);
  else if (digits.length === 10 && !digits.startsWith('0')) digits = '0' + digits;
  return digits;
};

export const dbRegistry = {
  getUsers: () => {
    if (isNode) return INITIAL_USERS;
    const data = localStorage.getItem(DB_KEY);
    if (!data) {
      localStorage.setItem(DB_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    try {
      return JSON.parse(data);
    } catch (e) {
      localStorage.setItem(DB_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
  },
  
  saveUsers: (users: any[]) => {
    if (!isNode) localStorage.setItem(DB_KEY, JSON.stringify(users));
  },

  /**
   * FACTORY RESET PROTOCOL
   * Clears EVERYTHING and reloads initial registry.
   */
  factoryReset: () => {
    if (!isNode) {
      localStorage.clear(); 
      localStorage.setItem(DB_KEY, JSON.stringify(INITIAL_USERS));
      return true;
    }
    return false;
  },

  findUserByIdentifier: (input: string) => {
    const users = dbRegistry.getUsers();
    const target = normalize(input);
    return users.find((u: any) => normalize(u.email) === target || normalize(u.phone) === target);
  },

  findUserById: (id: string) => {
    return dbRegistry.getUsers().find((u: any) => u.id === id);
  },

  updateUser: (id: string, updates: any) => {
    const users = dbRegistry.getUsers();
    const idx = users.findIndex((u: any) => u.id === id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates };
      dbRegistry.saveUsers(users);
      return users[idx];
    }
    return null;
  },

  // Fix: Added missing getExportHistory method for audit logs
  getExportHistory: () => {
    if (isNode) return [];
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  },

  // Fix: Added missing addExportRecord method to log registry backups
  addExportRecord: (record: any) => {
    if (isNode) return;
    const history = dbRegistry.getExportHistory();
    const newRecord = { ...record, timestamp: new Date().toISOString() };
    localStorage.setItem(HISTORY_KEY, JSON.stringify([newRecord, ...history].slice(0, 10)));
  }
};

export const dbNode = dbRegistry;
