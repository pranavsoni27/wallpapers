import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

function loadEnv() {
  const envPath = resolve(process.cwd(), '.env');
  if (!existsSync(envPath)) return;

  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...rest] = trimmed.split('=');
    if (!process.env[key]) {
      process.env[key] = rest.join('=').trim();
    }
  }
}

loadEnv();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'pranavsoni2702@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

if (!ADMIN_PASSWORD) {
  console.error('Missing ADMIN_PASSWORD in .env for one-time admin setup.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const { data, error } = await supabase.auth.signUp({
  email: ADMIN_EMAIL,
  password: ADMIN_PASSWORD,
  options: {
    data: { full_name: 'Pranav Soni' },
  },
});

if (error) {
  if (error.message.toLowerCase().includes('already registered')) {
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });

    if (signInError) {
      console.error('Admin already exists but password login failed:', signInError.message);
      process.exit(1);
    }

    console.log('Admin account already exists. Password login verified successfully.');
    process.exit(0);
  }

  console.error('Failed to create admin:', error.message);
  process.exit(1);
}

if (data.user && !data.session) {
  console.log('Admin account created. Confirm the email in Supabase if email confirmation is enabled.');
} else {
  console.log('Admin account created and signed in successfully.');
}
