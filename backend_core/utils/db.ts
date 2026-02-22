import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_USERS, INITIAL_TASKS, INITIAL_CONFIG } from '../../src/data/mockRegistry';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Noor V3 - Server-Side Persistence Node
 * Uses JSON files for data persistence in the Node.js environment.
 */
const DATA_DIR = path.resolve(process.cwd(), 'data');

console.log(`[DB_NODE] Initializing persistence at: ${DATA_DIR}`);

if (!fs.existsSync(DATA_DIR)) {
  console.log(`[DB_NODE] Creating data directory...`);
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const STORAGE_KEYS = {
  USERS: 'users.json',
  TASKS: 'tasks.json',
  CONFIG: 'config.json',
  CONTENTS: 'contents.json',
  INTEGRATIONS: 'integrations.json',
  REWARDS: 'rewards.json'
};

const get = (filename: string, fallback: any) => {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2));
    return fallback;
  }
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${filename}:`, err);
    return fallback;
  }
};

const save = (filename: string, data: any) => {
  const filePath = path.join(DATA_DIR, filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Error saving ${filename}:`, err);
  }
};

export const dbNode = {
  getUsers: async () => get(STORAGE_KEYS.USERS, INITIAL_USERS),
  saveUsers: async (users: any[]) => save(STORAGE_KEYS.USERS, users),
  
  findUserById: async (id: string) => {
    const users = await dbNode.getUsers();
    return users.find((u: any) => u.id === id) || null;
  },

  findUserByIdentifier: async (input: string) => {
    const users = await dbNode.getUsers();
    const term = input.toLowerCase().trim();
    return users.find((u: any) => u.email.toLowerCase() === term || u.phone === term) || null;
  },

  updateUser: async (id: string, updates: any) => {
    const users = await dbNode.getUsers();
    const idx = users.findIndex((u: any) => u.id === id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates };
      await dbNode.saveUsers(users);
      return users[idx];
    }
    return null;
  },

  getTasks: async () => get(STORAGE_KEYS.TASKS, INITIAL_TASKS),
  saveTasks: async (tasks: any[]) => save(STORAGE_KEYS.TASKS, tasks),

  getConfig: async () => get(STORAGE_KEYS.CONFIG, INITIAL_CONFIG),
  saveConfig: async (config: any) => save(STORAGE_KEYS.CONFIG, config),

  getPageContents: async () => get(STORAGE_KEYS.CONTENTS, {}),
  savePageContents: async (data: any) => save(STORAGE_KEYS.CONTENTS, data),

  getIntegrations: async () => get(STORAGE_KEYS.INTEGRATIONS, []),
  saveIntegrations: async (data: any[]) => save(STORAGE_KEYS.INTEGRATIONS, data),

  getRewards: async () => get(STORAGE_KEYS.REWARDS, []),
  saveRewards: async (data: any[]) => save(STORAGE_KEYS.REWARDS, data)
};