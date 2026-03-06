import { query } from './pg';
import { INITIAL_CONFIG, INITIAL_TASKS } from '../../src/data/mockRegistry';

/**
 * Noor V3 - PostgreSQL Persistence Node
 * Uses 'pg' library to interact with Supabase PostgreSQL.
 */

export const dbNode = {
  // --- USER OPERATIONS ---
  
  findUserById: async (id: string) => {
    const res = await query('SELECT * FROM users WHERE id = $1', [id]);
    return res.rows[0] || null;
  },

  findUserByIdentifier: async (input: string) => {
    const term = input.toLowerCase().trim();
    const res = await query('SELECT * FROM users WHERE email = $1 OR phone = $1', [term]);
    return res.rows[0] || null;
  },

  createUser: async (user: any) => {
    const { name, email, phone, password, referralCode, referredBy, role, balance, currentPlan } = user;
    const res = await query(
      `INSERT INTO users (name, email, phone, password, referral_code, referred_by, role, balance, current_plan, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
       RETURNING *`,
      [name, email, phone, password, referralCode, referredBy, role || 'user', balance || 0, currentPlan || 'None']
    );
    return res.rows[0];
  },

  updateUser: async (id: string, updates: any) => {
    const fields = Object.keys(updates);
    if (fields.length === 0) return null;

    // Map camelCase to snake_case for DB columns if necessary
    const columnMap: Record<string, string> = {
      referralCode: 'referral_code',
      referredBy: 'referred_by',
      currentPlan: 'current_plan',
      streak: 'streak_count',
      lastWorkDate: 'last_task_date',
      isBanned: 'is_banned',
      supportMessages: 'support_messages' // Note: Schema doesn't have this yet, might need JSONB or separate table
    };

    const setClause = fields.map((f, i) => `${columnMap[f] || f} = $${i + 2}`).join(', ');
    const values = fields.map(f => updates[f]);

    const res = await query(
      `UPDATE users SET ${setClause} WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    return res.rows[0];
  },

  getReferralTeam: async (referralCode: string) => {
    // Level 1
    const t1 = await query(`SELECT id, name, current_plan as "currentPlan", created_at as "createdAt", is_banned as "isBanned", referral_code as "referralCode" FROM users WHERE referred_by = $1`, [referralCode]);
    
    // Level 2
    const t1Codes = t1.rows.map(u => u.referralCode).filter(Boolean);
    let t2: any[] = [];
    if (t1Codes.length > 0) {
      const res = await query(`SELECT id, name, current_plan as "currentPlan", created_at as "createdAt", is_banned as "isBanned", referral_code as "referralCode" FROM users WHERE referred_by = ANY($1)`, [t1Codes]);
      t2 = res.rows;
    }

    // Level 3
    const t2Codes = t2.map(u => u.referralCode).filter(Boolean);
    let t3: any[] = [];
    if (t2Codes.length > 0) {
      const res = await query(`SELECT id, name, current_plan as "currentPlan", created_at as "createdAt", is_banned as "isBanned", referral_code as "referralCode" FROM users WHERE referred_by = ANY($1)`, [t2Codes]);
      t3 = res.rows;
    }

    return { t1: t1.rows, t2, t3 };
  },

  getAllUsers: async () => {
    const res = await query('SELECT * FROM users ORDER BY created_at DESC');
    return res.rows;
  },

  // Compatibility method
  getUsers: async () => {
    return dbNode.getAllUsers();
  },

  // Compatibility method - This is dangerous but needed for legacy code that pushes to array and saves
  // We should ideally refactor all callers, but for now we log a warning.
  saveUsers: async (users: any[]) => {
    console.warn("dbNode.saveUsers is deprecated. Use createUser or updateUser instead.");
    // No-op or implement bulk upsert if critical
  },

  // --- TRANSACTION OPERATIONS ---

  createTransaction: async (trx: any) => {
    const { userId, type, amount, status, gateway, trxId, senderNumber, accountNumber, accountTitle, proofImage, adminNote } = trx;
    const res = await query(
      `INSERT INTO transactions (user_id, type, amount, status, gateway, trx_id, sender_number, account_number, account_title, proof_image, admin_note, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
       RETURNING *`,
      [userId, type, amount, status || 'pending', gateway, trxId, senderNumber, accountNumber, accountTitle, proofImage, adminNote]
    );
    return res.rows[0];
  },

  getUserTransactions: async (userId: string) => {
    const res = await query('SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return res.rows;
  },

  getTransactionById: async (id: string) => {
    const res = await query('SELECT * FROM transactions WHERE id = $1', [id]);
    return res.rows[0];
  },

  updateTransactionStatus: async (id: string, status: string, adminNote?: string) => {
    const res = await query(
      `UPDATE transactions SET status = $2, admin_note = $3, processed_at = NOW() WHERE id = $1 RETURNING *`,
      [id, status, adminNote]
    );
    return res.rows[0];
  },

  getPendingStats: async () => {
    const deposits = await query(`SELECT COUNT(*) FROM transactions WHERE type = 'deposit' AND status = 'pending'`);
    const withdrawals = await query(`SELECT COUNT(*) FROM transactions WHERE type = 'withdraw' AND status = 'pending'`);
    return {
      deposits: parseInt(deposits.rows[0].count),
      withdrawals: parseInt(withdrawals.rows[0].count)
    };
  },

  // --- TASK OPERATIONS ---

  createTaskSubmission: async (task: any) => {
    const { userId, taskNumber, pdfUrl, status, reward, adminNote } = task;
    const res = await query(
      `INSERT INTO tasks (user_id, task_number, pdf_url, status, reward, admin_note, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING *`,
      [userId, taskNumber, pdfUrl, status || 'pending', reward, adminNote]
    );
    return res.rows[0];
  },

  getTaskSubmissions: async (userId: string, date?: string) => {
    let q = 'SELECT * FROM tasks WHERE user_id = $1';
    const params = [userId];
    if (date) {
      q += ' AND created_at::date = $2';
      params.push(date);
    }
    q += ' ORDER BY created_at DESC';
    const res = await query(q, params);
    return res.rows;
  },

  // Compatibility
  getTasks: async () => {
    return INITIAL_TASKS;
  },
  
  saveTasks: async (tasks: any[]) => {
    console.warn("dbNode.saveTasks is deprecated.");
  },

  // --- CONFIG / SETTINGS ---

  getConfig: async () => {
    const res = await query("SELECT value FROM settings WHERE key = 'config'");
    return res.rows[0]?.value || INITIAL_CONFIG;
  },

  saveConfig: async (config: any) => {
    await query(
      `INSERT INTO settings (key, value) VALUES ('config', $1)
       ON CONFLICT (key) DO UPDATE SET value = $1`,
      [config]
    );
  },

  getIntegrations: async () => {
    const res = await query("SELECT * FROM integrations WHERE is_active = TRUE");
    return res.rows;
  },

  saveIntegrations: async (data: any[]) => {
    await query(
      `INSERT INTO settings (key, value) VALUES ('integrations', $1)
       ON CONFLICT (key) DO UPDATE SET value = $1`,
      [data]
    );
  },
  
  getIntegrationsFromSettings: async () => {
    const res = await query("SELECT value FROM settings WHERE key = 'integrations'");
    return res.rows[0]?.value || [];
  },

  getRewards: async () => {
    const res = await query("SELECT value FROM settings WHERE key = 'rewards'");
    return res.rows[0]?.value || [];
  },

  saveRewards: async (data: any[]) => {
    await query(
      `INSERT INTO settings (key, value) VALUES ('rewards', $1)
       ON CONFLICT (key) DO UPDATE SET value = $1`,
      [data]
    );
  },

  getPageContents: async () => {
    const res = await query("SELECT value FROM settings WHERE key = 'contents'");
    return res.rows[0]?.value || {};
  },

  savePageContents: async (data: any) => {
    await query(
      `INSERT INTO settings (key, value) VALUES ('contents', $1)
       ON CONFLICT (key) DO UPDATE SET value = $1`,
      [data]
    );
  }
};