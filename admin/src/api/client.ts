import axios, { AxiosRequestConfig } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/v1';
export const TOKEN_KEY = 'tv_admin_token';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      // Tránh vòng lặp nếu đang ở trang đăng nhập
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

/**
 * Backend bọc mọi response dạng `{ success, data, meta? }`.
 * Các hàm dưới đây tự bóc `data` / `meta`.
 */
export interface ListResult<T = any> {
  rows: T[];
  total: number | null;
}

export async function fetchList<T = any>(
  url: string,
  params?: Record<string, any>,
): Promise<ListResult<T>> {
  const res = await apiClient.get(url, { params });
  const body = res.data ?? {};
  const data = body.data ?? body;
  const rows: T[] = Array.isArray(data) ? data : data?.data ?? [];
  const total: number | null = body.meta?.total_records ?? null;
  return { rows, total };
}

export async function fetchOne<T = any>(url: string): Promise<T> {
  const res = await apiClient.get(url);
  return res.data?.data ?? res.data;
}

export async function mutate<T = any>(
  method: 'post' | 'put' | 'patch' | 'delete',
  url: string,
  body?: any,
): Promise<T> {
  const config: AxiosRequestConfig = { method, url, data: body };
  const res = await apiClient.request(config);
  return res.data?.data ?? res.data;
}

export { API_URL };
