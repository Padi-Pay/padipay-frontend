'use client';

import React, { useEffect, useState } from 'react';
import { User, Loader2, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useGlobalStore, UserProfile } from '@/src/store/globalStore';
import { apiClient } from '@/src/lib/apiClient';
import { TextInput } from '@/components/forms/TextInput';
import { useProfileQuery } from '@/src/hooks/queries/useProfileQuery';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const profileSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfileView() {
  const profile = useGlobalStore((state) => state.profile);
  const setProfile = useGlobalStore((state) => state.setProfile);
  const queryClient = useQueryClient();

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // React Query for fetching
  const { isLoading, error: fetchErrorRaw } = useProfileQuery();
  
  // Custom fetch error parsing
  const fetchError = fetchErrorRaw 
    ? ((fetchErrorRaw as AxiosError<{ message?: string }>).response?.data?.message || 'Failed to load profile details.')
    : null;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name || '',
    },
  });

  // Keep form in sync with zustand profile
  useEffect(() => {
    if (profile?.name) {
      reset({ name: profile.name });
    }
  }, [profile?.name, reset]);

  // React Query mutation for updating
  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const response = await apiClient.patch<UserProfile>('/api/users/me', data);
      return response.data;
    },
    onMutate: async (newProfileData) => {
      setSuccessMessage(null);
      // We don't cancel queries or snapshot here because profile is kept in globalStore 
      // as well as React Query. We'll optimistically update global store.
      const previousProfile = useGlobalStore.getState().profile;
      
      const optimisticProfile: UserProfile = previousProfile
        ? { ...previousProfile, name: newProfileData.name }
        : { id: 'temp-id', email: '', name: newProfileData.name };
      
      setProfile(optimisticProfile);
      return { previousProfile };
    },
    onSuccess: (data) => {
      setProfile(data);
      queryClient.setQueryData(['profile'], data);
      setSuccessMessage('Profile updated successfully');
    },
    onError: (err, newProfileData, context) => {
      if (context?.previousProfile) {
        setProfile(context.previousProfile);
      }
    }
  });

  const onUpdateProfile = (data: ProfileFormData) => {
    updateProfileMutation.mutate(data);
  };
  
  const updateError = updateProfileMutation.error 
    ? ((updateProfileMutation.error as AxiosError<{ message?: string }>).response?.data?.message || 'Failed to update profile. Please try again.')
    : null;

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
        
        {isLoading && !profile ? (
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
            
            {updateError && (
              <div className="p-4 rounded-xl bg-error/10 text-error text-sm">
                {updateError}
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
                disabled={updateProfileMutation.isPending}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold shadow-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateProfileMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
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

