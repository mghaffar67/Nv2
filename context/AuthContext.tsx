
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authController } from '../backend_core/controllers/authController';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  phone?: string;
  balance?: number;
  referralCode?: string;
  currentPlan?: string | null;
  planExpiry?: string | null;
  streak?: number;
  lastCheckIn?: string | null;
  withdrawalInfo?: {
    provider: string;
    accountNumber: string;
    accountTitle: string;
  };
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
    const initAuth = () => {
      try {
        const savedUser = localStorage.getItem('noor_user');
        const token = localStorage.getItem('noor_token');
        if (savedUser && token) {
          setUser(JSON.parse(savedUser));
        }
      } catch (e) {
        localStorage.clear();
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const data = await new Promise<any>((resolve, reject) => {
        authController.login({ body: { email, password } }, {
          status: (code: number) => ({
            json: (body: any) => code === 200 ? resolve(body) : reject(body)
          })
        });
      });

      if (data && data.user) {
        localStorage.setItem('noor_token', data.token);
        localStorage.setItem('noor_user', JSON.stringify(data.user));
        setUser(data.user);
        const path = data.user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard';
        navigate(path, { replace: true });
      }
    } catch (error: any) {
      throw new Error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, phone: string, password: string, referralCode?: string) => {
    setLoading(true);
    try {
      const data = await new Promise<any>((resolve, reject) => {
        authController.register({ body: { name, email, phone, password, referralCode } }, {
          status: (code: number) => ({
            json: (body: any) => code === 201 ? resolve(body) : reject(body)
          })
        });
      });
      
      // AUTO-LOGIN Logic
      if (data && data.user) {
        localStorage.setItem('noor_token', data.token);
        localStorage.setItem('noor_user', JSON.stringify(data.user));
        setUser(data.user);
        navigate('/user/dashboard', { replace: true });
      }
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
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
    const keys = ['noor_user', 'noor_token', 'noor_auth_expiry', 'noor_session_meta'];
    keys.forEach(k => localStorage.removeItem(k));
    setUser(null);
    navigate('/', { replace: true });
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
