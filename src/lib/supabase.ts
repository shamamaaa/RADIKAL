import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const PLACEHOLDER_VALUES = ["your-anon-key", "https://your-project.supabase.co"];

export const isSupabaseConfigured = Boolean(
  url && anonKey && !PLACEHOLDER_VALUES.includes(url) && !PLACEHOLDER_VALUES.includes(anonKey)
);

export const supabase = isSupabaseConfigured
  ? createClient(url as string, anonKey as string)
  : null;
