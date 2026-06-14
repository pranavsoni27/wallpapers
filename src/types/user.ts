export type AccessType = 'demo' | 'paid' | 'free_access' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  access_type: AccessType;
  download_count: number;
  created_at: string;
  updated_at: string;
}

export type AuthModalMode = 'login' | 'signup';
