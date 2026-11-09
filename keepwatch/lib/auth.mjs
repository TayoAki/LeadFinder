// Accounts: Better Auth with email + password, stored in the same SQLite file (node:sqlite).
//   BETTER_AUTH_SECRET  required in production (32+ random chars)
//   BETTER_AUTH_URL     public base URL, e.g. https://keepwatch.up.railway.app
import { betterAuth } from 'better-auth';
import { getMigrations } from 'better-auth/db/migration';
import { getDb } from './db.mjs';

const PROD = process.env.NODE_ENV === 'production';
const secret = process.env.BETTER_AUTH_SECRET || (PROD ? null : 'dev-only-secret-change-me-dev-only-secret');
if (!secret) throw new Error('BETTER_AUTH_SECRET must be set in production.');

const baseURL = process.env.BETTER_AUTH_URL || `http://localhost:${process.env.PORT || 3100}`;

export const auth = betterAuth({
  appName: 'Keepwatch',
  database: getDb(),
  baseURL,
  secret,
  trustedOrigins: [baseURL, ...(process.env.TRUSTED_ORIGINS || '').split(',').filter(Boolean)],
  emailAndPassword: { enabled: true, minPasswordLength: 8, autoSignIn: true },
  session: { expiresIn: 60 * 60 * 24 * 30, updateAge: 60 * 60 * 24 },
  rateLimit: { enabled: true, window: 60, max: 30 },
  advanced: { useSecureCookies: baseURL.startsWith('https://') },
});

/** Create or update Better Auth's tables (user, session, account, verification). Safe to run on every boot. */
export async function migrateAuth() {
  const { runMigrations, toBeCreated, toBeAdded } = await getMigrations(auth.options);
  if (toBeCreated.length || toBeAdded.length) await runMigrations();
}
