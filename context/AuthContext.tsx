
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  phone: string;
  balance: number;
  referralCode: string;
  currentPlan: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, phone: string, password: string, referralCode?: string) => Promise<void>;
  demoLogin: (role: 'user' | 'admin') => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('noor_user');
    const token = localStorage.getItem('noor_token');
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const data = await api.post('/auth/login', { email, password });
      if (data && data.token && data.user) {
        localStorage.setItem('noor_token', data.token);
        localStorage.setItem('noor_user', JSON.stringify(data.user));
        setUser(data.user);
        
        // Immediate redirect based on role
        const target = data.user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard';
        navigate(target, { replace: true });
      }
    } catch (error: any) {
      throw new Error(error.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, phone: string, password: string, referralCode?: string) => {
    setLoading(true);
    try {
      const data = await api.post('/auth/register', { name, email, phone, password, referralCode });
      if (data && data.token) {
        localStorage.setItem('noor_token', data.token);
        localStorage.setItem('noor_user', JSON.stringify(data.user));
        setUser(data.user);
        navigate('/user/dashboard', { replace: true });
      }
    } catch (error: any) {
      throw new Error(error.message || 'Registry failed.');
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async (role: 'user' | 'admin') => {
    const email = role === 'admin' ? 'admin@noor.com' : 'user@noor.com';
    const password = role === 'admin' ? 'admin123' : 'user123';
    await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem('noor_user');
    localStorage.removeItem('noor_token');
    setUser(null);
    navigate('/login', { replace: true });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, demoLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
