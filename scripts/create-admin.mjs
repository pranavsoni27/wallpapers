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
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
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

// If using service role key, auto-confirm the email
if (process.env.SUPABASE_SERVICE_ROLE_KEY && data.user && !data.session) {
  const { error: confirmError } = await supabase.auth.admin.updateUserById(data.user.id, {
    email_confirm: true,
  });
  if (confirmError) {
    console.error('Failed to auto-confirm email:', confirmError.message);
  } else {
    console.log('Admin email auto-confirmed using service role key.');
    // Try to sign in after confirmation
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });
    if (signInError) {
      console.error('Failed to sign in after email confirmation:', signInError.message);
    } else {
      console.log('Admin account created, email confirmed, and signed in successfully.');
      process.exit(0);
    }
  }
}

if (error) {
  if (error.message.toLowerCase().includes('already registered')) {
    // User already exists, try to confirm email if using service role key
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      // Get user by email
      const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
      if (listError) {
        console.error('Failed to list users:', listError.message);
      } else {
        const adminUser = users.find(u => u.email === ADMIN_EMAIL);
        if (adminUser) {
          const { error: confirmError } = await supabase.auth.admin.updateUserById(adminUser.id, {
            email_confirm: true,
          });
          if (confirmError) {
            console.error('Failed to auto-confirm email for existing user:', confirmError.message);
          } else {
            console.log('Admin email auto-confirmed using service role key.');
            // Try to sign in after confirmation
            const { error: signInError } = await supabase.auth.signInWithPassword({
              email: ADMIN_EMAIL,
              password: ADMIN_PASSWORD,
            });
            if (signInError) {
              console.error('Failed to sign in after email confirmation:', signInError.message);
              process.exit(1);
            }
            console.log('Admin account exists, email confirmed, and login verified successfully.');
            process.exit(0);
          }
        }
      }
    }
    
    // Try to sign in
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
