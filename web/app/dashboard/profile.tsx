'use client';

import React, { useEffect, useState } from 'react';
import { User, Loader2, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useGlobalStore, UserProfile } from '@/src/store/globalStore';
import { apiClient } from '@/src/lib/apiClient';
import { TextInput } from '@/components/forms/TextInput';

export const profileSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfileView() {
  const profile = useGlobalStore((state) => state.profile);
  const setProfile = useGlobalStore((state) => state.setProfile);

  const [isLoading, setIsLoading] = useState(!profile);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name || '',
    },
  });

  useEffect(() => {
    if (profile?.name) {
      reset({ name: profile.name });
    }
  }, [profile?.name, reset]);

  useEffect(() => {
    let isMounted = true;
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        setFetchError(null);
        const response = await apiClient.get<UserProfile>('/api/users/me');
        if (isMounted && response.data) {
          setProfile(response.data);
          reset({ name: response.data.name || '' });
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
  }, [setProfile, reset]);

  const onUpdateProfile = async (data: ProfileFormData) => {
    setSuccessMessage('Profile updated successfully');
  };

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
        <h2 className="text-lg font-semibold text-foreground mb-6">Personal Information</h2>
        
        {isLoading ? (
          <div className="flex items-center gap-2 py-8 text-foreground/70 justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span>Loading profile details...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {fetchError && (
              <div className="p-4 rounded-xl bg-error/10 text-error text-sm">
                {fetchError}
              </div>
            )}

            {successMessage && (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-emerald-500/10 text-emerald-600 text-sm">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onUpdateProfile)} className="space-y-6 max-w-lg">
              <div>
                <label className="block text-xs font-semibold uppercase text-foreground/60 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={profile?.email || ''}
                  className="flex h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
                />
              </div>

              <TextInput
                label="Full Name"
                placeholder="Enter your full name"
                error={errors.name?.message}
                {...register('name')}
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold shadow-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Save Changes</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileView;
