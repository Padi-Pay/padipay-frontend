import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useGlobalStore } from '../store/globalStore';

// Ensure we don't hardcode URLs
const baseURL = process.env.NEXT_PUBLIC_API_URL || '';

export const apiClient = axios.create({
  baseURL,
  timeout: 15000,
});

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Interceptors
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    let token = null;
    
    if (typeof window !== 'undefined') {
      token = useGlobalStore.getState().token;
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
      useGlobalStore.getState().markSessionExpired();
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
