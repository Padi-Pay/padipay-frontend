'use client';

import React, { useEffect, useState } from 'react';
import { User, Loader2 } from 'lucide-react';
import { useGlobalStore, UserProfile } from '@/src/store/globalStore';
import { apiClient } from '@/src/lib/apiClient';

export function ProfileView() {
  const profile = useGlobalStore((state) => state.profile);
  const setProfile = useGlobalStore((state) => state.setProfile);

  const [isLoading, setIsLoading] = useState(!profile);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        setFetchError(null);
        const response = await apiClient.get<UserProfile>('/api/users/me');
        if (isMounted && response.data) {
          setProfile(response.data);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const message = err && typeof err === 'object' && 'response' in err
            ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
            : null;
          setFetchError(message || 'Failed to load profile details.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchUserProfile();

    return () => {
      isMounted = false;
    };
  }, [setProfile]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-primary/10 text-primary">
          <User className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Profile</h1>
          <p className="text-sm text-foreground/70">Manage your personal details and account settings</p>
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-outline-variant/60 p-6 sm:p-8 shadow-xs">
        <h2 className="text-lg font-semibold text-foreground mb-4">Personal Information</h2>
        {isLoading ? (
          <div className="flex items-center gap-2 py-8 text-foreground/70 justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span>Loading profile details...</span>
          </div>
        ) : fetchError ? (
          <div className="p-4 rounded-xl bg-error/10 text-error text-sm mb-4">
            {fetchError}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold uppercase text-foreground/60">Full Name</span>
              <p className="text-base font-medium text-foreground">{profile?.name || '—'}</p>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase text-foreground/60">Email Address</span>
              <p className="text-base font-medium text-foreground">{profile?.email || '—'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileView;
