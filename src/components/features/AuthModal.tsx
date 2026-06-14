import React, { useState } from 'react';
import { Modal, Button } from '@/components/ui';
import { useAuth } from '@/contexts/AuthProvider';
import { isSupabaseConfigured } from '@/lib/supabase';
import { cn } from '@/utils';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    authModalMode,
    closeAuthModal,
    openAuthModal,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setError('');
    setMessage('');
  };

  const handleClose = () => {
    resetForm();
    closeAuthModal();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsSubmitting(true);

    try {
      if (authModalMode === 'login') {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password, fullName || undefined);
        setMessage('Account created! Check your email to confirm, then log in.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsSubmitting(true);

    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed');
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isAuthModalOpen} onClose={handleClose} className="max-w-md">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          {authModalMode === 'login' ? 'Welcome back' : 'Create your account'}
        </h2>
        <p className="text-white/60 text-sm mb-6">
          Sign in with Google or use your email and password.
        </p>

        {!isSupabaseConfigured && (
          <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-sm">
            Add <code className="text-amber-100">VITE_SUPABASE_ANON_KEY</code> to your{' '}
            <code className="text-amber-100">.env</code> file to enable login.
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          className="w-full mb-4"
          onClick={handleGoogleSignIn}
          disabled={isSubmitting || !isSupabaseConfigured}
        >
          Continue with Google
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-surface text-white/50">or use email</span>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => {
              setError('');
              setMessage('');
              openAuthModal('login');
            }}
            className={cn(
              'flex-1 py-2 rounded-lg text-sm font-medium transition-colors',
              authModalMode === 'login'
                ? 'bg-primary text-white'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            )}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              setError('');
              setMessage('');
              openAuthModal('signup');
            }}
            className={cn(
              'flex-1 py-2 rounded-lg text-sm font-medium transition-colors',
              authModalMode === 'signup'
                ? 'bg-primary text-white'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            )}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {authModalMode === 'signup' && (
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full name (optional)"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          )}

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            required
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            minLength={6}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          {message && (
            <p className="text-sm text-green-400">{message}</p>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting || !isSupabaseConfigured}>
            {isSubmitting
              ? 'Please wait...'
              : authModalMode === 'login'
                ? 'Login'
                : 'Sign Up'}
          </Button>
        </form>

        <p className="text-white/50 text-xs mt-4 text-center">
          Demo accounts can view all wallpapers and download up to 5 for free.
        </p>
      </div>
    </Modal>
  );
};
