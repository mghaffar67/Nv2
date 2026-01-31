import mongoose from 'mongoose';

/**
 * Noor Official V3 - Database Registry Node
 * Refined for Vercel Serverless & AWS MongoDB Compatibility
 */

const MONGO_URI = process.env.MONGO_URI || "";

// Fix: Use globalThis for better environment compatibility
let cached = (globalThis as any).mongoose;

if (!cached) {
  cached = (globalThis as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
      console.log("📡 AWS MongoDB Cluster Connected.");
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Data Access Object (DAO) Pattern to maintain backward compatibility with previous code
export const dbNode = {
  // Schema-less style for flexibility during migration
  getCollection: async (name: string) => {
    await connectToDatabase();
    return mongoose.connection.db?.collection(name);
  },

  getUsers: async () => {
    const col = await dbNode.getCollection('users');
    return col?.find({}).toArray() || [];
  },

  findUserById: async (id: string) => {
    const col = await dbNode.getCollection('users');
    return col?.findOne({ id });
  },

  findUserByIdentifier: async (input: string) => {
    const term = input.toLowerCase().trim();
    const col = await dbNode.getCollection('users');
    return col?.findOne({ $or: [{ email: term }, { phone: term }] });
  },

  updateUser: async (id: string, updates: any) => {
    const col = await dbNode.getCollection('users');
    await col?.updateOne({ id }, { $set: updates });
    const updated = await col?.findOne({ id });
    // Global Event Sync
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('noor_db_update'));
    return updated;
  },

  saveUsers: async (users: any[]) => {
    const col = await dbNode.getCollection('users');
    // Bulk write for efficiency
    for (const user of users) {
      await col?.updateOne({ id: user.id }, { $set: user }, { upsert: true });
    }
  },

  getTasks: async () => {
    const col = await dbNode.getCollection('tasks');
    return col?.find({}).toArray() || [];
  },

  saveTasks: async (tasks: any[]) => {
    const col = await dbNode.getCollection('tasks');
    await col?.deleteMany({});
    if (tasks.length > 0) await col?.insertMany(tasks);
  },

  getIntegrations: async () => {
    const col = await dbNode.getCollection('integrations');
    return col?.find({}).toArray() || [];
  },

  saveIntegrations: async (data: any[]) => {
    const col = await dbNode.getCollection('integrations');
    await col?.deleteMany({});
    if (data.length > 0) await col?.insertMany(data);
  },

  getConfig: async () => {
    const col = await dbNode.getCollection('config');
    const config = await col?.findOne({});
    return config || {};
  },

  saveConfig: async (config: any) => {
    const col = await dbNode.getCollection('config');
    await col?.updateOne({}, { $set: config }, { upsert: true });
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('noor_db_update'));
  },

  // Fix: Added missing getPageContents method
  getPageContents: async () => {
    const col = await dbNode.getCollection('page_contents');
    const data = await col?.find({}).toArray() || [];
    return data.reduce((acc: any, curr: any) => ({ ...acc, [curr.pageKey]: curr }), {});
  },

  // Fix: Added missing savePageContents method
  savePageContents: async (data: any) => {
    const col = await dbNode.getCollection('page_contents');
    for (const key in data) {
      const entry = data[key];
      await col?.updateOne({ pageKey: key }, { $set: entry }, { upsert: true });
    }
  },

  // Fix: Added missing getRewards method
  getRewards: async () => {
    const col = await dbNode.getCollection('rewards');
    return col?.find({}).toArray() || [];
  },

  // Fix: Added missing saveRewards method
  saveRewards: async (rewards: any[]) => {
    const col = await dbNode.getCollection('rewards');
    await col?.deleteMany({});
    if (rewards.length > 0) await col?.insertMany(rewards);
  }
};

export const dbRegistry = dbNode;