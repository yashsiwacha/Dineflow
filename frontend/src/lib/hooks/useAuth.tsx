'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../api';

export interface UserSession {
  token: string;
  email: string;
  fullName: string;
  role: 'CUSTOMER' | 'STAFF' | 'KITCHEN' | 'ADMIN';
}

interface AuthContextType {
  user: UserSession | null;
  login: (email: string, password: String) => Promise<UserSession>;
  registerUser: (email: string, password: String, fullName: string, phone: string, role?: string) => Promise<any>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('dineflow_token');
    const email = localStorage.getItem('dineflow_email');
    const fullName = localStorage.getItem('dineflow_fullname');
    const role = localStorage.getItem('dineflow_role');

    if (token && email && fullName && role) {
      setUser({
        token,
        email,
        fullName,
        role: role as any
      });
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: String): Promise<UserSession> => {
    const data = await apiRequest<UserSession>('/auth/login', 'POST', { email, password });
    
    localStorage.setItem('dineflow_token', data.token);
    localStorage.setItem('dineflow_email', data.email);
    localStorage.setItem('dineflow_fullname', data.fullName);
    localStorage.setItem('dineflow_role', data.role);

    setUser(data);
    return data;
  };

  const registerUser = async (email: string, password: String, fullName: string, phone: string, role = 'CUSTOMER') => {
    return await apiRequest('/auth/register', 'POST', {
      email,
      password,
      fullName,
      phone,
      role
    });
  };

  const logout = () => {
    localStorage.removeItem('dineflow_token');
    localStorage.removeItem('dineflow_email');
    localStorage.removeItem('dineflow_fullname');
    localStorage.removeItem('dineflow_role');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, registerUser, logout, loading }}>
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
