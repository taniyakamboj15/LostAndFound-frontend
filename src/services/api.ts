import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../constants';
import { ApiError, BackendErrorDetail } from '../types';
import { PUBLIC_PATHS } from '../constants/routes';


const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    const isAuthRequest = originalRequest.url?.includes('auth/login') || 
                         originalRequest.url?.includes('auth/register') ||
                         originalRequest.url?.includes('auth/refresh') ||
                         originalRequest.url?.includes('auth/logout');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
      originalRequest._retry = true;

      try {
        // Call refresh endpoint - cookies will be sent automatically
        await axios.post(
          `${API_BASE_URL}/api/auth/refresh`,
          {},
          { withCredentials: true }
        );

        // Retry original request - new cookies will be sent automatically
        return api(originalRequest);
      } catch (refreshError) {
        const hadUser = !!localStorage.getItem(STORAGE_KEYS.USER);
        
        // Clear user data on refresh failure
        localStorage.removeItem(STORAGE_KEYS.USER);
        
        const isPublicPath = PUBLIC_PATHS.includes(window.location.pathname);
        
        if (!isPublicPath) {
          window.location.href = '/login';
        } else if (hadUser) {
          window.location.reload();
        }
        
        const apiError: ApiError = {
          success: false,
          message: (refreshError as AxiosError).message || 'Session expired',
          silent: isPublicPath,
        };

        return Promise.reject(apiError);
      }
    }

    const errorData = error.response?.data as {
      success?: boolean;
      error?: BackendErrorDetail | string;
      message?: string;
      errors?: Array<{ field: string; message: string }>;
    } | undefined;

    let errorMessage = error.message || 'An error occurred';

    if (errorData) {
      if (typeof errorData.error === 'object' && errorData.error?.message) {
        errorMessage = errorData.error.message;
      } else if (typeof errorData.error === 'string') {
        errorMessage = errorData.error;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }
    }
    
    const isPublicPath = PUBLIC_PATHS.includes(window.location.pathname);

    const apiError: ApiError = {
      success: false,
      message: errorMessage,
      error: errorData?.error,
      errors: errorData?.errors,
      silent: error.response?.status === 401 && isPublicPath,
    };

    return Promise.reject(apiError);
  }
);

export default api;
