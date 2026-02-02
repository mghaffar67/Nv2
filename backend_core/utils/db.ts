import { INITIAL_USERS, INITIAL_TASKS, INITIAL_CONFIG } from '../../data/mockRegistry';

/**
 * Noor Official V3 - Persistent Data Node (Browser Implementation)
 * Optimized for local persistence while maintaining DB-style async interface.
 */

const STORAGE_KEY = 'noor_v3_persistent_registry';

const getStore = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    const initial = {
      users: INITIAL_USERS,
      tasks: INITIAL_TASKS,
      config: INITIAL_CONFIG,
      integrations: [],
      pageContents: {},
      rewards: []
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(data);
};

const saveStore = (data: any) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  // Trigger global sync event for UI components
  window.dispatchEvent(new Event('noor_db_update'));
};

export const dbNode = {
  // Connection Simulation
  async connect() {
    console.log("✅ [DATABASE]: Persistent Storage Node Linked.");
    return true;
  },

  // --- USER NODES ---
  async getUsers() {
    return getStore().users;
  },

  async saveUsers(users: any[]) {
    const store = getStore();
    store.users = users;
    saveStore(store);
  },

  // Added deleteUser to fix error in admin/controller.ts
  async deleteUser(id: string) {
    const store = getStore();
    store.users = store.users.filter((u: any) => u.id !== id);
    saveStore(store);
  },

  async findUserById(id: string) {
    return getStore().users.find((u: any) => u.id === id);
  },

  async findUserByIdentifier(input: string) {
    const term = input.toLowerCase().trim();
    return getStore().users.find((u: any) => 
      u.email.toLowerCase() === term || u.phone === term
    );
  },

  async updateUser(id: string, updates: any) {
    const store = getStore();
    const idx = store.users.findIndex((u: any) => u.id === id);
    if (idx !== -1) {
      store.users[idx] = { ...store.users[idx], ...updates };
      saveStore(store);
      return store.users[idx];
    }
    return null;
  },

  // --- TASK NODES ---
  async getTasks() {
    return getStore().tasks;
  },

  async saveTasks(tasks: any[]) {
    const store = getStore();
    store.tasks = tasks;
    saveStore(store);
  },

  async deleteTask(id: string) {
    const store = getStore();
    store.tasks = store.tasks.filter((t: any) => t.id !== id);
    saveStore(store);
  },

  // --- CONFIG NODES ---
  async getConfig() {
    return getStore().config;
  },

  async saveConfig(config: any) {
    const store = getStore();
    store.config = config;
    saveStore(store);
  },

  // --- REWARD NODES ---
  async getRewards() {
    return getStore().rewards || [];
  },

  async saveRewards(data: any[]) {
    const store = getStore();
    store.rewards = data;
    saveStore(store);
  },

  // --- INTEGRATION NODES ---
  async getIntegrations() {
    return getStore().integrations || [];
  },

  async saveIntegrations(data: any[]) {
    const store = getStore();
    store.integrations = data;
    saveStore(store);
  },

  // Added getPageContents to fix error in system/pageContentController.ts and contentController.ts
  async getPageContents() {
    return getStore().pageContents || {};
  },

  // Added savePageContents to fix error in system/pageContentController.ts and contentController.ts
  async savePageContents(data: any) {
    const store = getStore();
    store.pageContents = data;
    saveStore(store);
  }
};

export const dbRegistry = dbNode;