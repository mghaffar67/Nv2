
import 'dotenv/config';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL environment variable is missing.');
}

export const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false // Required for Supabase in some environments, though ideally true with CA
  },
  max: 20, // Connection pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  client?.query('SELECT NOW()', (err, result) => {
    release();
    if (err) {
      return console.error('Error executing query', err.stack);
    }
    console.log('Connected to Supabase PostgreSQL:', result.rows[0]);
  });
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
