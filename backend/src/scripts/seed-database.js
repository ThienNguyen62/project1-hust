import { readFile } from 'node:fs/promises';
import { getPool } from '../config/database.js';

const seedFile = new URL('../../../database/seed.sql', import.meta.url);
let pool;
let connection;
let step = 0;

try {
  const script = await readFile(seedFile, 'utf8');
  const statements = script.split(/^-- seed:statement[ \t]*\r?$/m).map((sql) => sql.trim()).filter(Boolean);
  pool = getPool();
  connection = await pool.getConnection();
  for (const sql of statements) {
    step++;
    await connection.query(sql);
  }

  console.log('Đã chạy xong database/seed.sql.');
} catch (error) {
  if (connection) await connection.rollback();
  console.error(`Seed thất bại${step ? ` ở câu lệnh ${step}` : ''}: ${error.message}`);
  process.exitCode = 1;
} finally {
  connection?.release();
  if (pool) await pool.end();
}
