import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui';
import { SearchModal } from '@/components/features';
import { userService } from '@/services';
import { useAuth } from '@/contexts/AuthProvider';
import { isSupabaseConfigured } from '@/lib/supabase';
import type { AccessType, UserProfile } from '@/types';
import { cn } from '@/utils';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

const accessLabels: Record<AccessType, string> = {
  demo: 'Demo (5 downloads)',
  paid: 'Paid',
  free_access: 'Free Access',
  admin: 'Admin',
};

const accessColors: Record<AccessType, string> = {
  demo: 'bg-white/10 text-white/80',
  paid: 'bg-green-500/20 text-green-300',
  free_access: 'bg-primary/20 text-primary',
  admin: 'bg-accent/20 text-accent',
};

export const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const data = await userService.getAllUsers();
      setUsers(data || []);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load users';
      console.error('Error loading users:', errorMsg);
      setError(errorMsg);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = users.filter((profile) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      profile.email?.toLowerCase().includes(query) ||
      profile.full_name?.toLowerCase().includes(query)
    );
  });

  const updateAccess = async (userId: string, accessType: AccessType) => {
    setUpdatingId(userId);
    setError('');

    try {
      await userService.updateAccessType(userId, accessType);
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user access');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <>
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isSupabaseConfigured && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
            <p className="text-red-300">
              Error: Supabase is not configured. Please add VITE_SUPABASE_ANON_KEY to your environment variables.
            </p>
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Admin Panel</h1>
            <p className="text-white/60">
              Manage users and grant free access. Logged in as {user?.email}
              {!loading && users.length > 0 &&
                ` • ${filteredUsers.length} of ${users.length} user${users.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search input */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-8 py-2 rounded-lg bg-white/10 border border-white/10 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-primary focus:bg-white/15 transition-colors w-64"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              )}
            </div>

            <Button variant="outline" onClick={loadUsers} disabled={loading}>
              {loading ? 'Loading...' : 'Refresh'}
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
            <p className="text-red-300 mb-2">{error}</p>
            <Button size="sm" variant="outline" onClick={loadUsers}>
              Try Again
            </Button>
          </div>
        )}

        {loading && users.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-white/60 text-center">
              <p className="mb-2">Loading users...</p>
              <p className="text-sm">Please wait while we fetch user data from the database.</p>
            </div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-white/60 text-center">
              {searchQuery ? (
                <>
                  <p className="mb-2">No users found for "<span className="text-white">{searchQuery}</span>"</p>
                  <p className="text-sm">Try a different name or email.</p>
                </>
              ) : (
                <>
                  <p className="mb-2">No users found</p>
                  <p className="text-sm">Users will appear here once they sign up for an account.</p>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-left">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-4 py-3 text-sm font-medium text-white/70">Email</th>
                  <th className="px-4 py-3 text-sm font-medium text-white/70">Name</th>
                  <th className="px-4 py-3 text-sm font-medium text-white/70">Access</th>
                  <th className="px-4 py-3 text-sm font-medium text-white/70">Downloads</th>
                  <th className="px-4 py-3 text-sm font-medium text-white/70">Joined</th>
                  <th className="px-4 py-3 text-sm font-medium text-white/70">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((profile) => (
                  <tr key={profile.id} className="border-t border-white/10">
                    <td className="px-4 py-4 text-white">{profile.email}</td>
                    <td className="px-4 py-4 text-white/70">{profile.full_name || '—'}</td>
                    <td className="px-4 py-4">
                      <span
                        className={cn(
                          'px-3 py-1 rounded-full text-xs font-medium',
                          accessColors[profile.access_type]
                        )}
                      >
                        {accessLabels[profile.access_type]}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-white/70">{profile.download_count}</td>
                    <td className="px-4 py-4 text-white/70">
                      {new Date(profile.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        {profile.access_type !== 'free_access' && profile.access_type !== 'admin' && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={updatingId === profile.id}
                            onClick={() => updateAccess(profile.id, 'free_access')}
                          >
                            Grant Free Access
                          </Button>
                        )}
                        {profile.access_type === 'free_access' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={updatingId === profile.id}
                            onClick={() => updateAccess(profile.id, 'demo')}
                          >
                            Revoke Free Access
                          </Button>
                        )}
                        {profile.access_type !== 'paid' && profile.access_type !== 'admin' && (
                          <Button
                            size="sm"
                            variant="secondary"
                            disabled={updatingId === profile.id}
                            onClick={() => updateAccess(profile.id, 'paid')}
                          >
                            Mark as Paid
                          </Button>
                        )}
                        {(profile.access_type === 'paid' || profile.access_type === 'free_access') && (
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={updatingId === profile.id}
                            onClick={() => updateAccess(profile.id, 'demo')}
                          >
                            Set Demo
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <SearchModal />
    </>
  );
};