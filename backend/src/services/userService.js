import bcrypt from "bcryptjs";
import { db } from "../config/db.js";

const SALT_ROUNDS = 10;

/** Strips the password hash before a user object is ever sent to the client. */
const toPublic = (row) =>
  row ? { id: row.id, name: row.name, email: row.email, createdAt: row.created_at } : null;

export const findByEmail = (email) =>
  db.prepare("SELECT * FROM users WHERE email = ?").get(email.toLowerCase());

export const findPublicById = (id) =>
  toPublic(db.prepare("SELECT * FROM users WHERE id = ?").get(id));

/** Creates a user with a hashed password. Returns the public (safe) record. */
export const createUser = async ({ name, email, password }) => {
  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  const info = db
    .prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)")
    .run(name.trim(), email.toLowerCase(), hash);
  return findPublicById(info.lastInsertRowid);
};

/** Verifies a plaintext password against a stored user row. */
export const verifyPassword = (plain, hash) => bcrypt.compare(plain, hash);

export const publicUser = toPublic;
