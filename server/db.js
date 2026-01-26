import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export const initDb = async () => {
  const db = await open({
    filename: './server/database.sqlite',
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

  // Migration: Add columns if they don't exist
  try { await db.exec("ALTER TABLE users ADD COLUMN full_name TEXT"); } catch (e) { }
  try { await db.exec("ALTER TABLE users ADD COLUMN company_name TEXT"); } catch (e) { }
  try { await db.exec("ALTER TABLE users ADD COLUMN phone_number TEXT"); } catch (e) { }

  return db;
};
