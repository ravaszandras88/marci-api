import { Pool } from 'pg';

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: process.env.DB_NAME || 'marci_portfolio_db',
  user: process.env.DB_USER || 'marci_user',
  password: process.env.DB_PASSWORD || 'MarciPortfolio2024!',
  ssl: false,
});

export async function query(text: string, params?: any[]) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result.rows;
  } finally {
    client.release();
  }
}

export default pool;