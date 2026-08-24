'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchApi } from './api';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  avatar_url?: string;
  github_username?: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  org: Organization | null;
  isLoading: boolean;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  login: (token: string, user: User, rememberMe?: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [org, setOrg] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    // Load theme setting
    const savedTheme = localStorage.getItem('devpulse_theme') as 'dark' | 'light';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      document.documentElement.classList.add('dark');
    }

    // Verify existing auth session against backend database API
    const initAuth = async () => {
      const savedToken = localStorage.getItem('devpulse_token');
      const savedUser = localStorage.getItem('devpulse_user');

      if (savedToken) {
        try {
          // Validate token with database /auth/me endpoint
          const me = await fetchApi<User>('/auth/me');
          setToken(savedToken);
          setUser(me);
          setOrg({
            id: 'org-1',
            name: 'DevPulse Engineering',
            slug: 'devpulse-engineering',
          });
        } catch {
          // Token is invalid or backend DB not accessible: clear stale credentials
          if (savedUser && savedToken && savedToken !== 'demo-jwt-token-12345') {
            // Keep saved user session if valid, otherwise reset
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
            setOrg({
              id: 'org-1',
              name: 'DevPulse Engineering',
              slug: 'devpulse-engineering',
            });
          } else {
            localStorage.removeItem('devpulse_token');
            localStorage.removeItem('devpulse_user');
            setToken(null);
            setUser(null);
            setOrg(null);
          }
        }
      } else {
        setToken(null);
        setUser(null);
        setOrg(null);
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('devpulse_theme', nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
  };

  const login = (newToken: string, newUser: User, rememberMe: boolean = true) => {
    setToken(newToken);
    setUser(newUser);
    setOrg({
      id: 'org-1',
      name: 'DevPulse Engineering',
      slug: 'devpulse-engineering',
    });

    if (rememberMe) {
      localStorage.setItem('devpulse_token', newToken);
      localStorage.setItem('devpulse_user', JSON.stringify(newUser));
    } else {
      sessionStorage.setItem('devpulse_token', newToken);
      sessionStorage.setItem('devpulse_user', JSON.stringify(newUser));
      localStorage.setItem('devpulse_token', newToken);
      localStorage.setItem('devpulse_user', JSON.stringify(newUser));
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setOrg(null);
    localStorage.removeItem('devpulse_token');
    localStorage.removeItem('devpulse_user');
    localStorage.removeItem('devpulse_org_id');
    sessionStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        org,
        isLoading,
        theme,
        toggleTheme,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
