
/**
 * Noor Official V3 - Centralized Data Storage
 * Logic: Fixed identity mapping and normalized lookups
 */

const DB_KEY = 'noor_v3_main_db';
const EXPORT_HISTORY_KEY = 'noor_db_exports';
const isNode = typeof window === 'undefined';

const defaultUsers = [
  { 
    id: 'ADM-101', 
    name: 'Main Admin', 
    email: 'admin@noor.com', 
    phone: '03000000000',
    password: 'admin123', 
    role: 'admin', 
    balance: 1000000, 
    currentPlan: 'DIAMOND', 
    referralCode: 'NOOR-MAIN', 
    createdAt: new Date().toISOString(),
    transactions: []
  },
  { 
    id: 'USR-202', 
    name: 'Zeeshan Malik', 
    email: 'user@noor.com', 
    phone: '03123456789',
    password: 'user123', 
    role: 'user', 
    balance: 5000, 
    currentPlan: 'GOLD ELITE', 
    referralCode: 'ZEE-786', 
    referredBy: 'NOOR-MAIN',
    streak: 2,
    lastCheckIn: new Date().toISOString(),
    transactions: [],
    completedTasksToday: [],
    createdAt: new Date().toISOString() 
  }
];

/**
 * Normalizes Phone/Email for high-precision lookup
 * Handles: +92300, 92300, 0300, and spaces
 */
const normalize = (val: string) => {
  if (!val) return '';
  let clean = val.toLowerCase().trim().replace(/\s/g, '');
  
  // Handle Pakistani Phone formats
  if (clean.startsWith('+92')) clean = '0' + clean.slice(3);
  else if (clean.startsWith('92') && clean.length > 10) clean = '0' + clean.slice(2);
  
  // Return alphanumeric only for comparison
  return clean.replace(/[^0-9a-z@.]/g, '');
};

export const dbRegistry = {
  getUsers: () => {
    if (isNode) return defaultUsers;
    const data = localStorage.getItem(DB_KEY);
    if (!data) {
      localStorage.setItem(DB_KEY, JSON.stringify(defaultUsers));
      return defaultUsers;
    }
    return JSON.parse(data);
  },
  
  saveUsers: (users: any[]) => {
    if (!isNode) localStorage.setItem(DB_KEY, JSON.stringify(users));
  },

  findUserByIdentifier: (input: string) => {
    const users = dbRegistry.getUsers();
    const target = normalize(input);
    
    return users.find((u: any) => {
      const uEmail = normalize(u.email);
      const uPhone = normalize(u.phone);
      return uEmail === target || uPhone === target;
    });
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

  resetDatabase: () => {
    if (!isNode) {
      localStorage.removeItem(DB_KEY);
      localStorage.removeItem(EXPORT_HISTORY_KEY);
      localStorage.removeItem('noor_tasks_db');
      localStorage.removeItem('noor_config');
      localStorage.removeItem('noor_token');
      localStorage.removeItem('noor_user');
      window.location.reload();
    }
  },

  getExportHistory: () => {
    if (isNode) return [];
    const data = localStorage.getItem(EXPORT_HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  },

  addExportRecord: (record: any) => {
    const history = dbRegistry.getExportHistory();
    history.unshift({ ...record, id: Date.now(), timestamp: new Date().toISOString() });
    localStorage.setItem(EXPORT_HISTORY_KEY, JSON.stringify(history.slice(0, 30)));
  }
};

export const dbNode = dbRegistry;
