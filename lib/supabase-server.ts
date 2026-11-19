import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

// The project's address. It is not a secret, and Supabase's own "Connect"
// dialog hands it out as NEXT_PUBLIC_SUPABASE_URL, so that name is read too.
const supabaseUrl = () =>
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;

// The names of the settings that are still missing; empty when all are there.
export function missingSupabaseSettings(): string[] {
  return [
    ...(supabaseUrl() ? [] : ['SUPABASE_URL']),
    ...(process.env.SUPABASE_SECRET_KEY ? [] : ['SUPABASE_SECRET_KEY']),
  ];
}

// The database is reached from the server only. A Supabase secret key
// (sb_secret_...) bypasses row-level security, so it must never get a
// NEXT_PUBLIC_ name and this file must never be imported from a client
// component ('server-only' fails the build if it is).
export function getSupabase(): SupabaseClient {
  if (client) return client;
  const url = supabaseUrl();
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    throw new Error(
      `Supabase is not configured. Missing: ${missingSupabaseSettings().join(', ')}.`,
    );
  }
  client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
