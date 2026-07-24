import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Ensure we don't hardcode URLs
const baseURL = process.env.NEXT_PUBLIC_API_URL || '';

export const apiClient = axios.create({
  baseURL,
  timeout: 15000,
});

// Helper for delay in retry
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Interceptors
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // TODO: In Phase 5 (Milestone 4/5), wire this to the Zustand store.
    // For now, we leave the authorization injection structure ready.
    let token = null;
    
    // Safely attempt to retrieve token if in browser (fallback before Zustand is wired)
    if (typeof window !== 'undefined') {
      try {
        // We will read from zustand persist storage or similar later
        const persisted = localStorage.getItem('auth-storage');
        if (persisted) {
          const parsed = JSON.parse(persisted);
          token = parsed?.state?.token;
        }
      } catch {
        // ignore
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as InternalAxiosRequestConfig & { _retryCount?: number };

    // 1. Handle 401 Unauthorized centrally
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        // TODO: In Phase 5, wire this to Zustand's logout() to clear state
        localStorage.removeItem('auth-storage');
        // Clear other local storage entries owned by the app if needed
        
        // Redirect to login
        window.location.href = '/login?sessionExpired=true';
      }
      return Promise.reject(error);
    }

    // 2. Retry Logic
    if (config) {
      const isGetRequest = config.method?.toLowerCase() === 'get';
      const isNetworkError = !error.response; // Network timeout or failure
      const is5xxError = error.response && error.response.status >= 500 && error.response.status < 600;

      if (isGetRequest && (isNetworkError || is5xxError)) {
        config._retryCount = config._retryCount || 0;

        if (config._retryCount < 3) {
          config._retryCount += 1;

          // Backoff: 500ms, 1000ms, 2000ms
          const backoffTimes = [500, 1000, 2000];
          const delayMs = backoffTimes[config._retryCount - 1];

          await delay(delayMs);

          // Retry the request
          return apiClient(config);
        }
      }
    }

    return Promise.reject(error);
  }
);
