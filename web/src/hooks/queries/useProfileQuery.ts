import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/src/lib/apiClient';
import { UserProfile } from '@/src/store/globalStore';

export function useProfileQuery() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data } = await apiClient.get<UserProfile>('/api/users/me');
      return data;
    },
    staleTime: 1000 * 60 * 5, // Profile data is mostly static, 5 mins staleTime
  });
}
