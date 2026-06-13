// ============================================================
//  Supabase client
//  Reads connection details from environment variables —
//  set these in Vercel (see DEPLOYMENT_GUIDE.md)
//
//  If the env vars aren't set, `supabase` is null and the app
//  falls back to demo data (see lib/dataAccess.js).
// ============================================================
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

