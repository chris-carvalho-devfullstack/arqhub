import { createClient } from '@supabase/supabase-js';

// Tenta ler do Vite (Build) OU do ambiente Node/Cloudflare (Runtime)
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('ERRO: Variáveis de ambiente do Supabase não encontradas.');
  console.error('URL:', supabaseUrl ? 'Definida' : 'Indefinida');
  console.error('KEY:', supabaseAnonKey ? 'Definida' : 'Indefinida');
}

// O ! no final força o TypeScript a aceitar que não é nulo/undefined, 
// mas o ideal é tratar o erro acima.
export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);