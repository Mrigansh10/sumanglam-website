import { randomBytes } from "crypto";

/**
 * cuid-shaped id generator for Supabase REST inserts.
 *
 * The tables were created by Prisma migrations, where `@default(cuid())` is a
 * CLIENT-side default — the database columns have no default at all. Every
 * insert that goes through Supabase REST must therefore supply its own id
 * (and `updated_at`, since `@updatedAt` is also client-side). Forgetting this
 * is the recurring "Failed to create <row>" trap (first hit in the Session 7
 * Yale import, again in the consultation form).
 */
export function newId(): string {
  const time = Date.now().toString(36);
  const rand = randomBytes(8).toString("hex").slice(0, 12);
  return `c${time}${rand}`;
}

/** ISO timestamp for created_at / updated_at columns (no DB defaults). */
export function nowIso(): string {
  return new Date().toISOString();
}
