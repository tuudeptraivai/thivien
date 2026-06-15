import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import { apiClient, fetchOne, TOKEN_KEY } from '../api/client';

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  display_name: string;
  role: string;
  avatar_url?: string | null;
}

interface AuthState {
  user: AdminUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem(TOKEN_KEY),
  );
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState<boolean>(!!token);

  useEffect(() => {
    let active = true;
    async function loadMe() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const me = await fetchOne<AdminUser>('/auth/me');
        if (active) setUser(me);
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        if (active) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    loadMe();
    return () => {
      active = false;
    };
  }, [token]);

  async function login(email: string, password: string) {
    const res = await apiClient.post('/auth/login', { email, password });
    const data = res.data?.data ?? res.data;
    const accessToken: string = data.access_token;
    const loggedUser: AdminUser = data.user;
    if (!['admin', 'moderator'].includes(loggedUser.role)) {
      throw new Error(
        'Tài khoản không có quyền truy cập trang quản trị (cần admin hoặc moderator).',
      );
    }
    localStorage.setItem(TOKEN_KEY, accessToken);
    setToken(accessToken);
    setUser(loggedUser);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, token, loading, login, logout }),
    [user, token, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth phải dùng trong AuthProvider');
  return ctx;
}
