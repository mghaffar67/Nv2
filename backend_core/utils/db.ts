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

  findUserByReferralCode: async (code: string) => {
    const res = await query('SELECT * FROM users WHERE referral_code = $1', [code]);
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
      supportMessages: 'support_messages', // Note: Schema doesn't have this yet, might need JSONB or separate table
      planExpiry: 'plan_expiry'
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

  // --- INTEGRATIONS ---

  getIntegrations: async () => {
    const res = await query("SELECT * FROM integrations ORDER BY created_at DESC");
    return res.rows;
  },

  createIntegration: async (data: any) => {
    const { name, type, content, isActive, position } = data;
    const res = await query(
      `INSERT INTO integrations (name, type, content, is_active, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING *`,
      [name, type, content, isActive !== undefined ? isActive : true]
    );
    return res.rows[0];
  },

  updateIntegration: async (id: string, updates: any) => {
    const fields = Object.keys(updates);
    if (fields.length === 0) return null;

    const columnMap: Record<string, string> = {
      isActive: 'is_active',
      createdAt: 'created_at'
    };

    const setClause = fields.map((f, i) => `${columnMap[f] || f} = $${i + 2}`).join(', ');
    const values = fields.map(f => updates[f]);

    const res = await query(
      `UPDATE integrations SET ${setClause} WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    return res.rows[0];
  },

  deleteIntegration: async (id: string) => {
    await query('DELETE FROM integrations WHERE id = $1', [id]);
  },

  // Compatibility wrapper for saveIntegrations if needed by old controller logic
  // Ideally, controller should be updated to use create/update/delete
  saveIntegrations: async (data: any[]) => {
    // This is complex to map to individual rows without IDs or logic.
    // For now, we assume the controller handles individual updates or we warn.
    console.warn("dbNode.saveIntegrations is deprecated. Use create/update/deleteIntegration.");
  },
  
  getIntegrationsFromSettings: async () => {
    // Deprecated, use getIntegrations
    return dbNode.getIntegrations();
  },

  // --- SUPPORT TICKETS ---

  createSupportTicket: async (ticket: any) => {
    const { userId, subject, message } = ticket;
    const res = await query(
      `INSERT INTO support_tickets (user_id, subject, message, status, created_at)
       VALUES ($1, $2, $3, 'open', NOW())
       RETURNING *`,
      [userId, subject, message]
    );
    return res.rows[0];
  },

  getSupportTickets: async (userId?: string) => {
    let q = 'SELECT * FROM support_tickets';
    const params = [];
    if (userId) {
      q += ' WHERE user_id = $1';
      params.push(userId);
    }
    q += ' ORDER BY created_at DESC';
    const res = await query(q, params);
    return res.rows;
  },

  updateSupportTicket: async (id: string, updates: any) => {
    const { status, adminReply } = updates;
    const res = await query(
      `UPDATE support_tickets SET status = COALESCE($2, status), admin_reply = COALESCE($3, admin_reply) WHERE id = $1 RETURNING *`,
      [id, status, adminReply]
    );
    return res.rows[0];
  },

  // --- USER REWARDS ---

  getUserRewards: async (userId: string) => {
    const res = await query('SELECT * FROM user_rewards WHERE user_id = $1', [userId]);
    return res.rows;
  },

  getAllUserRewards: async () => {
    const res = await query('SELECT * FROM user_rewards');
    return res.rows;
  },

  claimUserReward: async (userId: string, rewardId: string) => {
    const res = await query(
      `INSERT INTO user_rewards (user_id, reward_id, claimed_at)
       VALUES ($1, $2, NOW())
       RETURNING *`,
      [userId, rewardId]
    );
    return res.rows[0];
  },

  // --- PLAN PURCHASES ---

  createPlanPurchase: async (purchase: any) => {
    const { userId, planId, amount, method, status, trxId, proofImage, expiresAt } = purchase;
    const res = await query(
      `INSERT INTO plan_purchases (user_id, plan_id, amount, method, status, trx_id, proof_image, expires_at, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
       RETURNING *`,
      [userId, planId, amount, method, status || 'pending', trxId, proofImage, expiresAt]
    );
    return res.rows[0];
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