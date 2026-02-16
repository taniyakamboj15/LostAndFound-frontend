import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../constants';
import { ApiError } from '../types';

// Create Axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for httpOnly cookies
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    
    if (token && token !== 'undefined' && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized - Try to refresh token
    // Skip if the request was for login or register or refresh
    const isAuthRequest = originalRequest.url?.includes('auth/login') || 
                         originalRequest.url?.includes('auth/register') ||
                         originalRequest.url?.includes('auth/refresh');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        // Call refresh endpoint
        const response = await axios.post(
          `${API_BASE_URL}/api/auth/refresh`,
          { refreshToken },
          { withCredentials: true }
        );

        const { accessToken } = response.data.data;
        
        // Store new token
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);

        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - Clear tokens and redirect to login
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        
        // Redirect to login
        window.location.href = '/login';
        
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    const errorData = error.response?.data as any; // Cast to any to access dynamic properties
    const errorMessage = errorData?.error?.message || errorData?.message || error.message || 'An error occurred';
    
    const apiError: ApiError = {
      success: false,
      message: errorMessage,
      error: errorData?.error,
      errors: errorData?.errors,
    };

    return Promise.reject(apiError);
  }
);

export default api;
