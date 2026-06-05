// import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';

const getBaseURL = () => {
  // In the browser: use empty baseURL so axios uses relative URLs (e.g. /api/...)
  // This makes requests go through Next.js on port 3035, which proxies to port 5000.
  // Direct absolute URLs (http://localhost:5000) bypass Next.js and cause CORS errors.
  if (typeof window !== 'undefined') {
    return '';
  }

  // SSR / server-side: use absolute URL (no CORS restriction server-side)
  const url = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
  if (url && !url.startsWith('http')) {
    const isLocalhost = url.includes('localhost') || url.includes('127.0.0.1');
    return isLocalhost ? `http://${url}` : `https://${url}`;
  }
  return url;
};

// Create Axios instance
const instance = axios.create({
  baseURL: getBaseURL()
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

instance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    if (
      error.response?.status === 401 && 
      !originalRequest.url?.includes('/signin') && 
      !originalRequest.url?.includes('/signup') && 
      !originalRequest._retry && 
      typeof window !== 'undefined'
    ) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        clearAuthData();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(instance(originalRequest));
            },
            reject
          });
        });
      }

      isRefreshing = true;

      try {
        const response = await postData<{
          access_token: string;
          refreshToken: string;
        }>('/api/auth/refresh-token', { refreshToken });

        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('refreshToken', response.refreshToken);

        instance.defaults.headers.Authorization = `Bearer ${response.access_token}`;
        processQueue(null, response.access_token);

        return instance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        clearAuthData();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Request Interceptor
instance.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    // Always use relative baseURL in browser → requests go through Next.js proxy
    config.baseURL = '';

    const accessToken = localStorage.getItem('token') || localStorage.getItem('access_token');
    const resetToken = localStorage.getItem('resetPassToken');
    const companyId = localStorage.getItem('selectedCompany');
    
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else if (resetToken) {
      config.headers.Authorization = `Bearer ${resetToken}`;
    }
    if (companyId) {
      config.headers['x-company-id'] = companyId;
    }
  }
  return config;
});
export const getData = async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response = await instance.get<T>(url, {
    ...config,
    headers: {
      'Content-Type': 'application/json', // default header
      ...(config?.headers || {}) // merge any custom headers
    }
  });
  return response.data;
};

export const postData = async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  // Check if data is FormData and set appropriate content type
  const isFormData = data instanceof FormData;

  const response = await instance.post<T>(url, data, {
    ...config,
    headers: {
      ...(isFormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' }),
      ...(config?.headers || {}) // Merge existing headers
    }
  });
  return response.data;
};

export const putData = async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  // Check if data is FormData and set appropriate content type
  const isFormData = data instanceof FormData;

  const response = await instance.put<T>(url, data, {
    ...config,
    headers: {
      ...(isFormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' }),
      ...(config?.headers || {}) // Merge existing headers
    }
  });
  return response.data;
};

export const deleteData = async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response = await instance.delete<T>(url, config);
  return response.data;
};

export const patchData = async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  // Check if data is FormData and set appropriate content type
  const isFormData = data instanceof FormData;

  const response = await instance.patch<T>(url, data, {
    ...config,
    headers: {
      ...(isFormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' }),
      ...(config?.headers || {}) // Merge existing headers
    }
  });
  return response.data;
};

// Refresh Token Function
export const reAuth = async (): Promise<void> => {
  // if (typeof window === "undefined") return;

  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    clearAuthData();
    return;
  }

  try {
    const response = await postData<{
      access_token: string;
      refreshToken: string;
    }>('/api/auth/refresh-token', {
      refreshToken
    });

    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('refreshToken', response.refreshToken);
    window.location.reload();
  } catch {
    clearAuthData();
  }
};

// Clear Auth Data
const clearAuthData = () => {
  localStorage.removeItem('authUser');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('access_token');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('name');
  localStorage.removeItem('email');
  localStorage.removeItem('profilePic');
  window.location.href = '/?modal=login';
};

export default instance;
