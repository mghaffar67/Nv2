import { Signer } from "@aws-sdk/rds-signer";
import { awsCredentialsProvider } from "@vercel/functions/oidc";
import { attachDatabasePool } from "@vercel/functions";
import { Pool } from "pg";

/**
 * Noor Official V3 - AWS RDS PostgreSQL Core
 * Hardened for Vercel OIDC Federation & IAM Auth
 */

const getPool = () => {
  // Use a singleton pattern to avoid multiple connections in serverless
  if ((globalThis as any)._pgPool) return (globalThis as any)._pgPool;

  const isLocal = !process.env.PGHOST || process.env.NODE_ENV !== 'production';

  const poolConfig: any = {
    host: process.env.PGHOST || 'localhost',
    user: process.env.PGUSER || 'postgres',
    database: process.env.PGDATABASE || 'postgres',
    port: Number(process.env.PGPORT) || 5432,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  };

  if (!isLocal) {
    const signer = new Signer({
      hostname: poolConfig.host,
      port: poolConfig.port,
      username: poolConfig.user,
      region: process.env.AWS_REGION || "us-east-1",
      credentials: awsCredentialsProvider({
        roleArn: process.env.AWS_ROLE_ARN || "",
        clientConfig: { region: process.env.AWS_REGION || "us-east-1" },
      }),
    });
    
    poolConfig.password = () => signer.getAuthToken();
    poolConfig.ssl = { rejectUnauthorized: false };
  } else {
    poolConfig.password = process.env.PGPASSWORD || 'postgres';
  }

  const pool = new Pool(poolConfig);
  
  if (!isLocal) {
    attachDatabasePool(pool);
  }

  (globalThis as any)._pgPool = pool;
  return pool;
};

export const dbNode = {
  query: (text: string, params?: any[]) => getPool().query(text, params),

  getUsers: async () => {
    try {
      const res = await getPool().query("SELECT * FROM users ORDER BY created_at DESC");
      return res.rows.map((u: any) => ({
        ...u,
        transactions: typeof u.transactions === 'string' ? JSON.parse(u.transactions) : (u.transactions || []),
        workSubmissions: typeof u.work_submissions === 'string' ? JSON.parse(u.work_submissions) : (u.work_submissions || []),
        purchaseHistory: typeof u.purchase_history === 'string' ? JSON.parse(u.purchase_history) : (u.purchase_history || [])
      }));
    } catch (e) {
      console.error("DB getUsers error:", e);
      return [];
    }
  },

  findUserById: async (id: string) => {
    try {
      const res = await getPool().query("SELECT * FROM users WHERE id = $1", [id]);
      if (!res.rows[0]) return null;
      const u = res.rows[0];
      return {
        ...u,
        transactions: typeof u.transactions === 'string' ? JSON.parse(u.transactions) : (u.transactions || []),
        workSubmissions: typeof u.work_submissions === 'string' ? JSON.parse(u.work_submissions) : (u.work_submissions || []),
        purchaseHistory: typeof u.purchase_history === 'string' ? JSON.parse(u.purchase_history) : (u.purchase_history || [])
      };
    } catch (e) { return null; }
  },

  findUserByIdentifier: async (input: string) => {
    try {
      const term = input.toLowerCase().trim();
      const res = await getPool().query(
        "SELECT * FROM users WHERE LOWER(email) = $1 OR phone = $1", 
        [term]
      );
      if (!res.rows[0]) return null;
      const u = res.rows[0];
      return {
        ...u,
        transactions: typeof u.transactions === 'string' ? JSON.parse(u.transactions) : (u.transactions || []),
        workSubmissions: typeof u.work_submissions === 'string' ? JSON.parse(u.work_submissions) : (u.work_submissions || []),
        purchaseHistory: typeof u.purchase_history === 'string' ? JSON.parse(u.purchase_history) : (u.purchase_history || [])
      };
    } catch (e) { return null; }
  },

  updateUser: async (id: string, updates: any) => {
    const keys = Object.keys(updates);
    if (keys.length === 0) return null;

    const values = keys.map(k => {
      const val = updates[k];
      return (typeof val === 'object' && val !== null) ? JSON.stringify(val) : val;
    });

    const setClause = keys.map((key, i) => `${key} = $${i + 2}`).join(", ");
    const query = `UPDATE users SET ${setClause} WHERE id = $1 RETURNING *`;
    
    const res = await getPool().query(query, [id, ...values]);
    return res.rows[0];
  },

  saveUsers: async (users: any[]) => {
    for (const user of users) {
      const { id, ...data } = user;
      const keys = Object.keys(data);
      const values = keys.map(k => {
        const val = data[k];
        return (typeof val === 'object' && val !== null) ? JSON.stringify(val) : val;
      });
      const cols = keys.join(", ");
      const placeholders = keys.map((_, i) => `$${i + 2}`).join(", ");
      const updateClause = keys.map((k, i) => `${k} = $${i + 2}`).join(", ");

      const query = `
        INSERT INTO users (id, ${cols}) VALUES ($1, ${placeholders})
        ON CONFLICT (id) DO UPDATE SET ${updateClause}
      `;
      await getPool().query(query, [id, ...values]);
    }
  },

  getTasks: async () => {
    try {
      const res = await getPool().query("SELECT * FROM tasks WHERE is_active = true ORDER BY created_at DESC");
      return res.rows;
    } catch (e) { return []; }
  },

  saveTasks: async (tasks: any[]) => {
    await getPool().query("DELETE FROM tasks");
    for (const t of tasks) {
      const keys = Object.keys(t);
      const cols = keys.join(", ");
      const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");
      await getPool().query(`INSERT INTO tasks (${cols}) VALUES (${placeholders})`, Object.values(t));
    }
  },

  getConfig: async () => {
    const res = await getPool().query("SELECT content FROM global_config LIMIT 1");
    return res.rows[0]?.content || {};
  },

  saveConfig: async (config: any) => {
    await getPool().query("INSERT INTO global_config (id, content) VALUES (1, $1) ON CONFLICT (id) DO UPDATE SET content = $1", [JSON.stringify(config)]);
  },

  getPageContents: async () => {
    const res = await getPool().query("SELECT page_key, content FROM page_contents");
    return res.rows.reduce((acc: any, curr: any) => ({ ...acc, [curr.page_key]: typeof curr.content === 'string' ? JSON.parse(curr.content) : curr.content }), {});
  },

  savePageContents: async (data: any) => {
    for (const key in data) {
      await getPool().query(
        "INSERT INTO page_contents (page_key, content) VALUES ($1, $2) ON CONFLICT (page_key) DO UPDATE SET content = $2",
        [key, JSON.stringify(data[key])]
      );
    }
  },

  getIntegrations: async () => {
    try {
      const res = await getPool().query("SELECT * FROM integrations ORDER BY updated_at DESC");
      return res.rows;
    } catch(e) { return []; }
  },

  saveIntegrations: async (integrations: any[]) => {
    await getPool().query("DELETE FROM integrations");
    for (const i of integrations) {
      const keys = Object.keys(i);
      const cols = keys.join(", ");
      const placeholders = keys.map((_, idx) => `$${idx + 1}`).join(", ");
      await getPool().query(`INSERT INTO integrations (${cols}) VALUES (${placeholders})`, Object.values(i));
    }
  },

  getRewards: async () => {
    try {
      const res = await getPool().query("SELECT * FROM rewards ORDER BY updated_at DESC");
      return res.rows;
    } catch (e) { return []; }
  },

  saveRewards: async (rewards: any[]) => {
    await getPool().query("DELETE FROM rewards");
    for (const r of rewards) {
      const keys = Object.keys(r);
      const cols = keys.join(", ");
      const placeholders = keys.map((_, idx) => `$${idx + 1}`).join(", ");
      await getPool().query(`INSERT INTO rewards (${cols}) VALUES (${placeholders})`, Object.values(r));
    }
  }
};

export const dbRegistry = dbNode;