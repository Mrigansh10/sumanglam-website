import { createClient } from "@supabase/supabase-js";

// This module must never reach the browser: with RLS policies still permissive,
// the key is the only wall around leads/consultations PII.
if (typeof window !== "undefined") {
  throw new Error("lib/supabase.ts is server-only and must not be imported into client components.");
}

const SUPABASE_URL = "https://yikrshucrahamejrsklp.supabase.co";
// Prefer the service-role key once it's added to .env / Vercel env. It bypasses
// RLS, which lets the anon key be revoked to read-nothing via
// scripts/security/rls-lockdown.sql (run that ONLY after this key is set).
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
});

// Convert a snake_case key to camelCase
function toCamel(s: string): string {
  return s.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
}

// Recursively convert snake_case keys to camelCase
export function camelizeRecord<T = Record<string, unknown>>(
  row: Record<string, unknown>,
): T {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row)) {
    const ck = toCamel(k);
    if (Array.isArray(v)) {
      out[ck] = v.map((item) =>
        item !== null && typeof item === "object"
          ? camelizeRecord(item as Record<string, unknown>)
          : item,
      );
    } else if (v !== null && typeof v === "object") {
      out[ck] = camelizeRecord(v as Record<string, unknown>);
    } else {
      out[ck] = v;
    }
  }
  return out as T;
}

// Convert an array of snake_case rows to camelCase
export function rows<T = Record<string, unknown>>(data: unknown): T[] {
  if (!Array.isArray(data)) return [];
  return data.map((row) => camelizeRecord<T>(row as Record<string, unknown>));
}

// Convert a single snake_case row (first element of array) to camelCase
export function firstRow<T = Record<string, unknown>>(data: unknown): T | null {
  if (!Array.isArray(data) || data.length === 0) return null;
  return camelizeRecord<T>(data[0] as Record<string, unknown>);
}
