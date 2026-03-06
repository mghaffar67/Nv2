
import { pool } from '../utils/pg';

const createTables = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Enable pgcrypto for UUID generation
    await client.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');

    // 1. Users Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        balance NUMERIC DEFAULT 0,
        current_plan TEXT DEFAULT 'None',
        streak_count INTEGER DEFAULT 0,
        last_task_date DATE,
        referral_code TEXT UNIQUE,
        referred_by TEXT,
        role TEXT DEFAULT 'user',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        is_banned BOOLEAN DEFAULT FALSE,
        phone TEXT
      );
    `);

    // 2. Plans Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS plans (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        price NUMERIC NOT NULL,
        daily_task_limit INTEGER NOT NULL,
        validity_days INTEGER NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 3. Tasks Table (Submissions)
    await client.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id),
        task_number INTEGER NOT NULL,
        pdf_url TEXT,
        status TEXT DEFAULT 'pending', -- pending, approved, rejected
        reward NUMERIC DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        admin_note TEXT
      );
    `);

    // 4. Transactions Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id),
        type TEXT NOT NULL, -- deposit, withdraw
        amount NUMERIC NOT NULL,
        status TEXT DEFAULT 'pending', -- pending, approved, rejected
        proof_image TEXT,
        gateway TEXT,
        trx_id TEXT,
        sender_number TEXT,
        account_number TEXT,
        account_title TEXT,
        admin_note TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        processed_at TIMESTAMP WITH TIME ZONE
      );
    `);

    // 5. Settings Table (Key-Value Store for Config)
    await client.query(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value JSONB
      );
    `);

    // 6. Integrations Table (Scripts/Popups)
    await client.query(`
      CREATE TABLE IF NOT EXISTS integrations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        type TEXT NOT NULL, -- script, popup
        content TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await client.query('COMMIT');
    console.log('Database schema initialized successfully.');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Error initializing database schema:', e);
  } finally {
    client.release();
  }
};

createTables().then(() => process.exit(0));
