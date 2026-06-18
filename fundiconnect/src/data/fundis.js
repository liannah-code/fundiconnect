import { supabase } from '../lib/supabase';

/** Fetch all profiles with role = 'fundi', including their reviews */
export async function getAllFundis() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, reviews(*)')
    .eq('role', 'fundi');

  if (error) {
    console.error('Error fetching fundis:', error.message);
    return [];
  }
  return data.map(f => ({ ...f, reviews: f.reviews || [] }));
}
