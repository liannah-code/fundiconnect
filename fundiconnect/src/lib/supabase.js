import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const missingConfigMessage =
  'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to fundiconnect/.env.';

function createOfflineQuery() {
  const query = {
    select: () => query,
    insert: () => query,
    update: () => query,
    eq: () => query,
    order: () => query,
    single: async () => ({ data: null, error: { message: missingConfigMessage } }),
    maybeSingle: async () => ({ data: null, error: null }),
    then: (resolve) => Promise.resolve({ data: [], error: null }).then(resolve),
  };
  return query;
}

function createOfflineSupabase() {
  console.warn(missingConfigMessage);
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signUp: async () => ({ data: { user: null }, error: { message: missingConfigMessage } }),
      signInWithPassword: async () => ({ data: { user: null }, error: { message: missingConfigMessage } }),
      signOut: async () => ({ error: null }),
      resetPasswordForEmail: async () => ({ error: { message: missingConfigMessage } }),
      updateUser: async () => ({ error: { message: missingConfigMessage } }),
      exchangeCodeForSession: async () => ({ data: { session: null }, error: { message: missingConfigMessage } }),
    },
    from: () => createOfflineQuery(),
  };
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createOfflineSupabase();
