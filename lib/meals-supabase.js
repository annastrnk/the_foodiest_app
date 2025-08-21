import supabase from './supabase';

export async function getMeals() {
  const { data, error } = await supabase
    .from('meals')
    .select('*');

  if (error) throw error;
  return data;
}

export async function getMeal(slug) {
  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) return null;
  return data;
}
