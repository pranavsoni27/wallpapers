import { getSupabase, ADMIN_EMAIL, isSupabaseConfigured } from '@/lib/supabase';
import type { AccessType, UserProfile } from '@/types/user';

export const userService = {
  async getProfile(userId: string): Promise<UserProfile | null> {
    if (!isSupabaseConfigured) return null;

    const { data, error } = await getSupabase()
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data as UserProfile;
  },

  async ensureProfile(userId: string, email: string, fullName?: string | null): Promise<UserProfile | null> {
    if (!isSupabaseConfigured) return null;

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await this.getProfile(userId);

    if (existing) {
      if (normalizedEmail === ADMIN_EMAIL.toLowerCase() && existing.access_type !== 'admin') {
        return this.updateAccessType(userId, 'admin');
      }
      return existing;
    }

    const accessType: AccessType = normalizedEmail === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'demo';

    const { data, error } = await getSupabase()
      .from('user_profiles')
      .insert({
        id: userId,
        email: normalizedEmail,
        full_name: fullName ?? null,
        access_type: accessType,
        download_count: 0,
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error creating profile:', error);
      return null;
    }

    return data as UserProfile;
  },

  async getAllUsers(): Promise<UserProfile[]> {
    if (!isSupabaseConfigured) return [];

    const { data, error } = await getSupabase()
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      throw error;
    }

    return (data as UserProfile[]) || [];
  },

  async updateAccessType(userId: string, accessType: AccessType): Promise<UserProfile | null> {
    if (!isSupabaseConfigured) return null;

    const { data, error } = await getSupabase()
      .from('user_profiles')
      .update({ access_type: accessType, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating access:', error);
      throw error;
    }

    return data as UserProfile;
  },

  async incrementDownloadCount(userId: string): Promise<number | null> {
    if (!isSupabaseConfigured) return null;

    const { data, error } = await getSupabase().rpc('increment_user_download');

    if (error) {
      const profile = await this.getProfile(userId);
      if (!profile) return null;

      const { data: updated, error: updateError } = await getSupabase()
        .from('user_profiles')
        .update({
          download_count: profile.download_count + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select('download_count')
        .single();

      if (updateError) {
        console.error('Error incrementing download count:', updateError);
        return null;
      }

      return updated.download_count;
    }

    return data as number;
  },
};
