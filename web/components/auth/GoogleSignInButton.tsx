import { GoogleLogin } from '@react-oauth/google';
import { apiClient } from '@/src/lib/apiClient';
import { isAxiosError } from 'axios';
import { useGlobalStore } from '@/src/store/globalStore';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface GoogleSignInButtonProps {
  redirectTarget: string;
}

export function GoogleSignInButton({ redirectTarget }: GoogleSignInButtonProps) {
  const router = useRouter();

  return (
    <div className="flex w-full justify-center">
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          try {
            const { credential } = credentialResponse;
            if (!credential) {
              throw new Error('No credential received from Google.');
            }

            const response = await apiClient.post('/api/auth/google', {
              token: credential,
            });

            const { token, user } = response.data;

            if (token && user) {
              useGlobalStore.getState().login(token);
              useGlobalStore.getState().setProfile(user);
              router.replace(redirectTarget);
            } else {
              throw new Error('Invalid response from server.');
            }
          } catch (error) {
            console.error('Google auth error', error);
            if (isAxiosError(error)) {
              toast.error(error.response?.data?.message || 'Google sign in failed');
            } else {
              toast.error('Google sign in failed');
            }
          }
        }}
        onError={() => {
          toast.error('Google sign in failed');
        }}
        useOneTap
        theme="outline"
        size="large"
        width="100%"
        text="continue_with"
      />
    </div>
  );
}
