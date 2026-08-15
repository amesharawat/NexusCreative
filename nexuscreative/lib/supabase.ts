import { createClient, SupabaseClient } from '@supabase/supabase-js';

const getSupabaseUrl = () => process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co';
const getAnonKey = () => process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder_anon_key';
const getServiceKey = () => process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'placeholder_service_key';

let _supabase: SupabaseClient | null = null;
let _supabaseAdmin: SupabaseClient | null = null;

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    if (!_supabase) {
      _supabase = createClient(getSupabaseUrl(), getAnonKey());
    }
    return (_supabase as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    if (!_supabaseAdmin) {
      _supabaseAdmin = createClient(getSupabaseUrl(), getServiceKey());
    }
    return (_supabaseAdmin as unknown as Record<string | symbol, unknown>)[prop];
  },
});
