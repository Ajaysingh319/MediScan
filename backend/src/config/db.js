import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { env } from "./env.js";
import { logger } from "../utils/logger.js";

// Ensure the directory for the SQLite file exists.
const dbDir = path.dirname(env.dbPath);
if (dbDir && !fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const db = new Database(env.dbPath);
db.pragma("journal_mode = WAL");

// Schema — created once on boot if it doesn't already exist.
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL,
    email      TEXT    NOT NULL UNIQUE,
    password   TEXT    NOT NULL,
    created_at TEXT    NOT NULL DEFAULT (datetime('now'))
  );
`);

logger.info("SQLite ready", { path: env.dbPath });
