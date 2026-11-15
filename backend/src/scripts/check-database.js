import { getPool } from '../config/database.js';

let pool;
try {
  pool = getPool();
  const [rows] = await pool.execute('SELECT 1 AS connected, DATABASE() AS database_name');
  console.log('MySQL connection successful:', rows[0]);
} catch (error) {
  console.error('MySQL connection failed:', error.code || error.message);
  process.exitCode = 1;
} finally {
  if (pool) await pool.end();
}
