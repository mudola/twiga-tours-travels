import React, { createContext, useContext, useEffect, useState } from 'react';
import { setAuthTokenGetter, setBaseUrl } from '@workspace/api-client-react';
import type { AdminUserProfile } from '@workspace/api-client-react';

interface AuthContextType {
  token: string | null;
  user: AdminUserProfile | null;
  isAuthenticated: boolean;
  login: (token: string, user: AdminUserProfile) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('admin_token'));
  const [user, setUser] = useState<AdminUserProfile | null>(() => {
    const stored = localStorage.getItem('admin_user');
    try {
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    // Generated API paths already include the /api prefix.
    setBaseUrl(null);
    setAuthTokenGetter(() => localStorage.getItem('admin_token'));
  }, []);

  const login = (newToken: string, newUser: AdminUserProfile) => {
    localStorage.setItem('admin_token', newToken);
    localStorage.setItem('admin_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
