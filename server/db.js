import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

/**
 * Adds a column to the users table if it does not already exist.
 * Uses SQLite's `PRAGMA table_info` to check before issuing ALTER TABLE,
 * so re-running the migration is a no-op without the silent try/catch hack.
 */
const ensureColumn = async (db, column, definition) => {
  const columns = await db.all(`PRAGMA table_info(users)`);
  if (columns.some((c) => c.name === column)) return false;
  console.log(`[db] Migration: adding column users.${column}`);
  await db.exec(`ALTER TABLE users ADD COLUMN ${column} ${definition}`);
  return true;
};

// Database location — Railway (or any container host) mounts a persistent
// volume at /data. Locally we fall back to the in-repo SQLite file.
const DB_PATH = process.env.DATABASE_PATH
    || (process.env.NODE_ENV === 'production' ? '/data/database.sqlite' : './server/database.sqlite');

export const initDb = async () => {
  const db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      full_name TEXT,
      company_name TEXT,
      phone_number TEXT,
      role TEXT DEFAULT 'user',
      credits INTEGER DEFAULT 0,
      free_design_used INTEGER DEFAULT 0
    )
  `);

  // Idempotent column migrations
  await ensureColumn(db, 'full_name', 'TEXT');
  await ensureColumn(db, 'company_name', 'TEXT');
  await ensureColumn(db, 'phone_number', 'TEXT');

  return db;
};
