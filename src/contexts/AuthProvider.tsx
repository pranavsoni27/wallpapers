import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { authService, userService } from '@/services';
import { ADMIN_EMAIL, DEMO_DOWNLOAD_LIMIT } from '@/lib/supabase';
import type { AuthModalMode, UserProfile } from '@/types';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  hasUnlimitedAccess: boolean;
  remainingDownloads: number;
  canDownload: boolean;
  isAuthModalOpen: boolean;
  authModalMode: AuthModalMode;
  openAuthModal: (mode?: AuthModalMode) => void;
  closeAuthModal: () => void;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, fullName?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  recordDownload: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('login');

  const loadProfile = useCallback(async (authUser: User) => {
    const userProfile = await userService.ensureProfile(
      authUser.id,
      authUser.email || '',
      authUser.user_metadata?.full_name || authUser.user_metadata?.name || null
    );
    setProfile(userProfile);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    const userProfile = await userService.getProfile(user.id);
    setProfile(userProfile);
  }, [user]);

  useEffect(() => {
    if (!authService.isConfigured()) {
      setLoading(false);
      return;
    }

    let mounted = true;

    authService.getSession().then((currentSession) => {
      if (!mounted) return;
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        loadProfile(currentSession.user).finally(() => {
          if (mounted) setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    const { data: listener } = authService.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);

      if (nextSession?.user) {
        await loadProfile(nextSession.user);
        setLoading(false);
        setIsAuthModalOpen(false);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const isAuthenticated = Boolean(user);
  const userEmail = user?.email?.trim().toLowerCase() ?? '';
  const isAdmin = userEmail === ADMIN_EMAIL.toLowerCase() || profile?.access_type === 'admin';
  const hasUnlimitedAccess =
    isAdmin || profile?.access_type === 'paid' || profile?.access_type === 'free_access';
  const remainingDownloads = hasUnlimitedAccess
    ? Infinity
    : Math.max(0, DEMO_DOWNLOAD_LIMIT - (profile?.download_count ?? 0));
  const canDownload = isAuthenticated && (hasUnlimitedAccess || remainingDownloads > 0);

  const openAuthModal = useCallback((mode: AuthModalMode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    await authService.signInWithEmail(email, password);
  }, []);

  const signUpWithEmail = useCallback(async (email: string, password: string, fullName?: string) => {
    await authService.signUpWithEmail(email, password, fullName);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    await authService.signInWithGoogle();
  }, []);

  const signOut = useCallback(async () => {
    await authService.signOut();
    setProfile(null);
  }, []);

  const recordDownload = useCallback(async () => {
    if (!user || !profile) return false;
    if (hasUnlimitedAccess) return true;

    if (profile.download_count >= DEMO_DOWNLOAD_LIMIT) {
      return false;
    }

    const newCount = await userService.incrementDownloadCount(user.id);
    if (newCount !== null) {
      setProfile({ ...profile, download_count: newCount });
      return true;
    }

    return false;
  }, [user, profile, hasUnlimitedAccess]);

  const value = useMemo(
    () => ({
      user,
      session,
      profile,
      loading,
      isAuthenticated,
      isAdmin,
      hasUnlimitedAccess,
      remainingDownloads,
      canDownload,
      isAuthModalOpen,
      authModalMode,
      openAuthModal,
      closeAuthModal,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      signOut,
      refreshProfile,
      recordDownload,
    }),
    [
      user,
      session,
      profile,
      loading,
      isAuthenticated,
      isAdmin,
      hasUnlimitedAccess,
      remainingDownloads,
      canDownload,
      isAuthModalOpen,
      authModalMode,
      openAuthModal,
      closeAuthModal,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      signOut,
      refreshProfile,
      recordDownload,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
