import { neon } from '@neondatabase/serverless';

let sql;

export function getSql() {
  if (!sql) sql = neon(process.env.NEON_DB_URL || '');
  return sql;
}
