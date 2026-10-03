import { supabase } from './src/lib/supabase.ts';
async function test() {
  const { data, error } = await supabase.from('expenses').select('*').limit(1);
  console.log("DATA:", data);
  console.log("ERROR:", error);
}
test();
