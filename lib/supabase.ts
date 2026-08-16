import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xekedoczmiyptywixzym.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_1tTHphXuaXZxLLwd7Er4pw_Kmb73oPX';

// Client-safe Supabase instance (used in both browser and server)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-only Admin Supabase instance
let _supabaseAdmin: SupabaseClient | null = null;

export const getSupabaseAdmin = (): SupabaseClient => {
  if (typeof window !== 'undefined') {
    return supabase; // Safe fallback in browser
  }
  if (!_supabaseAdmin) {
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;
    _supabaseAdmin = createClient(supabaseUrl, serviceKey);
  }
  return _supabaseAdmin;
};

export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseAdmin();
    return (client as unknown as Record<string | symbol, unknown>)[prop];
  },
});
