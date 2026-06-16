import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';

export const authService = {
  isConfigured: () => isSupabaseConfigured,

  async signUpWithEmail(email: string, password: string, fullName?: string) {
    const { data, error } = await getSupabase().auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) throw error;
    return data;
  },

  async signInWithEmail(email: string, password: string) {
    const { data, error } = await getSupabase().auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async signInWithGoogle() {
    const { data, error } = await getSupabase().auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) throw error;
    return data;
  },

  async signOut() {
  console.log('authService.signOut called');
  console.log('isSupabaseConfigured:', isSupabaseConfigured);

  if (!isSupabaseConfigured) return;

  try {
    await Promise.race([
      getSupabase().auth.signOut({ scope: 'local' }), // 'local' clears only this tab's session
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('signOut timeout')), 3000)
      ),
    ]);
    console.log('Supabase signOut completed');
  } catch (error) {
    console.warn('Supabase signOut failed or timed out:', error);
  } finally {
    // Force clear all Supabase keys from storage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('sb-')) {
        localStorage.removeItem(key);
      }
    });
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  }
},

  async getSession() {
    if (!isSupabaseConfigured) return null;
    const { data, error } = await getSupabase().auth.getSession();
    if (error) throw error;
    return data.session;
  },

  onAuthStateChange(callback: Parameters<ReturnType<typeof getSupabase>['auth']['onAuthStateChange']>[0]) {
    return getSupabase().auth.onAuthStateChange(callback);
  },
};