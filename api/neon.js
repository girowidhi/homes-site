import { neon } from '@neondatabase/serverless';

let sql;

export function getSql() {
  if (!sql) {
    if (!process.env.NEON_DB_URL) throw new Error('NEON_DB_URL environment variable is not set');
    sql = neon(process.env.NEON_DB_URL);
  }
  return sql;
}
