import React, { createContext, useContext, useState, useLayoutEffect, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'manager';
  phone: string;
  balance: number;
  referralCode: string;
  currentPlan: string | null;
  avatar?: string;
  lastCheckIn?: string;
  streak?: number;
  isBanned?: boolean;
  workSubmissions?: any[];
  transactions?: any[];
  planExpiry?: string;
  purchaseHistory?: any[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, phone: string, password: string, referralCode?: string) => Promise<void>;
  demoLogin: (role: 'user' | 'admin') => Promise<void>;
  logout: () => void;
  syncUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const syncUser = async () => {
    const token = localStorage.getItem('noor_token');
    const cachedUserStr = localStorage.getItem('noor_user');
    
    if (token && cachedUserStr) {
      try {
        // First try to get fresh data from API
        const res = await api.get('/auth/me');
        if (res && res.user) {
          localStorage.setItem('noor_user', JSON.stringify(res.user));
          setUser(res.user);
        } else {
          // Fallback to cache if API fails
          setUser(JSON.parse(cachedUserStr));
        }
      } catch (e) {
        console.warn("Identity sync from API failed, using cache.");
        setUser(JSON.parse(cachedUserStr));
      }
    }
  };

  useLayoutEffect(() => {
    syncUser().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    // Listen for global database updates to refresh auth state
    window.addEventListener('noor_db_update', syncUser);
    return () => window.removeEventListener('noor_db_update', syncUser);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const data = await api.post('/auth/login', { email: email.trim(), password });
      
      if (data && data.token && data.user) {
        localStorage.setItem('noor_token', data.token);
        localStorage.setItem('noor_user', JSON.stringify(data.user));
        setUser(data.user);
        
        const target = data.user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard';
        setLoading(false);
        navigate(target, { replace: true });
      }
    } catch (error: any) {
      setLoading(false);
      throw new Error(error.message || 'Identity verification failed.');
    }
  };

  const register = async (name: string, email: string, phone: string, password: string, referralCode?: string) => {
    setLoading(true);
    try {
      const data = await api.post('/auth/register', { name, email, phone, password, referralCode });
      if (data && data.token && data.user) {
        localStorage.setItem('noor_token', data.token);
        localStorage.setItem('noor_user', JSON.stringify(data.user));
        setUser(data.user);
        setLoading(false);
        navigate('/user/dashboard', { replace: true });
      }
    } catch (error: any) {
      setLoading(false);
      throw new Error(error.message || 'Account creation failed.');
    }
  };

  const demoLogin = async (role: 'user' | 'admin') => {
    const email = role === 'admin' ? 'admin@noor.com' : 'ghaffar@mail.com';
    const password = role === 'admin' ? 'admin123' : 'user123';
    await login(email, password);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('noor_token');
    localStorage.removeItem('noor_user');
    navigate('/login', { replace: true });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, demoLogin, logout, syncUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};