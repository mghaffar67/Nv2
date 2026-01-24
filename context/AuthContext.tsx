
import React, { createContext, useContext, useState, useLayoutEffect } from 'react';
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

  // STABLE SESSION RESTORATION
  useLayoutEffect(() => {
    const token = localStorage.getItem('noor_token');
    const savedUser = localStorage.getItem('noor_user');
    
    if (token && savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
      } catch (e) {
        console.error("Session corrupted detected. Purging.");
        localStorage.removeItem('noor_token');
        localStorage.removeItem('noor_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const data = await api.post('/auth/login', { email: email.trim(), password });
      
      if (data && data.token && data.user) {
        // 1. SAVE TO STORAGE FIRST
        localStorage.setItem('noor_token', data.token);
        localStorage.setItem('noor_user', JSON.stringify(data.user));
        
        // 2. UPDATE REACT STATE
        setUser(data.user);
        
        // 3. NAVIGATE AFTER STATE IS COMMITTED
        const target = data.user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard';
        
        setLoading(false);
        navigate(target, { replace: true });
      } else {
        throw new Error("Invalid response from auth node.");
      }
    } catch (error: any) {
      setLoading(false);
      throw new Error(error.message || 'Login failed.');
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
      throw new Error(error.message || 'Identity creation failed.');
    }
  };

  const demoLogin = async (role: 'user' | 'admin') => {
    const email = role === 'admin' ? 'admin@noor.com' : 'user@noor.com';
    const password = role === 'admin' ? 'admin123' : 'user123';
    await login(email, password);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('noor_token');
    localStorage.removeItem('noor_user');
    navigate('/', { replace: true }); // Logout to Landing
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
