'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchApi } from './api';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  avatar_url?: string;
  github_username?: string;
}

interface Organization {
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
  login: (token: string, user: User) => void;
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

    // Load auth token & user
    const savedToken = localStorage.getItem('devpulse_token');
    const savedUser = localStorage.getItem('devpulse_user');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      
      // Default demo org
      setOrg({
        id: 'org-demo-id',
        name: 'DevPulse Engineering',
        slug: 'devpulse-engineering',
      });
    } else {
      // Auto demo user fallback for seamless demo review
      const demoUser: User = {
        id: 'user-demo-1',
        email: 'alex.owner@devpulse.io',
        full_name: 'Alex Mercer',
        role: 'OWNER',
        github_username: 'alexmercer',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alexmercer',
      };
      setUser(demoUser);
      setToken('demo-jwt-token-12345');
      setOrg({
        id: 'org-demo-id',
        name: 'DevPulse Engineering',
        slug: 'devpulse-engineering',
      });
    }
    setIsLoading(false);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('devpulse_theme', nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
  };

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('devpulse_token', newToken);
    localStorage.setItem('devpulse_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setOrg(null);
    localStorage.removeItem('devpulse_token');
    localStorage.removeItem('devpulse_user');
    localStorage.removeItem('devpulse_org_id');
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
