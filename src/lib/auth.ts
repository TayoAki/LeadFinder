import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import type { DB } from "./db.ts";
import { WELCOME_CREDITS, grant } from "./credits.ts";

export const SESSION_COOKIE = "lf_session";
export const SESSION_DAYS = 30;

export interface User {
  id: number;
  email: string;
  name: string;
  role: "admin" | "customer";
}

const hashToken = (t: string) => crypto.createHash("sha256").update(t).digest("hex");

export class AuthError extends Error {}

export function signUp(db: DB, input: { name: string; email: string; password: string; acceptedTerms: boolean }): User {
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim();
  if (!name) throw new AuthError("Name is required");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new AuthError("Enter a valid email");
  if (input.password.length < 8) throw new AuthError("Password must be at least 8 characters");
  if (!input.acceptedTerms) throw new AuthError("Please confirm you'll use LeadFinder for B2B outreach and respect opt-outs");
  const hash = bcrypt.hashSync(input.password, 10);
  return db.transaction(() => {
    if (db.prepare("SELECT 1 FROM users WHERE email = ?").get(email)) throw new AuthError("An account with that email already exists");
    // First account is the admin; everyone after is a customer.
    const isFirst = !db.prepare("SELECT 1 FROM users LIMIT 1").get();
    const role = isFirst ? "admin" : "customer";
    const { lastInsertRowid } = db
      .prepare("INSERT INTO users (email, name, password_hash, role, accepted_terms_at) VALUES (?, ?, ?, ?, datetime('now'))")
      .run(email, name, hash, role);
    const id = Number(lastInsertRowid);
    grant(db, id, WELCOME_CREDITS, `Welcome credits`);
    return { id, email, name, role } as User;
  })();
}

export function logIn(db: DB, emailRaw: string, password: string): User {
  const row = db.prepare("SELECT id, email, name, role, password_hash FROM users WHERE email = ?").get(emailRaw.trim().toLowerCase()) as
    | (User & { password_hash: string })
    | undefined;
  if (!row || !bcrypt.compareSync(password, row.password_hash)) throw new AuthError("Wrong email or password");
  const { password_hash: _, ...user } = row;
  return user;
}

export function createSession(db: DB, userId: number): { token: string; expires: Date } {
  const token = crypto.randomBytes(32).toString("base64url");
  const expires = new Date(Date.now() + SESSION_DAYS * 86400_000);
  db.prepare("INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)").run(hashToken(token), userId, expires.toISOString());
  return { token, expires };
}

export function userForSession(db: DB, token: string | undefined): User | null {
  if (!token) return null;
  const row = db
    .prepare(
      `SELECT u.id, u.email, u.name, u.role FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE s.token_hash = ? AND s.expires_at > ?`,
    )
    .get(hashToken(token), new Date().toISOString()) as User | undefined;
  return row ?? null;
}

export function destroySession(db: DB, token: string | undefined) {
  if (token) db.prepare("DELETE FROM sessions WHERE token_hash = ?").run(hashToken(token));
}
